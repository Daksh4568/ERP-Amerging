const mongoose = require('mongoose');

const adminAccountsExpenseSchema = new mongoose.Schema({
    eID: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        min: 0,
        required: true,
    },
    modeOfTransaction: {
        type: String,
        enum: ['Cash', 'Bank Transfer', 'UPI', 'Card', 'Cheque'],
        required: true,
    },
    supportingDocument: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        required: true,
    },
    expenseCategory: {
        type: String,
        enum: [
            'Office Supplies',
            'Travel',
            'Maintenance',
            'Utilities',
            'Miscellaneous',
        ],
        required: true,
    },
    remarks: {
        type: String,
        trim: true,
        default: '',
    },
    assignedTo: {
        type: String, // You can use name here
        required: true,
    },
    empIdAssigned: {
        type: String, // Employee ID of the person assigned to this expense
        required: true,
    },
    addedBy: {
        name: {
            type: String,
            //required: true,
        },
        role: {
            type: String,
            //required: true,
        },
    },
}, { timestamps: true });

module.exports = mongoose.model('AdminAccountsExpense', adminAccountsExpenseSchema);
