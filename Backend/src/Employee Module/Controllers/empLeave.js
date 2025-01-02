const LeaveApplication = require('../models/empLeaveModel');
const Notification = require('../models/notificationSchema');
const nodemailer = require('nodemailer');

// Submit Leave Application
const submitLeaveApplication = async (req, res) => {
    try {
        const leaveApplication = new LeaveApplication({
            ...req.body,
            addedBy: {
                name: req.employee.name,
                role: req.employee.role,
            },
        });

        if (!leaveApplication.declaration) {
            return res.status(400).json({ message: 'You must agree to the declaration before submitting the form.' });
        }

        const savedLeave = await leaveApplication.save();

        const notification = new Notification({
            recipientEmpId: leaveApplication.supervisor.name,
            recipientEmail: leaveApplication.supervisor.officialEmail,
            type: 'LeaveApproval',
            title: 'Leave Approval Request',
            message: `${leaveApplication.name} applied for leave.`,
            data: { leaveId: savedLeave._id },
        });

        await notification.save();

        await sendApprovalMail(
            leaveApplication.supervisor.officialEmail,
            leaveApplication.name,
            leaveApplication.typeOfLeave,
            leaveApplication.startDate,
            leaveApplication.endDate,
            leaveApplication.reasonForLeave
        );

        res.status(201).json({
            message: 'Leave application submitted successfully.',
            data: savedLeave,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting leave application', error: error.message });
    }
};



const sendApprovalMail = async (supervisorEmail, employeeName, leaveType, startDate, endDate, reason) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: supervisorEmail,
        subject: `Leave Approval Request: ${employeeName}`,
        text: `Employee ${employeeName} applied for leave. Please review.`,
    };

    await transporter.sendMail(mailOptions);
};



module.exports = {
    submitLeaveApplication,
};
