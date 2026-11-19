import React, { useState } from 'react';
import Button from './ui/Button';

function Navbar({ onNotice }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (e, featureName) => {
    e.preventDefault();
    if (featureName === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNotice(`${featureName} feature will be available in upcoming phases.`);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, 'Home')}
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal text-white flex items-center justify-center shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 6v12M6 12h12" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-main leading-tight">
                Medi<span className="text-primary">Connect</span>
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal">
                Healthcare Portal
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, 'Home')}
              className="text-sm font-semibold text-primary border-b-2 border-primary py-1 transition-colors"
            >
              Home
            </a>
            <a
              href="#find-doctors"
              onClick={(e) => handleNavClick(e, 'Find Doctors')}
              className="text-sm font-medium text-secondary hover:text-primary py-1 transition-colors"
            >
              Find Doctors
            </a>
            <a
              href="#appointments"
              onClick={(e) => handleNavClick(e, 'Appointments')}
              className="text-sm font-medium text-secondary hover:text-primary py-1 transition-colors"
            >
              Appointments
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleNavClick(e, 'Login')}
              className="rounded-full px-5"
            >
              Login
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-secondary hover:text-main hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-slide-down">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, 'Home')}
            className="block px-3 py-2 rounded-md text-base font-semibold text-primary bg-primary/10"
          >
            Home
          </a>
          <a
            href="#find-doctors"
            onClick={(e) => handleNavClick(e, 'Find Doctors')}
            className="block px-3 py-2 rounded-md text-base font-medium text-secondary hover:text-primary hover:bg-slate-50"
          >
            Find Doctors
          </a>
          <a
            href="#appointments"
            onClick={(e) => handleNavClick(e, 'Appointments')}
            className="block px-3 py-2 rounded-md text-base font-medium text-secondary hover:text-primary hover:bg-slate-50"
          >
            Appointments
          </a>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={(e) => handleNavClick(e, 'Login')}
              className="w-full"
            >
              Login
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
