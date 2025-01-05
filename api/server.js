const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./models/employees");
const anonymization = require("./routes/anonymization");
const encryptionRoutes = require("./routes/encryption");
const decryptionRoutes = require("./routes/decryption");
const deanonymizationRoutes = require("./routes/deanonymization");
const statsRoutes = require("./models/stats");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//MongoDB Atlas URL
const mongoURL = process.env.MONGO_URL;

const corsOptions = {
  origin: ["https://localhost", "http://localhost:4200"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

//Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.on("data", (chunk) => {
    console.log("Raw request body:", chunk.toString());
  });
  next();
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

// Catch-all handler to serve the Angular app for any other routes
app.get("*", (req, res) => {
  console.log(`Received request for ${req.url}`);
  res.sendFile(
    path.join(__dirname, "../stealthify/dist/stealthify/browser/index.html")
  );
});

//Start the server
app.listen(3000, () => {
  console.log(`Server is running on http:localhost:${PORT}`);
});
