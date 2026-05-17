import React from 'react';
import { ArrowLeft, Share2, Bookmark, MapPin, CheckCircle, ShieldCheck, Calendar, GraduationCap, Star, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MentorProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col pb-24">
      
      {/* Header */}
      <header className="bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100 shadow-sm rounded-b-3xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-extrabold text-gray-900">Mentor Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bookmark className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
            <Share2 className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </header>

      {/* Cover Banner */}
      <div className="h-36 bg-gradient-to-br from-mentor-600 via-mentor-500 to-orange-400 relative">
        <div className="absolute inset-0 bg-white/5"></div>
      </div>

      <main className="flex-1 px-5 -mt-14 relative z-10">
        
        {/* Avatar */}
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-gray-200">
            <img src="https://i.pravatar.cc/300?img=11" alt="Rahul Sharma" className="w-full h-full object-cover" />
          </div>
        </div>
        
        <h2 className="text-2xl font-black text-gray-900 mb-2">Rahul Sharma</h2>
        
        {/* Badges */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <div className="bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-blue-700">Verified Mentor</span>
          </div>
          <div className="bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />
            <span className="text-primary-700">Document Verified</span>
          </div>
        </div>
        
        {/* Subtitle */}
        <p className="text-sm text-gray-600 font-medium mb-2 leading-relaxed">
          BBA Graduate <span className="text-gray-300 mx-1">•</span> UP Police Cleared <span className="text-gray-300 mx-1">•</span> 2+ Yrs Teaching
        </p>
        
        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium mb-6">
          <MapPin className="w-4 h-4" />
          <span>Aligarh, UP</span>
        </div>
        
        {/* Book Session CTA */}
        <button 
          onClick={() => navigate('/book/rahul-s')}
          className="w-full bg-mentor-500 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-mentor-500/20 mb-6 active:scale-[0.98] hover:bg-mentor-600 transition-all"
        >
          <Calendar className="w-5 h-5" /> Book Session · ₹200/hr
        </button>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
            <span className="text-xl font-black text-mentor-500 mb-0.5">45</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sessions</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
            <span className="text-xl font-black text-mentor-500 mb-0.5">32</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Students</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
            <div className="flex items-center gap-0.5 mb-0.5">
              <span className="text-xl font-black text-yellow-500">4.9</span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Rating</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
            <span className="text-xl font-black text-primary-500 mb-0.5">95%</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Done</span>
          </div>
        </div>
        
        {/* Teaching Expertise */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-gray-400" />
            <h3 className="font-extrabold text-gray-900">Teaching Expertise</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['BBA', 'Economics', 'UP Police', 'Reasoning', 'Communication'].map((subject) => (
              <span key={subject} className="bg-gray-50 border border-gray-200 px-4 py-2 text-sm font-bold rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
                {subject}
              </span>
            ))}
          </div>
        </div>
        
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 p-5 pb-[env(safe-area-inset-bottom)] flex items-center justify-between z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Session Price</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-primary-500">₹200</span>
            <span className="text-sm font-medium text-gray-400">/ hr</span>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/book/rahul-s')}
          className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg active:scale-[0.98] hover:bg-gray-800 transition-all"
        >
          Book Session
        </button>
      </div>

    </div>
  );
};

export default MentorProfile;