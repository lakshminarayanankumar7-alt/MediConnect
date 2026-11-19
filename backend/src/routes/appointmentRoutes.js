import express from 'express';
import {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/my', protect, authorize('patient'), getMyAppointments);
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.get('/', protect, authorize('admin'), getAllAppointments);
router.patch('/:id/status', protect, authorize('doctor', 'admin'), updateAppointmentStatus);
router.patch('/:id/cancel', protect, cancelAppointment);

export default router;
