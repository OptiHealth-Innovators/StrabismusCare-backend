import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./config/config.js";
import { connectDB } from "./config/db.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
// Import controllers directly
import { register, login, getUserById, updateUser } from "./controllers/authController.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

// Connect to MongoDB
connectDB()
  .then(() => {
    // Direct routes for auth
    app.post("/register", register);
    app.post("/login", login);
    app.get("/user/:id", getUserById);
    app.put("/user/:id", updateUser);

    // Routes with prefixes
    app.use("/auth", authRoutes);
    app.use("/patients", patientRoutes);
    app.use("/doctors", doctorRoutes);
    app.use("/reports", reportRoutes);

    // Root route
    app.get("/", (req, res) => {
      res.json({ message: "Welcome to Strabismus Care API" });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error("Error:", err.stack);
      res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error:
          process.env.NODE_ENV === "development" ? err.message : "Server error",
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ success: false, message: "Endpoint not found" });
    });

    // Start the server
    app.listen(config.port, "0.0.0.0", () => {
      console.log(`App is running on port ${config.port}`);
      console.log(`API available at ${config.port}`);
      console.log(`Production URL: https://strabismuscare.onrender.com/`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
