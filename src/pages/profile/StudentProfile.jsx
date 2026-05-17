import React from 'react';
import { ArrowLeft, Share2, MapPin, CheckCircle2, ChevronDown, BarChart2, Award, Calendar, Clock, Home, GraduationCap, Medal, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 flex flex-col pb-24 relative">
      
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between sticky top-0 z-50 bg-white">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-[#064E3B]" />
        </button>
        <h1 className="text-lg font-bold font-display text-[#064E3B]">Hitesh's Profile</h1>
        <button className="p-1">
          <Share2 className="w-5 h-5 text-[#064E3B]" />
        </button>
      </header>

      {/* Split Background */}
      <div className="h-40 bg-[#1e293b] w-full absolute top-[60px] left-0 z-0"></div>

      <main className="flex-1 px-4 relative z-10 pt-20">
        
        {/* Avatar */}
        <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-sm mb-4">
          <img src="https://i.pravatar.cc/300?img=11" alt="Hitesh Agrawal" className="w-full h-full object-cover" />
        </div>

        {/* Profile Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black font-display text-gray-900">Hitesh Agrawal</h2>
            <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-3">@hitesh_agrawal</p>
          
          <p className="text-sm font-bold text-gray-800 mb-1">
            BBA 2nd Year <span className="text-gray-300 mx-1">|</span> ITM College Aligarh
          </p>
          <div className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span>Aligarh, UP 🇮🇳</span>
          </div>
          
          <p className="text-sm text-gray-700 italic font-medium leading-relaxed">
            "Aspiring UP Police officer. Learning from the best mentors. 🔥"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-8">
          <button className="flex-1 bg-[#EEF2FF] text-[#4F46E5] font-bold py-2.5 rounded-xl text-sm active:bg-indigo-100 transition-colors">
            Message
          </button>
          <button className="flex-[1.5] bg-[#10b981] text-white font-bold py-2.5 rounded-xl text-sm active:bg-emerald-600 transition-colors shadow-sm">
            Follow
          </button>
          <button className="w-12 bg-[#EEF2FF] text-[#4F46E5] rounded-xl flex items-center justify-center active:bg-indigo-100 transition-colors">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* My Journey Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          {/* Subtle green glow in background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-60 -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-bold font-display text-gray-900">My Journey</h3>
            </div>
            <button className="p-1">
              <Share2 className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
            
            {/* Level */}
            <div className="border border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center bg-gray-50/50">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-2">
                <Award className="w-4 h-4 text-[#10b981]" />
              </div>
              <span className="text-[10px] font-bold text-[#10b981] text-center leading-tight">Level 4<br/>Scholar</span>
            </div>
            
            {/* Sessions */}
            <div className="border border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center bg-gray-50/50">
              <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-2">
                <Calendar className="w-4 h-4 text-[#10b981]" />
              </div>
              <span className="text-sm font-black text-gray-800">12</span>
              <span className="text-[10px] font-bold text-gray-500">Sessions</span>
            </div>
            
            {/* Hours */}
            <div className="border border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center bg-gray-50/50">
              <div className="w-8 h-8 rounded-full bg-[#FFF7ED] flex items-center justify-center mb-2">
                <Clock className="w-4 h-4 text-[#f97316]" />
              </div>
              <span className="text-sm font-black text-[#f97316]">45</span>
              <span className="text-[10px] font-bold text-gray-500">Hours</span>
            </div>

          </div>

          {/* XP Bar */}
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-bold text-gray-900 tracking-wider">EXPERIENCE</span>
              <span className="text-[10px] font-bold text-gray-900">450 <span className="text-gray-500">/ 600 XP</span></span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <div className="h-full bg-[#064E3B] w-[75%] rounded-full"></div>
            </div>
          </div>

        </div>

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-50">
        <button className="flex flex-col items-center gap-1 opacity-50" onClick={() => navigate('/dashboard/student')}>
          <Home className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-50">
          <GraduationCap className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Learn</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-50">
          <Medal className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Achievements</span>
        </button>
        <button className="flex flex-col items-center gap-1 bg-[#f97316] text-white px-4 py-1.5 rounded-full shadow-sm">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>

    </div>
  );
};

export default StudentProfile;