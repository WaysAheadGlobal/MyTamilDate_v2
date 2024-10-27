import { Router } from "express";
import { UserRequest } from "../../../types/types";
import { verifyUser } from "../../../middleware/verifyUser";
import { db } from "../../../../db/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { query, validationResult } from "express-validator";
import { io } from "../../..";
import { checkPremium, getUnsubscribedGroups } from "../../../utils/utils";
import MailService from "../../../../mail";
import { UnsubscribeGroup } from "../../../enums/UnsubscribeGroupEnum";
import { Server } from "socket.io";
import { Request, Response } from 'express';

const matches = Router();

const mailService = new MailService();

matches.use(verifyUser);

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

const handleNewMatch = async (userId: string, personId: string, io: Server, req: Request, res: Response) => {
    try {
        // Check if a mutual match exists
        const [matches] = await db.promise().query<RowDataPacket[]>(`
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
            const [userDetails1] = await db.promise().query<RowDataPacket[]>(`
               SELECT first_name, user_id
               FROM user_profiles
               WHERE user_id = ?
            `, [userId]);

            const [userDetails2] = await db.promise().query<RowDataPacket[]>(`
               SELECT first_name, user_id
               FROM user_profiles
               WHERE user_id = ?
            `, [personId]);

            // Fetch media details for both users
            // Fetch media details for the first user
            const [mediaResult1] = await db.promise().query<RowDataPacket[]>(`
    SELECT id, hash, extension, type
    FROM media
    WHERE user_id = ? AND type IN (1, 31)
`, [userId]);

            // Fetch media details for the second user
            const [mediaResult2] = await db.promise().query<RowDataPacket[]>(`
    SELECT id, hash, extension, type
    FROM media
    WHERE user_id = ? AND type IN (1, 31)
`, [personId]);



            // Notify both users via socket with media details
            io.to(userId).emit('new-match', { withUserIdP: personId, userDetailsP: userDetails2[0], mediaP: mediaResult2, withUserIdU: userId, userDetailsU: userDetails1[0], mediaU: mediaResult1 });
            io.to(personId).emit('new-match', { withUserIdU: personId, userDetailsU: userDetails2[0], mediaU: mediaResult2, withUserIdP: userId, userDetailsP: userDetails1[0], mediaP: mediaResult1 });


            console.log(userDetails1[0], userDetails2[0], mediaResult1, mediaResult2)

        }
    } catch (err) {
        console.error(err);
        // Ensure that any error response is sent only once
        if (!res.headersSent) {
            return res.status(500).send({ message: "Internal server error" });
        }
    }
};


matches.get(
    "/",
    query("page").optional().isInt({ min: 1 }),
    (req: UserRequest, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const userId = req.userId;
        const limit = 20;
        const page = req.query.page ? parseInt(req.query.page as string) : 1;

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

        db.query<RowDataPacket[]>(query, [userId, limit, limit * (page - 1)], (err, result) => {
            if (err) {
                res.status(500).send("Failed to get matches");
                return;
            }

            res.status(200).send(result);
        });
    }
);

matches.get(
    "/likes/sent",
    query("page").optional().isInt({ min: 1 }),
    async (req: UserRequest, res) => {
        const errors = validationResult(req);
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
        const page = req.query.page ? parseInt(req.query.page as string) : 1;

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

        db.query<RowDataPacket[]>(query, [userId, limit, limit * (page - 1)], (err, result) => {
            if (err) {
                res.status(500).send("Failed to get likes");
                return;
            }

            res.status(200).send(result);
        });
    }
);

matches.get(
    "/likes/received",
    query("page").optional().isInt({ min: 1 }),
    async (req: UserRequest, res) => {
        const errors = validationResult(req);
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
        const page = req.query.page ? parseInt(req.query.page as string) : 1;

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

        db.query<RowDataPacket[]>(query, [userId, limit, limit * (page - 1)], (err, result) => {
            if (err) {
                res.status(500).send("Failed to get likes");
                return;
            }

            res.status(200).send(result);
        });
    }
);
matches.get("/check-match/:participantId", (req: UserRequest, res) => {
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

    db.query<RowDataPacket[]>(query, [userId, participantId], (err, result) => {
        if (err) {
            res.status(500).send("Failed to check match");
            return;
        }

        if (result.length > 0) {
            res.status(200).send({ isMatch: true });
        } else {
            res.status(200).send({ isMatch: false });
        }
    });
});




matches.get("/skipped", (req: UserRequest, res) => {
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

    db.query<RowDataPacket[]>(query, [userId, userId], (err, result) => {
        if (err) {
            res.status(500).send("Failed to get skipped");
            return;
        }

        res.status(200).send(result);
    });
});


matches.get("/blocked", (req: UserRequest, res) => {
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

    db.query<RowDataPacket[]>(query, [userId], (err, result) => {
        if (err) {
            res.status(500).send("Failed to get skipped");
            return;
        }

        res.status(200).send(result);
    });
});

matches.post("/block", (req: UserRequest, res) => {
    const userId = req.userId;
    const personId = req.body.personId;

    const query = "INSERT INTO blocks(user_id, person_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())";

    db.query<ResultSetHeader>(query, [userId, personId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to block person");
            return;
        }

        io.to(userId!).emit("block", { personId: personId });
        res.status(200).json({ message: "Person blocked" });
    });
});

matches.post("/unblock", (req: UserRequest, res) => {
    const userId = req.userId;
    const personId = req.body.personId;

    const query = "DELETE FROM blocks WHERE user_id = ? AND person_id = ?";

    db.query<ResultSetHeader>(query, [userId, personId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to unblock person");
            return;
        }

        if (result.affectedRows > 0) {
            io.to(userId!).emit("unblock", { personId: personId });
            res.status(200).json({ message: "Person unblocked" });
        } else {
            res.status(404).json({ message: "Block not found" });
        }
    });
});


matches.get("/unmatch-reasons", (req: UserRequest, res) => {
    const query = "SELECT id, name FROM unmatches";

    db.query<RowDataPacket[]>(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to get unmatch reasons");
            return;
        }

        res.status(200).send(result);
    });
});

matches.post("/unmatch", (req: UserRequest, res) => {
    const userId = req.userId;
    const personId = req.body.personId;
    const unmatchId = req.body.unmatchId;

    db.beginTransaction(err => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to unmatch person");
            return;
        }

        db.query<RowDataPacket[]>(`
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

            db.query<ResultSetHeader>(query, [userId, matchId, unmatchId], (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Failed to block person");
                    return;
                }

                db.commit(err => {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Failed to block person");
                        return;
                    }

                    io.to(userId!).emit("block", { personId: personId });
                    res.status(200).json({ message: "Person unmatched" });
                })
            });
        });
    });
});

matches.get("/report-reasons", (req: UserRequest, res) => {
    const query = "SELECT id, reason_type as name FROM report_reason_types";

    db.query<RowDataPacket[]>(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to get report reasons");
            return;
        }

        res.status(200).send(result);
    });
});


matches.post("/report", (req: UserRequest, res) => {
    const userId = req.userId;
    const personId = req.body.personId;
    const reportId = req.body.reportId;

    const query = "INSERT INTO reports(user_id, person_id, reason_id, approval, created_at, updated_at) VALUES (?, ?, ?, 0, NOW(), NOW())";

    db.query<ResultSetHeader>(query, [userId, personId, reportId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to block person");
            return;
        }

        io.to(userId!).emit("block", { personId: personId });
        res.status(200).json({ message: "Person blocked" });
    });
});

const getImageURL = (type: number, hash: string, extension: string, userId: string) => type === 1 ? `https://data.mytamildate.com/storage/public/uploads/user/${userId}/avatar/${hash}-large.${extension}` : `${process.env.API_URL}media/avatar/${hash}.${extension}`;

matches.post("/like", (req: UserRequest, res) => {
    const userId = req.userId;
    const personId = req.body.personId;

    const query = "INSERT INTO matches(user_id, person_id, skip, `like`, created_at, updated_at) VALUES (?, ?, 0, 1, NOW(), NOW())";

    db.query<ResultSetHeader>(query, [userId, personId], async (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to like person");
            return;
        }

        try {
            const unsubscribeGroupMe = await getUnsubscribedGroups(parseInt(userId!));
            const unsubscribeGroupThem = await getUnsubscribedGroups(parseInt(personId));

            const [user] = await db.promise().query<RowDataPacket[]>("SELECT email, first_name FROM user_profiles WHERE user_id = ?", [personId]);

            if (!unsubscribeGroupThem.includes(UnsubscribeGroup.LIKES)) {
                const [media] = await db.promise().query<RowDataPacket[]>('SELECT hash, extension, type FROM media WHERE user_id = ? AND type IN (1, 31)', [userId]);
                await mailService.sendLikeMail(
                    user[0].email,
                    req.user?.first_name,
                    getImageURL(media[0].type, media[0].hash, media[0].extension, userId!)
                );
            }

            if (!unsubscribeGroupMe.includes(UnsubscribeGroup.MATCHES)) {
                const [match] = await db.promise().query<RowDataPacket[]>(`
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
                    ) AND m1.person_id = ?;`,
                    [userId, personId]
                );

                if (match.length > 0) {
                    try {
                        // Call the handleNewMatch function to check for and notify mutual matches
                        await handleNewMatch(userId!, personId, io, req, res);
                        console.log("new Match");
                        await mailService.sendMatchesMail(
                            user[0].email,
                            `${req.user?.first_name} also likes you ${user[0].first_name}!`,
                            `Message ${req.user?.first_name}`
                        );
                        return;
                    } catch (err) {
                        console.log(err);
                    }

                }
            }
        } catch (err) {
            console.log(err);
        }

        res.status(200).json({ message: "Person liked" });
    });
});

matches.post("/skip", (req: UserRequest, res) => {
    const userId = req.userId;
    const personId = req.body.personId;

    const query = "INSERT INTO discovery_skip(user_id, person_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())";

    db.query<ResultSetHeader>(query, [userId, personId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to skip person");
            return;
        }

        res.status(200).json({ message: "Person skipped" });
    });
});

matches.post("/undo", (req: UserRequest, res) => {
    const userId = req.userId;

    db.beginTransaction(err => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to undo");
            db.rollback((err) => {
                if (err) {
                    console.log(err);
                }
            });
            return;
        }

        db.query<RowDataPacket[]>("SELECT person_id FROM discovery_skip WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", [userId], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Failed to undo");
                db.rollback((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                return;
            }

            if (result.length === 0) {
                res.status(404).send("No skips found");
                db.rollback((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                return;
            }

            const personId = result[0].person_id;

            db.query<ResultSetHeader>("DELETE FROM discovery_skip WHERE user_id = ? AND person_id = ?", [userId, personId], (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Failed to undo");
                    db.rollback((err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    return;
                }

                db.query<RowDataPacket[]>("SELECT up.id, up.user_id, up.first_name, up.last_name, up.location_id, up.birthday, up.created_at, j.name as job, l.location_string, l.country, m.hash, m.extension, m.type FROM user_profiles up INNER JOIN jobs j ON j.id = up.job_id INNER JOIN locations l ON l.id = up.location_id INNER JOIN media m ON m.user_id = up.user_id WHERE up.user_id = ? AND m.type IN (1, 31)", [personId], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Failed to undo");
                        db.rollback((err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        return;
                    }

                    db.commit(err => {
                        if (err) {
                            console.log(err);
                            res.status(500).send("Failed to undo");
                            db.rollback((err) => {
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
    })
});

matches.get("/chat/sent", (req: UserRequest, res) => {
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

    db.query<RowDataPacket[]>(query, params, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to get sent conversations");
            return;
        }

        res.status(200).send(result);
    });
});

matches.get("/chat/received_", (req: UserRequest, res) => {
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

    db.query<RowDataPacket[]>(query, params, async (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to get received conversations");
            return;
        }

        res.status(200).send(result);
    });
});

export default matches;