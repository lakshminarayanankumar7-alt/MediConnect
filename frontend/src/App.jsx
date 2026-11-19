import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  const [noticeMessage, setNoticeMessage] = useState('');

  const showNotice = (msg) => {
    setNoticeMessage(msg);
    setTimeout(() => {
      setNoticeMessage((current) => (current === msg ? '' : current));
    }, 4500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-main font-sans antialiased">
      {/* Non-blocking Notice Banner */}
      {noticeMessage && (
        <aside
          className="sticky top-0 z-50 bg-primary-hover text-white px-4 py-2.5 shadow-md animate-slide-down flex items-center justify-between"
          role="alert"
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-sm font-medium">
              <svg
                className="w-5 h-5 shrink-0 text-cyan-200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>{noticeMessage}</span>
            </div>
            <button
              type="button"
              className="text-white/80 hover:text-white p-1 rounded-md text-xl leading-none transition-colors cursor-pointer"
              onClick={() => setNoticeMessage('')}
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        </aside>
      )}

      <Navbar onNotice={showNotice} />
      <div className="flex-1">
        <Home onNotice={showNotice} />
      </div>
      <Footer onNotice={showNotice} />
    </div>
  );
}

export default App;
