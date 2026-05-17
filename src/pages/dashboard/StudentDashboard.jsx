import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, BookOpen, Trophy, Bot, Calendar, Loader2, Home, Users, User, LayoutDashboard, Search } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery';
import { calculateLevel, getXPForNextLevel } from '../../utils/gamification';
import BottomNav from '../../components/common/BottomNav';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, userData, loading: authLoading } = useAuthContext();

  const sessionOpts = useMemo(() => ({
    filters: [['studentId', '==', user?.uid || ''], ['status', '==', 'upcoming']],
    sort: ['date', 'asc'], 
    limitCount: 1,
    enabled: !!user?.uid
  }), [user?.uid]);

  const { data: upcomingSessions, loading: sessionsLoading } = useFirestoreQuery('sessions', sessionOpts);
  const upcomingSession = upcomingSessions?.[0];

  const leaderOpts = useMemo(() => ({
    sort: ['xp', 'desc'],
    limitCount: 3,
  }), []);
  const { data: leaders, loading: leadersLoading } = useFirestoreQuery('users', leaderOpts);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  }

  const studentName = userData?.displayName?.split(' ')[0] || 'Student';
  const xp = userData?.xp || 0;
  const currentLevel = calculateLevel(xp);
  const xpForNextLevel = getXPForNextLevel(currentLevel);
  const prevLevelXP = currentLevel > 1 ? getXPForNextLevel(currentLevel - 1) : 0;
  const progressPercent = Math.max(0, Math.min(100, ((xp - prevLevelXP) / (xpForNextLevel - prevLevelXP)) * 100));
  const streak = userData?.streak || 0;

  const getLevelTitle = (level) => {
    if (level < 3) return 'Novice';
    if (level < 5) return 'Scholar';
    if (level < 10) return 'Achiever';
    return 'Master';
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/student' },
    { label: 'Sessions', icon: BookOpen, path: '/sessions' },
    { label: 'Community', icon: Users, path: '/community' },
    { label: 'Profile', icon: User, path: '/profile/student/me' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col pb-24">
      {/* Header Area */}
      <div className="bg-white px-5 pt-6 pb-4 border-b border-gray-100 rounded-b-3xl shadow-sm">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Good morning,<br/>{studentName}! 👋
            </h2>
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-primary-50 px-3 py-1.5 rounded-full mb-1">
              <span className="text-xs font-bold text-primary-600 block">Level {currentLevel} • {getLevelTitle(currentLevel)}</span>
            </div>
            <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              🔥 {streak} Day Streak
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
            <span>Current Progress</span>
            <span className="text-primary-600">{xp} / {xpForNextLevel} XP</span>
          </div>
          <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <main className="flex-1 px-5 pt-6 space-y-6">
        
        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/find-mentor')} className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100 hover:border-orange-200 transition-colors">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-gray-800">Find Mentor</span>
          </button>
          
          <button onClick={() => navigate('/sessions')} className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-gray-800">My Sessions</span>
          </button>
          
          <button onClick={() => navigate('/war-room')} className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100 hover:border-red-200 transition-colors relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-gray-800">War Room</span>
            <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">LIVE</div>
          </button>
          
          <button onClick={() => navigate('/ai-tutor')} className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100 hover:border-primary-200 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-500">
              <Bot className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-gray-800">AI Tutor</span>
          </button>
        </div>

        {/* Upcoming Session */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-lg font-bold text-gray-900">Upcoming Session</h3>
          </div>
          
          {sessionsLoading ? (
             <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
               <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-500" />
             </div>
          ) : upcomingSession ? (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-primary-500">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-gray-900 text-base">{upcomingSession.subject || 'Mentorship Session'}</h4>
                  <p className="text-sm text-gray-500 font-medium">with {upcomingSession.mentorName}</p>
                </div>
                <div className="bg-primary-50 text-primary-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Today
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-bold text-gray-700">{upcomingSession.time}</span>
                <button onClick={() => navigate(`/video-call/${upcomingSession.roomName || upcomingSession.id}`)} className="bg-primary-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary-600 transition-colors">
                  Join Call
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-4">No upcoming sessions</p>
              <button onClick={() => navigate('/find-mentor')} className="bg-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-600 transition-colors">
                Book a Mentor
              </button>
            </div>
          )}
        </section>

        {/* Leaderboard */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-lg font-bold text-gray-900">Leaderboard</h3>
            <button className="text-xs font-bold text-primary-600">View All</button>
          </div>
          
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            {leadersLoading ? (
              <div className="py-6 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-primary-500" /></div>
            ) : (
              <div className="space-y-1">
                {leaders?.map((leader, idx) => {
                  const isMe = leader.id === user?.uid;
                  return (
                    <div key={leader.id} className={`flex items-center gap-3 p-3 rounded-xl ${isMe ? 'bg-primary-50' : ''}`}>
                      <div className={`w-6 text-center font-bold text-sm ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-600' : 'text-gray-400'}`}>
                        {idx + 1}
                      </div>
                      <img src={leader.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.displayName || 'U')}&background=random`} alt="Avatar" className="w-10 h-10 rounded-full bg-gray-200" />
                      <div className="flex-1">
                        <h4 className={`text-sm font-bold ${isMe ? 'text-primary-700' : 'text-gray-900'}`}>
                          {isMe ? 'You' : (leader.displayName || 'Anonymous')}
                        </h4>
                        <p className="text-xs font-medium text-gray-500">Level {calculateLevel(leader.xp || 0)}</p>
                      </div>
                      <span className={`text-sm font-bold ${isMe ? 'text-primary-600' : 'text-gray-700'}`}>
                        {leader.xp || 0} XP
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

      </main>

      <BottomNav items={navItems} />
    </div>
  );
};

export default StudentDashboard;