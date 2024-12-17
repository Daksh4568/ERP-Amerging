const nodemailer = require('nodemailer')

async function sendEmployeeCredentials(email, officialEmail, password, empName) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // `true` for port 465, `false` for other ports
            auth: {
                user: process.env.EMAIL_USER, // Gmail email
                pass: process.env.EMAIL_PASSWORD, // App password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Amerging Technology',
            html: `
                <h3>Welcome to Amerging Technologies</h3>
                <p>Dear ${empName},</p>
                <p>Your account has been successfully created . Below are your login credentials:</p>
                <ul>
                    <li><strong>Official Email ID:</strong> ${officialEmail}</li>
                    <li><strong>Password:</strong> ${password}</li>
                </ul>
                <p>Please login and change your password at your earliest convenience.</p>
                <p>Best regards,<br>Amerging Technologies</p>
            `,
        };
        await transporter.sendMail(mailOptions)
        console.log('Email sent successfully')

    } catch (error) {
        console.error('Error sending mail :', error)
    }
}
module.exports = sendEmployeeCredentials;