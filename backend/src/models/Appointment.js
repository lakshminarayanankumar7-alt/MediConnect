import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    appointmentDate: {
      type: String,
      required: [true, 'Please provide appointment date (YYYY-MM-DD)'],
    },
    appointmentTime: {
      type: String,
      required: [true, 'Please provide appointment time slot'],
    },
    reason: {
      type: String,
      default: 'General Consultation',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'paid', // Demo simulation
    },
  },
  {
    timestamps: true,
  }
);

// Database-level constraint to prevent double-booking active slots concurrently
appointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, appointmentTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } },
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
