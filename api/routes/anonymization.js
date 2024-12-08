const express = require("express");
const router = express.Router();
const { Employee } = require("../models/employees");
const AnonymizedEmployee = require("../models/anonymizedEmployee");
const decryptedEmployee = require("../models/decryptedEmployee");
const encryptedEmployee = require("../models/encryptedEmployee");
const axios = require("axios");

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

    //Fetch all employees
    const encryptedEmployeesList = await encryptedEmployee.find({});

    // Decrypt each employee
    const decryptedEmployees = [];
    for (const encryptedEmployee of encryptedEmployeesList) {
      const response = await axios.post(
        "http://localhost:3000/api/decryption/decrypt",
        { employeeId: encryptedEmployee.employeeId }
      );
      decryptedEmployees.push(response.data.data);
    }

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
    await AnonymizedEmployee.insertMany(anonymizedEmployees);

    //delete decrypted data
    await decryptedEmployee.deleteMany({});
    console.log("Decrypted data deleted successfully");

    console.log("Anonymization completed successfully");
    res.status(201).send({ message: "Anonymization completed successfully." });
  } catch (error) {
    console.error("Error during anonymization:", error.message);
    res
      .status(500)
      .send({ message: "An error occurred durring anonymization.", error });
  }
});

module.exports = router;
