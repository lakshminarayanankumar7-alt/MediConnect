import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('patient'); // 'patient' | 'doctor'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: 'General Medicine',
    hospital: '',
    experience: '5',
    consultationFee: '50',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const specialtiesList = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dentistry',
    'Ophthalmology',
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        role,
        experience: Number(formData.experience),
        consultationFee: Number(formData.consultationFee),
      };

      const response = await register(payload);
      if (response.success && response.user) {
        if (response.user.role === 'doctor') {
          navigate('/doctor/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-teal text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-primary/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6v12M6 12h12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-main">Create an Account</h1>
          <p className="text-xs text-secondary mt-1">Join the MediConnect Healthcare System</p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              role === 'patient'
                ? 'bg-white text-primary shadow-xs'
                : 'text-slate-600 hover:text-main'
            }`}
          >
            Register as Patient
          </button>
          <button
            type="button"
            onClick={() => setRole('doctor')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              role === 'doctor'
                ? 'bg-white text-teal shadow-xs'
                : 'text-slate-600 hover:text-main'
            }`}
          >
            Register as Doctor
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-main mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder={role === 'doctor' ? 'Dr. Jane Smith' : 'Alex Johnson'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-main mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-main mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555-0123"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-main mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength="6"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Additional fields for Doctor role */}
          {role === 'doctor' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal block">
                Professional Credentials
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-main mb-1">Specialization</label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal focus:outline-none bg-white cursor-pointer"
                  >
                    {specialtiesList.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-main mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    name="hospital"
                    required
                    value={formData.hospital}
                    onChange={handleChange}
                    placeholder="e.g. City General Hospital"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-main mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    name="experience"
                    min="0"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-main mb-1">Consultation Fee ($)</label>
                  <input
                    type="number"
                    name="consultationFee"
                    min="0"
                    required
                    value={formData.consultationFee}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={isSubmitting}
            className="w-full font-semibold shadow-md shadow-primary/20 mt-3"
          >
            {isSubmitting ? 'Creating Account...' : `Register as ${role === 'doctor' ? 'Doctor' : 'Patient'}`}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-secondary">
          Already registered?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
