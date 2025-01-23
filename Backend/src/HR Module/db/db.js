// const mongoose = require('mongoose');

// // Global variable to track connection state
// let isConnected = false; // it will track the state of the databaser connection and it will prevernt creating a new connection 
// // when the connectiom is true it will use the existing connection
// // when the connectiom is false it will establish a new connection

// const connectToDatabase = async () => {
//   if (isConnected) {
//     console.log('=> Using existing database connection');
//     return;
//   }

//   console.log('=> Creating new database connection');
//   await mongoose.connect(process.env.MONGO_URI)
//   isConnected = true;
//   console.log('Successfully connected to the database');
// };

// module.exports = connectToDatabase;
const mongoose = require('mongoose');

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log('=> Using existing database connection');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Successfully connected to the database');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

module.exports = connectToDatabase;
