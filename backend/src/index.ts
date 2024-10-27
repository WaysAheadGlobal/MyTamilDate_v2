import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import { Server } from "socket.io";
import { db } from '../db/db';
import MailService from '../mail';
import api from './api';
import { RowDataPacket } from 'mysql2';
import { getUnsubscribedGroups } from './utils/utils';
import { UnsubscribeGroup } from './enums/UnsubscribeGroupEnum';
import { Sendmail } from './sendgrip/mail';
import './weeklyMailSender';

const mailService = new MailService();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api", api);
app.use("/mail-check", Sendmail)


const httpServer = createServer(app);
export const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});

app.get("/hallo", (req, res)=>{
  return res.send("api called")
})

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error'));
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded) {
        return next(new Error('Authentication error'));
    }

    socket.handshake.auth.userId = decoded.userId;

    next();
});

io.on('connection', async (socket) => {
  console.log("connect to the socket2");
    console.log('a user connected', socket.handshake.auth.userId);
    socket.join(socket.handshake.auth.userId);
    await db.promise().query('UPDATE users SET is_online = 1 WHERE id = ?', [socket.handshake.auth.userId]);

    socket.on('disconnect', async () => {
        console.log('user disconnected');
        await db.promise().query('UPDATE users SET is_online = 0 WHERE id = ?', [socket.handshake.auth.userId]);
    });

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log('user joined room:', roomId);
    });

    socket.on("leave-room", (roomId) => {
        socket.leave(roomId);
        console.log('user left room:', roomId);
    });

    socket.on('send-message', async ({ roomId, message, sentAt, type, recepientId }) => {
        const senderId = socket.handshake.auth.userId;

        db.query('INSERT INTO dncm_messages (type, version, conversation_id, sender_id, body, sent_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [type, 1, roomId, senderId, message, Date.now(), Date.now(), 0], (err, results) => {
            if (err) {
                console.log('Error sending message:', err);
                return;
            }

 socket.emit('fetch-messages', { fetch: true });
            io.to(recepientId).emit('fetch-messages', { fetch: true });
            socket.to(roomId).emit('receive-message', message);
        });

        try {
            const unsubscribeGroup = await getUnsubscribedGroups(recepientId);
            const [data] = await db.promise().query<RowDataPacket[]>('SELECT is_online FROM users WHERE id = ?', [recepientId]);
            const [blocks] = await db.promise().query<RowDataPacket[]>('SELECT id FROM blocks WHERE user_id = ? AND person_id = ?', [recepientId, senderId]);
            const [reports] = await db.promise().query<RowDataPacket[]>('SELECT id FROM reports WHERE user_id = ? AND person_id = ?', [recepientId, senderId]);


            if (!data[0].is_online && !unsubscribeGroup.includes(UnsubscribeGroup.MESSAGES) && !blocks.length && !reports.length) {
                try {
                    const [user] = await db.promise().query<RowDataPacket[]>('SELECT first_name, email FROM user_profiles WHERE user_id = ?', [recepientId]);

                    const [me] = await db.promise().query<RowDataPacket[]>('SELECT first_name FROM user_profiles WHERE user_id = ?', [socket.handshake.auth.userId]);

                    await mailService.sendMessageMail(user[0].email, me[0].first_name);
                } catch (error) {
                    console.log('Error sending message mail:', error);
                }
            }
        } catch (error) {            console.log('Error sending message mail:', error);
        }
    });
});

httpServer.listen(PORT, () => {
    db.connect((err) => {
        if (err) {
            console.log('Error connecting to DB:', err);
            return;
        }
        console.log('Connected to DB!');
    });
    console.log(`Server is running at http://localhost:${PORT}`);
});