const mongoose = require('mongoose');

const leaveMasterSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, unique: true },
    leaveBalance: {
        sickLeave: {
            type: Number,
            default: 5
        },
        casualLeave: {
            type: Number,
            default: 5
        },
        earnedLeave: {
            type: Number,
            default: 5
        }
    }
});

module.exports = mongoose.model('LeaveMaster', leaveMasterSchema);
