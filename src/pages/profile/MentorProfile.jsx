import React from 'react';
import { ArrowLeft, Share2, Bookmark, MapPin, CheckCircle, ShieldCheck, Calendar, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MentorProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col pb-24">
      
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between sticky top-0 z-50 bg-white">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold font-display text-gray-900">Rahul's Portfolio</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-1">
            <Share2 className="w-5 h-5 text-gray-900" />
          </button>
          <button className="p-1">
            <Bookmark className="w-5 h-5 text-gray-900" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-6 pt-2">
        
        {/* Profile Header section */}
        <div className="flex flex-col items-center text-center">
          
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
              <img src="https://i.pravatar.cc/300?img=11" alt="Rahul Sharma" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <h2 className="text-2xl font-black font-display mb-3">Rahul Sharma</h2>
          
          {/* Badges */}
          <div className="flex gap-2 justify-center mb-4 flex-wrap">
            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-y-0.5 translate-x-0.5 rounded-sm"></div>
              <div className="relative bg-[#EFF6FF] border border-gray-900 px-3 py-1 text-xs font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-blue-700">Verified Mentor</span>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-y-0.5 translate-x-0.5 rounded-sm"></div>
              <div className="relative bg-[#ECFDF5] border border-gray-900 px-3 py-1 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Document Verified</span>
              </div>
            </div>
          </div>
          
          {/* Subtitle */}
          <p className="text-sm text-gray-700 font-medium mb-2 px-6 leading-relaxed">
            BBA Graduate <span className="text-gray-300 mx-1">|</span> UP Police Cleared <span className="text-gray-300 mx-1">|</span> 2+ Yrs Teaching
          </p>
          
          {/* Location */}
          <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-6">
            <MapPin className="w-4 h-4" />
            <span>Aligarh, UP</span>
          </div>
          
          {/* Book Session CTA (Primary) */}
          <button 
            onClick={() => navigate('/book/rahul-s')}
            className="w-full relative group block mb-6"
          >
            <div className="absolute inset-0 bg-black translate-y-1.5 translate-x-1.5 rounded-sm transition-transform group-active:translate-x-0 group-active:translate-y-0"></div>
            <div className="relative bg-[#10b981] border border-gray-900 text-white py-3 font-bold text-sm flex items-center justify-center gap-2 transition-transform group-active:translate-x-1 group-active:translate-y-1 rounded-sm tracking-wide">
              <Calendar className="w-4 h-4" /> BOOK SESSION • ₹200/HR
            </div>
          </button>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 w-full mb-8">
            
            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-y-1 translate-x-1 rounded-sm"></div>
              <div className="relative bg-white border border-gray-900 p-4 flex flex-col items-center justify-center rounded-sm h-full">
                <span className="text-2xl font-black text-[#f97316] mb-1">45</span>
                <span className="text-[10px] font-bold text-gray-600 tracking-wider">SESSIONS</span>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-y-1 translate-x-1 rounded-sm"></div>
              <div className="relative bg-white border border-gray-900 p-4 flex flex-col items-center justify-center rounded-sm h-full">
                <span className="text-2xl font-black text-[#f97316] mb-1">32</span>
                <span className="text-[10px] font-bold text-gray-600 tracking-wider">STUDENTS</span>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-y-1 translate-x-1 rounded-sm"></div>
              <div className="relative bg-white border border-gray-900 p-4 flex flex-col items-center justify-center rounded-sm h-full">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-2xl font-black text-yellow-500">4.9</span>
                  <span className="text-sm text-yellow-500">⭐</span>
                </div>
                <span className="text-[10px] font-bold text-gray-600 tracking-wider">RATING</span>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-y-1 translate-x-1 rounded-sm"></div>
              <div className="relative bg-white border border-gray-900 p-4 flex flex-col items-center justify-center rounded-sm h-full">
                <span className="text-2xl font-black text-[#10b981] mb-1">95%</span>
                <span className="text-[10px] font-bold text-gray-600 tracking-wider">COMPLETION</span>
              </div>
            </div>

          </div>
          
          {/* Teaching Expertise */}
          <div className="w-full text-left">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-gray-800" />
              <h3 className="font-bold text-gray-900">Teaching Expertise</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['BBA', 'Economics', 'UP Police', 'Reasoning', 'Communication'].map((subject) => (
                <div key={subject} className="bg-white border border-gray-900 px-3 py-1.5 text-xs font-bold rounded-sm shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  {subject}
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-900 p-4 flex items-center justify-between z-50">
        <div>
          <p className="text-[10px] font-bold text-gray-500 tracking-wider mb-0.5">SESSION PRICE</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#10b981]">₹200</span>
            <span className="text-sm font-medium text-gray-600">/ hr</span>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/book/rahul-s')}
          className="relative group block w-[160px]"
        >
          <div className="absolute inset-0 bg-black translate-y-1 translate-x-1 rounded-sm transition-transform group-active:translate-x-0 group-active:translate-y-0"></div>
          <div className="relative bg-[#9A3412] border border-gray-900 text-white py-3.5 font-bold text-sm flex items-center justify-center transition-transform group-active:translate-x-1 group-active:translate-y-1 rounded-sm">
            BOOK SESSION
          </div>
        </button>
      </div>

    </div>
  );
};

export default MentorProfile;