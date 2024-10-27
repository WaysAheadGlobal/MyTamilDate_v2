import { Router, Request, Response } from 'express';
import { db } from "../../../../db/db";
import { AdminRequest } from '../../../types/types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const promotions = Router();

// Get all promotional codes
promotions.get('/', (req: AdminRequest, res: Response) => {
    const { limit = 50, pageNo = 1 } = req.query;
    const limitNum = Number(limit);
    const pageNoNum = Number(pageNo);
    const offset = Math.max(0, (pageNoNum - 1) * limitNum); // Ensure offset is non-negative

    if (isNaN(limitNum) || isNaN(pageNoNum)) {
        return res.status(400).json({ message: 'Invalid limit or pageNo' });
    }

    const countSql = 'SELECT COUNT(*) AS total FROM promotional_codes WHERE deleted_at IS NULL';
    const dataSql = `
        SELECT pc.*, COUNT(pcu.id) AS usages
        FROM promotional_codes pc
        LEFT JOIN promotional_codes_usages pcu ON pc.id = pcu.promotional_codes_id
        WHERE pc.deleted_at IS NULL
        GROUP BY pc.id
        LIMIT ? OFFSET ?
    `;

    db.query<RowDataPacket[]>(countSql, (err, countResult) => {
        if (err) {
            console.error('Error fetching total count:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        const total = countResult[0].total;

        db.query(dataSql, [limitNum, offset], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.status(200).json({ total, results });
        });
    });
});

// Get promotional code by ID
promotions.get('/:id', (req: AdminRequest, res: Response) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM promotional_codes WHERE id = ? AND deleted_at IS NULL';
    db.query<RowDataPacket[]>(sql, [id], (err, results) => {
        if (err) {
            console.log('Error fetching data:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Promotional code not found' });
        }
        res.status(200).json(results[0]);
    });
});

// Create a new promotional code
// promotions.post('/', (req: AdminRequest, res: Response) => {
//     const {
//         promo_id, amount_off, percent_off, available_to, available_from,
//         applies_to, max_redemptions, once_per_user, stripe_id
//     } = req.body;

//     // Check if required fields are missing
//     if (!promo_id || max_redemptions == null) {
//         return res.status(400).json({ message: 'Fields are required' });
//     }

//     // Check if promo_id already exists
//     const checkSql = `
//         SELECT COUNT(*) AS count FROM promotional_codes WHERE promo_id = ?
//     `;
//     const checkValues = [promo_id];

//     db.query<RowDataPacket[]>(checkSql, checkValues, (err, rows) => {
//         if (err) {
//             console.error('Error checking promo_id:', err);
//             return res.status(500).json({ message: 'Internal Server Error' });
//         }

//         const count = rows[0].count;
//         if (count > 0) {
//             return res.status(400).json({ message: 'Promo ID already exists. Please choose a unique ID.' });
//         }

//         // If promo_id is unique, proceed with insertion
//         const insertSql = `
//             INSERT INTO promotional_codes (
//                 promo_id, amount_off, percent_off, available_to, available_from,
//                 applies_to, max_redemptions, once_per_user, stripe_id, created_at, updated_at
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
//         `;
//         const insertValues = [
//             promo_id, amount_off, percent_off, available_to, available_from,
//             applies_to, max_redemptions, once_per_user, stripe_id
//         ];

//         db.query<ResultSetHeader>(insertSql, insertValues, (err, result) => {
//             if (err) {
//                 console.error('Error creating promotional code:', err);
//                 return res.status(500).json({ message: 'Internal Server Error' });
//             }

//             res.status(201).json({ message: 'Promotional code created successfully', id: result.insertId });
//         });
//     });
// });

// Make sure to replace with your actual Stripe secret key


promotions.post('/', async (req: AdminRequest, res: Response) => {
    const {
        promo_id, amount_off, percent_off, available_to, available_from,
        applies_to, max_redemptions, once_per_user, duration, duration_in_months
    } = req.body;

    if (!promo_id || max_redemptions == null) {
        return res.status(400).json({ message: 'Fields are required' });
    }

    // Ensure applies_to is an array or convert it to an array
    let appliesToArray: string[] = [];
    if (applies_to) {
        if (Array.isArray(applies_to)) {
            appliesToArray = applies_to;
        } else {
            appliesToArray = [applies_to];
        }
    }

    const checkSql = `
      SELECT COUNT(*) AS count FROM promotional_codes WHERE promo_id = ?
    `;
    const checkValues = [promo_id];

    db.query<RowDataPacket[]>(checkSql, checkValues, async (err, rows) => {
        if (err) {
            console.error('Error checking promo_id:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        const count = rows[0].count;
        if (count > 0) {
            return res.status(400).json({ message: 'Promo ID already exists. Please choose a unique ID.' });
        }

        const amountOffValue = amount_off ? Math.round(parseFloat(amount_off) * 100) : null;

        try {
            let couponData: Record<string, any> = {
                id : promo_id,
                duration: once_per_user === 1 ? "once" : "forever",
                max_redemptions: max_redemptions,
                redeem_by: available_to ? Math.floor(new Date(available_to).getTime() / 1000) : null,
                applies_to: appliesToArray.length ? { products: appliesToArray } : undefined,
            };

            if (percent_off) {
                couponData.percent_off = percent_off;
            } else if (amount_off) {
                couponData.amount_off = amountOffValue;
                couponData.currency = 'cad';
            }

            const stripeCoupon = await stripe.coupons.create(couponData);
            // const stripePromotionCode = await stripe.promotionCodes.create({
            //     coupon: stripeCoupon.id,
            //     code: promo_id,
            //     max_redemptions: max_redemptions,
            //     restrictions: {
            //         first_time_transaction: !!once_per_user,
            //     }
            // });

            const insertSql = `
                INSERT INTO promotional_codes (
                    promo_id, amount_off, percent_off, available_to, available_from,
                    applies_to, max_redemptions, once_per_user, stripe_id, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `;
            const insertValues = [
                promo_id, amount_off, percent_off, available_to, available_from,
               appliesToArray[0], max_redemptions, once_per_user,  promo_id
            ];

            db.query<ResultSetHeader>(insertSql, insertValues, (err, result) => {
                if (err) {
                    console.error('Error creating promotional code:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                res.status(201).json({ message: 'Promotional code created successfully', id: result.insertId });
            });
        } catch (stripeErr) {
            console.error('Error creating promotional code in Stripe:', stripeErr);
            return res.status(500).json({ message: 'Error creating promotional code in Stripe' });
        }
    });
});

// Edit a promotional code
promotions.put('/:id', async (req: AdminRequest, res: Response) => {
    const { id } = req.params;
    const {
      promo_id, amount_off, percent_off, available_to, available_from,
      applies_to, max_redemptions, once_per_user, stripe_id
    } = req.body;
  
    try {
      // Retrieve existing promo_id from the database
      const [promoCode]: any = await new Promise((resolve, reject) => {
        const sqlSelect = 'SELECT promo_id FROM promotional_codes WHERE id = ? AND deleted_at IS NULL';
        db.query<any>(sqlSelect, [id], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
  
      if (!promoCode) {
        return res.status(404).json({ message: 'Promotional code not found or already deleted' });
      }
  
      const { promo_id: existingPromoId } = promoCode;
  
      // Ensure applies_to is an array or convert it to an array
      let appliesToArray: string[] = [];
      if (applies_to) {
        if (Array.isArray(applies_to)) {
          appliesToArray = applies_to;
        } else {
          appliesToArray = [applies_to];
        }
      }
  
      const amountOffValue = amount_off ? Math.round(parseFloat(amount_off) * 100) : null;
  
      // Update Stripe coupon
      let updateData: Record<string, any> = {
        id: promo_id || existingPromoId,
        max_redemptions: max_redemptions,
        redeem_by: available_to ? Math.floor(new Date(available_to).getTime() / 1000) : null,
        applies_to: appliesToArray.length ? { products: appliesToArray } : undefined,
      };
  
      if (percent_off) {
        updateData.percent_off = percent_off;
      } else if (amount_off) {
        updateData.amount_off = amountOffValue;
        updateData.currency = 'cad';
      }
  
      await stripe.coupons.update(existingPromoId, updateData);
  
      // Update in the database
      const sql = `
        UPDATE promotional_codes SET
          promo_id = ?, amount_off = ?, percent_off = ?, available_to = ?, available_from = ?,
          applies_to = ?, max_redemptions = ?, once_per_user = ?, stripe_id = ?, updated_at = NOW()
        WHERE id = ? AND deleted_at IS NULL
      `;
      const values = [
        promo_id || existingPromoId, amount_off, percent_off, available_to, available_from,
        appliesToArray[0], max_redemptions, once_per_user, promo_id || existingPromoId, id
      ];
  
      db.query<ResultSetHeader>(sql, values, (err, result) => {
        if (err) {
          console.log('Error updating data:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Promotional code not found or already deleted' });
        }
  
        res.status(200).json({ message: 'Promotional code updated successfully' });
      });
    } catch (err) {
      console.error('Error updating promotional code:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Soft delete a promotional code
// Soft delete a promotional code
promotions.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Retrieve promo_id from the database
        const [promoCode] : any = await new Promise((resolve, reject) => {
            const sqlSelect = 'SELECT promo_id FROM promotional_codes WHERE id = ? AND deleted_at IS NULL';
            db.query(sqlSelect, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (!promoCode) {
            return res.status(404).json({ message: 'Promotional code not found or already deleted' });
        }

        const { promo_id } = promoCode;

        // Soft delete in the database
        const result :any = await new Promise((resolve, reject) => {
            const sqlUpdate = 'UPDATE promotional_codes SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL';
            db.query(sqlUpdate, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Promotional code not found or already deleted' });
        }

        // Delete from Stripe using promo_id
        const deleted = await stripe.coupons.del(promo_id);

        if (deleted.deleted) {
            return res.status(200).json({ message: 'Promotional code deleted successfully' });
        } else {
            return res.status(500).json({ message: 'Failed to delete promotional code from Stripe' });
        }
    } catch (err) {
        console.log('Error deleting promotional code:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default promotions;
