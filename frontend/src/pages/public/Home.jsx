import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/api';
import DoctorCard from '../../components/doctors/DoctorCard';
import BookingModal from '../../components/appointments/BookingModal';
import Button from '../../components/ui/Button';

export const Home = () => {
  const navigate = useNavigate();
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const specialties = [
    { name: 'General Medicine', icon: '🩺', desc: 'Primary & preventative care' },
    { name: 'Cardiology', icon: '❤️', desc: 'Heart & vascular wellness' },
    { name: 'Dermatology', icon: '✨', desc: 'Skin, hair & wellness' },
    { name: 'Neurology', icon: '🧠', desc: 'Brain & nervous system' },
    { name: 'Orthopedics', icon: '🦴', desc: 'Joint & bone mobility' },
    { name: 'Pediatrics', icon: '👶', desc: 'Infant & child health' },
    { name: 'Dentistry', icon: '🦷', desc: 'Oral health & aesthetics' },
    { name: 'Ophthalmology', icon: '👁️', desc: 'Comprehensive eye care' },
  ];

  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        const response = await doctorService.getDoctors({ limit: 4 });
        if (response.success) {
          setFeaturedDoctors(response.doctors.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load featured doctors:', err);
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchTopDoctors();
  }, []);

  const handleSpecialtyClick = (specialtyName) => {
    navigate(`/doctors?specialization=${encodeURIComponent(specialtyName)}`);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-bg-light via-white to-white pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary-hover text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse"></span>
            <span>MediConnect Healthcare System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-main tracking-tight leading-tight md:leading-none mb-6">
            Your Health,{' '}
            <span className="bg-gradient-to-r from-primary via-teal to-primary bg-clip-text text-transparent">
              Our Priority
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-secondary leading-relaxed mb-10">
            Connect with trusted healthcare professionals, book appointments effortlessly, and manage your healthcare journey in one secure platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link to="/doctors" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md shadow-primary/20 gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span>Find a Doctor</span>
              </Button>
            </Link>

            <Link to="/doctors" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Book an Appointment</span>
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="pt-2 sm:pt-0">
              <div className="text-3xl font-extrabold text-primary">8+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Certified Specialists</div>
            </div>
            <div className="pt-4 sm:pt-0">
              <div className="text-3xl font-extrabold text-teal">24/7</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Online Scheduling</div>
            </div>
            <div className="pt-4 sm:pt-0">
              <div className="text-3xl font-extrabold text-cyan-600">100%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">MongoDB Encrypted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal block mb-2">
            Why MediConnect
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-main tracking-tight mb-4">
            Full-Stack Digital Healthcare Management
          </h2>
          <p className="text-base text-secondary">
            Built for modern patients, doctors, and healthcare administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">
              👨‍⚕️
            </div>
            <h3 className="font-bold text-main text-lg mb-2">Find Qualified Doctors</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Explore verified specialist credentials, clinic affiliations, patient ratings, and consultation fees before booking.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal/10 text-teal flex items-center justify-center font-bold text-xl mb-4">
              📅
            </div>
            <h3 className="font-bold text-main text-lg mb-2">Easy Appointment Booking</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Real-time slot reservation system backed by MongoDB concurrency prevention that eliminates double-booking.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xl mb-4">
              📑
            </div>
            <h3 className="font-bold text-main text-lg mb-2">Secure Medical Records</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Access digital prescriptions and consultation diagnoses authorized strictly to you and your attending physician.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl mb-4">
              🔔
            </div>
            <h3 className="font-bold text-main text-lg mb-2">In-App Notifications</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Receive instant updates when consultations are confirmed, completed, or updated by your doctor.
            </p>
          </div>
        </div>
      </section>

      {/* Medical Specialties Section */}
      <section className="bg-slate-50 border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal block mb-2">
              Browse Specialties
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-main tracking-tight mb-3">
              Consult Top Specialists Across Fields
            </h2>
            <p className="text-sm text-secondary">
              Select any medical department below to filter certified practitioners.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {specialties.map((spec) => (
              <button
                key={spec.name}
                type="button"
                onClick={() => handleSpecialtyClick(spec.name)}
                className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:border-primary hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="text-3xl mb-2">{spec.icon}</div>
                <div className="font-bold text-main text-sm group-hover:text-primary transition-colors">
                  {spec.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{spec.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal block mb-1">
              Verified Medical Staff
            </span>
            <h2 className="text-3xl font-bold text-main tracking-tight">Featured Doctors</h2>
          </div>
          <Link to="/doctors">
            <Button variant="outline" size="sm" className="rounded-xl gap-2 font-semibold">
              <span>View All Doctors</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>

        {isLoadingDoctors ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 animate-pulse h-64"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {featuredDoctors.map((doc) => (
              <DoctorCard
                key={doc._id}
                doctor={doc}
                onBook={(doctor) => setSelectedDoctorForBooking(doctor)}
              />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="bg-primary/5 py-20 border-y border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal block mb-2">
              Simplified Workflow
            </span>
            <h2 className="text-3xl font-bold text-main tracking-tight">How MediConnect Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 text-primary font-extrabold text-xl flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold text-main mb-1 text-base">Create an Account</h4>
              <p className="text-xs text-secondary leading-relaxed">
                Register as a patient to activate your private digital health portal.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 text-teal font-extrabold text-xl flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold text-main mb-1 text-base">Find Your Doctor</h4>
              <p className="text-xs text-secondary leading-relaxed">
                Filter by medical specialty, location, clinic, and patient ratings.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 text-cyan-600 font-extrabold text-xl flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold text-main mb-1 text-base">Book Appointment</h4>
              <p className="text-xs text-secondary leading-relaxed">
                Select an open time slot and confirm instant consultation scheduling.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 text-indigo-600 font-extrabold text-xl flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h4 className="font-bold text-main mb-1 text-base">Manage Healthcare</h4>
              <p className="text-xs text-secondary leading-relaxed">
                Receive prescriptions, view diagnosis summaries, and track appointments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal block">
            About the Project
          </span>
          <h2 className="text-3xl font-bold text-main">Engineering Better Doctor-Patient Care</h2>
          <p className="text-sm text-secondary leading-relaxed">
            MediConnect was engineered as a modern Full Stack MERN solution to solve fragmented clinic booking systems. By uniting React 19, Node.js 24, Express 5, and MongoDB Atlas, it delivers high availability, zero double-booking concurrency constraints, and role-based medical record isolation.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-slate-50 border-t border-slate-200 py-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal block mb-1">
              Contact &amp; Inquiries
            </span>
            <h2 className="text-2xl font-bold text-main">Get in Touch</h2>
            <p className="text-xs text-secondary mt-1">Have feedback or questions about MediConnect? Send us a message.</p>
          </div>

          {contactSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-3xl text-center">
              <div className="text-3xl mb-2">✉️</div>
              <h4 className="font-bold text-sm mb-1">Message Received!</h4>
              <p className="text-xs">Thank you for contacting MediConnect support. We will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-semibold text-main mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-main mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-main mb-1">Message</label>
                <textarea
                  rows="4"
                  required
                  placeholder="How can we assist you today?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                ></textarea>
              </div>
              <Button variant="primary" size="md" type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        doctor={selectedDoctorForBooking}
        isOpen={!!selectedDoctorForBooking}
        onClose={() => setSelectedDoctorForBooking(null)}
      />
    </div>
  );
};

export default Home;
