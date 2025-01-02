const nodemailer = require('nodemailer');

const sendMail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = { from: process.env.EMAIL_USER, to, subject, text };
    await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
