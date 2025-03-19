import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const db = getDB();
    const patientsCollection = db.collection("patients");
    const patients = await patientsCollection.find({}).toArray();
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ success: false, message: "Failed to fetch patients", error: error.message });
  }
};

// Get patient by ID
export const getPatientById = async (req, res) => {
  try {
    const db = getDB();
    const patientsCollection = db.collection("patients");
    const patient = await patientsCollection.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ success: false, message: "Failed to fetch patient", error: error.message });
  }
};

// Add a new patient
export const addPatient = async (req, res) => {
  try {
    const db = getDB();
    const patientsCollection = db.collection("patients");
    const newPatient = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await patientsCollection.insertOne(newPatient);
    
    if (result.insertedId) {
      res.status(201).json({ success: true, message: "Patient added successfully", patientId: result.insertedId });
    } else {
      res.status(500).json({ success: false, message: "Failed to add patient" });
    }
  } catch (error) {
    console.error("Error adding patient:", error);
    res.status(500).json({ success: false, message: "Failed to add patient", error: error.message });
  }
};

// Update a patient
export const updatePatient = async (req, res) => {
  try {
    const db = getDB();
    const patientsCollection = db.collection("patients");
    const patientId = req.params.id;
    
    const updatedPatient = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const result = await patientsCollection.updateOne(
      { _id: new ObjectId(patientId) },
      { $set: updatedPatient }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    
    res.status(200).json({ success: true, message: "Patient updated successfully" });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ success: false, message: "Failed to update patient", error: error.message });
  }
};

// Delete a patient
export const deletePatient = async (req, res) => {
  try {
    const db = getDB();
    const patientsCollection = db.collection("patients");
    const patientId = req.params.id;
    
    const result = await patientsCollection.deleteOne({ _id: new ObjectId(patientId) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    
    res.status(200).json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ success: false, message: "Failed to delete patient", error: error.message });
  }
};

// Get doctor info by ID
export const getPatientInfoById = async (req, res) => {
  try {
    const db = getDB();
    const patientsCollection = db.collection("patients");
    const patient = await patientsCollection.findOne({
      userId: new ObjectId(req.params.id),
    });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    console.error("Error fetching patient info:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch patient info",
        error: error.message,
      });
  }
};