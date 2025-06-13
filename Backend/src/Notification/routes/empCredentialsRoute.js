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
const Attendance = require("../../AttendanceLogs/Models/empAttendanceLogs"); // adjust path if needed
//const moment = require('moment');
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
        const parseTime = (timeStr) => new Date(`1970-01-01T${timeStr}`);
        if (path === '/api/attendance' && httpMethod === 'GET') {
            try {
                await sql.connect(config);

                const result = await sql.query(`SELECT * FROM DeviceLogs_6_2025`);
                const logs = result.recordset;

                const attendanceMap = new Map();

                for (const log of logs) {
                    const eID = log.UserId;

                    // ✅ Use LogDate as-is, assuming it's already in IST
                    const logDateTime = new Date(log.LogDate);

                    const logDate = logDateTime.toISOString().split('T')[0]; // YYYY-MM-DD
                    const logTime = logDateTime.toISOString().split('T')[1].slice(0, 5);
                    const key = `${eID}_${logDate}`;
                    // We have to use .getUTCHours() and getMinutes() to ensure we are comparing the time in UTC
                    //,getHours() and getMinutes() will return the local time of the server, which may not be UTC and it will add //an offset to the time, which can lead to incorrect comparisons.
                    const hour = logDateTime.getUTCHours();
                    // const minute = logDateTime.getMinutes();
                    const minute = logDateTime.getUTCMinutes();
                    if (!attendanceMap.has(key)) {
                        attendanceMap.set(key, { eID, date: logDate, inTime: null, outTime: null });
                    }

                    const attendance = attendanceMap.get(key);

                    // Earliest time before 11:30 AM = inTime
                    // if ((hour < 11) || (hour === 11 && minute <= 30)) {
                    //     if (!attendance.inTime || logTime < attendance.inTime) {
                    //         attendance.inTime = logTime;
                    //     }
                    // }
                    if ((hour < 11) || (hour === 11 && minute <= 30)) {
                        if (
                            !attendance.inTime ||
                            logDateTime < new Date(`${logDate}T${attendance.inTime}:00Z`)
                        ) {
                            console.log(`✅ [Set InTime] ${eID} | ${logDate} | ${logTime}`);
                            attendance.inTime = logTime;
                        }
                    }
                    // Latest time after 5:00 PM = outTime
                    if ((hour > 17) || (hour === 17 && minute >= 0)) {
                        if (!attendance.outTime || logTime > attendance.outTime) {
                            attendance.outTime = logTime;
                        }
                    }
                }

                // Save to MongoDB
                for (const [_, data] of attendanceMap.entries()) {
                    const { eID, date, inTime, outTime } = data;

                    if (!inTime && !outTime) continue; // Skip invalid entries
                    let empLateIn = false;
                    if (inTime) {
                        const inDateTime = new Date(`${date}T${inTime}:00Z`);
                        const lateThreshold = new Date(`${date}T03:45:00Z`);
                        if (inDateTime > lateThreshold) {
                            empLateIn = true;
                        }
                    }
                    const status = inTime ? 'Present' : 'Absent';


                    await Attendance.findOneAndUpdate(
                        { eID, date },
                        { inTime, outTime, empLateIn, status },
                        { upsert: true, new: true }
                    );
                    console.log(`Saving: ${eID} | ${date} | In: ${inTime} | Out: ${outTime}`);

                }


                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Attendance synced successfully.' }),
                };
            }
            catch (err) {
                console.error('Attendance sync error:', err);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Internal server error' }),
                };
            } finally {
                sql.close();
            }
        };

        if (path.match(/^\/api\/attendanceLog(\/[^/]+)?$/) && httpMethod === 'GET') {
            const { employee } = await auth(headers);
            authorize(employee, ['Employee', 'Manager', 'admin', 'HR']);

            // Extract eID if present in the URL: /api/attendance or /api/attendance/:eID
            const segments = path.split('/');
            const eID = segments.length > 3 ? segments[3] : null;

            let attendanceData;
            if (eID) {
                attendanceData = await Attendance.find({ eID });
            } else {
                attendanceData = await Attendance.find({});
            }

            if (!attendanceData || attendanceData.length === 0) {
                return { statusCode: 404, body: JSON.stringify({ message: "No attendance data found" }) };
            }

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Attendance data fetched successfully",
                    data: attendanceData
                })
            };
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