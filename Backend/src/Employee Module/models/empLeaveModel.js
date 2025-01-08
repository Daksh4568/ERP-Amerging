const mongoose = require('mongoose');
const Notification = require('./notificationSchema');
const Employee = require('../../HR Module/models/empMaster-model'); // To fetch the manager's eID
const sendMail = require('../Controllers/sendmail'); // Helper for sending emails

const leaveApplicationSchema = new mongoose.Schema({
    eID: {
        type: String,
        unique: true,
        required: true,
    },
    name: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String },
    personalEmail: { type: String, required: true, match: /.+\@.+\..+/ },
    typeOfLeave: {
        type: String,
        enum: ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Half Day Leave', 'Short Leave', 'Others'],
        required: true,
    },
    specifyIfOthers: { type: String, required: function () { return this.typeOfLeave === 'Others'; } },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numberOfDays: { type: Number },
    reasonForLeave: { type: String },
    emergencyContact: { type: String, required: true },
    addressDuringLeave: { type: String },
    supervisor: {
        name: { type: String, required: true },
        officialEmail: { type: String, required: true, match: /.+\@.+\..+/ },
    },
    additionalNotes: { type: String },
    declaration: { type: Boolean, required: true, default: false },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    managerComment: { type: String },
    addedBy: { name: { type: String, required: true }, role: { type: String, required: true } },
    createdAt: { type: Date, default: Date.now },
});

leaveApplicationSchema.pre('save', async function (next) {
    try {
        // Fetch the manager using the supervisor's email
        const manager = await Employee.findOne({ officialEmail: this.supervisor.officialEmail, role: 'Manager' });
        if (!manager) {
            throw new Error('Manager not found for the provided supervisor email.');
        }

        // Map LeaveApplication fields to Notification fields
        const notification = new Notification({
            recipientEmpId: manager.eID, // Manager's employee ID
            recipientEmail: manager.officialEmail, // Manager's email
            type: 'LeaveApproval', // Fixed type for leave notifications
            title: `Leave Request from ${this.name}`, // Title derived from leave applicant's name
            message: `${this.name} has applied for leave from ${this.startDate.toDateString()} to ${this.endDate.toDateString()}.`, // Detailed message
            data: {
                leaveId: this._id, // Reference to the leave application
            },
            isRead: false, // Default unread status
        });

        // Save the notification
        await notification.save();

        // Send email notification to the manager
        await sendMail(
            manager.officialEmail,
            `Leave Request: ${this.name}`,
            `${this.name} has applied for leave from ${this.startDate.toDateString()} to ${this.endDate.toDateString()}.\nReason: ${this.reasonForLeave}`
        );

        next(); // Proceed with saving the leave application
    } catch (error) {
        next(error); // Pass error to the save operation
    }
});
const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);
module.exports = LeaveApplication;
