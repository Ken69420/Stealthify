const express = require("express");
const router = express.Router();
const { Employee } = require("../models/employees");
const EncryptedEmployee = require("../models/encryptedEmployee");

//Define the transformation functions

const generalTransform = (value, addValue, multiplyValue) => {
  //convert value to string
  const valueAsString = value.toString();
  //remove non-digit characters
  const digitsOnly = valueAsString.replace(/\D/g, "");
  //convert string to number
  const numericID = parseInt(digitsOnly, 10);
  //add 231 and multiply 91
  const transformedID = (numericID + addValue) * multiplyValue;
  return transformedID;
};

const substitution = (value, type) => {
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
        case "divorced":
          return 3;
        default:
          return 0;
      }
  }
};

const VOWEL_MAP = {
  a: "eW8",
  e: "iX9",
  i: "oZ0",
  o: "uY1",
  u: "aV2",
};

const REVERSE_VOWEL_MAP = Object.fromEntries(
  Object.entries(VOWEL_MAP).map(([key, value]) => [value, key])
);

const rotateEmailCharacters = (email) => {
  let encrypted = "";
  for (const char of email) {
    const charCode = char.charCodeAt(0);
    if (VOWEL_MAP[char.toLowerCase()]) {
      encrypted +=
        char === char.toLowerCase()
          ? VOWEL_MAP[char]
          : VOWEL_MAP[char.toLowerCase()].toUpperCase();
    } else if (char >= "A" && char <= "Z") {
      encrypted += String.fromCharCode(((charCode - 65 + 13) % 26) + 65);
    } else if (char >= "a" && char <= "z") {
      encrypted += String.fromCharCode(((charCode - 97 + 13) % 26) + 97);
    } else {
      encrypted += char;
    }
  }
  return encrypted;
};

const transformPhoneNo = (phoneNo) => {
  // Replace numbers with ASCII characters (0 => 'a', 1 => 'b', ..., 9 => 'j')
  let asciiPhoneNo = phoneNo
    .split("")
    .map((char) => {
      if (/\d/.test(char)) {
        return String.fromCharCode(char.charCodeAt(0) + 49); // Shift by 49 to get 'a' to 'j'
      }
      return char;
    })
    .join("");

  // Shift the characters by 3 positions to the right
  return asciiPhoneNo.slice(-3) + asciiPhoneNo.slice(0, -3);
};

const atbashCipher = (text) => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const reversedAlphabet = "zyxwvutsrqponmlkjihgfedcba";

  return text
    .split("")
    .map((char) => {
      const isUpperCase = char === char.toUpperCase();
      const lowerChar = char.toLowerCase();
      const index = alphabet.indexOf(lowerChar);

      if (index === -1) return char; // Preserve non-alphabet characters

      const transformedChar = reversedAlphabet[index];
      return isUpperCase ? transformedChar.toUpperCase() : transformedChar;
    })
    .join("");
};

const randomValue = (array) => {
  if (!Array.isArray(array) || array.length === 0) {
    throw new Error("Invalid array passed to randomValue");
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const transformAttrition = (attrition) => {
  const yesValues = [789, 478, 223];
  const noValues = [456, 908, 136];

  switch (attrition.toLowerCase()) {
    case "yes":
      return randomValue(yesValues);
    case "no":
      return randomValue(noValues);
    default:
      return 0;
  }
};

router.post("/encrypt", async (req, res) => {
  try {
    const employeeId = req.body.employeeId || "Not Provided";

    if (!employeeId) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    // Find the employee by their ID
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      throw new Error("Employee not found");
    }

    const fieldTransformation = {
      employeeId: (value) => generalTransform(value, 231, 91).toString(),
      gender: (value) => substitution(value, "gender"),
      maritalStatus: (value) => substitution(value, "maritalStatus"),
      email: rotateEmailCharacters,
      phoneNo: transformPhoneNo,
      department: atbashCipher,
      jobRole: atbashCipher,
      educationField: atbashCipher,
      distanceFromHome: (value) => generalTransform(value, 3, 2),
      attrition: transformAttrition,
      environmentSatisfactory: (value) => generalTransform(value, 5, 27),
      jobSatisfaction: (value) => generalTransform(value, 22, 22),
      performanceRating: (value) => generalTransform(value, 14, 75),
      numberOfCompaniesWorked: (value) => generalTransform(value, 67, 15),
      totalWorkingYears: (value) => generalTransform(value, 13, 61),
      trainingTimesLastYear: (value) => generalTransform(value, 16, 24),
      yearsAtCompany: (value) => generalTransform(value, 52, 75),
      yearsInCurrentRole: (value) => generalTransform(value, 58, 36),
      yearsSinceLastPromotion: (value) => generalTransform(value, 12, 25),
      yearsWithCurrentManager: (value) => generalTransform(value, 72, 19),
    };

    //apply transformations to the employee data
    const encryptedData = {};
    for (const [field, value] of Object.entries(req.body)) {
      if (fieldTransformation[field]) {
        encryptedData[field] = fieldTransformation[field](value);
      }
    }

    const encryptedEmployee = new EncryptedEmployee(encryptedData);
    await encryptedEmployee.save();

    await Employee.findOneAndDelete({ employeeId });
    res.status(201).send({
      message: "Encrypted employee data saved and original data deleted",
    });
    console.log("Encrypted employee data saved and original data deleted");
  } catch (error) {
    console.error("Error saving encrypted employee data:", error.message);
    res
      .status(400)
      .send({ message: "Error saving encrypted employee data", error });
  }
});

module.exports = router;
