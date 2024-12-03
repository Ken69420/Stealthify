const mongoose = require("mongoose");

const encryptedEmployeeSchema = new mongoose.Schema({
  employeeId: String,
  gender: Number,
  maritalStatus: Number,
  email: String,
  phoneNo: String,
  department: String,
  jobRole: String,
  educationField: String,
  distanceFromHome: Number,
  attrition: Number,
  environmentSatisfactory: Number,
  jobSatisfaction: Number,
  performanceRating: Number,
  numberOfCompaniesWorked: Number,
  totalWorkingYears: Number,
  trainingTimesLastYear: Number,
  yearsAtCompany: Number,
  yearsInCurrentRole: Number,
  yearsSinceLastPromotion: Number,
  yearsWithCurrentManager: Number,
});

const EncryptedEmployee = mongoose.model(
  "EncryptedEmployee",
  encryptedEmployeeSchema
);

module.exports = EncryptedEmployee;
