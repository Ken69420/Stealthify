const express = require("express");
const router = express.Router();
const { Employee } = require("../models/employees");
const AnonymizedEmployee = require("../models/anonymizedEmployee");

//Helper functions for anonymization

const pseudonymize = (value1) =>
  `UID${Math.floor(100000 + Math.random() * 900000)}`;
const generalizeValue = (value, range) => {
  const min = Math.floor(value / range) * range;
  const max = min + range - 1;
  return `${min}-${max}`;
};
const maskEmail = (email, visibleCharacters) => {
  const [localPart, domain] = email.split("@");
  return `${localPart.slice(0, visibleCharacters)}***@${domain}`;
};
const maskPhone = (phone, hiddenDigits) => {
  return `${"*".repeat(hiddenDigits)}${phone.slice(-4)}`;
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
    const employees = await Employee.find({ isAnonymized: { $ne: true } });

    //apply anonymization settings
    const anonymizedEmployees = employees.map((employee) => {
      const anonymizedData = {};

      // Pseudonymization
      if (settings.pseudonymization?.enabled) {
        anonymizedData.employeeId = pseudonymize(employee.employeeId);
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

      // Preserve non-anonymized fields if needed
      anonymizedData.gender = employee.gender;
      anonymizedData.maritalStatus = employee.maritalStatus;
      anonymizedData.department = employee.department;
      anonymizedData.jobRole = employee.jobRole;
      anonymizedData.educationField = employee.educationField;
      anonymizedData.distanceFromHome = employee.distanceFromHome;
      anonymizedData.attrition = employee.attrition;
      anonymizedData.environmentSatisfactory = employee.environmentSatisfactory;
      anonymizedData.jobSatisfaction = employee.jobSatisfaction;
      anonymizedData.performanceRating = employee.performanceRating;

      return anonymizedData;
    });

    //save anonymized data to the database under AnonymizedEmployee collection
    await AnonymizedEmployee.insertMany(anonymizedEmployees);

    res.status(201).send({ message: "Anonymization completed successfully." });
  } catch (error) {
    console.error("Error during anonymization:", error.message);
    res
      .status(500)
      .send({ message: "An error occurred durring anonymization.", error });
  }
});

module.exports = router;
