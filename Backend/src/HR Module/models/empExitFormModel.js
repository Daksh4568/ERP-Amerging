const mongoose = require('mongoose');

// Define the common rating field schema
const ratingFieldSchema = {
    type: Number,
    min: 1,
    max: 5, // Common range for all fields
    required: true
};

// Define manager rating fields using the common rating field schema
const managerRatingSchema = {
    followPolicies: ratingFieldSchema,
    fairTreatment: ratingFieldSchema,
    recognitionForJob: ratingFieldSchema,
    resolvesComplaints: ratingFieldSchema,
    givesInformation: ratingFieldSchema,
    keepsBusy: ratingFieldSchema,
    knowsJobWell: ratingFieldSchema,
    welcomesSuggestions: ratingFieldSchema,
    maintainsDiscipline: ratingFieldSchema
};

// Define department feedback fields using the common rating field schema
const departmentFeedbackSchema = {
    teamwork: ratingFieldSchema,
    interDepartmentCooperation: ratingFieldSchema,
    training: ratingFieldSchema,
    communication: ratingFieldSchema,
    workingConditions: ratingFieldSchema,
    workSchedule: ratingFieldSchema
};

// Employee exit form schema
const exitEmployeeSchema = new mongoose.Schema({
    eID: {
        type: String,
        unique: true,
        // required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    employeeName: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
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
            cleared: {
                type: Boolean,
                default: false
            },
            remarks: String
        },
        stores: {
            cleared: {
                type: Boolean,
                default: false
            },
            remarks: String
        },
        admin: {
            cleared: {
                type: Boolean,
                default: false
            },
            remarks: String
        },
        it: {
            cleared: {
                type: Boolean,
                default: false
            },
            remarks: String
        },
        hr: {
            cleared: {
                type: Boolean,
                default: false
            },
            remarks: String
        },
        departmentHead: {
            cleared: {
                type: Boolean,
                default: false
            },
            remarks: String
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
    managerRating: managerRatingSchema, // Use the managerRatingSchema here
    departmentFeedback: departmentFeedbackSchema, // Use the departmentFeedbackSchema here
    corporateComplianceAcknowledgement: {
        hasViolations: {
            type: Boolean,
            default: false
        },
        acknowledgementDate: {
            type: Date,
            default: Date.now,
            required: true
        }
    },
    addedBy: {
        name: {
            type: String,
            required: true // Ensures the submitter's name is included
        },
        role: {
            type: String,
            required: true // Ensures the submitter's role is included
        }
    }
},
    {
        timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
    });

// Create and export the ExitForm model
const ExitForm = mongoose.model('ExitEmployee', exitEmployeeSchema);

module.exports = ExitForm;