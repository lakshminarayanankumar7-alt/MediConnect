import express from 'express';
import {
  createRecord,
  getMyRecords,
  getRecordByAppointment,
} from '../controllers/medicalRecordController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('doctor'), createRecord);
router.get('/my', protect, authorize('patient'), getMyRecords);
router.get('/appointment/:id', protect, getRecordByAppointment);

export default router;
