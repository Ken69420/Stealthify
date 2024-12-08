const mongoose = require("mongoose");

const decryptedEmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  gender: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: String, required: true },
  department: { type: String, required: true },
  jobRole: { type: String, required: true },
  educationField: { type: String, required: true },
  distanceFromHome: { type: Number, required: true },
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

const DecryptedEmployee = mongoose.model(
  "DecryptedEmployee",
  decryptedEmployeeSchema
);

module.exports = DecryptedEmployee;
