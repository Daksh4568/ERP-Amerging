// controllers/exitEmployeeController.js
const ExitEmployee = require('../models/empExitFormModel');

// Create a new exit form entry
exports.createExitForm = async (req, res) => {
    try {
        // Automatically add `enteredBy` details
        const exitFormData = new ExitEmployee({
            ...req.body,
            addedBy: {
                name: req.employee.name, // Automatically fetched from auth middleware
                role: req.employee.role  // Automatically fetched from auth middleware
            }
        });

        const savedData = await exitFormData.save();

        // Log for auditing purposes
        console.log(`Exit form successfully submitted by ${req.employee.name} (${req.employee.role}).`);

        res.status(201).json({
            message: 'Exit form data saved successfully',
            data: savedData
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error saving exit form data',
            error: error.message
        });
    }
};
