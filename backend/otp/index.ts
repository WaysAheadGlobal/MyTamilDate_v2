import twilio, { Twilio } from "twilio";
import { randomInt } from 'crypto';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;



if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
  throw new Error("Twilio credentials are not provided correctly.");
}

const client: Twilio = twilio(
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  { lazyLoading: true }
);

interface PhoneNumberDetails {
  phone: string;
}

interface OTPVerificationDetails extends PhoneNumberDetails {
  otp: string;
}

// In-memory storage for OTPs
const otpStore: { [phone: string]: { otp: string, expires: number } } = {};

// Function to send OTP
export async function sendOTPtoPhoneNumber({ phone }: PhoneNumberDetails): Promise<any> {
  const otp = randomInt(1000, 9999).toString(); 
  try {
    const message = await client.messages.create({
      body: `Your MTD Code is: ${otp}`,
      from: '+16473609147', // Your Twilio phone number
      to: phone
    });

    console.log(message);

    // Store OTP in memory with expiration time of 5 minutes
    otpStore[phone] = { otp, expires: Date.now() + 300000 };

    return { message: 'OTP sent successfully!' };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Function to verify OTP
// Function to verify OTP
export async function verifyOTP({ phone, otp }: OTPVerificationDetails): Promise<any> {
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
    } else {
      return { status: 'failed', message: 'Invalid verification code' };
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}


// Test Twilio connection
export async function testTwilioConnection(): Promise<boolean> {
  try {
    const account = await client.api.accounts(TWILIO_ACCOUNT_SID).fetch();
    console.log('Twilio connection successful:', account.friendlyName);
    return true;
  } catch (err: any) {
    console.error('Twilio connection failed:', err);
    if (err.status === 401) {
      console.error('Authentication failed. Check your Account SID and Auth Token.');
    }
    return false;
  }
}
