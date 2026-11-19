import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const returnTo = location.state?.returnTo || location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const response = await login(email, password);
      if (response.success && response.user) {
        if (returnTo) {
          navigate(returnTo, { replace: true });
        } else if (response.user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (response.user.role === 'doctor') {
          navigate('/doctor/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-teal text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-primary/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6v12M6 12h12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-main">Welcome Back</h1>
          <p className="text-xs text-secondary mt-1">Sign in to your MediConnect account</p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-main mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-main mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={isSubmitting}
            className="w-full font-semibold shadow-md shadow-primary/20 mt-2"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Demo Accounts Quick-Fill for Faculty Review */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
            Instant Demo Logins (Faculty &amp; Testing)
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('patient@mediconnect.com', 'Patient@123')}
              className="py-1.5 px-2 rounded-xl border border-slate-200 hover:border-primary text-[11px] font-semibold text-slate-700 hover:text-primary bg-slate-50 transition-colors cursor-pointer text-center"
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('sarah.jenkins@mediconnect.com', 'Doctor@123')}
              className="py-1.5 px-2 rounded-xl border border-slate-200 hover:border-primary text-[11px] font-semibold text-slate-700 hover:text-primary bg-slate-50 transition-colors cursor-pointer text-center"
            >
              Doctor
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin@mediconnect.com', 'Admin@123')}
              className="py-1.5 px-2 rounded-xl border border-slate-200 hover:border-primary text-[11px] font-semibold text-slate-700 hover:text-primary bg-slate-50 transition-colors cursor-pointer text-center"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-secondary">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
