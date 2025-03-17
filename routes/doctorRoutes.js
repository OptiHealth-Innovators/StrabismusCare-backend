import express from 'express';
import { 
  getAllDoctors, 
  getDoctorById, 
  addDoctor, 
  updateDoctor, 
  deleteDoctor,
  searchDoctors
} from '../controllers/doctorController.js';

const router = express.Router();

// Get all doctors
router.get('/', getAllDoctors);

// Search doctors
router.get('/search', searchDoctors);

// Get doctor by ID
router.get('/:id', getDoctorById);

// Add a new doctor
router.post('/', addDoctor);

// Update a doctor
router.put('/:id', updateDoctor);

// Delete a doctor
router.delete('/:id', deleteDoctor);

export default router;
