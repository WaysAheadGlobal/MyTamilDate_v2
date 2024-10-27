import { Router } from "express";
import { verifyUser } from "../../../middleware/verifyUser";
import { UserRequest } from "../../../types/types";
import { db } from "../../../../db/db";
import { RowDataPacket } from "mysql2";

const unsubscribe = Router();

unsubscribe.use(verifyUser);

unsubscribe.get("/", (req: UserRequest, res) => {
    const userId = req.userId;

    db.query<RowDataPacket[]>(`SELECT * FROM dncs_user_unsubscribe WHERE user_id = ?`, [userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal server error" });
        }

        const data = result.map((row) => row.unsubscribe_group_id);

        res.status(200).json(data);
    });
});

unsubscribe.post("/", async (req: UserRequest, res) => {
    console.log(req.body);
    const unsubscribeGroups: string[] = req.body.unsubscribe;

    const userId = req.userId;

    try {
        await db.promise().beginTransaction();
        await db.promise().query(`DELETE FROM dncs_user_unsubscribe WHERE user_id = ?`, [userId]);
        const values = unsubscribeGroups.map((group) => [userId, group, new Date(), new Date()]);
        if (values.length !== 0) {
            await db.promise().query(`INSERT INTO dncs_user_unsubscribe (user_id, unsubscribe_group_id, created_at, updated_at) VALUES ?`, [values]);
        }
        await db.promise().commit();
    } catch (error) {
        console.log(error);
        await db.promise().rollback();
        return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json({ message: "Unsubscribed successfully" });
});

export default unsubscribe;