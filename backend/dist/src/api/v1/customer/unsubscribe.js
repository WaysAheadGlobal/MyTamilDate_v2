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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyUser_1 = require("../../../middleware/verifyUser");
const db_1 = require("../../../../db/db");
const unsubscribe = (0, express_1.Router)();
unsubscribe.use(verifyUser_1.verifyUser);
unsubscribe.get("/", (req, res) => {
    const userId = req.userId;
    db_1.db.query(`SELECT * FROM dncs_user_unsubscribe WHERE user_id = ?`, [userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal server error" });
        }
        const data = result.map((row) => row.unsubscribe_group_id);
        res.status(200).json(data);
    });
});
unsubscribe.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const unsubscribeGroups = req.body.unsubscribe;
    const userId = req.userId;
    try {
        yield db_1.db.promise().beginTransaction();
        yield db_1.db.promise().query(`DELETE FROM dncs_user_unsubscribe WHERE user_id = ?`, [userId]);
        const values = unsubscribeGroups.map((group) => [userId, group, new Date(), new Date()]);
        if (values.length !== 0) {
            yield db_1.db.promise().query(`INSERT INTO dncs_user_unsubscribe (user_id, unsubscribe_group_id, created_at, updated_at) VALUES ?`, [values]);
        }
        yield db_1.db.promise().commit();
    }
    catch (error) {
        console.log(error);
        yield db_1.db.promise().rollback();
        return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json({ message: "Unsubscribed successfully" });
}));
exports.default = unsubscribe;
