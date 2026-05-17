import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, Lock, FileText, ChevronDown, CheckCircle2, VideoOff, Upload, Check } from 'lucide-react';

const MentorSignup3 = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('record');

  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  const handleContinue = (e) => {
    e.preventDefault();
    const existing = JSON.parse(sessionStorage.getItem('senjr_signup') || '{}');
    sessionStorage.setItem('senjr_signup', JSON.stringify({
      ...existing,
      college,
      degree,
      graduationYear,
    }));
    navigate('/signup/mentor/4');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center px-4 py-4 relative bg-[#F8FAF9]">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center z-10 bg-transparent">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-2">
          <h1 className="text-xl font-bold font-display leading-tight">Introduce Yourself</h1>
          
          {/* Progress Pills inside Header */}
          <div className="flex flex-col items-center mt-1">
            <div className="flex items-center gap-1.5 mb-1 w-[120px]">
              <div className="flex-1 h-1.5 rounded-full bg-gray-300 border border-gray-400"></div>
              <div className="flex-1 h-1.5 rounded-full bg-gray-300 border border-gray-400"></div>
              <div className="flex-1 h-1.5 rounded-full bg-[#f97316] border border-gray-900 shadow-[1px_1px_0px_0px_rgba(17,24,39,1)]"></div>
              <div className="flex-1 h-1.5 rounded-full bg-gray-300 border border-gray-400"></div>
            </div>
            <span className="text-[10px] font-bold text-gray-500">Step 3 of 4</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 mt-8">
        
        {/* Banner */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-none"></div>
          <div className="relative bg-[#f97316] border-2 border-gray-900 rounded-none p-3 flex items-center gap-3">
            <div className="bg-gray-900/20 rounded p-1.5">
              <Video className="w-5 h-5 text-gray-900" />
            </div>
            <p className="text-sm font-bold text-gray-900">
              60-second video = Your first impression
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-2 border-gray-900 rounded-none mb-6">
          <button 
            onClick={() => setActiveTab('record')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold text-sm border-r-2 border-gray-900 transition-colors ${
              activeTab === 'record' ? 'bg-[#f97316] text-gray-900' : 'bg-white text-gray-500'
            }`}
          >
            <Video className="w-4 h-4" /> Record Live
          </button>
          <button 
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold text-sm transition-colors ${
              activeTab === 'upload' ? 'bg-[#f97316] text-gray-900' : 'bg-white text-gray-500'
            }`}
          >
            <Upload className="w-4 h-4" /> Upload Video
          </button>
        </div>

        {/* Camera Box */}
        <div className="bg-[#1C1C1E] rounded-none h-80 flex flex-col items-center justify-center p-6 text-center mb-6 relative overflow-hidden">
          <VideoOff className="w-12 h-12 text-white mb-4" strokeWidth={1.5} />
          <p className="text-white text-sm font-medium mb-6 px-4">
            Camera access is required to record your introduction.
          </p>
          <button className="bg-[#f97316] text-gray-900 font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm hover:bg-[#ea580c] transition-colors">
            <Lock className="w-4 h-4" /> Allow camera access
          </button>
          
          {/* Faint blurred background icons */}
          <div className="absolute bottom-6 flex gap-6 opacity-20 blur-sm pointer-events-none">
            <div className="w-12 h-12 bg-white/20 rounded-xl"></div>
            <div className="w-12 h-12 bg-red-500 rounded-full border-4 border-white/20"></div>
            <div className="w-12 h-12 bg-white/20 rounded-xl"></div>
          </div>
        </div>

        {/* Topic & Guidelines */}
        <div className="space-y-4">
          <div className="border-b border-gray-300 pb-2">
            <h2 className="text-lg font-bold font-display text-gray-900 leading-tight">
              Topic: Introduce yourself and why you want to mentor
            </h2>
          </div>

          {/* Sample Script Accordion */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gray-900 translate-y-1 translate-x-1 rounded-none"></div>
            <div className="relative bg-white border-2 border-gray-900 rounded-none p-3 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#8b4513]" />
                <span className="font-bold text-sm text-[#8b4513]">Sample script</span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-900" />
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-none"></div>
            <div className="relative bg-white border-2 border-gray-900 rounded-none p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Guidelines</h3>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#f97316] shrink-0 fill-orange-100" />
                  <span className="text-sm font-medium text-gray-700">Face clearly visible</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#f97316] shrink-0 fill-orange-100" />
                  <span className="text-sm font-medium text-gray-700">Speak in Hindi or Hinglish</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#f97316] shrink-0 fill-orange-100" />
                  <span className="text-sm font-medium text-gray-700">60 seconds ideal</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#f97316] shrink-0 fill-orange-100" />
                  <span className="text-sm font-medium text-gray-700">Smile and be yourself!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F8FAF9] z-50">
        <div className="p-4 bg-white border-t-2 border-gray-900">
          <button 
            onClick={handleContinue}
            className="w-full group relative block"
          >
            <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-none transition-transform group-active:translate-x-0 group-active:translate-y-0"></div>
            <div className="relative bg-[#f97316] border-2 border-gray-900 text-gray-900 text-center py-3.5 font-bold text-lg flex items-center justify-center gap-2 transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
              Submit Video <Check className="w-5 h-5" strokeWidth={3} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorSignup3;