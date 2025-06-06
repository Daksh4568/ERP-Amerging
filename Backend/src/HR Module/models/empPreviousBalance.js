const mongoose = require('mongoose');

const empPreviousBalanceSchema = new mongoose.Schema({
    previousBalance: {
        type: Number,
        min: 0, // Assuming balance cannot be negative
    },
})
const EmpPreviousBalance = mongoose.model('EmpPreviousBalance', empPreviousBalanceSchema);
module.exports = EmpPreviousBalance;