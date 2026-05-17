import React, { useState } from 'react';
import { ArrowLeft, Video, Calendar, Clock, User, ChevronRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sessionsData = [
  {
    id: 1,
    mentor: 'Rahul Sharma',
    mentorAvatar: 'https://i.pravatar.cc/100?img=11',
    subject: 'UP Police Prep – General Awareness',
    date: 'Today',
    time: '4:00 PM',
    duration: 60,
    status: 'upcoming',
    price: 200,
    joinable: true,
  },
  {
    id: 2,
    mentor: 'Priya Verma',
    mentorAvatar: 'https://i.pravatar.cc/100?img=47',
    subject: 'SSC CGL – Quantitative Aptitude',
    date: 'Tomorrow',
    time: '11:00 AM',
    duration: 45,
    status: 'upcoming',
    price: 250,
    joinable: false,
  },
  {
    id: 3,
    mentor: 'Amit Kumar',
    mentorAvatar: 'https://i.pravatar.cc/100?img=12',
    subject: 'CAT – Data Interpretation',
    date: 'May 15',
    time: '6:00 PM',
    duration: 60,
    status: 'completed',
    price: 400,
    joinable: false,
  },
  {
    id: 4,
    mentor: 'Sneha Patel',
    mentorAvatar: 'https://i.pravatar.cc/100?img=45',
    subject: 'Banking – English Grammar',
    date: 'May 12',
    time: '9:00 AM',
    duration: 30,
    status: 'cancelled',
    price: 180,
    joinable: false,
  },
];

const statusConfig = {
  upcoming: { label: 'Upcoming', color: 'text-blue-700', bg: 'bg-blue-50', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  completed: { label: 'Completed', color: 'text-green-700', bg: 'bg-green-50', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', icon: <XCircle className="w-3.5 h-3.5" /> },
};

const tabs = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const Sessions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const displayed = activeTab === 'All'
    ? sessionsData
    : sessionsData.filter(s => s.status === activeTab.toLowerCase());

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
          <p className="text-2xl font-black text-[#10b981]">{sessionsData.filter(s => s.status === 'completed').length}</p>
          <p className="text-[10px] text-gray-500 font-medium">Done</p>
        </div>
        <div className="shrink-0 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm text-center min-w-[80px]">
          <p className="text-2xl font-black text-blue-600">{sessionsData.filter(s => s.status === 'upcoming').length}</p>
          <p className="text-[10px] text-gray-500 font-medium">Upcoming</p>
        </div>
        <div className="shrink-0 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm text-center min-w-[80px]">
          <p className="text-2xl font-black text-gray-800">
            ₹{sessionsData.reduce((acc, s) => s.status === 'completed' ? acc + s.price : acc, 0)}
          </p>
          <p className="text-[10px] text-gray-500 font-medium">Spent</p>
        </div>
        <div className="shrink-0 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm text-center min-w-[80px]">
          <p className="text-2xl font-black text-[#f97316]">
            {sessionsData.reduce((acc, s) => s.status === 'completed' ? acc + s.duration : acc, 0)}m
          </p>
          <p className="text-[10px] text-gray-500 font-medium">Hours</p>
        </div>
      </div>

      <main className="px-4 pt-2 space-y-3">
        {displayed.map((session) => {
          const sc = statusConfig[session.status];
          return (
            <div key={session.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              
              {/* Status Accent */}
              <div className={`flex items-center gap-1.5 px-4 pt-3 pb-2 ${sc.bg}`}>
                <span className={sc.color}>{sc.icon}</span>
                <span className={`text-[10px] font-bold ${sc.color} uppercase tracking-wider`}>{sc.label}</span>
                {session.joinable && (
                  <span className="ml-auto bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                    LIVE IN 15 MIN
                  </span>
                )}
              </div>

              <div className="px-4 pb-4 pt-2">
                <h3 className="font-bold text-gray-900 text-sm mb-3 leading-snug">{session.subject}</h3>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img src={session.mentorAvatar} alt={session.mentor} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{session.mentor}</p>
                    <p className="text-[10px] text-gray-400">Mentor</p>
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
                  <div className="ml-auto font-bold text-gray-800 text-sm">₹{session.price}</div>
                </div>

                {session.status === 'upcoming' && (
                  <div className="flex gap-2">
                    <button
                      disabled={!session.joinable}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                        session.joinable
                          ? 'bg-[#10b981] text-white active:bg-emerald-600'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      {session.joinable ? 'Join Now' : 'Join at time'}
                    </button>
                    <button className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600">
                      Reschedule
                    </button>
                  </div>
                )}

                {session.status === 'completed' && (
                  <button className="w-full py-2.5 border border-[#10b981] text-[#10b981] rounded-xl text-xs font-bold">
                    Leave a Review ⭐
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {displayed.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-gray-300" />
            </div>
            <p className="font-bold text-gray-800">No sessions yet</p>
            <p className="text-sm text-gray-500 mt-1">Book a mentor session to get started</p>
            <button
              onClick={() => navigate('/find-mentor')}
              className="mt-4 bg-[#10b981] text-white px-6 py-2.5 rounded-xl text-sm font-bold"
            >
              Find a Mentor
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Sessions;
