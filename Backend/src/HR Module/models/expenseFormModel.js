// Schema for the expense model 
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
//expense form model
const expenseItemSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    expenseType: {
        type: String,
        required: true,
    },
    description: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    incurredBy: { type: String, required: true },
    supportingDocument: { type: String },

    // These fields will be filled when the form will go to Accounts Department for approval
    accountsDepartment: {
        voucherNo: {
            type: String,
        },
        accExpenseType: {
            type: String,
            enum: ["Direct Expense", "Indirect Expense"]
        },
        remarks: {
            type: String,
        },
        accountsDetailStatus: {
            type: String,
            enum: ["Added", "Not Added"],
            default: "Not Added",
        }

    }
});


const expenseMasterSchema = new mongoose.Schema(
    {
        eID: { type: String },
        refNo: { type: Number, unique: true },
        date: { type: Date, required: true },
        previousBalance: { type: Number, default: 0 },
        department: { type: String, required: true },
        //array of expenses
        expenses: [expenseItemSchema],
        totalExpense: { type: Number, default: 0 },
        balance: { type: Number, default: 0 },
        recipientID: {
            type: String,
            required: true
        },
        approvalStatus: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        adminRemark: {
            type: String
        }
    },
    { timestamps: true }
);


expenseMasterSchema.plugin(AutoIncrement, { inc_field: "refNo", start_seq: 1 });


expenseMasterSchema.pre("save", function (next) {
    this.totalExpense = this.expenses.reduce((sum, item) => sum + item.amount, 0);
    this.balance = this.previousBalance - this.totalExpense;
    next();
});

module.exports = mongoose.model("ExpenseMaster", expenseMasterSchema);
