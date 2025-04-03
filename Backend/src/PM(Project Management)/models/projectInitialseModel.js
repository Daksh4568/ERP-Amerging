const mongoose = require('mongoose')

const SubFormSchema = new mongoose.Schema({
    srNo: {
        type: Number,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    productCode: {
        type: String,
    },
    documents: [
        {
            documentName: {
                type: String,
            },
            documentImage: {
                type: String,
                validate: {
                    validator: function (value) {
                        return value.endsWith(".pdf"); // Ensures only PDF files are allowed
                    },
                    message: "Only PDF files are allowed in documents!",
                },
            },
        },
    ]
});

const FormSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    city: {
        type: String,
    },
    country: {
        type: String
    },
    quotationRefNumber: {
        type: String,
        required: true
    },
    ursDocument: {
        type: String,
        validate: {
            validator: function (value) {
                return value.endsWith(".pdf"); // Ensures only PDF files are allowed
            },
            message: "Only PDF files are allowed for URS Document!",
        },
    },
    projectName: {
        type: String,
        required: true
    },
    projectCode: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
    },
    subForms: {
        type: [SubFormSchema],
        default: []
    },
    addedBy: {
        name: {
            type: String,
            required: true // Ensures the submitter's name is included
        },
        role: {
            type: String,
            required: true // Ensures the submitter's role is included
        }
    }
},

    {
        timestamps: true // it will automatically add createdAt and updateAt
    });

module.exports = mongoose.model('ProjectInitialise', FormSchema)