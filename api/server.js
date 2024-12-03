const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./models/employees");
const anonymization = require("./routes/anonymization");
const encryptionRoutes = require("./routes/encryption");

const app = express();
const PORT = 3000;

//MongoDB Atlas URL
const mongoURL = "mongodb://localhost:27017/StealthifyDB";

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.on("data", (chunk) => {
    console.log("Raw request body:", chunk.toString());
  });
  next();
});

//example route
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

//Connect to MongoDB
mongoose
  .connect(mongoURL, { serverSelectionTimeoutMS: 30000 })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.error("Full Error stack:", err);
  });

//Mount the routes
app.use("/api/auth", authRoutes);
app.use("/api", employeeRoutes); // saving Employee information route
app.use("/api/anonymization", anonymization); // Anonymization route
app.use("/api/encryption", encryptionRoutes); // Encryption route

// Mock activity logs endpoint
app.get("/api/activity-logs", (req, res) => {
  const logs = [
    {
      timestamp: "2023-10-01 10:00:00",
      activity: "Login",
      user: "Dash Abdul Somad",
      severity: "Low",
    },
    {
      timestamp: "2023-10-01 10:05:00",
      activity: "File Upload",
      user: "Dane Dalilah",
      severity: "Medium",
    },
    {
      timestamp: "2023-10-01 10:10:00",
      activity: "Error",
      user: "Khawarizmi",
      severity: "High",
    },
  ];
  res.json(logs);
});

//Start the server
app.listen(3000, () => {
  console.log(`Server is running on http:localhost:${PORT}`);
});
