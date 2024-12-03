const mongoose = require("mongoose");

// Define a schema for anonymized employees
const anonymizedEmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: false },
  gender: { type: String, required: false },
  maritalStatus: { type: String, required: false },
  department: { type: String, required: false },
  email: { type: String, required: false },
  phoneNo: { type: String, required: false },
  jobRole: { type: String, required: false },
  educationField: { type: String, required: false },
  distanceFromHome: { type: Number, required: false },
  attrition: { type: String, required: false },
  environmentSatisfactory: { type: Number, required: false },
  jobSatisfaction: { type: Number, required: false },
  performanceRating: { type: Number, required: false },
  numberOfCompaniesWorked: { type: String, required: false }, // Generalized values are often strings
  totalWorkingYears: { type: String, required: false },
  trainingTimesLastYear: { type: String, required: false },
  yearsAtCompany: { type: String, required: false },
  yearsInCurrentRole: { type: String, required: false },
  yearsSinceLastPromotion: { type: String, required: false },
  yearsWithCurrentManager: { type: String, required: false },
  isAnonymized: { type: Boolean, default: true }, // Always true for this collection
});

// Create a model from the schema
const AnonymizedEmployee = mongoose.model(
  "AnonymizedEmployee",
  anonymizedEmployeeSchema
);

module.exports = AnonymizedEmployee;
