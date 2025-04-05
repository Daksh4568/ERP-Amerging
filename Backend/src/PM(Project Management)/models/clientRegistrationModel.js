const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema(
    {
        leadOwner: {
            type: String,
            required: true// Assuming lead owner is mandatory
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^\S+@\S+\.\S+$/.test(v);
                },
                message: "Invalid email format!",
            },
            required: true
        },
        phone: {
            type: String,
        },
        mobile: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true,
        },
        leadStatus: {
            type: String,
            enum: ["Attempted to Contact", "Contacted", "Quotation pending", "Quotation created", "Contact in Future", "Quotation Send", "Junk Lead", "Not Contacted", "Pre Qualified", "Not Qualified"], // Modify as per system logic
            required: true
        },
        leadSource: {
            type: String,
            enum: ["Advertisement", "Referral", "Website", "Cold Call", "Other"], // Modify based on lead sources
            required: true
        },
        leadThrough: {
            type: String,
            required: true
        },
        quotationNumber: {
            type: String,
            required: true
        },
        contactCreated: {
            type: Date,
        },
        quotationSendDate: {
            type: Date,
        },
        description: {
            type: String
        },
        address: {
            street: String,
            city: String,
            state: String,
            postalCode: {
                type: String,
                required: true,
                validate: {
                    validator: function (v) {
                        return /\d{6}/.test(v); // Validate that postal code is 6 digits
                    },
                    message: (props) => `${props.value} is not a valid postal code!`,
                },
            },
            country: String,
        },
    },
    { timestamps: true } // Auto-adds createdAt and updatedAt
);

module.exports = mongoose.model("Lead", LeadSchema);
