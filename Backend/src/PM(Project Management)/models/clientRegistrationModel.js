const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema(
    {
        leadOwner: {
            type: String,
            // Assuming lead owner is mandatory
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
            required: true, // Required as seen in the form
        },
        email: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^\S+@\S+\.\S+$/.test(v);
                },
                message: "Invalid email format!",
            },
        },
        phone: {
            type: String,
        },
        mobile: {
            type: String,
        },
        company: {
            type: String,
            required: true, // Marked red, indicating mandatory
        },
        leadStatus: {
            type: String,
            enum: ["Attempted to Contact", "Contacted", "Quotation pending", "Quotation created", "Contact in Future", "Quotation Send", "Junk Lead", "Not Contacted", "Pre Qualified", "Not Qualified"], // Modify as per system logic
            default: "New",
        },
        leadSource: {
            type: String,
            enum: ["Advertisement", "Referral", "Website", "Cold Call", "Other"], // Modify based on lead sources
        },
        leadThrough: {
            type: String,
        },
        quotationNumber: {
            type: String,
        },
        contactCreated: {
            type: Date,
        },
        quotationSendDate: {
            type: Date,
        },
    },
    { timestamps: true } // Auto-adds createdAt and updatedAt
);

module.exports = mongoose.model("Lead", LeadSchema);
