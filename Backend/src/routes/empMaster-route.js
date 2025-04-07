//routes file for all the api
const jwt = require('jsonwebtoken'); // Import JSON Web Token library
const employeeModel = require('../HR Module/models/empMaster-model'); // Employee model
const { auth, authorize } = require('../HR Module/middleware/auth'); // Authentication middleware
const employeeEvaluationController = require('../HR Module/Controllers/empEvaluation'); // Employee evaluation controller
const exitEmployeeController = require('../HR Module/Controllers/EmpExit'); // Exit form controller
const leaveController = require('../Employee Module/Controllers/empLeave'); // Leave management controller
const LeaveApplication = require('../Employee Module/models/empLeaveModel'); // Leave application model
const { handleLeaveNotification, getAllNotificationsForManager } = require('../Employee Module/Controllers/handleleave');
const counters = require('../HR Module/models/counterMaster'); // Counter schema for generating IDs
const connectToDatabase = require('../HR Module/db/db'); // MongoDB connection handler
const sendEmployeeCredentials = require('../HR Module/Controllers/sendMail'); // Email notification controller
const ExpenseMaster = require("../HR Module/models/expenseFormModel")
const projectFormController = require('../PM(Project Management)/controller/projectInitialiseController')
const MasterData = require("../HR Module/models/dropdownMaster");
const { getMasterData, updateMasterData } = require("../HR Module/Controllers/dropdownController");
const leadFormController = require("../PM(Project Management)/controller/clientRegcontroller")
const empMailPassController = require("../Notification/Contoller/empMailCredentials")
exports.handler = async (event) => {
  try {
    // MongoDB connection
    // Added the routes for expense form
    await connectToDatabase();

    console.log("Server started");
    const { headers, body, queryStringParameters } = event;
    const path = event.rawPath || event.path;
    const httpMethod = event.requestContext?.http?.method || event.httpMethod;
    // Main route folder   
    //  console.log('Incoming Event:', JSON.stringify(event, null, 2));
    if (!path || !httpMethod) {
      console.log('Incoming Request:', { path, httpMethod });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Path or HTTP method is undefined . Please Check' }),
      };
    }
    //console.log('Incoming Request:', { path, httpMethod, headers });


    if (path === '/' && httpMethod === 'GET') {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Welcome to the Backend Server of the ERP !' }),
      };
    }
    // Get all employees
    if (path === '/api/getemp' && httpMethod === 'GET') {
      const { employee } = await auth(headers); // Authenticate user
      authorize(employee, ['HR', 'admin']); // Authorize roles

      const employees = await employeeModel.find({});
      return {
        statusCode: 200,
        body: JSON.stringify(employees),
      };
    }

    // Get leave data
    if (path === '/api/leave-data' && httpMethod === 'GET') {
      const { employee } = await auth(headers); // Authenticate user
      const leaveData = await LeaveApplication.find({});
      return {
        statusCode: 200,
        body: JSON.stringify(leaveData),
      };
    }

    // Apply for leave
    if (path === '/api/apply-leave' && httpMethod === 'POST') {
      const { employee } = await auth(headers); // Authenticate user
      authorize(employee, ['HR', 'admin', 'Manager', 'Employee']); // Authorize roles

      const leaveData = JSON.parse(body);
      return await leaveController.submitLeaveApplication(leaveData, employee);
    }


    if (path === '/api/employee-evaluation' && httpMethod === 'POST') {
      const { employee } = await auth(headers); // Authenticate user
      authorize(employee, ['HR', 'Employee', 'admin']); // Authorize roles

      const evaluationData = JSON.parse(body); // Parse the evaluation data from the request body
      return await employeeEvaluationController.createEmployeeEvaluation(evaluationData, employee); // Directly return the controller response
    }

    // Get employee statistics
    if (path === '/api/emp/stats' && httpMethod === 'GET') {
      const { employee } = await auth(headers); // Authenticate user
      authorize(employee, ['HR', 'admin']);
      const stats = {
        totalRegularEmployees: await employee.countDocuments({ stat: 'Regular' }),
        totalMaleEmployees: await employee.countDocuments({ stat: 'Regular', gender: 'Male' }),
        totalFemaleEmployees: await employee.countDocuments({ stat: 'Regular', gender: 'Female' }),
      };
      return {
        statusCode: 200,
        body: JSON.stringify(stats),
      };
    }

    // Register a new employee
    if (path === '/api/regemp' && httpMethod === 'POST') {
      const { employee } = await auth(headers); // Authenticate user
      authorize(employee, ['HR', 'admin']); // Authorize roles

      const parsedBody = JSON.parse(body);
      const newEmployee = new employeeModel({
        ...parsedBody,
        //addedBy: { name: employee.name, role: employee.role },
      });

      try {
        // Generate unique employee ID and password
        const lastEmpCount = await counters.findOneAndUpdate(
          { counterField: 'empCounter' },
          { $inc: { counter: 1 } },
          { new: true, upsert: true }
        );

        newEmployee.eID = 'AT-' + String(lastEmpCount.counter).padStart(2, '0');
        newEmployee.stat = 'Regular';
        const password = Array.from({ length: 8 }, () =>
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!'.charAt(
            Math.floor(Math.random() * 62)
          )
        ).join('');
        newEmployee.password = password;

        await newEmployee.save();

        // Send credentials via email
        const { officialEmail, personalEmail } = newEmployee;
        const empName = parsedBody.name;

        await sendEmployeeCredentials(personalEmail, officialEmail, password, empName);

        return {
          statusCode: 201,
          body: JSON.stringify({ message: 'Employee registered successfully', newEmployee }),
        };
      } catch (e) {
        console.error('Error while registering employee:', e);
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Failed to register employee',
            details: e.message,
          }),
        };
      }
    }


    // Employee Login
    if (path === '/api/emp/login' && httpMethod === 'POST') {
      try {
        const parsedBody = JSON.parse(body);
        const emp = await employeeModel.findByCredentials(parsedBody.officialEmail, parsedBody.password);
        const token = await emp.generateAuthToken();

        console.log(`${emp.role} ${emp.name} has now logged into the system`);
        return {
          statusCode: 200,
          body: JSON.stringify({ emp, token }),
        };
      }

      catch (error) {
        //console.error('Invalid Credentials', error.message);
        return {
          statusCode: 401,
          body: JSON.stringify({ error: error.message }),
        };
      }
    }

    // Employee Logout
    if (path === '/api/emp/logout' && httpMethod === 'POST') {
      try {
        const { employee } = await auth(headers); // Authenticate user

        // Safely extract the token
        const token = headers.authorization?.replace('Bearer ', '') || headers.Authorization?.replace('Bearer ', '');
        if (!token) {
          throw new Error('Access Denied. No token provided.');
        }

        // Remove the token from the employee's tokens array
        employee.tokens = employee.tokens.filter((storedToken) => storedToken.token !== token);
        await employee.save();

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Logout successful' }),
        };
      } catch (error) {
        console.error('Error during logout:', error.message);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: error.message }),
        };
      }
    }

    // Verify Token
    if (path === '/api/token/verify' && httpMethod === 'POST') {
      const token = headers.authorization?.replace('Bearer ', '') || headers.Authorization?.replace('Bearer ', '');
      if (!token) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'No token provided.' }),
        };
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Token is valid', decoded }),
        };
      } catch (err) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' }),
        };
      }
    }

    // Update Employee Details
    if (path && path.match(/^\/api\/emp\/[^/]+$/) && httpMethod === 'PATCH') {
      const segments = path.split('/');
      const eID = segments.length > 3 ? segments[3] : null; // Extract eID safely

      // Validate eID
      if (!eID) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Employee ID (eID) is missing or invalid' }),
        };
      }


      try {
        // Authenticate user
        const { employee } = await auth(headers);
        authorize(employee, ['HR', 'admin', 'Manager', 'Employee']); // Ensure only authorized roles can update
        const updates = JSON.parse(body);
        const allowedUpdates = ['personalEmail', 'password', 'personalContactNumber'];

        const isValidOperation = Object.keys(updates).every((update) =>
          allowedUpdates.includes(update)
        );

        if (!isValidOperation) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid updates' }),
          };
        }

        // Find the employee by eID
        const emp = await employeeModel.findOne({ eID });
        if (!emp) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Employee not found' }),
          };
        }

        // Apply updates 
        for (const key in updates) {
          if (key.includes('.')) {

            emp.set(key, updates[key]);
          } else {
            emp[key] = updates[key];
          }
        }
        if (!emp.department) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Department is required and cannot be removed' }),
          };
        }

        await emp.save();

        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Employee updated successfully',
            data: emp,
          }),
        };
      } catch (error) {
        console.error('Error updating employee:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Internal Server Error',
            details: error.message,
          }),
        };
      }
    } else if (!path) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Path is undefined or invalid' }),
      };
    }
    // Validate GET request for fetching employee details
    if (path && path.match(/^\/api\/get-emp\/[^/]+$/) && httpMethod === 'GET') {
      const segments = path.split('/');
      const eID = segments.length > 3 ? segments[3] : null;

      if (!eID) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Employee ID (eID) is missing or invalid' }),
        };
      }

      try {
        // Authenticate user
        const { employee } = await auth(headers);
        authorize(employee, ['HR', 'admin']); // Authorized roles

        // Find the employee by eID
        const emp = await employeeModel.findOne({ eID });
        if (!emp) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Employee not found' }),
          };
        }

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Employee found', data: emp }),
        };
      } catch (error) {
        console.error('Error fetching employee:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Internal Server Error',
            details: error.message,
          }),
        };
      }
    }

    //update the employee details HR
    if (path && path.match(/^\/api\/update-emp\/[^/]+$/) && httpMethod === 'PATCH') {
      const segments = path.split('/');
      const eID = segments.length > 3 ? segments[3] : null;

      if (!eID) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Employee ID (eID) is missing or invalid' }),
        };
      }

      try {
        // Authenticate user
        const { employee } = await auth(headers);
        authorize(employee, ['HR']); // Only HR can update employee details

        const updates = JSON.parse(body);
        const allowedUpdates = [
          'name', 'DOB', 'personalEmail', 'maritalStatus', 'personalContactNumber',
          'officialEmail', 'bloodGroup', 'address', 'employmentType',
          'department', 'designation', 'stat', 'nominee', 'documents', 'role', 'gender',
          'passportNumber', 'empPan', 'empAadhar', 'alternateContactNumber'
        ];

        const isValidOperation = Object.keys(updates).every((update) =>
          allowedUpdates.includes(update)
        );

        if (!isValidOperation) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid updates' }),
          };
        }

        // Find the employee by eID
        const emp = await employeeModel.findOne({ eID });
        if (!emp) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Employee not found' }),
          };
        }

        // Apply updates
        Object.keys(updates).forEach((update) => emp.set(update, updates[update]));
        await emp.save();

        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Employee updated successfully',
            data: emp,
          }),
        };
      } catch (error) {
        console.error('Error updating employee:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Internal Server Error',
            details: error.message,
          }),
        };
      }
    }

    // Notifications for Manager
    if (path === '/api/notifications/manager' && httpMethod === 'GET') {
      const { employee } = await auth(headers); // Authenticate user
      authorize(employee, ['Manager', 'HR', 'admin']); // Authorize role

      return await getAllNotificationsForManager(employee); // Directly return the result
    }

    // Handle Notifications
    if (path === '/api/notifications/handle' && httpMethod === 'PATCH') {
      const { employee } = await auth(headers); // Authenticate user
      authorize(employee, ['Manager', 'HR', 'admin']); // Authorize role

      const notificationData = JSON.parse(body);
      return await handleLeaveNotification(notificationData, employee); // Directly return the result
    }
    // empMailCredentials 

    if (path === '/api/credentials' && httpMethod === 'POST') {
      const { employee } = await auth(headers); // Authenticate user
      authorize(employee, ['admin']);
      const empMailCredentialsData = JSON.parse(body);
      return await empMailPassController.saveEmpCredentials(empMailCredentialsData, employee); // Directly return the result
    }

    // Handle Employee Exit Form
    if (path === '/api/exit-form' && httpMethod === 'POST') {
      const { employee } = await auth(headers); // Authenticate user
      authorize(employee, ['HR', 'admin', 'Manager', 'Employee']); // Authorize roles

      const exitFormData = JSON.parse(body); // Parse the exit form data from the request body
      return await exitEmployeeController.createExitForm(exitFormData, employee); // Directly return the controller response
    }
    if (path === '/api/project-form' && httpMethod === 'POST') {
      const { employee } = await auth(headers); // authenticate the user
      authorize(employee, ['HR', 'admin', 'Manager', 'Employee', 'Sales']); // authorize the user
      const projectFormData = JSON.parse(body);
      return await projectFormController.createProjectForm(projectFormData, employee)
    }
    if (path == '/api/lead-form' && httpMethod === 'POST') {
      const { employee } = await auth(headers);
      authorize(employee, ['HR', 'admin', 'Manager', 'Employee', 'Sales']);
      const leadFormData = JSON.parse(body);
      return await leadFormController.createLeadForm(leadFormData, employee);
    }
    const segments = path.split("/");
    const refNo = segments.length > 3 ? segments[3] : null;
    const parsedBody = body ? JSON.parse(body) : {};

    // HR Submits Expense
    if (path === "/api/expense" && httpMethod === "POST") {
      const { employee } = await auth(headers);
      authorize(employee, ["HR"]);

      const expense = new ExpenseMaster({ ...parsedBody, approvalStatus: "Pending" });
      await expense.save();
      return { statusCode: 200, body: JSON.stringify({ message: "Expense form submitted successfully", data: expense }) };
    }

    // Admin Approves or Rejects Expense
    if (path.match(/^\/api\/expense\/[^/]+\/approve$/) && httpMethod === "PATCH" && refNo) {
      const { employee } = await auth(headers);
      authorize(employee, ["admin"]);

      const expense = await ExpenseMaster.findOne({ refNo });
      if (!expense) {
        return { statusCode: 404, body: JSON.stringify({ message: "Expense not found" }) };
      }

      if (expense.approvalStatus !== "Pending") {
        return { statusCode: 403, body: JSON.stringify({ message: "Admin cannot modify an already processed expense" }) };
      }

      const { approvalStatus, adminRemark } = parsedBody;
      if (!["Approved", "Rejected"].includes(approvalStatus)) {
        return { statusCode: 400, body: JSON.stringify({ message: "Invalid approval status" }) };
      }

      expense.approvalStatus = approvalStatus;
      expense.adminRemark = adminRemark;
      await expense.save();
      return { statusCode: 200, body: JSON.stringify({ message: "Expense status updated", data: expense }) };
    }

    // Accounts Department Adds Financial Details for All Expenses in the Form
    if (path.match(/^\/api\/expense\/[^/]+\/accounts$/) && httpMethod === "PATCH" && refNo) {
      const { employee } = await auth(headers);

      if (employee.department !== 'Accounts') {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: "Access Denied . Only Accounts department employee can perform this action" })
        }
      }

      const expense = await ExpenseMaster.findOne({ refNo });
      if (!expense) {
        return { statusCode: 404, body: JSON.stringify({ message: "Expense not found" }) };
      }

      if (expense.approvalStatus !== "Approved") {
        return { statusCode: 403, body: JSON.stringify({ message: "Expense must be approved before adding accounts details" }) };
      }

      // if (expense.expenses.some(item => item.accountsDepartment)) {
      //   return { statusCode: 403, body: JSON.stringify({ message: "Accounts details already added, cannot modify." }) };
      // }

      const { accountsDetails } = parsedBody;

      expense.expenses.forEach((item, index) => {
        if (accountsDetails[index]) {
          item.accountsDepartment = accountsDetails[index];
        }
      });

      await expense.save();
      return { statusCode: 200, body: JSON.stringify({ message: "Accounting details added for all expenses", data: expense }) };
    }

    // Fetch All Expenses (Admin Access)
    if (path === "/api/expenses" && httpMethod === "GET") {
      const { employee } = await auth(headers);
      authorize(employee, ["admin", "HR"]);
      const expenses = await ExpenseMaster.find();
      return { statusCode: 200, body: JSON.stringify({ data: expenses }) };
    }

    // Fetch Approved Expenses for Accounts
    if (path === "/api/expenses/approved" && httpMethod === "GET") {
      const { employee } = await auth(headers);

      if (employee.department !== 'Accounts') {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: "Only accounts department can access this" })
        };
      }
      const expenses = await ExpenseMaster.find({ approvalStatus: "Approved" });
      return { statusCode: 200, body: JSON.stringify({ data: expenses }) };
    }
    // GET Expense by id 
    if (path.match(/^\/api\/get-expense\/[^/]+$/) && httpMethod === "GET") {
      const expenseId = path.split("/").pop();// extracting the expense id from the ur;
      const { employee } = await auth(headers);

      authorize(employee, ["HR"]) // onlly hr can update the expense

      const expense = await ExpenseMaster.findById(expenseId);

      if (!expense) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Expense not found" }),
        };

      }
      return {
        statusCode: 200,
        body: JSON.stringify({ data: expense })
      };
    }
    // Get all master data
    if (path === '/api/get-master-data' && httpMethod === 'GET') {
      return await getMasterData();
    }

    // Update master data fields
    if (path === '/api/update-master-data' && httpMethod === 'PATCH') {
      const { employee } = await auth(headers);

      authorize(employee, ["HR"])
      const requestBody = JSON.parse(body);
      return await updateMasterData(requestBody);
    }
    if (path.match(/^\/api\/update-expense\/[^/]+$/) && httpMethod === "PATCH") {
      try {

        const expenseId = path.split("/").pop()

        const updates = JSON.parse(body);

        const { employee } = await auth(headers);
        authorize(employee, ["HR"]); // only HR can update the expense

        let expense = await ExpenseMaster.findById(expenseId);
        if (!expense) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: "Expense not found" }),
          };
        }

        // Prevent modification of refNo but set approvalStatus to "PENDING"
        updates.refNo = expense.refNo; // Ensure refNo remains unchanged
        updates.approvalStatus = "Pending"; // Automatically set to pending

        // Update the expense
        expense = await ExpenseMaster.findByIdAndUpdate(
          expenseId,
          updates,
          { new: true, runValidators: true } // Ensure updated document is returned & validation runs
        );


        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "Expense updated successfully", data: expense
          }),
        };

      } catch (e) {
        console.error("Error processing PATCH request:", e);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Internal Server Error", details: e.message }),
        };
      }
    }

    // delete an employee 
    if (path && path.match(/^\/api\/delete-emp\/[^/]+$/) && httpMethod === 'DELETE') {
      const segments = path.split('/');
      const eID = segments.length > 3 ? segments[3] : null;

      if (!eID) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Employee ID (eID) os missing or invalid' }),
        };
      }

      try {
        // authenticate user

        const { employee } = await auth(headers);

        authorize(employee, ['HR', 'admin']); // only hr will be allowed to delete the employee

        const emp = await employeeModel.findOneAndDelete({ eID });

        if (!emp) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Employee not found' }),
          }
        }

        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Employee deleted successfully'
          }),
        };

      } catch (e) {
        console.error('Error deleting the employee :', error)
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Internal server error', details: error.message }),
        };
      }

    }


    // Default response for unmatched routes
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

// Update Employee Counter
const updateEmpCounter = async (action) => {
  try {
    const empCount = await counters.find({ counterField: 'empCounter' });

    if (empCount.length === 0) {
      const newCounter = new counters({ counterField: 'empCounter', counter: 0 });
      const savedCounter = await newCounter.save();
      return { counter: savedCounter.counter };
    } else {
      if (action === 'read') {
        return { counter: empCount[0].counter };
      } else {
        empCount[0].counter += 1;
        const updatedCounter = await empCount[0].save();
        return { counter: updatedCounter.counter };
      }
    }
  } catch (e) {
    throw new Error('db error');
  }
};
