import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../../db/db";
import { UserRequest } from "../types/types";
import { RowDataPacket } from "mysql2";

export const verifyUser = (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized " });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        
        console.log("user id", decoded.userId);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        db.query<RowDataPacket[]>("SELECT up.*, u.active, u.deleted_at FROM user_profiles up INNER JOIN users u ON u.id = up.user_id WHERE user_id = ?", [decoded.userId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error" });
            }

            if (result.length === 0) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            req.userId = decoded.userId;
            req.user = result[0];
            next();
        });
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
