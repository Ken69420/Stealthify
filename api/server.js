const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./models/employees");
const anonymization = require("./routes/anonymization");
const encryptionRoutes = require("./routes/encryption");
const decryptionRoutes = require("./routes/decryption");
const deanonymizationRoutes = require("./routes/deanonymization");
const statsRoutes = require("./models/stats");

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
app.use("/api/decryption", decryptionRoutes); // Decryption route
app.use("/api/deanonymization", deanonymizationRoutes); //Deanonymization route
app.use("/downloads", express.static(path.join(__dirname, "downloads")));
app.use("/api", statsRoutes); //Stats route

//Start the server
app.listen(3000, () => {
  console.log(`Server is running on http:localhost:${PORT}`);
});
