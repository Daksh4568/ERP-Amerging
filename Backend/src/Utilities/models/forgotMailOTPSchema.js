const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    officialEmail: {
        type: String,
        reqired: true
    },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('OtpVerficiation', otpSchema);
