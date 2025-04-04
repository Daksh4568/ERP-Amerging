const nodemailer = require('nodemailer');

async function sendKickoffEmail({ recipientEmail, message, projectName, salesPersonName }) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: `Kickoff Meeting - ${projectName}`,
            html: `
        <h3>Kickoff Meeting Invitation</h3>
        <p><strong>Project:</strong> ${projectName}</p>
        <p><strong>Message:</strong><br>${message}</p>
        <p><strong>From:</strong> ${salesPersonName}</p>
        <hr />
        <p>Please be present and prepared for the meeting.</p>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${recipientEmail}`);
    } catch (error) {
        console.error(`❌ Error sending email to ${recipientEmail}:`, error.message);
    }
}

module.exports = sendKickoffEmail;
