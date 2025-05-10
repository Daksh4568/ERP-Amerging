const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const tourExpenseItemSchema = new mongoose.Schema({
    expenseRefNo: { type: Number, unique: true },

    eID: {
        type: String,
        required: true,
    },
    name: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String },
    projectCode: {
        type: String,
        required: true
    },
    expenseType: {
        type: String,
    },
    date: {
        type: Date,
    },
    time: {
        type: String,
    },
    amount: {
        type: Number,
        min: 0
    },
    description: {
        type: String,
        default: ""
    },
    supportingDocument: {
        type: String, // URL or file path
        default: ""
    },
    approvalStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
    hrRemark: {
        type: String
    },
    addedBy: { name: { type: String, required: true }, role: { type: String, required: true } },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
tourExpenseItemSchema.plugin(AutoIncrement, { inc_field: "expenseRefNo", start_seq: 1 });

module.exports = mongoose.model("TourExpense", tourExpenseItemSchema);