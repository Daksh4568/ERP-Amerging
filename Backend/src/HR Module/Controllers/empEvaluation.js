const EmployeeEvaluation = require('../models/employeeEvaluationModel');
const connectToDatabase = require('../../HR Module/db/db'); // Ensure MongoDB connection

// Create Employee Evaluation
exports.createEmployeeEvaluation = async (evaluationData, user) => {
    try {
        // Ensure database connection
        await connectToDatabase();

        // Create a new EmployeeEvaluation document
        const evaluation = new EmployeeEvaluation({
            ...evaluationData,
            addedBy: {
                name: user.name,
                role: user.role,
            },
        });

        const savedData = await evaluation.save();

        // console.log(
        //     `Employee evaluation form successfully submitted by ${user.name} (${user.role}).`
        // );

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Employee evaluation data saved successfully',
                data: savedData,
            }),
        };
    } catch (error) {
        console.error('Error saving employee evaluation data:', error);

        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Error saving employee evaluation data',
                error: error.message,
            }),
        };
    }
};
