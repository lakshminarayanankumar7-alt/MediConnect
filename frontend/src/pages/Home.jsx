import React from 'react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';

function Home({ onNotice }) {
  const handleFeatureClick = (feature) => {
    onNotice(`"${feature}" is currently a visual placeholder and will be implemented in later phases.`);
  };

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-bg-light via-white to-white pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary-hover text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse"></span>
            <span>MediConnect Healthcare System</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-main tracking-tight leading-tight md:leading-none mb-6">
            Your Health,{' '}
            <span className="bg-gradient-to-r from-primary via-teal to-primary bg-clip-text text-transparent">
              Our Priority
            </span>
          </h1>

          {/* Hero Description */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-secondary leading-relaxed mb-10">
            MediConnect is a modern healthcare appointment and management platform designed to connect patients with certified medical specialists quickly and securely. Experience hassle-free consultation scheduling and centralized digital health management.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-md shadow-primary/20"
              onClick={() => handleFeatureClick('Find a Doctor')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Find a Doctor</span>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => handleFeatureClick('Book Appointment')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Book Appointment</span>
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="pt-2 sm:pt-0">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">Verified Specialists</div>
            </div>
            <div className="pt-4 sm:pt-0">
              <div className="text-2xl font-bold text-teal">24/7</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">Appointment Access</div>
            </div>
            <div className="pt-4 sm:pt-0">
              <div className="text-2xl font-bold text-cyan-600">100%</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">Secure Records</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal block mb-2">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-main tracking-tight mb-4">
            Designed for Seamless Healthcare Management
          </h2>
          <p className="text-base text-secondary">
            Explore the foundational pillars of the MediConnect platform built to deliver an optimal experience for patients and doctors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <Card
            interactive
            onClick={() => handleFeatureClick('Find Trusted Doctors')}
            className="p-8"
          >
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <CardTitle className="text-xl">1. Find Trusted Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Search and filter certified medical practitioners by specialty, experience, and patient ratings. Verified profiles guarantee high-standard care.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Phase 2: Doctor Catalog
              </span>
            </CardFooter>
          </Card>

          {/* Card 2 */}
          <Card
            interactive
            onClick={() => handleFeatureClick('Easy Appointment Booking')}
            className="p-8"
          >
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-teal/10 text-teal flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <polyline points="9 16 11 18 15 14"></polyline>
                </svg>
              </div>
              <CardTitle className="text-xl">2. Easy Appointment Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Effortlessly browse available time slots in real time. Reserve consultations, receive instant confirmations, and manage schedules with zero waiting time.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Phase 3: Booking Engine
              </span>
            </CardFooter>
          </Card>

          {/* Card 3 */}
          <Card
            interactive
            onClick={() => handleFeatureClick('Secure Health Records')}
            className="p-8"
          >
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="M9 12l2 2 4-4"></path>
                </svg>
              </div>
              <CardTitle className="text-xl">3. Secure Health Records</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Centralize digital prescriptions, consultation summaries, and medical history with encrypted patient privacy compliance and instant access.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Phase 4: Medical Records
              </span>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default Home;
