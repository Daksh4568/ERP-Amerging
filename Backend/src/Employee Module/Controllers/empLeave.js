const LeaveApplication = require('../models/empLeaveModel')
require('dotenv').config();
const nodemailer = require('nodemailer') // For sending approval mails to the manager

exports.submitLeaveApplication = async (req, res) => {

    try {
        const allowedFields = [
            'eID',
            'name',
            'department',
            'designation',
            'personalEmail',
            'typeOfLeave',
            'specifyIfOthers',
            'startDate',
            'endDate',
            'reasonForLeave',
            'emergencyContact',
            'addressDuringLeave',
            'supervisor',
            'additionalNotes',
            'declaration'
        ];
        const filteredData = {};

        allowedFields.forEach((field) => {
            if (req.body[field] != undefined) {
                filteredData[field] = req.body[field];
            }
        });

        if (!filteredData.declaration) {
            return res.status(400).json({
                message: 'You muss agree to the declaration before submitting the form .'
            });
        }

        filteredData.addedBy = {
            name: req.employee.name,
            role: req.employee.role,
        };

        // Save the leave application data to the database

        const leaveApplication = new LeaveApplication(filteredData);
        const savedData = await leaveApplication.save();

        await sendApprovalMail(
            filteredData.supervisor.officialEmail,
            filteredData.name,
            filteredData.typeOfLeave,
            filteredData.startDate,
            filteredData.endDate,
            filteredData.reasonForLeave
        );

        res.status(201).json({
            message: 'Leave application submitted successfully . Approval email sent to supervisor .',
            data: savedData
        });
    } catch (e) {
        console.log('Error submitting leave application:', e.message);

        res.status(500).json({
            message: 'Error submitting leave application',
            error: e.message,
        });
    }
};

const sendApprovalMail = async (supervisorEmail, employeeName, leaveType, startDate, endDate, reason) => {
    try {
        // Configure Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // `true` for port 465, `false` for other ports
            auth: {
                user: process.env.EMAIL_USER, // Gmail email
                pass: process.env.EMAIL_PASSWORD, // App password
            },
        });

        // Compose the Email Content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: supervisorEmail,
            subject: `Leave Approval Request: ${employeeName}`,
            text: `
  Dear ${employeeName}'s Supervisor,
  
  You have a pending leave approval request.
  
  Employee Name: ${employeeName}
  Type of Leave: ${leaveType}
  Start Date: ${new Date(startDate).toDateString()}
  End Date: ${new Date(endDate).toDateString()}
  Reason: ${reason || 'No reason specified'}
  
  Please review this leave request and take appropriate action.
  
  Regards,  
  Leave Management System
        `,
        };

        // Send the Email
        await transporter.sendMail(mailOptions);
        console.log(`Approval email sent to ${supervisorEmail}`);
    } catch (error) {
        console.error('Failed to send approval email:', error.message);
        throw new Error('Failed to send approval email');
    }
};