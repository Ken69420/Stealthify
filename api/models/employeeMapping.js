const mongoose = require("mongoose");

const employeeMappingSchema = new mongoose.Schema({
  anonymizedEmployeeId: {
    type: String,
    required: true,
  },
  encryptedEmployeeId: { type: String, required: true },
});

const EmployeeMapping = mongoose.model(
  "EmployeeMapping",
  employeeMappingSchema
);

module.exports = EmployeeMapping;
