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
const db_1 = require("../../../../db/db");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const adminAuth = (0, express_1.Router)();
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
// Admin Signup
adminAuth.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, name } = req.body;
    if (!username || !password || !name) {
        return res.status(400).json({ message: 'Username, password, and name are required' });
    }
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, saltRounds);
        const sql = `INSERT INTO admin_users (username, password, name) VALUES (?, ?, ?)`;
        const values = [username, hashedPassword, name];
        db_1.db.query(sql, values, (err, result) => {
            if (err) {
                console.log('Error inserting data:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(201).json({ message: 'User registered successfully!' });
        });
    }
    catch (err) {
        console.log('Error hashing password:', err);
        res.status(500).send('Internal Server Error');
    }
}));
// Admin Login
adminAuth.post('/login', (req, res) => {
    const { username, password, rememberMe } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const sql = `SELECT id, username, password FROM admin_users WHERE username = ?`;
    const values = [username];
    db_1.db.query(sql, values, (err, results) => {
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
        bcryptjs_1.default.compare(password, user.password, (bcryptErr, isMatch) => {
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
            const jwt = (0, jsonwebtoken_1.sign)({ username: user.username, adminId: user.id }, jwtSecret, { expiresIn: '30 days' });
            if (rememberMe) {
                const rememberToken = crypto_1.default.randomBytes(20).toString('hex');
                const updateTokenSql = `UPDATE admin_users SET remember_token = ? WHERE id = ?`;
                db_1.db.query(updateTokenSql, [rememberToken, user.id], (updateErr) => {
                    if (updateErr) {
                        console.log('Error updating remember token:', updateErr);
                        res.status(500).send('Internal Server Error');
                        return;
                    }
                    res.cookie('remember_token', rememberToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true });
                    res.status(200).json({ message: 'Login successful!', token: jwt, rememberToken });
                });
            }
            else {
                res.status(200).json({ message: 'Login successful!', token: jwt });
            }
        });
    });
});
exports.default = adminAuth;
