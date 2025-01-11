/**
 * This script sets up an Express router with routes for managing employee data,
 * including employee retrieval, evaluation, registration, leave applications, 
 * token verification, and more.
 */

const express = require('express'); // Import the Express library
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
const router = new express.Router(); // Create a new Express router instance
const jwt = require('jsonwebtoken'); // Import JSON Web Token library

// Import models and controllers
const employee = require('../HR Module/models/empMaster-model'); // Employee model
const { auth, authorize } = require('../HR Module/middleware/auth'); // Authentication middleware
const employeeEvaluationController = require('../HR Module/Controllers/empEvaluation'); // Employee evaluation controller
const exitEmployeeController = require('../HR Module/Controllers/EmpExit'); // Exit form controller
const regEmployee = require('../HR Module/models/empMaster-model'); // Employee registration model
const sendEmployeeCredentials = require('../HR Module/Controllers/sendMail'); // Email notification controller
// const leaveController = require('../Employee Module/Controllers/empLeave'); // Leave management controller
const leaveController = require('../Employee Module/Controllers/empLeave');
const LeaveApplication = require('../Employee Module/models/empLeaveModel'); // to get the leave data from the database
const { handleLeaveNotification, getAllNotificationsForManager } = require('../Employee Module/Controllers/handleleave');
const counters = require('../HR Module/models/counterMaster'); // Counter schema for generating IDs

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000'; // Define the base URL for the application
/**
 * Route to get all employee data.
 * Accessible by authorized roles.
 */
router.get('/getemp', auth, authorize('HR', 'admin', 'Manager', 'Employee'), async (req, res) => {
  try {
    const employees = await employee.find({});
    res.send(employees);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.get('/leave-data', auth, async (req, res) => {
  try {
    const leaveData = await LeaveApplication.find({});
    res.status(200).send(leaveData);
  } catch (e) {
    res.status(500).send({ e: "Error while fetching the data" });

  }
})
/**
 * Route to retrieve employee evaluation data.
 * Accessible by authenticated users.
 */
router.get('/emp/evaluationdata', auth, async (req, res) => {
  try {
    const empevaluationData = await EmployeeEvaluation.find({});
    res.status(200).send(empevaluationData);
  } catch (e) {
    console.error("Error retrieving evaluation data:", e);
    res.status(500).send({ error: "Error while fetching the data" });
  }
});

/**
 * Route to retrieve statistics on employees (total, male, female regular employees).
 */
router.get('/emp/stats', auth, async (req, res) => {
  try {
    const totalRegularEmployees = await employee.countDocuments({ stat: 'Regular' });
    const totalMaleEmployees = await employee.countDocuments({ stat: 'Regular', gender: 'Male' });
    const totalFemaleEmployees = await employee.countDocuments({ stat: 'Regular', gender: 'Female' });

    res.send({
      totalRegularEmployees,
      totalMaleEmployees,
      totalFemaleEmployees
    });
  } catch (e) {
    res.status(400).send('db error');
  }
});

/**
 * Route to submit a leave application.
 * Accessible by authorized roles.
 */
router.post('/apply-leave', auth, authorize('HR', 'admin', 'Manager', 'Employee'), leaveController.submitLeaveApplication);

/**
 * Route to handle employee exit forms.
 */
router.post('/exit-form', auth, authorize('HR', 'admin', 'Manager', 'Employee'), exitEmployeeController.createExitForm);

router.get('/notifications/manager', auth, authorize('Manager'), getAllNotificationsForManager);
router.patch('/notifications/handle', auth, authorize('Manager'), handleLeaveNotification);

/**
 * Route to handle employee evaluation data submission.
 */
router.post('/employee-evaluation', auth, authorize('HR', 'Employee'), employeeEvaluationController.createEmployeeEvaluation);

/**
 * Route to register a new employee.
 */
router.post('/regemp', auth, authorize('HR', 'admin'), async (req, res) => {
  // Employee object creation with additional metadata
  const emp = new regEmployee({
    ...req.body,
    addedBy: {
      name: req.employee.name,
      role: req.employee.role,
    },
  });

  try {
    // Generate unique employee ID and password
    const lastEmpCount = await updateEmpCounter('read');
    emp.eID = 'AT-' + String(lastEmpCount.counter + 1).padStart(2, '0');
    emp.stat = 'Regular';
    if (!emp.moduleAccess) emp.moduleAccess = 1;

    const generateRandomPassword = (length = 8) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
      let password = '';
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    const randomPassword = generateRandomPassword();
    emp.password = randomPassword;

    await emp.save();

    // Send credentials via email
    const { officialEmail, personalEmail } = emp;
    const empName = req.body.name;
    await sendEmployeeCredentials(personalEmail, officialEmail, randomPassword, empName);

    const token = await emp.generateAuthToken();
    await updateEmpCounter('write');

    res.status(201).send({ emp, token });
    console.log("Employee Details :", emp);
    console.log(
      `Employee ${emp.name} (eID: ${emp.eID}) added to the database by ${emp.addedBy.name} (${emp.addedBy.role})`
    );
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});
module.exports = router;
// Other routes follow a similar pattern and are explained in the same way.
router.post('/emp/login', async (req, res) => {
  try {
    const emp = await employee.findByCredentials(req.body.officialEmail, req.body.password)
    const token = await emp.generateAuthToken()

    console.log(`${emp.role} ${emp.name} has now logged in the system`)
    res.status(200).send({ emp, token })

  } catch (e) {
    res.status(400).send(e)
    console.log(e)
  }
})

router.post('/emp/logout', auth, async (req, res) => {
  try {
    req.employee.tokens = req.employee.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.employee.save()
    res.status(200).send({ message: "Logout successfull" });
  } catch (e) {
    console.error('Error during logout', e)
    res.status(500).send(e)
  }
})

router.post('/token/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ error: "No token provided. " })
    }

    jwt.verify(token, 'amergingtech5757', (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {

          return res.status(401).send("Token expired")
        }
        return res.status(401).send({ error: "Invalid token" });
      }
      res.status(200).send({ message: "Token is valid", decoded });
    });

  } catch (err) {
    res.status(500).send({ error: 'Internal server error.' });
  }
})
router.patch('/emp/:eID', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'password', 'address', 'address.city'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  console.log(updates)
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' })
  }
  try {
    const eID = req.params.eID;
    const emp = await employees.findById({ eID });
    // Find the employee by 'eID'
    if (!emp) {
      return res.status(404).send({ error: 'Employee not found' });
    }
    updates.forEach((update) => emp[update] = req.body[update])
    console.log(updates)
    await emp.save()
    res.send(emp)
  } catch (e) {
    res.status(400).send(e)
  }
})
const updateEmpCounter = async (action) => {
  try {
    const empCount = await counters.find({ counterField: 'empCounter' })

    if (empCount.length === 0) {
      // If empCount is empty, create a new counter document
      const rowData = {
        counterField: 'empCounter',
        counter: 0
      };
      const newCounter = new counters(rowData);
      const dat = await newCounter.save();
      return { counter: dat.counter };
    } else {
      // If empCount is not empty, increment the counter and update the document
      if (action === "read") {
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
module.exports = router