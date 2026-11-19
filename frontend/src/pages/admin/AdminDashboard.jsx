import React, { useState, useEffect } from 'react';
import { adminService, doctorService, appointmentService } from '../../services/api';
import Button from '../../components/ui/Button';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'doctors' | 'patients' | 'appointments'
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  // Add doctor modal state
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    password: 'Doctor@123',
    phone: '',
    specialization: 'General Medicine',
    hospital: '',
    location: 'Central Medical Wing',
    experience: '5',
    consultationFee: '60',
  });
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, docsRes, usersRes, apptsRes] = await Promise.all([
        adminService.getStats(),
        doctorService.getDoctors(),
        adminService.getUsers(),
        appointmentService.getAllAppointments(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (docsRes.success) setDoctors(docsRes.doctors || []);
      if (usersRes.success) setUsers(usersRes.users || []);
      if (apptsRes.success) setAppointments(apptsRes.appointments || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const res = await adminService.updateUserStatus(userId, !currentStatus);
      if (res.success) {
        setActionMsg(res.message);
        setTimeout(() => setActionMsg(''), 4000);
        loadAdminData();
      }
    } catch (err) {
      alert(err.message || 'Failed to update user status.');
    }
  };

  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    setIsAddingDoctor(true);
    try {
      const res = await doctorService.createDoctor({
        ...newDoctor,
        experience: Number(newDoctor.experience),
        consultationFee: Number(newDoctor.consultationFee),
      });

      if (res.success) {
        setActionMsg('New doctor profile created and added to directory.');
        setTimeout(() => setActionMsg(''), 4000);
        setIsAddDoctorOpen(false);
        setNewDoctor({
          name: '',
          email: '',
          password: 'Doctor@123',
          phone: '',
          specialization: 'General Medicine',
          hospital: '',
          location: 'Central Medical Wing',
          experience: '5',
          consultationFee: '60',
        });
        loadAdminData();
      }
    } catch (err) {
      alert(err.message || 'Failed to add doctor.');
    } finally {
      setIsAddingDoctor(false);
    }
  };

  const patientsList = users.filter((u) => u.role === 'patient');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">System Administration</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main mt-0.5">MediConnect Admin Console</h1>
          <p className="text-xs text-secondary mt-0.5">Real-time MongoDB platform metrics, account controls, and directory management.</p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="rounded-xl gap-2 font-semibold shadow-md shadow-primary/20"
          onClick={() => setIsAddDoctorOpen(true)}
        >
          <span>+ Add New Doctor</span>
        </Button>
      </div>

      {actionMsg && (
        <div className="p-3 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          {actionMsg}
        </div>
      )}

      {/* Real-time Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Patients</div>
          <div className="text-2xl font-extrabold text-main mt-1">{stats?.totalPatients ?? 0}</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-teal">Active Doctors</div>
          <div className="text-2xl font-extrabold text-teal mt-1">{stats?.totalDoctors ?? doctors.length}</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-primary">Appointments</div>
          <div className="text-2xl font-extrabold text-primary mt-1">{stats?.totalAppointments ?? appointments.length}</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Completed Visits</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{stats?.completedAppointments ?? 0}</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">Platform Volume</div>
          <div className="text-2xl font-extrabold text-indigo-700 mt-1">${stats?.totalRevenue ?? 0}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 mb-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-main'
          }`}
        >
          System Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('doctors')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'doctors' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-main'
          }`}
        >
          Manage Doctors ({doctors.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('patients')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'patients' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-main'
          }`}
        >
          Manage Patients ({patientsList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'appointments' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-main'
          }`}
        >
          All Appointments ({appointments.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-main text-base mb-4">Platform Health Summary</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-secondary">MongoDB Status:</span>
                <span className="font-bold text-emerald-600">Connected (mediconnect)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-secondary">Pending Consultations:</span>
                <span className="font-bold text-amber-600">{stats?.pendingAppointments ?? 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-secondary">Confirmed Upcoming:</span>
                <span className="font-bold text-teal">{stats?.confirmedAppointments ?? 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-secondary">Cancelled Consultations:</span>
                <span className="font-bold text-rose-600">{stats?.cancelledAppointments ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-main text-base mb-4">Quick Admin Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                size="md"
                className="w-full justify-start text-xs py-2.5"
                onClick={() => setIsAddDoctorOpen(true)}
              >
                ➕ Onboard a New Certified Doctor
              </Button>
              <Button
                variant="outline"
                size="md"
                className="w-full justify-start text-xs py-2.5"
                onClick={() => setActiveTab('doctors')}
              >
                🩺 Review Doctor Specialization Directory
              </Button>
              <Button
                variant="outline"
                size="md"
                className="w-full justify-start text-xs py-2.5"
                onClick={() => setActiveTab('appointments')}
              >
                📅 Audit Real-time Consultation Bookings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Manage Doctors */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Specialization</th>
                  <th className="p-4">Hospital Affiliation</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-main">
                      Dr. {(doc.userId?.name || doc.name || '').replace('Dr. ', '')}
                      <div className="text-[11px] text-slate-400 font-normal">{doc.userId?.email}</div>
                    </td>
                    <td className="p-4 text-secondary">{doc.specialization}</td>
                    <td className="p-4 text-secondary">{doc.hospital}</td>
                    <td className="p-4 font-bold text-teal">${doc.consultationFee}</td>
                    <td className="p-4 text-secondary">{doc.experience} Years</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {doc.isApproved ? 'APPROVED' : 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Manage Patients */}
      {activeTab === 'patients' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patientsList.map((pat) => (
                  <tr key={pat._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-main">{pat.name}</td>
                    <td className="p-4 text-secondary">{pat.email}</td>
                    <td className="p-4 text-secondary">{pat.phone || 'N/A'}</td>
                    <td className="p-4 text-secondary">{new Date(pat.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          pat.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {pat.isActive !== false ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleUserStatus(pat._id, pat.isActive !== false)}
                        className={`text-xs font-semibold hover:underline cursor-pointer ${
                          pat.isActive !== false ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {pat.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: All Appointments */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Date &amp; Time</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-main">{appt.patientId?.name || 'Patient'}</td>
                    <td className="p-4 text-secondary font-medium">
                      Dr. {(appt.doctorId?.userId?.name || 'Specialist').replace('Dr. ', '')}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-main">{appt.appointmentDate}</div>
                      <div className="text-[11px] text-teal">{appt.appointmentTime}</div>
                    </td>
                    <td className="p-4 text-secondary max-w-xs truncate">{appt.reason}</td>
                    <td className="p-4 font-bold text-main">${appt.consultationFee}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          appt.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : appt.status === 'completed'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : appt.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {appt.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add New Doctor Modal */}
      {isAddDoctorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal">Directory Onboarding</span>
                <h3 className="text-xl font-bold text-main">Add Certified Doctor</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDoctorOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddDoctorSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-main mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Alexander Wright"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-main mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="alex.wright@mediconnect.com"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-main mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={newDoctor.password}
                    onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-main mb-1">Specialization</label>
                  <select
                    value={newDoctor.specialization}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-white"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dentistry">Dentistry</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-main mb-1">Hospital</label>
                  <input
                    type="text"
                    required
                    placeholder="Apex Care Hospital"
                    value={newDoctor.hospital}
                    onChange={(e) => setNewDoctor({ ...newDoctor, hospital: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-main mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newDoctor.experience}
                    onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-main mb-1">Consultation Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newDoctor.consultationFee}
                    onChange={(e) => setNewDoctor({ ...newDoctor, consultationFee: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <Button variant="ghost" size="md" onClick={() => setIsAddDoctorOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit" disabled={isAddingDoctor}>
                  {isAddingDoctor ? 'Adding...' : 'Create Doctor Profile'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
