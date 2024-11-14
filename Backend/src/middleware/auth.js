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
const jwt = require('jsonwebtoken');
const employees = require('../models/empMaster-model');

// Authentication Middleware
const auth = async (req, res, next) => {
    try {
        // Get the token from the header and remove the "Bearer " prefix
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({ error: 'Access Denied. No token provided.' });
        }

        // Verify the token and decode it
        const decoded = jwt.verify(token, 'amergingtech5757');
        
        // Find the user by decoded ID and the token in their tokens array
        const employee = await employees.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!employee) {
            return res.status(401).send({ error: 'Authentication Error. User not found.' });
        }

        // Attach token and employee details to the request for downstream usage
        req.token = token;
        req.employee = employee;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Authentication Error' });
    }
};

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
