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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = require("jsonwebtoken");
const express_validator_1 = require("express-validator");
const db_1 = require("../../../../db/db");
const otp_1 = require("../../../../otp");
const crypto_1 = __importDefault(require("crypto"));
const verifyUser_1 = require("../../../middleware/verifyUser");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const ejs_1 = __importDefault(require("ejs"));
const otpbyEmail_1 = require("../../../../otpbyEmail");
const UserApprovalEnum_1 = __importDefault(require("../../../enums/UserApprovalEnum"));
const stripe_1 = __importDefault(require("stripe"));
const mail_2 = __importDefault(require("../../../../mail"));
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const auth = (0, express_1.Router)();
let otpData = null;
const mailService = new mail_2.default();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
// Route to send OTP for login
auth.get('/test-twilio', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isConnected = yield (0, otp_1.testTwilioConnection)();
    if (isConnected) {
        res.status(200).send('Twilio connection successful');
    }
    else {
        res.status(500).send('Twilio connection failed');
    }
}));
// Route to send OTP for login
auth.post('/login/otp', [
    (0, express_validator_1.body)('phone').notEmpty().withMessage('Phone number is required'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { phone, countryCode } = req.body;
    const query = 'SELECT first_name FROM user_profiles WHERE phone = ?';
    db_1.db.query(query, phone, (err, results) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'We don’t recognize this phone number. Try signing up first' });
        }
        try {
            yield (0, otp_1.sendOTPtoPhoneNumber)({ phone: phone });
            return res.status(200).json({ message: 'OTP sent successfully!' });
            // return res.status(200).json({ message: 'Your OTP is ',otp });
        }
        catch (error) {
            console.error('Error sending OTP:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }));
}));
// Route to verify OTP and login
auth.post('/login', [
    (0, express_validator_1.body)('phone').notEmpty().withMessage('Phone number is required'),
    (0, express_validator_1.body)('otp').notEmpty().withMessage('OTP is required')
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { phone, otp } = req.body;
    try {
        const otpResponse = yield (0, otp_1.verifyOTP)({ phone: phone, otp });
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
        db_1.db.query(query, [phone], (err, results) => {
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
            const jwt = (0, jsonwebtoken_1.sign)({ phone: phone, userId: results[0].user_id }, process.env.JWT_SECRET, { expiresIn: '30 days' });
            return res.status(200).json({
                message: 'Login successful!',
                token: jwt,
                Result: results,
                approved: UserApprovalEnum_1.default[results[0].approval]
            });
        });
    }
    catch (error) {
        console.error('Error validating OTP:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}));
auth.post("/login/email-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    db_1.db.query('SELECT id FROM user_profiles WHERE email = ?', [email], (err, results) => __awaiter(void 0, void 0, void 0, function* () {
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
            yield (0, otpbyEmail_1.insertOTPInDBByEmail)(otp, email);
            let html;
            try {
                html = yield ejs_1.default.renderFile("mail/templates/otp.ejs", { otp: otp });
            }
            catch (renderError) {
                console.error('Error rendering email template:', renderError);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            console.log(email, process.env.EMAIL_HOST);
            const msg = {
                to: email,
                from: process.env.EMAIL_HOST,
                subject: "MTD Login Code",
                html: html
            };
            mail_1.default.send(msg)
                .then(() => {
                console.log("Approval email sent successfully");
                return res.status(200).json({ message: 'Status updated successfully and email sent' });
            })
                .catch((error) => {
                console.error('Error sending email:', error.response ? error.response.body : error);
                return res.status(500).send('Internal Server Error');
            });
        }
        catch (error) {
            console.error('Error sending OTP:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }));
}));
auth.post("/login/email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        db_1.db.query(query, [email], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid email' });
            }
            const jwt = (0, jsonwebtoken_1.sign)({ email: email, userId: results[0].user_id }, process.env.JWT_SECRET, { expiresIn: '30 days' });
            return res.status(200).json({
                message: 'Login successful!',
                token: jwt,
                Result: results,
                approved: UserApprovalEnum_1.default[results[0].approval]
            });
        });
        return;
    }
    try {
        const verify = yield (0, otpbyEmail_1.getOTPFromDBByEmail)(otp, email);
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
        db_1.db.query(query, [email], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid email' });
            }
            const jwt = (0, jsonwebtoken_1.sign)({ email: email, userId: results[0].user_id }, process.env.JWT_SECRET, { expiresIn: '30 days' });
            return res.status(200).json({
                message: 'Login successful!',
                token: jwt,
                Result: results,
                approved: UserApprovalEnum_1.default[results[0].approval]
            });
        });
    }
    catch (error) {
        console.error('Error validating OTP:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}));
// Route to send OTP for signup
auth.post('/signup/otp', (0, express_validator_1.body)('phone').notEmpty().withMessage('Phone number is required'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json({ message: 'Invalid phone number' });
        return;
    }
    const { phone } = req.body;
    const query = 'SELECT id FROM user_profiles WHERE phone = ?';
    db_1.db.query(query, [phone], (err, results) => __awaiter(void 0, void 0, void 0, function* () {
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
            yield (0, otp_1.sendOTPtoPhoneNumber)({ phone });
            res.status(200).json({ message: 'Code sent successfully!' });
        }
        catch (error) {
            // Handle specific error for invalid phone number
            if (error.message === 'Invalid phone number') {
                res.status(400).json({ message: 'Invalid phone number' });
            }
            else {
                const errorMessage = error.message || 'Internal Server Error';
                res.status(500).json({ message: 'Invalid phone number' });
            }
            console.error('Error sending OTP:', error);
        }
    }));
}));
// Route to verify OTP and signup
auth.post('/signup', (0, express_validator_1.body)('otp').notEmpty().withMessage('Please enter valid code'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    const { phone, otp } = req.body;
    try {
        const otpResponse = yield (0, otp_1.verifyOTP)({ phone, otp });
        if (otpResponse.status !== 'approved') {
            return res.status(401).json({ message: 'Invalid verification code' });
        }
        const query = 'SELECT id FROM user_profiles WHERE phone = ?';
        db_1.db.query(query, [phone], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).send('Please Try Again');
            }
            if (results.length > 0) {
                return res.status(409).json({ message: 'User already exists' });
            }
            db_1.db.beginTransaction((err) => {
                if (err) {
                    console.error('Error starting transaction:', err);
                    return res.status(500).send('Internal Server Error');
                }
                const userQuery = `INSERT INTO users (approval, active, created_at, updated_at, incomplete_email, trial_popup_shown, is_online, last_activity, unseen_message_sent)
                VALUES (40, 1, NOW(), NOW(), 0, 0, 0, NOW(), 0)`;
                db_1.db.query(userQuery, (userErr, userResult) => {
                    if (userErr) {
                        return db_1.db.rollback(() => {
                            console.error('Error inserting user:', userErr);
                            res.status(500).send('Internal Server Error');
                        });
                    }
                    const userId = userResult.insertId;
                    console.log(userId);
                    const profileQuery = `INSERT INTO user_profiles (user_id, completed, phone, created_at, updated_at)
                          VALUES (?, 0, ?, NOW(), NOW())`;
                    db_1.db.query(profileQuery, [userId, phone], (profileErr, profileResult) => __awaiter(void 0, void 0, void 0, function* () {
                        if (profileErr) {
                            return db_1.db.rollback(() => {
                                console.error('Error inserting user profile:', profileErr);
                                res.status(500).send('Internal Server Error');
                            });
                        }
                        const customer = yield stripe.customers.create({
                            phone: phone,
                        });
                        const stripeId = customer.id;
                        db_1.db.query('UPDATE users SET stripe_id = ? WHERE id = ?', [stripeId, userId], (err) => {
                            if (err) {
                                return db_1.db.rollback(() => {
                                    console.error('Error updating data:', err);
                                    res.status(500).send('Internal Server Error');
                                });
                            }
                            db_1.db.commit((commitErr) => {
                                if (commitErr) {
                                    return db_1.db.rollback(() => {
                                        console.error('Error committing transaction:', commitErr);
                                        res.status(500).send('Internal Server Error');
                                    });
                                }
                                const jwt = (0, jsonwebtoken_1.sign)({ phone, userId }, process.env.JWT_SECRET, { expiresIn: '30 days' });
                                res.status(201).json({ message: 'Sign up successful', token: jwt, userId });
                            });
                        });
                    }));
                });
            });
        });
    }
    catch (error) {
        console.error('Error validating OTP:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
auth.post("/verify", verifyUser_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    db_1.db.query('SELECT email FROM user_profiles WHERE user_id = ?', [req.userId], (err, results) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email' });
        }
        const urltoken = crypto_1.default.randomBytes(32).toString('hex');
        const token = `${process.env.URL}/user/verify/${urltoken}`;
        console.log(token);
        console.log(results[0].email);
        try {
            yield mailService.sendVerificationMail(results[0].email, token);
        }
        catch (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Internal Server Error');
        }
        db_1.db.query('INSERT INTO verification_token (user_id, token, created_at) VALUES (?, ?, NOW())', [req.userId, urltoken], (err) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).json({ message: 'Verification email sent' });
        });
    }));
}));
auth.get("/verify/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    console.log(`${process.env.URL}/approve`); // Debugging line
    db_1.db.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).send('Internal Server Error');
        }
        db_1.db.query('SELECT user_id FROM verification_token WHERE token = ?', [token], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                db_1.db.rollback(() => {
                    return res.status(500).send('Internal Server Error');
                });
                return;
            }
            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            const user_id = results[0].user_id;
            db_1.db.query('UPDATE users SET approval = 10 WHERE id = ?', [user_id], (err) => {
                if (err) {
                    console.error('Error updating data:', err);
                    db_1.db.rollback(() => {
                        return res.status(500).send('Internal Server Error');
                    });
                    return;
                }
                db_1.db.query('UPDATE user_profiles SET email_verified_at = NOW() WHERE user_id = ?', [user_id], (err) => {
                    if (err) {
                        console.error('Error updating data:', err);
                        db_1.db.rollback(() => {
                            return res.status(500).send('Internal Server Error');
                        });
                        return;
                    }
                    db_1.db.commit(err => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            return res.status(500).send('Internal Server Error');
                        }
                        db_1.db.query('SELECT first_name FROM user_profiles WHERE id = ?', [user_id], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                            if (err) {
                                console.error('Error fetching user data:', err);
                                return res.status(500).json({ message: 'Internal Server Error' });
                            }
                            const name = result.first_name;
                            const email = "hello@mytamildate.com";
                            try {
                                yield mailService.sendVerificationMail(email, name);
                            }
                            catch (error) {
                                console.error('Error sending email:', error);
                                return res.status(500).send('Internal Server Error');
                            }
                        }));
                        res.status(200).json({ message: 'Email verified successfully' });
                    });
                });
            });
        });
    });
}));
auth.get("/check-approval", verifyUser_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    db_1.db.query('SELECT approval, active FROM users WHERE id = ?', [req.userId], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid user' });
        }
        res.status(200).json({ approval: UserApprovalEnum_1.default[results[0].approval], active: results[0].active === 1 });
    });
}));
auth.get("/check-email-verification", verifyUser_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    db_1.db.query('SELECT email_verified_at FROM user_profiles WHERE user_id = ?', [req.userId], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid user' });
        }
        res.status(200).json({ emailVerified: results[0].email_verified_at !== null });
    });
}));
exports.default = auth;
