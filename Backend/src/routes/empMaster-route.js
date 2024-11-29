/**
 * Express application setup and employee retrieval route
 */
const express = require('express');// Import the Express library
//const mongoose = require('mongoose');// Import the Mongoose library for MongoDB interactions
//const bcrypt = require('bcryptjs');// Import the bcryptjs library for hashing passwords
const router = new express.Router();// Create a new Express router instance
const employee = require('../models/empMaster-model');// Import the Employees model from the empMaster-model file
const { auth, authorize } = require('../middleware/auth')
const employeeEvaluationController = require('../Controllers/empEvaluation')
const exitEmployeeController = require('../Controllers/EmpExit');
const regEmployee = require('../models/empMaster-model');

//custom schema
const counters = require('../models/counterMaster');

// All the get requests are defined here
router.get('/getemp', async (req, res) => {
  try {
    const employees = await employee.find({});
    res.send(employees)
  } catch (e) {
    res.status(500).send(e)
  }
})
router.get('/emp/evaluationdata', async (req, res) => {
  try {
    const empevaluationData = await EmployeeEvaluation.find({});// It will retrieve all the data
    res.status(200).send(empevaluationData);
  } catch (e) {
    console.error("Error retrieving evaluation data:", e);
    res.status(500).send({ error: "Error while fetching the data" });
  }
});
// Route to get total regular employees and total male and female employees
router.get('/emp/stats', async (req, res) => {
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

// all the post requests are here 
router.post('/exit-form', auth, authorize('HR', 'admin', 'Manager', 'Employee'), exitEmployeeController.createExitForm);

router.post('/employee-evaluation', auth, authorize('HR', 'Employee'), employeeEvaluationController.createEmployeeEvaluation)
router.post('/regemp', auth, async (req, res) => {
  const emp = new regEmployee({
    ...req.body,
    addedBy: {
      name: req.employee.name, // Authenticated user's name
      role: req.employee.role, // Authenticated user's role
    },
  });

  try {
    const lastEmpCount = await updateEmpCounter('read'); // Read counter
    emp.eID = 'AT-' + String(lastEmpCount.counter + 1).padStart(3, '0'); // Generate new eID
    emp.stat = 'Regular'; // Default status
    if (!emp.moduleAccess) emp.moduleAccess = 1; // Default module access
    await emp.save();
    const token = await emp.generateAuthToken(); // Generate token for new employee
    await updateEmpCounter('write'); // Increment counter
    res.status(201).send({ emp, token });
    console.log('Employee added to the database');
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

module.exports = router;

router.post('/emp/login', async (req, res) => {
  try {
    const emp = await employee.findByCredentials(req.body.officialEmail, req.body.password)
    const token = await emp.generateAuthToken()
    res.status(200).send({ token })
  } catch (e) {
    res.status(400).send(e)

  }
})

router.post('/emp/logout', async (req, res) => {
  try {
    req.employee.tokens = req.employee.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.employee.save()

  } catch (e) {
    res.status(500).send(e)
  }
})
router.post('/emp/evaluation', async (req, res) => {
  try {
    const evaluationData = new EmployeeEvaluation(req.body); //It will populate from the request body
    await evaluationData.save();
    res.status(201).send(evaluationData); // Send the saved data as response
    console.log(evaluationData)
  } catch (e) {
    console.error("Error saving the evaluation data:", e);
    res.status(400).send(e)
  }
})


router.patch('/emp/:eID', async (req, res) => {
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