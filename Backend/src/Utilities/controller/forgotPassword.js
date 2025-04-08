const OtpModel = require('../models/forgotMailOTPSchema');
const Employee = require('../../HR Module/models/empMaster-model'); // Assuming this is EmployeeMaster
const nodemailer = require('nodemailer');
const connectToDatabase = require('../../HR Module/db/db');

exports.handler = async (event) => {
    await connectToDatabase();
    const { personalEmail } = JSON.parse(event.body);

    if (!personalEmail) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Email is required' }),
        };
    }

    // ✅ Check if the email exists in EmployeeMaster
    const employee = await Employee.findOne({ personalEmail: personalEmail });

    if (!employee) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'No employee found with this email.' }),
        };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 10 min expiry

    // ✅ Replace or insert OTP tied to the email
    await OtpModel.findOneAndUpdate(
        { personalEmail },
        { otp, expiresAt },
        { upsert: true, new: true }
    );

    // ✅ Send email
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: personalEmail,
        subject: 'Your OTP for Password Reset',
        text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'OTP sent successfully' }),
    };
};
