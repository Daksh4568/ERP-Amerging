const mongoose = require ('mongoose')
const validator =require('validator')
const bcrypt =require ('bcryptjs')
const jwt = require('jsonwebtoken')
const util = require('util');
const { token } = require('morgan');

// Define the employee schema
const employeeSchema = new mongoose.Schema({
    eID: {
      type: String,
      //required: true,
      unique: true
    },
    name: {
      type: String,
      //required: true
    },    
    DOB: {
      type: Date,
      //required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
    },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Other'],
      required: true
    },
    contact: {
        personal: {
          type: String,
        },
        alternatePhone: {
          type: String,
        }
    },
    personalEmail:{
      type: String,
      required: true,
      //unique: true,
    },
    officialEmail: {
        type: String,
     },
    password:{
      type:String,
      required: true,
      //unique: true
    },
    bloodGroup: {
      type: String,
    },
    address: {
      permanent: {
        street: String,
        city: String,
        state: String,
        postalCode: {
          type: String,
          required: true,
          validate: {
            validator: function(v) {
              return /\d{6}/.test(v); // Validate that postal code is 6 digits
            },
            message: props => `${props.value} is not a valid postal code!`
          }
        },
        country: String
      },
      current:{
        street: String,
        city: String,
        state: String,
        postalCode: { 
          type: String,
          required: true,
          validate: {
            validator: function(v) {
              return /\d{6}/.test(v); // Validate that postal code is 6 digits
            },
            message: props => `${props.value} is not a valid postal code!`
          }
        },
        country: String        
      }
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract','Consultant'],
      required: true
    },
    nominee:{
      name:{
        type : String
      },
      relation:{
        type : String
      },
      contact:{
        type: String
      },
      aadharCard:{
        type: String
      }
    },
    image: {
      type: String,      
    },
    empPan:{
      type: String
    },
    empAadhar:{
      type: String
    },
    passportNumber:{
      type: String
    },
    documents: [
      {
        documentName: {
          type: String,
        },
        documentImage: {
          type: String,
        }
      }
    ],
    stat:{ //Current Status 
      type: String,
      enum: ['Regular','Relieved','Resigned'],
      required: true
    },
    moduleAccess:{ type : Number},// The modules access on bit wise if 1 means basic module is accessable if its 3 it means 2 modules access able
    docLinks:{ type: String},// Google doc address 
    tokens: [{
      token: {
        type: String,
        required: true
      }
    }],
  }//  { timestamps: true }
  );
  employeeSchema.methods.generateAuthToken = async function(){
    const emp = this
    const token = jwt.sign({_id: emp._id.toString()},'amergingtech5757')
    
    emp.tokens = emp.tokens.concat({ token });   
   await emp.save()
    return token
  }
  employeeSchema.methods.toJSON = function (){
    
    const emp = this;
    const empObject = emp.toObject();

    delete empObject.password;
    delete empObject.tokens;
    return empObject;
  }
  employeeSchema.statics.findByCredentials = async(officialEmail, password)=>{
       const emp = await Employee.findOne({officialEmail})       
       if(!emp){
         throw new Error('Unable to login')
       }
       const compare = util.promisify(bcrypt.compare);
       const isMatch = await compare(password, emp.password);
       if(!isMatch){
        throw new Error('Unable to login')
      }
      return emp
  }

  //Hash the plain text password before save
  employeeSchema.pre('save',async function(next) {
    const emp = this ;
    if(emp.isModified('password')){
      const hash = util.promisify(bcrypt.hash);
      emp.password = await hash(emp.password,8)
    }
    next()//this must call else it will hang forever in this function
  })
  // Create and export the model
  const Employee = mongoose.model('employeeMaster', employeeSchema);
  
  module.exports = Employee;