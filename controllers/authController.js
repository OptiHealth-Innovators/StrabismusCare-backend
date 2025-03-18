import bcrypt from "bcrypt";
import { getDB } from "../config/db.js";
import config from "../config/config.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate request body
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  const db = getDB();
  const userCollection = db.collection("users");
  const patientCollection = db.collection("patients");
  const doctorCollection = db.collection("doctors");

  try {
    // Check if the email is already registered
    const existingUser = await userCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, config.saltRounds);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await userCollection.insertOne(newUser);

    if (result.insertedId) {
      if (role === "patient") {
        const newPatient = {
          userId: result.insertedId,
          createdAt: new Date(),
        };

        await patientCollection.insertOne(newPatient);
      } else if (role === "doctor") {
        const {
          contact,
          address,
          specialty,
          tenure,
          dateOfBirth,
          education,
          description,
        } = req.body.doctorInfo;
        const newDoctor = {
          userId: result.insertedId,
          contact,
          address,
          specialty,
          tenure,
          dateOfBirth,
          education,
          description,
          createdAt: new Date(),
        };

        // await doctorCollection.insertOne(newDoctor);
        console.log(newDoctor);
      }

      res.status(201).json({
        success: true,
        message: "User created successfully",
        userId: result.insertedId.toString(),
      });
    } else {
      res.status(500).json({
        success: false,
        message: "User creation failed",
      });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "User creation failed",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate request body
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const db = getDB();
  const userCollection = db.collection("users");

  try {
    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
