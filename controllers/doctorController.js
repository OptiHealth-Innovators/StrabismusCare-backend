import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const db = getDB();
    const doctorsCollection = db.collection("doctors");
    const doctors = await doctorsCollection.find({}).toArray();
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ success: false, message: "Failed to fetch doctors", error: error.message });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const db = getDB();
    const doctorsCollection = db.collection("doctors");
    const doctor = await doctorsCollection.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ success: false, message: "Failed to fetch doctor", error: error.message });
  }
};

// Add a new doctor
export const addDoctor = async (req, res) => {
  try {
    const db = getDB();
    const doctorsCollection = db.collection("doctors");
    const newDoctor = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await doctorsCollection.insertOne(newDoctor);
    
    if (result.insertedId) {
      res.status(201).json({ success: true, message: "Doctor added successfully", doctorId: result.insertedId });
    } else {
      res.status(500).json({ success: false, message: "Failed to add doctor" });
    }
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ success: false, message: "Failed to add doctor", error: error.message });
  }
};

// Update a doctor
export const updateDoctor = async (req, res) => {
  try {
    const db = getDB();
    const doctorsCollection = db.collection("doctors");
    const doctorId = req.params.id;
    
    const updatedDoctor = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const result = await doctorsCollection.updateOne(
      { _id: new ObjectId(doctorId) },
      { $set: updatedDoctor }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    
    res.status(200).json({ success: true, message: "Doctor updated successfully" });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ success: false, message: "Failed to update doctor", error: error.message });
  }
};

// Delete a doctor
export const deleteDoctor = async (req, res) => {
  try {
    const db = getDB();
    const doctorsCollection = db.collection("doctors");
    const doctorId = req.params.id;
    
    const result = await doctorsCollection.deleteOne({ _id: new ObjectId(doctorId) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    
    res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ success: false, message: "Failed to delete doctor", error: error.message });
  }
};


// Search doctors
export const searchDoctors = async (req, res) => {
    try {
      const db = getDB();
      const doctorsCollection = db.collection("doctors");
      
      const { name, specialty } = req.query;
      const query = {};
      
      if (name) {
        query.name = { $regex: name, $options: 'i' };
      }
      
      if (specialty) {
        query.specialty = { $regex: specialty, $options: 'i' };
      }
      
      const doctors = await doctorsCollection.find(query).toArray();
      
      res.status(200).json({ success: true, data: doctors });
    } catch (error) {
      console.error("Error searching doctors:", error);
      res.status(500).json({ success: false, message: "Failed to search doctors", error: error.message });
    }
  };
