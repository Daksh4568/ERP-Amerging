const mongoose = require('mongoose');

const empAttendanceLogsSchema = new mongoose.Schema({
    eID: {
        type: String,
    },
    date: {
        type: String,
    },
    inTime: {
        type: String,
    },
    outTime: {
        type: String,
    },
    emplateIn: {
        type: boolean,
        default: false,
    },
    emplateBy: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Leave', 'Holiday'],
    },
    addedBy: {
        name: {
            type: String,
            //required: true,
        },
        role: {
            type: String,
            //required: true,
        },
    },
},
    {
        timestamps: true
    });
empAttendanceLogsSchema.index({ eID: 1, date: 1 }); // prevent duplicates
const EmpAttendanceLogs = mongoose.model('EmpAttendanceLogs', empAttendanceLogsSchema);
module.exports = EmpAttendanceLogs;