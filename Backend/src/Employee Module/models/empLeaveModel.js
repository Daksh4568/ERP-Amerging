const mongoose = require('mongoose');

const leaveApplicationSchema = new mongoose.Schema({
    // eID: {
    //     type: String,
    //     required: true,
    //     ref: 'employeeMaster',
    // },
    name: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        enum: ['Design', 'Instrumentation', 'Sales', 'IT', 'HR', 'R&D'],
        required: true,
    },
    designation: {
        type: String,
    },
    personalEmail: {
        type: String,
        required: true,
        // match: /.+\@.+\..+/,
    },
    typeOfLeave: {
        type: String,
        enum: [
            'Sick Leave',
            'Casual Leave',
            'Earned Leave',
            'Half Day Leave',
            'Short Leave',
            'Others'
        ],
        required: true,
    },
    specifyIfOthers: {
        type: String,
        required: function () {
            return this.typeOfLeave === 'Others';
        },
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    numberOfDays: {
        type: Number,
        required: true,
    },
    reasonForLeave: {
        type: String,
    },
    emergencyContact: {
        type: String,
        required: true,
    },
    addressDuringLeave: {
        type: String,
    },

    // Approval
    supervisor: {
        name: {
            type: String,
            required: true
        },
        officialEmail: {
            type: String,
            required: true,
            match: /.+\@.+\..+/,
        },
    },

    additionalNotes: {
        type: String,
    },

    // Declaration

    declaration: {
        type: Boolean,
        required: true,
        default: false,  // Check for "I agree"
    },

    // Timestamps


},
    { timestamps: true }
);

// Automatically calculates the number of days

leaveApplicationSchema.pre('validate', function (next) {
    if (this.startDate && this.endDate) {
        const diffTime = Math.abs(this.endDate - this.startDate);

        this.numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    next();
});

const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);

module.exports = LeaveApplication;