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
const crypto_1 = __importDefault(require("crypto"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profiles');
    },
    filename: function (req, file, cb) {
        cb(null, crypto_1.default.randomBytes(16).toString('hex') + file.mimetype.replace('image/', '.'));
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB 
    }
});
const updateprofile = express_1.default.Router();
updateprofile.post("/mediaupdate", verifyUser_1.verifyUser, upload.fields([
    { name: 'main', maxCount: 1 },
    { name: 'first', maxCount: 1 },
    { name: 'second', maxCount: 1 },
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const mediaId = req.body.media_id;
    const type = req.body.type;
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }
    const fileKeys = Object.keys(req.files);
    if (fileKeys.length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const fileKey = fileKeys[0];
    const file = req.files[fileKey][0];
    const checkQuery = 'SELECT * FROM media_update WHERE media_id = ?';
    db_1.db.query(checkQuery, [mediaId], (err, results) => {
        if (err) {
            console.error('Error checking media_id:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            return res.status(400).send('Image already sent for admin approval.');
        }
        const query = 'INSERT INTO media_update (user_id,media_id, hash, extension, type, meta, created_at, updated_at) VALUES (?,?, ?, ?, ?, ?, ?, ?)';
        const values = [
            userId,
            mediaId,
            file.filename.split(".")[0],
            file.mimetype.split("/")[1],
            type,
            JSON.stringify(file),
            new Date(),
            new Date(),
        ];
        db_1.db.query(query, values, (err, results) => {
            if (err) {
                console.error('Error inserting media:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).json({ message: 'Media uploaded successfully' });
        });
    });
}));
updateprofile.post("/media", verifyUser_1.verifyUser, upload.fields([
    { name: 'main', maxCount: 1 },
    { name: 'first', maxCount: 1 },
    { name: 'second', maxCount: 1 },
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    console.log(req.files);
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }
    const main = req.files['main'] ? req.files['main'][0] : null;
    const first = req.files['first'] ? req.files['first'][0] : null;
    const second = req.files['second'] ? req.files['second'][0] : null;
    // type 3 is for new media and then 1 is for avatar and 2 is for profile
    const query = 'INSERT INTO media (user_id, hash, extension, type, meta, created_at, updated_at) VALUES ?';
    const values = [
        [userId, main.filename.split(".")[0], main.mimetype.split("/")[1], 31, JSON.stringify(main), new Date(), new Date()],
        [userId, first.filename.split(".")[0], first.mimetype.split("/")[1], 32, JSON.stringify(first), new Date(), new Date()],
        [userId, second.filename.split(".")[0], second.mimetype.split("/")[1], 32, JSON.stringify(second), new Date(), new Date()]
    ];
    db_1.db.query(query, [values], (err, results) => {
        if (err) {
            console.error('Error inserting media:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json({ message: 'Media uploaded successfully' });
    });
}));
updateprofile.get('/media', verifyUser_1.verifyUser, (req, res) => {
    const userId = req.userId;
    console.log(userId);
    const query = 'SELECT id, hash, extension, type FROM media WHERE user_id = ?';
    db_1.db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching media:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(results);
    });
});
updateprofile.delete("/media/:id", verifyUser_1.verifyUser, (req, res) => {
    const userId = req.userId;
    const mediaId = req.params.id;
    const query = 'DELETE FROM media WHERE id = ? AND user_id = ?';
    db_1.db.query(query, [mediaId, userId], (err, results) => {
        if (err) {
            console.error('Error deleting media:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Media not found or not authorized to delete this media.');
        }
        res.status(200).json({ message: 'Media deleted successfully' });
    });
});
updateprofile.put("/media/:id", verifyUser_1.verifyUser, upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const mediaId = req.params.id;
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file was uploaded.');
    }
    const query = 'UPDATE media SET hash = ?, extension = ?, meta = ?, updated_at = ? WHERE id = ? AND user_id = ?';
    const values = [
        file.filename.split(".")[0],
        file.mimetype.split("/")[1],
        JSON.stringify(file),
        new Date(),
        mediaId,
        userId
    ];
    db_1.db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error updating media:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Media not found or not authorized to update this media.');
        }
        res.status(200).json({ message: 'Media updated successfully' });
    });
}));
//   updateprofile.get('/updated-media', verifyUser, (req: UserRequest, res: express.Response) => {
//     const userId = req.userId;
//     const query = `
//         SELECT 
//             mu.media_id AS id,
//             mu.type,
//             mu.hash,
//             mu.extension,
//         FROM media_update mu
//         INNER JOIN media m ON m.id = mu.media_id
//         WHERE m.user_id = ?
//     `;
//     db.query<RowDataPacket[]>(query, [userId], (err, results) => {
//         if (err) {
//             console.error('Error fetching media:', err);
//             return res.status(500).send('Internal Server Error');
//         }
//         res.status(200).json(results);
//     });
// });
updateprofile.get('/updated-media', verifyUser_1.verifyUser, (req, res) => {
    const userId = req.userId;
    console.log(userId);
    const query = 'SELECT media_id as id, hash, extension, type FROM media_update WHERE user_id = ?';
    db_1.db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching media:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(results);
    });
});
// DELETE route to delete media updates by user_id
updateprofile.delete('/delete-media', verifyUser_1.verifyUser, (req, res) => {
    const userId = req.userId;
    console.log('Deleting media for user ID:', userId);
    const query = 'DELETE FROM media_update WHERE user_id = ?';
    db_1.db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error deleting media:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).send('Media updates deleted successfully');
    });
});
updateprofile.get('/questionanswer', (req, res) => {
    const userId = req.userId;
    const sql = `
        SELECT 
            qa.question_id,
            q.text AS question,
            qa.answer,
            qa.created_at,
            qa.updated_at
        FROM 
            question_answers qa
        JOIN 
            questions q ON qa.question_id = q.id
        WHERE 
            qa.user_id = ?
    `;
    db_1.db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).json(results);
    });
});
updateprofile.get('/personality-options', (req, res) => {
    db_1.db.query('SELECT name, id FROM personalities', (err, results) => {
        if (err) {
            console.error('Error fetching personalities:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json({ personalities: results });
    });
});
updateprofile.get('/personalities', verifyUser_1.verifyUser, (req, res) => {
    const userId = req.userId;
    console.log(`Fetching personalities for UserId: ${userId}`);
    const query = `
      SELECT p.id, p.name, p.visible, p.created_at, p.updated_at 
      FROM personalities p
      JOIN user_personalities up ON p.id = up.personality_id
      WHERE up.user_id = ?`;
    db_1.db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching personalities:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No personalities found for this user' });
        }
        res.status(200).json({ personalities: results });
    });
});
updateprofile.get('/personality-options', (req, res) => {
    db_1.db.query('SELECT name, id FROM personalities', (err, results) => {
        if (err) {
            console.error('Error fetching personalities:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json({ personalities: results });
    });
});
updateprofile.post('/personality', verifyUser_1.verifyUser, (req, res) => {
    const { personalities } = req.body;
    const userId = req.userId;
    if (!userId || !Array.isArray(personalities)) {
        return res.status(400).json({ message: 'Invalid request' });
    }
    // Start a transaction
    db_1.db.beginTransaction(err => {
        if (err) {
            console.error('Transaction Start Error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        // Delete existing personalities
        db_1.db.query('DELETE FROM user_personalities WHERE user_id = ?', [userId], (err, results) => {
            if (err) {
                console.error('Error deleting personalities:', err);
                db_1.db.rollback(() => {
                    return res.status(500).json({ message: 'Internal Server Error' });
                });
            }
            else {
                // Insert new personalities
                const query = 'INSERT INTO user_personalities (user_id, personality_id) VALUES ?';
                const values = personalities.map((personalityId) => [userId, personalityId]);
                db_1.db.query(query, [values], (err, results) => {
                    if (err) {
                        console.error('Error inserting personalities:', err);
                        db_1.db.rollback(() => {
                            return res.status(500).json({ message: 'Internal Server Error' });
                        });
                    }
                    else {
                        // Commit the transaction
                        db_1.db.commit(err => {
                            if (err) {
                                console.error('Transaction Commit Error:', err);
                                db_1.db.rollback(() => {
                                    return res.status(500).json({ message: 'Internal Server Error' });
                                });
                            }
                            else {
                                res.status(200).json({ message: 'Personalities updated successfully' });
                            }
                        });
                    }
                });
            }
        });
    });
});
//profile Completion track
updateprofile.get('/profileCompletion', verifyUser_1.verifyUser, (req, res) => {
    const userId = req.userId;
    const sql = `SELECT * FROM user_profiles WHERE user_id = ?`;
    db_1.db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error retrieving user profile data:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('User profile not found');
        }
        const profile = results[0];
        // const completionPercentage = calculateCompletionPercentage(profile);
        const totalFields = 15; // Number of fields used to calculate completion
        let completedFields = 0;
        // List of fields to consider for profile completion
        const fields = [
            'first_name', 'email', 'phone', 'birthday',
            'location_id', 'gender', 'want_gender', 'study_id', 'job_id',
            'growth_id', 'religion_id', 'want_kid_id', 'have_kid_id',
            'smoke_id', 'drink_id'
        ];
        fields.forEach(field => {
            if (profile[field] !== null && profile[field] !== undefined && profile[field] !== '') {
                completedFields++;
            }
        });
        const completionPercentage = Math.floor((completedFields / totalFields) * 100);
        res.status(200).json({ completionPercentage });
    });
});
//All details of Profile
updateprofile.get('/profileDetails', verifyUser_1.verifyUser, (req, res) => {
    const userId = req.userId;
    console.log(userId);
    const sql = `
        SELECT 
            up.first_name AS Name,
            up.last_name AS Surname,
            up.email AS Email,
            uso.approval AS Approval,
            DATE_FORMAT(up.email_verified_at, '%Y-%m-%d') AS 'EmailVerifiedAt',
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
            END AS 'PreferredGender',
            st.name AS 'StudyField',
            j.name AS 'JobTitle',
            g.name AS 'Height',
            r.name AS Religion,
            wk.name AS 'WantChildren',
            hk.name AS 'HaveChildren',
            s.name AS 'Smoker',
            d.name AS 'Drinker',
            DATE_FORMAT(up.created_at, '%Y-%m-%d') AS 'ProfileCreatedAt',
            DATE_FORMAT(up.updated_at, '%Y-%m-%d') AS 'ProfileUpdatedAt',
            
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
    db_1.db.query(sql, [userId], (err, results) => {
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
updateprofile.get('/userlanguage', verifyUser_1.verifyUser, (req, res) => {
    const userId = req.userId;
    const query = `
    SELECT ul.language_id, l.name, l.code
    FROM user_languages ul
    JOIN languages l ON ul.language_id = l.id
    WHERE ul.user_id = ?
  `;
    db_1.db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user languages:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json({ selectedLanguages: results });
    });
});
// Fetch user questions by user_id
updateprofile.get('/questions', verifyUser_1.verifyUser, (req, res) => {
    const userId = req.userId;
    console.log(userId);
    const sql = `
      SELECT 
          qa.question_id,
          q.text AS question,
          qa.answer,
          qa.created_at,
          qa.updated_at
      FROM 
          question_answers qa
      JOIN 
          questions q ON qa.question_id = q.id
      WHERE 
          qa.user_id = ?
  `;
    db_1.db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).json(results);
    });
});
updateprofile.get('/questionss', verifyUser_1.verifyUser, (req, res) => {
    const userId = req.userId;
    const sql = `
    SELECT 
        q.id AS question_id,
        q.text AS question,
        qa.answer,
        qa.created_at,
        qa.updated_at
    FROM 
        questions q
    LEFT JOIN 
        question_answers qa ON qa.question_id = q.id AND qa.user_id = ?
  `;
    db_1.db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).json({ questions: results });
    });
});
updateprofile.get('/answer/:questionId', verifyUser_1.verifyUser, (req, res) => {
    const userId = req.userId;
    const questionId = req.params.questionId;
    const query = 'SELECT answer FROM question_answers WHERE user_id = ? AND question_id = ?';
    db_1.db.query(query, [userId, questionId], (err, results) => {
        if (err) {
            console.error('Error fetching answer:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Answer not found' });
        }
        res.status(200).json(results[0]);
    });
});
updateprofile.post('/answer/:questionId', verifyUser_1.verifyUser, (req, res) => {
    const { answer } = req.body;
    const userId = req.userId;
    const questionId = req.params.questionId;
    if (!answer) {
        return res.status(400).json({ message: 'Answer is required' });
    }
    db_1.db.beginTransaction(err => {
        if (err) {
            console.error('Transaction Start Error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        const deleteQuery = 'DELETE FROM question_answers_update WHERE user_id = ? AND question_id = ?';
        db_1.db.query(deleteQuery, [userId, questionId], (err, results) => {
            if (err) {
                console.error('Error deleting answer:', err);
                db_1.db.rollback(() => {
                    return res.status(500).json({ message: 'Internal Server Error' });
                });
            }
            const query = 'INSERT INTO question_answers_update (user_id, question_id, answer, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())';
            db_1.db.query(query, [userId, questionId, answer], (err, results) => {
                if (err) {
                    console.error('Error inserting answer:', err);
                    db_1.db.rollback(() => {
                        return res.status(500).json({ message: 'Internal Server Error' });
                    });
                }
                db_1.db.commit(err => {
                    if (err) {
                        console.error('Transaction Commit Error:', err);
                        db_1.db.rollback(() => {
                            return res.status(500).json({ message: 'Internal Server Error' });
                        });
                    }
                    res.status(200).json({ message: 'Answer updated successfully' });
                });
            });
        });
    });
});
updateprofile.get('/updateanswers/count', verifyUser_1.verifyUser, (req, res) => {
    const userId = req.userId;
    const query = 'SELECT COUNT(*) as count FROM question_answers_update WHERE user_id = ?';
    db_1.db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching answer count:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No answers found' });
        }
        res.status(200).json({ count: results[0].count });
    });
});
// Add this endpoint to your updateprofile router
updateprofile.delete('/answer/:questionId', verifyUser_1.verifyUser, (req, res) => {
    const userId = req.userId;
    const questionId = req.params.questionId;
    const deleteQuery = 'DELETE FROM question_answers WHERE user_id = ? AND question_id = ?';
    db_1.db.query(deleteQuery, [userId, questionId], (err, results) => {
        if (err) {
            console.error('Error deleting answer:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Answer deleted successfully' });
    });
});
// Update gender and want_gender
updateprofile.put('/gender', [
    verifyUser_1.verifyUser,
    body('gender').isInt().notEmpty().withMessage('Gender is required'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { gender } = req.body;
    const userId = req.userId;
    console.log(userId);
    const query = `
      UPDATE user_profiles
      SET gender = ?, updated_at = NOW()
      WHERE user_id = ?
    `;
    db_1.db.query(query, [gender, userId], (err, results) => {
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
updateprofile.put('/wantgender', [
    verifyUser_1.verifyUser,
    body('want_gender').isInt().notEmpty().withMessage('Gender is required'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { want_gender } = req.body;
    const userId = req.userId;
    console.log(userId);
    const query = `
      UPDATE user_profiles
      SET want_gender = ?, updated_at = NOW()
      WHERE user_id = ?
    `;
    db_1.db.query(query, [want_gender, userId], (err, results) => {
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
// updateprofile.put('/wantgender', [
//   verifyUser,
//   body('want_gender').isInt().notEmpty().withMessage('Gender is required'),
// ], (req: UserRequest, res: any) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   const { want_gender } = req.body;
//   const userId = req.userId;
//   console.log(userId);
//   db.beginTransaction((err) => {
//     if (err) {
//       console.error('Transaction Error:', err);
//       return res.status(500).send('Internal Server Error');
//     }
//     // Update want_gender in user_profiles
//     const updateProfileQuery = `
//       UPDATE user_profiles
//       SET want_gender = ?, updated_at = NOW()
//       WHERE user_id = ?
//     `;
//     db.query<ResultSetHeader>(updateProfileQuery, [want_gender, userId], (err, results) => {
//       if (err) {
//         console.error('Error updating user profile:', err);
//         db.rollback(() => {
//           return res.status(500).send('Internal Server Error');
//         });
//         return;
//       }
//       if (results.affectedRows === 0) {
//         db.rollback(() => {
//           return res.status(404).json({ message: 'User profile not found' });
//         });
//         return;
//       }
//       // Update gender_id in filters table
//       const updateGenderPreferenceQuery = `
//         UPDATE filters
//         SET gender_id = ?
//         WHERE user_id = ?
//       `;
//       db.query<ResultSetHeader>(updateGenderPreferenceQuery, [want_gender, userId], (err, result) => {
//         if (err) {
//           console.error('Error updating gender preference:', err);
//           db.rollback(() => {
//             return res.status(500).send('Internal Server Error');
//           });
//           return;
//         }
//         db.commit((err) => {
//           if (err) {
//             console.error('Commit Error:', err);
//             db.rollback(() => {
//               return res.status(500).send('Internal Server Error');
//             });
//             return;
//           }
//           res.status(200).json({ message: 'Profile and preferences updated successfully' });
//         });
//       });
//     });
//   });
// });
exports.default = updateprofile;
