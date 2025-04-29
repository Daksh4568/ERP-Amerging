const Employee = require('../../HR Module/models/empMaster-model');
const connectToDatabase = require('../../HR Module/db/db');

exports.handler = async (event) => {
    await connectToDatabase();
    console.log('Executing resetPasswordHandler...');
    const { officialEmail, newPassword } = JSON.parse(event.body);

    if (!officialEmail || !newPassword) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Email and new password are required.' }),
        };
    }

    // Make sure the field name matches your schema (you used `officialEmail`)
    const employee = await Employee.findOne({ officialEmail });


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
