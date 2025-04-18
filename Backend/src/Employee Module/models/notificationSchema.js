const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
// I am also sending the leave id with the data t ensure that the particular leave is approved 
const notificationSchema = new mongoose.Schema({
    notificationId: { type: String, unique: true, default: uuidv4 },
    recipientEmpId: { type: String, required: true },
    recipientEmail: { type: String, required: true, match: /.+\@.+\..+/ },
    type: { type: String, enum: ['LeaveApproval', 'General', 'TaskAssignment', 'Other'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Approved', 'Rejected', 'Pending'], select: false },
    data: { leaveId: { type: mongoose.Schema.Types.ObjectId, ref: 'LeaveApplication' }, additionalInfo: { type: Object } },
    startDate: { type: Date },
    endDate: { type: Date },
    reasonForLeave: { type: String },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },

});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
