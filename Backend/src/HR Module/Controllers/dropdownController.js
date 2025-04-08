const MasterData = require("../models/dropdownMaster");
const connectToDatabase = require("../../HR Module/db/db");

// Get all master data fields
const getMasterData = async () => {
    try {
        await connectToDatabase();

        let masterData = await MasterData.findOne();

        if (!masterData) {
            masterData = new MasterData();
            await masterData.save();
        }

        return {
            statusCode: 200,
            body: JSON.stringify(masterData),
        };

    } catch (error) {
        console.error("Error fetching master data:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error fetching master data", error: error.message }),
        };
    }
};

// Add new fields to specific sections of master data
const updateMasterData = async (requestBody) => {
    try {
        await connectToDatabase();

        let masterData = await MasterData.findOne();

        if (!masterData) {
            masterData = new MasterData();
        }

        // Update only the specified fields
        if (requestBody.expenseTypeFields && Array.isArray(requestBody.expenseTypeFields)) {
            masterData.expenseTypeFields = [
                ...new Set([...masterData.expenseTypeFields, ...requestBody.expenseTypeFields]),
            ];
        }

        if (requestBody.departmentFieldsData && Array.isArray(requestBody.departmentFieldsData)) {
            masterData.departmentFieldsData = [
                ...new Set([...masterData.departmentFieldsData, ...requestBody.departmentFieldsData]),
            ];
        }

        if (requestBody.employeeRole && Array.isArray(requestBody.employeeRole)) {
            masterData.employeeRole = [
                ...new Set([...masterData.employeeRole, ...requestBody.employeeRole]),
            ];
        }

        if (requestBody.mailCateogory && Array.isArray(requestBody.mailCateogory)) {
            masterData.mailCateogory = [
                ...new Set([...masterData.mailCateogory, ...requestBody.mailCateogory]),
            ];
        }

        await masterData.save();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Master data updated successfully",
                data: masterData,
            }),
        };

    } catch (error) {
        console.error("Error updating master data:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error updating master data", error: error.message }),
        };
    }
};

module.exports = {
    getMasterData,
    updateMasterData,
};
