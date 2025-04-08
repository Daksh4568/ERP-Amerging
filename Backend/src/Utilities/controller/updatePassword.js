const Employee = require('../../HR Module/models/empMaster-model');
const connectToDatabase = require('../../HR Module/db/db');

exports.handler = async (event) => {
    await connectToDatabase();
    console.log('Executing resetPasswordHandler...');
    const { personalEmail, newPassword } = JSON.parse(event.body);

    if (!personalEmail || !newPassword) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Email and new password are required.' }),
        };
    }

    // Make sure the field name matches your schema (you used `personalEmail`)
    const employee = await Employee.findOne({ personalEmail });


    if (!employee) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Employee not found.' }),
        };
    }

    // Set new password directly — will be hashed by Mongoose middleware
    employee.password = newPassword;
    await employee.save();

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Password updated successfully.' }),
    };
};
