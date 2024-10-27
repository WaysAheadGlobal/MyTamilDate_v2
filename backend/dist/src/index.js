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
exports.io = void 0;
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socket_io_1 = require("socket.io");
const db_1 = require("../db/db");
const mail_1 = __importDefault(require("../mail"));
const api_1 = __importDefault(require("./api"));
const utils_1 = require("./utils/utils");
const UnsubscribeGroupEnum_1 = require("./enums/UnsubscribeGroupEnum");
const mail_2 = require("./sendgrip/mail");
require("./weeklyMailSender");
const mailService = new mail_1.default();
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", api_1.default);
app.use("/mail-check", mail_2.Sendmail);
const httpServer = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
    }
});
app.get("/hallo", (req, res) => {
    return res.send("api called");
});
exports.io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return next(new Error('Authentication error'));
    }
    socket.handshake.auth.userId = decoded.userId;
    next();
});
exports.io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("connect to the socket2");
    console.log('a user connected', socket.handshake.auth.userId);
    socket.join(socket.handshake.auth.userId);
    yield db_1.db.promise().query('UPDATE users SET is_online = 1 WHERE id = ?', [socket.handshake.auth.userId]);
    socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('user disconnected');
        yield db_1.db.promise().query('UPDATE users SET is_online = 0 WHERE id = ?', [socket.handshake.auth.userId]);
    }));
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log('user joined room:', roomId);
    });
    socket.on("leave-room", (roomId) => {
        socket.leave(roomId);
        console.log('user left room:', roomId);
    });
    socket.on('send-message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, message, sentAt, type, recepientId }) {
        const senderId = socket.handshake.auth.userId;
        db_1.db.query('INSERT INTO dncm_messages (type, version, conversation_id, sender_id, body, sent_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [type, 1, roomId, senderId, message, Date.now(), Date.now(), 0], (err, results) => {
            if (err) {
                console.log('Error sending message:', err);
                return;
            }
            socket.emit('fetch-messages', { fetch: true });
            exports.io.to(recepientId).emit('fetch-messages', { fetch: true });
            socket.to(roomId).emit('receive-message', message);
        });
        try {
            const unsubscribeGroup = yield (0, utils_1.getUnsubscribedGroups)(recepientId);
            const [data] = yield db_1.db.promise().query('SELECT is_online FROM users WHERE id = ?', [recepientId]);
            const [blocks] = yield db_1.db.promise().query('SELECT id FROM blocks WHERE user_id = ? AND person_id = ?', [recepientId, senderId]);
            const [reports] = yield db_1.db.promise().query('SELECT id FROM reports WHERE user_id = ? AND person_id = ?', [recepientId, senderId]);
            if (!data[0].is_online && !unsubscribeGroup.includes(UnsubscribeGroupEnum_1.UnsubscribeGroup.MESSAGES) && !blocks.length && !reports.length) {
                try {
                    const [user] = yield db_1.db.promise().query('SELECT first_name, email FROM user_profiles WHERE user_id = ?', [recepientId]);
                    const [me] = yield db_1.db.promise().query('SELECT first_name FROM user_profiles WHERE user_id = ?', [socket.handshake.auth.userId]);
                    yield mailService.sendMessageMail(user[0].email, me[0].first_name);
                }
                catch (error) {
                    console.log('Error sending message mail:', error);
                }
            }
        }
        catch (error) {
            console.log('Error sending message mail:', error);
        }
    }));
}));
httpServer.listen(PORT, () => {
    db_1.db.connect((err) => {
        if (err) {
            console.log('Error connecting to DB:', err);
            return;
        }
        console.log('Connected to DB!');
    });
    console.log(`Server is running at http://localhost:${PORT}`);
});
