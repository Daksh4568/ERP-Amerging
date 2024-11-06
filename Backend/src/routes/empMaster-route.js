/**
 * Express application setup and employee retrieval route
 */
const express = require('express');// Import the Express library
const mongoose = require('mongoose');// Import the Mongoose library for MongoDB interactions
const bcrypt = require('bcryptjs');// Import the bcryptjs library for hashing passwords
const router = new express.Router();// Create a new Express router instance
const employee = require('../models/empMaster-model');// Import the Employees model from the empMaster-model file
const auth = require('../middleware/auth')


//custom schema
const counters = require ('../models/counterMaster')

/**
 * @route   GET /emp
 * @desc    Retrieve all employee records
 * @access  Public
 * @returns {Array} Array of employee objects
 */
router.get('/getemp',async (req,res)=>{
    try {        
       const employees = await employee.find({});
       res.send(employees)
    } catch (e) {
        res.status(500).send(e)
    }
})
// Route to get total regular employees and total male and female employees
router.get('/emp/stats', async (req, res) => {
    try {
      const totalRegularEmployees = await employee.countDocuments({ stat: 'Regular' });
      const totalMaleEmployees = await employee.countDocuments({stat: 'Regular', gender: 'Male' });
      const totalFemaleEmployees = await employee.countDocuments({stat: 'Regular', gender: 'Female' });
  
      res.send({
        totalRegularEmployees,
        totalMaleEmployees,
        totalFemaleEmployees
      });
    } catch (e) {
      res.status(400).send('db error');
    }
  });

router.post('/regemp', auth , async (req,res)=> {
   const emp = new employee(req.body);
   try {
        const lastEmpCount=await updateEmpCounter("read");//read 1 write 0
        emp.eID ='AT-' + String(lastEmpCount.counter+1).padStart(3, '0');
        emp.stat="Regular";
        if(emp.moduleAccess===null || emp.moduleAccess==='undefined')
             emp.moduleAccess=1;
        await emp.save();                
        const token = await emp.generateAuthToken()
        await updateEmpCounter("write");//read 1 write 0
        res.status(201).send({emp,token});
        console.log("Employee added in the database")
   } catch (e) {
        console.log(e);
        res.status(400).send(e);
   }
})
router.post('/emp/login' ,async (req,res)=> {
    try {
       const emp = await employee.findByCredentials(req.body.officialEmail,req.body.password)
       const token = await emp.generateAuthToken()
       res.send({emp,token})
    } catch (e) { 
        res.status(400).send(e)
    }
 }) 

 router.post('/emp/logout',async(req,res)=>{
    try{
        req.employee.tokens = req.employee.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.employee.save()
        res.send()
        console.log("")
    }catch(e){
        res.status(500).send(e)
    }
 })
 router.post('/emp/authorization',async(req,res)=>{
  try{
      req.employee.tokens = req.employee.tokens.filter((token)=>{
          return token.token !== req.token
      })
      await req.employee.save()
      res.send()
      console.log("Authorization executed")
  }catch(e){
      res.status(500).send(e)
  }
})
 
router.patch('/emp/:id',auth ,  async (req,res)=>{
    const updates =Object.keys(req.body)
    const allowedUpdates =['name', 'password' ,'address','address.city'];
    const isValidOperation =updates.every((update)=>allowedUpdates.includes(update))
    console.log(updates)
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }
    try {
        const _id= req.params.id;
        const emp = await employees.findById({_id});
        
        updates.forEach((update)=>emp[update] =req.body[update])
        console.log(updates)
        await emp.save()
        res.send(emp)
    } catch (e) {   
        res.status(400).send(e)
    }
})
const updateEmpCounter = async (action) => {
    try {
      // Find the counter document for empCounter
      const empCount = await counters.find({counterField : 'empCounter'})
      
      if (empCount.length === 0) {
        // If empCount is empty, create a new counter document
        const rowData = {
          counterField: 'empCounter',
          counter: 1
        };        
        const newCounter = new counters(rowData);
        const dat = await newCounter.save();
        return { counter: dat.counter };
      } else {
        // If empCount is not empty, increment the counter and update the document
        if(action==="read")
        {
            return { counter: empCount[0].counter };
        }else{
            empCount[0].counter += 1;
            const updatedCounter = await empCount[0].save();
            return { counter: updatedCounter.counter };    
        }
      }
    } catch (e) {
      throw new Error('db error');
    }
  };

module.exports=router