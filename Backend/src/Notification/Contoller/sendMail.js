const nodemailer = require('nodemailer');
const Employee = require('../models/Employee');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32-byte key

const sendMail = async (userId, to, subject, text, cc = []) => {
    // 1. Fetch employee from DB
    const employee = await Employee.findById(userId);
    if (!employee || !employee.email || !employee.emailPassword || !employee.iv) {
        throw new Error("Sender email credentials not found.");
    }

    // 2. Decrypt the stored encrypted password
    const iv = Buffer.from(employee.iv, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decryptedPassword = decipher.update(employee.emailPassword, 'hex', 'utf8');
    decryptedPassword += decipher.final('utf8');

    // 3. Create transporter using decrypted password
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: employee.email,
            pass: decryptedPassword,
        },
    });

    // 4. Mail options, including CC
    const mailOptions = {
        from: employee.email,
        to,
        subject,
        text,
        cc, // CC should be array or comma-separated string of emails
    };

    // 5. Send the mail
    await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
