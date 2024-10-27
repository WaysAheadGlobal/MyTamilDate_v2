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
const moment_1 = __importDefault(require("moment"));
const db_1 = require("../../../../db/db");
const ConversationTypeEnum_1 = __importDefault(require("../../../enums/ConversationTypeEnum"));
const MessageTypeEnum_1 = __importDefault(require("../../../enums/MessageTypeEnum"));
const verifyUser_1 = require("../../../middleware/verifyUser");
const utils_1 = require("../../../utils/utils");
const chat = (0, express_1.Router)();
chat.use(verifyUser_1.verifyUser);
chat.post("/request", (req, res) => {
    db_1.db.beginTransaction(err => {
        if (err) {
            db_1.db.rollback((err) => {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            console.log(err);
            res.status(500).send("Failed to begin transaction");
            return;
        }
        db_1.db.query("SELECT * FROM dncm_participants WHERE conversation_id = ?", [req.body.conversationId], (err, result) => {
            if (err) {
                console.log(err);
                db_1.db.rollback((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                res.status(500).send("Failed to check if participant exists");
                return;
            }
            if (result.length > 0 && req.body.conversationId) {
                db_1.db.query("INSERT INTO dncm_messages (type, version, conversation_id, sender_id, `body`, sent_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [MessageTypeEnum_1.default.TEXT, 1, req.body.conversationId, req.userId, req.body.message, Date.now(), Date.now(), 0], (err, result) => {
                    if (err) {
                        console.log(err);
                        db_1.db.rollback((err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        res.status(500).send("Failed to send message");
                        return;
                    }
                    db_1.db.commit(err => {
                        if (err) {
                            console.log(err);
                            db_1.db.rollback((err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            res.status(500).send("Failed to commit transaction");
                            return;
                        }
                        res.status(200).json({ message: "Conversation Added" });
                    });
                });
            }
            else {
                db_1.db.query("INSERT INTO dncm_conversations (type, owner_id, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", [ConversationTypeEnum_1.default.PRIVATE, req.userId, req.userId, Date.now(), Date.now()], (err, result) => {
                    if (err) {
                        console.log(err);
                        db_1.db.rollback((err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        res.status(500).send("Failed to create conversation");
                        return;
                    }
                    const conversationId = result.insertId;
                    db_1.db.query("INSERT INTO dncm_participants (conversation_id, participant_id, joined_at, read_at, muted_at) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)", [
                        conversationId, req.userId, Date.now(), Date.now(), 0,
                        conversationId, req.body.participantId, 0, 0, 0
                    ], (err, result) => {
                        if (err) {
                            console.log(err);
                            db_1.db.rollback((err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            res.status(500).send("Failed to add participant");
                            return;
                        }
                        db_1.db.query("INSERT INTO dncm_messages (type, version, conversation_id, sender_id, `body`, sent_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [MessageTypeEnum_1.default.TEXT, 1, conversationId, req.userId, req.body.message, Date.now(), Date.now(), 0], (err, result) => {
                            if (err) {
                                console.log(err);
                                db_1.db.rollback((err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                                res.status(500).send("Failed to send message");
                                return;
                            }
                            db_1.db.commit(err => {
                                if (err) {
                                    console.log(err);
                                    db_1.db.rollback((err) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    });
                                    res.status(500).send("Failed to commit transaction");
                                    return;
                                }
                                res.status(200).json({ message: "Conversation started", conversationId });
                            });
                        });
                    });
                });
            }
        });
    });
});
/*
    This endpoint first checks whether a conversation exists between the two users. If it does, it returns the conversation id else it creates a new conversation and returns the conversation id.
*/
chat.post("/create-room", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { participantId } = req.body;
    const isPremium = yield (0, utils_1.checkPremium)(req.userId);
    if (!isPremium) {
        res.status(403).send("You need to be a premium user to start a conversation");
        return;
    }
    db_1.db.beginTransaction(err => {
        if (err) {
            db_1.db.rollback((err) => {
                if (err) {
                    console.log(err);
                }
            });
            console.log(err);
            res.status(500).send("Failed to begin transaction");
            return;
        }
        db_1.db.query("SELECT dp1.conversation_id FROM dncm_participants dp1 JOIN dncm_participants dp2 ON dp2.conversation_id = dp1.conversation_id WHERE dp1.participant_id = ? AND dp2.participant_id = ?", [req.userId, participantId], (err, result) => {
            if (err) {
                console.log(err);
                db_1.db.rollback((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                res.status(500).send("Failed to check if conversation exists");
                return;
            }
            if (result.length === 0) {
                db_1.db.query("INSERT INTO dncm_conversations (type, owner_id, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", [ConversationTypeEnum_1.default.PRIVATE, req.userId, req.userId, Date.now(), Date.now()], (err, result) => {
                    if (err) {
                        console.log(err);
                        db_1.db.rollback((err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        res.status(500).send("Failed to create conversation");
                        return;
                    }
                    const conversationId = result.insertId;
                    db_1.db.query("INSERT INTO dncm_participants (conversation_id, participant_id, joined_at, read_at, muted_at) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)", [
                        conversationId, req.userId, Date.now(), Date.now(), 0,
                        conversationId, participantId, 0, 0, 0
                    ], (err) => {
                        if (err) {
                            console.log(err);
                            db_1.db.rollback((err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            res.status(500).send("Failed to add participant");
                            return;
                        }
                        db_1.db.commit(err => {
                            if (err) {
                                console.log(err);
                                db_1.db.rollback((err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                                res.status(500).send("Failed to commit transaction");
                                return;
                            }
                            res.status(200).json({ conversationId });
                        });
                    });
                });
            }
            else {
                db_1.db.commit(err => {
                    if (err) {
                        console.log(err);
                        db_1.db.rollback((err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        res.status(500).send("Failed to commit transaction");
                        return;
                    }
                    res.status(200).json({ conversationId: result[0].conversation_id });
                });
            }
        });
    });
}));
chat.get("/get-messages/:conversationId", (req, res) => {
    const conversationId = req.params.conversationId;
    db_1.db.query("SELECT *, `body` as message, IF (sender_id = ?, 'you', 'other') as sender FROM dncm_messages WHERE conversation_id = ? ORDER BY sent_at ASC;", [req.userId, conversationId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to get messages");
            return;
        }
        const messages = result.reduce((acc, message) => {
            const date = (0, moment_1.default)(message.sent_at).format("YYYY-MM-DD");
            const time = (0, moment_1.default)(message.sent_at).format("hh:mm A");
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(Object.assign(Object.assign({}, message), { time,
                date, type: MessageTypeEnum_1.default[message.type] }));
            return acc;
        }, {});
        res.status(200).json(messages);
    });
});
chat.get("/get-conversations", (req, res) => {
    const limit = req.query.limit;
    console.log(limit);
    let query = `
        WITH conversations as (
            SELECT
                up.user_id,
                up.first_name,
                up.last_name,
                m.hash,
                m.type,
                m.extension,
                (
                    SELECT 
                        dp2.participant_id 
                    FROM 
                        dncm_participants dp2 
                    WHERE 
                        dp2.conversation_id = dp.conversation_id 
                        AND dp2.participant_id != ?
                ) as participant_id,
                (
                    SELECT 
                        dm.\`body\` 
                    FROM 
                        dncm_messages dm 
                    WHERE 
                        dm.conversation_id = dp.conversation_id
                        AND dm.\`body\` IS NOT NULL  
                        ORDER BY dm.sent_at DESC 
                        LIMIT 1
                ) as message,
                (
                    SELECT 
                        dm.sent_at 
                    FROM 
                        dncm_messages dm 
                    WHERE 
                    dm.conversation_id = dp.conversation_id 
                    AND dm.\`body\` IS NOT NULL 
                    ORDER BY dm.sent_at DESC 
                    LIMIT 1
                ) as sent_at,
                dp.conversation_id 
            FROM 
                dncm_participants dp
                INNER JOIN user_profiles up ON up.user_id IN (
                    SELECT 
                        dp2.participant_id 
                    FROM 
                        dncm_participants dp2 
                    WHERE dp2.conversation_id = dp.conversation_id 
                        AND dp2.participant_id != ?
                )
                INNER JOIN media m ON m.user_id = up.user_id
            WHERE dp.participant_id = ? 
                AND m.type IN (1, 31) 
                AND up.user_id NOT IN (
                    SELECT b.person_id
                    FROM blocks b
                    WHERE b.user_id = dp.participant_id
                ) 
                AND up.user_id NOT IN (
                    SELECT ma.person_id
                    FROM user_unmatches um INNER JOIN matches ma ON ma.id = um.match_id 
                    WHERE um.user_id = dp.participant_id
                ) 
                AND up.user_id NOT IN (
                    SELECT r.person_id
                    FROM reports r
                    WHERE r.user_id = dp.participant_id
                )
        )
        SELECT 
            user_id, 
            first_name,
            last_name,
            hash,
            type,
            extension,
            participant_id,
            sent_at,
            IF (LENGTH(message) > 50, CONCAT(SUBSTR(message, 1, 50), '...'), message) as message,
            conversation_id
        FROM 
            conversations 
        WHERE 
            message IS NOT NULL
        ORDER BY sent_at DESC 
    `;
    if (limit && !isNaN(parseInt(limit))) {
        query = query.concat(` LIMIT ${limit}`);
    }
    db_1.db.query(query, [req.userId, req.userId, req.userId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to get conversations");
            return;
        }
        /* io.emit("get-conversations", result); */
        res.status(200).json(result);
    });
});
exports.default = chat;
