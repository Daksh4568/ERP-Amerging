
const mongoose = require("mongoose");

const loginLogSchema = new mongoose.Schema({
    eID: String,
    ip: String,
    userAgent: String,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EmpLoginLog', loginLogSchema);