// Authentication Middleware
const jwt = require('jsonwebtoken');
const employees = require('../models/empMaster-model');

// Authentication Middleware
const auth = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({ error: 'Access Denied. No token provided.' });
        }
        //         jwt.verify() automatically checks the expiration of a JWT if the token contains an exp (expiration) claim.

        // If the token is expired, jwt.verify() will throw an error with the message "jwt expired".

        // Verify the token and decode the payload
        // let decoded;
        // try {
        //     decoded = jwt.verify(token, 'amergingtech5757');

        // } catch (err) {
        //     if (err.name === 'TokenExpiredError') {
        //         return res.status(401).send("token expired");
        //     }
        //     return res.status(401).send({ error: 'Authentication Error . Invalid token.' })
        // }
        const decoded = jwt.verify(token, 'amergingtech5757')
        // Find the employee using eID and verify token exists in their tokens array
        const employee = await employees.findOne({ eID: decoded.eID, 'tokens.token': token });
        if (!employee) {
            return res.status(401).send({ error: 'Authentication Error. Employee not found.' });
        }

        // Attach employee and token to request for downstream handlers
        req.token = token;
        req.employee = employee;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Authentication Error. Invalid token.' });
    }
};

module.exports = { auth };

// Authorization Middleware
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.employee.role)) {
            return res.status(403).send({ error: 'Access Denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { auth, authorize };
