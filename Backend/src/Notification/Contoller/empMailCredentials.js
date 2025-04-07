const EmpCredentials = require('../models/emp_MailCredentials');
const crypto = require('crypto');
const connectToDatabase = require("../../HR Module/db/db");

const algorithm = 'aes-256-cbc';

const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Must be 32 bytes (64 hex chars)

exports.saveEmpCredentials = async (empData, user) => {
    try {
        await connectToDatabase();

        const { eID, officialMail, empName, officialMailpassword } = empData;

        if (!eID || !officialMail || !officialMailpassword) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing required fields." }),
            };
        }

        const iv = crypto.randomBytes(16); // Initialization vector
        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encryptedPassword = cipher.update(officialMailpassword, 'utf-8', 'hex');
        encryptedPassword += cipher.final('hex');

        const existing = await EmpCredentials.findOne({ eID });

        if (existing) {
            // Update
            existing.officialMail = officialMail;
            existing.empName = empName;
            existing.officialMailpassword = encryptedPassword;
            existing.iv = iv.toString('hex');
            await existing.save();
        } else {
            // Create new
            const newCred = new EmpCredentials({
                eID,
                officialMail,
                empName,
                officialMailpassword: encryptedPassword,
                iv: iv.toString('hex'),
                addedBy: {
                    name: user.name,
                    role: user.role
                }
            });

            await newCred.save();
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Credentials saved successfully." }),
        };

    } catch (err) {
        console.error("Error saving credentials:", err);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal Server Error",
                error: err.message,
            }),
        };
    }
};
