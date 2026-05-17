import React from 'react';
import { Menu, Bell, Search, BookOpen, Target, Trophy, Bot, Calendar, ChevronRight, LayoutDashboard, Users, User } from 'lucide-react';

const StudentDashboard = () => {
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
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#f97316] rounded-full border-2 border-[#1e293b] flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">3</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden border-2 border-[#10b981]">
            <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-6 space-y-6">
        
        {/* Greeting & XP */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-black font-display leading-tight">
              Good morning,<br/>Hitesh! 👋
            </h2>
            <div className="bg-[#E6F4F1] px-3 py-1.5 rounded-full mt-2">
              <span className="text-xs font-bold text-[#10b981] text-center block leading-tight">Level 3<br/>Scholar</span>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
              <span>Current XP</span>
              <span>450 / 600 XP</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#10b981] w-[75%] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-xs font-bold text-gray-800">Find Mentor</span>
          </button>
          
          <button className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-500" />
            </div>
            <span className="text-xs font-bold text-gray-800">My Courses</span>
          </button>
          
          <button className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-xs font-bold text-gray-800">War Room</span>
          </button>
          
          <button className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs font-bold text-gray-800">AI Tutor</span>
          </button>
        </div>

        {/* Upcoming Session */}
        <div className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-4">
          <h3 className="font-bold text-gray-900 mb-2">UP Police Prep with Rahul Sir</h3>
          <div className="flex items-center gap-3 text-sm mb-4">
            <div className="flex items-center gap-1.5 text-gray-600 font-medium">
              <Calendar className="w-4 h-4" />
              Today, 4:00 PM
            </div>
            <span className="font-bold text-[#f97316]">Starts in 2h 15m</span>
          </div>
          <button className="w-full bg-[#f97316] text-white font-bold py-3 rounded-full active:bg-[#ea580c] transition-colors">
            Join Now
          </button>
        </div>

        {/* My Progress */}
        <div>
          <h3 className="text-lg font-bold font-display mb-3">My Progress</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x no-scrollbar">
            
            {/* Maths Progress */}
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
              <span className="text-xs font-bold text-gray-700">Maths</span>
            </div>

            {/* Reasoning Progress */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 min-w-[140px] flex flex-col items-center shrink-0 snap-start shadow-sm">
              <div className="relative w-16 h-16 mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                  <path strokeDasharray="45, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-800">45%</span>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-700">Reasoning</span>
            </div>
            
            {/* Empty Progress Placeholder */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 min-w-[40px] shrink-0 snap-start shadow-sm opacity-50"></div>
          </div>
        </div>

        {/* Streak Banner */}
        <div className="rounded-2xl p-5 border border-orange-100 shadow-sm relative overflow-hidden bg-gradient-to-br from-[#FFF4ED] via-white to-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
          
          <h3 className="text-lg font-black font-display text-center mb-4 relative z-10">
            <span className="inline-block mr-2 animate-bounce">🔥</span>
            7 Day Streak!
          </h3>
          
          <div className="flex justify-between items-center relative z-10 px-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
              let status;
              if (idx === 2) status = 'missed'; // Wednesday
              else if (idx === 5) status = 'today'; // Saturday
              else if (idx === 6) status = 'future'; // Sunday
              else status = 'done'; // M, T, T, F
              
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400">{day}</span>
                  {status === 'done' && (
                    <div className="w-6 h-6 rounded-full bg-[#D1FAE5] text-[#10b981] flex items-center justify-center">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {status === 'missed' && (
                    <div className="w-6 h-6 rounded-full bg-red-50 text-red-400 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  {status === 'today' && (
                    <div className="w-7 h-7 rounded-full bg-[#f97316] text-white flex items-center justify-center shadow-md">
                      <span className="text-sm">🔥</span>
                    </div>
                  )}
                  {status === 'future' && (
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
            
            {/* Rank 1 */}
            <div className="flex items-center gap-3 p-2 rounded-xl">
              <span className="text-xs font-bold text-gray-500 w-4 text-center">1</span>
              <img src="https://i.pravatar.cc/100?img=5" alt="Avatar" className="w-8 h-8 rounded-full bg-gray-200" />
              <span className="flex-1 text-sm font-medium text-gray-800">Priya S.</span>
              <span className="text-xs font-bold text-[#10b981]">520 XP</span>
            </div>

            {/* Rank 2 (You) */}
            <div className="flex items-center gap-3 p-2 bg-[#E6F4F1] rounded-r-xl border-l-4 border-[#10b981] relative -left-4 pl-7 pr-4 w-[calc(100%+32px)]">
              <span className="text-xs font-bold text-gray-800 w-4 text-center">2</span>
              <img src="https://i.pravatar.cc/100?img=11" alt="Avatar" className="w-8 h-8 rounded-full bg-gray-200" />
              <span className="flex-1 text-sm font-bold text-gray-900">You</span>
              <span className="text-xs font-bold text-[#10b981]">450 XP</span>
            </div>

            {/* Rank 3 */}
            <div className="flex items-center gap-3 p-2 rounded-xl">
              <span className="text-xs font-bold text-gray-500 w-4 text-center">3</span>
              <img src="https://i.pravatar.cc/100?img=12" alt="Avatar" className="w-8 h-8 rounded-full bg-gray-200" />
              <span className="flex-1 text-sm font-medium text-gray-800">Amit K.</span>
              <span className="text-xs font-bold text-gray-500">410 XP</span>
            </div>
            
          </div>
        </div>

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center z-50">
        <button className="flex flex-col items-center gap-1">
          <LayoutDashboard className="w-6 h-6 text-[#10b981]" fill="#10b981" fillOpacity={0.2} />
          <span className="text-[10px] font-bold text-[#10b981]">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-50">
          <BookOpen className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Courses</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-50">
          <Users className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Community</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-50">
          <User className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default StudentDashboard;