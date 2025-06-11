const EmpCredentials = require('../models/emp_MailCredentials')
const { auth, authorize } = require('../../HR Module/middleware/auth'); // Authentication middleware
const connectToDatabase = require('../../HR Module/db/db'); // MongoDB connection handler
const crypto = require("crypto")
const algorithm = 'aes-256-cbc';
const sql = require('mssql');
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const emailFormatController = require('../Contoller/empMailFormatController')
const sendOtpHandler = require('../../Utilities/controller/forgotPassword')
const verifyOtpHandler = require('../../Utilities/controller/verifyOtp')
const resetPasswordHandler = require('../../Utilities/controller/updatePassword')
const TourExpense = require("../../Employee Module/models/empTourExpense")
const { decrypt } = require('../../Utilities/decrypt');
const sendEmployeeCredentials = require('../../HR Module/Controllers/sendMail'); // adjust path if needed
const employeeModel = require('../../HR Module/models/empMaster-model'); // adjust path
const EmpAttendance = require("../../AttendanceLogs/Models/empAttendanceLogs"); // adjust path if needed
const moment = require('moment');
exports.handler = async (event) => {
    try {
        // routes
        await connectToDatabase();

        const { headers, body, queryStringParameters } = event;
        const path = event.rawPath || event.path;
        const httpMethod = event.requestContext?.http?.method || event.httpMethod;

        if (!path || !httpMethod) {
            console.log('Incoming Request:', { path, httpMethod });
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Path or HTTP method is undefined . Please Check' }),
            };
        }
        if (path === '/api/email_format' && httpMethod === 'POST') {
            const { employee } = await auth(headers);
            authorize(employee, ['Employee', 'Manager', 'admin', 'HR'])

            const emailData = JSON.parse(body);
            return await emailFormatController.createEmailFormat(emailData, employee)
        }
        if (path === '/api/auth/send-otp' && httpMethod === 'POST') {
            return await sendOtpHandler.handler(event);
        }

        if (path === '/api/auth/verify-otp' && httpMethod === 'POST') {
            return await verifyOtpHandler.handler(event);
        }
        if (path === '/api/auth/reset-password' && httpMethod === 'PATCH') {
            return await resetPasswordHandler.handler(event);
        }

        if (path === '/api/emp_credentials' && httpMethod === 'GET') {
            const { employee } = await auth(headers); // Authenticate user
            authorize(employee, ['admin']); // Authorize roles

            const credentials = await EmpCredentials.find();



            const decryptedCredentials = credentials.map((cred) => {
                const iv = Buffer.from(cred.iv, 'hex');
                const decipher = crypto.createDecipheriv(algorithm, key, iv);
                let decrypted = decipher.update(cred.officialMailpassword, 'hex', 'utf8');
                decrypted += decipher.final('utf8');

                return {
                    _id: cred._id,
                    eID: cred.eID,
                    empName: cred.empName,
                    officialMail: cred.officialMail,
                    officialMailpassword: decrypted,
                };
            });
            return {
                statusCode: 200,
                body: JSON.stringify(decryptedCredentials),
                headers: { 'Content-Type': 'application/json' }
            };
        }

        const segments = path.split("/");
        const expenseRefNo = segments.length > 3 ? segments[3] : null;
        const parsedBody = body ? JSON.parse(body) : {};




        const config = {
            user: 'sa',
            password: '@pplec1t',
            server: '192.168.1.4',
            database: 'etimetracklite1',
            port: 1433,
            options: {
                encrypt: false, // Use encryption for data transfer
                trustServerCertificate: true, // For self-signed certs (local)
            }
        };
        // Fetch Attendance Data
        // if (path === '/api/attendance' && httpMethod === 'GET') {
        //     try {
        //         // Connect to SQL Server
        //         await sql.connect(config);

        //         // Query the attendance table (change table name if needed)
        //         const result = await sql.query(`SELECT * FROM DeviceLogs_6_2025`);
        //         console.log('Attendance data fetched successfully:', result.recordset);

        //         // Return the attendance data
        //         return {
        //             statusCode: 200,
        //             body: JSON.stringify({ data: result.recordset }),
        //         };
        //     } catch (error) {
        //         console.error('Error fetching attendance:', error);
        //         return {
        //             statusCode: 500,

        //             body: JSON.stringify({ error: 'Internal Server Error' }),
        //         };
        //     } finally {
        //         sql.close(); // Ensure connection is closed
        //     }
        // }

        if (path === '/api/attendance' && httpMethod === 'GET') {
            try {
                await sql.connect(config);

                const result = await sql.query(`SELECT * FROM DeviceLogs_6_2025`);
                const records = result.recordset;

                const attendanceMap = {}; // { eID_date: { inTime, outTime } }

                for (const entry of records) {
                    const { empCode, logDate, logTime } = entry;

                    if (!empCode || !logDate || !logTime) continue;

                    const date = moment(logDate).format("YYYY-MM-DD");
                    const time = moment(logTime, 'HH:mm:ss');

                    const key = `${empCode}_${date}`;
                    const hour = time.hour();
                    const minute = time.minute();

                    // Filter valid inTime and outTime
                    if (!attendanceMap[key]) {
                        attendanceMap[key] = { eID: empCode, date, inTime: null, outTime: null };
                    }

                    const entryTime = time.format("HH:mm:ss");

                    if (hour < 11 || (hour === 11 && minute <= 30)) {
                        // Check if inTime is earlier
                        if (!attendanceMap[key].inTime || entryTime < attendanceMap[key].inTime) {
                            attendanceMap[key].inTime = entryTime;
                        }
                    } else if (hour > 15 || (hour === 15 && minute >= 30)) {
                        // Check if outTime is later
                        if (!attendanceMap[key].outTime || entryTime > attendanceMap[key].outTime) {
                            attendanceMap[key].outTime = entryTime;
                        }
                    }
                }

                // Save all entries (bulk upsert)
                const bulkOps = Object.values(attendanceMap).map(record => ({
                    updateOne: {
                        filter: { eID: record.eID, date: record.date },
                        update: { $set: { inTime: record.inTime, outTime: record.outTime } },
                        upsert: true
                    }
                }));

                if (bulkOps.length > 0) {
                    await EmpAttendance.bulkWrite(bulkOps);
                }

                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: "Attendance synced successfully", count: bulkOps.length }),
                };
            } catch (error) {
                console.error('Error syncing attendance:', error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
                };
            } finally {
                sql.close();
            }
        }
        // Employee Submits Expense
        if (path === "/api/tourExpense" && httpMethod === "POST") {
            const { employee } = await auth(headers);
            authorize(employee, ["Employee", "Manager", "admin"]);


            //const tourexpense = new TourExpense({ ...parsedBody, approvalStatus: "Pending", addedBy: { name: employee.name, role: employee.role } });

            const tourexpense = new TourExpense({
                ...parsedBody, approvalStatus: "Pending",
                addedBy: {
                    name: employee.name,
                    role: employee.role
                }
            });
            await tourexpense.save();
            return { statusCode: 200, body: JSON.stringify({ message: "Tour Expense form submitted successfully", data: tourexpense }) };
        }
        if (path === "/api/tourExpensedata" && httpMethod === "GET") {
            const { employee } = await auth(headers);
            authorize(employee, ["Employee", "Manager", "admin", "HR"]);
            const tourexpense = await TourExpense.find({});
            if (!tourexpense) {
                return { statusCode: 404, body: JSON.stringify({ message: "Tour Expense not found" }) };
            }
            return { statusCode: 200, body: JSON.stringify({ message: "Tour Expense data fetched successfully", data: tourexpense }) };
        }
        // HR Approves or Rejects TourExpense
        if (path.match(/^\/api\/tourExpense\/[^/]+\/approve$/) && httpMethod === "PATCH" && expenseRefNo) {
            const { employee } = await auth(headers);
            authorize(employee, ["HR"]);

            const tourexpense = await TourExpense.findOne({ expenseRefNo });
            if (!tourexpense) {
                return { statusCode: 404, body: JSON.stringify({ message: "Tour Expense not found" }) };
            }

            if (tourexpense.approvalStatus !== "Pending") {
                return { statusCode: 403, body: JSON.stringify({ message: "HR cannot modify an already processed expense" }) };
            }

            const { approvalStatus, hrRemark } = parsedBody;
            if (!["Approved", "Rejected"].includes(approvalStatus)) {
                return { statusCode: 400, body: JSON.stringify({ message: "Invalid approval status" }) };
            }

            tourexpense.approvalStatus = approvalStatus;
            tourexpense.hrRemark = hrRemark;
            await tourexpense.save();
            return { statusCode: 200, body: JSON.stringify({ message: "Tour Expense status updated", data: tourexpense }) };
        }

        // Accounts Department Adds Financial Details for All Expenses in the Form
        if (path.match(/^\/api\/tourExpense\/[^/]+\/accounts$/) && httpMethod === "PATCH" && expenseRefNo) {
            const { employee } = await auth(headers);

            if (employee.department !== 'Accounts') {
                return {
                    statusCode: 403,
                    body: JSON.stringify({ message: "Access Denied . Only Accounts department employee can perform this action" })
                }
            }

            const tourexpense = await TourExpense.findOne({ expenseRefNo });
            if (!tourexpense) {
                return { statusCode: 404, body: JSON.stringify({ message: "Expense not found" }) };
            }

            if (tourexpense.approvalStatus !== "Approved") {
                return { statusCode: 403, body: JSON.stringify({ message: "Expense must be approved before adding accounts details" }) };
            }

            // if (expense.expenses.some(item => item.accountsDepartment)) {
            //   return { statusCode: 403, body: JSON.stringify({ message: "Accounts details already added, cannot modify." }) };
            // }

            const { voucherNo, accExpenseType, remarks, accountsDetailStatus } = parsedBody;

            tourexpense.voucherNo = voucherNo;
            tourexpense.accExpenseType = accExpenseType;
            tourexpense.remarks = remarks;
            tourexpense.accountsDetailStatus = accountsDetailStatus;



            await tourexpense.save();
            return { statusCode: 200, body: JSON.stringify({ message: "Accounting details added for all TourExpense", data: tourexpense }) };
        }


        if (path && path.match(/^\/api\/reinvite\/[^/]+$/) && httpMethod === 'POST') {
            const segments = path.split('/');
            const eID = segments.length > 3 ? segments[3] : null; // Extract eID safely

            // Validate eID
            if (!eID) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'Employee ID (eID) is missing or invalid' }),
                };
            }
            const { employee } = await auth(headers);
            authorize(employee, ['HR', 'admin']);

            // Extract eID from the URL
            try {
                const emp = await employeeModel.findOne({ eID }).select('+password');;

                if (!emp) {
                    return {
                        statusCode: 404,
                        body: JSON.stringify({ error: 'Employee not found' }),
                    };
                }

                const empName = emp.name;
                const personalEmail = emp.personalEmail;
                const officialEmail = emp.officialEmail;
                console.log('Official password', emp.password);


                // if (!personalEmail || !officialEmail || !emp.password) {
                //     return {
                //         statusCode: 400,
                //         body: JSON.stringify({ error: 'Missing required employee fields (personalEmail / officialEmail / password)' }),
                //     };
                // }

                // Decrypt password
                if (!emp.password) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: 'Missing encrypted password for employee' }),
                    };
                }

                const decryptedPassword = decrypt(emp.password);

                // Send email
                await sendEmployeeCredentials(personalEmail, officialEmail, decryptedPassword, empName);

                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Invite email resent successfully' }),
                };
            } catch (error) {
                console.error('Error resending invite:', error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Failed to resend invite', details: error.message }),
                };
            }
        }

        // If no route matches
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Route not found' }),
        };

    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};