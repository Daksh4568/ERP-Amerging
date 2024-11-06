const jwt = require('jsonwebtoken')
const employees = require('../models/empMaster-model')

const auth =async (req,res,next)=>{
    try {
        //get the token from the req header and replace the Bearer 
        const  token =req.header ('Authorization').replace('Bearer ','')
        //Verify the token
        const decoded = jwt.verify(token,'amergingtech5757')
        //get the user by id decode from the token
        const employee =await employees.findOne({_id:decoded._id,'tokens.token':token})        
        if(!employee)
        {
            throw new Error()
        }
        req.token = token
        req.employee = employee       
        next()
    } catch (e) {
        res.status(401).send({error:'Authentication Error'})
    }
}

module.exports = auth;  //export the auth middleware function  