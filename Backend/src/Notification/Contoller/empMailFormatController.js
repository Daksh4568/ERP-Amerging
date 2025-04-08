const emailFormat = require('../models/empMailformat')
const connectToDatabase = require('../../HR Module/db/db')

exports.createEmailFormat = async (emailFormatData, user) => {
    try {
        await connectToDatabase();

        const emailData = new emailFormat({
            ...emailFormatData,
            addedBy: {
                name: user.name,
                role: user.role
            },
        });
        const savedData = await emailData.save();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Email data save successfully',
                data: savedData,
            }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Error saving email data',
                error: error.message,
            }),
        };
    }
}