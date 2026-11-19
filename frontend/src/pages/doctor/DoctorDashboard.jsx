import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService, doctorService, medicalRecordService } from '../../services/api';
import Button from '../../components/ui/Button';

export const DoctorDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'availability' | 'profile'
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  // Prescription modal state
  const [selectedApptForRecord, setSelectedApptForRecord] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [prescriptions, setPrescriptions] = useState([
    { medicine: '', dosage: '', frequency: 'Once daily', duration: '5 days', instructions: 'After meals' },
  ]);
  const [isSubmittingRecord, setIsSubmittingRecord] = useState(false);

  // Availability form state
  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedDays, setSelectedDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlotInput, setNewSlotInput] = useState('');
  const [feeInput, setFeeInput] = useState(50);
  const [isSavingAvailability, setIsSavingAvailability] = useState(false);

  const loadDoctorData = async () => {
    setIsLoading(true);
    try {
      const apptRes = await appointmentService.getDoctorAppointments();
      if (apptRes.success) {
        setAppointments(apptRes.appointments || []);
      }

      // Load doctor's own profile
      if (user?.doctorProfile) {
        setDoctorProfile(user.doctorProfile);
        setSelectedDays(user.doctorProfile.availableDays || []);
        setTimeSlots(user.doctorProfile.availableSlots || []);
        setFeeInput(user.doctorProfile.consultationFee || 50);
      } else {
        const docRes = await doctorService.getDoctors();
        const found = docRes.doctors?.find((d) => d.userId?._id === user?._id || d.userId === user?._id);
        if (found) {
          setDoctorProfile(found);
          setSelectedDays(found.availableDays || []);
          setTimeSlots(found.availableSlots || []);
          setFeeInput(found.consultationFee || 50);
        }
      }
    } catch (err) {
      console.error('Error fetching doctor data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, [user]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const res = await appointmentService.updateStatus(appointmentId, status);
      if (res.success) {
        setActionMsg(`Appointment marked as ${status}.`);
        setTimeout(() => setActionMsg(''), 4000);
        loadDoctorData();
      }
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  // Prescription Items Handler
  const handleAddPrescriptionRow = () => {
    setPrescriptions((prev) => [
      ...prev,
      { medicine: '', dosage: '', frequency: 'Twice daily', duration: '5 days', instructions: 'After meals' },
    ]);
  };

  const handlePrescriptionChange = (idx, field, val) => {
    setPrescriptions((prev) => {
      const updated = [...prev];
      updated[idx][field] = val;
      return updated;
    });
  };

  const handleRemovePrescriptionRow = (idx) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmitRecord = async (e) => {
    e.preventDefault();
    if (!selectedApptForRecord) return;
    setIsSubmittingRecord(true);

    try {
      const res = await medicalRecordService.createRecord({
        appointmentId: selectedApptForRecord._id,
        diagnosis,
        symptoms,
        consultationNotes: notes,
        prescription: prescriptions.filter((p) => p.medicine.trim() !== ''),
      });

      if (res.success) {
        setActionMsg('Consultation completed and medical record generated.');
        setTimeout(() => setActionMsg(''), 4000);
        setSelectedApptForRecord(null);
        setDiagnosis('');
        setSymptoms('');
        setNotes('');
        loadDoctorData();
      }
    } catch (err) {
      alert(err.message || 'Failed to save medical record.');
    } finally {
      setIsSubmittingRecord(false);
    }
  };

  // Availability Handlers
  const handleToggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddSlot = () => {
    if (newSlotInput.trim() && !timeSlots.includes(newSlotInput.trim())) {
      setTimeSlots((prev) => [...prev, newSlotInput.trim()]);
      setNewSlotInput('');
    }
  };

  const handleRemoveSlot = (slot) => {
    setTimeSlots((prev) => prev.filter((s) => s !== slot));
  };

  const handleSaveAvailability = async () => {
    if (!doctorProfile?._id) return;
    setIsSavingAvailability(true);

    try {
      const res = await doctorService.updateDoctor(doctorProfile._id, {
        availableDays: selectedDays,
        availableSlots: timeSlots,
        consultationFee: Number(feeInput),
      });

      if (res.success) {
        setActionMsg('Availability schedule and consultation fees saved successfully.');
        setTimeout(() => setActionMsg(''), 4000);
        setDoctorProfile(res.doctor);
      }
    } catch (err) {
      alert(err.message || 'Failed to save availability.');
    } finally {
      setIsSavingAvailability(false);
    }
  };

  // Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter((a) => a.appointmentDate === todayStr);
  const pendingAppts = appointments.filter((a) => a.status === 'pending');
  const completedAppts = appointments.filter((a) => a.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal">Physician Management Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main mt-0.5">
            Dr. {user?.name ? user.name.replace('Dr. ', '') : 'Physician'}
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            {doctorProfile?.specialization || 'Specialist'} • {doctorProfile?.hospital || 'MediConnect Clinic'}
          </p>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          {actionMsg}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Consultations</div>
          <div className="text-2xl font-extrabold text-main mt-1">{appointments.length}</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-primary">Today's Visits</div>
          <div className="text-2xl font-extrabold text-primary mt-1">{todayAppts.length}</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">Pending Requests</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{pendingAppts.length}</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Completed</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{completedAppts.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 mb-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'appointments' ? 'border-teal text-teal' : 'border-transparent text-secondary hover:text-main'
          }`}
        >
          Patient Appointments ({appointments.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('availability')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'availability' ? 'border-teal text-teal' : 'border-transparent text-secondary hover:text-main'
          }`}
        >
          Schedule &amp; Availability
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile' ? 'border-teal text-teal' : 'border-transparent text-secondary hover:text-main'
          }`}
        >
          Doctor Profile Details
        </button>
      </div>

      {/* Tab 1: Appointments List */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-secondary">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="font-bold text-main text-base mb-1">No Appointments Booked Yet</h3>
              <p className="text-xs text-secondary">New consultation requests from patients will appear here in real time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Patient Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Date &amp; Time</th>
                    <th className="p-4">Consultation Reason</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((appt) => {
                    const patName = appt.patientId?.name || 'Patient';
                    const patEmail = appt.patientId?.email || '';
                    const patPhone = appt.patientId?.phone || 'N/A';

                    return (
                      <tr key={appt._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-bold text-main">{patName}</td>
                        <td className="p-4 text-secondary">
                          <div>{patEmail}</div>
                          <div className="text-[11px] text-slate-400">{patPhone}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-main">{appt.appointmentDate}</div>
                          <div className="text-[11px] text-teal font-medium">{appt.appointmentTime}</div>
                        </td>
                        <td className="p-4 text-secondary max-w-xs">{appt.reason}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              appt.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : appt.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : appt.status === 'completed'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {appt.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {appt.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs py-1 px-2.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                              onClick={() => handleUpdateStatus(appt._id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                          )}

                          {appt.status === 'confirmed' && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-xs py-1 px-3"
                              onClick={() => {
                                setSelectedApptForRecord(appt);
                                setDiagnosis('');
                                setSymptoms('');
                                setNotes('');
                              }}
                            >
                              Add Prescription
                            </Button>
                          )}

                          {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(appt._id, 'cancelled')}
                              className="text-rose-600 hover:text-rose-800 font-semibold text-xs hover:underline cursor-pointer ml-1"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Availability Management */}
      {activeTab === 'availability' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs max-w-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-main">Configure Weekly Availability</h3>
            <p className="text-xs text-secondary mt-0.5">Patients can only reserve time slots on your selected days.</p>
          </div>

          {/* Days selector */}
          <div>
            <label className="block text-xs font-semibold text-main mb-2">Available Consultation Days</label>
            <div className="flex flex-wrap gap-2">
              {allDays.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal text-white border-teal shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-teal'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots editor */}
          <div>
            <label className="block text-xs font-semibold text-main mb-2">Consultation Time Slots</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {timeSlots.map((slot) => (
                <span
                  key={slot}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                >
                  <span>{slot}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(slot)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                placeholder="e.g. 05:00 PM"
                value={newSlotInput}
                onChange={(e) => setNewSlotInput(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs flex-1 focus:ring-2 focus:ring-teal focus:outline-none"
              />
              <Button variant="outline" size="sm" onClick={handleAddSlot}>
                + Add Slot
              </Button>
            </div>
          </div>

          {/* Consultation Fee */}
          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-main mb-1">Consultation Fee ($ USD)</label>
            <input
              type="number"
              min="0"
              value={feeInput}
              onChange={(e) => setFeeInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal focus:outline-none"
            />
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleSaveAvailability}
            disabled={isSavingAvailability}
            className="w-full sm:w-auto"
          >
            {isSavingAvailability ? 'Saving...' : 'Save Availability & Fees'}
          </Button>
        </div>
      )}

      {/* Tab 3: Doctor Profile */}
      {activeTab === 'profile' && doctorProfile && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs max-w-2xl space-y-4 text-xs">
          <h3 className="text-lg font-bold text-main mb-4">Doctor Credentials &amp; Hospital Details</h3>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Specialization</span>
            <p className="font-semibold text-main text-sm">{doctorProfile.specialization}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Hospital / Clinic</span>
            <p className="font-semibold text-main text-sm">{doctorProfile.hospital}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Location</span>
            <p className="font-semibold text-main text-sm">{doctorProfile.location}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Experience</span>
            <p className="font-semibold text-main text-sm">{doctorProfile.experience} Years</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Biography</span>
            <p className="text-secondary leading-relaxed">{doctorProfile.biography || 'Not specified'}</p>
          </div>
        </div>
      )}

      {/* Add Prescription & Consultation Record Modal */}
      {selectedApptForRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal">Clinical Documentation</span>
                <h3 className="text-xl font-bold text-main">Complete Consultation &amp; Prescription</h3>
                <p className="text-xs text-secondary mt-0.5">
                  Patient: <strong className="text-main">{selectedApptForRecord.patientId?.name}</strong> • Date: {selectedApptForRecord.appointmentDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApptForRecord(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-main mb-1">Diagnosis *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute bronchitis, Hypertension stage 1"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-main mb-1">Symptoms Reported</label>
                <input
                  type="text"
                  placeholder="e.g. Mild fever, dry cough for 3 days"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-main mb-1">Clinical Notes &amp; Advice</label>
                <textarea
                  rows="3"
                  placeholder="Clinical observations, lifestyle recommendations, follow-up instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal focus:outline-none"
                ></textarea>
              </div>

              {/* Prescription Items */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-main uppercase tracking-wider">Prescribed Medications</span>
                  <button
                    type="button"
                    onClick={handleAddPrescriptionRow}
                    className="text-xs text-teal font-semibold hover:underline cursor-pointer"
                  >
                    + Add Medication
                  </button>
                </div>

                <div className="space-y-3">
                  {prescriptions.map((rx, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 space-y-2 text-xs">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Medicine name (e.g. Amoxicillin 500mg)"
                          value={rx.medicine}
                          onChange={(e) => handlePrescriptionChange(idx, 'medicine', e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Dosage (e.g. 1 cap)"
                          value={rx.dosage}
                          onChange={(e) => handlePrescriptionChange(idx, 'dosage', e.target.value)}
                          className="w-28 px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                          required
                        />
                        {prescriptions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePrescriptionRow(idx)}
                            className="text-rose-500 hover:text-rose-700 px-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Frequency (Twice daily)"
                          value={rx.frequency}
                          onChange={(e) => handlePrescriptionChange(idx, 'frequency', e.target.value)}
                          className="px-3 py-1 rounded-lg border border-slate-300 bg-white text-[11px]"
                        />
                        <input
                          type="text"
                          placeholder="Duration (5 days)"
                          value={rx.duration}
                          onChange={(e) => handlePrescriptionChange(idx, 'duration', e.target.value)}
                          className="px-3 py-1 rounded-lg border border-slate-300 bg-white text-[11px]"
                        />
                        <input
                          type="text"
                          placeholder="Instructions (After meals)"
                          value={rx.instructions}
                          onChange={(e) => handlePrescriptionChange(idx, 'instructions', e.target.value)}
                          className="px-3 py-1 rounded-lg border border-slate-300 bg-white text-[11px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <Button variant="ghost" size="md" onClick={() => setSelectedApptForRecord(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit" disabled={isSubmittingRecord}>
                  {isSubmittingRecord ? 'Saving...' : 'Finalize & Issue Record'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
