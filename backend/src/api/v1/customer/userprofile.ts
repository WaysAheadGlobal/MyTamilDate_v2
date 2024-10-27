import express from 'express';
import { db } from "../../../../db/db";
import { verifyUser } from '../../../middleware/verifyUser';
import { UserRequest } from '../../../types/types';
const { body, validationResult } = require('express-validator');
import multer from 'multer';
import crypto from 'crypto';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles');
  },
  filename: function (req, file, cb) {
    cb(null, crypto.randomBytes(16).toString('hex') + file.mimetype.replace('image/', '.'));
  }
});

const upload = multer({
  storage: storage
});

const profile = express.Router();


// Contact Us endpoint
profile.post('/contact', [
  body('email').isEmail().withMessage('Invalid email address'),
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('message').isString().notEmpty().withMessage('Message is required'),
  body('issue').isString().notEmpty().withMessage('Issue is required')
], (req: any, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, name, message, issue } = req.body;

  const query = `
    INSERT INTO contact_us (email, name, message, issue, created_at, updated_at)
    VALUES (?, ?, ?, ?, NOW(), NOW())
  `;

  db.query<ResultSetHeader>(query, [email, name, message, issue], (err, results) => {
    if (err) {
      console.error('Error inserting contact form data:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    res.status(201).json({ message: 'Contact form submitted successfully' });
  });
});
// Get all user profiles
profile.get('/', verifyUser, (req, res) => {
  const query = 'SELECT * FROM user_profiles';

  db.query<RowDataPacket[]>(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    return res.status(200).json({ message: 'User profiles retrieved successfully!', data: results });
  });
});

// Get the approval status of a specific user by ID
profile.get('/approval/:id', verifyUser, (req: UserRequest, res: express.Response) => {
  const userId = req.params.id;
  
  const query = 'SELECT approval FROM users WHERE id = ?';

  db.query<RowDataPacket[]>(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching approval status:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Approval status retrieved successfully!', approval: results[0].approval });
  });
});

//Update Email add to user Profile
profile.post('/updateemail', verifyUser, [
  body('email').isEmail().withMessage('Invalid email address')
], (req: UserRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  const userId = req.userId;

  // Log the values for debugging
  console.log(`Updating email for userId: ${userId}, new email: ${email}`);

  // Check if the email already exists
  const checkEmailQuery = 'SELECT user_id FROM user_profiles WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results:any) => {
    if (err) {
      console.error('Error checking email uniqueness:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length > 0 && results[0].user_id !== userId) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Proceed with the update if the email is unique
    const updateQuery = 'UPDATE user_profiles SET email = ?, updated_at = NOW() WHERE user_id = ?';
    db.query<ResultSetHeader>(updateQuery, [email, userId], (err, updateResults) => {
      if (err) {
        console.error('Error updating email:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (updateResults.affectedRows === 0) {
        return res.status(404).json({ message: 'User profile not found' });
      }

      const selectQuery = 'SELECT * FROM user_profiles WHERE user_id = ?';
      db.query(selectQuery, [userId], (err, updatedResults) => {
        if (err) {
          console.error('Error fetching updated profile data:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Email updated successfully', data: updatedResults });
      });
    });
  });
});


//update name,last name, brithday, gender , genderwan
profile.put('/namedetails', [
  verifyUser,
  body('first_name').isString().notEmpty().withMessage('First name is required'),
  body('birthday').isDate().withMessage('Birthday must be a valid date'),

], (req: UserRequest, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { first_name, last_name, birthday, } = req.body;
  const userId = req.userId;
  console.log(userId);

  const query = `
      UPDATE user_profiles
      SET first_name = ?, last_name = COALESCE(?, last_name), birthday = ?,  updated_at = NOW()
      WHERE user_id = ?
    `;

  db.query<ResultSetHeader>(query, [first_name, last_name, birthday, userId], (err, results) => {
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
profile.put('/brithday', [
  verifyUser,

  body('birthday').isDate().withMessage('Birthday must be a valid date'),


], (req: UserRequest, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { birthday, } = req.body;
  const userId = req.userId;
  console.log(userId);

  const query = `
      UPDATE user_profiles
      SET  birthday = ?,  updated_at = NOW()
      WHERE user_id = ?
    `;

  db.query<ResultSetHeader>(query, [birthday, userId], (err, results) => {
    if (err) {
      console.error('Error updating user profile:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    res.status(200).json({ message: 'Age updated successfully' });
  });
});

profile.get('/namedetails', verifyUser, (req: UserRequest, res: any) => {
  const userId = req.userId;
  const query = `
      SELECT first_name, last_name, birthday
      FROM user_profiles
      WHERE user_id = ?
  `;

  db.query<RowDataPacket[]>(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const userProfile = results[0];

    // Check if birthday is null before formatting
    if (userProfile.birthday) {
      const birthdayDate = new Date(userProfile.birthday);
      if (!isNaN(birthdayDate.getTime())) {
        userProfile.birthday = birthdayDate.toLocaleDateString('en-CA'); // 'en-CA' gives 'YYYY-MM-DD' format
      } else {
        userProfile.birthday = null; // or any other value you prefer to indicate an invalid date
      }
    } else {
      userProfile.birthday = null; // explicitly setting it to null if it was null in the database
    }

    res.status(200).json(userProfile);
  });
});


//gender want and whom to date
// Update gender and want_gender
profile.put('/gender', [
  verifyUser,
  body('gender').isInt().notEmpty().withMessage('Gender is required'),
  body('want_gender').isInt().withMessage('Gender want is required '),
], (req: UserRequest, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { gender, want_gender } = req.body;
  const userId = req.userId;
  console.log(userId);

  const query = `
      UPDATE user_profiles
      SET gender = ?, want_gender = ?, updated_at = NOW()
      WHERE user_id = ?
    `;

  db.query<ResultSetHeader>(query, [gender, want_gender, userId], (err, results) => {
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

profile.post('/language', [
  verifyUser,
  body('languages').isArray().withMessage('Languages must be an array of language IDs')
], (req: UserRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.userId;
  const { languages } = req.body;

  // Log the values for debugging
  console.log(`Updating languages for userId: ${userId}, languages: ${languages}`);

  // Remove existing language preferences for the user
  const deleteQuery = 'DELETE FROM user_languages WHERE user_id = ?';
  db.query(deleteQuery, [userId], (err) => {
    if (err) {
      console.error('Error deleting user languages:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Insert new language preferences
    const insertQuery = 'INSERT INTO user_languages (user_id, language_id, created_at, updated_at) VALUES ?';
    const values = languages.map((languageId: number) => [userId, languageId, new Date(), new Date()]);
    db.query(insertQuery, [values], (err) => {
      if (err) {
        console.error('Error inserting user languages:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      res.status(200).json({ message: 'Languages updated successfully' });
    });
  });
});

profile.get('/userlanguage', verifyUser, (req: UserRequest, res: express.Response) => {
  const userId = req.userId;

  const query = `
    SELECT ul.language_id, l.name, l.code
    FROM user_languages ul
    JOIN languages l ON ul.language_id = l.id
    WHERE ul.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user languages:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    res.status(200).json({ selectedLanguages: results });
  });
});

// API to get all languages
profile.get('/language', (req: express.Request, res: express.Response) => {
  const query = 'SELECT id, name FROM languages';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching languages:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    res.status(200).json({ languages: results });
  });
});


profile.get('/gender', verifyUser, (req: UserRequest, res: any) => {
  const userId = req.userId;
  const query = `
      SELECT gender, want_gender
      FROM user_profiles
      WHERE user_id = ?
  `;
  db.query<RowDataPacket[]>(query, [userId], (err, results) => {
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


//add locations and update user_profile with locations_id
profile.post('/locations', [
  verifyUser,
  body('location_id').isInt().withMessage('Location ID is required'),
], (req: UserRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { location_id } = req.body;
  const userId = req.userId;

  const query = 'UPDATE user_profiles SET location_id = ?, updated_at = NOW() WHERE user_id = ?';

  db.query<ResultSetHeader>(query, [location_id, userId], (err, results) => {
    if (err) {
      console.error('Error inserting location:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json({ message: 'Location added and user profile updated successfully' });
  });
});

profile.get('/locations', verifyUser, (req: UserRequest, res: express.Response) => {
  const userId = req.userId;

  const query = `
    SELECT l.id, l.country, l.location_string, l.continent
FROM locations l
JOIN user_profiles up ON l.id = up.location_id
WHERE up.user_id = ?
ORDER BY l.location_string ASC;
  `;

  db.query<RowDataPacket[]>(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching location:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json(results[0]);
  });
});

profile.get('/location-options', verifyUser, (req: UserRequest, res: express.Response) => {
  const query = `SELECT id, country, location_string, continent FROM locations`;

  db.query<RowDataPacket[]>(query, (err, results) => {
    if (err) {
      console.error('Error fetching location:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const locations = results.reduce((acc: any, location: any) => {
      if (!location.continent) return acc;

      if (!acc[location.country]) {
        acc[location.country] = [];
      }
      acc[location.country].push(location);
      return acc;
    }, {})

    res.status(200).json(locations);
  });
});

//add religions 
profile.post('/religions', [
  verifyUser,
  body('religionId').isInt().withMessage('Religion ID is required'),
], (req: UserRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { religionId } = req.body;
  const userId = req.userId;

  console.log(`UserId: ${userId}, Religion ID: ${religionId}`);

  const updateUserProfileQuery = 'UPDATE user_profiles SET religion_id = ?, updated_at = NOW() WHERE user_id = ?';

  db.query<ResultSetHeader>(updateUserProfileQuery, [religionId, userId], (err, updateResults) => {
    if (err) {
      console.error('Error updating user profile:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (updateResults.affectedRows === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json({ message: 'Religion updated successfully' });
  });
});

profile.get('/religions', verifyUser, (req: UserRequest, res: express.Response) => {
  const userId = req.userId;

  const getAllReligionsQuery = 'SELECT id, name FROM religions WHERE visible = 1';
  const getUserReligionQuery = 'SELECT r.id, r.name FROM religions r JOIN user_profiles up ON r.id = up.religion_id WHERE up.user_id = ?';

  db.query<RowDataPacket[]>(getAllReligionsQuery, (err, religions) => {
    if (err) {
      console.error('Error fetching religions:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    db.query<RowDataPacket[]>(getUserReligionQuery, [userId], (err, userReligionResults) => {
      if (err) {
        console.error('Error fetching user religion:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      let userReligion = null;
      if (userReligionResults.length > 0) {
        userReligion = userReligionResults[0];
      }

      res.status(200).json({ religions, userReligion });
    });
  });
});

profile.get('/growths-options', (req: UserRequest, res: express.Response) => {
  db.query('SELECT name, id FROM growths', (err, results) => {
    if (err) {
      console.error('Error fetching growths:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    res.status(200).json({ growths: results });
  });
});

profile.get('/growths', verifyUser, (req: UserRequest, res: express.Response) => {
  const userId = req.userId;

  console.log(`Fetching growths for UserId: ${userId}`);

  const query = `
    SELECT growths.id, growths.name, growths.visible, growths.created_at, growths.updated_at 
    FROM growths 
    JOIN user_profiles ON user_profiles.growth_id = growths.id 
    WHERE user_profiles.user_id = ?`;

  db.query<RowDataPacket[]>(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching growths:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No growths found for this user' });
    }

    res.status(200).json({ growths: results });
  });
});

//add growths and update user_profile with growths_id
profile.post('/growths', [
  verifyUser,
  body('growthId').isInt().withMessage('Growth ID is required'),
], (req: UserRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { growthId } = req.body;
  const userId = req.userId;

  console.log(`UserId: ${userId}, Growth ID: ${growthId}`);

  const updateUserProfileQuery = 'UPDATE user_profiles SET growth_id = ?, updated_at = NOW() WHERE user_id = ?';

  db.query<ResultSetHeader>(updateUserProfileQuery, [growthId, userId], (err, updateResults) => {
    if (err) {
      console.error('Error updating user profile:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (updateResults.affectedRows === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json({ message: 'Growth added and user profile updated successfully' });
  });
});


//add studies and update user_profile with studies_id
profile.post('/studies', [
  verifyUser,
  body('name').isString().notEmpty().withMessage('Study name is required'),
], (req: UserRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;
  const userId = req.userId;

  console.log(`UserId: ${userId}, Study Name: ${name}`);

  const query = 'INSERT INTO studies (name, visible, created_at, updated_at) VALUES (?, 1, NOW(), NOW())';

  db.query<ResultSetHeader>(query, [name], (err, results) => {
    if (err) {
      console.error('Error inserting study:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    const studyId = results.insertId;
    const updateUserProfileQuery = 'UPDATE user_profiles SET study_id = ?, updated_at = NOW() WHERE user_id = ?';

    db.query<ResultSetHeader>(updateUserProfileQuery, [studyId, userId], (err, updateResults) => {
      if (err) {
        console.error('Error updating user profile:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (updateResults.affectedRows === 0) {
        return res.status(404).json({ message: 'User profile not found' });
      }

      res.status(200).json({ message: 'Study added and user profile updated successfully' });
    });
  });
});

profile.get('/studies', verifyUser, (req: UserRequest, res: express.Response) => {
  const userId = req.userId;

  console.log(`Fetching studies for UserId: ${userId}`);

  const query = `
    SELECT studies.id, studies.name, studies.visible, studies.created_at, studies.updated_at 
    FROM studies 
    JOIN user_profiles ON user_profiles.study_id = studies.id 
    WHERE user_profiles.user_id = ?`;

  db.query<RowDataPacket[]>(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching studies:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No studies found for this user' });
    }

    res.status(200).json({ studies: results });
  });
});


profile.get('/jobs', verifyUser, (req: UserRequest, res: express.Response) => {
  const userId = req.userId;

  console.log(`Fetching jobs for UserId: ${userId}`);

  const query = `
    SELECT jobs.id, jobs.name, jobs.visible, jobs.created_at, jobs.updated_at 
    FROM jobs 
    JOIN user_profiles ON user_profiles.job_id = jobs.id 
    WHERE user_profiles.user_id = ?`;

  db.query<RowDataPacket[]>(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching jobs:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No jobs found for this user' });
    }

    res.status(200).json({ jobs: results });
  });
});


//add jobs and update user_profile with jobs_id
profile.post('/jobs', [
  verifyUser,
  body('name').isString().notEmpty().withMessage('Job name is required'),
], (req: UserRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;
  const userId = req.userId;

  console.log(`UserId: ${userId}, Job Name: ${name}`);

  const query = 'INSERT INTO jobs (name, visible, created_at, updated_at) VALUES (?, 1, NOW(), NOW())';

  db.query<ResultSetHeader>(query, [name], (err, results) => {
    if (err) {
      console.error('Error inserting job:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    const jobId = results.insertId;
    const updateUserProfileQuery = 'UPDATE user_profiles SET job_id = ?, updated_at = NOW() WHERE user_id = ?';

    db.query<ResultSetHeader>(updateUserProfileQuery, [jobId, userId], (err, updateResults) => {
      if (err) {
        console.error('Error updating user profile:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (updateResults.affectedRows === 0) {
        return res.status(404).json({ message: 'User profile not found' });
      }

      res.status(200).json({ message: 'Job added and user profile updated successfully' });
    });
  });
});

profile.get('/kids-family', verifyUser, (req: UserRequest, res: express.Response) => {
  db.query<RowDataPacket[]>('SELECT want_kid_id, have_kid_id FROM user_profiles WHERE user_id = ?', [req.userId], (err, results) => {
    if (err) {
      console.error('Error fetching kids-family:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json(results[0]);
  });
});

profile.get('/smoke-drink', verifyUser, (req: UserRequest, res: express.Response) => {
  db.query<RowDataPacket[]>('SELECT smoke_id, drink_id FROM user_profiles WHERE user_id = ?', [req.userId], (err, results) => {
    if (err) {
      console.error('Error fetching kids-family:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json(results[0]);
  });
});

//add want_kids and update user_profile with jobs_id.. family plans
profile.post('/update-want-kids', verifyUser, [
  body('want_kid_id').isInt().withMessage('Want Kid ID must be an integer')
], (req: UserRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { want_kid_id } = req.body;
  const userId = req.userId;

  // Log the values for debugging
  console.log(`Updating want_kid_id for userId: ${userId}, new want_kid_id: ${want_kid_id}`);

  const updateQuery = 'UPDATE user_profiles SET want_kid_id = ?, updated_at = NOW() WHERE user_id = ?';
  db.query<ResultSetHeader>(updateQuery, [want_kid_id, userId], (err, results) => {
    if (err) {
      console.error('Error updating want_kid_id:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const selectQuery = 'SELECT * FROM user_profiles WHERE user_id = ?';
    db.query(selectQuery, [userId], (err, updatedResults) => {
      if (err) {
        console.error('Error fetching updated profile data:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      res.status(200).json({ message: 'Want Kid ID updated successfully', data: updatedResults });
    });
  });
});

// Update have_kid_id in user profile
profile.post('/update-have-kids', verifyUser, [
  body('have_kid_id').isInt().withMessage('Have Kid ID must be an integer')
], (req: UserRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { have_kid_id } = req.body;
  const userId = req.userId;

  // Log the values for debugging
  console.log(`Updating have_kid_id for userId: ${userId}, new have_kid_id: ${have_kid_id}`);

  const updateQuery = 'UPDATE user_profiles SET have_kid_id = ?, updated_at = NOW() WHERE user_id = ?';
  db.query<ResultSetHeader>(updateQuery, [have_kid_id, userId], (err, results) => {
    if (err) {
      console.error('Error updating have_kid_id:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const selectQuery = 'SELECT * FROM user_profiles WHERE user_id = ?';
    db.query(selectQuery, [userId], (err, updatedResults) => {
      if (err) {
        console.error('Error fetching updated profile data:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      res.status(200).json({ message: 'Have Kid ID updated successfully', data: updatedResults });
    });
  });
});

//update do smoke or not
profile.post('/update-smoke', verifyUser, [
  body('smoke_id').isInt().withMessage('Smoke ID must be an integer')
], (req: UserRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { smoke_id } = req.body;
  const userId = req.userId;

  // Log the values for debugging
  console.log(`Updating smoke_id for userId: ${userId}, new smoke_id: ${smoke_id}`);

  const updateQuery = 'UPDATE user_profiles SET smoke_id = ?, updated_at = NOW() WHERE user_id = ?';
  db.query<ResultSetHeader>(updateQuery, [smoke_id, userId], (err, results) => {
    if (err) {
      console.error('Error updating smoke_id:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const selectQuery = 'SELECT * FROM user_profiles WHERE user_id = ?';
    db.query(selectQuery, [userId], (err, updatedResults) => {
      if (err) {
        console.error('Error fetching updated profile data:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      res.status(200).json({ message: 'Smoke ID updated successfully', data: updatedResults });
    });
  });
});

// Update drink_id in user profile
profile.post('/update-drink', verifyUser, [
  body('drink_id').isInt().withMessage('Drink ID must be an integer')
], (req: UserRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { drink_id } = req.body;
  const userId = req.userId;

  // Log the values for debugging
  console.log(`Updating drink_id for userId: ${userId}, new drink_id: ${drink_id}`);

  const updateQuery = 'UPDATE user_profiles SET drink_id = ?, updated_at = NOW() WHERE user_id = ?';
  db.query<ResultSetHeader>(updateQuery, [drink_id, userId], (err, results) => {
    if (err) {
      console.error('Error updating drink_id:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const selectQuery = 'SELECT * FROM user_profiles WHERE user_id = ?';
    db.query(selectQuery, [userId], (err, updatedResults) => {
      if (err) {
        console.error('Error fetching updated profile data:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      res.status(200).json({ message: 'Drink ID updated successfully', data: updatedResults });
    });
  });
});

profile.get('/personality-options', (req: UserRequest, res: express.Response) => {
  db.query('SELECT name, id FROM personalities', (err, results) => {
    if (err) {
      console.error('Error fetching personalities:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    res.status(200).json({ personalities: results });
  });
});

profile.get('/personalities', verifyUser, (req: UserRequest, res: express.Response) => {
  const userId = req.userId;

  console.log(`Fetching personalities for UserId: ${userId}`);

  const query = `
    SELECT p.id, p.name, p.visible, p.created_at, p.updated_at 
    FROM personalities p
    JOIN user_personalities up ON p.id = up.personality_id
    WHERE up.user_id = ?`;

  db.query<RowDataPacket[]>(query, [userId], (err, results) => {
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

profile.post('/personality', verifyUser, (req: UserRequest, res: express.Response) => {
  const { personalities } = req.body;
  const userId = req.userId;

  if (!userId || !Array.isArray(personalities)) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  // Start a transaction
  db.beginTransaction(err => {
    if (err) {
      console.error('Transaction Start Error:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Delete existing personalities
    db.query('DELETE FROM user_personalities WHERE user_id = ?', [userId], (err, results) => {
      if (err) {
        console.error('Error deleting personalities:', err);
        db.rollback(() => {
          return res.status(500).json({ message: 'Internal Server Error' });
        });
      } else {
        // Insert new personalities
        const query = 'INSERT INTO user_personalities (user_id, personality_id) VALUES ?';
        const values = personalities.map((personalityId: number) => [userId, personalityId]);

        db.query(query, [values], (err, results) => {
          if (err) {
            console.error('Error inserting personalities:', err);
            db.rollback(() => {
              return res.status(500).json({ message: 'Internal Server Error' });
            });
          } else {
            // Commit the transaction
            db.commit(err => {
              if (err) {
                console.error('Transaction Commit Error:', err);
                db.rollback(() => {
                  return res.status(500).json({ message: 'Internal Server Error' });
                });
              } else {
                res.status(200).json({ message: 'Personalities updated successfully' });
              }
            });
          }
        });
      }
    });
  });
});

profile.get('/questions', (req: UserRequest, res: express.Response) => {
  db.query('SELECT id, text as question FROM questions', (err, results) => {
    if (err) {
      console.error('Error fetching questions:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    res.status(200).json({ questions: results });
  });
});
profile.get('/questionss', verifyUser, (req: UserRequest, res: express.Response) => {
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

  db.query(sql, [userId], (err: Error | null, results: any) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.status(200).json({ questions: results });
  });
});

profile.post('/answer/:questionId', verifyUser, (req: UserRequest, res: express.Response) => {
  const { answer } = req.body;
  const userId = req.userId;
  const questionId = req.params.questionId;

  if (!answer) {
    return res.status(400).json({ message: 'Answer is required' });
  }

  db.beginTransaction(err => {

    if (err) {
      console.error('Transaction Start Error:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    const deleteQuery = 'DELETE FROM question_answers WHERE user_id = ? AND question_id = ?';

    db.query(deleteQuery, [userId, questionId], (err, results) => {
      if (err) {
        console.error('Error deleting answer:', err);
        db.rollback(() => {
          return res.status(500).json({ message: 'Internal Server Error' });
        });
      }

      const query = 'INSERT INTO question_answers (user_id, question_id, answer, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())';

      db.query(query, [userId, questionId, answer], (err, results) => {
        if (err) {
          console.error('Error inserting answer:', err);
          db.rollback(() => {
            return res.status(500).json({ message: 'Internal Server Error' });
          });
        }

        db.commit(err => {
          if (err) {
            console.error('Transaction Commit Error:', err);
            db.rollback(() => {
              return res.status(500).json({ message: 'Internal Server Error' });
            });
          }

          res.status(200).json({ message: 'Answer updated successfully' });
        });
      });
    });
  });
});

profile.get('/answer/:questionId', verifyUser, (req: UserRequest, res: express.Response) => {
  const userId = req.userId;
  const questionId = req.params.questionId;

  const query = 'SELECT answer FROM question_answers WHERE user_id = ? AND question_id = ?';

  db.query<RowDataPacket[]>(query, [userId, questionId], (err, results) => {
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

profile.get('/answers/count', verifyUser, (req: UserRequest, res: express.Response) => {
  const userId = req.userId;

  const query = 'SELECT COUNT(*) as count FROM question_answers WHERE user_id = ?';

  db.query<RowDataPacket[]>(query, [userId], (err, results) => {
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

profile.get('/questionanswer', (req: UserRequest, res: express.Response) => {
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

  db.query(sql, [userId], (err: Error | null, results: any) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.status(200).json(results);
  });
});

profile.put('/updatestatus', verifyUser, (req: UserRequest, res: express.Response) => {
  const { approval } = req.body;
  const userId = req.userId;

  if (!approval) {
    res.status(400).send('Bad Request: Missing  status');
    return;
  }

  const updateStatusSql = `
      UPDATE users
      SET approval = ?
      WHERE id = ?
  `;

  db.query(updateStatusSql, [approval, userId], (err: Error | null, result: any) => {
    if (err) {
      console.log('Error updating status:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(200).send('Status updated successfully');
  });
});

profile.get('/latestrejection', verifyUser, (req: UserRequest, res: express.Response) => {
  const userId = req.userId;

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


profile.get('/UpdateRejectReason', verifyUser, (req: UserRequest, res: express.Response) => {
  const userId = req.userId;

  const query = `
    SELECT rr.reason, r.created_at
    FROM notifications_popup r
    JOIN reject_reasons rr ON r.reason_id = rr.id
    WHERE r.user_id = ? 
    AND r.deleted_at IS NULL 
    AND r.type = 1
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

profile.put('/deleteLatestRejectReason', verifyUser, (req: UserRequest, res: express.Response) => {
  const userId = req.userId;

  // Find the latest rejection reason for the user
  const findLatestReasonQuery = `
    SELECT id
    FROM notifications_popup
    WHERE user_id = ? AND deleted_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
  `;

  db.query(findLatestReasonQuery, [userId], (err: Error | null, results: any) => {
    if (err) {
      console.error('Error fetching latest rejection reason:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No active rejection reason found for the user' });
    }

    const notificationId = results[0].id;

    // Perform a soft delete by setting deleted_at to the current timestamp
    const softDeleteReasonQuery = `
      UPDATE notifications_popup
      SET deleted_at = NOW()
      WHERE id = ?
    `;

    db.query(softDeleteReasonQuery, [notificationId], (err: Error | null, result: any) => {
      if (err) {
        console.error('Error soft deleting rejection reason:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Rejection reason not found or already deleted' });
      }

      return res.status(200).json({ message: 'Rejection reason deleted successfully' });
    });
  });
});




profile.post("/media",
  verifyUser,
  upload.fields([
    { name: 'main', maxCount: 1 },
    { name: 'first', maxCount: 1 },
    { name: 'second', maxCount: 1 },
  ]),
  async (req: UserRequest, res) => {
    const userId = req.userId;
    console.log(req.files);

    if (!req.files) {
      return res.status(400).send('No files were uploaded.');
    }

    const main = (req.files as any)['main'] ? (req.files as any)['main'][0] : null;
    const first = (req.files as any)['first'] ? (req.files as any)['first'][0] : null;
    const second = (req.files as any)['second'] ? (req.files as any)['second'][0] : null;

    // type 3 is for new media and then 1 is for avatar and 2 is for profile

    const query = 'INSERT INTO media (user_id, hash, extension, type, meta, created_at, updated_at) VALUES ?';
    const values = [
      [userId, main.filename.split(".")[0], main.mimetype.split("/")[1], 31, JSON.stringify(main), new Date(), new Date()],
      [userId, first.filename.split(".")[0], first.mimetype.split("/")[1], 32, JSON.stringify(first), new Date(), new Date()],
      [userId, second.filename.split(".")[0], second.mimetype.split("/")[1], 32, JSON.stringify(second), new Date(), new Date()]
    ];

    db.query(query, [values], (err, results) => {
      if (err) {
        console.error('Error inserting media:', err);
        return res.status(500).send('Internal Server Error');
      }

      res.status(200).json({ message: 'Media uploaded successfully' });
    });
  }
)


profile.post(
  "/mediaupdate",
  verifyUser,
  upload.fields([
    { name: 'main', maxCount: 1 },
    { name: 'first', maxCount: 1 },
    { name: 'second', maxCount: 1 },
  ]),
  async (req: UserRequest, res: express.Response) => {
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
    const file = (req.files as any)[fileKey][0];

    // Check if the media_id exists and is not pending approval
    const checkQuery = 'SELECT * FROM media WHERE id = ?';
    db.query(checkQuery, [mediaId], (err, results: any) => {
      if (err) {
        console.error('Error checking media_id:', err);
        return res.status(500).send('Internal Server Error');
      }

      if (results.length === 0) {
        return res.status(400).send('Invalid media ID.');
      }

      const query = `
        UPDATE media 
        SET user_id = ?, hash = ?, extension = ?, type = ?, meta = ?, updated_at = ?
        WHERE id = ?`;

      const values = [
        userId,
        file.filename.split(".")[0],
        file.mimetype.split("/")[1],
        type,
        JSON.stringify(file),
        new Date(),
        mediaId,
      ];

      db.query(query, values, (err, results) => {
        if (err) {
          console.error('Error updating media:', err);
          return res.status(500).send('Internal Server Error');
        }
        res.status(200).json({ message: 'Media updated successfully' });
      });
    });
  }
);



profile.get('/media', verifyUser, (req: UserRequest, res: express.Response) => {
  const userId = req.userId;

  const query = 'SELECT id, hash, extension, type FROM media WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching media:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.status(200).json(results);
  });
});

profile.put('/updatestatusagain', verifyUser, (req: UserRequest, res: express.Response) => {
  const userId = req.userId;

  // Check if userId is available
  if (!userId) {
    return res.status(400).send('User ID is missing.');
  }

  const updateStatusSql = `
    UPDATE users
    SET approval = 10 
    WHERE id = ?
  `;

  // Execute the query to update the user's approval status
  db.query(updateStatusSql, [userId], (err, result) => {
    if (err) {
      console.error('Error updating approval status:', err);
      return res.status(500).send('Internal Server Error');
    }
    // Success response
    res.status(200).json({ message: 'Your request for approval has been submitted.' });
  });
});


export default profile;