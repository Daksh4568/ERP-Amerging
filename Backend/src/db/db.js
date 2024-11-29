// const mongoose = require('mongoose');

// mongoURI ='mongodb://localhost:27017/erpdb-test'
// async function connectToMongoDB() {
//     try {
//       await mongoose.connect(mongoURI);
//       console.log('Successfully connected to MongoDB');
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//       }
//     }
// connectToMongoDB()
// Command to start the server locally mongod --dbpath C:\data\db

const mongoose = require('mongoose')


const connectionURL = 'mongodb+srv://dakshthakurdev:REiZX78kSdjZkF7H@erpcluster.9yztv.mongodb.net/';

// This is how we can use mongoose to create a model for our erp software
const connectToMongoDB = async ()=>{
   try {
       const connectionDB = await mongoose.connect(connectionURL);
        console.log(`MongoDB connected: ${connectionDB.connection.host}`)
   
    } catch (error) {
      console.log(error)
    }
}
connectToMongoDB()
