import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, Lock, FileText, ChevronDown, CheckCircle2, VideoOff, Upload, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col pb-28">
      {/* Header */}
      <header className="flex items-center px-5 py-4 relative">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center z-10 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-base font-bold">Introduce Yourself</h1>
        </div>
      </header>

      {/* Progress */}
      <div className="flex justify-center gap-1.5 mt-1 mb-2 px-5">
        <div className="flex-1 h-1.5 rounded-full bg-mentor-500" />
        <div className="flex-1 h-1.5 rounded-full bg-mentor-500" />
        <div className="flex-1 h-1.5 rounded-full bg-mentor-500" />
        <div className="flex-1 h-1.5 rounded-full bg-gray-200" />
      </div>
      <p className="text-center text-xs text-gray-500 font-medium mb-5">Step 3 of 4</p>

      <main className="flex-1 px-5">
        {/* Banner */}
        <div className="bg-mentor-50 border border-mentor-200 rounded-2xl p-4 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-mentor-500 rounded-xl flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm font-bold text-gray-900">60-second video = Your first impression</p>
        </div>

        {/* Record / Upload Tabs */}
        <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-6 bg-gray-50">
          <button
            onClick={() => setActiveTab('record')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold text-sm transition-all ${
              activeTab === 'record' ? 'bg-mentor-500 text-white rounded-xl shadow-sm' : 'text-gray-500'
            }`}
          >
            <Video className="w-4 h-4" /> Record Live
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold text-sm transition-all ${
              activeTab === 'upload' ? 'bg-mentor-500 text-white rounded-xl shadow-sm' : 'text-gray-500'
            }`}
          >
            <Upload className="w-4 h-4" /> Upload Video
          </button>
        </div>

        {/* Camera Preview */}
        <div className="bg-gray-900 rounded-2xl h-72 flex flex-col items-center justify-center p-6 text-center mb-6 relative overflow-hidden">
          <VideoOff className="w-10 h-10 text-white/60 mb-3" strokeWidth={1.5} />
          <p className="text-white/70 text-sm font-medium mb-5 px-4">Camera access is required to record your introduction.</p>
          <button className="bg-mentor-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm hover:bg-mentor-600 transition-colors">
            <Lock className="w-4 h-4" /> Allow camera access
          </button>
        </div>

        {/* Topic */}
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-1">Topic</h2>
          <p className="text-sm text-gray-600">Introduce yourself and why you want to mentor</p>
        </div>

        {/* Sample Script */}
        <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-mentor-50/50 mb-4 hover:bg-mentor-50 transition-colors">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-mentor-600" />
            <span className="font-semibold text-sm text-mentor-700">Sample script</span>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </button>

        {/* Guidelines */}
        <div className="border border-gray-200 rounded-2xl p-5 bg-white">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Guidelines</h3>
          <ul className="space-y-3">
            {['Face clearly visible', 'Speak in Hindi or Hinglish', '60 seconds ideal', 'Smile and be yourself!'].map(item => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-mentor-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/95 backdrop-blur-sm border-t border-gray-100 z-50">
        <button onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-mentor-500 text-white text-center font-bold text-base hover:bg-mentor-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          Submit Video <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MentorSignup3;