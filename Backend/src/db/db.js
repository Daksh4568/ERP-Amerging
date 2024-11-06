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


const connectionURL = 'mongodb+srv://raam1krishna123:G4MOkBneFVlqEw7z@erpcluster.9beil.mongodb.net/?retryWrites=true&w=majority&appName=ERPCluster'; 

// This is how we can use mongoose to create a model for our erp software
const connectToMongoDB = async ()=>{
   try {
       const connectionDB = await mongoose.connect(connectionURL);
        console.log(`MongoDB connected: ${connectionDB.connection.host}`)
       //console.log("connected to database ")
   
    } catch (error) {
   //   console.log(error)
      
    }
}
connectToMongoDB()
