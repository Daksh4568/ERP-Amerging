const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    personalEmail: {
        type: String,
        reqired: true
    },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('OtpVerficiation', otpSchema);
