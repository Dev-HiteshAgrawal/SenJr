import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, SlidersHorizontal, Star, CheckCircle, MapPin, ChevronRight, Mic, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery';
import { useAuthContext } from '../../context/AuthContext';

const subjectsList = ['All', 'UP Police', 'SSC CGL', 'Banking', 'CAT', 'BBA', 'UPSC', 'JEE', 'NEET'];

const FindMentor = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [search, setSearch] = useState('');
  const [activeSubject, setActiveSubject] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  // Fetch only verified mentors, excluding the current user if they are a mentor
  const queryOptions = useMemo(() => {
    const filters = [
      ['role', '==', 'mentor'],
      ['verificationStatus', '==', 'verified']
    ];
    return { filters, limitCount: 100 };
  }, []);

  const { data: mentors, loading, error } = useFirestoreQuery('users', queryOptions);

  // Filter out current user and apply local search/sort
  const filtered = useMemo(() => {
    if (!mentors) return [];
    
    return mentors.filter(m => {
      // Exclude self
      if (user && m.id === user.uid) return false;

      const matchSearch = !search ||
        (m.displayName || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.bio || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.subjects || []).some(e => e.toLowerCase().includes(search.toLowerCase()));
        
      const matchSubject = activeSubject === 'All' || (m.subjects || []).includes(activeSubject);
      
      return matchSearch && matchSubject;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price') return (a.hourlyRate || 0) - (b.hourlyRate || 0);
      if (sortBy === 'sessions') return (b.sessionsCompleted || 0) - (a.sessionsCompleted || 0);
      return 0;
    });
  }, [mentors, search, activeSubject, sortBy, user]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col pb-20">
      
      {/* Header */}
      <header className="bg-white px-5 pt-4 pb-3 sticky top-0 z-50 border-b border-gray-100 shadow-sm rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 flex-1">Find a Mentor</h1>
          <button className="p-2.5 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl border border-gray-200">
            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, exam, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 border-none rounded-2xl pl-10 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium placeholder-gray-500 transition-all"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors">
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-5 pt-5 space-y-5">

        {/* Subject Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 no-scrollbar">
          {subjectsList.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                activeSubject === s
                  ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Sort & Count Row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {loading ? 'Searching...' : `${filtered.length} Mentors`}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-bold text-primary-600 bg-primary-50 py-1.5 px-2 rounded-lg border-none outline-none appearance-none pr-8 relative cursor-pointer hover:bg-primary-100 transition-colors"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1em 1em',
            }}
          >
            <option value="rating">Top Rated</option>
            <option value="price">Lowest Price</option>
            <option value="sessions">Most Sessions</option>
          </select>
        </div>

        {/* Status Indicators */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600 text-sm font-bold shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>Failed to load mentors: {error}</p>
          </div>
        )}

        {loading && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-primary-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="font-bold text-sm">Loading verified mentors...</p>
          </div>
        )}

        {/* Mentor Cards */}
        {!loading && !error && (
          <div className="space-y-4">
            {filtered.map((mentor) => (
              <div
                key={mentor.id}
                onClick={() => navigate(`/profile/mentor/${mentor.id}`)}
                className="w-full bg-white rounded-3xl p-5 border border-gray-100 shadow-sm cursor-pointer hover:border-primary-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border-2 border-white shadow-sm">
                      <img src={mentor.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.displayName || 'M')}&background=ECFDF5&color=10b981`} alt={mentor.displayName} className="w-full h-full object-cover" />
                    </div>
                    {mentor.verificationStatus === 'verified' && (
                      <div className="absolute -bottom-1 -right-1 bg-primary-500 rounded-full p-0.5 border-2 border-white shadow-sm">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-900 text-base truncate pr-2">{mentor.displayName || 'Anonymous Mentor'}</h3>
                      {mentor.badge && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0 shadow-sm uppercase tracking-wide"
                          style={{ backgroundColor: mentor.badgeColor || '#f97316' }}
                        >
                          {mentor.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-medium mb-1.5 truncate pr-4">{mentor.bio || mentor.college || 'Expert Mentor'}</p>
                    
                    {/* Stats Row inline */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-gray-800">{mentor.rating || '5.0'}</span>
                        <span className="text-[10px] text-gray-400">({mentor.reviewsCount || 0})</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[10px] font-medium text-gray-500">{mentor.city ? `${mentor.city}, ${mentor.state}` : 'India'}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-300 mt-1 shrink-0 group-hover:text-primary-400 transition-colors" />
                </div>

                {/* Expertise Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4 pl-[80px]">
                  {(mentor.subjects || []).slice(0, 3).map((tag) => (
                    <span key={tag} className="bg-primary-50 text-primary-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Book Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/book/${mentor.id}`); }}
                  className="w-full py-3.5 bg-primary-500 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-500/20 active:scale-[0.98] hover:bg-primary-600 transition-all flex justify-between px-6 items-center"
                >
                  <span>Book Session</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-md text-xs">₹{mentor.hourlyRate || 0}/hr</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm px-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-xl font-bold text-gray-900 mb-2">No mentors found</p>
            <p className="text-sm font-medium text-gray-500">Try adjusting your filters or search query</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default FindMentor;