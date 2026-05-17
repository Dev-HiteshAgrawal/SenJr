import React from 'react';
import { ArrowLeft, Filter, CheckCircle2, User, Medal, GraduationCap, TrendingUp, Lightbulb, Home, BookOpen, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WarRoom = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 flex flex-col pb-24">
      
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold font-display text-gray-900">War Room</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-1">
            <Filter className="w-5 h-5 text-gray-700" />
          </button>
          <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
            <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-6 space-y-5">
        
        {/* Title */}
        <div>
          <h2 className="text-xl font-bold font-display text-gray-900 mb-1">Exam War Rooms</h2>
          <p className="text-sm font-medium text-gray-500">30-day intensive prep with verified seniors</p>
        </div>

        {/* Card 1: UP Police Constable */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#f97316] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg z-10 shadow-sm">
            Most Popular
          </div>
          
          <div className="flex items-start gap-4 mb-4 mt-2">
            <div className="w-12 h-12 bg-[#ECFDF5] rounded-xl flex items-center justify-center shrink-0 border border-[#D1FAE5]">
              <Medal className="w-6 h-6 text-[#10b981]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">UP Police Constable</h3>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">₹299</span>
                <span className="text-sm text-gray-400 line-through font-medium">₹599</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700 font-medium">4 Live Sessions + Daily WhatsApp</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700 font-medium">Mock Tests & PyQ Analysis</span>
            </div>
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700 font-medium">Mentor: Rahul Sir (UP Police Cleared)</span>
            </div>
          </div>
          
          <button className="w-full bg-[#10b981] text-white font-bold py-3 rounded-full active:bg-emerald-600 transition-colors text-sm shadow-sm">
            Enroll Now
          </button>
        </div>

        {/* Card 2: SSC CGL */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-4 mb-4 mt-2">
            <div className="w-12 h-12 bg-[#FFF7ED] rounded-xl flex items-center justify-center shrink-0 border border-[#FFEDD5]">
              <GraduationCap className="w-6 h-6 text-[#B45309]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">SSC CGL</h3>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">₹299</span>
                <span className="text-sm text-gray-400 line-through font-medium">₹599</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700 font-medium">4 Live Sessions + Daily WhatsApp</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700 font-medium">Comprehensive Mock Series</span>
            </div>
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700 font-medium">Mentor: Senior CGL Officer</span>
            </div>
          </div>
          
          <button className="w-full bg-[#10b981] text-white font-bold py-3 rounded-full active:bg-emerald-600 transition-colors text-sm shadow-sm">
            Enroll Now
          </button>
        </div>

        {/* Card 3: BBA Entrance */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-4 mb-4 mt-2">
            <div className="w-12 h-12 bg-[#FFF1F2] rounded-xl flex items-center justify-center shrink-0 border border-[#FFE4E6]">
              <TrendingUp className="w-6 h-6 text-[#BE123C]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">BBA Entrance</h3>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">₹199</span>
                <span className="text-sm text-gray-400 line-through font-medium">₹399</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700 font-medium">4 Live Sessions + Daily WhatsApp</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700 font-medium">Interview Prep & Aptitude Tests</span>
            </div>
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700 font-medium">Mentor: IIM Alumni Mentor</span>
            </div>
          </div>
          
          <button className="w-full bg-[#10b981] text-white font-bold py-3 rounded-full active:bg-emerald-600 transition-colors text-sm shadow-sm">
            Enroll Now
          </button>
        </div>

        {/* AI Career Advisor Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-2xl p-4 flex items-center justify-between shadow-sm mt-8">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Lightbulb className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-gray-800">Not sure which exam?</span>
            </div>
            <p className="text-sm font-medium text-gray-600">Talk to our AI Career<br/>Advisor</p>
          </div>
          <button className="bg-[#0F172A] text-white text-xs font-bold px-4 py-2.5 rounded-full active:bg-gray-800 transition-colors shadow-md">
            Consult
          </button>
        </div>

        {/* Abstract Studying Image Placeholder */}
        <div className="w-full h-32 rounded-2xl overflow-hidden mt-6 relative shadow-sm">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Students studying" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAF9] to-transparent"></div>
        </div>

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center z-50">
        <button className="flex flex-col items-center gap-1 opacity-50" onClick={() => navigate('/dashboard/student')}>
          <Home className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-50">
          <BookOpen className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Courses</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Trophy className="w-6 h-6 text-[#10b981]" fill="#10b981" fillOpacity={0.2} />
          <span className="text-[10px] font-bold text-[#10b981]">War Room</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-50">
          <User className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Profile</span>
        </button>
      </nav>

    </div>
  );
};

export default WarRoom;