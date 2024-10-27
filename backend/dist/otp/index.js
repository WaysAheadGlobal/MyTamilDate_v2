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
exports.sendOTPtoPhoneNumber = sendOTPtoPhoneNumber;
exports.verifyOTP = verifyOTP;
exports.testTwilioConnection = testTwilioConnection;
const twilio_1 = __importDefault(require("twilio"));
const crypto_1 = require("crypto");
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error("Twilio credentials are not provided correctly.");
}
const client = (0, twilio_1.default)(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { lazyLoading: true });
// In-memory storage for OTPs
const otpStore = {};
// Function to send OTP
function sendOTPtoPhoneNumber(_a) {
    return __awaiter(this, arguments, void 0, function* ({ phone }) {
        const otp = (0, crypto_1.randomInt)(1000, 9999).toString();
        try {
            const message = yield client.messages.create({
                body: `Your MTD Code is: ${otp}`,
                from: '+16473609147', // Your Twilio phone number
                to: phone
            });
            console.log(message);
            // Store OTP in memory with expiration time of 5 minutes
            otpStore[phone] = { otp, expires: Date.now() + 300000 };
            return { message: 'OTP sent successfully!' };
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    });
}
// Function to verify OTP
// Function to verify OTP
function verifyOTP(_a) {
    return __awaiter(this, arguments, void 0, function* ({ phone, otp }) {
        try {
            const storedOtpDetails = otpStore[phone];
            if (!storedOtpDetails) {
                return { status: 'failed', message: 'No OTP found for this phone number.' };
            }
            if (Date.now() > storedOtpDetails.expires) {
                delete otpStore[phone];
                return { status: 'failed', message: 'OTP has expired.' };
            }
            if (storedOtpDetails.otp === otp) {
                delete otpStore[phone];
                return { status: 'approved', message: 'OTP verified successfully!' };
            }
            else {
                return { status: 'failed', message: 'Invalid verification code' };
            }
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    });
}
// Test Twilio connection
function testTwilioConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const account = yield client.api.accounts(TWILIO_ACCOUNT_SID).fetch();
            console.log('Twilio connection successful:', account.friendlyName);
            return true;
        }
        catch (err) {
            console.error('Twilio connection failed:', err);
            if (err.status === 401) {
                console.error('Authentication failed. Check your Account SID and Auth Token.');
            }
            return false;
        }
    });
}
