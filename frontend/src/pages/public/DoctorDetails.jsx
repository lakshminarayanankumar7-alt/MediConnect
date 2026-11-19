import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorService } from '../../services/api';
import BookingModal from '../../components/appointments/BookingModal';
import Button from '../../components/ui/Button';

export const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await doctorService.getDoctorById(id);
        if (response.success && response.doctor) {
          setDoctor(response.doctor);
        } else {
          setErrorMsg('Doctor profile not found.');
        }
      } catch (err) {
        setErrorMsg(err.message || 'Failed to load doctor profile.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-secondary">Loading doctor profile...</p>
      </div>
    );
  }

  if (errorMsg || !doctor) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-main mb-2">Doctor Profile Not Found</h2>
        <p className="text-sm text-secondary mb-6">{errorMsg || 'The requested doctor is unavailable.'}</p>
        <Link to="/doctors">
          <Button variant="primary" size="md">Back to Doctors Directory</Button>
        </Link>
      </div>
    );
  }

  const doctorName = doctor.userId?.name || doctor.name || 'Specialist';
  const initials = doctorName
    .replace('Dr. ', '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Back button */}
      <div className="mb-6">
        <Link to="/doctors" className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to all doctors</span>
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-primary/10 to-teal/20 text-primary flex items-center justify-center font-extrabold text-3xl border border-primary/20 shrink-0 shadow-inner">
            {initials}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {doctor.specialization}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-main mt-2">
                  Dr. {doctorName.replace('Dr. ', '')}
                </h1>
                <p className="text-sm font-medium text-secondary mt-0.5">
                  {doctor.qualifications?.join(', ') || 'MBBS, MD'} • {doctor.experience} Years Experience
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase font-bold text-slate-400 block">Consultation Fee</span>
                <span className="text-3xl font-extrabold text-teal">${doctor.consultationFee}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-secondary">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-main">Hospital:</span>
                <span>{doctor.hospital}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-main">Location:</span>
                <span>{doctor.location}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full text-amber-800 font-bold">
                ⭐ {doctor.rating || 4.8} ({doctor.totalReviews || 24} reviews)
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-secondary">
            Available on: <strong className="text-main">{doctor.availableDays?.join(', ')}</strong>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8 font-semibold shadow-md shadow-primary/20"
            onClick={() => setIsBookingOpen(true)}
          >
            Book Appointment Now
          </Button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Biography & Qualifications */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-main mb-3">About the Doctor</h3>
            <p className="text-sm text-secondary leading-relaxed whitespace-pre-line">
              {doctor.biography || `Dr. ${doctorName} is a verified medical practitioner specialized in ${doctor.specialization}. Dedicated to providing comprehensive care and patient-first diagnostics.`}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-main mb-4">Qualifications &amp; Accreditations</h3>
            <div className="flex flex-wrap gap-2">
              {doctor.qualifications?.map((q, idx) => (
                <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                  🎓 {q}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule & Availability Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-main mb-4">Consultation Hours</h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-500 block mb-1">Available Days</span>
                <div className="flex flex-wrap gap-1.5">
                  {doctor.availableDays?.map((d) => (
                    <span key={d} className="px-2.5 py-1 rounded-lg bg-teal/10 text-teal font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="font-semibold text-slate-500 block mb-1.5">Standard Time Slots</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {doctor.availableSlots?.map((slot) => (
                    <span key={slot} className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-center font-medium">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="md"
              className="w-full mt-6"
              onClick={() => setIsBookingOpen(true)}
            >
              Select Slot &amp; Book
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        doctor={doctor}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};

export default DoctorDetails;
