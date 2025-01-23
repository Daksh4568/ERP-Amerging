const ExitEmployee = require('../models/empExitFormModel');
const connectToDatabase = require('../../HR Module/db/db'); // Ensure MongoDB connection

// Create a new exit form entry
exports.createExitForm = async (exitFormData, user) => {
    try {
        // Ensure database connection
        await connectToDatabase();

        // Automatically add `addedBy` details
        const exitForm = new ExitEmployee({
            ...exitFormData,
            addedBy: {
                name: user.name,
                role: user.role,
            },
        });

        const savedData = await exitForm.save();

        // Log for auditing purposes
        console.log(`Exit form successfully submitted by ${user.name} (${user.role}).`);

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Exit form data saved successfully',
                data: savedData,
            }),
        };
    } catch (error) {
        console.error('Error saving exit form data:', error);

        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Error saving exit form data',
                error: error.message,
            }),
        };
    }
};
