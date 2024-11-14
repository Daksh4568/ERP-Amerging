const EmployeeEvaluation = require('../models/employeeEvaluationModel');

exports.createEmployeeEvaluation = async(req,res) =>{
    try{
        const evaluationData = new EmployeeEvaluation({
            ...req.body,
            enteredBy: {
                name : req.employee.name , 
                role: req.employee.role
            }
        });
        
        const savedData = await evaluationData.save();

        console.log(`Employee evaluation form successfully submitted by ${req.employee.name} (${req.employee.role})`);

       res.status(201).json({
        message: 'Employee evaluation data saved successfully',
        data: savedData
 });
}
catch(e){
    res.status(400).json({
        message:'Error saving employee evaluation data',
        error: error.message
    });
  }
};