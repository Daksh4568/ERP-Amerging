// controllers/exitEmployeeController.js
const ExitEmployee = require('../models/empExitFormModel');

// Create a new exit form entry
exports.createExitForm = async (req, res) => {
    try {
        const exitFormData = new ExitEmployee(req.body);
        const savedData = await exitFormData.save();
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