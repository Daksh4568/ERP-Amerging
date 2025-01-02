const Notification = require('../models/notificationSchema');
const LeaveApplication = require('../models/empLeaveModel');
const sendMail = require('./sendmail');

// Approve or reject a leave request
const handleLeaveNotification = async (req, res) => {
    try {
        const { notificationId, status, managerComment } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value.' });
        }

        // Find the notification
        const notification = await Notification.findOne({ notificationId });
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found.' });
        }

        // Find the leave application
        const leaveApplication = await LeaveApplication.findById(notification.data.leaveId);
        if (!leaveApplication) {
            return res.status(404).json({ error: 'Leave application not found.' });
        }

        if (leaveApplication.status !== 'Pending') {
            return res.status(400).json({ error: 'Leave request is no longer pending.' });
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

        res.status(200).json({ message: `Leave request ${status.toLowerCase()} successfully.`, leaveApplication });
    } catch (error) {
        res.status(500).json({ error: 'Error handling leave notification.', details: error.message });
    }
};

// Fetch all notifications for a manager
const getAllNotificationsForManager = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipientEmpId: req.employee.eID,
        }).sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notifications.', details: error.message });
    }
};

module.exports = { handleLeaveNotification, getAllNotificationsForManager };
