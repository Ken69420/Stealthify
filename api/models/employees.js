const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Define a schema for employees
const router = express.Router();

// Define a schema for employees
const employeeSchema = new mongoose.Schema({
    employeeId: {type: String, required: true},
    gender: {type: String, required: true},
    maritalStatus: { type: String, required: true},
    department: {type: String, required: true},
    jobRole: {type: String, required: true},
    educationField: {type: String, required: true},
    distanceFromHome: {type: Number, required: true},
    attrition: { type: String, required: true },
    environmentSatisfactory: { type: Number, required: true },
    jobSatisfaction: { type: Number, required: true },
    performanceRating: { type: Number, required: true },
    numberOfCompaniesWorked: { type: Number, required: true },
    totalWorkingYears: { type: Number, required: true },
    trainingTimesLastYear: { type: Number, required: true },
    yearsAtCompany: { type: Number, required: true },
    yearsInCurrentRole: { type: Number, required: true },
    yearsSinceLastPromotion: { type: Number, required: true },
    yearsWithCurrentManager: { type: Number, required: true },
});

//Create a model from the Schema
const Employee = mongoose.model('Employee', employeeSchema);

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname,'../../uploads');
        fs.mkdirSync(uploadPath, {recursive: true}); // Ensure upload directory exists
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Route to handle CSV file upload
router.post('/employees/upload', upload.single('file'), (req, res) => {
    console.log('File uploaded:', req.file); // Log the uploaded file details
    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    console.log('File path:', filePath); // Log the file path

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('File does not exist:', filePath);
            return res.status(400).send({ message: 'File upload failed' });
        }
        console.log('File exists:', filePath);

        // List files in the uploads directory
        fs.readdir(path.join(__dirname, '../uploads'), (err, files) => {
            if (err) {
                console.error('Error reading uploads directory:', err.message);
                return res.status(500).send({ message: 'Error reading uploads directory' });
            }
            console.log('Files in uploads directory:', files);

            const results = [];

            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => {
                    console.log('CSV data:', data); // Log each row of the CSV file
                    results.push(data);
                })
                .on('end', async () => {
                    console.log('CSV parsing completed. Parsed data:', results); // Log the parsed data
                    try {
                        await Employee.insertMany(results);
                        fs.unlinkSync(filePath); // Remove the file after processing
                        console.log('CSV data imported successfully');
                        res.status(201).send({ message: 'CSV data imported successfully' });
                    } catch (error) {
                        console.error('Error importing CSV data:', error.message);
                        res.status(400).send({ message: 'Error importing CSV data', error });
                    }
                })
                .on('error', (error) => {
                    console.error('Error reading CSV file:', error.message);
                    res.status(400).send({ message: 'Error reading CSV file', error });
                });
        });
    });
});

router.post('/employees/save', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        console.log(`Employee data saved successfully for Employee ID: ${employee.employeeId}`);
        res.status(201).send({ message: 'Employee data saved successfully' });
    } catch (error) {
        console.error("Error saving employee data:", error.message);
        res.status(400).send({ message: 'Error saving employee data', error });
    }
});


module.exports = router;
