import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

/**
 * @route   GET /api/doctors
 * @desc    Get all approved doctors with optional search and filter
 * @access  Public
 */
export const getDoctors = async (req, res, next) => {
  try {
    const { specialization, search, location } = req.query;

    const filter = { isApproved: true };

    if (specialization && specialization !== 'All') {
      filter.specialization = new RegExp(`^${specialization}$`, 'i');
    }

    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    let doctors = await Doctor.find(filter)
      .populate('userId', 'name email phone profileImage isActive')
      .sort({ rating: -1, experience: -1 });

    // Filter by doctor name or hospital keyword if search term provided
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      doctors = doctors.filter((doc) => {
        const docName = doc.userId?.name || '';
        const hospital = doc.hospital || '';
        const spec = doc.specialization || '';
        return regex.test(docName) || regex.test(hospital) || regex.test(spec);
      });
    }

    // Filter out inactive users
    doctors = doctors.filter((doc) => doc.userId && doc.userId.isActive !== false);

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/doctors/:id
 * @desc    Get single doctor profile by ID
 * @access  Public
 */
export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      'userId',
      'name email phone profileImage'
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/doctors/:id
 * @desc    Update doctor profile (Doctor self or Admin)
 * @access  Private (Doctor, Admin)
 */
export const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    // Check ownership if not admin
    if (req.user.role !== 'admin' && doctor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You may only update your own doctor profile.',
      });
    }

    const {
      specialization,
      qualifications,
      experience,
      consultationFee,
      hospital,
      location,
      biography,
      availableDays,
      availableSlots,
      isApproved,
    } = req.body;

    if (specialization) doctor.specialization = specialization;
    if (qualifications) doctor.qualifications = qualifications;
    if (experience !== undefined) doctor.experience = experience;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (hospital) doctor.hospital = hospital;
    if (location) doctor.location = location;
    if (biography !== undefined) doctor.biography = biography;
    if (availableDays) doctor.availableDays = availableDays;
    if (availableSlots) doctor.availableSlots = availableSlots;

    if (req.user.role === 'admin' && isApproved !== undefined) {
      doctor.isApproved = isApproved;
    }

    await doctor.save();

    const updated = await Doctor.findById(doctor._id).populate(
      'userId',
      'name email phone profileImage'
    );

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully.',
      doctor: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/doctors
 * @desc    Create doctor profile (Admin only)
 * @access  Private (Admin)
 */
export const createDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      qualifications,
      experience,
      consultationFee,
      hospital,
      location,
      biography,
      availableDays,
      availableSlots,
    } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    const passwordHash = await User.hashPassword(password || 'Doctor@123');

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'doctor',
      phone: phone || '',
    });

    const doctor = await Doctor.create({
      userId: user._id,
      specialization: specialization || 'General Medicine',
      qualifications: qualifications || ['MBBS, MD'],
      experience: experience || 5,
      consultationFee: consultationFee || 60,
      hospital: hospital || 'MediConnect Healthcare Center',
      location: location || 'Central Medical Hub',
      biography: biography || `Dr. ${name} is an experienced practitioner in ${specialization}.`,
      availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableSlots: availableSlots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
      isApproved: true,
    });

    const populated = await Doctor.findById(doctor._id).populate('userId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully.',
      doctor: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/doctors/:id
 * @desc    Deactivate/Delete doctor (Admin only)
 * @access  Private (Admin)
 */
export const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Deactivate associated user
    await User.findByIdAndUpdate(doctor.userId, { isActive: false });
    doctor.isApproved = false;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Doctor account has been deactivated.',
    });
  } catch (error) {
    next(error);
  }
};
