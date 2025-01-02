const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const util = require('util');

// Define the employee schema
const employeeSchema = new mongoose.Schema(
  {
    eID: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Other'],
      required: true,
    },

    personalContactNumber: {
      type: String,
    },
    alternateContactNumber: {
      type: String,
    },

    personalEmail: {
      type: String,
      // required: true,
    },
    officialEmail: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
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
            validator: function (v) {
              return /\d{6}/.test(v); // Validate that postal code is 6 digits
            },
            message: (props) => `${props.value} is not a valid postal code!`,
          },
        },
        country: String,
      },
      current: {
        street: String,
        city: String,
        state: String,
        postalCode: {
          type: String,
          required: true,
          validate: {
            validator: function (v) {
              return /\d{6}/.test(v); // Validate that postal code is 6 digits
            },
            message: (props) => `${props.value} is not a valid postal code!`,
          },
        },
        country: String,
      },
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Consultant'],
      required: true,
    },
    nominee: {
      name: {
        type: String,
      },
      relation: {
        type: String,
      },
      contact: {
        type: String,
      },
      aadharCard: {
        type: String,
      },
    },
    // image: {
    //   type: String,
    // },
    empPan: {
      type: String,
    },
    empAadhar: {
      type: String,
    },
    passportNumber: {
      type: String,
    },
    documents: [
      {
        documentName: {
          type: String,
        },
        documentImage: {
          type: String,
        },
      },
    ],
    role: {
      type: String,
      required: true,
      enum: ['admin', 'HR', 'Employee', 'Manager'],
      default: 'Employee',
    },
    stat: {
      type: String,
      enum: ['Regular', 'Relieved', 'Resigned'],
      required: true,
    },
    department: {
      type: String,
      enum: ['Design', 'Instumentaion', 'Sales', 'IT', 'HR', 'R&D'],
      required: true,
    },
    designation: {
      type: String,
    },
    moduleAccess: {
      type: Number,
    },
    docLinks: {
      type: String,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    addedBy: {
      name: {
        type: String,
        //required: true,
      },
      role: {
        type: String,
        //required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);


// Generate auth token
employeeSchema.methods.generateAuthToken = async function () {
  const emp = this;
  const token = jwt.sign({ eID: emp.eID }, 'amergingtech5757', { expiresIn: '30d' });

  const decoded = jwt.decode(token);
  // console.log('Expiration time seconds', decoded.exp)
  // console.log('Current time', Math.floor(Date.now() / 1000));
  emp.tokens = emp.tokens.concat({ token });
  await emp.save();
  //return token;
  const expiresAt = decoded.exp * 1000
  console.log(expiresAt)
  return { token, expiresAt: decoded.exp * 1000 }; // convert the expiry to milliseconds

};

// Customize the JSON response
employeeSchema.methods.toJSON = function () {
  const emp = this;
  const empObject = emp.toObject();
  delete empObject.password; // Remove password from the response
  delete empObject.tokens; // Remove tokens from the response
  return empObject;
};

// Find employee by credentials
employeeSchema.statics.findByCredentials = async (officialEmail, password) => {
  //+password is added explicitly because we have select-false in the mongoose schema and have to add it 
  const emp = await Employee.findOne({ officialEmail }).select('+password');
  if (!emp) {
    throw new Error('Unable to login . Employee Not found');
  }
  if (!emp.password) {
    throw new Error('Unable to login: Password is not set');
  }


  const compare = util.promisify(bcrypt.compare);
  const isMatch = await compare(password, emp.password);

  if (!isMatch) {
    throw new Error('Unable to login the employee');
  }
  return emp;
};

//Hash the plain text password before saving
employeeSchema.pre('save', async function (next) {
  const emp = this;
  if (emp.isModified('password')) {
    //console.log("Hashing password:", emp.password);
    const hash = util.promisify(bcrypt.hash);
    emp.password = await hash(emp.password, 8);
  }
  next(); // Call next to proceed
});

// Create and export the model
const Employee = mongoose.model('employeeMaster', employeeSchema);

module.exports = Employee;