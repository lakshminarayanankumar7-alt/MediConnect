import mongoose from 'mongoose';

const prescriptionItemSchema = new mongoose.Schema(
  {
    medicine: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      required: true,
      trim: true,
    },
    frequency: {
      type: String,
      default: 'Once daily',
      trim: true,
    },
    duration: {
      type: String,
      default: '5 days',
      trim: true,
    },
    instructions: {
      type: String,
      default: 'After meals',
      trim: true,
    },
  },
  { _id: false }
);

const medicalRecordSchema = new mongoose.Schema(
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    diagnosis: {
      type: String,
      required: [true, 'Please provide diagnosis'],
      trim: true,
    },
    symptoms: {
      type: String,
      default: '',
      trim: true,
    },
    consultationNotes: {
      type: String,
      default: '',
      trim: true,
    },
    prescription: [prescriptionItemSchema],
  },
  {
    timestamps: true,
  }
);

medicalRecordSchema.index({ patientId: 1, createdAt: -1 });
medicalRecordSchema.index({ doctorId: 1 });

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
export default MedicalRecord;
