const mongoose = require('mongoose')

const employeeEvaluationSchema = new mongoose.Schema({
    employeeName :{
        type : String , 
        required : true,
    }, 
    dateOfReview: {
        type: Date ,
        required : true,
    }, 
    designation: {
        type: String ,
        required : true,
    },
    department:{
        type: String ,
        required : true,
    },
    joinedAmergingOn:{
        type: Date ,
        required: true,
    },
    totalTenure:{
        type:Number , 
        required: true, 
    },
    previousSalary: {
        type: Number,
        required: true,
      },
    incrementedSalary: {
        type: Number,
      },
    incrementedSalaryDate: {
        type: Date,
      },
    numberOfProjectsHandled: {
        type: Number,
        required: true,
      },
    currentResponsibilities: {
        keyResponsibilities: [String], 
        additionalResponsibilities: [String], 
      },
    performanceGoals: {
        type: String, 
        required: true,
      },
    surplusResources: {
        type: String, 
        required: true, 
      },
      additionalContributions: {
        type: String,
        required: true,
      },
      challenges: {
        type: String,
        required: true,
      }
    }, 
    { 
      timestamps: true 
    }
  );

const EmployeeEvaluation = mongoose.model('empEvaluationSchema' , employeeEvaluationSchema)

module.exports = EmployeeEvaluation