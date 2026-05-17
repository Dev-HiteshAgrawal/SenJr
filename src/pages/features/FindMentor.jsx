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
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 flex flex-col pb-20">
      
      {/* Header */}
      <header className="bg-white px-4 pt-4 pb-3 sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1">Find a Mentor</h1>
          <button className="p-2 bg-gray-50 rounded-xl border border-gray-200">
            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, exam, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#10b981]"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 space-y-4">

        {/* Subject Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
          {subjectsList.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                activeSubject === s
                  ? 'bg-[#10b981] text-white border-[#10b981]'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Sort & Count Row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">
            {loading ? 'Searching...' : `${filtered.length} mentors found`}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-bold text-[#10b981] bg-transparent border-none outline-none"
          >
            <option value="rating">Sort: Top Rated</option>
            <option value="price">Sort: Lowest Price</option>
            <option value="sessions">Sort: Most Sessions</option>
          </select>
        </div>

        {/* Status Indicators */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-600 text-sm font-bold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>Failed to load mentors: {error}</p>
          </div>
        )}

        {loading && !error && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-[#10b981]">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="font-bold text-sm">Loading verified mentors...</p>
          </div>
        )}

        {/* Mentor Cards */}
        {!loading && !error && (
          <div className="space-y-3">
            {filtered.map((mentor) => (
              <button
                key={mentor.id}
                onClick={() => navigate(`/profile/mentor/${mentor.id}`)}
                className="w-full bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-left active:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200">
                      <img src={mentor.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.displayName || 'M')}&background=ECFDF5&color=10b981`} alt={mentor.displayName} className="w-full h-full object-cover" />
                    </div>
                    {mentor.verificationStatus === 'verified' && (
                      <div className="absolute -bottom-1 -right-1 bg-[#10b981] rounded-full p-0.5 border-2 border-white">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-bold text-gray-900 text-sm">{mentor.displayName || 'Anonymous Mentor'}</h3>
                      {mentor.badge && (
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white shrink-0 ml-2"
                          style={{ backgroundColor: mentor.badgeColor || '#f97316' }}
                        >
                          {mentor.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-medium mb-1 truncate">{mentor.bio || mentor.college || 'Mentor'}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-[10px] text-gray-400">{mentor.city ? `${mentor.city}, ${mentor.state}` : 'India'}</span>
                    </div>

                    {/* Expertise Pills */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(mentor.subjects || []).slice(0, 3).map((tag) => (
                        <span key={tag} className="bg-[#ECFDF5] text-[#10b981] text-[9px] font-bold px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-bold text-gray-800">{mentor.rating || '5.0'}</span>
                          <span className="text-[10px] text-gray-400">({mentor.reviewsCount || 0})</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{mentor.sessionsCompleted || 0} sessions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-black text-[#10b981]">₹{mentor.hourlyRate || 0}</span>
                        <span className="text-[10px] text-gray-400">/hr</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-300 mt-1 shrink-0" />
                </div>

                {/* Book Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/book/${mentor.id}`); }}
                  className="mt-3 w-full bg-[#10b981] text-white py-2.5 rounded-xl text-xs font-bold active:bg-emerald-600 transition-colors shadow-sm"
                >
                  Book Session • ₹{mentor.hourlyRate || 0}/hr
                </button>
              </button>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-gray-300" />
            </div>
            <p className="font-bold text-gray-800">No mentors found</p>
            <p className="text-sm text-gray-500 mt-1">Try a different search or subject filter</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default FindMentor;