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
const express_1 = __importDefault(require("express"));
const db_1 = require("../../../../db/db");
const verifyUser_1 = require("../../../middleware/verifyUser");
const { body, validationResult } = require('express-validator');
const multer_1 = __importDefault(require("multer"));
const moment_1 = __importDefault(require("moment"));
const crypto_1 = __importDefault(require("crypto"));
const otp_1 = require("../../../../otp");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const ejs_1 = __importDefault(require("ejs"));
const otpbyEmail_1 = require("../../../../otpbyEmail");
const mail_2 = __importDefault(require("../../../../mail"));
console.log(process.env.URL);
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profiles');
    },
    filename: function (req, file, cb) {
        cb(null, crypto_1.default.randomBytes(16).toString('hex') + file.mimetype.replace('image/', '.'));
    }
});
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB 
    }
});
const setting = express_1.default.Router();
// name update
const mailService = new mail_2.default();
setting.get('/namedetails', verifyUser_1.verifyUser, (req, res) => {
    const userId = req.userId;
    const query = `
    SELECT first_name, last_name, email, phone, active, deleted_at
    FROM user_profiles
    JOIN users ON user_profiles.user_id = users.id
    WHERE user_profiles.user_id = ?
`;
    db_1.db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user profile:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        const userProfile = results[0];
        res.status(200).json(userProfile);
    });
});
setting.put('/namedetails', [
    verifyUser_1.verifyUser,
    body('first_name').isString().notEmpty().withMessage('First name is required'),
    body('last_name').optional().isString().withMessage('Last name must be a string')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { first_name, last_name, } = req.body;
    const userId = req.userId;
    console.log(userId);
    const query = `
        UPDATE user_profiles
        SET first_name = ?, last_name = COALESCE(?, last_name),   updated_at = NOW()
        WHERE user_id = ?
      `;
    db_1.db.query(query, [first_name, last_name, userId], (err, results) => {
        if (err) {
            console.error('Error updating user profile:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.status(200).json({ message: 'Profile updated successfully' });
    });
});
//   update phone number
setting.post('/updatephone/otp', body('phone').isMobilePhone(), verifyUser_1.verifyUser, (req, res) => {
    const result = validationResult(req);
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
            res.status(200).json({ message: 'OTP sent successfully!' });
        }
        catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
            console.error('Error sending OTP:', error);
        }
    }));
});
setting.post('/updatephone', [body('phone').isMobilePhone(), body('otp').notEmpty()], verifyUser_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
    const userId = req.userId;
    const { phone, otp } = req.body;
    console.log(phone, otp);
    try {
        const otpResponse = yield (0, otp_1.verifyOTP)({ phone: phone, otp });
        if (otpResponse.status !== 'approved') {
            return res.status(401).json({ message: otpResponse.message });
        }
        db_1.db.beginTransaction((err) => {
            if (err) {
                console.error('Error starting transaction:', err);
                return res.status(500).send('Internal Server Error');
            }
            const updateQuery = 'UPDATE user_profiles SET phone = ? WHERE user_id = ?';
            db_1.db.query(updateQuery, [phone, userId], (err, results) => {
                if (err) {
                    return db_1.db.rollback(() => {
                        console.error('Error updating phone number:', err);
                        res.status(500).send('Internal Server Error');
                    });
                }
                db_1.db.commit((err) => {
                    if (err) {
                        return db_1.db.rollback(() => {
                            console.error('Error committing transaction:', err);
                            res.status(500).send('Internal Server Error');
                        });
                    }
                    res.status(200).json({ message: 'Phone number updated successfully!' });
                });
            });
        });
    }
    catch (error) {
        console.error('Error validating OTP:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
//update the Email by Email confimations
setting.get('/getemail', verifyUser_1.verifyUser, (req, res) => {
    const userId = req.userId;
    // Log the value for debugging
    console.log(`Fetching email for userId: ${userId}`);
    const query = 'SELECT email FROM user_profiles WHERE user_id = ?';
    db_1.db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching email:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.status(200).json({ email: results[0].email });
    });
});
// setting.put('/updateemail', verifyUser, [
//     body('email').isEmail().withMessage('Invalid email address')
// ], async (req: UserRequest, res: any) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     const { email } = req.body;
//     const userId = req.userId;
//     // Log the values for debugging
//     console.log(`Updating email for userId: ${userId}, new email: ${email}`);
//     const checkEmailQuery = 'SELECT id FROM user_profiles WHERE email = ?';
//     db.query<RowDataPacket[]>(checkEmailQuery, [email], async (err, results) => {
//         if (err) {
//             console.error('Error checking email:', err);
//             return res.status(500).json({ message: 'Internal Server Error' });
//         }
//         if (results.length > 0) {
//             return res.status(409).json({ message: 'This email address is already in use. Try with a different email.' });
//         }
//         const token = crypto.randomBytes(32).toString('hex');
//         // Render the email template
//         let html;
//         console.log(`${process.env.URL}/api/v1/customer/setting/verify/${token}`)
//         try {
//             html = await ejs.renderFile("mail/templates/verify.ejs", { link: `${process.env.URL}/api/v1/customer/setting/verify/${token}` });
//         } catch (renderError) {
//             console.error('Error rendering email template:', renderError);
//             return res.status(500).json({ message: 'Internal Server Error' });
//         }
//         // Send verification email
//         const msg = {
//             to: email,
//             from: process.env.EMAIL_HOST!,
//             subject: "Email Verification",
//             html: html
//         };
//         sgMail.send(msg)
//             .then(() => {
//                 // Save or update the token in the database
//                 const insertTokenQuery = `
//                     INSERT INTO verification_token (user_id, token, email, created_at)
//                     VALUES (?, ?, ?, NOW())
//                     ON DUPLICATE KEY UPDATE token = VALUES(token), email = VALUES(email), created_at = VALUES(created_at)
//                 `;
//                 db.query(insertTokenQuery, [userId, token, email], (err) => {
//                     if (err) {
//                         console.error('Error inserting data:', err);
//                         return res.status(500).send('Internal Server Error');
//                     }
//                     res.status(200).json({ message: 'Verification email sent' });
//                 });
//             })
//             .catch((error) => {
//                 console.error('Error sending email:', error);
//                 return res.status(500).send('Internal Server Error');
//             });
//     });
// });
// setting.get("/verify/:token", async (req, res) => {
//     const { token } = req.params;
//     const query = 'SELECT user_id, email FROM verification_token WHERE token = ?';
//     db.query<RowDataPacket[]>(query, [token], (err, results) => {
//         if (err) {
//             console.error('Error fetching data:', err);
//             return res.redirect(`${process.env.URL}/accountsetting`);
//         }
//         if (results.length === 0) {
//             console.log('No results found for the provided token');
//             return res.status(401).json({ message: 'Invalid token' });
//         }
//         const { user_id: userId, email } = results[0];
//         console.log(`Fetched from verification_token: userId = ${userId}, email = ${email}`);
//         db.beginTransaction((err) => {
//             if (err) {
//                 console.error('Error starting transaction:', err);
//                 return res.redirect(`${process.env.URL}/accountsetting`);
//             }
//             // Update the email in user_profiles
//             const updateEmailQuery = 'UPDATE user_profiles SET email = ?, email_verified_at = NOW() WHERE user_id = ?';
//             db.query(updateEmailQuery, [email, userId], (err) => {
//                 if (err) {
//                     console.error('Error updating email:', err);
//                     return db.rollback(() => res.redirect(`${process.env.URL}/accountsetting`));
//                 }
//                 // Commit the transaction
//                 db.commit((err) => {
//                     if (err) {
//                         console.error('Error committing transaction:', err);
//                         return res.status(500).send('Internal Server Error');
//                     }
//                     console.log('Email successfully updated');
//                     res.redirect(`${process.env.URL}/accountsetting`);
//                 });
//             });
//         });
//     });
// });
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
// Send OTP to email  and update it
setting.post('/request-email-update', verifyUser_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const userId = req.userId;
    const otp = generateOTP();
    const checkEmailQuery = 'SELECT id FROM user_profiles WHERE email = ?';
    db_1.db.query(checkEmailQuery, [email], (err, results) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (results.length > 0) {
            return res.status(409).json({ message: 'This email address is already in use. Try with a different email.' });
        }
        if (results.length === 0) {
            try {
                console.log('email otp', otp);
                yield (0, otpbyEmail_1.insertOTPInDBByEmail)(otp, email);
                let html;
                try {
                    html = yield ejs_1.default.renderFile("mail/templates/otp.ejs", { otp: otp });
                }
                catch (renderError) {
                    console.error('Error rendering email template:', renderError);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                const msg = {
                    to: email,
                    from: "hello@mytamildate.com",
                    subject: "MTD code",
                    html: html
                };
                mail_1.default.send(msg)
                    .then(() => {
                    console.log("Approval email sent successfully");
                    console.log(msg);
                    return res.status(200).json({ message: 'Status updated successfully and email sent' }); // Ensure this line returns JSON
                })
                    .catch((error) => {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Internal Server Error' }); // Ensure this line returns JSON
                });
            }
            catch (error) {
                console.error('Error sending OTP:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }));
}));
setting.put("/verifyotp", verifyUser_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = req.userId;
    console.log(userID);
    const { email, otp } = req.body;
    console.log("email", email);
    try {
        console.log(email, otp);
        const verify = yield (0, otpbyEmail_1.getOTPFromDBByEmail)(otp, email);
        if (!verify) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        const updateSql = `UPDATE user_profiles SET email = ?, updated_at = NOW() WHERE user_id = ?`;
        const params = [email, userID];
        console.log('SQL Query:', updateSql);
        console.log('Params:', params);
        db_1.db.query(updateSql, params, (err, results) => {
            if (err) {
                console.log('Error executing update query:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            console.log('Update results:', results);
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Fetch the updated user details
            const selectSql = `SELECT * FROM user_profiles WHERE user_id = ?`;
            db_1.db.query(selectSql, [userID], (err, userResults) => {
                if (err) {
                    console.log('Error fetching updated user details:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                console.log('Updated user details:', userResults);
                return res.status(200).json({ message: 'Email Updated Successfully', user: userResults[0] });
            });
        });
    }
    catch (error) {
        console.log('Error in OTP verification:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}));
//pause Account
setting.put('/pause', verifyUser_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        db_1.db.query(`
            UPDATE users
            SET active = 0, updated_at = NOW()
            WHERE id = ?
        `, [userId], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error('Error processing account pause:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            yield mailService.sendPauseAccountMail(req.user.email, req.user.first_name);
            return res.status(200).json({ message: 'User account paused successfully' });
        }));
    }
    catch (err) {
        console.error('Error processing account pause:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}));
setting.put('/unpause', verifyUser_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const query2 = `
            UPDATE users
            SET active = 1, updated_at = NOW()
            WHERE id = ?
        `;
        yield db_1.db.promise().query(query2, [userId]);
        return res.status(200).json({ message: 'User account paused successfully' });
    }
    catch (err) {
        console.error('Error processing account pause:', err);
        return res.status(500).send('Internal Server Error');
    }
}));
// delete account 
setting.post('/delete-reason', [
    verifyUser_1.verifyUser,
    body('reason_id').isInt().withMessage('Reason ID must be an integer'),
    body('reason_description').optional().isString().withMessage('Reason description must be a string')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { reason_id, reason_description } = req.body;
    const userId = req.userId;
    const query = `
        INSERT INTO user_delete_reasons (user_id, reason_id, reason_description, created_at, updated_at)
        VALUES (?, ?, ?, NOW(), NOW())
    `;
    db_1.db.query(query, [userId, reason_id, reason_description], (err, results) => {
        if (err) {
            console.error('Error storing delete reason:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json({ message: 'Delete reason submitted successfully' });
    });
});
setting.delete('/delete/:userId', verifyUser_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    // Query to fetch user by ID
    const selectUserQuery = 'SELECT * FROM users WHERE id = ?';
    db_1.db.query(selectUserQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        const user = results[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const salt = `_deleted_${(0, moment_1.default)().format('x')}`;
        // Update user table
        const updateUserQuery = `
            UPDATE users
            SET deleted_at = NOW(), active = false
            WHERE id = ?
        `;
        db_1.db.query(updateUserQuery, [userId], (err, updateResult) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            // Update user_profiles table
            const updateProfileQuery = `
                UPDATE user_profiles
                SET email = CONCAT(email, ?), phone = CONCAT(phone, ?)
                WHERE user_id = ?
            `;
            db_1.db.query(updateProfileQuery, [salt, salt, userId], (err, profileUpdateResult) => {
                if (err) {
                    console.error('Error updating profile:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                // Handle success case
                return res.status(200).json({ message: 'User deleted successfully' });
            });
        });
    });
}));
exports.default = setting;
