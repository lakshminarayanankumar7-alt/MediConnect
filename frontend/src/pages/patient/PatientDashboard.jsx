import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { appointmentService, medicalRecordService } from '../../services/api';
import Button from '../../components/ui/Button';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotifications();

  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'records' | 'notifications' | 'profile'
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [apptRes, recRes] = await Promise.all([
        appointmentService.getMyAppointments(),
        medicalRecordService.getMyRecords(),
      ]);

      if (apptRes.success) setAppointments(apptRes.appointments || []);
      if (recRes.success) setRecords(recRes.records || []);
    } catch (err) {
      console.error('Error fetching patient data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const res = await appointmentService.cancelAppointment(id);
      if (res.success) {
        setActionMsg('Appointment cancelled successfully.');
        setTimeout(() => setActionMsg(''), 4000);
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment.');
    }
  };

  // Metrics
  const totalCount = appointments.length;
  const upcomingCount = appointments.filter((a) => a.status === 'confirmed' || a.status === 'pending').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'cancelled').length;

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      completed: 'bg-blue-50 text-blue-700 border-blue-200',
      cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>
        {status ? status.toUpperCase() : 'PENDING'}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal">Patient Health Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main mt-0.5">Welcome, {user?.name}</h1>
          <p className="text-xs text-secondary mt-0.5">Track your appointments, medical records, and physician prescriptions.</p>
        </div>
        <Link to="/doctors">
          <Button variant="primary" size="md" className="rounded-xl gap-2 font-semibold shadow-md shadow-primary/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Book New Appointment</span>
          </Button>
        </Link>
      </div>

      {actionMsg && (
        <div className="p-3 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          {actionMsg}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total</div>
          <div className="text-2xl font-extrabold text-main mt-1">{totalCount}</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Upcoming</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{upcomingCount}</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-primary">Completed</div>
          <div className="text-2xl font-extrabold text-primary mt-1">{completedCount}</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-500">Cancelled</div>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{cancelledCount}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 mb-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'appointments' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-main'
          }`}
        >
          My Appointments ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('records')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'records' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-main'
          }`}
        >
          Medical Records &amp; Prescriptions ({records.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'notifications' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-main'
          }`}
        >
          Notifications ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-main'
          }`}
        >
          Profile Settings
        </button>
      </div>

      {/* Tab 1: Appointments */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-secondary">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="font-bold text-main text-base mb-1">No Appointments Scheduled</h3>
              <p className="text-xs text-secondary mb-4">You have not scheduled any doctor consultations yet.</p>
              <Link to="/doctors">
                <Button variant="primary" size="sm">Find a Doctor Now</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Doctor</th>
                    <th className="p-4">Specialty</th>
                    <th className="p-4">Date &amp; Time</th>
                    <th className="p-4">Reason</th>
                    <th className="p-4">Fee</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((appt) => {
                    const docUser = appt.doctorId?.userId?.name || 'Dr. Specialist';
                    const spec = appt.doctorId?.specialization || 'Medicine';
                    const canCancel = appt.status === 'pending' || appt.status === 'confirmed';

                    return (
                      <tr key={appt._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-bold text-main">
                          <Link to={`/doctors/${appt.doctorId?._id}`} className="hover:text-primary">
                            Dr. {(docUser || 'Specialist').replace('Dr. ', '')}
                          </Link>
                        </td>
                        <td className="p-4 text-secondary">{spec}</td>
                        <td className="p-4">
                          <div className="font-semibold text-main">{appt.appointmentDate}</div>
                          <div className="text-[11px] text-teal font-medium">{appt.appointmentTime}</div>
                        </td>
                        <td className="p-4 text-secondary max-w-xs truncate">{appt.reason}</td>
                        <td className="p-4 font-bold text-main">${appt.consultationFee}</td>
                        <td className="p-4">{getStatusBadge(appt.status)}</td>
                        <td className="p-4 text-right">
                          {canCancel ? (
                            <button
                              type="button"
                              onClick={() => handleCancelAppointment(appt._id)}
                              className="text-rose-600 hover:text-rose-800 font-semibold text-xs hover:underline cursor-pointer"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-slate-400">—</span>
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

      {/* Tab 2: Medical Records */}
      {activeTab === 'records' && (
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-xs text-secondary">
              Loading medical records...
            </div>
          ) : records.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="font-bold text-main text-base mb-1">No Medical Records on File</h3>
              <p className="text-xs text-secondary max-w-sm mx-auto">
                Once your attending physician completes your consultation, diagnosis notes and digital prescriptions will appear here.
              </p>
            </div>
          ) : (
            records.map((rec) => {
              const docName = rec.doctorId?.userId?.name || 'Physician';
              const date = rec.appointmentId?.appointmentDate || new Date(rec.createdAt).toISOString().split('T')[0];

              return (
                <div key={rec._id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal/10 text-teal">
                        Consultation Summary
                      </span>
                      <h3 className="text-lg font-bold text-main mt-1">Consultation with Dr. {docName.replace('Dr. ', '')}</h3>
                      <div className="text-xs text-secondary mt-0.5">Date of Examination: {date}</div>
                    </div>
                    <div className="text-xs text-slate-400">Record ID: {rec._id.substring(rec._id.length - 8)}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                      <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Diagnosis</span>
                      <p className="font-semibold text-main text-sm">{rec.diagnosis}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                      <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Reported Symptoms</span>
                      <p className="text-secondary">{rec.symptoms || 'None recorded'}</p>
                    </div>
                  </div>

                  {rec.consultationNotes && (
                    <div className="text-xs">
                      <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Physician Notes</span>
                      <p className="text-secondary leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                        {rec.consultationNotes}
                      </p>
                    </div>
                  )}

                  {rec.prescription && rec.prescription.length > 0 && (
                    <div className="pt-2">
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-xs block mb-2">
                        Prescribed Medication
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {rec.prescription.map((rx, idx) => (
                          <div key={idx} className="bg-primary/5 border border-primary/20 p-3.5 rounded-2xl text-xs space-y-1">
                            <div className="font-bold text-primary text-sm flex items-center justify-between">
                              <span>💊 {rx.medicine}</span>
                              <span className="text-[11px] font-normal text-slate-500">{rx.dosage}</span>
                            </div>
                            <div className="text-secondary flex justify-between">
                              <span>Frequency: {rx.frequency}</span>
                              <span>Duration: {rx.duration}</span>
                            </div>
                            {rx.instructions && (
                              <div className="text-[11px] text-slate-500 italic pt-1 border-t border-primary/10">
                                {rx.instructions}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-secondary">No notifications recorded.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => markAsRead(n._id)}
                className={`p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 rounded-2xl transition-colors ${
                  !n.isRead ? 'bg-primary/5 font-medium' : ''
                }`}
              >
                <div>
                  <div className="font-bold text-main text-sm mb-0.5">{n.title}</div>
                  <p className="text-xs text-secondary leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
                {!n.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5" title="Unread"></span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs max-w-xl">
          <h3 className="text-lg font-bold text-main mb-6">Patient Profile Information</h3>
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Name</span>
              <p className="font-semibold text-main text-sm">{user?.name}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Email</span>
              <p className="font-semibold text-main text-sm">{user?.email}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Phone</span>
              <p className="font-semibold text-main text-sm">{user?.phone || 'Not provided'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Role</span>
              <p className="font-semibold text-teal uppercase text-sm">{user?.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
