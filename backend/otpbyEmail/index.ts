import { db } from "../db/db";
import { RowDataPacket } from "mysql2";

export async function insertOTPInDBByEmail(otp: string, email: string) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM OTP WHERE email = ?', [email], (err, results:any) => {
            if (err) {
                reject(err);
                return;
            }

            if (results.length > 0) {
                // Email exists, update the OTP
                db.query('UPDATE OTP SET otp = ?, modifiedDate = now(), DBTimeStamp = now() WHERE email = ?', [otp, email], (updateErr, updateResults) => {
                    if (updateErr) {
                        reject(updateErr);
                        return;
                    }
                    resolve(updateResults);
                });
            } else {
                // Email does not exist, insert new record
                db.query('INSERT INTO OTP (otp, email, createdDate, modifiedDate, DBTimeStamp) VALUES (?, ?, now(), now(), now())', [otp, email], (insertErr, insertResults) => {
                    if (insertErr) {
                        reject(insertErr);
                        return;
                    }
                    resolve(insertResults);
                });
            }
        });
    });
}



export async function getOTPFromDBByEmail(otp: string, email: string) {
    return new Promise((resolve, reject) => {
        db.query('SELECT otp FROM OTP WHERE otp = ? AND email = ? ORDER BY createdDate DESC LIMIT 1', [otp, email], (err, results: RowDataPacket[]) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(results);
            if (results.length === 0) {
                resolve(null); // No rows found, return null
                return;
            }
            resolve(results[0].otp.toString());
        });
    });
}


