import MedicalRecord from '../models/MedicalRecord.js';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Notification from '../models/Notification.js';

/**
 * @route   POST /api/medical-records
 * @desc    Create a medical record & prescription after consultation (Doctor only)
 * @access  Private (Doctor)
 */
export const createRecord = async (req, res, next) => {
  try {
    const { appointmentId, diagnosis, symptoms, consultationNotes, prescription } = req.body;

    if (!appointmentId || !diagnosis) {
      return res.status(400).json({
        success: false,
        message: 'Please provide appointmentId and diagnosis.',
      });
    }

    const appointment = await Appointment.findById(appointmentId).populate('doctorId');
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Verify doctor ownership
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor || appointment.doctorId._id.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You may only create records for your own consultations.',
      });
    }

    // Create medical record
    const record = await MedicalRecord.create({
      patientId: appointment.patientId,
      doctorId: doctor._id,
      appointmentId,
      diagnosis,
      symptoms: symptoms || '',
      consultationNotes: consultationNotes || '',
      prescription: Array.isArray(prescription) ? prescription : [],
    });

    // Mark appointment as completed
    appointment.status = 'completed';
    await appointment.save();

    // Notify patient
    await Notification.create({
      userId: appointment.patientId,
      title: 'Medical Record & Prescription Available',
      message: `Dr. ${req.user.name} has added your consultation summary and prescription.`,
      type: 'completed',
    });

    res.status(201).json({
      success: true,
      message: 'Medical record and prescription created successfully.',
      record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/medical-records/my
 * @desc    Get all medical records for logged-in patient
 * @access  Private (Patient)
 */
export const getMyRecords = async (req, res, next) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.user._id })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email' },
      })
      .populate('appointmentId', 'appointmentDate appointmentTime reason')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/medical-records/appointment/:id
 * @desc    Get record for a specific appointment
 * @access  Private (Patient, Doctor, Admin)
 */
export const getRecordByAppointment = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findOne({ appointmentId: req.params.id })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email' },
      })
      .populate('patientId', 'name email phone');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'No medical record found for this appointment.',
      });
    }

    // Security check
    let authorized = false;
    if (req.user.role === 'admin') authorized = true;
    if (record.patientId._id.toString() === req.user._id.toString()) authorized = true;

    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor && record.doctorId._id.toString() === doctor._id.toString()) {
        authorized = true;
      }
    }

    if (!authorized) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to medical record.',
      });
    }

    res.status(200).json({
      success: true,
      record,
    });
  } catch (error) {
    next(error);
  }
};
