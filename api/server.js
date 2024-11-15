const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./models/employees');

const app = express();
const PORT = 3000;

//MongoDB Atlas URL
const mongoURL = 'mongodb+srv://admin1:ilovemongodb@cluster0.ko3qg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

//Middleware
app.use(cors());
app.use(bodyParser.json());

//example route
app.get('/api/data',(req,res) =>{
    res.json({ message: 'Hello from the backend!' });
});

//Connect to MongoDB
mongoose.connect(mongoURL, {serverSelectionTimeoutMS: 30000})
.then (()=> console.log('MongoDB connected'))
.catch(err => {
    console.error('MongoDB connection error:', err.message)
    console.error('Full Error stack:', err);
});
app.use(express.json());

//Mount the routes
app.use('/api/auth',authRoutes)
app.use('/api', employeeRoutes); // saving Employee information route
console.log('Employee routes mounted')

//Start the server
app.listen(3000, ()=>{
    console.log(`Server is running on http:localhost:${PORT}`);
});