// Using Node.js `require()`

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const { body, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const db = require('./HR Module/db/db')
const app = express();
const port = 5000;
const employeeMasterRounter = require('./routes/empMaster-route')
const imageToBase64 = require('image-to-base64');
require('dotenv').config();

// Security middleware
app.use(helmet());
app.use(xss());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined'));


// console.log(process.env.EMAIL_USER);
// console.log(process.env.EMAIL_PASSWORD);

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://another-domain.com'], // Allow multiple origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  exposedHeaders: ['Content-Length', 'X-Kuma-Revision'], // Expose specific headers
  credentials: true, // Allow credentials
  optionsSuccessStatus: 200 // Response status for preflight requests
};
app.use(cors(corsOptions));
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
//app.use(cors());
// Basic route to handle requests to the root URL

app.use(employeeMasterRounter);
app.get('/', (req, res) => {
  res.send('Hello , We are live ');
  console.log("The page is running live")
});
app.post('/test', async (req, res) => {
  const img = req.body.img; // Assuming the image URL is passed in the request body
  try {
    const bin = await imagetoBin(img)
    res.send({ "img2bin": bin });
  } catch (e) {
    res.status(400).send(e)
  }
});

async function imagetoBin(img) {
  try {
    const response = await imageToBase64(img); // Path to the image

    return response;
  } catch (error) {
    return error
  }
}
// Start the server
app.listen(port, () => { console.log(`Server is up on port http://localhost:${port}`); })