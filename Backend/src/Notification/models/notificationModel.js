const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    eID: { type: String, ref: "employeeMaster", required: true }, // Reference eID instead of userId
    message: { type: String, required: true },
    type: { type: String, enum: ["leave_request", "meeting", "general"], default: "general" },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
