import React from 'react';
import { ArrowLeft, Share2, MapPin, CheckCircle2, BarChart2, Award, Calendar, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { calculateLevel, getXPForNextLevel } from '../../utils/gamification';
import BottomNav from '../../components/common/BottomNav';

const StudentProfile = () => {
  const navigate = useNavigate();
  const { userData } = useAuthContext();

  const displayName = userData?.displayName || 'Student';
  const xp = userData?.xp || 0;
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col pb-24">
      
      {/* Header */}
      <header className="bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100 shadow-sm rounded-b-3xl">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-extrabold text-gray-900">My Profile</h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
          <Share2 className="w-5 h-5 text-gray-500" />
        </button>
      </header>

      {/* Cover Banner */}
      <div className="h-36 bg-gradient-to-br from-primary-600 via-primary-500 to-emerald-400 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10"></div>
      </div>

      <main className="flex-1 px-5 -mt-16 relative z-10">
        
        {/* Avatar */}
        <div className="w-28 h-28 rounded-3xl border-4 border-white overflow-hidden bg-gray-200 shadow-lg mb-4">
          <img src={userData?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=10b981&color=fff&size=300`} alt={displayName} className="w-full h-full object-cover" />
        </div>

        {/* Profile Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-gray-900">{displayName}</h2>
            <CheckCircle2 className="w-5 h-5 text-primary-500" />
          </div>
          
          <p className="text-sm font-bold text-gray-800 mb-1">
            {userData?.course || 'Student'} <span className="text-gray-300 mx-1">|</span> {userData?.college || 'Senjr Platform'}
          </p>
          {userData?.city && (
            <div className="flex items-center gap-1 text-sm font-medium text-gray-500 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{userData.city} 🇮🇳</span>
            </div>
          )}
          
          {userData?.bio && (
            <p className="text-sm text-gray-600 font-medium leading-relaxed bg-gray-50 p-3 rounded-2xl border border-gray-100">
              "{userData.bio}"
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-2xl text-sm hover:bg-gray-200 transition-colors">
            Edit Profile
          </button>
          <button className="flex-[1.5] bg-primary-500 text-white font-bold py-3 rounded-2xl text-sm hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/20 active:scale-[0.98]">
            Share Profile
          </button>
        </div>

        {/* My Journey Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl opacity-60 -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-5 relative z-10">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-extrabold text-gray-900">My Journey</h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
            
            {/* Level */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-2 border border-primary-100">
                <Award className="w-5 h-5 text-primary-500" />
              </div>
              <span className="text-[10px] font-bold text-primary-600 text-center leading-tight">Level {currentLevel}<br/>{getLevelTitle(currentLevel)}</span>
            </div>
            
            {/* Sessions */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-2 border border-blue-100">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-base font-black text-gray-800">{userData?.totalSessions || 0}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sessions</span>
            </div>
            
            {/* Hours */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-mentor-50 flex items-center justify-center mb-2 border border-mentor-100">
                <Clock className="w-5 h-5 text-mentor-500" />
              </div>
              <span className="text-base font-black text-mentor-500">{userData?.totalHours || 0}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Hours</span>
            </div>

          </div>

          {/* XP Bar */}
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Experience</span>
              <span className="text-xs font-bold text-gray-900">{xp} <span className="text-gray-400">/ {xpForNextLevel} XP</span></span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

        </div>

      </main>

      <BottomNav />
    </div>
  );
};

export default StudentProfile;