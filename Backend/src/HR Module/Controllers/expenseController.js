
// const ExpenseMaster = require("../models/expenseFormModel");

// /**
//  * Simple Notification Service stub.
//  * Replace this with your actual notification mechanism (e.g., email, SMS, push) in production.
//  *
//  * @param {String} recipientRole - The role or identifier of the recipient.
//  * @param {String} message - The notification message.
//  */
// const sendNotification = (recipientRole, message) => {
//     console.log(`Notification to ${recipientRole}: ${message}`);
// };

// /**
//  * ======================================
//  * Controller Functions (Business Logic)
//  * ======================================
//  */

// /**
//  * HR submits a new expense voucher.
//  *
//  * @param {Object} data - The expense voucher data.
//  * @returns {Promise<Object>} - The saved expense voucher.
//  */
// const createExpense = async (data) => {
//     const expense = new ExpenseMaster(data);
//     await expense.save();

//     // Notify admin that a new expense voucher has been submitted.
//     sendNotification(
//         "admin",
//         `New expense voucher ${expense.refNo} submitted for approval.`
//     );
//     return expense;
// };

// /**
//  * Admin reviews and approves or rejects an expense voucher.
//  * If approved, the admin may also provide an accountNotification object
//  * with details of the accounts department employee to notify.
//  *
//  * @param {String} id - The expense voucher ID.
//  * @param {String} decision - "approve" or "reject"
//  * @param {Object} [accountNotification] - Optional. An object containing:
//  *    - recipientEmpId: {String}
//  *    - recipientEmail: {String}
//  *    - title: {String}
//  *    - message: {String}
//  * @returns {Promise<Object>} - The updated expense voucher.
//  */
// const adminApproveExpense = async (id, decision, accountNotification) => {
//     const expense = await ExpenseMaster.findById(id);
//     if (!expense) {
//         throw new Error("Expense voucher not found.");
//     }
//     if (expense.approvalStatus !== "Pending") {
//         throw new Error("Expense voucher already processed.");
//     }

//     if (decision === "approve") {
//         expense.approvalStatus = "Approved";
//         await expense.save();

//         // If accountNotification details are provided, notify the selected accounts department employee.
//         if (accountNotification) {
//             sendNotification(
//                 "account",
//                 `Expense voucher ${expense.refNo} approved by admin. Notification sent to accounts department employee: ${accountNotification.recipientEmpId}.`
//             );
//         } else {
//             // Otherwise, send a generic notification to the accounts department.
//             sendNotification(
//                 "account",
//                 `Expense voucher ${expense.refNo} approved by admin.`
//             );
//         }
//     } else if (decision === "reject") {
//         expense.approvalStatus = "Rejected";
//         await expense.save();

//         // Notify HR that the voucher was rejected.
//         sendNotification("hr", `Expense voucher ${expense.refNo} rejected by admin.`);
//     } else {
//         throw new Error('Invalid decision provided. Use "approve" or "reject".');
//     }
//     return expense;
// };

// /**
//  * Accounts department processes the expense voucher.
//  * The accounts person manually enters the following data:
//  *   - voucherNo
//  *   - expensetype (either "Direct Expense" or "Indirect Expense")
//  *   - remarks
//  *
//  * These fields are then updated in the nested accountsDepartment object for each expense item.
//  *
//  * @param {String} id - The expense voucher ID.
//  * @param {Object} accountData - An object containing:
//  *    - voucherNo: {String}
//  *    - expensetype: {String}
//  *    - remarks: {String}
//  * @returns {Promise<Object>} - The updated expense voucher.
//  */
// const accountApproveExpense = async (id, accountData) => {
//     // Validate that accountData contains the required fields.
//     if (
//         !accountData ||
//         !accountData.voucherNo ||
//         !accountData.expensetype ||
//         !accountData.remarks
//     ) {
//         throw new Error(
//             "Incomplete account data provided. Please fill in voucherNo, expensetype, and remarks."
//         );
//     }

//     const expense = await ExpenseMaster.findById(id);
//     if (!expense) {
//         throw new Error("Expense voucher not found.");
//     }
//     if (expense.approvalStatus !== "Approved") {
//         throw new Error("Expense voucher is not approved by admin yet.");
//     }

//     // Update each expense item with the provided accounts department data.
//     expense.expenses.forEach((item) => {
//         item.accountsDepartment = {
//             voucherNo: accountData.voucherNo,
//             expensetype: accountData.expensetype,
//             remarks: accountData.remarks,
//         };
//     });
//     await expense.save();

//     // Notify HR that the voucher has been processed by accounts.
//     sendNotification(
//         "hr",
//         `Expense voucher ${expense.refNo} processed by accounts department.`
//     );
//     return expense;
// };

// /**
//  * ======================================
//  * AWS Lambda Handler Functions
//  * ======================================
//  *
//  * These functions parse the incoming event, call the appropriate controller
//  * functions, and return a JSON HTTP response.
//  */

// /**
//  * Lambda Handler for HR to submit a new expense voucher.
//  * Endpoint: POST /expenses
//  */
// exports.createExpenseHandler = async (event, context) => {
//     context.callbackWaitsForEmptyEventLoop = false;
//     try {
//         const data = JSON.parse(event.body);
//         const expense = await createExpense(data);
//         return {
//             statusCode: 201,
//             body: JSON.stringify({
//                 success: true,
//                 message: "Expense voucher submitted successfully.",
//                 data: expense,
//             }),
//         };
//     } catch (error) {
//         console.error("Error in createExpenseHandler:", error);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ success: false, error: error.message }),
//         };
//     }
// };

// /**
//  * Lambda Handler for admin approval/rejection.
//  * Endpoint: PUT /expenses/{id}/admin-approval
//  *
//  * Expected Request Body Example:
//  * {
//  *   "decision": "approve",  // or "reject"
//  *   "accountNotification": {  // (Optional; include only when decision is "approve")
//  *     "recipientEmpId": "acc123",
//  *     "recipientEmail": "account@example.com",
//  *     "title": "Expense Approval Notification",
//  *     "message": "You have a new expense voucher to process."
//  *   }
//  * }
//  */
// exports.adminApproveExpenseHandler = async (event, context) => {
//     context.callbackWaitsForEmptyEventLoop = false;
//     try {
//         const id = event.pathParameters.id;
//         const { decision, accountNotification } = JSON.parse(event.body);
//         const expense = await adminApproveExpense(id, decision, accountNotification);
//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 success: true,
//                 message: `Expense voucher ${decision === "approve" ? "approved" : "rejected"
//                     } by admin.`,
//                 data: expense,
//             }),
//         };
//     } catch (error) {
//         console.error("Error in adminApproveExpenseHandler:", error);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ success: false, error: error.message }),
//         };
//     }
// };

// /**
//  * Lambda Handler for accounts department processing.
//  * Endpoint: PUT /expenses/{id}/account-approval
//  *
//  * Expected Request Body Example:
//  * {
//  *   "voucherNo": "ACCT-12345",
//  *   "expensetype": "Direct Expense",   // or "Indirect Expense"
//  *   "remarks": "Approved after verification."
//  * }
//  */
// exports.accountApproveExpenseHandler = async (event, context) => {
//     context.callbackWaitsForEmptyEventLoop = false;
//     try {
//         const id = event.pathParameters.id;
//         const accountData = JSON.parse(event.body);
//         const expense = await accountApproveExpense(id, accountData);
//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 success: true,
//                 message: "Expense voucher processed by accounts department.",
//                 data: expense,
//             }),
//         };
//     } catch (error) {
//         console.error("Error in accountApproveExpenseHandler:", error);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ success: false, error: error.message }),
//         };
//     }
// };
