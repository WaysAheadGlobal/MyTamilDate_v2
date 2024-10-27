import { Router, Request, Response } from "express";
import { AdminRequest } from "../../../types/types";
import axios from 'axios';
import { db } from "../../../../db/db";
import { RowDataPacket } from "mysql2";
import ejs from 'ejs';
import sgMail from '@sendgrid/mail';
const reject = Router();

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

// Fetch customer data with pagination
// reject.get('/customers', (req: AdminRequest, res: Response) => {
//     const { limit, pageNo } = req.query;
//     const limitValue = limit ? parseInt(limit as string) : 10;
//     const pageNoValue = pageNo ? parseInt(pageNo as string) : 1;
//     const countSql = `
//         SELECT COUNT(*) AS total
//         FROM users   where approval = 30;
//     `;

//     const dataSql = `
//         SELECT 
//             up.first_name, 
//             us.approval,
//             us.deleted_at,
//             up.email, 
//             up.phone, 
//             loc.country, 
//             up.created_at, 
//             up.gender, 
//             up.birthday,
//             uso.is_active,
//             up.user_id
//         FROM 
//             user_profiles up
//         LEFT JOIN 
//             user_status_old uso ON up.user_id = uso.id
//                LEFT JOIN 
//             users us ON up.user_id = us.id
//         LEFT JOIN 
//             locations loc ON up.location_id = loc.id
//          WHERE us.approval = 30 
//         ORDER BY 
//             up.created_at DESC
//         LIMIT ? OFFSET ?
//     `;

//     const values = [limitValue, (pageNoValue - 1) * limitValue];
//     getTotalCount(countSql, [], (err, totalCount) => {
//         if (err) {
//             res.status(500).send('Internal Server Error');
//             return;
//         }

//         db.query(dataSql, values, (err: Error | null, results: any) => {
//             if (err) {
//                 console.log('Error fetching data:', err);
//                 res.status(500).send('Internal Server Error');
//                 return;
//             }
//             res.status(200).json({
//                 total: totalCount,
//                 results
//             });
//         });
//     });
// });

reject.get('/customers', (req: AdminRequest, res: Response) => {
    const { limit, pageNo } = req.query;
    const limitValue = limit ? parseInt(limit as string) : 10;
    const pageNoValue = pageNo ? parseInt(pageNo as string) : 1;

    const countSql = `
        SELECT COUNT(*) AS total
        FROM user_profiles up
        JOIN users uso ON up.user_id = uso.id
        WHERE 
            uso.approval = 30 AND uso.deleted_at IS NULL AND uso.active = 1
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
            up.user_id
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
        WHERE 
            (uso.approval = 30 AND uso.deleted_at IS NULL AND uso.active = 1)
            OR mu.user_id IS NOT NULL
            OR qs.user_id IS NOT NULL
        GROUP BY
            up.user_id
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

reject.get('/approval/:user_id', (req: AdminRequest, res: Response) => {
    const userId = req.params.user_id;

    const sql = `
        SELECT 
            up.first_name AS Name,
            up.last_name AS Surname,
            up.email AS Email,
          
            DATE_FORMAT(up.email_verified_at, '%Y-%m-%d') AS 'Email Verified At',
            up.phone AS Phone,
            DATE_FORMAT(up.birthday, '%Y-%m-%d') AS Birthday,
            loc.country AS Country,
            CASE up.gender 
                WHEN 1 THEN 'Male' 
                WHEN 2 THEN 'Female' 
                ELSE 'Other' 
            END AS Gender,
            CASE up.want_gender 
                WHEN 1 THEN 'Male' 
                WHEN 2 THEN 'Female' 
                ELSE 'Other' 
            END AS 'Preferred Gender',
            st.name AS 'Study Field',
            j.name AS 'Job Title',
            g.name AS 'Height',
            r.name AS Religion,
            wk.name AS 'Want Children',
            hk.name AS 'Have Children',
            s.name AS 'Smoker',
            d.name AS 'Drinker',
            DATE_FORMAT(up.created_at, '%Y-%m-%d') AS 'Profile Created At',
            DATE_FORMAT(up.updated_at, '%Y-%m-%d') AS 'Profile Updated At',
            
            GROUP_CONCAT(DISTINCT p.name) AS 'Personalities'
        FROM 
            user_profiles up
        JOIN 
            users uso ON up.user_id = uso.id
        LEFT JOIN 
            locations loc ON up.location_id = loc.id
        LEFT JOIN 
            studies st ON up.study_id = st.id
        LEFT JOIN 
            jobs j ON up.job_id = j.id
        LEFT JOIN 
            growths g ON up.growth_id = g.id
        LEFT JOIN 
            religions r ON up.religion_id = r.id
        LEFT JOIN 
            want_kids wk ON up.want_kid_id = wk.id
        LEFT JOIN 
            have_kids hk ON up.have_kid_id = hk.id
        LEFT JOIN 
            smokes s ON up.smoke_id = s.id
        LEFT JOIN 
            drinks d ON up.drink_id = d.id
        LEFT JOIN 
            user_personalities upers ON up.user_id = upers.user_id
        LEFT JOIN 
            personalities p ON upers.personality_id = p.id
        WHERE 
            up.user_id = ?
            
            AND uso.deleted_at IS NULL 
            AND uso.active = 1
        GROUP BY 
            up.id
    `;

    db.query<RowDataPacket[]>(sql, [userId], (err, results) => {
        if (err) {
            console.log('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }
        res.status(200).json(results[0]);
    });
});

reject.get('/latestrejection/:user_id',  (req: AdminRequest, res:Response) => {
    const userId = req.params.user_id;
  
    const query = `
      SELECT rr.reason, r.created_at
      FROM rejects r
      JOIN reject_reasons rr ON r.reason_id = rr.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT 1
    `;
  
    db.query(query, [userId], (err: Error | null, results: any) => {
      if (err) {
        console.error('Error fetching latest rejection reason:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'No rejection reason found for the user' });
      }
  
      const latestRejection = results[0];
      res.status(200).json({
        reason: latestRejection.reason,
        created_at: latestRejection.created_at
      });
    });
  });

  reject.post('/updateRejected', (req: AdminRequest, res: Response) => {
    const { id, message } = req.body; // Removed `type` from request body
  
    if (!id || !message) {
      return res.status(400).send('Bad Request: Missing required fields');
    }
  
    console.log(`Message: ${message}`);
  
    const getUserEmailSql = `
      SELECT up.email, up.first_name
      FROM users u
      JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = ?
    `;
  
    db.query(getUserEmailSql, [id], (err: Error | null, results: any) => {
      if (err) {
        console.error('Error fetching email:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      if (results.length === 0) {
        return res.status(404).send('User not found');
      }
  
      const { first_name: name, email } = results[0];
  
      // Insert reject reason into reject_reasons table
      const insertRejectReasonSql = `
        INSERT INTO reject_reasons (reason, created_at, updated_at)
        VALUES (?, NOW(), NOW())
      `;
  
      db.query(insertRejectReasonSql, [message], (err: Error | null, result: any) => {
        if (err) {
          console.error('Error inserting reject reason:', err);
          return res.status(500).send('Internal Server Error');
        }
  
        const reasonId = result.insertId;
  
        // Insert into notifications_popup table with `type` always set to 1
        const insertRejectSql = `
          INSERT INTO notifications_popup (user_id, reason_id, created_at, updated_at, type)
          VALUES (?, ?, NOW(), NOW(), 1)
        `;
  
        db.query(insertRejectSql, [id, reasonId], (err: Error | null) => {
          if (err) {
            console.error('Error inserting into notifications_popup:', err);
            return res.status(500).send('Internal Server Error');
          }
  
          console.log(`Inserted rejection for user ID: ${id} with reason ID: ${reasonId}`);
          return res.status(200).send('Rejection reason added and notification created successfully');
        });
      });
    });
  });
  
  
  





export default reject;