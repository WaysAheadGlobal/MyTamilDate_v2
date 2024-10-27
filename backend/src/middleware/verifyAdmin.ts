import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { db } from '../../db/db';
import { AdminRequest } from '../types/types';
import dotenv from 'dotenv';
import { RowDataPacket } from 'mysql2';

dotenv.config();

export const verifyAdmin = (req: AdminRequest, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                return res.status(500).json({ message: 'Internal server error: JWT Secret is not defined' });
            }

            try {
                const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
                req.adminId = decoded.adminId;
                return next();
            } catch (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }
    }

    if (req.cookies.remember_token) {
        const rememberToken = req.cookies.remember_token;
        const sql = 'SELECT id FROM admin_users WHERE remember_token = ?';
        const values = [rememberToken];

        db.query<RowDataPacket[]>(sql, values, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.adminId = results[0].id;
            next();
        });
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
