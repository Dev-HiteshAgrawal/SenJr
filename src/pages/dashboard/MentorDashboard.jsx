import React, { useMemo } from 'react';
import { Menu, Bell, Wallet, Calendar, User, Star, BarChart2, ArrowRight, Home, IndianRupee, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery';
import { calculateLevel } from '../../utils/gamification';
import { StaggerContainer, StaggerItem, HoverCard, FadeIn, SlideUp, PrimaryButton } from '../../components/common/MotionWrapper';

const MentorDashboard = () => {
  const navigate = useNavigate();
  const { user, userData, loading: authLoading } = useAuthContext();

  // Fetch mentor's sessions
  const sessionOpts = useMemo(() => ({
    filters: [['mentorId', '==', user?.uid || '']],
    sort: ['date', 'asc'], // In reality you'd likely want to filter by date >= today as well
    enabled: !!user?.uid
  }), [user?.uid]);

  const { data: sessions, loading: sessionsLoading } = useFirestoreQuery('sessions', sessionOpts);

  const stats = useMemo(() => {
    if (!sessions) return { totalSessions: 0, uniqueStudents: 0, todaysCount: 0, upcoming: [], completed: [] };
    const students = new Set();
    let todaysCount = 0;
    const todayStr = new Date().toISOString().split('T')[0]; // Simple YYYY-MM-DD match
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
      upcoming: upcoming.slice(0, 3), // max 3 to display
      completed: completed.slice(0, 3)
    };
  }, [sessions]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#10b981]" /></div>;
  }

  const mentorName = userData?.displayName || 'Mentor';
  const earningsThisMonth = userData?.earningsThisMonth || 0;
  const rating = userData?.rating || '5.0';
  const totalEarnings = userData?.totalEarnings || 0;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col pb-24">
      
      {/* Top App Bar */}
      <header className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Menu className="w-6 h-6 text-gray-900" />
          <h1 className="text-xl font-bold font-display text-gray-900">Mentor Hub</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-[#10b981] font-bold">
            <span className="text-sm">₹{totalEarnings}</span>
          </div>
          <Bell className="w-5 h-5 text-gray-700" />
          <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
            <img src={userData?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}`} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-6 space-y-6">
        
        {/* Greeting */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-1">
              Welcome back, {mentorName.split(' ')[0]}! 🎓
            </h2>
            <p className="text-gray-600 text-sm">
              {sessionsLoading ? 'Loading schedule...' : `You have ${stats.todaysCount} sessions today`}
            </p>
          </div>
          <div className="bg-[#E6F4F1] px-3 py-1.5 rounded-full">
            <span className="text-xs font-bold text-[#10b981] text-center block leading-tight">Level {calculateLevel(userData?.xp || 0)}<br/>Mentor</span>
          </div>
        </div>
        
        {/* Stats Row */}
        <StaggerContainer className="grid grid-cols-3 gap-3" staggerDelay={0.05}>
          <StaggerItem>
            <HoverCard className="py-3 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-gray-500 tracking-wider mb-1">SESSIONS</span>
              <span className="text-xl font-black text-blue-500">{stats.totalSessions}</span>
            </HoverCard>
          </StaggerItem>
          <StaggerItem>
            <HoverCard className="py-3 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-gray-500 tracking-wider mb-1">STUDENTS</span>
              <span className="text-xl font-black text-[#10b981]">{stats.uniqueStudents}</span>
            </HoverCard>
          </StaggerItem>
          <StaggerItem>
            <HoverCard className="py-3 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-gray-500 tracking-wider mb-1">RATING</span>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black text-gray-900">{rating}</span>
                <span className="text-sm text-yellow-400">★</span>
              </div>
            </HoverCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Earnings Section */}
        <FadeIn delay={0.1}>
          <div className="bg-[#F0FDF4] border border-[#D1FAE5] rounded-3xl p-5 relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">💰</span>
                <h3 className="font-bold text-gray-800">Earnings This Month</h3>
              </div>
              <button onClick={() => navigate('/mentor/earnings')} className="text-[10px] font-bold text-gray-900 flex items-center gap-1">
                View <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="text-3xl font-black text-gray-900 mb-6">₹{earningsThisMonth}</div>
            
            {/* Simple Bar Chart */}
            <div className="flex items-end gap-2 h-16 mb-6">
              <div className="flex-1 bg-[#34d399] rounded-t-sm h-[30%] hover:h-[35%] transition-all"></div>
              <div className="flex-1 bg-[#34d399] rounded-t-sm h-[50%] hover:h-[55%] transition-all"></div>
              <div className="flex-1 bg-[#34d399] rounded-t-sm h-[40%] hover:h-[45%] transition-all"></div>
              <div className="flex-1 bg-[#34d399] rounded-t-sm h-[70%] hover:h-[75%] transition-all"></div>
              <div className="flex-1 bg-[#10b981] rounded-t-sm h-[90%] hover:h-[95%] transition-all"></div>
              <div className="flex-1 bg-[#34d399] rounded-t-sm h-[50%] hover:h-[55%] transition-all"></div>
              <div className="flex-1 bg-[#34d399] rounded-t-sm h-[80%] hover:h-[85%] transition-all"></div>
            </div>
            
            <PrimaryButton onClick={() => navigate('/mentor/earnings')} className="w-full bg-white border-2 border-[#10b981] text-[#10b981] font-bold py-3 hover:bg-green-50 shadow-none">
              Withdraw to UPI
            </PrimaryButton>
          </div>
        </FadeIn>

        {/* Schedule */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <h3 className="font-bold font-display text-gray-900">Today's Schedule</h3>
            </div>
            <button onClick={() => navigate('/sessions')} className="text-[10px] font-bold text-gray-600 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          <StaggerContainer className="space-y-3" staggerDelay={0.05}>
            {sessionsLoading && <div className="text-center text-gray-500 py-4"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>}
            {!sessionsLoading && stats.upcoming.length === 0 && stats.completed.length === 0 && (
              <StaggerItem>
                <div className="text-center text-gray-500 py-4 bg-gray-50 rounded-2xl border border-gray-100">No sessions scheduled for today.</div>
              </StaggerItem>
            )}

            {/* Upcoming Sessions */}
            {stats.upcoming.map(session => (
              <StaggerItem key={session.id}>
                <HoverCard className="p-4 flex items-center justify-between border-l-4 border-l-[#10b981]">

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700">
                    {(session.studentName || 'U')[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{session.studentName}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{session.time} • {session.subject || 'Session'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="bg-[#FFF7ED] text-orange-600 px-2 py-0.5 rounded-full text-[10px] font-bold">Upcoming</span>
                  <PrimaryButton onClick={() => navigate(`/video-call/${session.roomName || session.id}`)} className="text-xs px-4 py-1.5 rounded-full shadow-none">
                    Start
                  </PrimaryButton>
                </div>
              </HoverCard>
             </StaggerItem>
            ))}

            {/* Completed Sessions */}
            {stats.completed.map(session => (
              <StaggerItem key={session.id}>
                <HoverCard className="p-4 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-3 opacity-60">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
                      {(session.studentName || 'U')[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{session.studentName}</h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{session.time} • {session.subject || 'Session'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-gray-400 px-2 py-0.5 text-[10px] font-medium">Completed</span>
                    <span className="text-gray-900 text-xs font-medium px-4 py-1.5">Done</span>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Action Grid */}
        {/* Action Grid */}
        <StaggerContainer className="grid grid-cols-2 gap-3" staggerDelay={0.05}>
          <StaggerItem>
            <HoverCard onClick={() => navigate('/mentor/availability')} className="p-4 flex flex-col items-center justify-center gap-3 h-full">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs font-medium text-gray-700">Set Availability</span>
            </HoverCard>
          </StaggerItem>
          
          <StaggerItem>
            <HoverCard onClick={() => navigate('/profile/mentor/me')} className="p-4 flex flex-col items-center justify-center gap-3 h-full">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50">
                <User className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs font-medium text-gray-700">My Profile</span>
            </HoverCard>
          </StaggerItem>
          
          <StaggerItem>
            <HoverCard className="p-4 flex flex-col items-center justify-center gap-3 h-full">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50">
                <Star className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs font-medium text-gray-700">View Reviews</span>
            </HoverCard>
          </StaggerItem>
          
          <StaggerItem>
            <HoverCard className="p-4 flex flex-col items-center justify-center gap-3 h-full">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50">
                <BarChart2 className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs font-medium text-gray-700">Analytics</span>
            </HoverCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Recent Reviews (Mocked for layout placeholder as reviews coll is complex) */}
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400 text-lg">⭐</span>
            <h3 className="font-bold text-gray-900">Recent Reviews</h3>
          </div>
          
          <div className="mb-4">
            <div className="flex gap-1 mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-gray-800 fill-gray-800" />)}
            </div>
            <p className="text-sm font-medium text-gray-700 italic mb-2">
              "Best mentor ever! Explains complex concepts with ease."
            </p>
            <p className="text-xs text-gray-500 text-right">— Hitesh, BBA 2nd Year</p>
          </div>
          
          <button className="w-full text-center text-xs font-bold text-gray-600 flex items-center justify-center gap-1 py-2">
            View All Reviews <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Performance Insights */}
        <div className="border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-600 mb-4">Performance Insights</h3>
          
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-[10px] font-bold text-gray-500 mb-1">Avg Response</p>
              <p className="text-sm font-medium text-gray-900">{userData?.avgResponseTime || '2 hrs'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 mb-1">Completion Rate</p>
              <p className="text-sm font-medium text-gray-900">{userData?.completionRate || '95%'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 mb-1">Repeat Students</p>
              <p className="text-sm font-medium text-gray-900">{userData?.repeatRate || '60%'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 mb-1">Total Earnings</p>
              <p className="text-sm font-medium text-gray-900">₹{totalEarnings}</p>
            </div>
          </div>
        </div>

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center z-50">
        <button onClick={() => navigate('/dashboard/mentor')} className="flex flex-col items-center gap-1 opacity-50">
          <Home className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Home</span>
        </button>
        <button onClick={() => navigate('/mentor/availability')} className="flex flex-col items-center gap-1 opacity-50">
          <Calendar className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Schedule</span>
        </button>
        <button onClick={() => navigate('/mentor/earnings')} className="flex flex-col items-center gap-1 border-t-2 border-[#10b981] pt-1 -mt-[9px]">
          <IndianRupee className="w-6 h-6 text-[#10b981]" />
          <span className="text-[10px] font-bold text-[#10b981]">Earnings</span>
        </button>
        <button onClick={() => navigate('/profile/mentor/me')} className="flex flex-col items-center gap-1 opacity-50">
          <User className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Profile</span>
        </button>
      </nav>

    </div>
  );
};

export default MentorDashboard;