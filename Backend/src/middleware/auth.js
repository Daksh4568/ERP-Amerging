// const jwt = require('jsonwebtoken')
// const employees = require('../models/empMaster-model')

// const auth =async (req,res,next)=>{
//     try {
//         //get the token from the req header and replace the Bearer 
//         const  token =req.header ('Authorization').replace('Bearer ','')
//         //Verify the token
//         const decoded = jwt.verify(token,'amergingtech5757')
//         //get the user by id decode from the token
//         const employee =await employees.findOne({_id:decoded._id,'tokens.token':token})        
//         if(!employee)
//         {
//             throw new Error()
//         }
//         req.token = token
//         req.employee = employee       
//         next()
//     } catch (e) {
//         res.status(401).send({error:'Authentication Error'})
//     }
// }

// const authorize = (...allowedRoles) =>{
//     return (req , res , next) =>{
//         if(!allowedRoles.includes(req.employee.role)){
//             return res.status(403).send({error:'Access Denied'});
//         }
//         next();
//     };
// };
// module.exports = {auth , authorize}; //export the auth middleware function  

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

        // Verify the token and decode the payload
        const decoded = jwt.verify(token, 'amergingtech5757');

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
