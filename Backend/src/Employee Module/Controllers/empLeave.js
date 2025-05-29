// const LeaveApplication = require('../models/empLeaveModel');
// const Notification = require('../models/notificationSchema');
// const nodemailer = require('nodemailer');
// const connectToDatabase = require('../../HR Module/db/db'); // Ensure MongoDB connection

// // Submit Leave Application
// const submitLeaveApplication = async (leaveData, user) => {
//     try {
//         // Ensure database connection
//         await connectToDatabase();

//         // Create a new leave application
//         const leaveApplication = new LeaveApplication({
//             ...leaveData,
//             addedBy: {
//                 name: user.name,
//                 role: user.role,
//             },
//         });
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

//         if (!leaveApplication.declaration) {
//             return {
//                 statusCode: 400,
//                 body: JSON.stringify({ message: 'You must agree to the declaration before submitting the form.' }),
//             };
//         }

//         // Save the leave application
//         const savedLeave = await leaveApplication.save();
//         console.log('Leave data saved:', savedLeave);


//         // Send approval email to the supervisor
//         await sendApprovalMail(
//             leaveApplication.supervisor.officialEmail,
//             leaveApplication.name,
//             leaveApplication.typeOfLeave,
//             leaveApplication.startDate,
//             leaveApplication.endDate,
//             leaveApplication.reasonForLeave
//         );

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

// // Send Approval Mail
// const sendApprovalMail = async (supervisorEmail, employeeName, leaveType, startDate, endDate, reason) => {
//     const transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 587,
//         secure: false,
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASSWORD,
//         },
//     });

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: supervisorEmail,
//         subject: `Leave Approval Request: ${employeeName}`,
//         text: `Employee ${employeeName} applied for leave.\n\nDetails:\n- Leave Type: ${leaveType}\n- Start Date: ${startDate}\n- End Date: ${endDate}\n- Reason: ${reason}\n\nPlease review.`,
//     };

//     await transporter.sendMail(mailOptions);
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

        const leaveApplication = new LeaveApplication({
            ...leaveData,
            eID: user.eID,
            addedBy: {
                name: user.name,
                role: user.role,
            },
        });

        const savedLeave = await leaveApplication.save();

        // Notification creation
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
                message: `${leaveData.name} has applied for leave from ${new Date(leaveData.startDate).toDateString()} to ${new Date(leaveData.endDate).toDateString()}.`,
                data: {
                    leaveId: savedLeave._id,
                },
                isRead: false,
            });

            await notification.save();

            // Email notification
            await sendMail(
                manager.officialEmail,
                `Leave Request from ${leaveData.name}`,
                `${leaveData.name} has applied for ${leaveData.typeOfLeave} from ${new Date(leaveData.startDate).toDateString()} to ${new Date(leaveData.endDate).toDateString()}.\n\nReason: ${leaveData.reasonForLeave}`
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
