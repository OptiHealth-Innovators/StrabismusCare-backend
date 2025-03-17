import express from 'express';
import { 
  getAllReports, 
  getReportById,
  getReportsByPatientId, 
  addReport, 
  updateReport, 
  deleteReport 
} from '../controllers/reportController.js';

const router = express.Router();

// Get all reports
router.get('/', getAllReports);

// Get report by ID
router.get('/:id', getReportById);

// Get reports by patient ID
router.get('/patient/:patientId', getReportsByPatientId);

// Add a new report
router.post('/', addReport);

// Update a report
router.put('/:id', updateReport);

// Delete a report
router.delete('/:id', deleteReport);

export default router;
