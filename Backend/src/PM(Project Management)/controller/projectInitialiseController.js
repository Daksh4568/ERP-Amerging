const ProjectInitialise = require('../models/projectInitialseModel');
const connectToDatabase = require('../../HR Module/db/db');

exports.createProjectForm = async (projectFormData, user) => {

    try {
        await connectToDatabase();

        const projectForm = new ProjectInitialise({
            ...projectFormData,
            addedBy: {
                name: user.name,
                role: user.role,
            },
        });

        const savedData = await projectForm.save();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Project Form data saved successfully',
                data: savedData,
            }),
        };

    } catch (e) {
        console.error('Error saving the data', error);

        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Error saving the project form data',
                error: error.message
            }),
        };

    }

};