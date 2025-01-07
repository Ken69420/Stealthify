const express = require("express");
const EncryptedEmployee = require("../models/encryptedEmployee");
const DecryptedEmployee = require("../models/decryptedEmployee");

const router = express.Router();

// Define the reverse transformation functions

const reverseGeneralTransform = (value, addValue, multiplyValue) => {
  const numericValue = parseInt(value, 10);
  const originalValue = numericValue / multiplyValue - addValue;
  return originalValue;
};

const reverseSubstitution = (value, type) => {
  switch (type) {
    case "gender":
      switch (value) {
        case 1:
          return "male";
        case 2:
          return "female";
        default:
          return "unknown";
      }
    case "maritalStatus":
      switch (value) {
        case 0:
          return "single";
        case 1:
          return "married";
        case 3:
          return "divorced";
        default:
          return "unknown";
      }
  }
};

const reverseRotateEmailCharacters = (encryptedEmail) => {
  let decrypted = "";
  for (let i = 0; i < encryptedEmail.length; i++) {
    // Check if the next characters match any substituted vowel pattern
    let match = null;
    for (const [key, value] of Object.entries(REVERSE_VOWEL_MAP)) {
      const slice = encryptedEmail.slice(i, i + key.length);
      if (slice.toLowerCase() === key.toLowerCase()) {
        match = { pattern: key, replacement: value };
        break;
      }
    }

    if (match) {
      const isUpperCase = encryptedEmail[i] === encryptedEmail[i].toUpperCase();
      decrypted += isUpperCase
        ? match.replacement.toUpperCase()
        : match.replacement;
      i += match.pattern.length - 1; // Skip over the matched pattern
    } else {
      const charCode = encryptedEmail[i].charCodeAt(0);
      if (encryptedEmail[i] >= "A" && encryptedEmail[i] <= "Z") {
        decrypted += String.fromCharCode(((charCode - 65 + 13) % 26) + 65);
      } else if (encryptedEmail[i] >= "a" && encryptedEmail[i] <= "z") {
        decrypted += String.fromCharCode(((charCode - 97 + 13) % 26) + 97);
      } else {
        decrypted += encryptedEmail[i];
      }
    }
  }
  return decrypted;
};

const reverseTransformPhoneNo = (phoneNo) => {
  // Shift the characters by 3 positions to the left
  let shiftedPhoneNo = phoneNo.slice(3) + phoneNo.slice(0, 3);

  // Replace ASCII characters with numbers ('a' => 0, 'b' => 1, ..., 'j' => 9)
  return shiftedPhoneNo
    .split("")
    .map((char) => {
      if (char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 106) {
        // ASCII range for 'a' to 'j'
        return String.fromCharCode(char.charCodeAt(0) - 49); // Reverse the shift
      }
      return char;
    })
    .join("");
};

const reverseAtbashCipher = (text) => {
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

const reverseTransformAttrition = (value) => {
  const yesValues = [789, 478, 223];
  const noValues = [456, 908, 136];

  if (yesValues.includes(value)) {
    return "yes";
  } else if (noValues.includes(value)) {
    return "no";
  } else {
    return "unknown";
  }
};

router.post("/decrypt", async (req, res) => {
  console.log("Decryption endpoint reached");
  try {
    const employeeId = req.body.employeeId;

    if (!employeeId) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    // Find the encrypted employee by their ID
    const encryptedEmployee = await EncryptedEmployee.findOne({ employeeId });
    if (!encryptedEmployee) {
      return res.status(404).json({ error: "Encrypted employee not found" });
    }

    const fieldTransformation = {
      employeeId: (value) => reverseGeneralTransform(value, 231, 91).toString(),
      gender: (value) => reverseSubstitution(value, "gender"),
      maritalStatus: (value) => reverseSubstitution(value, "maritalStatus"),
      email: reverseRotateEmailCharacters,
      phoneNo: reverseTransformPhoneNo,
      department: reverseAtbashCipher,
      jobRole: reverseAtbashCipher,
      educationField: reverseAtbashCipher,
      distanceFromHome: (value) => reverseGeneralTransform(value, 3, 2),
      attrition: reverseTransformAttrition,
      environmentSatisfactory: (value) => reverseGeneralTransform(value, 5, 27),
      jobSatisfaction: (value) => reverseGeneralTransform(value, 22, 22),
      performanceRating: (value) => reverseGeneralTransform(value, 14, 75),
      numberOfCompaniesWorked: (value) =>
        reverseGeneralTransform(value, 67, 15),
      totalWorkingYears: (value) => reverseGeneralTransform(value, 13, 61),
      trainingTimesLastYear: (value) => reverseGeneralTransform(value, 16, 24),
      yearsAtCompany: (value) => reverseGeneralTransform(value, 52, 75),
      yearsInCurrentRole: (value) => reverseGeneralTransform(value, 58, 36),
      yearsSinceLastPromotion: (value) =>
        reverseGeneralTransform(value, 12, 25),
      yearsWithCurrentManager: (value) =>
        reverseGeneralTransform(value, 72, 19),
    };

    // Apply reverse transformations to the encrypted employee data
    const decryptedData = {};
    for (const [field, value] of Object.entries(encryptedEmployee.toObject())) {
      if (fieldTransformation[field]) {
        decryptedData[field] = fieldTransformation[field](value);
      }
    }

    const decryptedEmployee = new DecryptedEmployee(decryptedData);
    await decryptedEmployee.save();

    console.log("Decryption finished successfully");
    res.status(200).json({ data: decryptedEmployee });
  } catch (error) {
    console.error("Error decrypting employee data:", error.message);
    res.status(400).send({ message: "Error decrypting employee data", error });
  }
});

module.exports = router;
