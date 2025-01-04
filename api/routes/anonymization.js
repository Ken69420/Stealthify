const express = require("express");
const router = express.Router();
const AnonymizedEmployee = require("../models/anonymizedEmployee");
const decryptedEmployee = require("../models/decryptedEmployee");
const encryptedEmployee = require("../models/encryptedEmployee");
const AnonymizationSettings = require("../models/settings");
const EmployeeMapping = require("../models/employeeMapping");
const axios = require("axios");
const mongoose = require("mongoose");

//Helper functions for anonymization

const pseudonymize = (value, prefix, randomLevel) => {
  prefix = prefix || "UID";
  randomnessLevel = randomLevel || 1;

  const ranges = {
    1: [1000, 9999], // Low randomness
    2: [10000, 99999], // Medium randomness
    3: [100000, 999999], // High randomness
  };

  const [min, max] = ranges[randomnessLevel] || ranges[1]; //Default to level 1 range
  return `${prefix}${Math.floor(min + Math.random() * (max - min + 1))}`;
};

const generalizeValue = (value, range) => {
  const min = Math.floor(value / range) * range;
  const max = min + range - 1;
  return `${min}-${max}`;
};
const maskEmail = (email, visibleCharacters) => {
  const [localPart, domain] = email.split("@");

  //If visiblecharacters is greater than the length of the local part, adjust it
  visibleCharacters = Math.max(
    0,
    Math.min(visibleCharacters, localPart.length)
  );

  //Create the masked email
  const maskedLocalPart =
    "*".repeat(localPart.length - visibleCharacters) +
    localPart.slice(localPart.length - visibleCharacters);

  return `${maskedLocalPart}@${domain}`;
};

const maskPhone = (phone, hiddenDigits) => {
  //Ensure hiddenDigits dont exceed the length of the phone number
  hiddenDigits = Math.max(0, Math.min(hiddenDigits, phone.length));

  //Mask the last hiddenDigits of the phone number
  return `${phone.slice(0, phone.length - hiddenDigits)}${"*".repeat(
    hiddenDigits
  )}`;
};

const roundDistance = (distance) => {
  return Math.round(distance / 5) * 5;
};

const labelEncoding = (value, type) => {
  switch (type) {
    case "gender":
      switch (value.toLowerCase()) {
        case "male":
          return 1;
        case "female":
          return 2;
        default:
          return 0;
      }
    case "maritalStatus":
      switch (value.toLowerCase()) {
        case "single":
          return 0;
        case "married":
          return 1;
        default:
          return 2;
      }
  }
};

//Endpoint to anonymize employee data
router.post("/anonymize", async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings) {
      return res
        .status(400)
        .send({ message: "Anonymization settings are required" });
    }

    //Generate a unique file ID
    const fileId = new mongoose.Types.ObjectId();

    //Save the settings with fileId
    await AnonymizationSettings.create({
      fileId,
      settings,
    });

    //Fetch all employees
    const encryptedEmployeesList = await encryptedEmployee.find({});

    // Decrypt each employee
    const decryptedEmployees = [];
    for (const encryptedEmp of encryptedEmployeesList) {
      const response = await axios.post(
        "http://localhost:3000/api/decryption/decrypt",
        { employeeId: encryptedEmp.employeeId }
      );

      if (!response.data?.data) {
        console.error("Decryption failed for employee:", encryptedEmp);
      } else {
        decryptedEmployees.push(response.data.data);
      }
    }

    console.log("Decrypted Employee: ", decryptedEmployees);

    //apply anonymization settings
    const anonymizedEmployees = decryptedEmployees.map((employee) => {
      const anonymizedData = {};

      // Pseudonymization
      if (settings.pseudonymization?.enabled) {
        anonymizedData.employeeId = pseudonymize(
          employee.employeeId,
          settings.pseudonymization.prefix,
          settings.pseudonymization.randomStrength
        );
      }

      // Generalization
      if (settings.generalization?.enabled) {
        const range = settings.generalization.range || 5; // Default range
        anonymizedData.numberOfCompaniesWorked = generalizeValue(
          employee.numberOfCompaniesWorked,
          range
        );
        anonymizedData.totalWorkingYears = generalizeValue(
          employee.totalWorkingYears,
          range
        );
        anonymizedData.trainingTimesLastYear = generalizeValue(
          employee.trainingTimesLastYear,
          range
        );
        anonymizedData.yearsAtCompany = generalizeValue(
          employee.yearsAtCompany,
          range
        );
        anonymizedData.yearsInCurrentRole = generalizeValue(
          employee.yearsInCurrentRole,
          range
        );
        anonymizedData.yearsSinceLastPromotion = generalizeValue(
          employee.yearsSinceLastPromotion,
          range
        );
        anonymizedData.yearsWithCurrentManager = generalizeValue(
          employee.yearsWithCurrentManager,
          range
        );
      }

      // Masking
      if (settings.masking?.enabled) {
        if (settings.masking.emailCharactersToShow) {
          anonymizedData.email = maskEmail(
            employee.email,
            settings.masking.emailCharactersToShow
          );
        }
        if (settings.masking.phoneDigitsToHide) {
          anonymizedData.phoneNo = maskPhone(
            employee.phoneNo,
            settings.masking.phoneDigitsToHide
          );
        }
      }

      //rounding
      if (settings.rounding?.enabled) {
        anonymizedData.distanceFromHome = roundDistance(
          employee.distanceFromHome
        );
      }

      if (settings.labelEncoding?.enabled) {
        if (settings.labelEncoding.gender) {
          anonymizedData.gender = labelEncoding(employee.gender, "gender");
        }
        if (settings.labelEncoding.maritalStatus) {
          anonymizedData.maritalStatus = labelEncoding(
            employee.maritalStatus,
            "maritalStatus"
          );
        }
      }

      // Preserve non-anonymized fields if needed
      anonymizedData.department = employee.department;
      anonymizedData.jobRole = employee.jobRole;
      anonymizedData.educationField = employee.educationField;
      anonymizedData.attrition = employee.attrition;
      anonymizedData.environmentSatisfactory = employee.environmentSatisfactory;
      anonymizedData.jobSatisfaction = employee.jobSatisfaction;
      anonymizedData.performanceRating = employee.performanceRating;

      return anonymizedData;
    });

    //save anonymized data to the database under AnonymizedEmployee collection
    const results = await AnonymizedEmployee.insertMany(anonymizedEmployees);

    console.log("Anonymized employees saved to the database", results);

    // Ensure the result has anonymizedEmployeeId (by checking the returned documents)
    const anonymizedEmployeeIds = results.map((doc) => doc.employeeId);

    console.log("Anonymized Employee IDs:", anonymizedEmployeeIds);

    // Create Mapping between encrypted and anonymized data
    for (let i = 0; i < anonymizedEmployeeIds.length; i++) {
      console.log(
        `Mapping: anonymizedEmployeeId: ${anonymizedEmployeeIds[i]}, encryptedEmployeeId: ${encryptedEmployeesList[i].employeeId}`
      );

      const mapping = new EmployeeMapping({
        anonymizedEmployeeId: anonymizedEmployeeIds[i], // Use the _id from the anonymized employee documents
        encryptedEmployeeId: encryptedEmployeesList[i].employeeId, // Use the _id from the encrypted employee
      });

      await mapping.save();
    }

    console.log("Mapping Saved");

    //delete decrypted data
    await decryptedEmployee.deleteMany({});
    console.log("Decrypted data deleted successfully");

    //Generate CSV from anonymized  employees
    const anonymizedDataForCSV = anonymizedEmployees.map((employee) => ({
      employeeId: employee.employeeId,
      email: employee.email,
      phoneNo: employee.phoneNo,
      department: employee.department,
      jobRole: employee.jobRole,
      educationField: employee.educationField,
      attrition: employee.attrition,
      environmentSatisfactory: employee.environmentSatisfactory,
      jobSatisfaction: employee.jobSatisfaction,
      performanceRating: employee.performanceRating,
    }));

    //Convert to JSON
    const anonymizedDataJson = JSON.stringify(anonymizedEmployees, null, 2);

    //Send JSON data as response for download
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=anonymizedData.json"
    );
    res.send(anonymizedDataJson);
  } catch (error) {
    console.error("Error during anonymization:", error.message);
    res
      .status(500)
      .send({ message: "An error occurred durring anonymization.", error });
  }
});

module.exports = router;
