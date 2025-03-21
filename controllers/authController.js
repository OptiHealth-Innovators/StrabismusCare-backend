import bcrypt from "bcrypt";
import { getDB } from "../config/db.js";
import config from "../config/config.js";
import { ObjectId } from "mongodb";

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
      role,
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

        await doctorCollection.insertOne(newDoctor);
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

export const getUserById = async (req, res) => {
  const { id } = req.params;

  // Validate request params
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  const db = getDB();
  const userCollection = db.collection("users");

  try {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user",
      error: error.message,
    });
  }
};


export const updateUser = async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const userId = req.params.id;
    
    // Prevent updating sensitive fields like password or role through this endpoint
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, config.saltRounds);
    
    const updatedUser = {
      password: hashedPassword,
      updatedAt: new Date()
    };
    
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updatedUser }
    );

    console.log(result);
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.status(200).json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Failed to update user", error: error.message });
  }
};

