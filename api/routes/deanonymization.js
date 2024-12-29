const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const encryptedEmployee = require("../models/encryptedEmployee");
const decryptedEmployee = require("../models/decryptedEmployee");
const EmployeeMapping = require("../models/employeeMapping");
const axios = require("axios");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

//Route for handling deanonymization
router.post("/deanonymize", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;

  try {
    //Read and parse the uploaded JSON file
    const fileData = fs.readFileSync(filePath, "utf8");
    const anonymizedData = JSON.parse(fileData); //Parse JSON content

    //Proceed to de-anonymize the data
    const deAnonymizedData = await deAnonymizeData(anonymizedData);

    // Write de-anonymized data to a JSON file for download
    const outputFilePath = path.join(
      __dirname,
      "..",
      "downloads",
      "deanonymized_data.json"
    );
    fs.writeFileSync(outputFilePath, JSON.stringify(deAnonymizedData, null, 2));

    await decryptedEmployee.deleteMany({});
    console.log("Decrypted data deleted successfully");

    //Send the de-anonymized data in the response
    res.status(200).json({
      message: "JSON processed and de-anonymized successfully",
      succees: true,
      data: deAnonymizedData,
      downloadLink: `/downloads/deanonymized_data.json`,
    });

    //Delete  the deanonymized file after sending the response
    setTimeout(() => {
      fs.unlinkSync(outputFilePath);
      console.log("Deanonymized file is deleted");
    }, 20000);

    //Delete the uploaded file
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Error while processing JSON file: ", error);
    res.status(500).send("Error while processing the JSON file");
  }
});

//function to handle de-anonymization logic
const deAnonymizeData = async (anonymizedData) => {
  const originalData = [];

  for (let i = 0; i < anonymizedData.length; i++) {
    let anonymizedEmployeeId = anonymizedData[i].employeeId;

    // Find the mapping for the anonymizedEmployeeId
    const mapping = await EmployeeMapping.findOne({ anonymizedEmployeeId });

    if (!mapping) {
      console.error(
        "No mapping found for anonymizedEmployeeId: ",
        anonymizedEmployeeId
      );
      continue;
    }

    const encryptedEmployeeId = mapping.encryptedEmployeeId;

    // Call decryption API using the encryptedEmployeeId
    const decryptedData = await decryptEmployeeData(encryptedEmployeeId);

    //Push the de-anonymized data to the result array
    originalData.push({
      field: "employeeId",
      anonymized: anonymizedEmployeeId,
      original: decryptedData ? decryptedData.employeeId : "Not Found",
    });

    originalData.push({
      field: "gender",
      anonymized: anonymizedData[i].gender,
      original: decryptedData ? decryptedData.gender : "Not Found",
    });

    originalData.push({
      field: "maritalStatus",
      anonymized: anonymizedData[i].maritalStatus,
      original: decryptedData ? decryptedData.maritalStatus : "Not Found",
    });

    originalData.push({
      field: "department",
      anonymized: anonymizedData[i].department,
      original: decryptedData ? decryptedData.department : "Not Found",
    });

    originalData.push({
      field: "email",
      anonymized: anonymizedData[i].email,
      original: decryptedData ? decryptedData.email : "Not Found",
    });

    originalData.push({
      field: "phoneNo",
      anonymized: anonymizedData[i].phoneNo,
      original: decryptedData ? decryptedData.phoneNo : "Not Found",
    });

    originalData.push({
      field: "jobRole",
      anonymized: anonymizedData[i].jobRole,
      original: decryptedData ? decryptedData.jobRole : "Not Found",
    });

    originalData.push({
      field: "educationField",
      anonymized: anonymizedData[i].educationField,
      original: decryptedData ? decryptedData.educationField : "Not Found",
    });

    originalData.push({
      field: "distanceFromHome",
      anonymized: anonymizedData[i].distanceFromHome,
      original: decryptedData ? decryptedData.distanceFromHome : "Not Found",
    });

    originalData.push({
      field: "attrition",
      anonymized: anonymizedData[i].attrition,
      original: decryptedData ? decryptedData.attrition : "Not Found",
    });

    originalData.push({
      field: "environmentSatisfactory",
      anonymized: anonymizedData[i].environmentSatisfactory,
      original: decryptedData
        ? decryptedData.environmentSatisfactory
        : "Not Found",
    });

    originalData.push({
      field: "jobSatisfaction",
      anonymized: anonymizedData[i].jobSatisfaction,
      original: decryptedData ? decryptedData.jobSatisfaction : "Not Found",
    });

    originalData.push({
      field: "performanceRating",
      anonymized: anonymizedData[i].performanceRating,
      original: decryptedData ? decryptedData.performanceRating : "Not Found",
    });

    originalData.push({
      field: "numberOfCompaniesWorked",
      anonymized: anonymizedData[i].numberOfCompaniesWorked,
      original: decryptedData
        ? decryptedData.numberOfCompaniesWorked
        : "Not Found",
    });

    originalData.push({
      field: "totalWorkingYears",
      anonymized: anonymizedData[i].totalWorkingYears,
      original: decryptedData ? decryptedData.totalWorkingYears : "Not Found",
    });

    originalData.push({
      field: "trainingTimesLastYear",
      anonymized: anonymizedData[i].trainingTimesLastYear,
      original: decryptedData
        ? decryptedData.trainingTimesLastYear
        : "Not Found",
    });

    originalData.push({
      field: "yearsAtCompany",
      anonymized: anonymizedData[i].yearsAtCompany,
      original: decryptedData ? decryptedData.yearsAtCompany : "Not Found",
    });

    originalData.push({
      field: "yearsInCurrentRole",
      anonymized: anonymizedData[i].yearsInCurrentRole,
      original: decryptedData ? decryptedData.yearsInCurrentRole : "Not Found",
    });

    originalData.push({
      field: "yearsSinceLastPromotion",
      anonymized: anonymizedData[i].yearsSinceLastPromotion,
      original: decryptedData
        ? decryptedData.yearsSinceLastPromotion
        : "Not Found",
    });

    originalData.push({
      field: "yearsWithCurrentManager",
      anonymized: anonymizedData[i].yearsWithCurrentManager,
      original: decryptedData
        ? decryptedData.yearsWithCurrentManager
        : "Not Found",
    });
  }

  return originalData;
};

//Function to decrypt employee data
const decryptEmployeeData = async (empId) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/decryption/decrypt",
      {
        employeeId: empId,
      }
    );

    if (!response.data?.data) {
      throw new Error("Decryption failed for employeeId: ");
    }

    return response.data.data; // return decrypted data
  } catch (error) {
    console.error("Decryption error: ", error.message);
    throw error;
  }
};

router.use((req, res, next) => {
  console.log(`Request for file: ${req.originalUrl}`);
  next();
});

module.exports = router;
