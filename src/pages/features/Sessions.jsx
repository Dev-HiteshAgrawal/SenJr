import React, { useState, useMemo } from 'react';
import { ArrowLeft, Video, Calendar, Clock, ChevronRight, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery';
import { useAuthContext } from '../../context/AuthContext';

const statusConfig = {
  upcoming: { label: 'Upcoming', color: 'text-blue-700', bg: 'bg-blue-50', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  completed: { label: 'Completed', color: 'text-green-700', bg: 'bg-green-50', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', icon: <XCircle className="w-3.5 h-3.5" /> },
};

const tabs = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const Sessions = () => {
  const navigate = useNavigate();
  const { user, userData } = useAuthContext();
  const [activeTab, setActiveTab] = useState('All');

  const role = userData?.role || 'student';
  const roleIdField = role === 'mentor' ? 'mentorId' : 'studentId';

  const queryOptions = useMemo(() => {
    return {
      filters: user ? [[roleIdField, '==', user.uid]] : [],
      sort: ['date', 'desc'],
      enabled: !!user
    };
  }, [user, roleIdField]);

  const { data: sessions, loading, error } = useFirestoreQuery('sessions', queryOptions);

  const displayed = useMemo(() => {
    if (!sessions) return [];
    if (activeTab === 'All') return sessions;
    return sessions.filter(s => (s.status || '').toLowerCase() === activeTab.toLowerCase());
  }, [sessions, activeTab]);

  const stats = useMemo(() => {
    if (!sessions) return { done: 0, upcoming: 0, spent: 0, hours: 0 };
    return sessions.reduce((acc, s) => {
      if (s.status === 'completed') {
        acc.done += 1;
        acc.spent += s.amount || 0;
        acc.hours += s.duration || 0;
      } else if (s.status === 'upcoming') {
        acc.upcoming += 1;
      }
      return acc;
    }, { done: 0, upcoming: 0, spent: 0, hours: 0 });
  }, [sessions]);

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 pb-24">

      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1">My Sessions</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                activeTab === tab
                  ? 'bg-[#10b981] text-white border-[#10b981]'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Stats Row */}
      <div className="flex gap-3 px-4 pt-4 pb-2 overflow-x-auto no-scrollbar">
        <div className="shrink-0 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm text-center min-w-[80px]">
          <p className="text-2xl font-black text-[#10b981]">{stats.done}</p>
          <p className="text-[10px] text-gray-500 font-medium">Done</p>
        </div>
        <div className="shrink-0 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm text-center min-w-[80px]">
          <p className="text-2xl font-black text-blue-600">{stats.upcoming}</p>
          <p className="text-[10px] text-gray-500 font-medium">Upcoming</p>
        </div>
        <div className="shrink-0 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm text-center min-w-[80px]">
          <p className="text-2xl font-black text-gray-800">
            ₹{stats.spent}
          </p>
          <p className="text-[10px] text-gray-500 font-medium">{role === 'mentor' ? 'Earned' : 'Spent'}</p>
        </div>
        <div className="shrink-0 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm text-center min-w-[80px]">
          <p className="text-2xl font-black text-[#f97316]">
            {stats.hours}m
          </p>
          <p className="text-[10px] text-gray-500 font-medium">Hours</p>
        </div>
      </div>

      <main className="px-4 pt-2 space-y-3">
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-600 text-sm font-bold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>Failed to load sessions: {error}</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-[#10b981]">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="font-bold text-sm">Loading sessions...</p>
          </div>
        )}

        {!loading && displayed.map((session) => {
          const sc = statusConfig[session.status] || statusConfig.upcoming;
          // Simple logic to determine if within 15 mins of start time
          const isJoinable = session.status === 'upcoming' && session.roomName; // Fallback naive check for now
          
          return (
            <div key={session.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              
              {/* Status Accent */}
              <div className={`flex items-center gap-1.5 px-4 pt-3 pb-2 ${sc.bg}`}>
                <span className={sc.color}>{sc.icon}</span>
                <span className={`text-[10px] font-bold ${sc.color} uppercase tracking-wider`}>{sc.label}</span>
                {isJoinable && (
                  <span className="ml-auto bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                    READY
                  </span>
                )}
              </div>

              <div className="px-4 pb-4 pt-2">
                <h3 className="font-bold text-gray-900 text-sm mb-3 leading-snug">{session.topic || session.subject || 'Mentorship Session'}</h3>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-[#10b981] font-bold">
                    {(role === 'mentor' ? session.studentName : session.mentorName)?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      {role === 'mentor' ? session.studentName : session.mentorName}
                    </p>
                    <p className="text-[10px] text-gray-400">{role === 'mentor' ? 'Student' : 'Mentor'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{session.time} • {session.duration}min</span>
                  </div>
                  <div className="ml-auto font-bold text-gray-800 text-sm">₹{session.amount}</div>
                </div>

                {session.status === 'upcoming' && (
                  <div className="flex gap-2">
                    <button
                      disabled={!isJoinable}
                      onClick={() => isJoinable && navigate(`/video-call/${session.roomName}`)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                        isJoinable
                          ? 'bg-[#10b981] text-white active:bg-emerald-600 shadow-sm'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      {isJoinable ? 'Join Now' : 'Join at time'}
                    </button>
                    <button className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 active:bg-gray-50">
                      Reschedule
                    </button>
                  </div>
                )}

                {session.status === 'completed' && role === 'student' && (
                  <button className="w-full py-2.5 border border-[#10b981] text-[#10b981] rounded-xl text-xs font-bold active:bg-green-50 transition-colors">
                    Leave a Review ⭐
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {!loading && !error && displayed.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-gray-300" />
            </div>
            <p className="font-bold text-gray-800">No sessions yet</p>
            <p className="text-sm text-gray-500 mt-1">
              {role === 'mentor' ? 'No students have booked you yet' : 'Book a mentor session to get started'}
            </p>
            {role === 'student' && (
              <button
                onClick={() => navigate('/find-mentor')}
                className="mt-4 bg-[#10b981] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm"
              >
                Find a Mentor
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Sessions;
