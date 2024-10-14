const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');

const jwtSecret = 'your_jwt_secret';

//Register a new user (POST /register)
router.post('/register', async(req,res) =>{
    const {username, password, email} = req.body;
    try {
        //check if user already exists
        let user = await User.findOne({username});
        if (user){
            return res.status(400).json({message: 'User already exists'});
        }

        //create new User
        user = new User ({username,password,email});
        await user.save();
        console.log(`New user registered: ${username}`);

        //Create and return a token
        const token = jwt.sign({id: user._id}, 'jwtSecretKey', {expiresIn: '1h'});
        res.status(201).json({message: 'User registered', token});
    } catch(err){
        console.error('Error during registration',err.message);
        console.error('Full error stack:', err);
        res.status(500).json({message: 'Server error during registration'});
    }
});

//nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'dnielmranazam@gmail.com',
        pass: 'yjli kvvg aywz jarf'
    }
})

//Login an existing User
router.post('/login', async(req, res) =>{
    const {username, password} = req.body;
    try{
        //find user by username
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message: 'Invalid username or password'});
        }

        //check if password matched
        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid password or username'});
        }

        //Generate OTP using speakeasy
        const otpSecret = speakeasy.generateSecret().base32;
        const otp = speakeasy.totp({
            secret: otpSecret,
            encoding: 'base32'
        });
        console.log(`Generated OTP for ${username}: ${otp}`);
        console.log(`Generated OTPSecret for ${username}: ${otpSecret}`);


        //Save OTP secret and expiration time to the user
        user.otpSecret = otpSecret;
        user.otpExpireAt = new Date(Date.now() + 10 * 60 *1000);
        await user.save();
        console.log(`OTP saved for ${username}`);

        //send OTP to user's email
        const mailOptions = {
            from: 'dnielmranazam@gmail.com ',
            to: user.email,
            subject: 'Your Stealthify OTP code ',
            text: `Your OTP code is: ${otp}`
        };

        transporter.sendMail(mailOptions, (err,info) => {
            if (err) {
                console.error('Error sending OTP mail', err.message);
                return res.status(500).send('Error sending OTP email');
            }
            console.log(`OTP email sent to ${user.email}: ${info.response}`);
            res.status(200).json({message: 'OTP sent to your email. Please verify.'});
        });

    }catch (err){
        console.error("Error in login/OTP verfication",err);
        console.error('Full error stack:', err);
        res.status(500).json({message: 'Server error'});
    }
});

//verifying OTP route
router.post('/verify-otp', async (req,res) => {
    const {username,otp} = req.body;

    try{
        //find user by username
        const user = await User.findOne({username});
        if(!user){
            console.log(`OTP verifcication failed: user ${username} not found`);
            return res.status(400).json({message: 'Invalid username'});
        }

        //Check if OTP is expired
        if (Date.now() > user.otpExpireAt){
            console.log(`OTP expired for user: ${username}`);
            return res.status(400).json({message: 'OTP has expired'});
        }

        //verify the OTP using speakeasy
        const isValid  = speakeasy.totp.verify({
            secret: user.otpSecret,
            encoding: 'base32',
            token: otp,
            window: 1   //window for time drift
        });

        if(isValid){
            //Clear OTP after successful verification
            console.log(`OTP verified successfully for ${username}`);
            user.otpSecret = null;
            user.otpExpireAt = null;
            await user.save();

            //create and return JWT token
            const token = jwt.sign({id: user._id}, 'jwtSecretKey', {expiresIn: '1h'});
            res.status(200).json({message: 'OTP verified and logged in successfully',  token});
        } else {
            console.log(`Invalid OTP for user: ${username}`);
            res.status(400).json({message: 'Invalid OTP'});
        }
        
    }catch (err){
        console.error('Error during OTP verification:',err.message);
        console.error('Full error stack',err);
        res.status(500).json({message: 'Server error during OTP verification'});
    }
});

module.exports = router;