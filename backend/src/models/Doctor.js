import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please provide doctor specialization'],
      trim: true,
    },
    qualifications: {
      type: [String],
      default: ['MBBS'],
    },
    experience: {
      type: Number,
      required: [true, 'Please provide years of experience'],
      min: [0, 'Experience cannot be negative'],
    },
    consultationFee: {
      type: Number,
      required: [true, 'Please provide consultation fee'],
      min: [0, 'Consultation fee cannot be negative'],
      default: 50,
    },
    hospital: {
      type: String,
      required: [true, 'Please provide affiliated hospital / clinic'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide doctor location/city'],
      trim: true,
    },
    biography: {
      type: String,
      default: '',
      trim: true,
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    availableSlots: {
      type: [String],
      default: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    },
    profileImage: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
    },
    totalReviews: {
      type: Number,
      default: 24,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index for search & filter
doctorSchema.index({ specialization: 1, location: 1 });

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
