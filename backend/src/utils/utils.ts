import { RowDataPacket } from "mysql2";
import { db } from "../../db/db";

export const checkPremium = async (userId: string) => {
    const [result] = await db.promise().query<RowDataPacket[]>("SELECT id FROM subscriptions WHERE user_id = ? AND stripe_status = 'active';", [userId]);

    return result.length > 0;
}

export const getUnsubscribedGroups = async (userId: number) => {
    const [result] = await db.promise().query<RowDataPacket[]>("SELECT dg.id FROM dncs_user_unsubscribe du INNER JOIN dncs_unsubscribe_groups dg ON dg.id = du.unsubscribe_group_id WHERE user_id = ?;", [userId]);

    return result.map((row) => row.id);
}