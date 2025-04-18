const EmpCredentials = require('../models/emp_MailCredentials')
const { auth, authorize } = require('../../HR Module/middleware/auth'); // Authentication middleware
const connectToDatabase = require('../../HR Module/db/db'); // MongoDB connection handler
const crypto = require("crypto")
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const emailFormatController = require('../Contoller/empMailFormatController')
const sendOtpHandler = require('../../Utilities/controller/forgotPassword')
const verifyOtpHandler = require('../../Utilities/controller/verifyOtp')
const resetPasswordHandler = require('../../Utilities/controller/updatePassword')
exports.handler = async (event) => {
    try {

        await connectToDatabase();

        const { headers, body, queryStringParameters } = event;
        const path = event.rawPath || event.path;
        const httpMethod = event.requestContext?.http?.method || event.httpMethod;

        if (!path || !httpMethod) {
            console.log('Incoming Request:', { path, httpMethod });
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Path or HTTP method is undefined . Please Check' }),
            };
        }
        if (path === '/api/email_format' && httpMethod === 'POST') {
            const { employee } = await auth(headers);
            authorize(employee, ['Employee', 'Manager', 'admin', 'HR'])

            const emailData = JSON.parse(body);
            return await emailFormatController.createEmailFormat(emailData, employee)
        }
        if (path === '/api/auth/send-otp' && httpMethod === 'POST') {
            return await sendOtpHandler.handler(event);
        }

        if (path === '/api/auth/verify-otp' && httpMethod === 'POST') {
            return await verifyOtpHandler.handler(event);
        }
        if (path === '/api/auth/reset-password' && httpMethod === 'PATCH') {
            return await resetPasswordHandler.handler(event);
        }

        if (path === '/api/emp_credentials' && httpMethod === 'GET') {
            const { employee } = await auth(headers); // Authenticate user
            authorize(employee, ['admin']); // Authorize roles

            const credentials = await EmpCredentials.find();



            const decryptedCredentials = credentials.map((cred) => {
                const iv = Buffer.from(cred.iv, 'hex');
                const decipher = crypto.createDecipheriv(algorithm, key, iv);
                let decrypted = decipher.update(cred.officialMailpassword, 'hex', 'utf8');
                decrypted += decipher.final('utf8');

                return {
                    _id: cred._id,
                    eID: cred.eID,
                    empName: cred.empName,
                    officialMail: cred.officialMail,
                    officialMailpassword: decrypted,
                };
            });

            return {
                statusCode: 200,
                body: JSON.stringify(decryptedCredentials),
                headers: { 'Content-Type': 'application/json' }
            };
        }

        // If no route matches
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Route not found' }),
        };

    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};