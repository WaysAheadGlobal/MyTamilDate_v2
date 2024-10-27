"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../db/db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyAdmin = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                return res.status(500).json({ message: 'Internal server error: JWT Secret is not defined' });
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
                req.adminId = decoded.adminId;
                return next();
            }
            catch (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }
    }
    if (req.cookies.remember_token) {
        const rememberToken = req.cookies.remember_token;
        const sql = 'SELECT id FROM admin_users WHERE remember_token = ?';
        const values = [rememberToken];
        db_1.db.query(sql, values, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.adminId = results[0].id;
            next();
        });
    }
    else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
exports.verifyAdmin = verifyAdmin;
