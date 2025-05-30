const OtpModel = require('../models/forgotMailOTPSchema');
const connectToDatabase = require('../../HR Module/db/db');

exports.handler = async (event) => {
    await connectToDatabase();
    const { officialEmail, otp } = JSON.parse(event.body);

    if (!officialEmail || !otp) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Email and OTP required' }) };
    }

    const record = await OtpModel.findOne({ officialEmail });

    if (!record || record.otp !== otp || record.expiresAt < new Date()) {
        return { statusCode: 401, body: JSON.stringify({ message: 'Invalid or expired OTP' }) };
    }

    // OTP is valid, delete it
    await OtpModel.deleteOne({ officialEmail });

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'OTP verified successfully' })
    };
};
