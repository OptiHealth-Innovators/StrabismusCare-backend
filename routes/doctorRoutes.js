import express from 'express';
import { 
  getAllDoctors, 
  getDoctorById, 
  addDoctor, 
  updateDoctor, 
  deleteDoctor,
  searchDoctors,
  getDoctorInfoById
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

// Additional route for getting doctors by specialization
router.get('/doctor/:id', getDoctorInfoById);

export default router;
