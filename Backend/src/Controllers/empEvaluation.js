const EmployeeEvaluation = require('../models/employeeEvaluationModel');

exports.createEmployeeEvaluation = async (req, res) => {
    try {
        // Automatically populating `evaluatedBy` from `req.employee`
        const evaluationData = new EmployeeEvaluation({
            ...req.body,
            evaluatedBy: {
                name: req.employee.name, // Automatically fetched
                role: req.employee.role // Automatically fetched
            }
        });

        const savedData = await evaluationData.save();

        console.log(`Employee evaluation form successfully submitted by ${req.employee.name} (${req.employee.role}).`);

        res.status(201).json({
            message: 'Employee evaluation data saved successfully',
            data: savedData
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error saving employee evaluation data',
            error: error.message
        });
    }
};
