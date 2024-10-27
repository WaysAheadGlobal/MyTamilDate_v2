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
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertOTPInDBByEmail = insertOTPInDBByEmail;
exports.getOTPFromDBByEmail = getOTPFromDBByEmail;
const db_1 = require("../db/db");
function insertOTPInDBByEmail(otp, email) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            db_1.db.query('SELECT * FROM OTP WHERE email = ?', [email], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (results.length > 0) {
                    // Email exists, update the OTP
                    db_1.db.query('UPDATE OTP SET otp = ?, modifiedDate = now(), DBTimeStamp = now() WHERE email = ?', [otp, email], (updateErr, updateResults) => {
                        if (updateErr) {
                            reject(updateErr);
                            return;
                        }
                        resolve(updateResults);
                    });
                }
                else {
                    // Email does not exist, insert new record
                    db_1.db.query('INSERT INTO OTP (otp, email, createdDate, modifiedDate, DBTimeStamp) VALUES (?, ?, now(), now(), now())', [otp, email], (insertErr, insertResults) => {
                        if (insertErr) {
                            reject(insertErr);
                            return;
                        }
                        resolve(insertResults);
                    });
                }
            });
        });
    });
}
function getOTPFromDBByEmail(otp, email) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            db_1.db.query('SELECT otp FROM OTP WHERE otp = ? AND email = ? ORDER BY createdDate DESC LIMIT 1', [otp, email], (err, results) => {
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
    });
}
