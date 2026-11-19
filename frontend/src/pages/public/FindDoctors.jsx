import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doctorService } from '../../services/api';
import DoctorCard from '../../components/doctors/DoctorCard';
import BookingModal from '../../components/appointments/BookingModal';
import Button from '../../components/ui/Button';

export const FindDoctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSpec = searchParams.get('specialization') || 'All';

  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState(initialSpec);
  const [sortBy, setSortBy] = useState('rating');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  const specialtiesList = [
    'All',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'General Medicine',
    'Dentistry',
    'Ophthalmology',
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const params = {};
        if (selectedSpecialization && selectedSpecialization !== 'All') {
          params.specialization = selectedSpecialization;
        }
        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }

        const response = await doctorService.getDoctors(params);
        if (response.success) {
          let docs = response.doctors || [];

          // Sort in frontend
          if (sortBy === 'rating') {
            docs.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          } else if (sortBy === 'experience') {
            docs.sort((a, b) => (b.experience || 0) - (a.experience || 0));
          } else if (sortBy === 'fee-low') {
            docs.sort((a, b) => (a.consultationFee || 0) - (b.consultationFee || 0));
          } else if (sortBy === 'fee-high') {
            docs.sort((a, b) => (b.consultationFee || 0) - (a.consultationFee || 0));
          }

          setDoctors(docs);
        }
      } catch (err) {
        console.error('Failed to query doctors:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedSpecialization, searchTerm, sortBy]);

  const handleSpecialtyChange = (spec) => {
    setSelectedSpecialization(spec);
    if (spec === 'All') {
      searchParams.delete('specialization');
    } else {
      searchParams.set('specialization', spec);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-teal">Directory</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-main tracking-tight mt-1">
          Find Trusted Healthcare Specialists
        </h1>
        <p className="text-sm text-secondary mt-1">
          Browse certified doctors, view available consultation hours, and schedule real-time appointments.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or clinic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-white cursor-pointer"
            >
              <option value="rating">Sort by: Highest Rating</option>
              <option value="experience">Sort by: Most Experienced</option>
              <option value="fee-low">Fee: Lowest to Highest</option>
              <option value="fee-high">Fee: Highest to Lowest</option>
            </select>
          </div>
        </div>

        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 pr-1">Specialty:</span>
          {specialtiesList.map((spec) => (
            <button
              key={spec}
              type="button"
              onClick={() => handleSpecialtyChange(spec)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSpecialization === spec
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 animate-pulse h-64"></div>
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-main mb-1">No Doctors Found</h3>
          <p className="text-xs text-secondary max-w-sm mx-auto mb-4">
            We couldn't find any certified doctors matching your filter criteria. Try clearing filters or searching another medical specialty.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedSpecialization('All');
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <DoctorCard
              key={doc._id}
              doctor={doc}
              onBook={(doctor) => setSelectedDoctorForBooking(doctor)}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        doctor={selectedDoctorForBooking}
        isOpen={!!selectedDoctorForBooking}
        onClose={() => setSelectedDoctorForBooking(null)}
      />
    </div>
  );
};

export default FindDoctors;
