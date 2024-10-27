"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../db/db");
const verifyUser = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized " });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("user id", decoded.userId);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        db_1.db.query("SELECT up.*, u.active, u.deleted_at FROM user_profiles up INNER JOIN users u ON u.id = up.user_id WHERE user_id = ?", [decoded.userId], (err, result) => {
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
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.verifyUser = verifyUser;
