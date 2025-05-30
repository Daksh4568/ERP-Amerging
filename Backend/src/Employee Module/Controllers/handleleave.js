// const Notification = require('../models/notificationSchema');
// const LeaveApplication = require('../models/empLeaveModel');
// const sendMail = require('./sendmail');
// const connectToDatabase = require('../../HR Module/db/db'); // Ensure MongoDB connection

// // Approve or reject a leave request
// const handleLeaveNotification = async (notificationData, user) => {
//     try {
//         const { notificationId, status, managerComment } = notificationData;

//         if (!['Approved', 'Rejected'].includes(status)) {
//             return {
//                 statusCode: 400,
//                 body: JSON.stringify({ error: 'Invalid status value.' }),
//             };
//         }

//         // Ensure database connection
//         await connectToDatabase();

//         // Find the notification
//         const notification = await Notification.findOne({ notificationId });
//         if (!notification) {
//             return {
//                 statusCode: 404,
//                 body: JSON.stringify({ error: 'Notification not found.' }),
//             };
//         }

//         // Find the leave application
//         const leaveApplication = await LeaveApplication.findById(notification.data.leaveId);
//         if (!leaveApplication) {
//             return {
//                 statusCode: 404,
//                 body: JSON.stringify({ error: 'Leave application not found.' }),
//             };
//         }

//         if (leaveApplication.status !== 'Pending') {
//             return {
//                 statusCode: 400,
//                 body: JSON.stringify({ error: 'Leave request is no longer pending.' }),
//             };
//         }

//         // Update leave status
//         leaveApplication.status = status;
//         leaveApplication.managerComment = managerComment || '';
//         await leaveApplication.save();

//         // Update notification
//         notification.isRead = true;
//         notification.status = status;
//         await notification.save();

//         // Notify the employee
//         await sendMail(
//             leaveApplication.personalEmail,
//             `Leave Request ${status}`,
//             `Your leave request from ${leaveApplication.startDate.toDateString()} to ${leaveApplication.endDate.toDateString()} has been ${status.toLowerCase()}.`
//         );

//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 message: `Leave request ${status.toLowerCase()} successfully.`,
//                 leaveApplication,
//             }),
//         };
//     } catch (error) {
//         console.error('Error handling leave notification:', error);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ error: 'Error handling leave notification.', details: error.message }),
//         };
//     }
// };



// module.exports = { handleLeaveNotification, getAllNotificationsForManager };
const Employee = require('../../HR Module/models/empMaster-model'); // Import the employee model
const Notification = require('../models/notificationSchema');
const LeaveApplication = require('../models/empLeaveModel');
const sendMail = require('./sendmail');
const connectToDatabase = require('../../HR Module/db/db'); // Ensure MongoDB connection

const handleLeaveNotification = async (notificationData, user) => {
    try {
        const { notificationId, status, managerComment } = notificationData;

        if (!['Approved', 'Rejected'].includes(status)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid status value.' }),
            };
        }

        await connectToDatabase();

        const notification = await Notification.findOne({ notificationId });
        if (!notification) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Notification not found.' }),
            };
        }

        const leaveApplication = await LeaveApplication.findById(notification.data.leaveId);
        if (!leaveApplication) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Leave application not found.' }),
            };
        }

        if (leaveApplication.status !== 'Pending') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Leave request is no longer pending.' }),
            };
        }

        // ✅ Deduct leave balance only if approved
        if (status === 'Approved') {
            const employee = await Employee.findOne({ eID: leaveApplication.eID });
            if (!employee) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: 'Employee not found.' }),
                };
            }

            const leaveDays =
                (new Date(leaveApplication.endDate) - new Date(leaveApplication.startDate)) / (1000 * 60 * 60 * 24) + 1;

            const leaveType = leaveApplication.typeOfLeave; // e.g., 'Sick Leave'
            const balance = employee.leaveBalance;

            let balanceKey = '';
            if (leaveType === 'Sick Leave') balanceKey = 'sickLeave';
            else if (leaveType === 'Casual Leave') balanceKey = 'casualLeave';
            else if (leaveType === 'Earned Leave') balanceKey = 'earnedLeave';
            else {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'Invalid leave type.' }),
                };
            }

            if (balance[balanceKey] < leaveDays) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: `Not enough ${leaveType} balance.` }),
                };
            }

            balance[balanceKey] -= leaveDays;
            await employee.save();
        }

        // Update leave status
        leaveApplication.status = status;
        leaveApplication.managerComment = managerComment || '';
        await leaveApplication.save();

        // Update notification
        notification.isRead = true;
        notification.status = status;
        await notification.save();

        // Notify the employee
        await sendMail(
            leaveApplication.personalEmail,
            `Leave Request ${status}`,
            `Your leave request from ${leaveApplication.startDate.toDateString()} to ${leaveApplication.endDate.toDateString()} has been ${status.toLowerCase()}.`
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Leave request ${status.toLowerCase()} successfully.`,
                leaveApplication,
            }),
        };
    } catch (error) {
        console.error('Error handling leave notification:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error handling leave notification.', details: error.message }),
        };
    }
};
// Fetch all notifications for a manager
const getAllNotificationsForManager = async (manager) => {
    try {
        // Ensure database connection
        await connectToDatabase();

        // Fetch notifications for the manager
        const notifications = await Notification.find({
            recipientEmpId: manager.eID,
        }).sort({ createdAt: -1 });

        return {
            statusCode: 200,
            body: JSON.stringify(notifications),
        };
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error fetching notifications.', details: error.message }),
        };
    }
};
module.exports = { handleLeaveNotification, getAllNotificationsForManager };