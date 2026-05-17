import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Briefcase, GraduationCap, Wrench, TrendingDown, TrendingUp, ArrowRight } from 'lucide-react';

const StudentSignup2 = () => {
  const navigate = useNavigate();
  const [primaryGoal, setPrimaryGoal] = useState('Govt Job');
  const [targetExams, setTargetExams] = useState([]);
  const [weakSubjects, setWeakSubjects] = useState([]);
  const [strongSubjects, setStrongSubjects] = useState([]);
  const [preferredLanguage, setPreferredLanguage] = useState('Hinglish');
  const [studyHours, setStudyHours] = useState('3-4h');

  const toggleArrayItem = (item, array, setArray) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const existing = JSON.parse(sessionStorage.getItem('senjr_signup') || '{}');
    sessionStorage.setItem('senjr_signup', JSON.stringify({
      ...existing,
      primaryGoal,
      targetExams,
      weakSubjects,
      strongSubjects,
      preferredLanguage,
      studyHoursPerDay: studyHours,
    }));
    navigate('/signup/student/3');
  };

  const GOALS = [
    { id: 'Govt Job', icon: Building2, label: 'Govt Job' },
    { id: 'Private Job', icon: Briefcase, label: 'Private Job' },
    { id: 'Higher Studies', icon: GraduationCap, label: 'Higher Studies' },
    { id: 'Skill Learning', icon: Wrench, label: 'Skill Learning' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f9f7] font-sans text-gray-900 flex flex-col pb-28">
      {/* Header */}
      <header className="flex items-center px-5 py-4 relative bg-[#f5f9f7]">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center z-10 bg-white hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-base font-bold tracking-wide">Your Goals</h1>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="flex justify-center gap-1.5 mt-1 mb-6 px-5">
        <div className="w-6 h-1.5 rounded-full bg-gray-300" />
        <div className="w-10 h-1.5 rounded-full bg-primary-500" />
        <div className="w-6 h-1.5 rounded-full bg-gray-300" />
        <div className="w-6 h-1.5 rounded-full bg-gray-300" />
      </div>

      <main className="flex-1 px-5">
        {/* Primary Goal */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4">What is your primary goal?</h2>
          <div className="grid grid-cols-2 gap-3">
            {GOALS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setPrimaryGoal(id)}
                className={`relative p-5 rounded-2xl border flex flex-col items-center justify-center gap-2.5 transition-all ${
                  primaryGoal === id
                    ? 'border-primary-500 bg-primary-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {primaryGoal === id && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-mentor-300 rounded-full" />
                )}
                <Icon className={`w-6 h-6 ${primaryGoal === id ? 'text-primary-600' : 'text-gray-500'}`} />
                <span className="font-semibold text-sm">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <hr className="border-gray-200 mb-8" />

        {/* Target Exams */}
        <section className="mb-8">
          <div className="flex items-baseline gap-2 mb-4">
            <h2 className="text-lg font-bold">Target Exams</h2>
            <span className="text-xs text-gray-400 font-medium">(Select multiple)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['UP Police', 'SSC CGL', 'Banking', 'CAT', 'MAT', 'CUET'].map(exam => (
              <button
                key={exam}
                onClick={() => toggleArrayItem(exam, targetExams, setTargetExams)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  targetExams.includes(exam)
                    ? 'bg-primary-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {exam}
              </button>
            ))}
          </div>
        </section>

        <hr className="border-gray-200 mb-8" />

        {/* Weak Subjects */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-bold">Weak Subjects</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Maths', 'English', 'GK', 'Reasoning', 'Science', 'Hindi'].map(subject => (
              <button
                key={subject}
                onClick={() => toggleArrayItem(subject, weakSubjects, setWeakSubjects)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  weakSubjects.includes(subject)
                    ? 'bg-mentor-400 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </section>

        <hr className="border-gray-200 mb-8" />

        {/* Strong Subjects */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-bold">Strong Subjects</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Maths', 'English', 'GK', 'Reasoning', 'Science', 'Hindi'].map(subject => (
              <button
                key={subject}
                onClick={() => toggleArrayItem(subject, strongSubjects, setStrongSubjects)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  strongSubjects.includes(subject)
                    ? 'bg-primary-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </section>

        <hr className="border-gray-200 mb-8" />

        {/* Preferred Language */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4">Preferred Language</h2>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
            {['Hindi', 'English', 'Hinglish'].map((lang) => (
              <button
                key={lang}
                onClick={() => setPreferredLanguage(lang)}
                className={`flex-1 py-3 font-semibold text-sm transition-all ${
                  preferredLanguage === lang
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </section>

        {/* Study Hours */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-4">Study Hours / Day</h2>
          <div className="flex flex-wrap gap-2">
            {['1-2h', '3-4h', '5-6h', '6h+'].map(hours => (
              <button
                key={hours}
                onClick={() => setStudyHours(hours)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  studyHours === hours
                    ? 'bg-mentor-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {hours}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/95 backdrop-blur-sm border-t border-gray-100 z-50">
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-primary-500 text-white text-center font-bold text-base hover:bg-primary-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StudentSignup2;