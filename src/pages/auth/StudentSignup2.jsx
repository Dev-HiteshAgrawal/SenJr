import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Briefcase, GraduationCap, Wrench, TrendingDown, TrendingUp, ArrowRight } from 'lucide-react';

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
    // Merge step 2 data into sessionStorage
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
    { id: 'Govt Job', icon: Building, label: 'Govt Job' },
    { id: 'Private Job', icon: Briefcase, label: 'Private Job' },
    { id: 'Higher Studies', icon: GraduationCap, label: 'Higher Studies' },
    { id: 'Skill Learning', icon: Wrench, label: 'Skill Learning' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 flex flex-col pb-24">
      <header className="flex items-center px-4 py-4 relative bg-white border-b-2 border-gray-900">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl border-2 border-gray-900 flex items-center justify-center z-10 bg-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-lg font-bold tracking-wide">Your Goals</h1>
        </div>
      </header>

      <main className="flex-1 px-5 pt-6">
        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-6 h-1.5 rounded-full border border-gray-900 bg-gray-200" />
          <div className="w-8 h-1.5 rounded-full border border-gray-900 bg-primary-500" />
          <div className="w-6 h-1.5 rounded-full border border-gray-900 bg-gray-200" />
          <div className="w-6 h-1.5 rounded-full border border-gray-900 bg-gray-200" />
        </div>

        {/* Primary Goal */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 font-display text-gray-900">What is your primary goal?</h2>
          <div className="grid grid-cols-2 gap-3">
            {GOALS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setPrimaryGoal(id)}
                className={`relative p-4 rounded-xl border-2 border-gray-900 flex flex-col items-center justify-center gap-2 transition-all shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] ${
                  primaryGoal === id ? 'bg-[#E8F5EE]' : 'bg-white active:shadow-none active:translate-x-[3px] active:translate-y-[3px]'
                }`}
              >
                <Icon className={`w-6 h-6 ${primaryGoal === id ? 'text-primary-600' : 'text-gray-700'}`} />
                <span className="font-bold text-sm text-center">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <hr className="border-t-2 border-gray-200 mb-8" />

        {/* Target Exams */}
        <section className="mb-8">
          <div className="flex items-baseline gap-2 mb-4">
            <h2 className="text-xl font-bold font-display text-gray-900">Target Exams</h2>
            <span className="text-xs text-gray-500 font-medium">(Select multiple)</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {['UP Police', 'SSC CGL', 'Banking', 'CAT', 'MAT', 'CUET', 'UPSC', 'JEE'].map(exam => (
              <button
                key={exam}
                onClick={() => toggleArrayItem(exam, targetExams, setTargetExams)}
                className={`px-4 py-2 rounded-full border-2 border-gray-900 font-bold text-sm transition-all ${
                  targetExams.includes(exam)
                    ? 'bg-primary-500 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] text-gray-900'
                    : 'bg-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                }`}
              >
                {exam}
              </button>
            ))}
          </div>
        </section>

        <hr className="border-t-2 border-gray-200 mb-8" />

        {/* Weak Subjects */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold font-display text-gray-900">Weak Subjects</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {['Maths', 'English', 'GK', 'Reasoning', 'Science', 'Hindi'].map(subject => (
              <button
                key={subject}
                onClick={() => toggleArrayItem(subject, weakSubjects, setWeakSubjects)}
                className={`px-5 py-2 rounded-full border-2 border-gray-900 font-bold text-sm transition-all ${
                  weakSubjects.includes(subject)
                    ? 'bg-orange-300 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                    : 'bg-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </section>

        <hr className="border-t-2 border-gray-200 mb-8" />

        {/* Strong Subjects */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold font-display text-gray-900">Strong Subjects</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {['Maths', 'English', 'GK', 'Reasoning', 'Science', 'Hindi'].map(subject => (
              <button
                key={subject}
                onClick={() => toggleArrayItem(subject, strongSubjects, setStrongSubjects)}
                className={`px-5 py-2 rounded-full border-2 border-gray-900 font-bold text-sm transition-all ${
                  strongSubjects.includes(subject)
                    ? 'bg-primary-500 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
                    : 'bg-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </section>

        <hr className="border-t-2 border-gray-200 mb-8" />

        {/* Language */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 font-display text-gray-900">Preferred Language</h2>
          <div className="flex border-2 border-gray-900 rounded-lg shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] overflow-hidden bg-white">
            {['Hindi', 'English', 'Hinglish'].map((lang, index) => (
              <button
                key={lang}
                onClick={() => setPreferredLanguage(lang)}
                className={`flex-1 py-3 font-bold text-sm border-gray-900 ${index !== 2 ? 'border-r-2' : ''} ${
                  preferredLanguage === lang ? 'bg-primary-500 text-gray-900' : 'hover:bg-gray-50'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </section>

        {/* Study Hours */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-4 font-display text-gray-900">Study Hours / Day</h2>
          <div className="flex flex-wrap gap-3">
            {['1-2h', '3-4h', '5-6h', '6h+'].map(hours => (
              <button
                key={hours}
                onClick={() => setStudyHours(hours)}
                className={`px-5 py-2.5 rounded-full border-2 border-gray-900 font-bold text-sm transition-all ${
                  studyHours === hours
                    ? 'bg-orange-500 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] text-white'
                    : 'bg-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                }`}
              >
                {hours}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-gray-900 z-50">
        <button onClick={handleContinue} className="w-full group relative block">
          <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-none transition-transform group-active:translate-x-0 group-active:translate-y-0" />
          <div className="relative bg-primary-500 border-2 border-gray-900 text-gray-900 text-center py-3.5 font-bold text-lg flex items-center justify-center gap-2 transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
            Continue <ArrowRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default StudentSignup2;