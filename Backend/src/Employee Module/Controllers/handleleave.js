// // module.exports = { handleLeaveNotification, getAllNotificationsForManager };
// const Employee = require('../../HR Module/models/empMaster-model'); // Import the employee model
// const Notification = require('../models/notificationSchema');
// const LeaveApplication = require('../models/empLeaveModel');
// const sendMail = require('./sendmail');
// const connectToDatabase = require('../../HR Module/db/db'); // Ensure MongoDB connection

// const handleLeaveNotification = async (notificationData, user) => {
//     try {
//         const { notificationId, status, managerComment } = notificationData;

//         if (!['Approved', 'Rejected'].includes(status)) {
//             return {
//                 statusCode: 400,
//                 body: JSON.stringify({ error: 'Invalid status value.' }),
//             };
//         }

//         await connectToDatabase();

//         const notification = await Notification.findOne({ notificationId });
//         if (!notification) {
//             return {
//                 statusCode: 404,
//                 body: JSON.stringify({ error: 'Notification not found.' }),
//             };
//         }

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

//         // ✅ Deduct leave balance only if approved
//         if (status === 'Approved') {
//             const employee = await Employee.findOne({ eID: leaveApplication.eID });
//             if (!employee) {
//                 return {
//                     statusCode: 404,
//                     body: JSON.stringify({ error: 'Employee not found.' }),
//                 };
//             }

//             const leaveDays =
//                 (new Date(leaveApplication.endDate) - new Date(leaveApplication.startDate)) / (1000 * 60 * 60 * 24) + 1;

//             const leaveType = leaveApplication.typeOfLeave; // e.g., 'Sick Leave'
//             const balance = employee.leaveBalance;

//             let balanceKey = '';
//             if (leaveType === 'Sick Leave') balanceKey = 'sickLeave';
//             else if (leaveType === 'Casual Leave') balanceKey = 'casualLeave';
//             else if (leaveType === 'Earned Leave') balanceKey = 'earnedLeave';
//             else {
//                 return {
//                     statusCode: 400,
//                     body: JSON.stringify({ error: 'Invalid leave type.' }),
//                 };
//             }

//             if (balance[balanceKey] < leaveDays) {
//                 return {
//                     statusCode: 400,
//                     body: JSON.stringify({ error: `Not enough ${leaveType} balance.` }),
//                 };
//             }

//             balance[balanceKey] -= leaveDays;
//             await employee.save();
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
// // Fetch all notifications for a manager
// const getAllNotificationsForManager = async (manager) => {
//     try {
//         // Ensure database connection
//         await connectToDatabase();

//         // Fetch notifications for the manager
//         const notifications = await Notification.find({
//             recipientEmpId: manager.eID,
//         }).sort({ createdAt: -1 });

//         return {
//             statusCode: 200,
//             body: JSON.stringify(notifications),
//         };
//     } catch (error) {
//         console.error('Error fetching notifications:', error);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ error: 'Error fetching notifications.', details: error.message }),
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

        // Fetch notification
        const notification = await Notification.findOne({ notificationId });
        if (!notification) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Notification not found.' }),
            };
        }

        // Fetch leave application
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

        // Process only if leave is Approved
        if (status === 'Approved') {
            const employee = await Employee.findOne({ eID: leaveApplication.eID });
            if (!employee) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: 'Employee not found.' }),
                };
            }

            // Call this after leave is approved
            async function markLeaveInAttendance(eID, leaveDate) {
                // leaveDate should be in the same format as stored in your attendance logs (e.g., 'YYYY-MM-DD')
                await EmpAttendanceLogs.findOneAndUpdate(
                    { eID, date: leaveDate },
                    { status: 'LeaveTaken' },
                    { upsert: true, new: true }
                );
            }
            await markLeaveInAttendance(leaveApplication.eID, leaveApplication.startDate);

            const leaveType = leaveApplication.typeOfLeave;
            const leaveDays = leaveApplication.numberOfDays ||
                ((new Date(leaveApplication.endDate) - new Date(leaveApplication.startDate)) / (1000 * 60 * 60 * 24) + 1);

            // Restrict "Missed Punch" and "Short Leave" to 2 per month
            if (['Missed Punch', 'Short Leave'].includes(leaveType)) {
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

                const existingCount = await LeaveApplication.countDocuments({
                    eID: leaveApplication.eID,
                    typeOfLeave: leaveType,
                    status: 'Approved',
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                });

                if (existingCount >= 2) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: `Only 2 '${leaveType}' allowed per month.` }),
                    };
                }
            }

            // Handle balance deduction
            const balance = employee.leaveBalance;

            if (leaveType === 'Half Day Leave') {
                const defaultKey = 'casualLeave'; // or choose based on rules
                if (balance[defaultKey] >= 0.5) {
                    balance[defaultKey] -= 0.5;
                } else {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: `Not enough ${defaultKey} balance for Half Day Leave.` }),
                    };
                }
            } else if (leaveType === 'Sick Leave') {
                if (balance.sickLeave >= leaveDays) {
                    balance.sickLeave -= leaveDays;
                } else {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: 'Not enough Sick Leave balance.' }),
                    };
                }
            } else if (leaveType === 'Casual Leave') {
                if (balance.casualLeave >= leaveDays) {
                    balance.casualLeave -= leaveDays;
                } else {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: 'Not enough Casual Leave balance.' }),
                    };
                }
            } else if (leaveType === 'Earned Leave') {
                if (balance.earnedLeave >= leaveDays) {
                    balance.earnedLeave -= leaveDays;
                } else {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: 'Not enough Earned Leave balance.' }),
                    };
                }
            }

            await employee.save(); // Save the updated leave balance
        }

        // Update leave and notification status
        leaveApplication.status = status;
        leaveApplication.managerComment = managerComment || '';
        await leaveApplication.save();

        notification.isRead = true;
        notification.status = status;
        await notification.save();

        // Send email
        await sendMail(
            leaveApplication.personalEmail,
            `Leave Request ${status}`,
            `Your leave request from ${leaveApplication.startDate.toDateString()} to ${leaveApplication.endDate.toDateString()} has been ${status.toLowerCase()}.`
        );
        const employee = await Employee.findOne({ eID: leaveApplication.eID });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Leave request ${status.toLowerCase()} successfully.`,
                leaveApplication,
                leaveBalance: status === 'Approved' ? employee.leaveBalance : null

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