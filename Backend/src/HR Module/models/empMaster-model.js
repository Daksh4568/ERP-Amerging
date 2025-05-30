const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const util = require('util');
const { decrypt } = require('../../Utilities/decrypt'); // adjust path as needed

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
      enum: ['Male', 'Female', 'Transgender'],
      required: true,
    },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Divorced'],
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
      unique: true,
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
    unitName: {
      type: String,
      enum: ["Plotno176", "Plotno12", "Banur"]
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
      default: 'Employee',
    },
    stat: {
      type: String,
      enum: ['Regular', 'Relieved', 'Resigned', "Part-time", "terminated", "on-notice"],
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
    },
    empBankDetails: {
      bankName: String,
      bankAccountNumber: String,
      branchCode: String,
      nameAsPerBank: String,
      IFSC: String,
    },
    pfEligible: {
      type: Boolean,
      default: false,
    },
    pfNumber: {
      type: String,
      // validate: {
      //   validator: function (v) {
      //     return /^[A-Z]{2}\/[A-Z]{3}\/\d{7}\/\d{3}\/\d{7}$/.test(v);
      //   },
      //   message: props => `${props.value} is not a valid PF Number format!`
      // }
    },
    pfExistingMember: {
      type: Boolean,
      default: false,
    },
    uan: {
      type: String,
      // validate: {
      //   validator: function (v) {
      //     return /^[a-zA-Z0-9]{8,20}$/.test(v);  // or /^\d{12}$/ for strictly numeric
      //   },
      //   message: props => `${props.value} is not a valid UAN format!`
      // }
    },
    esiEligible: {
      type: Boolean,
      default: false,
    },
    esiNumber: {
      type: String,
    },
    profilePic: {
      type: String,
      default: 'default-profile-pic.png', // Default profile picture
    },
    moduleAccess: {
      type: Number,
    },
    docLinks: {
      type: String,
    },
    reportingManager: {
      type: String,
    },
    reportingManagerEmail: {
      type: String,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: (props) => `${props.value} is not a valid email!`,
      }
    },
    leaveBalance: {
      earnedLeave: {
        type: Number,
        default: 0,
        min: 0
      },
      sickLeave: {
        type: Number,
        default: 0,
        min: 0
      },
      casualLeave: {
        type: Number,
        default: 0,
        min: 0
      }
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
  const token = jwt.sign({ eID: emp.eID }, process.env.JWT_SECRET, { expiresIn: '30d' });

  const decoded = jwt.decode(token);
  // console.log('Expiration time seconds', decoded.exp)
  // console.log('Current time', Math.floor(Date.now() / 1000));
  emp.tokens = emp.tokens.concat({ token });
  await emp.save();
  return token;

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
// employeeSchema.statics.findByCredentials = async (officialEmail, password) => {
//   //+password is added explicitly because we have select-false in the mongoose schema and have to add it 
//   const emp = await Employee.findOne({ officialEmail }).select('+password');
//   if (!emp) {
//     throw new Error('Unable to login . Employee Not found');
//   }
//   if (!emp.password) {
//     throw new Error('Unable to login: Password is not set');
//   }


//   const compare = util.promisify(bcrypt.compare);
//   const isMatch = await compare(password, emp.password);

//   if (!isMatch) {
//     throw new Error('Unable to login the employee');
//   }
//   return emp;
// };
// employeeSchema.statics.findByCredentials = async (officialEmail, inputPassword) => {
//   const emp = await Employee.findOne({ officialEmail }).select('+password');
//   if (!emp) {
//     throw new Error('Unable to login. Employee not found');
//   }

//   if (!emp.password) {
//     throw new Error('Unable to login: Password is not set');
//   }

//   let decryptedPassword;
//   try {
//     decryptedPassword = decrypt(emp.password); // Attempt to decrypt the password
//   } catch (err) {
//     console.error("Decryption error:", err);
//     throw new Error('Unable to login: Password decryption failed');
//   }

//   if (decryptedPassword !== inputPassword) {
//     throw new Error('Unable to login: Incorrect password');
//   }

//   return emp;
// };
employeeSchema.statics.findByCredentials = async (officialEmail, password) => {
  const emp = await Employee.findOne({ officialEmail }).select('+password');
  if (!emp) {
    throw new Error('Unable to login: Employee not found');
  }

  if (!emp.password) {
    throw new Error('Unable to login: Password is not set');
  }

  let isMatch = false;

  // Try to decrypt (new method)
  try {
    const decryptedPassword = decrypt(emp.password);
    isMatch = decryptedPassword === password;
  } catch (err) {
    // Decryption failed — maybe it’s an old bcrypt-hashed password
    try {
      const compare = util.promisify(bcrypt.compare);
      isMatch = await compare(password, emp.password);
    } catch (err2) {
      // bcrypt.compare also failed
      throw new Error('Unable to login: Password check failed');
    }
  }

  if (!isMatch) {
    throw new Error('Unable to login: Incorrect password');
  }

  return emp;
};

//Hash the plain text password before saving
// employeeSchema.pre('save', async function (next) {
//   const emp = this;
//   if (emp.isModified('password')) {
//     //console.log("Hashing password:", emp.password);
//     const hash = util.promisify(bcrypt.hash);
//     emp.password = await hash(emp.password, 8);
//   }
//   next(); // Call next to proceed
// });

// Create and export the model
const Employee = mongoose.model('employeeMaster', employeeSchema);

module.exports = Employee;