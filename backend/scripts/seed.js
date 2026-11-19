import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import User from '../src/models/User.js';
import Doctor from '../src/models/Doctor.js';
import Appointment from '../src/models/Appointment.js';
import MedicalRecord from '../src/models/MedicalRecord.js';
import Notification from '../src/models/Notification.js';

const DEMO_PASSWORD_DEFAULT = process.env.DEMO_USER_PASSWORD || 'Password@123';

const doctorsData = [
  {
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@mediconnect.com',
    specialization: 'Cardiology',
    qualifications: ['MBBS', 'MD (Cardiology)', 'FACC'],
    experience: 12,
    consultationFee: 75,
    hospital: 'Apex Heart & Vascular Institute',
    location: 'North Medical Wing, Suite 401',
    biography: 'Dr. Sarah Jenkins is an experienced board-certified cardiologist with a focus on preventative cardiovascular health and cardiac rehabilitation.',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
    rating: 4.9,
    totalReviews: 88,
  },
  {
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@mediconnect.com',
    specialization: 'Dermatology',
    qualifications: ['MBBS', 'MD (Dermatology)', 'FAAD'],
    experience: 9,
    consultationFee: 65,
    hospital: 'DermaCare Specialty Clinic',
    location: 'Downtown Health Plaza, Floor 2',
    biography: 'Dr. Marcus Vance specializes in clinical dermatology, acne therapies, and advanced laser skin rejuvenation.',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableSlots: ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '04:00 PM'],
    rating: 4.8,
    totalReviews: 64,
  },
  {
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@mediconnect.com',
    specialization: 'Neurology',
    qualifications: ['MBBS', 'DM (Neurology)', 'PhD'],
    experience: 15,
    consultationFee: 90,
    hospital: 'Metropolitan Neuroscience Center',
    location: 'Academic Hospital Pavilion C',
    biography: 'Dr. Elena Rostova provides specialized diagnostics for migraine syndromes, sleep disorders, and complex neuropathies.',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    availableSlots: ['09:30 AM', '10:30 AM', '02:00 PM', '03:30 PM'],
    rating: 5.0,
    totalReviews: 104,
  },
  {
    name: 'Dr. David Chen',
    email: 'david.chen@mediconnect.com',
    specialization: 'Orthopedics',
    qualifications: ['MBBS', 'MS (Orthopedics)', 'MCh'],
    experience: 11,
    consultationFee: 70,
    hospital: 'Joint & Spine Mobility Hospital',
    location: 'Westside Medical Tower, Suite 105',
    biography: 'Dr. David Chen is an orthopedic surgeon recognized for minimally invasive sports medicine and arthroscopic joint preservation.',
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    rating: 4.9,
    totalReviews: 76,
  },
  {
    name: 'Dr. Anita Roy',
    email: 'anita.roy@mediconnect.com',
    specialization: 'Pediatrics',
    qualifications: ['MBBS', 'MD (Pediatrics)', 'DCH'],
    experience: 8,
    consultationFee: 50,
    hospital: 'Little Wonders Children Health Clinic',
    location: 'Family Care Wing, Floor 1',
    biography: 'Dr. Anita Roy brings compassionate, family-centered medical care for infants, children, and adolescents.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM'],
    rating: 4.9,
    totalReviews: 92,
  },
  {
    name: 'Dr. Robert Miller',
    email: 'robert.miller@mediconnect.com',
    specialization: 'General Medicine',
    qualifications: ['MBBS', 'MD (Internal Medicine)'],
    experience: 14,
    consultationFee: 50,
    hospital: 'MediConnect Central Wellness Center',
    location: 'Main Medical Center, Suite 101',
    biography: 'Dr. Robert Miller is an attentive primary care physician focusing on chronic disease management and comprehensive wellness consultations.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['08:30 AM', '10:00 AM', '11:30 AM', '02:30 PM', '04:00 PM'],
    rating: 4.8,
    totalReviews: 120,
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@mediconnect.com',
    specialization: 'Dentistry',
    qualifications: ['BDS', 'MDS (Orthodontics)'],
    experience: 7,
    consultationFee: 45,
    hospital: 'SmileCraft Dental Studio',
    location: 'Highland Avenue Care Suite 3',
    biography: 'Dr. Priya Sharma is dedicated to gentle, aesthetic dentistry, modern orthodontics, and restorative oral care.',
    availableDays: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM'],
    rating: 4.7,
    totalReviews: 45,
  },
  {
    name: 'Dr. Arthur Campbell',
    email: 'arthur.campbell@mediconnect.com',
    specialization: 'Ophthalmology',
    qualifications: ['MBBS', 'MS (Ophthalmology)', 'FRCS'],
    experience: 16,
    consultationFee: 65,
    hospital: 'Visionary Eye & Retina Institute',
    location: 'East Wing Optical Building, Suite 502',
    biography: 'Dr. Arthur Campbell is a specialist in retinal health, refractive surgery consultations, and comprehensive ocular wellness.',
    availableDays: ['Monday', 'Wednesday', 'Thursday'],
    availableSlots: ['09:00 AM', '10:30 AM', '01:30 PM', '03:00 PM'],
    rating: 4.9,
    totalReviews: 81,
  },
];

async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Checking for existing accounts...');

    // 1. Seed or find Admin
    let admin = await User.findOne({ email: 'admin@mediconnect.com' });
    if (!admin) {
      const hash = await User.hashPassword('Admin@123');
      admin = await User.create({
        name: 'MediConnect Administrator',
        email: 'admin@mediconnect.com',
        passwordHash: hash,
        role: 'admin',
        phone: '+1 555-0100',
        isActive: true,
      });
      console.log('✓ Admin account created (admin@mediconnect.com / Admin@123)');
    } else {
      console.log('• Admin account already exists');
    }

    // 2. Seed or find Demo Patient
    let patient = await User.findOne({ email: 'patient@mediconnect.com' });
    if (!patient) {
      const hash = await User.hashPassword('Patient@123');
      patient = await User.create({
        name: 'Alex Johnson',
        email: 'patient@mediconnect.com',
        passwordHash: hash,
        role: 'patient',
        phone: '+1 555-0199',
        isActive: true,
      });
      console.log('✓ Demo Patient account created (patient@mediconnect.com / Patient@123)');
    } else {
      console.log('• Demo Patient account already exists');
    }

    // 3. Seed Doctors
    const createdDoctors = [];
    for (const docData of doctorsData) {
      let docUser = await User.findOne({ email: docData.email });
      if (!docUser) {
        const hash = await User.hashPassword('Doctor@123');
        docUser = await User.create({
          name: docData.name,
          email: docData.email,
          passwordHash: hash,
          role: 'doctor',
          phone: '+1 555-0144',
          isActive: true,
        });
      }

      let doctorProfile = await Doctor.findOne({ userId: docUser._id });
      if (!doctorProfile) {
        doctorProfile = await Doctor.create({
          userId: docUser._id,
          specialization: docData.specialization,
          qualifications: docData.qualifications,
          experience: docData.experience,
          consultationFee: docData.consultationFee,
          hospital: docData.hospital,
          location: docData.location,
          biography: docData.biography,
          availableDays: docData.availableDays,
          availableSlots: docData.availableSlots,
          rating: docData.rating,
          totalReviews: docData.totalReviews,
          isApproved: true,
        });
        console.log(`✓ Doctor created: ${docData.name} (${docData.specialization})`);
      }
      createdDoctors.push(doctorProfile);
    }

    // 4. Seed Sample Appointments for Alex Johnson
    const existingAppointments = await Appointment.find({ patientId: patient._id });
    if (existingAppointments.length === 0 && createdDoctors.length > 0) {
      const docCardio = createdDoctors[0]; // Dr. Sarah Jenkins
      const docDerma = createdDoctors[1]; // Dr. Marcus Vance

      // Tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      // Past date (3 days ago)
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 3);
      const pastStr = pastDate.toISOString().split('T')[0];

      // Upcoming confirmed appointment
      const apptUpcoming = await Appointment.create({
        patientId: patient._id,
        doctorId: docCardio._id,
        appointmentDate: tomorrowStr,
        appointmentTime: '10:00 AM',
        reason: 'Routine annual cardiovascular checkup',
        status: 'confirmed',
        consultationFee: docCardio.consultationFee,
        paymentStatus: 'paid',
      });

      // Completed past appointment with medical record
      const apptCompleted = await Appointment.create({
        patientId: patient._id,
        doctorId: docDerma._id,
        appointmentDate: pastStr,
        appointmentTime: '01:00 PM',
        reason: 'Contact dermatitis consultation and rash examination',
        status: 'completed',
        consultationFee: docDerma.consultationFee,
        paymentStatus: 'paid',
      });

      // Create medical record for completed appointment
      await MedicalRecord.create({
        patientId: patient._id,
        doctorId: docDerma._id,
        appointmentId: apptCompleted._id,
        diagnosis: 'Mild allergic contact dermatitis on forearm',
        symptoms: 'Localized erythema, mild pruritus, and dry patches',
        consultationNotes: 'Patient was evaluated for skin redness. Advised to avoid harsh fragrances and use prescribed topical ointment twice daily.',
        prescription: [
          {
            medicine: 'Hydrocortisone 1% Topical Cream',
            dosage: 'Thin layer',
            frequency: 'Twice daily',
            duration: '7 days',
            instructions: 'Apply gently to affected area after washing',
          },
          {
            medicine: 'Cetirizine 10mg',
            dosage: '1 tablet',
            frequency: 'Once daily at bedtime',
            duration: '5 days',
            instructions: 'Oral antihistamine with water',
          },
        ],
      });

      // Create initial notifications
      await Notification.create({
        userId: patient._id,
        title: 'Welcome to MediConnect',
        message: 'Your health portal account is active. Schedule appointments and view health records securely.',
        type: 'system',
      });

      await Notification.create({
        userId: patient._id,
        title: 'Prescription Ready',
        message: 'Dr. Marcus Vance published your consultation notes and prescription for your recent visit.',
        type: 'completed',
      });

      console.log('✓ Sample appointment & medical record seeded for Alex Johnson');
    }

    console.log('\n[Seed Completed Successfully] All test accounts & records ready.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
}

seedDatabase();
