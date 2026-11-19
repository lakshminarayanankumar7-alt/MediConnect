import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

export const DoctorCard = ({ doctor, onBook }) => {
  const name = doctor.userId?.name || doctor.name || 'Medical Specialist';
  const specialization = doctor.specialization || 'General Medicine';
  const hospital = doctor.hospital || 'MediConnect Partner Hospital';
  const experience = doctor.experience || 5;
  const fee = doctor.consultationFee || 50;
  const rating = doctor.rating || 4.8;
  const reviews = doctor.totalReviews || 24;

  // Clean initials avatar
  const initials = name
    .replace('Dr. ', '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-200 group">
      {/* Header with avatar & rating */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-teal/15 text-primary flex items-center justify-center font-bold text-lg border border-primary/20 shrink-0">
            {initials}
          </div>
          <div>
            <h3 className="font-bold text-main text-lg group-hover:text-primary transition-colors leading-snug">
              Dr. {name.replace('Dr. ', '')}
            </h3>
            <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {specialization}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-1 rounded-xl text-amber-700 text-xs font-bold shrink-0">
          <svg className="w-3.5 h-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{rating}</span>
          <span className="text-slate-400 text-[10px] font-normal">({reviews})</span>
        </div>
      </div>

      {/* Info details */}
      <div className="space-y-2 text-xs text-secondary flex-1 mb-5">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="truncate">{hospital}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{experience} years of clinical experience</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Available: {doctor.availableDays?.slice(0, 3).join(', ') || 'Mon-Fri'}</span>
        </div>
      </div>

      {/* Bottom fee & actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Fee</span>
          <span className="text-xl font-bold text-teal">${fee}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/doctors/${doctor._id}`}>
            <Button variant="outline" size="sm" className="rounded-xl px-3 text-xs">
              Profile
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            className="rounded-xl px-4 text-xs font-semibold"
            onClick={() => onBook(doctor)}
          >
            Book
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
