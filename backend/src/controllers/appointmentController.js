import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Notification from '../models/Notification.js';

/**
 * @route   POST /api/appointments
 * @desc    Book a new doctor appointment (Patient)
 * @access  Private (Patient)
 */
export const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctorId, appointmentDate, and appointmentTime.',
      });
    }

    // Validate date format and ensure it is not in the past
    const todayStr = new Date().toISOString().split('T')[0];
    if (appointmentDate < todayStr) {
      return res.status(400).json({
        success: false,
        message: 'Cannot schedule an appointment for a past date.',
      });
    }

    const doctor = await Doctor.findById(doctorId).populate('userId', 'name email');
    if (!doctor || !doctor.isApproved) {
      return res.status(404).json({
        success: false,
        message: 'The requested doctor is not currently available for appointments.',
      });
    }

    // Check if slot is already booked for this doctor
    const existingSlot = await Appointment.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingSlot) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already reserved. Please select another time or date.',
      });
    }

    // Check if patient already has an appointment at this exact date & time
    const patientConflict = await Appointment.findOne({
      patientId: req.user._id,
      appointmentDate,
      appointmentTime,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (patientConflict) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active appointment booked for this time slot.',
      });
    }

    // Create the appointment
    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      appointmentDate,
      appointmentTime,
      reason: reason || 'General Consultation',
      status: 'confirmed', // Auto-confirmed in modern booking
      consultationFee: doctor.consultationFee,
      paymentStatus: 'paid',
    });

    // Create notification for patient
    await Notification.create({
      userId: req.user._id,
      title: 'Appointment Booked',
      message: `Your appointment with Dr. ${doctor.userId?.name || 'Specialist'} on ${appointmentDate} at ${appointmentTime} is confirmed.`,
      type: 'booking',
    });

    // Create notification for doctor
    if (doctor.userId?._id) {
      await Notification.create({
        userId: doctor.userId._id,
        title: 'New Appointment Scheduled',
        message: `Patient ${req.user.name} booked a consultation on ${appointmentDate} at ${appointmentTime}.`,
        type: 'booking',
      });
    }

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'name email phone')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' },
      });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      appointment: populatedAppointment,
    });
  } catch (error) {
    // Catch MongoDB duplicate key error (code 11000) for concurrency safety
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Slot was just taken by another booking. Please choose another slot.',
      });
    }
    next(error);
  }
};

/**
 * @route   GET /api/appointments/my
 * @desc    Get logged-in patient's appointment list
 * @access  Private (Patient)
 */
export const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone profileImage' },
      })
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/appointments/doctor
 * @desc    Get logged-in doctor's appointment list
 * @access  Private (Doctor)
 */
export const getDoctorAppointments = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found.' });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate('patientId', 'name email phone profileImage')
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/appointments
 * @desc    Get all appointments with optional filters (Admin)
 * @access  Private (Admin)
 */
export const getAllAppointments = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (date) filter.appointmentDate = date;

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name email phone')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort({ appointmentDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/appointments/:id/status
 * @desc    Update appointment status (confirm, complete, reject)
 * @access  Private (Doctor, Admin)
 */
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate('doctorId')
      .populate('patientId', 'name email');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Role check: Doctor can only update their own appointments
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor || appointment.doctorId._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You may only modify appointments assigned to you.',
        });
      }
    }

    appointment.status = status;
    await appointment.save();

    // Notify patient of status update
    await Notification.create({
      userId: appointment.patientId._id,
      title: `Appointment ${status.toUpperCase()}`,
      message: `Your consultation on ${appointment.appointmentDate} at ${appointment.appointmentTime} is now marked as ${status}.`,
      type: status,
    });

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}.`,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/appointments/:id/cancel
 * @desc    Cancel an appointment (Patient, Doctor, or Admin)
 * @access  Private
 */
export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('doctorId');
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Check authorization: must be either patient, doctor of the appointment, or admin
    let isAuthorized = false;
    if (req.user.role === 'admin') isAuthorized = true;
    if (appointment.patientId.toString() === req.user._id.toString()) isAuthorized = true;

    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor && appointment.doctorId._id.toString() === doctor._id.toString()) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You cannot cancel this appointment.',
      });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed appointments cannot be cancelled.',
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Notify both parties
    await Notification.create({
      userId: appointment.patientId,
      title: 'Appointment Cancelled',
      message: `The consultation on ${appointment.appointmentDate} at ${appointment.appointmentTime} was cancelled.`,
      type: 'cancelled',
    });

    const doctorProfile = await Doctor.findById(appointment.doctorId);
    if (doctorProfile && doctorProfile.userId) {
      await Notification.create({
        userId: doctorProfile.userId,
        title: 'Appointment Cancelled',
        message: `An appointment on ${appointment.appointmentDate} at ${appointment.appointmentTime} has been cancelled.`,
        type: 'cancelled',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully.',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};
