import React, { useMemo } from 'react';
import { Menu, Bell, Search, BookOpen, Target, Trophy, Bot, Calendar, ChevronRight, LayoutDashboard, Users, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery';
import { calculateLevel, getXPForNextLevel } from '../../utils/gamification';
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverCard, AccentButton, AnimatedProgressBar } from '../../components/common/MotionWrapper';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, userData, loading: authLoading } = useAuthContext();

  // Fetch upcoming session
  const sessionOpts = useMemo(() => ({
    filters: [['studentId', '==', user?.uid || ''], ['status', '==', 'upcoming']],
    sort: ['date', 'asc'], 
    limitCount: 1,
    enabled: !!user?.uid
  }), [user?.uid]);

  const { data: upcomingSessions, loading: sessionsLoading } = useFirestoreQuery('sessions', sessionOpts);
  const upcomingSession = upcomingSessions?.[0];

  // Fetch leaderboard
  const leaderOpts = useMemo(() => ({
    sort: ['xp', 'desc'],
    limitCount: 3,
  }), []);
  const { data: leaders, loading: leadersLoading } = useFirestoreQuery('users', leaderOpts);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9]"><Loader2 className="w-8 h-8 animate-spin text-[#10b981]" /></div>;
  }

  const studentName = userData?.displayName?.split(' ')[0] || 'Student';
  const xp = userData?.xp || 0;
  
  // Calculate Level using gamification utility
  const currentLevel = calculateLevel(xp);
  const xpForNextLevel = getXPForNextLevel(currentLevel);
  const prevLevelXP = currentLevel > 1 ? getXPForNextLevel(currentLevel - 1) : 0;
  const progressPercent = Math.max(0, Math.min(100, ((xp - prevLevelXP) / (xpForNextLevel - prevLevelXP)) * 100));
  
  const getLevelTitle = (level) => {
    if (level < 3) return 'Novice';
    if (level < 5) return 'Scholar';
    if (level < 10) return 'Achiever';
    return 'Master';
  };

  const streak = userData?.streak || 0;

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 flex flex-col pb-20">
      
      {/* Top App Bar */}
      <header className="bg-[#1e293b] px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 text-[#10b981]" />
          <h1 className="text-xl font-bold font-display text-[#10b981]">EduPulse</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-300" />
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden border-2 border-[#10b981]">
            <img src={userData?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=1e293b&color=10b981`} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-6 space-y-6">
        
        {/* Greeting & XP */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-black font-display leading-tight">
              Good morning,<br/>{studentName}! 👋
            </h2>
            <div className="bg-[#E6F4F1] px-3 py-1.5 rounded-full mt-2">
              <span className="text-xs font-bold text-[#10b981] text-center block leading-tight">Level {currentLevel}<br/>{getLevelTitle(currentLevel)}</span>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
              <span>Current XP</span>
              <span>{xp} / {xpForNextLevel} XP</span>
            </div>
            <AnimatedProgressBar percent={progressPercent} colorClass="bg-[#10b981]" />
          </div>
        </div>

        {/* Action Grid */}
        <StaggerContainer className="grid grid-cols-2 gap-3" staggerDelay={0.05}>
          <StaggerItem>
            <HoverCard onClick={() => navigate('/find-mentor')} className="p-4 flex flex-col items-center justify-center gap-3 h-full w-full">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-xs font-bold text-gray-800">Find Mentor</span>
            </HoverCard>
          </StaggerItem>
          
          <StaggerItem>
            <HoverCard onClick={() => navigate('/sessions')} className="p-4 flex flex-col items-center justify-center gap-3 h-full w-full">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-xs font-bold text-gray-800">My Sessions</span>
            </HoverCard>
          </StaggerItem>
          
          <StaggerItem>
            <HoverCard onClick={() => navigate('/war-room')} className="p-4 flex flex-col items-center justify-center gap-3 h-full w-full border-[#ef4444] border-b-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-xs font-bold text-gray-800">War Room</span>
            </HoverCard>
          </StaggerItem>
          
          <StaggerItem>
            <HoverCard onClick={() => navigate('/ai-tutor')} className="p-4 flex flex-col items-center justify-center gap-3 h-full w-full">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-xs font-bold text-gray-800">AI Tutor</span>
            </HoverCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Upcoming Session */}
        <FadeIn delay={0.2}>
          {sessionsLoading ? (
             <div className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-4 text-center">
               <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#10b981]" />
             </div>
          ) : upcomingSession ? (
            <HoverCard className="bg-[#F8FAFC] p-4">
              <h3 className="font-bold text-gray-900 mb-2">{upcomingSession.subject || 'Mentorship Session'} with {upcomingSession.mentorName}</h3>
              <div className="flex items-center gap-3 text-sm mb-4">
                <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                  <Calendar className="w-4 h-4" />
                  {upcomingSession.date}, {upcomingSession.time}
                </div>
              </div>
              <AccentButton onClick={() => navigate(`/video-call/${upcomingSession.roomName || upcomingSession.id}`)} className="w-full">
                Join Now
              </AccentButton>
            </HoverCard>
          ) : (
            <HoverCard className="p-5 text-center bg-white">
              <p className="text-gray-500 text-sm font-medium mb-3">No upcoming sessions</p>
              <AccentButton onClick={() => navigate('/find-mentor')} className="text-sm py-2 bg-[#10b981] shadow-none w-auto text-white">
                Book a Mentor
              </AccentButton>
            </HoverCard>
          )}
        </FadeIn>

        {/* My Progress - Hardcoded visual for now as progress tracking is complex, but wired to UI */}
        <div>
          <h3 className="text-lg font-bold font-display mb-3">My Progress</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x no-scrollbar">
            
            <div className="bg-white border border-gray-200 rounded-2xl p-4 min-w-[140px] flex flex-col items-center shrink-0 snap-start shadow-sm">
              <div className="relative w-16 h-16 mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                  <path strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-800">75%</span>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-700">Overall</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 min-w-[140px] flex flex-col items-center shrink-0 snap-start shadow-sm">
              <div className="relative w-16 h-16 mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                  <path strokeDasharray={`${Math.min((streak / 7) * 100, 100)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-800">{streak}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-700">Day Streak</span>
            </div>
            
          </div>
        </div>

        {/* Streak Banner */}
        <div className="rounded-2xl p-5 border border-orange-100 shadow-sm relative overflow-hidden bg-gradient-to-br from-[#FFF4ED] via-white to-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
          
          <h3 className="text-lg font-black font-display text-center mb-4 relative z-10">
            <span className="inline-block mr-2 animate-bounce">🔥</span>
            {streak} Day Streak!
          </h3>
          
          <div className="flex justify-between items-center relative z-10 px-2">
            {/* Simple visual representation for now, assuming 1 is today, 2 is yesterday etc */}
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
              // Mock logic for visuals
              const isToday = idx === 5; // e.g. Saturday
              const isDone = idx < 5;
              const isFuture = idx > 5;
              
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400">{day}</span>
                  {isDone && (
                    <div className="w-6 h-6 rounded-full bg-[#D1FAE5] text-[#10b981] flex items-center justify-center">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {isToday && (
                    <div className="w-7 h-7 rounded-full bg-[#f97316] text-white flex items-center justify-center shadow-md">
                      <span className="text-sm">🔥</span>
                    </div>
                  )}
                  {isFuture && (
                    <div className="w-6 h-6 rounded-full border border-gray-300"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-6">
          <h3 className="text-lg font-bold font-display mb-4">Leaderboard</h3>
          <div className="space-y-1">
            
            {leadersLoading && <div className="text-center"><Loader2 className="w-4 h-4 animate-spin mx-auto text-[#10b981]" /></div>}
            
            {!leadersLoading && leaders && leaders.map((leader, idx) => {
              const isMe = leader.id === user?.uid;
              return (
                <div key={leader.id} className={`flex items-center gap-3 p-2 ${isMe ? 'bg-[#E6F4F1] rounded-r-xl border-l-4 border-[#10b981] relative -left-4 pl-7 pr-4 w-[calc(100%+32px)]' : 'rounded-xl'}`}>
                  <span className="text-xs font-bold text-gray-500 w-4 text-center">{idx + 1}</span>
                  <img src={leader.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.displayName || 'U')}`} alt="Avatar" className="w-8 h-8 rounded-full bg-gray-200" />
                  <span className={`flex-1 text-sm font-medium ${isMe ? 'font-bold text-gray-900' : 'text-gray-800'}`}>
                    {isMe ? 'You' : (leader.displayName || 'Anonymous')}
                  </span>
                  <span className={`text-xs font-bold ${isMe || idx === 0 ? 'text-[#10b981]' : 'text-gray-500'}`}>
                    {leader.xp || 0} XP
                  </span>
                </div>
              );
            })}
            
          </div>
        </div>

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center z-50">
        <button onClick={() => navigate('/dashboard/student')} className="flex flex-col items-center gap-1">
          <LayoutDashboard className="w-6 h-6 text-[#10b981]" fill="#10b981" fillOpacity={0.2} />
          <span className="text-[10px] font-bold text-[#10b981]">Dashboard</span>
        </button>
        <button onClick={() => navigate('/sessions')} className="flex flex-col items-center gap-1 opacity-50">
          <BookOpen className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Sessions</span>
        </button>
        <button onClick={() => navigate('/community')} className="flex flex-col items-center gap-1 opacity-50">
          <Users className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Community</span>
        </button>
        <button onClick={() => navigate('/profile/student/me')} className="flex flex-col items-center gap-1 opacity-50">
          <User className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default StudentDashboard;