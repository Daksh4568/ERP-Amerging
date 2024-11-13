const mongoose = require('mongoose')


// This is the mongoose schema for the employee exit form
// I have taken the reference for the schema from emloyee exit form 
const exitEmployeeSchema = new mongoose.Schema({

    date:{
        type : Date,
        default: Date.now , 
        required: true
    }, 
    employeeName: {
        tpye : String , 
        required : true
    } , 
    department: {
        type : String ,
        required : true
    }, 
    designation: {
        type: String,
        required: true
    },
    lastWorkingDay: {
        type: Date,
        required: true
    },
    noDues: {
        accounts: {
            imprestLoanAdvance: {
                type: Boolean,
                default: false
            },
            remarks: String
        },
        stores: {
            type: Boolean,
            default: false
        },
        admin: {
            mobileSimHandset: {
                type: Boolean,
                default: false
            }
        },
        it: {
            laptopPendrive: {
                type: Boolean,
                default: false
            },
            emailAccess: {
                type: Boolean,
                default: false
            }
        },
        hr: {
            idCard: {
                type: Boolean,
                default: false
            }
        },
        departmentHead: {
            departmentData: {
                type: Boolean,
                default: false
            }
        },
        others: String
    },
    exitFeedback: {
        reasonForLeaving: String,
        experience: String,
        skillUtilization: String,
        trainingSupport: String,
        ideasValued: String,
        improvementSuggestions: String,
        finalComments: String
    },
    managerRating: {
        followPolicies: {
            type: String,
            enum: ['Always', 'Usually', 'Sometimes', 'Never']
        },
        fairTreatment: {
            type: String,
            enum: ['Always', 'Usually', 'Sometimes', 'Never']
        },
        recognitionForJob: {
            type: String,
            enum: ['Always', 'Usually', 'Sometimes', 'Never']
        },
        resolvesComplaints: {
            type: String,
            enum: ['Always', 'Usually', 'Sometimes', 'Never']
        },
        givesInformation: {
            type: String,
            enum: ['Always', 'Usually', 'Sometimes', 'Never']
        },
        keepsBusy: {
            type: String,
            enum: ['Always', 'Usually', 'Sometimes', 'Never']
        },
        knowsJobWell: {
            type: String,
            enum: ['Always', 'Usually', 'Sometimes', 'Never']
        },
        welcomesSuggestions: {
            type: String,
            enum: ['Always', 'Usually', 'Sometimes', 'Never']
        },
        maintainsDiscipline: {
            type: String,
            enum: ['Always', 'Usually', 'Sometimes', 'Never']
        }
    },
    departmentFeedback: {
        teamwork: {
            type: String,
            enum: ['Excellent', 'Good', 'Fair', 'Poor']
        },
        interDepartmentCooperation: {
            type: String,
            enum: ['Excellent', 'Good', 'Fair', 'Poor']
        },
        training: {
            type: String,
            enum: ['Excellent', 'Good', 'Fair', 'Poor']
        },
        communication: {
            type: String,
            enum: ['Excellent', 'Good', 'Fair', 'Poor']
        },
        workingConditions: {
            type: String,
            enum: ['Excellent', 'Good', 'Fair', 'Poor']
        },
        workSchedule: {
            type: String,
            enum: ['Excellent', 'Good', 'Fair', 'Poor']
        }
    },
    corporateComplianceAcknowledgement: {
        hasViolations: {
            type: Boolean,
            default: false
        },
        acknowledgementDate: {
            type: Date.now,
            required: true
        }
    }
});

const exitForm = mongoose.model('ExitEmployee',  exitEmployeeSchema);
  
  module.exports = exitForm;
