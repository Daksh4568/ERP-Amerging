const mongoose = require("mongoose")

const empMailFormatSchema = new mongoose.Schema({

    eID: {
        type: String,
        required: true
    },
    empName: {
        type: String,
        required: true
    },
    emailCategory: {
        type: String,
        required: true
    },
    emailFrom: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\S+@\S+\.\S+$/.test(v);
            },
            message: "Invalid email format!",
        },
        required: true
    },
    emailTo: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\S+@\S+\.\S+$/.test(v);
            },
            message: "Invalid email format!",
        },
        required: true
    },
    emailCC: {
        type: [String],
    },
    emailSubject: {
        type: String,
        required: true
    },
    emailBody: {
        type: String,
        required: true
    }

})


module.exports = mongoose.model('EmailFormat', empMailFormatSchema);