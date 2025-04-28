const mongoose = require("mongoose");

const masterDataSchema = new mongoose.Schema({
    expenseTypeFields: {
        type: [String],
        default: [
            "cash",
            "courier and postage",
            "housekeeping expense",
            "local transportation",
            "misc office expense",
            "mobile tariff expense",
            "pantry",
            "refreshment",
            "salary",
            "staff welfare",
            "tour expenses",
            "vehicle running & maintenance charges",
            "vendor payment",
        ],
    },
    departmentFieldsData: {
        type: [String],
        default: [
            "Design",
            "Instrumentation",
            "Sales",
            "IT",
            "HR",
            "Embedded",
            "Accounts",
            "Process",
            "Purchase",
            "Production",
            "Quality",
            "Store",
            "Projects",
        ],
    },
    employeeRole: {
        type: [String],
        default: ["admin", "HR", "Employee", "Manager"],
    },
    mailCategory: {
        type: [String],
        default: [
            "Accounts to Bank",
        ]
    },
    designationRoles: {
        type: [String],
        default: [
            "Associate",
        ]
    }
}, { timestamps: true });

const MasterData = mongoose.model("MasterData", masterDataSchema);

module.exports = MasterData;
