
// const LeaveApplication = require('../models/empLeaveModel');
// const Notification = require('../models/notificationSchema');
// const Employee = require('../../HR Module/models/empMaster-model');
// const connectToDatabase = require('../../HR Module/db/db');
// const sendMail = require('../Controllers/sendmail');

// const submitLeaveApplication = async (leaveData, user) => {
//     try {
//         await connectToDatabase();

//         const employee = await Employee.findOne({ eID: user.eID });
//         if (!employee) {
//             return {
//                 statusCode: 404,
//                 body: JSON.stringify({ message: 'Employee not found.' }),
//             };
//         }

//         if (employee.reportingManagerEmail !== leaveData.supervisor.officialEmail) {
//             return {
//                 statusCode: 400,
//                 body: JSON.stringify({ message: 'Supervisor does not match assigned reporting manager.' }),
//             };
//         }

//         if (!leaveData.declaration) {
//             return {
//                 statusCode: 400,
//                 body: JSON.stringify({ message: 'You must agree to the declaration before submitting the form.' }),
//             };
//         }

//         const leaveApplication = new LeaveApplication({
//             ...leaveData,
//             eID: user.eID,
//             addedBy: {
//                 name: user.name,
//                 role: user.role,
//             },
//         });

//         const savedLeave = await leaveApplication.save();

//         // Notification creation
//         const manager = await Employee.findOne({ officialEmail: leaveData.supervisor.officialEmail });
//         if (manager) {
//             const notification = new Notification({
//                 recipientEmpId: manager.eID,
//                 recipientEmail: manager.officialEmail,
//                 type: 'LeaveApproval',
//                 title: `Leave Request from ${leaveData.name}`,
//                 reasonForLeave: leaveData.reasonForLeave,
//                 startDate: leaveData.startDate,
//                 endDate: leaveData.endDate,
//                 message: `${leaveData.name} has applied for leave from ${new Date(leaveData.startDate).toDateString()} to ${new Date(leaveData.endDate).toDateString()}.`,
//                 data: {
//                     leaveId: savedLeave._id,
//                 },
//                 isRead: false,
//             });

//             await notification.save();

//             // Email notification
//             await sendMail(
//                 manager.officialEmail,
//                 `Leave Request from ${leaveData.name}`,
//                 `${leaveData.name} has applied for ${leaveData.typeOfLeave} from ${new Date(leaveData.startDate).toDateString()} to ${new Date(leaveData.endDate).toDateString()}.\n\nReason: ${leaveData.reasonForLeave}`
//             );
//         }

//         return {
//             statusCode: 201,
//             body: JSON.stringify({
//                 message: 'Leave application submitted successfully.',
//                 data: savedLeave,
//             }),
//         };

//     } catch (error) {
//         console.error('Error submitting leave application:', error);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({
//                 message: 'Error submitting leave application',
//                 error: error.message,
//             }),
//         };
//     }
// };

// module.exports = {
//     submitLeaveApplication,
// };
const LeaveApplication = require('../models/empLeaveModel');
const Notification = require('../models/notificationSchema');
const Employee = require('../../HR Module/models/empMaster-model');
const connectToDatabase = require('../../HR Module/db/db');
const sendMail = require('../Controllers/sendmail');

const submitLeaveApplication = async (leaveData, user) => {
    try {
        await connectToDatabase();

        const employee = await Employee.findOne({ eID: user.eID });
        if (!employee) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Employee not found.' }),
            };
        }

        if (employee.reportingManagerEmail !== leaveData.supervisor.officialEmail) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Supervisor does not match assigned reporting manager.' }),
            };
        }

        if (!leaveData.declaration) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'You must agree to the declaration before submitting the form.' }),
            };
        }

        const leaveType = leaveData.typeOfLeave;
        const startDate = new Date(leaveData.startDate);
        const endDate = new Date(leaveData.endDate);

        // Helper: calculate number of leave days (inclusive)
        const dayDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        // Get current month range
        const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        // Validation for Missed Punch and Short Leave (max 2 per month)
        if (['Missed Punch', 'Short Leave'].includes(leaveData.typeOfLeave)) {
            // Use the start date selected by the employee
            const leaveStartDate = new Date(leaveData.startDate);
            const startOfMonth = new Date(leaveStartDate.getFullYear(), leaveStartDate.getMonth(), 1);
            const startOfNextMonth = new Date(leaveStartDate.getFullYear(), leaveStartDate.getMonth() + 1, 1);

            // Count only approved leaves of this type in the selected month
            const approvedCount = await LeaveApplication.countDocuments({
                eID: user.eID,
                typeOfLeave: leaveData.typeOfLeave,
                status: 'Approved',
                startDate: { $gte: startOfMonth, $lt: startOfNextMonth }
            });

            if (approvedCount >= 2) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: `${leaveData.typeOfLeave} LIMIT EXCEEDED`,
                    }),
                };
            }
        }


        // Validation for Half Day Leave
        if (leaveType === 'Half Day Leave') {
            const category = 'Casual Leave'; // or assign dynamically if needed
            if (employee.leaveBalance[category] < 0.5) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: `${category} LIMIT EXCEEDED` }),
                };
            }
            employee.leaveBalance[category] -= 0.5;
            await employee.save(); // Save updated leave balance immediately
        }

        // Validate leave balance for other types
        const validTypes = ['Earned Leave', 'Sick Leave', 'Casual Leave'];
        if (validTypes.includes(leaveType)) {
            const balance = employee.leaveBalance[leaveType] || 0;
            if (dayDiff > balance) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: `Insufficient ${leaveType} balance. You have ${balance} day(s) left, but requested ${dayDiff}.`,
                    }),
                };
            }
        }

        const leaveApplication = new LeaveApplication({
            ...leaveData,
            eID: user.eID,
            addedBy: {
                name: user.name,
                role: user.role,
            },
        });

        const savedLeave = await leaveApplication.save();

        // Notify manager
        const manager = await Employee.findOne({ officialEmail: leaveData.supervisor.officialEmail });
        if (manager) {
            const notification = new Notification({
                recipientEmpId: manager.eID,
                recipientEmail: manager.officialEmail,
                type: 'LeaveApproval',
                title: `Leave Request from ${leaveData.name}`,
                reasonForLeave: leaveData.reasonForLeave,
                startDate: leaveData.startDate,
                endDate: leaveData.endDate,
                message: `${leaveData.name} has applied for leave from ${startDate.toDateString()} to ${endDate.toDateString()}.`,
                data: { leaveId: savedLeave._id },
                isRead: false,
            });

            await notification.save();

            await sendMail(
                manager.officialEmail,
                `Leave Request from ${leaveData.name}`,
                `${leaveData.name} has applied for ${leaveType} from ${startDate.toDateString()} to ${endDate.toDateString()}.\n\nReason: ${leaveData.reasonForLeave}`
            );
        }

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Leave application submitted successfully.',
                data: savedLeave,
            }),
        };

    } catch (error) {
        console.error('Error submitting leave application:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error submitting leave application',
                error: error.message,
            }),
        };
    }
};

module.exports = {
    submitLeaveApplication,
};
