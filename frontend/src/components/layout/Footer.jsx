import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkApiHealth, checkDatabaseHealth } from '../../services/api';

export const Footer = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [dbStatus, setDbStatus] = useState('checking');

  useEffect(() => {
    let isMounted = true;

    const verifySystemHealth = async () => {
      const apiResult = await checkApiHealth();
      if (!isMounted) return;

      if (apiResult.isConnected) {
        setBackendStatus('connected');
        const dbResult = await checkDatabaseHealth();
        if (isMounted) {
          setDbStatus(dbResult.isConnected ? 'connected' : 'disconnected');
        }
      } else {
        setBackendStatus('offline');
        setDbStatus('disconnected');
      }
    };

    verifySystemHealth();
    const interval = setInterval(verifySystemHealth, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-teal text-white flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 6v12M6 12h12" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Medi<span className="text-primary">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Full-Stack Healthcare Appointment &amp; Management System powered by React 19, Node.js, Express 5, and MongoDB Atlas.
            </p>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/doctors" className="hover:text-cyan-400 transition-colors">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-cyan-400 transition-colors">
                  Book Consultations
                </Link>
              </li>
              <li>
                <a href="/#about" className="hover:text-cyan-400 transition-colors">
                  About MediConnect
                </a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-cyan-400 transition-colors">
                  Help &amp; Support
                </a>
              </li>
            </ul>
          </div>

          {/* System Status Indicators */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">System Status</h4>
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/15 border border-teal/30 text-teal-300 text-xs font-semibold self-start">
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse"></span>
                <span>MERN Full-Stack Active</span>
              </div>

              {/* Live Backend & Database Monitor */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border self-start transition-colors ${
                  backendStatus === 'connected' && dbStatus === 'connected'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : backendStatus === 'connected'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendStatus === 'connected' && dbStatus === 'connected'
                      ? 'bg-emerald-400 animate-pulse'
                      : backendStatus === 'connected'
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`}
                ></span>
                <span>
                  {backendStatus === 'connected' && dbStatus === 'connected' && 'MongoDB Atlas Connected'}
                  {backendStatus === 'connected' && dbStatus !== 'connected' && 'Backend Connected (DB Pending)'}
                  {backendStatus === 'offline' && 'Backend Offline'}
                  {backendStatus === 'checking' && 'Checking Cluster Status...'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Restricted IP access. Secure JWT authentication &amp; role-based access control.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} MediConnect. Built for FSWD Academic Demonstration. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">REST API v1.0</span>
            <span>•</span>
            <span className="text-slate-400">MongoDB Atlas DB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
