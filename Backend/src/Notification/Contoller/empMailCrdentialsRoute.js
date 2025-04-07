const EmpCredentials = require('../models/emp_MailCredentials');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');


exports.getEmpCredentials = async (event) => {
    try {

        await connectToDatabase();

        const credentials = await EmpCredentials.find({}, '-__v');

        const decryptedCredentials = credentials.map((cred) => {
            try {
                const iv = Buffer.from(cred.iv, 'hex');
                const decipher = crypto.createDecipheriv(algorithm, key, iv);
                let decryptedPassword = decipher.update(cred.officialMailpassword, 'hex', 'utf-8');
                decryptedPassword += decipher.final('utf-8');

                return {
                    _id: cred._id,
                    eID: cred.eID,
                    empName: cred.empName,
                    officialMail: cred.officialMail,
                    password: decryptedPassword,
                };
            } catch (err) {
                return {
                    _id: cred._id,
                    eID: cred.eID,
                    empName: cred.empName,
                    officialMail: cred.officialMail,
                    password: '⚠️ Decryption failed',
                };
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(decryptedCredentials),
        };
    } catch (error) {
        console.error("❌ Error fetching credentials:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
