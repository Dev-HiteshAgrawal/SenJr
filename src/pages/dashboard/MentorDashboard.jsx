import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Calendar, User, Star, BarChart2, ArrowRight, Home, IndianRupee, Loader2 } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery';
import { calculateLevel } from '../../utils/gamification';
import BottomNav from '../../components/common/BottomNav';

const MentorDashboard = () => {
  const navigate = useNavigate();
  const { user, userData, loading: authLoading } = useAuthContext();

  const sessionOpts = useMemo(() => ({
    filters: [['mentorId', '==', user?.uid || '']],
    sort: ['date', 'asc'],
    enabled: !!user?.uid
  }), [user?.uid]);

  const { data: sessions, loading: sessionsLoading } = useFirestoreQuery('sessions', sessionOpts);

  const stats = useMemo(() => {
    if (!sessions) return { totalSessions: 0, uniqueStudents: 0, todaysCount: 0, upcoming: [], completed: [] };
    const students = new Set();
    let todaysCount = 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const upcoming = [];
    const completed = [];

    sessions.forEach(s => {
      if (s.studentId) students.add(s.studentId);
      if (s.date === todayStr) todaysCount++;
      if (s.status === 'upcoming') upcoming.push(s);
      if (s.status === 'completed') completed.push(s);
    });

    return {
      totalSessions: sessions.filter(s => s.status === 'completed').length,
      uniqueStudents: students.size,
      todaysCount,
      upcoming: upcoming.slice(0, 3),
      completed: completed.slice(0, 3)
    };
  }, [sessions]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-mentor-500" /></div>;
  }

  const mentorName = userData?.displayName || 'Mentor';
  const earningsThisMonth = userData?.earningsThisMonth || 0;
  const rating = userData?.rating || '5.0';
  const totalEarnings = userData?.totalEarnings || 0;

  const navItems = [
    { label: 'Home', icon: Home, path: '/dashboard/mentor' },
    { label: 'Schedule', icon: Calendar, path: '/mentor/availability' },
    { label: 'Earnings', icon: Wallet, path: '/mentor/earnings' },
    { label: 'Profile', icon: User, path: '/profile/mentor/me' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-5 border-b border-gray-100 shadow-sm rounded-b-3xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Welcome back,<br/>{mentorName.split(' ')[0]}! 🎓
            </h2>
            <p className="text-gray-500 text-sm font-medium mt-1">
              {sessionsLoading ? 'Loading schedule...' : `You have ${stats.todaysCount} sessions today`}
            </p>
          </div>
          <div className="bg-mentor-50 px-3 py-1.5 rounded-full">
            <span className="text-xs font-bold text-mentor-600 block text-center">Level {calculateLevel(userData?.xp || 0)}<br/>Mentor</span>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-2xl py-3 flex flex-col items-center justify-center border border-gray-100">
            <span className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Sessions</span>
            <span className="text-xl font-black text-blue-500">{stats.totalSessions}</span>
          </div>
          <div className="bg-gray-50 rounded-2xl py-3 flex flex-col items-center justify-center border border-gray-100">
            <span className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Students</span>
            <span className="text-xl font-black text-mentor-500">{stats.uniqueStudents}</span>
          </div>
          <div className="bg-gray-50 rounded-2xl py-3 flex flex-col items-center justify-center border border-gray-100">
            <span className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Rating</span>
            <div className="flex items-center gap-1">
              <span className="text-xl font-black text-gray-900">{rating}</span>
              <span className="text-sm text-yellow-400">★</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 px-5 pt-6 space-y-6">
        
        {/* Earnings Section */}
        <div className="bg-gradient-to-br from-mentor-500 to-mentor-600 rounded-3xl p-6 relative overflow-hidden shadow-lg shadow-mentor-500/20 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-white/90">This Month</h3>
            </div>
            <button onClick={() => navigate('/mentor/earnings')} className="text-xs font-bold text-white flex items-center gap-1 hover:bg-white/10 px-2 py-1 rounded-lg transition-colors">
              Details <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="text-4xl font-black mb-6 relative z-10">₹{earningsThisMonth}</div>
          
          <button onClick={() => navigate('/mentor/earnings')} className="w-full bg-white text-mentor-600 font-bold py-3.5 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all relative z-10">
            Withdraw to UPI
          </button>
        </div>

        {/* Schedule */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Today's Schedule</h3>
            <button onClick={() => navigate('/sessions')} className="text-xs font-bold text-mentor-600 flex items-center gap-1">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {sessionsLoading && <div className="text-center text-gray-500 py-6 bg-white rounded-2xl border border-gray-100"><Loader2 className="w-6 h-6 animate-spin mx-auto text-mentor-500" /></div>}
            
            {!sessionsLoading && stats.upcoming.length === 0 && stats.completed.length === 0 && (
              <div className="text-center text-gray-500 py-8 bg-white rounded-2xl border border-gray-100">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="font-medium">No sessions scheduled for today</p>
              </div>
            )}

            {/* Upcoming Sessions */}
            {stats.upcoming.map(session => (
              <div key={session.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between border-l-4 border-l-mentor-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-mentor-50 flex items-center justify-center text-sm font-bold text-mentor-600">
                    {(session.studentName || 'U')[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{session.studentName}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{session.time} • {session.subject || 'Session'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md text-[10px] font-bold">Upcoming</span>
                  <button onClick={() => navigate(`/video-call/${session.roomName || session.id}`)} className="bg-mentor-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-mentor-600 transition-colors">
                    Start Call
                  </button>
                </div>
              </div>
            ))}

            {/* Completed Sessions */}
            {stats.completed.map(session => (
              <div key={session.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3 opacity-60">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                    {(session.studentName || 'U')[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{session.studentName}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{session.time} • {session.subject || 'Session'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-gray-400 px-2 py-0.5 text-[10px] font-medium">Completed</span>
                  <span className="text-gray-900 text-xs font-bold px-2 py-1">Done</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/mentor/availability')} className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50 text-blue-500">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-gray-700">Availability</span>
          </button>
          
          <button onClick={() => navigate('/profile/mentor/me')} className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100 hover:border-purple-200 transition-colors">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-50 text-purple-500">
              <User className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-gray-700">My Profile</span>
          </button>
          
          <button className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100 hover:border-yellow-200 transition-colors">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-50 text-yellow-500">
              <Star className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-gray-700">Reviews</span>
          </button>
          
          <button className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-500">
              <BarChart2 className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-gray-700">Analytics</span>
          </button>
        </div>

        {/* Performance Insights */}
        <section className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">Performance Insights</h3>
          
          <div className="grid grid-cols-2 gap-y-5 gap-x-4">
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <p className="text-[11px] font-bold text-gray-500 mb-1">Avg Response</p>
              <p className="text-base font-extrabold text-gray-900">{userData?.avgResponseTime || '2 hrs'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <p className="text-[11px] font-bold text-gray-500 mb-1">Completion Rate</p>
              <p className="text-base font-extrabold text-gray-900">{userData?.completionRate || '95%'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <p className="text-[11px] font-bold text-gray-500 mb-1">Repeat Students</p>
              <p className="text-base font-extrabold text-gray-900">{userData?.repeatRate || '60%'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <p className="text-[11px] font-bold text-gray-500 mb-1">Total Earnings</p>
              <p className="text-base font-extrabold text-gray-900">₹{totalEarnings}</p>
            </div>
          </div>
        </section>

      </main>

      <BottomNav items={navItems} />

    </div>
  );
};

export default MentorDashboard;