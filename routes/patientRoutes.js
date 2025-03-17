import express from 'express';
import { 
  getAllPatients, 
  getPatientById, 
  addPatient, 
  updatePatient, 
  deletePatient 
} from '../controllers/patientController.js';

const router = express.Router();

// Get all patients
router.get('/', getAllPatients);

// Get patient by ID
router.get('/:id', getPatientById);

// Add a new patient
router.post('/', addPatient);

// Update a patient
router.put('/:id', updatePatient);

// Delete a patient
router.delete('/:id', deletePatient);

export default router;
