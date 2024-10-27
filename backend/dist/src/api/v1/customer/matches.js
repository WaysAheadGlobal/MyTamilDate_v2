"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyUser_1 = require("../../../middleware/verifyUser");
const db_1 = require("../../../../db/db");
const express_validator_1 = require("express-validator");
const __1 = require("../../..");
const utils_1 = require("../../../utils/utils");
const mail_1 = __importDefault(require("../../../../mail"));
const UnsubscribeGroupEnum_1 = require("../../../enums/UnsubscribeGroupEnum");
const matches = (0, express_1.Router)();
const mailService = new mail_1.default();
matches.use(verifyUser_1.verifyUser);
// const handleNewMatch = async (userId: string, personId: string, io: Server) => {
//     // Check if a mutual match exists
//     const [match] = await db.promise().query<RowDataPacket[]>(`
//         SELECT 
//             m1.person_id
//         FROM 
//             matches m1 
//         WHERE 
//             m1.user_id = ? 
//             AND m1.\`like\` = 1 
//             AND m1.person_id IN (
//                 SELECT 
//                     m2.user_id 
//                 FROM 
//                     matches m2 
//                 WHERE
//                     m2.person_id = m1.user_id
//             ) AND m1.person_id = ?;
//     `, [userId, personId]);
//     if (match.length > 0) {
//         // **A mutual match has occurred**
//         // **Notify both users via socket**
//         io.to(userId).emit('new-match', { withUserId: personId });
//         io.to(personId).emit('new-match', { withUserId: userId });
//         // Optionally, add additional logic like sending emails here
//     }
// };
const handleNewMatch = (userId, personId, io, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if a mutual match exists
        const [matches] = yield db_1.db.promise().query(`
            SELECT m1.person_id
            FROM matches m1 
            WHERE m1.user_id = ? 
              AND m1.\`like\` = 1 
              AND m1.person_id IN (
                  SELECT m2.user_id 
                  FROM matches m2 
                  WHERE m2.person_id = m1.user_id
              ) AND m1.person_id = ?;
        `, [userId, personId]);
        if (Array.isArray(matches) && matches.length > 0) {
            // **A mutual match has occurred**
            // Fetch user details for both users
            const [userDetails1] = yield db_1.db.promise().query(`
               SELECT first_name, user_id
               FROM user_profiles
               WHERE user_id = ?
            `, [userId]);
            const [userDetails2] = yield db_1.db.promise().query(`
               SELECT first_name, user_id
               FROM user_profiles
               WHERE user_id = ?
            `, [personId]);
            // Fetch media details for both users
            // Fetch media details for the first user
            const [mediaResult1] = yield db_1.db.promise().query(`
    SELECT id, hash, extension, type
    FROM media
    WHERE user_id = ? AND type IN (1, 31)
`, [userId]);
            // Fetch media details for the second user
            const [mediaResult2] = yield db_1.db.promise().query(`
    SELECT id, hash, extension, type
    FROM media
    WHERE user_id = ? AND type IN (1, 31)
`, [personId]);
            // Notify both users via socket with media details
            io.to(userId).emit('new-match', { withUserIdP: personId, userDetailsP: userDetails2[0], mediaP: mediaResult2, withUserIdU: userId, userDetailsU: userDetails1[0], mediaU: mediaResult1 });
            io.to(personId).emit('new-match', { withUserIdU: personId, userDetailsU: userDetails2[0], mediaU: mediaResult2, withUserIdP: userId, userDetailsP: userDetails1[0], mediaP: mediaResult1 });
            console.log(userDetails1[0], userDetails2[0], mediaResult1, mediaResult2);
        }
    }
    catch (err) {
        console.error(err);
        // Ensure that any error response is sent only once
        if (!res.headersSent) {
            return res.status(500).send({ message: "Internal server error" });
        }
    }
});
matches.get("/", (0, express_validator_1.query)("page").optional().isInt({ min: 1 }), (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const userId = req.userId;
    const limit = 20;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const query = `
        SELECT
            up.user_id,
            up.first_name,
            me.hash,
            me.type,
            me.extension
        FROM matches m1
            INNER JOIN user_profiles up ON up.user_id = m1.person_id
            INNER JOIN media me ON me.user_id = up.user_id
        WHERE m1.user_id = ?
            AND me.type IN (1, 31)
            AND m1.skip = 0
            AND m1.\`like\` = 1
            AND person_id IN (
                SELECT m2.user_id
                FROM matches m2
                WHERE m2.person_id = m1.user_id
                    AND m2.skip = 0
                    AND m2.\`like\` = 1
            ) AND m1.person_id NOT IN (
                SELECT b.person_id
                FROM blocks b
                WHERE b.user_id = m1.user_id
            ) AND m1.id NOT IN (
                SELECT um.match_id
                FROM user_unmatches um
                WHERE um.user_id = m1.user_id
            ) AND m1.person_id NOT IN (
                SELECT r.person_id
                FROM reports r
                WHERE r.user_id = m1.user_id
            )
        LIMIT ? OFFSET ?;
        `;
    db_1.db.query(query, [userId, limit, limit * (page - 1)], (err, result) => {
        if (err) {
            res.status(500).send("Failed to get matches");
            return;
        }
        res.status(200).send(result);
    });
});
matches.get("/likes/sent", (0, express_validator_1.query)("page").optional().isInt({ min: 1 }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    // const isPremium = await checkPremium(req.userId!);
    // if (!isPremium) {
    //     res.status(200).json([]);
    //     return;
    // }
    const userId = req.userId;
    const limit = 20;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const query = `
        SELECT 
            up.user_id,
            up.first_name, 
            up.last_name,
            l.country,
            j.name as job,
            me.hash,
            me.type,
            me.extension
        FROM matches m
            INNER JOIN user_profiles up ON m.person_id = up.user_id
            INNER JOIN locations l ON l.id = up.location_id
            INNER JOIN jobs j ON j.id = up.job_id
            INNER JOIN media me ON me.user_id = up.user_id
        WHERE m.\`like\` = 1 AND m.skip = 0 AND me.type IN (1, 31) AND m.user_id = ?
        LIMIT ? OFFSET ?;
        `;
    db_1.db.query(query, [userId, limit, limit * (page - 1)], (err, result) => {
        if (err) {
            res.status(500).send("Failed to get likes");
            return;
        }
        res.status(200).send(result);
    });
}));
matches.get("/likes/received", (0, express_validator_1.query)("page").optional().isInt({ min: 1 }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    // const isPremium = await checkPremium(req.userId!);
    // if (!isPremium) {
    //     res.status(200).json([]);
    //     return;
    // }
    const userId = req.userId;
    const limit = 160;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const query = `
        SELECT 
            up.user_id,
            up.first_name, 
            up.last_name,
            l.country,
            j.name as job,
            me.hash,
            me.type,
            me.extension
        FROM matches m
            INNER JOIN user_profiles up ON m.user_id = up.user_id
            INNER JOIN locations l ON l.id = up.location_id
            INNER JOIN jobs j ON j.id = up.job_id
            INNER JOIN media me ON me.user_id = up.user_id
        WHERE m.\`like\` = 1 AND m.skip = 0 AND me.type IN (1, 31) AND m.person_id = ?
        LIMIT ? OFFSET ?;
        `;
    db_1.db.query(query, [userId, limit, limit * (page - 1)], (err, result) => {
        if (err) {
            res.status(500).send("Failed to get likes");
            return;
        }
        res.status(200).send(result);
    });
}));
matches.get("/check-match/:participantId", (req, res) => {
    const userId = req.userId;
    const participantId = req.params.participantId;
    const query = `
    SELECT 1
    FROM matches m1
    WHERE m1.user_id = ? 
      AND m1.person_id = ?
      AND m1.\`like\` = 1
      AND m1.skip = 0
      AND m1.person_id IN (
        SELECT m2.user_id
        FROM matches m2
        WHERE m2.person_id = m1.user_id
          AND m2.\`like\` = 1
          AND m2.skip = 0
      )
    LIMIT 1;
    `;
    db_1.db.query(query, [userId, participantId], (err, result) => {
        if (err) {
            res.status(500).send("Failed to check match");
            return;
        }
        if (result.length > 0) {
            res.status(200).send({ isMatch: true });
        }
        else {
            res.status(200).send({ isMatch: false });
        }
    });
});
matches.get("/skipped", (req, res) => {
    const userId = req.userId;
    const query = `
        SELECT 
            up.user_id,
            up.first_name,
            up.last_name,
            l.country,
            l.location_string,
            j.name,
            m.type,
            m.hash,
            m.extension
        FROM discovery_skip ds 
            INNER JOIN user_profiles up ON up.user_id = ds.person_id
            INNER JOIN media m ON m.user_id = ds.person_id AND m.type IN (1, 31)
            INNER JOIN locations l ON l.id = up.location_id
            INNER JOIN jobs j on j.id = up.job_id
        WHERE ds.user_id = ? 
        AND ds.person_id NOT IN (
            SELECT person_id 
            FROM matches 
            WHERE \`like\` = 1 AND user_id = ?
        )
        ORDER BY ds.created_at DESC;
    `;
    db_1.db.query(query, [userId, userId], (err, result) => {
        if (err) {
            res.status(500).send("Failed to get skipped");
            return;
        }
        res.status(200).send(result);
    });
});
matches.get("/blocked", (req, res) => {
    const userId = req.userId;
    const query = `
        SELECT 
            up.user_id,
            up.first_name,
            up.last_name,
            l.country,
            l.location_string,
            j.name,
            m.type,
            m.hash,
            m.extension
        FROM blocks b
            INNER JOIN user_profiles up ON up.user_id = b.person_id
            INNER JOIN media m ON m.user_id = b.person_id AND m.type IN (1, 31)
            INNER JOIN locations l ON l.id = up.location_id
            INNER JOIN jobs j on j.id = up.job_id
        WHERE b.user_id = ? ORDER BY b.created_at DESC;
    `;
    db_1.db.query(query, [userId], (err, result) => {
        if (err) {
            res.status(500).send("Failed to get skipped");
            return;
        }
        res.status(200).send(result);
    });
});
matches.post("/block", (req, res) => {
    const userId = req.userId;
    const personId = req.body.personId;
    const query = "INSERT INTO blocks(user_id, person_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())";
    db_1.db.query(query, [userId, personId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to block person");
            return;
        }
        __1.io.to(userId).emit("block", { personId: personId });
        res.status(200).json({ message: "Person blocked" });
    });
});
matches.post("/unblock", (req, res) => {
    const userId = req.userId;
    const personId = req.body.personId;
    const query = "DELETE FROM blocks WHERE user_id = ? AND person_id = ?";
    db_1.db.query(query, [userId, personId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to unblock person");
            return;
        }
        if (result.affectedRows > 0) {
            __1.io.to(userId).emit("unblock", { personId: personId });
            res.status(200).json({ message: "Person unblocked" });
        }
        else {
            res.status(404).json({ message: "Block not found" });
        }
    });
});
matches.get("/unmatch-reasons", (req, res) => {
    const query = "SELECT id, name FROM unmatches";
    db_1.db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to get unmatch reasons");
            return;
        }
        res.status(200).send(result);
    });
});
matches.post("/unmatch", (req, res) => {
    const userId = req.userId;
    const personId = req.body.personId;
    const unmatchId = req.body.unmatchId;
    db_1.db.beginTransaction(err => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to unmatch person");
            return;
        }
        db_1.db.query(`
            SELECT
                m1.id,
                m1.user_id,
                m1.person_id
            FROM matches m1
            WHERE m1.user_id = ? AND m1.person_id = ?
                AND m1.skip = 0
                AND m1.\`like\` = 1
                AND person_id IN (
                    SELECT m2.user_id
                    FROM matches m2
                    WHERE m2.person_id = m1.user_id
                        AND m2.skip = 0
                        AND m2.\`like\` = 1
                ) AND m1.person_id NOT IN (
                    SELECT b.person_id
                    FROM blocks b
                    WHERE b.user_id = m1.user_id
                ) AND m1.id NOT IN (
                    SELECT um.match_id
                    FROM user_unmatches um
                    WHERE um.user_id = m1.user_id
                )
        `, [userId, personId], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Failed to unmatch person");
                return;
            }
            if (result.length === 0) {
                res.status(404).send("No match found");
                return;
            }
            const matchId = result[0].id;
            const query = "INSERT INTO user_unmatches(user_id, match_id, unmatch_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())";
            db_1.db.query(query, [userId, matchId, unmatchId], (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Failed to block person");
                    return;
                }
                db_1.db.commit(err => {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Failed to block person");
                        return;
                    }
                    __1.io.to(userId).emit("block", { personId: personId });
                    res.status(200).json({ message: "Person unmatched" });
                });
            });
        });
    });
});
matches.get("/report-reasons", (req, res) => {
    const query = "SELECT id, reason_type as name FROM report_reason_types";
    db_1.db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to get report reasons");
            return;
        }
        res.status(200).send(result);
    });
});
matches.post("/report", (req, res) => {
    const userId = req.userId;
    const personId = req.body.personId;
    const reportId = req.body.reportId;
    const query = "INSERT INTO reports(user_id, person_id, reason_id, approval, created_at, updated_at) VALUES (?, ?, ?, 0, NOW(), NOW())";
    db_1.db.query(query, [userId, personId, reportId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to block person");
            return;
        }
        __1.io.to(userId).emit("block", { personId: personId });
        res.status(200).json({ message: "Person blocked" });
    });
});
const getImageURL = (type, hash, extension, userId) => type === 1 ? `https://data.mytamildate.com/storage/public/uploads/user/${userId}/avatar/${hash}-large.${extension}` : `${process.env.API_URL}media/avatar/${hash}.${extension}`;
matches.post("/like", (req, res) => {
    const userId = req.userId;
    const personId = req.body.personId;
    const query = "INSERT INTO matches(user_id, person_id, skip, `like`, created_at, updated_at) VALUES (?, ?, 0, 1, NOW(), NOW())";
    db_1.db.query(query, [userId, personId], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        if (err) {
            console.log(err);
            res.status(500).send("Failed to like person");
            return;
        }
        try {
            const unsubscribeGroupMe = yield (0, utils_1.getUnsubscribedGroups)(parseInt(userId));
            const unsubscribeGroupThem = yield (0, utils_1.getUnsubscribedGroups)(parseInt(personId));
            const [user] = yield db_1.db.promise().query("SELECT email, first_name FROM user_profiles WHERE user_id = ?", [personId]);
            if (!unsubscribeGroupThem.includes(UnsubscribeGroupEnum_1.UnsubscribeGroup.LIKES)) {
                const [media] = yield db_1.db.promise().query('SELECT hash, extension, type FROM media WHERE user_id = ? AND type IN (1, 31)', [userId]);
                yield mailService.sendLikeMail(user[0].email, (_a = req.user) === null || _a === void 0 ? void 0 : _a.first_name, getImageURL(media[0].type, media[0].hash, media[0].extension, userId));
            }
            if (!unsubscribeGroupMe.includes(UnsubscribeGroupEnum_1.UnsubscribeGroup.MATCHES)) {
                const [match] = yield db_1.db.promise().query(`
                    SELECT 
                        m1.person_id
                    FROM 
                        matches m1 
                    WHERE 
                        m1.user_id = ? 
                        AND m1.\`like\` = 1 
                        AND m1.person_id IN (
                        SELECT 
                            m2.user_id 
                        FROM 
                            matches m2 
                        WHERE
                            m2.person_id = m1.user_id
                    ) AND m1.person_id = ?;`, [userId, personId]);
                if (match.length > 0) {
                    try {
                        // Call the handleNewMatch function to check for and notify mutual matches
                        yield handleNewMatch(userId, personId, __1.io, req, res);
                        console.log("new Match");
                        yield mailService.sendMatchesMail(user[0].email, `${(_b = req.user) === null || _b === void 0 ? void 0 : _b.first_name} also likes you ${user[0].first_name}!`, `Message ${(_c = req.user) === null || _c === void 0 ? void 0 : _c.first_name}`);
                        return;
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
        }
        res.status(200).json({ message: "Person liked" });
    }));
});
matches.post("/skip", (req, res) => {
    const userId = req.userId;
    const personId = req.body.personId;
    const query = "INSERT INTO discovery_skip(user_id, person_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())";
    db_1.db.query(query, [userId, personId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to skip person");
            return;
        }
        res.status(200).json({ message: "Person skipped" });
    });
});
matches.post("/undo", (req, res) => {
    const userId = req.userId;
    db_1.db.beginTransaction(err => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to undo");
            db_1.db.rollback((err) => {
                if (err) {
                    console.log(err);
                }
            });
            return;
        }
        db_1.db.query("SELECT person_id FROM discovery_skip WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", [userId], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Failed to undo");
                db_1.db.rollback((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                return;
            }
            if (result.length === 0) {
                res.status(404).send("No skips found");
                db_1.db.rollback((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                return;
            }
            const personId = result[0].person_id;
            db_1.db.query("DELETE FROM discovery_skip WHERE user_id = ? AND person_id = ?", [userId, personId], (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Failed to undo");
                    db_1.db.rollback((err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    return;
                }
                db_1.db.query("SELECT up.id, up.user_id, up.first_name, up.last_name, up.location_id, up.birthday, up.created_at, j.name as job, l.location_string, l.country, m.hash, m.extension, m.type FROM user_profiles up INNER JOIN jobs j ON j.id = up.job_id INNER JOIN locations l ON l.id = up.location_id INNER JOIN media m ON m.user_id = up.user_id WHERE up.user_id = ? AND m.type IN (1, 31)", [personId], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Failed to undo");
                        db_1.db.rollback((err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        return;
                    }
                    db_1.db.commit(err => {
                        if (err) {
                            console.log(err);
                            res.status(500).send("Failed to undo");
                            db_1.db.rollback((err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            return;
                        }
                        res.status(200).json({ message: "Undo successful", user: result[0] });
                    });
                });
            });
        });
    });
});
matches.get("/chat/sent", (req, res) => {
    const query = `
        WITH messages as (
            SELECT DISTINCT conversation_id FROM dncm_messages WHERE sender_id = ?
        ) SELECT 
            m.conversation_id,
            dc.owner_id,
            dp.participant_id,
            dp.joined_at,
            CONCAT(up.first_name, ' ', up.last_name) as name,
            dc.created_at
        FROM messages m
        INNER JOIN dncm_conversations dc ON dc.id = m.conversation_id
        INNER JOIN dncm_participants dp ON dp.conversation_id = m.conversation_id
        INNER JOIN user_profiles up ON up.user_id = dp.participant_id
        WHERE dp.participant_id != ? AND dp.joined_at = 0
        ORDER BY dc.created_at DESC;
    `;
    const params = [req.userId, req.userId];
    db_1.db.query(query, params, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to get sent conversations");
            return;
        }
        res.status(200).send(result);
    });
});
matches.get("/chat/received_", (req, res) => {
    const query = `
        WITH received_messages AS (
            SELECT DISTINCT conversation_id, sender_id
            FROM dncm_messages
            WHERE sender_id != ?
        ),
        sent_messages AS (
            SELECT DISTINCT conversation_id
            FROM dncm_messages
            WHERE sender_id = ?
        )
        SELECT
            rm.conversation_id,
            dc.owner_id,
            rm.sender_id,
            CONCAT(up.first_name, ' ', up.last_name) as sender_name,
            dc.created_at,
            me.hash,
            me.extension,
            me.type,
            (
                SELECT body
                FROM dncm_messages dm
                WHERE dm.conversation_id = rm.conversation_id
                ORDER BY dm.sent_at DESC
                LIMIT 1
            ) as last_message_body,
            (
                SELECT sent_at
                FROM dncm_messages dm
                WHERE dm.conversation_id = rm.conversation_id
                ORDER BY dm.sent_at DESC
                LIMIT 1
            ) as last_message_sent_at
        FROM received_messages rm
        INNER JOIN dncm_conversations dc ON dc.id = rm.conversation_id
        INNER JOIN dncm_participants dp ON dp.conversation_id = rm.conversation_id
        INNER JOIN user_profiles up ON up.user_id = rm.sender_id
        INNER JOIN media me ON me.user_id = up.user_id AND me.type IN (1, 31)
        LEFT JOIN sent_messages sm ON sm.conversation_id = rm.conversation_id
        WHERE dp.participant_id = ? AND sm.conversation_id IS NULL
        ORDER BY last_message_sent_at DESC;
    `;
    const params = [req.userId, req.userId, req.userId];
    db_1.db.query(query, params, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to get received conversations");
            return;
        }
        res.status(200).send(result);
    }));
});
exports.default = matches;
