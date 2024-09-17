const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

//Middleware
app.use(cors());
app.use(bodyParser.json());

//example route
app.get('/api/data',(req,res) =>{
    res.json({ message: 'Hello from the backend!' });
});

app.listenerCount(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
}
);

//Dummy user data (should be from database)
const users = [
    {
        id: 1,
        username: 'user1',
        password: bcrypt.hashSync('password123', 8) // hashing the password
    }
];

//login route
app.post('/api/login', (req,res) => {
    const {username,password} = req.body;
    console.log(`Received login attempt: Username - ${username}, password - ${password}`);

    //find the user by username
    const user = users.find(u => u.username === username);

    if (!user){
        return res.status(404).json({message: 'user not found'});
    }

    //check if password is correct
    const isPasswordValid = bcrypt.compareSync(password,user.password);

    if(!isPasswordValid){
        return res.status(401).json({message: 'Invalid password'});
    }

    //Generate a JWT token
    const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
});

//Middleware to verify token for protected route
const verifyToken = (req,res, next) => {
    const token = req.headers['authorization'];

    if(!token){
        return res.status(403).json({message: 'No token provided'});
    }

    jwt.verify(token, 'your_secret_key', (err, decoded) =>{
        if (err){
            return res.status(500).json({message: 'Failed to authenticate token'});
        }

        req.userId = decoded.id;
        next();
    });
};

//protected route (only accessible with a vlaid token)
app.get('/api/protected', verifyToken, (req,res) =>{
    res.json({messaage: 'This is protected data'});
});

//Start the server

app.listen(3000, ()=>{
    console.log(`Server is running on http:localhost:${PORT}`);
});