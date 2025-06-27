const mongoose = require('mongoose');
const Notification = require('./notificationSchema');
const Employee = require('../../HR Module/models/empMaster-model'); // To fetch the manager's eID
const sendMail = require('../Controllers/sendmail'); // Helper for sending emails

const leaveApplicationSchema = new mongoose.Schema({
    eID: {
        type: String,
        // required: true,
    },
    name: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String },
    personalEmail: { type: String, required: true, match: /.+\@.+\..+/ },
    typeOfLeave: {
        type: String,
        enum: ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Half Day Leave', 'Missed Punch', 'Short Leave', 'Others'],
        required: true,
    },
    leaveParameters: {
        type: String,
        enum: ['Pre dated', 'Post dated'],
        // required: function () {
        //     return this.typeOfLeave !== 'Missed Punch' && this.typeOfLeave !== 'Short Leave';
        // },
    },
    halfDayType: {
        type: String,
    },
    shortLeaveTime: {
        type: String,
    },
    missedPunchReason: {
        type: String,
    },
    specifyIfOthers: { type: String, required: function () { return this.typeOfLeave === 'Others'; } },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numberOfDays: { type: Number },
    reasonForLeave: { type: String },
    emergencyContact: { type: String },
    addressDuringLeave: { type: String },
    supervisor: {
        supervisoreID: { type: String, required: true },
        name: { type: String, required: true },
        officialEmail: { type: String, required: true, match: /.+\@.+\..+/ },
    },
    additionalNotes: { type: String },
    declaration: { type: Boolean, required: true, default: false },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    dateOfApproval: { type: Date },
    managerComment: { type: String },
    addedBy: { name: { type: String, required: true }, role: { type: String, required: true } },
    createdAt: { type: Date, default: Date.now },
});

// leaveApplicationSchema.pre('save', async function (next) {
//     try {
//         // Fetch the manager using the supervisor's email
//         const manager = await Employee.findOne({ officialEmail: this.supervisor.officialEmail, role: 'Manager' });
//         if (!manager) {
//             throw new Error('Manager not found for the provided supervisor email.');
//         }

//         // Map LeaveApplication fields to Notification fields
//         const notification = new Notification({
//             recipientEmpId: manager.eID, // Manager's employee ID
//             recipientEmail: manager.officialEmail, // Manager's email
//             type: 'LeaveApproval', // Fixed type for leave notifications
//             title: `Leave Request from ${this.name}`, // Title derived from leave applicant's name
//             reasonForLeave: this.reasonForLeave, // Reason for leave
//             startDate: this.startDate, // Start date of leave
//             endDate: this.endDate, // End date of leave
//             message: `${this.name} has applied for leave from ${this.startDate.toDateString()} to ${this.endDate.toDateString()}.`, // Detailed message
//             data: {
//                 leaveId: this._id, // Reference to the leave application
//             },
//             isRead: false, // Default unread status
//         });

//         // Save the notification
//         await notification.save();

//         // Send email notification to the manager
//         await sendMail(
//             manager.officialEmail,
//             `Leave Request: ${this.name}`,
//             `${this.name} has applied for leave from ${this.startDate.toDateString()} to ${this.endDate.toDateString()}.\nReason: ${this.reasonForLeave}`
//         );

//         next(); // Proceed with saving the leave application
//     } catch (error) {
//         next(error); // Pass error to the save operation
//     }
// });
// const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);
// module.exports = LeaveApplication;
// leaveApplicationSchema.pre('save', async function (next) {
//     try {
//         // const employee = await Employee.findOne({ eID: user.eID });
//         // if (!employee) {
//         //     throw new Error('Employee not found.');
//         // }

//         // // Ensure the selected supervisor matches the one assigned to this employee
//         // if (employee.reportingManagerEmail !== this.supervisor.officialEmail) {
//         //     throw new Error('Supervisor does not match the assigned reporting manager.');
//         // }

//         const manager = await Employee.findOne({ officialEmail: this.supervisor.officialEmail });
//         if (!manager) {
//             throw new Error('Reporting manager not found.');
//         }

//         // Create notification
//         const notification = new Notification({
//             recipientEmpId: manager.eID,
//             recipientEmail: manager.officialEmail,
//             type: 'LeaveApproval',
//             title: `Leave Request from ${this.name}`,
//             reasonForLeave: this.reasonForLeave,
//             startDate: this.startDate,
//             endDate: this.endDate,
//             message: `${this.name} has applied for leave from ${this.startDate.toDateString()} to ${this.endDate.toDateString()}.`,
//             data: {
//                 leaveId: this._id,
//             },
//             isRead: false,
//         });

//         await notification.save();

//         // Send email notification to reporting manager
//         await sendMail(
//             manager.officialEmail,
//             `Leave Request from ${this.name}`,
//             `${this.name} has applied for ${this.typeOfLeave} from ${this.startDate.toDateString()} to ${this.endDate.toDateString()}.\n\nReason: ${this.reasonForLeave}`
//         );

//         next();
//     } catch (error) {
//         next(error);
//     }
// });

const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);
module.exports = LeaveApplication;