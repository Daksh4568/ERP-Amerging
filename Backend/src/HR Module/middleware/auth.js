const jwt = require('jsonwebtoken');
const employees = require('../models/empMaster-model');
const connectToDatabase = require('../db/db'); // Ensure MongoDB connection

// Authentication Middleware
const auth = async (headers) => {
    try {
        // Extract token
        const token = headers.authorization?.replace('Bearer ', '') || headers.Authorization?.replace('Bearer ', '');
        //console.log('Extracted Token:', token);

        if (!token) {
            throw new Error('Access Denied. No token provided.');
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log('Decoded Token:', decoded);

        // Ensure database connection
        await connectToDatabase();

        // Find the employee
        const employee = await employees.findOne({ eID: decoded.eID, 'tokens.token': token }).select('+role');
        //console.log('Employee Found:', employee);

        if (!employee) {
            console.error("Employee not found with ID:", decoded.eID);
            throw new Error('Authentication Error. Employee not found.');
        }

        if (!employee.role) {
            console.error('Employee role is undefined:', employee);
            throw new Error('Authentication Error. Employee role is missing.');
        }
        //console.log('Employee Role:', employee.role);
        return { employee, token };
    } catch (e) {
        console.error('Authentication Error:', e.message);
        throw new Error(`Authentication Error: ${e.message}`);
    }
};

// Authorization Middleware
const authorize = (employee, allowedRoles) => {


    if (!allowedRoles.includes(employee.role)) {
        console.error(`Access Denied. Employee role (${employee.role}) not in allowed roles: ${allowedRoles}`);
        throw new Error('Access Denied. Insufficient permissions.');
    }
};

module.exports = { auth, authorize };
