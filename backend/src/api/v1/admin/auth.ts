import { Router } from 'express';
import { db } from '../../../../db/db';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { RowDataPacket } from 'mysql2';
dotenv.config();
const adminAuth = Router();
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

// Admin Signup
adminAuth.post('/signup', async (req, res) => {
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
        return res.status(400).json({ message: 'Username, password, and name are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const sql = `INSERT INTO admin_users (username, password, name) VALUES (?, ?, ?)`;
        const values = [username, hashedPassword, name];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.log('Error inserting data:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(201).json({ message: 'User registered successfully!' });
        });
    } catch (err) {
        console.log('Error hashing password:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Admin Login
adminAuth.post('/login', (req, res) => {
    const { username, password, rememberMe } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const sql = `SELECT id, username, password FROM admin_users WHERE username = ?`;
    const values = [username];

    db.query<RowDataPacket[]>(sql, values, (err, results) => {
        if (err) {
            console.log('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.length === 0) {
            res.status(401).json({ message: 'Invalid username or passwordd' });
            return;
        }
        const user = results[0];
        bcrypt.compare(password, user.password, (bcryptErr, isMatch) => {
            if (bcryptErr) {
                console.log('Error comparing passwords:', bcryptErr);
                res.status(500).send('Internal Server Error');
                return;
            }
            if (!isMatch) {
                res.status(401).json({ message: 'Invalid username or passworddd' });
                return;
            }

            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                res.status(500).send('JWT Secret is not defined');
                return;
            }

            const jwt = sign({ username: user.username, adminId: user.id }, jwtSecret, { expiresIn: '30 days' });

            if (rememberMe) {
                const rememberToken = crypto.randomBytes(20).toString('hex');
                const updateTokenSql = `UPDATE admin_users SET remember_token = ? WHERE id = ?`;
                db.query(updateTokenSql, [rememberToken, user.id], (updateErr) => {
                    if (updateErr) {
                        console.log('Error updating remember token:', updateErr);
                        res.status(500).send('Internal Server Error');
                        return;
                    }
                    res.cookie('remember_token', rememberToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true });
                    res.status(200).json({ message: 'Login successful!', token: jwt, rememberToken });
                });
            } else {
                res.status(200).json({ message: 'Login successful!', token: jwt });
            }
        });
    });
});

export default adminAuth;
