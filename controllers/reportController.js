import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    const db = getDB();
    const reportsCollection = db.collection("reports");
    const reports = await reportsCollection.find({}).toArray();
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reports", error: error.message });
  }
};

// Get report by ID
export const getReportById = async (req, res) => {
  try {
    const db = getDB();
    const reportsCollection = db.collection("reports");
    const report = await reportsCollection.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ success: false, message: "Failed to fetch report", error: error.message });
  }
};

// Get reports by patient ID
export const getReportsByPatientId = async (req, res) => {
  try {
    const db = getDB();
    const reportsCollection = db.collection("reports");
    const patientId = req.params.patientId;
    
    const reports = await reportsCollection.find({ patientId: patientId }).toArray();
    
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching patient reports:", error);
    res.status(500).json({ success: false, message: "Failed to fetch patient reports", error: error.message });
  }
};

// Add a new report
export const addReport = async (req, res) => {
  try {
    const db = getDB();
    const reportsCollection = db.collection("reports");
    const newReport = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await reportsCollection.insertOne(newReport);
    
    if (result.insertedId) {
      res.status(201).json({ success: true, message: "Report added successfully", reportId: result.insertedId });
    } else {
      res.status(500).json({ success: false, message: "Failed to add report" });
    }
  } catch (error) {
    console.error("Error adding report:", error);
    res.status(500).json({ success: false, message: "Failed to add report", error: error.message });
  }
};

// Update a report
export const updateReport = async (req, res) => {
  try {
    const db = getDB();
    const reportsCollection = db.collection("reports");
    const reportId = req.params.id;
    
    const updatedReport = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const result = await reportsCollection.updateOne(
      { _id: new ObjectId(reportId) },
      { $set: updatedReport }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    
    res.status(200).json({ success: true, message: "Report updated successfully" });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ success: false, message: "Failed to update report", error: error.message });
  }
};

// Delete a report
export const deleteReport = async (req, res) => {
  try {
    const db = getDB();
    const reportsCollection = db.collection("reports");
    const reportId = req.params.id;
    
    const result = await reportsCollection.deleteOne({ _id: new ObjectId(reportId) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    
    res.status(200).json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ success: false, message: "Failed to delete report", error: error.message });
  }
};
