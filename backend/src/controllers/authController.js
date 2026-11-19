import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/tokenUtils.js';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Patient by default, Doctor with initial profile)
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, specialization, hospital, experience, consultationFee } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Security: Block self-registering as admin
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Self-registration as administrator is not permitted.',
      });
    }

    const assignedRole = role === 'doctor' ? 'doctor' : 'patient';

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const passwordHash = await User.hashPassword(password);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: assignedRole,
      phone: phone || '',
    });

    // If registering as doctor, create initial doctor profile
    if (assignedRole === 'doctor') {
      await Doctor.create({
        userId: user._id,
        specialization: specialization || 'General Medicine',
        hospital: hospital || 'MediConnect Central Clinic',
        location: 'Main Hospital Campus',
        experience: Number(experience) || 3,
        consultationFee: Number(consultationFee) || 50,
        biography: `Dr. ${name} is a specialist in ${specialization || 'General Medicine'}.`,
        isApproved: true,
      });
    }

    const token = generateToken(user);
    setTokenCookie(res, token);

    const userObj = user.toObject();
    delete userObj.passwordHash;

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: userObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Log in user & set HTTP-only cookie
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact an administrator.',
      });
    }

    const token = generateToken(user);
    setTokenCookie(res, token);

    const userObj = user.toObject();
    delete userObj.passwordHash;

    // If doctor, also attach doctor details
    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        ...userObj,
        doctorProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Log out user & clear cookie
 * @access  Public
 */
export const logout = (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        doctorProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, profileImage } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    const userObj = user.toObject();
    delete userObj.passwordHash;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: userObj,
    });
  } catch (error) {
    next(error);
  }
};
