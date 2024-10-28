import { Router, Request, Response } from "express";
import { AdminRequest } from "../../../types/types";
import axios from 'axios';
import { db } from "../../../../db/db";
import { RowDataPacket } from "mysql2";
import ejs from 'ejs';
import sgMail from '@sendgrid/mail';
const users = Router();

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

interface MediaItem {
    id: number;
    hash: string;
    extension: string;
    type: number;
}

users.get('/media/:user_id', (req: AdminRequest, res: Response) => {
    const userId = req.params.user_id;

    const query = `
        SELECT 
            COALESCE(mu.media_id, m.id) AS id,
            m.user_id,
            COALESCE(mu.type, m.type) AS type,
            COALESCE(mu.hash, m.hash) AS hash,
            COALESCE(mu.extension, m.extension) AS extension,
            COALESCE(mu.meta, m.meta) AS meta,
            COALESCE(mu.created_at, m.created_at) AS created_at,
            COALESCE(mu.updated_at, m.updated_at) AS updated_at
        FROM media m
        LEFT JOIN media_update mu ON m.id = mu.media_id
        WHERE m.user_id = ?
    `;

    db.query<RowDataPacket[]>(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching media:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(results);
    });
});

users.get('/mediaupdate/:user_id', (req: AdminRequest, res: Response) => {
    const userId = req.params.user_id;
    const query = 'SELECT id, hash, extension, type,media_id FROM media_update WHERE user_id = ?';
    db.query<RowDataPacket[]>(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching media:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(results);
    });
});



users.post("/replaceMediaData/:user_id", async (req: AdminRequest, res: Response) => {
    const userId = req.params.user_id;

    // Step 1: Query the media table by user_id
    const mediaQuery = 'SELECT * FROM media WHERE user_id = ?';
    db.query<RowDataPacket[]>(mediaQuery, [userId], (mediaErr, mediaResults) => {
        if (mediaErr) {
            console.error('Error querying media table:', mediaErr);
            return res.status(500).send('Internal Server Error');
        }

        if (mediaResults.length === 0) {
            return res.status(404).send('No media found for this user.');
        }

        // Step 2: Loop through each media record and check if it exists in media_update table
        let mediaProcessed = 0;
        mediaResults.forEach(mediaRecord => {
            const mediaId = mediaRecord.id;

            const updateQuery = 'SELECT * FROM media_update WHERE media_id = ?';
            db.query<RowDataPacket[]>(updateQuery, [mediaId], (updateErr, updateResults) => {
                if (updateErr) {
                    console.error('Error querying media_update table:', updateErr);
                    return res.status(500).send('Internal Server Error');
                }

                if (updateResults.length > 0) {
                    const updatedMedia = updateResults[0];

                    // Step 3: Replace the data in the media table with the data from the media_update table
                    const replaceQuery = `
              UPDATE media 
              SET 
                user_id = ?, 
                type = ?, 
                hash = ?, 
                extension = ?, 
                meta = ?, 
                created_at = ?, 
                updated_at = ? 
              WHERE id = ?`;

                    const replaceValues = [
                        updatedMedia.user_id,
                        updatedMedia.type,
                        updatedMedia.hash,
                        updatedMedia.extension,
                        updatedMedia.meta,
                        updatedMedia.created_at,
                        updatedMedia.updated_at,
                        mediaRecord.id
                    ];

                    db.query(replaceQuery, replaceValues, (replaceErr, replaceResults) => {
                        mediaProcessed++;

                        if (replaceErr) {
                            console.error('Error replacing media data:', replaceErr);
                            return res.status(500).send('Internal Server Error');
                        }

                        // Check if all media records have been processed
                        if (mediaProcessed === mediaResults.length) {
                            // Step 4: Delete the data from the media_update table for the given user_id
                            const deleteQuery = 'DELETE FROM media_update WHERE user_id = ?';
                            db.query(deleteQuery, [userId], (deleteErr, deleteResults) => {
                                if (deleteErr) {
                                    console.error('Error deleting data from media_update table:', deleteErr);
                                    return res.status(500).send('Internal Server Error');
                                }

                                return res.status(200).json({ message: 'Media data replaced and update data deleted successfully' });
                            });
                        }
                    });
                } else {
                    mediaProcessed++;

                    // Check if all media records have been processed
                    if (mediaProcessed === mediaResults.length) {
                        // Step 4: Delete the data from the media_update table for the given user_id
                        const deleteQuery = 'DELETE FROM media_update WHERE user_id = ?';
                        db.query(deleteQuery, [userId], (deleteErr, deleteResults) => {
                            if (deleteErr) {
                                console.error('Error deleting data from media_update table:', deleteErr);
                                return res.status(500).send('Internal Server Error');
                            }

                            return res.status(200).json({ message: 'Media data replaced and update data deleted successfully' });
                        });
                    }
                }
            });
        });
    });
});


users.get('/UpdateRequestedUser/:user_id', (req: AdminRequest, res: Response) => {
    const userId = req.params.user_id;

    const sql = `
        SELECT id FROM media_update WHERE user_id = ?
        UNION
        SELECT id FROM question_answers_update WHERE user_id = ?
    `;

    db.query(sql, [userId, userId], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(results);
    });
});



users.delete('/deleteMediaUpdate/:user_id', (req: AdminRequest, res: Response) => {
    const userId = req.params.user_id;
    const deleteQuery = 'DELETE FROM media_update WHERE user_id = ?';

    db.query(deleteQuery, [userId], async (err, results: any) => {
        if (err) {
            console.error('Error deleting data from media_update table:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('No data found for this user.');
        }

        let html: string;
        try {
            html = await ejs.renderFile("mail/templates/updatereject.ejs", { link: `${process.env.URL}/user/home` });
        } catch (renderError) {
            console.error('Error rendering email template:', renderError);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        const getUserEmailSql = `
        SELECT up.email
        FROM users u
        JOIN user_profiles up ON u.id = up.user_id
        WHERE u.id = ?
      `;

        db.query(getUserEmailSql, [userId], (err: Error | null, results: any) => {
            if (err) {
                console.error('Error fetching email:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (results.length === 0) {
                return res.status(404).send('User not found');
            }

            const email = results[0].email;

            const msg = {
                to: email,
                from: process.env.EMAIL_HOST!,
                subject: "Update Request Notification",
                html: html
            };

            sgMail.send(msg)
                .then(() => {
                    console.log("Approval email sent successfully");
                    return res.status(200).json({ message: 'Data deleted successfully and email sent' });
                })
                .catch((error) => {
                    console.error('Error sending email:', error);
                    return res.status(500).send('Internal Server Error');
                });
        });
    });
});


// Fetch customer data with pagination
users.get('/customers', (req: AdminRequest, res: Response) => {
    const { limit, pageNo } = req.query;
    const limitValue = limit ? parseInt(limit as string) : 10;
    const pageNoValue = pageNo ? parseInt(pageNo as string) : 1;

    const countSql = `
        SELECT COUNT(*) AS total
        FROM user_profiles up
    `;

    const dataSql = `
        SELECT 
            up.first_name, 
            us.approval,
            us.deleted_at,
            up.email, 
            up.phone, 
            loc.country, 
            up.created_at, 
            up.gender, 
            up.birthday,
            uso.is_active,
            up.user_id
        FROM 
            user_profiles up
        LEFT JOIN 
            user_status_old uso ON up.user_id = uso.id
               LEFT JOIN 
            users us ON up.user_id = us.id
        LEFT JOIN 
            locations loc ON up.location_id = loc.id
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


// users.get('/approval', (req: AdminRequest, res: Response) => {
//     const { limit, pageNo } = req.query;
//     const limitValue = limit ? parseInt(limit as string) : 10;
//     const pageNoValue = pageNo ? parseInt(pageNo as string) : 1;

//     const countSql = `
//         SELECT COUNT(*) AS total
//         FROM user_profiles up
//         JOIN users uso ON up.user_id = uso.id
//         WHERE 
//             uso.approval = 10 AND uso.deleted_at IS NULL  AND uso.active = 1
//     `;

//     const dataSql = `
//         SELECT 
//             up.first_name, 
//             up.last_name,
//             up.email, 
//             up.phone, 
//             loc.country, 
//             up.created_at, 
//             up.gender, 
//             up.birthday,
//            up.updated_at,
//             up.user_id
//         FROM 
//             user_profiles up
//         JOIN 
//             users uso ON up.user_id = uso.id 
//         LEFT JOIN 
//             locations loc ON up.location_id = loc.id 
//         WHERE 
//             uso.approval = 10 AND uso.deleted_at IS NULL AND uso.active = 1
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


// Fetch customer details by user_id

users.get('/customers/:user_id', (req: AdminRequest, res) => {
    const userId = req.params.user_id;

    const sql = `
        SELECT 
            up.id,
            up.user_id,
            up.completed,
            up.first_name,
            up.last_name,
            up.email,
            up.email_verified_at,
            up.phone,
            up.birthday,
            loc.country,
            up.gender,
            up.want_gender,
            st.name as study_name,
            j.name as job_name,
            g.name as growth_name,
            r.name as religion_name,
            wk.name as want_kid_name,
            hk.name as have_kid_name,
            s.name as smoke_name,
            d.name as drink_name,
            up.created_at,
            up.updated_at,
            up.popup_promo_shown_stage,
            uso.status,
            uso.is_active,
            us.approval,
            us.deleted_at,
            GROUP_CONCAT(DISTINCT upers.personality_id) as personalities,
            qa.question_id,
            qa.answer
        FROM 
            user_profiles up
        LEFT JOIN 
            user_status_old uso ON up.user_id = uso.id
        LEFT JOIN 
            users us ON up.user_id = us.id
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
            question_answers qa ON up.user_id = qa.user_id
        WHERE 
            up.user_id = ?
        GROUP BY 
            up.id, qa.question_id`;

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
        res.status(200).json(results);
    });
});

users.get('/approval', (req: AdminRequest, res: Response) => {
    const { limit, pageNo } = req.query;
    const limitValue = limit ? parseInt(limit as string) : 10;
    const pageNoValue = pageNo ? parseInt(pageNo as string) : 1;

    const countSql = `
        SELECT COUNT(*) AS total
        FROM user_profiles up
        JOIN users uso ON up.user_id = uso.id
        WHERE 
            uso.approval = 10 AND uso.deleted_at IS NULL AND uso.active = 1
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
            (uso.approval = 10 AND uso.deleted_at IS NULL AND uso.active = 1)
            OR mu.user_id IS NOT NULL
            OR qs.user_id IS NOT NULL
        GROUP BY
            up.user_id
        ORDER BY 
            up.updated_at DESC
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

users.get('/approval2/:id', (req: AdminRequest, res: Response) => {
    const { id } = req.params;

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
            locations loc ON up.location_id = loc.id
        WHERE 
            uso.approval = 10 AND uso.deleted_at IS NULL AND uso.active = 1 AND up.user_id = ?
    `;

    db.query(dataSql, [id], (err: Error | null, results: any) => {
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

users.get('/approval/:user_id', (req: AdminRequest, res: Response) => {
    const userId = req.params.user_id;

    const sql = `
        SELECT 
            up.first_name AS Name,
            up.last_name AS Surname,
            up.email AS Email,
            uso.approval AS Approval,
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

// Add the PUT endpoint to update the status
users.put('/updatestatus', (req: AdminRequest, res: Response) => {
    const { id, approval, message } = req.body;

    if (!id || !approval) {
        return res.status(400).send('Bad Request: Missing user_id or status');
    }
    console.log(message);

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

        const name = results[0].first_name;

        const email = results[0].email;

        const updateStatusSql = `
            UPDATE users
            SET approval = ?
            WHERE id = ?
        `;
        if (approval === 20) {
            db.query(updateStatusSql, [approval, id], async (err: Error | null, result: any) => {
                if (err) {
                    console.error('Error updating status:', err);
                    return res.status(500).send('Internal Server Error');
                }

                let html;
                try {
                    html = await ejs.renderFile("mail/templates/signup.ejs", {
                        link: `${process.env.URL}/user/home`,
                        name: name,
                       mobile : "../"
                       
                    });
                } catch (renderError) {
                    console.error('Error rendering email template:', renderError);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

                const msg = {
                    from: process.env.EMAIL_HOST!,
                    to: email,
                    subject: "Your account has been approved.",
                    html: html
                };

                sgMail.send(msg)
                    .then(() => {
                        console.log("Approval email sent successfully");
                        return res.status(200).send('Status updated successfully and email sent');
                    })
                    .catch((error) => {
                        console.error('Error sending email:', JSON.stringify(error));
                        return res.status(500).send('Internal Server Error');
                    });
            });
        }
        else if (approval === 30) {

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

                // Check if the user already exists in the rejects table
                const checkUserInRejectsSql = `
                SELECT id FROM rejects WHERE user_id = ?
            `;

                db.query(checkUserInRejectsSql, [id], (err: Error | null, results: any) => {
                    if (err) {
                        console.error('Error checking user in rejects:', err);
                        return res.status(500).send('Internal Server Error');
                    }
                    if (results.length === 0) {
                        // User not in rejects table, insert new record
                        const insertRejectSql = `
                        INSERT INTO rejects (user_id, reason_id, created_at, updated_at)
                        VALUES (?, ?, NOW(), NOW())
                    `;

                        db.query(insertRejectSql, [id, reasonId], async (err: Error | null, result: any) => {
                            if (err) {
                                console.error('Error inserting into rejects:', err);
                                return res.status(500).send('Internal Server Error');
                            }

                            db.query(updateStatusSql, [approval, id], async (err: Error | null, result: any) => {
                                if (err) {
                                    console.error('Error updating status:', err);
                                    return res.status(500).send('Internal Server Error');
                                }
                                console.log(result);
                                let html;
                                try {
                                    html = await ejs.renderFile("mail/templates/reject.ejs", {
                                        link: `${process.env.URL}/not-approved`, 
                                        message: message,
                                        name: name
                                    });
                                } catch (renderError) {
                                    console.error('Error rendering email template:', renderError);
                                    return res.status(500).json({ message: 'Internal Server Error' });
                                }

                                // Send verification email
                                const msg = {
                                    to: email,
                                    from: process.env.EMAIL_HOST!,
                                    subject: "Your account has not been approved.",
                                    html: html
                                };

                                sgMail.send(msg)
                                    .then(() => {
                                        console.log("Reject email sent successfully");
                                        return res.status(200).send('Status updated successfully and email sent');
                                    })
                                    .catch((error) => {
                                        console.error('Error sending email:', error);
                                        return res.status(500).send('Internal Server Error');
                                    });
                            })
                        })
                    }

                    else {
                        const updateRejectSql = `
                                UPDATE rejects SET reason_id = ?, updated_at = NOW() WHERE user_id = ?
                            `;

                        db.query(updateRejectSql, [reasonId, id], async (err: Error | null, result: any) => {
                            if (err) {
                                console.error('Error updating rejects:', err);
                                return res.status(500).send('Internal Server Error');
                            }
                            db.query(updateStatusSql, [approval, id], async (err: Error | null, result: any) => {
                                if (err) {
                                    console.error('Error updating status:', err);
                                    return res.status(500).send('Internal Server Error');
                                }

                                let html;
                                try {
                                    html = await ejs.renderFile("mail/templates/reject.ejs", { link: `${process.env.URL}/not-approved`, message: message });
                                } catch (renderError) {
                                    console.error('Error rendering email template:', renderError);
                                    return res.status(500).json({ message: 'Internal Server Error' });
                                }

                                // Send verification email
                                const msg = {
                                    to: email,
                                    from: process.env.EMAIL_HOST!,
                                    subject: "Approval Rejected Notification",
                                    html: html
                                };


                                console.log(msg)
                                sgMail.send(msg)
                                    .then(() => {
                                        console.log("Reject email sent successfully");
                                        return res.status(200).send('Status updated successfully and email sent');
                                    })
                                    .catch((error) => {
                                        console.error('Error sending email:', error);
                                        return res.status(500).send('Internal Server Error');
                                    });

                            })
                        })

                    }


                })
            })
            // db.query(updateStatusSql, [approval, id], async (err: Error | null, result: any) => {
            //     if (err) {
            //         console.error('Error updating status:', err);
            //         return res.status(500).send('Internal Server Error');
            //     }
            // });


        }
    });
});


// delete the User
users.put('/deleteuser', (req, res) => {
    const { id } = req.body;

    if (!id) {
        res.status(400).send('Bad Request: Missing user_id');
        return;
    }

    const deletedAt = new Date(); // Get the current timestamp

    const updateStatusSql = `
        UPDATE users
        SET deleted_at = ?
        WHERE id = ?
    `;

    db.query(updateStatusSql, [deletedAt, id], (err, result) => {
        if (err) {
            console.log('Error updating status:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).send('Status updated successfully');
    });
});

users.get('/media/:id', (req: AdminRequest, res: Response) => {
    const mediaId = req.params.id;

    const query = 'SELECT * FROM media WHERE id = ?';
    db.query<RowDataPacket[]>(query, [mediaId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Server error');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Media not found');
            return;
        }

        const media = results[0];
        res.json(media);
    });
});

users.get('/mediaupdate/:id', (req: AdminRequest, res: Response) => {
    const mediaId = req.params.id;

    const query = 'SELECT * FROM media_update WHERE id = ?';
    db.query<RowDataPacket[]>(query, [mediaId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Server error');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Media not found');
            return;
        }

        const media = results[0];
        res.json(media);
    });
});

// Fetch user questions by user_id
// users.get('/user/questions/:user_id', (req: AdminRequest, res: Response) => {
//     const userId = req.params.user_id;

//     const sql = `
//         SELECT 
//             qa.question_id,
//             q.text AS question,
//             qa.answer,
//             qa.created_at,
//             qa.updated_at
//         FROM 
//             question_answers qa
//         JOIN 
//             questions q ON qa.question_id = q.id
//         WHERE 
//             qa.user_id = ?
//     `;

//     db.query(sql, [userId], (err: Error | null, results: any) => {
//         if (err) {
//             console.error('Error fetching data:', err);
//             res.status(500).send('Internal Server Error');
//             return;
//         }

//         res.status(200).json(results);
//     });
// });


users.get('/user/questions/:user_id', (req: AdminRequest, res: Response) => {
    const userId = req.params.user_id;

    const sql = `
      SELECT 
        COALESCE(qau.question_id, qa.question_id) AS question_id,
        q.text AS question,
        COALESCE(qau.answer, qa.answer) AS answer,
        COALESCE(qau.created_at, qa.created_at) AS created_at,
        COALESCE(qau.updated_at, qa.updated_at) AS updated_at
      FROM 
        questions q
      LEFT JOIN 
        question_answers qa ON q.id = qa.question_id AND qa.user_id = ?
      LEFT JOIN 
        question_answers_update qau ON q.id = qau.question_id AND qau.user_id = ?
      WHERE 
        qa.user_id = ? OR qau.user_id = ?
    `;

    db.query(sql, [userId, userId, userId, userId], (err: Error | null, results: any) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.status(200).json(results);
    });
});

users.post('/updateQuestionAnswers/:user_id', (req: AdminRequest, res: Response) => {
    const userId = req.params.user_id;

    // Start a transaction
    db.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).send('Internal Server Error');
        }

        const updateSql = `
            UPDATE question_answers qa
            JOIN question_answers_update qau
            ON qa.user_id = qau.user_id AND qa.question_id = qau.question_id
            SET qa.answer = qau.answer,
                qa.updated_at = NOW()
            WHERE qa.user_id = ?
        `;

        db.query(updateSql, [userId], (err, updateResults) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Error updating question_answers:', err);
                    return res.status(500).send('Internal Server Error');
                });
            }
            console.log("question update")
            const deleteSql = `
                DELETE FROM question_answers_update 
                WHERE user_id = ? AND question_id IN (
                    SELECT question_id FROM question_answers WHERE user_id = ?
                )
            `;

            db.query(deleteSql, [userId, userId], (err, deleteResults) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error deleting from question_answers_update:', err);
                        return res.status(500).send('Internal Server Error');
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error committing transaction:', err);
                            return res.status(500).send('Internal Server Error');
                        });
                    }

                    res.status(200).json({
                        message: 'Question answers updated and temporary data deleted successfully',
                        deleteResults,
                    });
                    console.log("question deleted")
                });
            });
        });
    });
});

users.delete('/deleteAnswerquestions/:user_id', (req: AdminRequest, res: Response) => {
    const userId = req.params.user_id;
    const deleteQuery = 'DELETE FROM question_answers_update WHERE user_id = ?';

    db.query(deleteQuery, [userId], async (err, results: any) => {
        if (err) {
            console.error('Error deleting data from media_update table:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('No data found for this user.');
        }

        let html: string;
        try {
            html = await ejs.renderFile("mail/templates/updatereject.ejs", { link: `${process.env.URL}/user/home` });
        } catch (renderError) {
            console.error('Error rendering email template:', renderError);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        const getUserEmailSql = `
        SELECT up.email
        FROM users u
        JOIN user_profiles up ON u.id = up.user_id
        WHERE u.id = ?
      `;

        db.query(getUserEmailSql, [userId], (err: Error | null, results: any) => {
            if (err) {
                console.error('Error fetching email:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (results.length === 0) {
                return res.status(404).send('User not found');
            }

            const email = results[0].email;

            // Send verification email
            const msg = {
                to: email,
                from: "hello@mytamildate.com",
                subject: "Update Request Notification",
                html: html
            };

            sgMail.send(msg)
                .then(() => {
                    console.log("Approval email sent successfully");
                    return res.status(200).json({ message: 'Data deleted successfully and email sent' });
                })
                .catch((error) => {
                    console.error('Error sending email:', error);
                    return res.status(500).send('Internal Server Error');
                });
        });
    });
});

users.get('/approval', (req: AdminRequest, res: Response) => {
    const { limit, pageNo } = req.query;
    const limitValue = limit ? parseInt(limit as string) : 10;
    const pageNoValue = pageNo ? parseInt(pageNo as string) : 1;

    const countSql = `
        SELECT COUNT(*) AS total
        FROM user_profiles up
        JOIN users uso ON up.user_id = uso.id
        WHERE uso.status = 15
    `;

    const dataSql = `
        SELECT 
            up.first_name, 
            uso.approval, 
            up.email, 
            up.phone, 
            loc.country, 
            up.created_at, 
            up.gender, 
            up.birthday,
            uso.is_active,
            up.user_id
        FROM 
            user_profiles up
        JOIN 
            users uso ON up.user_id = uso.id
        LEFT JOIN 
            locations loc ON up.location_id = loc.id
            WHERE uso.status = 15
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

// Fetch payment status with pagination
users.get('/paymentstatus', (req: AdminRequest, res: Response) => {
    const { limit, pageNo } = req.query;
    const limitValue = limit ? parseInt(limit as string) : 10;
    const pageNoValue = pageNo ? parseInt(pageNo as string) : 1;

    const countSql = `
        SELECT COUNT(*) AS total
        FROM users
    `;

    const dataSql = `
        SELECT 
            *
        FROM 
            users
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

// Alias route for payment status with pagination
users.get('/paymentstatu', (req: AdminRequest, res: Response) => {
    const { limit, pageNo } = req.query;
    const limitValue = limit ? parseInt(limit as string) : 10;
    const pageNoValue = pageNo ? parseInt(pageNo as string) : 1;

    const countSql = `
        SELECT COUNT(*) AS total
        FROM media
        
    `;

    const dataSql = `
        SELECT 
            *
        FROM 
            media
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


users.get('/paymentstatuu', (req: AdminRequest, res: Response) => {
    const sql = `
        SELECT *
        FROM media
       LIMIT 10
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).json(results);
    });
});

// users.get('/image/:hash.:extension', async (req: Request, res: Response) => {
//     const { hash, extension } = req.params;
//     try {
//         const response = await axios.get(`https://mytamildate.com/home/${hash}.${extension}`, {
//             responseType: 'stream'
//         });
//         response.data.pipe(res);
//     } catch (error) {
//         console.error('Error fetching image:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });



export default users;
