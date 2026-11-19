import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/api';
import Button from '../ui/Button';

export const BookingModal = ({ doctor, isOpen, onClose, onBookingSuccess }) => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('General Consultation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  if (!isOpen || !doctor) return null;

  const doctorName = doctor.userId?.name || doctor.name || 'Medical Specialist';
  const slots = doctor.availableSlots && doctor.availableSlots.length > 0
    ? doctor.availableSlots
    : ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const handleBooking = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: `/doctors/${doctor._id}` } });
      return;
    }

    if (role !== 'patient') {
      setErrorMsg('Only registered patients can book appointments. Please log in as a patient.');
      return;
    }

    if (!selectedDate) {
      setErrorMsg('Please select an appointment date.');
      return;
    }

    if (!selectedSlot) {
      setErrorMsg('Please choose an available time slot.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await appointmentService.bookAppointment({
        doctorId: doctor._id,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot,
        reason,
      });

      if (response.success) {
        setSuccessData(response.appointment);
        if (onBookingSuccess) onBookingSuccess(response.appointment);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-slide-down">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {successData ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-main mb-2">Appointment Confirmed!</h3>
            <p className="text-sm text-secondary mb-6">
              Your consultation with <strong className="text-main">Dr. {doctorName}</strong> has been scheduled and persisted in the database.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between"><span className="text-secondary">Date:</span> <strong className="text-main">{successData.appointmentDate}</strong></div>
              <div className="flex justify-between"><span className="text-secondary">Time:</span> <strong className="text-main">{successData.appointmentTime}</strong></div>
              <div className="flex justify-between"><span className="text-secondary">Specialty:</span> <strong className="text-main">{doctor.specialization}</strong></div>
              <div className="flex justify-between"><span className="text-secondary">Hospital:</span> <strong className="text-main">{doctor.hospital}</strong></div>
              <div className="flex justify-between"><span className="text-secondary">Fee:</span> <strong className="text-teal font-bold">${doctor.consultationFee}</strong></div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="md"
                className="flex-1"
                onClick={() => {
                  setSuccessData(null);
                  onClose();
                }}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => {
                  onClose();
                  navigate('/dashboard');
                }}
              >
                View in Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-teal">Reserve Consultation</span>
              <h2 className="text-2xl font-bold text-main mt-0.5">Book Appointment</h2>
              <div className="flex items-center gap-2 mt-2 text-sm text-secondary">
                <span className="font-semibold text-main">Dr. {doctorName}</span>
                <span>•</span>
                <span className="text-primary font-medium">{doctor.specialization}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {!isAuthenticated && (
              <div className="p-3 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                Please log in to your patient account to confirm your consultation booking.
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              {/* Date selection */}
              <div>
                <label className="block text-xs font-semibold text-main mb-1.5">
                  Select Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              {/* Time slot selection */}
              <div>
                <label className="block text-xs font-semibold text-main mb-1.5">
                  Choose Available Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-primary/50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-main mb-1.5">
                  Consultation Reason
                </label>
                <input
                  type="text"
                  placeholder="e.g. Health checkup, Follow-up consultation"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Fee & Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Consultation Fee</div>
                  <div className="text-xl font-bold text-teal">${doctor.consultationFee}</div>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="md" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
