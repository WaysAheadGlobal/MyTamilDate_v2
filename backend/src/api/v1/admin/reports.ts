import { Router, Request, Response } from "express";
import { AdminRequest } from "../../../types/types";
import axios from 'axios';
import { db } from "../../../../db/db";
import { RowDataPacket } from "mysql2";
import ejs from 'ejs';
import sgMail from '@sendgrid/mail';
const report = Router();

// Define types for callback function
type QueryCallback = (err: Error | null, results: any) => void;

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
// Helper function to get total count of records
const getTotalCount = (sql: string, values: any[], callback: (err: Error | null, total: number) => void): void => {
    db.query<RowDataPacket[]>(sql, values, (err, results) => {
        if (err) {
            console.error('Error fetching total count:', err);
            callback(err, 0);
        } else {
            callback(null, results[0].total);
        }
    });
};

report.get('/', (req: AdminRequest, res: Response) => {
    const { limit, pageNo } = req.query;
    const limitValue = limit ? parseInt(limit as string) : 10000;
    const pageNoValue = pageNo ? parseInt(pageNo as string) : 1;

    const countSql = `
        SELECT COUNT(DISTINCT up.user_id) AS total
        FROM user_profiles up
        JOIN users uso ON up.user_id = uso.id
        LEFT JOIN reports r ON uso.id = r.person_id
        WHERE 
            uso.approval = 20
            AND uso.deleted_at IS NULL 
            AND uso.active = 1 
            AND r.person_id IS NOT NULL
    `;

    const dataSql = `
        SELECT 
            up.first_name, 
            up.last_name,
            up.email, 
            up.phone, 
            loc.country, 
            up.created_at, 
            up.gender, 
            up.birthday,
            up.updated_at,
            up.user_id,
            r.reason_id,
            rr.reason,
            rr.created_at AS reported_date
        FROM 
            user_profiles up
        JOIN 
            users uso ON up.user_id = uso.id
        LEFT JOIN 
            media_update mu ON up.user_id = mu.user_id
        LEFT JOIN 
            question_answers_update qs ON up.user_id = qs.user_id
        LEFT JOIN 
            locations loc ON up.location_id = loc.id
        LEFT JOIN 
            reports r ON uso.id = r.person_id
        LEFT JOIN 
            report_reasons rr ON r.reason_id = rr.id
        WHERE 
            (  uso.approval = 20 AND uso.deleted_at IS NULL AND uso.active = 1)
            AND r.person_id IS NOT NULL
        GROUP BY
            up.user_id, r.reason_id, rr.reason, rr.created_at
        ORDER BY 
            up.created_at DESC
        LIMIT ? OFFSET ?
    `;

    const values = [limitValue, (pageNoValue - 1) * limitValue];

    getTotalCount(countSql, [], (err, totalCount) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }

        db.query(dataSql, values, (err: Error | null, results: any) => {
            if (err) {
                console.log('Error fetching data:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(200).json({
                total: totalCount,
                results
            });
        });
    });
});

report.get('/report-reason/:person_id', (req: AdminRequest, res: Response) => {
    const { person_id } = req.params;

    const dataSql = `
        SELECT 
            r.id AS report_id,
            r.user_id,
            r.person_id,
            rr.reason,
            rr.created_at AS reported_date,
            r.created_at AS report_created_at
        FROM 
            reports r
        JOIN 
            report_reasons rr ON r.reason_id = rr.id
        WHERE 
            r.person_id = ?
    `;

    db.query(dataSql, [person_id], (err: Error | null, results: any) => {
        if (err) {
            console.log('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('No report reasons found for the given person_id');
            return;
        }
        res.status(200).json(results);
    });
});

export default report;