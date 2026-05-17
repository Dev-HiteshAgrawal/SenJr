import React, { useState, useMemo } from 'react';
import { ArrowLeft, Video, Calendar, Clock, ChevronRight, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery';
import { useAuthContext } from '../../context/AuthContext';

const tabs = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const Sessions = () => {
  const navigate = useNavigate();
  const { user, userData } = useAuthContext();
  const [activeTab, setActiveTab] = useState('All');

  const role = userData?.role || 'student';
  const roleIdField = role === 'mentor' ? 'mentorId' : 'studentId';
  
  // Choose color based on role
  const themeColor = role === 'mentor' ? 'mentor' : 'primary';
  const themeHex = role === 'mentor' ? '#f97316' : '#10b981'; // orange vs emerald

  const statusConfig = {
    upcoming: { label: 'Upcoming', color: `text-blue-600`, bg: 'bg-blue-50', icon: <AlertCircle className="w-4 h-4" /> },
    completed: { label: 'Completed', color: `text-${themeColor}-600`, bg: `bg-${themeColor}-50`, icon: <CheckCircle2 className="w-4 h-4" /> },
    cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', icon: <XCircle className="w-4 h-4" /> },
  };

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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">

      {/* Header */}
      <header className="bg-white px-5 py-4 sticky top-0 z-50 border-b border-gray-100 shadow-sm rounded-b-3xl">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 flex-1">My Sessions</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar px-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-5 py-2 rounded-xl text-sm font-bold border transition-colors ${
                activeTab === tab
                  ? `bg-${themeColor}-500 text-white border-${themeColor}-500 shadow-sm`
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Stats Row */}
      <div className="flex gap-3 px-5 pt-6 pb-2 overflow-x-auto no-scrollbar">
        <div className="shrink-0 bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm text-center min-w-[90px]">
          <p className={`text-3xl font-black text-${themeColor}-500 mb-1`}>{stats.done}</p>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Done</p>
        </div>
        <div className="shrink-0 bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm text-center min-w-[90px]">
          <p className="text-3xl font-black text-blue-500 mb-1">{stats.upcoming}</p>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Upcoming</p>
        </div>
        <div className="shrink-0 bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm text-center min-w-[90px]">
          <p className="text-3xl font-black text-gray-800 mb-1">
            ₹{stats.spent}
          </p>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{role === 'mentor' ? 'Earned' : 'Spent'}</p>
        </div>
        <div className="shrink-0 bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm text-center min-w-[90px]">
          <p className="text-3xl font-black text-purple-500 mb-1">
            {stats.hours}m
          </p>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Hours</p>
        </div>
      </div>

      <main className="px-5 pt-4 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600 text-sm font-bold shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>Failed to load sessions: {error}</p>
          </div>
        )}

        {loading && (
          <div className={`flex flex-col items-center justify-center py-20 text-center text-${themeColor}-500`}>
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="font-bold text-sm">Loading sessions...</p>
          </div>
        )}

        {!loading && displayed.map((session) => {
          const sc = statusConfig[session.status] || statusConfig.upcoming;
          const isJoinable = session.status === 'upcoming' && session.roomName;
          
          return (
            <div key={session.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              
              {/* Status Accent */}
              <div className={`flex items-center gap-2 px-5 pt-4 pb-3 ${sc.bg}`}>
                <span className={sc.color}>{sc.icon}</span>
                <span className={`text-xs font-bold ${sc.color} uppercase tracking-wider`}>{sc.label}</span>
                {isJoinable && (
                  <span className={`ml-auto bg-${themeColor}-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg animate-pulse shadow-sm`}>
                    READY TO JOIN
                  </span>
                )}
              </div>

              <div className="px-5 pb-5 pt-4">
                <h3 className="font-bold text-gray-900 text-lg mb-4 leading-snug">{session.topic || session.subject || 'Mentorship Session'}</h3>

                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-${themeColor}-600 font-bold text-lg`}>
                    {(role === 'mentor' ? session.studentName : session.mentorName)?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900">
                      {role === 'mentor' ? session.studentName : session.mentorName}
                    </p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">{role === 'mentor' ? 'Student' : 'Mentor'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-5 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 font-semibold">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{session.time}</span>
                  </div>
                  <div className="font-black text-gray-900">₹{session.amount}</div>
                </div>

                {session.status === 'upcoming' && (
                  <div className="flex gap-3">
                    <button
                      disabled={!isJoinable}
                      onClick={() => isJoinable && navigate(`/video-call/${session.roomName}`)}
                      className={`flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        isJoinable
                          ? `bg-${themeColor}-500 text-white active:scale-[0.98] shadow-md`
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      {isJoinable ? 'Join Video Call' : 'Join at time'}
                    </button>
                    <button className="px-5 py-3.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 active:bg-gray-50 hover:bg-gray-50 transition-colors">
                      Reschedule
                    </button>
                  </div>
                )}

                {session.status === 'completed' && role === 'student' && (
                  <button className={`w-full py-3.5 border-2 border-${themeColor}-500 text-${themeColor}-600 rounded-xl text-sm font-bold hover:bg-${themeColor}-50 transition-colors`}>
                    Leave a Review ⭐
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {!loading && !error && displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm px-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
              <Calendar className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-xl font-bold text-gray-900 mb-2">No sessions found</p>
            <p className="text-sm font-medium text-gray-500 mb-6">
              {role === 'mentor' ? "You don't have any sessions in this category yet." : "Book a mentor session to get started on your journey."}
            </p>
            {role === 'student' && (
              <button
                onClick={() => navigate('/find-mentor')}
                className={`bg-${themeColor}-500 text-white px-8 py-3.5 rounded-2xl text-base font-bold shadow-md hover:bg-${themeColor}-600 transition-colors active:scale-[0.98]`}
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
