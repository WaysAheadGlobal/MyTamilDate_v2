import { Router } from "express";
import { sign } from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { db } from "../../../../db/db";
import { sendOTPtoPhoneNumber, verifyOTP, testTwilioConnection } from '../../../../otp';
import { UserRequest } from "../../../types/types";
import crypto from 'crypto';
import { verifyUser } from "../../../middleware/verifyUser";
import sgMail from '@sendgrid/mail';
import ejs from 'ejs';
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getOTPFromDBByEmail, insertOTPInDBByEmail } from "../../../../otpbyEmail";
import UserApprovalEnum from "../../../enums/UserApprovalEnum";
import Stripe from "stripe";
import MailService from "../../../../mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const auth = Router();
let otpData: { phone: string, otp: string, createdAt: Date } | null = null;

const mailService = new MailService();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Route to send OTP for login
auth.get('/test-twilio', async (req, res) => {
    const isConnected = await testTwilioConnection();
    if (isConnected) {
        res.status(200).send('Twilio connection successful');
    } else {
        res.status(500).send('Twilio connection failed');
    }
});
// Route to send OTP for login
auth.post('/login/otp',
    [
        body('phone').notEmpty().withMessage('Phone number is required'),

    ],
    async (req: any, res: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { phone, countryCode } = req.body;

        const query = 'SELECT first_name FROM user_profiles WHERE phone = ?';
        db.query<RowDataPacket[]>(query, phone, async (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'We don’t recognize this phone number. Try signing up first' });
            }

            try {
                await sendOTPtoPhoneNumber({ phone: phone });
                return res.status(200).json({ message: 'OTP sent successfully!' });
                // return res.status(200).json({ message: 'Your OTP is ',otp });
            } catch (error) {
                console.error('Error sending OTP:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
);

// Route to verify OTP and login
auth.post('/login',
    [
        body('phone').notEmpty().withMessage('Phone number is required'),
        body('otp').notEmpty().withMessage('OTP is required')
    ],
    async (req: any, res: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { phone, otp } = req.body;

        try {
            const otpResponse = await verifyOTP({ phone: phone, otp });
            if (otpResponse.status !== 'approved') {
                return res.status(401).json({ message: otpResponse.message });
            }

            const query = `
        SELECT 
            up.id AS profile_id, 
            up.user_id,
            up.email,
            up.gender,
            up.email_verified_at,
            up.location_id,
            up.religion_id,
            up.job_id,
            up.growth_id,
            up.study_id,
            up.first_name, 
            u.approval,
            MIN(m.id) AS media, 
            MIN(upers.id) AS personality, 
            MIN(qa.id) AS question_answer
        FROM 
            user_profiles up
        INNER JOIN 
            users u ON u.id = up.user_id
        LEFT JOIN 
            media m ON m.user_id = up.user_id
        LEFT JOIN 
            user_personalities upers ON upers.user_id = up.user_id
        LEFT JOIN 
            question_answers qa ON qa.user_id = up.user_id
        WHERE 
            up.phone = ?
        GROUP BY 
            up.id, up.user_id, up.first_name, u.approval
        ORDER BY 
            up.created_at DESC;
        `;
            db.query<RowDataPacket[]>(query, [phone], (err, results) => {
                if (err) {
                    console.error('Error fetching data:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

                if (results.length === 0) {
                    return res.status(401).json({ message: 'Invalid code' });
                }

                if (results[0].deleted_at) {
                    return res.status(401).json({ message: 'Invalid code' });
                }

                const jwt = sign({ phone: phone, userId: results[0].user_id }, process.env.JWT_SECRET as string, { expiresIn: '30 days' });
                return res.status(200).json({
                    message: 'Login successful!',
                    token: jwt,
                    Result: results,
                    approved: UserApprovalEnum[results[0].approval]
                });
            });
        } catch (error) {
            console.error('Error validating OTP:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

auth.post("/login/email-otp", async (req, res) => {
    const { email } = req.body;

    db.query<RowDataPacket[]>('SELECT id FROM user_profiles WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
    
            return res.status(401).json({ message: 'Please signup first' });
        }

        try {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            console.log(`Generated OTP for ${email}: ${otp}`);

            await insertOTPInDBByEmail(otp, email);

            let html;
            try {
                html = await ejs.renderFile("mail/templates/otp.ejs", { otp: otp });
            } catch (renderError) {
                console.error('Error rendering email template:', renderError);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            console.log(email, process.env.EMAIL_HOST)
            const msg = {
                to: email,
                from: process.env.EMAIL_HOST!,
                subject: "MTD Login Code",
                html: html
            };

            sgMail.send(msg)
                .then(() => {
                    console.log("Approval email sent successfully");
                    return res.status(200).json({ message: 'Status updated successfully and email sent' });
                })
                .catch((error) => {
                    console.error('Error sending email:', error.response ? error.response.body : error);
                    return res.status(500).send('Internal Server Error');
                });

        } catch (error) {
            console.error('Error sending OTP:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    });
});


auth.post("/login/email", async (req, res) => {
    const { email, otp } = req.body;
    const usingGoogle = req.body.usingGoogle;

    if (usingGoogle) {
        const query = `
        SELECT 
            up.id AS profile_id, 
            up.user_id,
            up.email,
            up.gender,
            up.email_verified_at,
            up.location_id,
            up.religion_id,
            up.job_id,
            up.growth_id,
            up.study_id,
            up.first_name, 
            u.approval,
            MIN(m.id) AS media, 
            MIN(upers.id) AS personality, 
            MIN(qa.id) AS question_answer
        FROM 
            user_profiles up
        INNER JOIN 
            users u ON u.id = up.user_id
        LEFT JOIN 
            media m ON m.user_id = up.user_id
        LEFT JOIN 
            user_personalities upers ON upers.user_id = up.user_id
        LEFT JOIN 
            question_answers qa ON qa.user_id = up.user_id
        WHERE 
            up.email = ?
        GROUP BY 
            up.id, up.user_id, up.first_name, u.approval
        ORDER BY 
            up.created_at DESC;
        `;
        db.query<RowDataPacket[]>(query, [email], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid email' });
            }

            const jwt = sign({ email: email, userId: results[0].user_id }, process.env.JWT_SECRET as string, { expiresIn: '30 days' });

            return res.status(200).json({
                message: 'Login successful!',
                token: jwt,
                Result: results,
                approved: UserApprovalEnum[results[0].approval]
            });
        });
        return;
    }

    try {
        const verify = await getOTPFromDBByEmail(otp, email);
       
        if (!verify) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }
        const query = `
        SELECT 
            up.id AS profile_id, 
            up.user_id,
            up.email,
            up.gender,
            up.email_verified_at,
            up.location_id,
            up.religion_id,
            up.job_id,
            up.growth_id,
            up.study_id,
            up.first_name, 
            u.approval,
            MIN(m.id) AS media, 
            MIN(upers.id) AS personality, 
            MIN(qa.id) AS question_answer
        FROM 
            user_profiles up
        INNER JOIN 
            users u ON u.id = up.user_id
        LEFT JOIN 
            media m ON m.user_id = up.user_id
        LEFT JOIN 
            user_personalities upers ON upers.user_id = up.user_id
        LEFT JOIN 
            question_answers qa ON qa.user_id = up.user_id
        WHERE 
            up.email = ?
        GROUP BY 
            up.id, up.user_id, up.first_name, u.approval
        ORDER BY 
            up.created_at DESC;
        `;
        
        db.query<RowDataPacket[]>(query, [email], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (results.length === 0) {

                return res.status(401).json({ message: 'Invalid email' });
            }

            const jwt = sign({ email: email, userId: results[0].user_id }, process.env.JWT_SECRET as string, { expiresIn: '30 days' });

            return res.status(200).json({
                message: 'Login successful!',
                token: jwt,
                Result: results,
                approved: UserApprovalEnum[results[0].approval]
            });
        });

    } catch (error) {
        console.error('Error validating OTP:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to send OTP for signup
auth.post('/signup/otp', body('phone').notEmpty().withMessage('Phone number is required'), async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).json({ message: 'Invalid phone number' });
        return;
    }

    const { phone } = req.body;

    const query = 'SELECT id FROM user_profiles WHERE phone = ?';
    db.query<RowDataPacket[]>(query, [phone], async (err, results) => {
        if (err) {
            console.log('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.length > 0) {
            res.status(409).json({ message: 'This number is already in use. Try logging in as a returning user or sign up with another number.' });
            return;
        }

        try {
            await sendOTPtoPhoneNumber({ phone });
            res.status(200).json({ message: 'Code sent successfully!' });
        } catch (error: any) {
            // Handle specific error for invalid phone number
            if (error.message === 'Invalid phone number') {
                res.status(400).json({ message: 'Invalid phone number' });
            } else {
                const errorMessage = error.message || 'Internal Server Error';
                res.status(500).json({ message: 'Invalid phone number' });
            }
            console.error('Error sending OTP:', error);
        }
    });
});


// Route to verify OTP and signup
auth.post('/signup', body('otp').notEmpty().withMessage('Please enter valid code'), async (req: UserRequest, res: any) => {
    const result = validationResult(req);


    const { phone, otp } = req.body;

    try {
        const otpResponse = await verifyOTP({ phone, otp });
        if (otpResponse.status !== 'approved') {
            return res.status(401).json({ message: 'Invalid verification code' });
        }

        const query = 'SELECT id FROM user_profiles WHERE phone = ?';
        db.query<RowDataPacket[]>(query, [phone], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).send('Please Try Again');
            }

            if (results.length > 0) {
                return res.status(409).json({ message: 'User already exists' });
            }

            db.beginTransaction((err) => {
                if (err) {
                    console.error('Error starting transaction:', err);
                    return res.status(500).send('Internal Server Error');
                }

                const userQuery = `INSERT INTO users (approval, active, created_at, updated_at, incomplete_email, trial_popup_shown, is_online, last_activity, unseen_message_sent)
                VALUES (40, 1, NOW(), NOW(), 0, 0, 0, NOW(), 0)`;

                db.query<ResultSetHeader>(userQuery, (userErr, userResult) => {
                    if (userErr) {
                        return db.rollback(() => {
                            console.error('Error inserting user:', userErr);
                            res.status(500).send('Internal Server Error');
                        });
                    }

                    const userId = userResult.insertId;
                    console.log(userId);

                    const profileQuery = `INSERT INTO user_profiles (user_id, completed, phone, created_at, updated_at)
                          VALUES (?, 0, ?, NOW(), NOW())`;

                    db.query(profileQuery, [userId, phone], async (profileErr, profileResult) => {
                        if (profileErr) {
                            return db.rollback(() => {
                                console.error('Error inserting user profile:', profileErr);
                                res.status(500).send('Internal Server Error');
                            });
                        }

                        const customer = await stripe.customers.create({
                            phone: phone,
                        });

                        const stripeId = customer.id;

                        db.query('UPDATE users SET stripe_id = ? WHERE id = ?', [stripeId, userId], (err) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error('Error updating data:', err);
                                    res.status(500).send('Internal Server Error');
                                });
                            }

                            db.commit((commitErr) => {
                                if (commitErr) {
                                    return db.rollback(() => {
                                        console.error('Error committing transaction:', commitErr);
                                        res.status(500).send('Internal Server Error');
                                    });
                                }
                                const jwt = sign({ phone, userId }, process.env.JWT_SECRET as string, { expiresIn: '30 days' });
                                res.status(201).json({ message: 'Sign up successful', token: jwt, userId });
                            });
                        });

                    });
                });
            });
        });
    } catch (error) {
        console.error('Error validating OTP:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


auth.post("/verify", verifyUser, async (req: UserRequest, res) => {

    db.query<RowDataPacket[]>('SELECT email FROM user_profiles WHERE user_id = ?', [req.userId], async (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email' });
        }
       
        const urltoken = crypto.randomBytes(32).toString('hex');
        const token = `${process.env.URL}/user/verify/${urltoken}`;
        console.log(token)
        console.log(results[0].email)
        try {
            await mailService.sendVerificationMail(results[0].email, token);
        } catch (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Internal Server Error');
        }

        db.query('INSERT INTO verification_token (user_id, token, created_at) VALUES (?, ?, NOW())', [req.userId, urltoken], (err) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).json({ message: 'Verification email sent' });
        });
    });
});

auth.get("/verify/:token", async (req, res) => {
    const { token } = req.params;
    console.log(`${process.env.URL}/approve`); // Debugging line

    db.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).send('Internal Server Error');
        }

        db.query<RowDataPacket[]>('SELECT user_id FROM verification_token WHERE token = ?', [token], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                db.rollback(() => {
                    return res.status(500).send('Internal Server Error');
                });
                return;
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            const user_id = results[0].user_id;

            db.query('UPDATE users SET approval = 10 WHERE id = ?', [user_id], (err) => {
                if (err) {
                    console.error('Error updating data:', err);
                    db.rollback(() => {
                        return res.status(500).send('Internal Server Error');
                    });
                    return;
                }

                db.query('UPDATE user_profiles SET email_verified_at = NOW() WHERE user_id = ?', [user_id], (err) => {
                    if (err) {
                        console.error('Error updating data:', err);
                        db.rollback(() => {
                            return res.status(500).send('Internal Server Error');
                        });
                        return;
                    }

                    db.commit(err => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            return res.status(500).send('Internal Server Error');
                        }

                        db.query('SELECT first_name FROM user_profiles WHERE id = ?', [user_id], async (err, result:any) => {
                            if (err) {
                                console.error('Error fetching user data:', err);
                                return res.status(500).json({ message: 'Internal Server Error' });
                            }

                            const name = result.first_name;
                            const email = "hello@mytamildate.com"
                            try {
                                await mailService.sendVerificationMail(email, name);
                            } catch (error) {
                                console.error('Error sending email:', error);
                                return res.status(500).send('Internal Server Error');
                            }

                           
                        });
                            res.status(200).json({ message: 'Email verified successfully' });
                        });
                    });
                });
            });
        });
  
    });




auth.get("/check-approval", verifyUser, async (req: UserRequest, res) => {
    db.query<RowDataPacket[]>('SELECT approval, active FROM users WHERE id = ?', [req.userId], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid user' });
        }

        res.status(200).json({ approval: UserApprovalEnum[results[0].approval], active: results[0].active === 1 });
    });
});

auth.get("/check-email-verification", verifyUser, async (req: UserRequest, res) => {
    db.query<RowDataPacket[]>('SELECT email_verified_at FROM user_profiles WHERE user_id = ?', [req.userId], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid user' });
        }

        res.status(200).json({ emailVerified: results[0].email_verified_at !== null });
    });
});


export default auth;
