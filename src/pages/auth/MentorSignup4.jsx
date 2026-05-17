import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, Lightbulb, Zap, AlertCircle } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { awardXP, XP_REWARDS } from '../../utils/gamification';

const MentorSignup4 = () => {
  const navigate = useNavigate();
  
  // State for multi-selects
  const [subjects, setSubjects] = useState(['BBA', 'Economics', 'English']);
  const [languages, setLanguages] = useState(['English', 'Hinglish']);
  const [experience, setExperience] = useState('Fresher');
  const [teachingStyle, setTeachingStyle] = useState(['Exam-focused', 'Doubt-solving']);
  
  // State for hourly rate
  const [hourlyRate, setHourlyRate] = useState(250);
  
  // State for availability
  const [availability, setAvailability] = useState({
    AM: [],
    PM: ['T', 'F', 'S', 'Su'] // representing Th, F, Sa, Su
  });

  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async (e) => {
    e.preventDefault();
    setError('');

    const signupData = JSON.parse(sessionStorage.getItem('senjr_signup') || '{}');
    if (!signupData.uid) {
      setError('Session expired. Please start signup again.');
      return;
    }

    setLoading(true);
    try {
      const userDoc = {
        uid: signupData.uid,
        email: signupData.email,
        displayName: signupData.fullName,
        phone: signupData.phone,
        role: 'mentor',
        // Profile
        college: signupData.college || '',
        degree: signupData.degree || '',
        graduationYear: signupData.graduationYear || '',
        upiId: signupData.upiId || '',
        // Step 4
        subjects,
        languages,
        experience,
        teachingStyle,
        hourlyRate: Number(hourlyRate),
        bio,
        availability,
        // Gamification
        xp: XP_REWARDS.SIGNUP,
        level: 1,
        streak: 1,
        lastLoginDate: serverTimestamp(),
        // Status — mentors need admin approval
        verificationStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', signupData.uid), userDoc);
      await awardXP(signupData.uid, XP_REWARDS.PROFILE_COMPLETE, 'Mentor profile complete');

      sessionStorage.removeItem('senjr_signup');
      navigate('/signup/mentor/success');
    } catch (err) {
      console.error('Mentor signup error:', err);
      setError('Failed to save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const toggleAvailability = (period, day) => {
    const list = availability[period];
    if (list.includes(day)) {
      setAvailability({ ...availability, [period]: list.filter(d => d !== day) });
    } else {
      setAvailability({ ...availability, [period]: [...list, day] });
    }
  };

  // Helper arrays
  const allSubjects = ['BBA', 'Economics', 'English', 'BCom', 'Maths', 'Reasoning', 'GK', 'UP Police', 'SSC', 'Banking'];
  const allLanguages = ['English', 'Hinglish', 'Hindi'];
  const allExperiences = ['College Senior', 'Fresher', '1-2 Years'];
  const allStyles = ['Conceptual', 'Exam-focused', 'Practical', 'Doubt-solving'];
  const days = [
    { label: 'M', value: 'M' },
    { label: 'T', value: 'Tu' },
    { label: 'W', value: 'W' },
    { label: 'T', value: 'T' },
    { label: 'F', value: 'F' },
    { label: 'S', value: 'S', isWeekend: true },
    { label: 'S', value: 'Su', isWeekend: true },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 flex flex-col pb-28">
      {/* Header */}
      <header className="flex items-center px-4 py-4 relative bg-[#F8FAF9]">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center z-10 bg-transparent">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <div className="absolute inset-0 flex items-center pl-14 pointer-events-none">
          <h1 className="text-xl font-bold font-display">Complete Your Profile</h1>
        </div>
      </header>

      <main className="flex-1 px-4 mt-2">
        
        {error && (
          <div className="flex items-center gap-3 mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}
        {/* Progress Dots */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex gap-4 mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="relative">
                <div className="w-3 h-3 bg-[#4b3e3d] rounded-full shadow-[1px_1px_0px_0px_rgba(249,115,22,1)]"></div>
                {step < 4 && <div className="absolute top-1.5 left-5 w-6 h-[1.5px] bg-gray-400"></div>}
              </div>
            ))}
          </div>
          <span className="text-[10px] font-bold text-gray-600 tracking-wider">STEP 4 OF 4</span>
        </div>

        {/* Profile Photo Upload */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-full"></div>
            <div className="relative w-24 h-24 bg-[#EBF4FF] border-2 border-gray-900 rounded-full flex flex-col items-center justify-center">
              <UserCheck className="w-7 h-7 text-gray-700 mb-1" />
              <span className="text-[10px] font-bold text-gray-900">Upload</span>
              <span className="text-[10px] font-bold text-gray-900 leading-none">Photo</span>
            </div>
          </div>
          <span className="text-xs font-bold text-gray-900 mt-4">Professional Photo</span>
        </div>

        <form className="space-y-8">
          
          {/* Subjects */}
          <div className="space-y-3">
            <div className="flex justify-between items-end border-b-2 border-gray-900 pb-1">
              <h2 className="text-xl font-bold font-display">Subjects</h2>
              <span className="text-[10px] font-bold text-[#f97316] tracking-wider">MULTI-SELECT</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {allSubjects.map(subject => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => toggleSelection(subject, subjects, setSubjects)}
                  className={`px-4 py-1.5 border-2 border-gray-900 text-sm font-bold transition-all ${
                    subjects.includes(subject)
                      ? 'bg-[#f97316] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] -translate-y-0.5'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <div className="border-b-2 border-gray-900 pb-1">
              <h2 className="text-xl font-bold font-display">Languages</h2>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {allLanguages.map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleSelection(lang, languages, setLanguages)}
                  className={`px-4 py-1.5 border-2 border-gray-900 text-sm font-bold transition-all ${
                    languages.includes(lang)
                      ? 'bg-[#f97316] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] -translate-y-0.5'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-3">
            <div className="border-b-2 border-gray-900 pb-1">
              <h2 className="text-xl font-bold font-display">Experience</h2>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {allExperiences.map(exp => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setExperience(exp)}
                  className={`flex-1 min-w-[100px] py-4 border-2 border-gray-900 text-sm font-bold transition-all ${
                    experience === exp
                      ? 'bg-[#FFF4ED] text-[#f97316] shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] -translate-y-1'
                      : 'bg-white text-gray-600'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Hourly Rate */}
          <div className="relative mt-12 mb-8">
            <div className="absolute -top-4 -right-2 bg-[#6EE7B7] border-2 border-gray-900 px-3 py-1 text-xs font-bold text-gray-900 z-10 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] -rotate-3">
              Income info
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5"></div>
              <div className="relative bg-white border-2 border-gray-900 p-6 flex flex-col items-center">
                <h2 className="text-lg font-bold font-display self-start mb-2">Hourly Rate</h2>
                <div className="text-4xl font-black mb-6">₹{hourlyRate}</div>
                
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#f97316] mb-2"
                />
                
                <div className="flex justify-between w-full text-xs font-bold text-gray-500 mb-6">
                  <span>₹50</span>
                  <span>₹2000</span>
                </div>
                
                <div className="w-full border border-dashed border-gray-400 bg-gray-50 py-2 px-3 flex items-center justify-center gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-[#f97316]" />
                  <span className="text-[10px] font-bold text-gray-500">Suggested: ₹200 based on experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <div className="border-b-2 border-gray-900 pb-1">
              <h2 className="text-xl font-bold font-display">Availability</h2>
            </div>
            
            <div className="bg-white border-2 border-gray-900 p-4">
              <div className="grid grid-cols-8 gap-2 items-center mb-4 text-center">
                <div className="text-xs font-bold text-gray-400"></div>
                {days.map((day, i) => (
                  <div key={i} className={`text-[10px] font-bold ${day.isWeekend ? 'text-red-500' : 'text-gray-900'}`}>
                    {day.label}
                  </div>
                ))}
                
                <div className="text-[10px] font-bold text-gray-900 pr-2">AM</div>
                {days.map((day, i) => (
                  <button
                    key={`am-${i}`}
                    type="button"
                    onClick={() => toggleAvailability('AM', day.value)}
                    className={`w-full aspect-square border-2 ${
                      availability.AM.includes(day.value) 
                        ? 'bg-[#f97316] border-gray-900' 
                        : 'bg-[#F4F8FF] border-dashed border-gray-300'
                    }`}
                  />
                ))}
                
                <div className="text-[10px] font-bold text-gray-900 pr-2 pt-2">PM</div>
                {days.map((day, i) => (
                  <button
                    key={`pm-${i}`}
                    type="button"
                    onClick={() => toggleAvailability('PM', day.value)}
                    className={`w-full aspect-square mt-2 border-2 ${
                      availability.PM.includes(day.value) 
                        ? 'bg-[#f97316] border-gray-900' 
                        : 'bg-[#F4F8FF] border-dashed border-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button type="button" className="w-full py-2.5 border-2 border-gray-900 flex items-center justify-center gap-2 font-bold text-xs bg-white active:bg-gray-50 transition-colors shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]">
                <Zap className="w-4 h-4" /> Quick select: Weekdays 6-8 PM
              </button>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-3">
            <div className="flex justify-between items-end border-b-2 border-gray-900 pb-1">
              <h2 className="text-xl font-bold font-display">Bio</h2>
              <span className="text-xs font-bold text-gray-500">{bio.length}/300</span>
            </div>
            <div className="relative group mt-2">
              <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5"></div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
                placeholder="Tell students about yourself..."
                rows={4}
                className="relative w-full border-2 border-gray-900 p-4 focus:outline-none resize-none text-sm font-medium placeholder-gray-500 bg-white"
              />
            </div>
          </div>

          {/* Teaching Style */}
          <div className="space-y-3 mb-6">
            <div className="border-b-2 border-gray-900 pb-1">
              <h2 className="text-xl font-bold font-display">Teaching Style</h2>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {allStyles.map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleSelection(style, teachingStyle, setTeachingStyle)}
                  className={`px-4 py-2 border-2 border-gray-900 text-xs font-bold transition-all ${
                    teachingStyle.includes(style)
                      ? 'bg-[#f97316] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] -translate-y-0.5'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Completeness */}
          <div className="flex items-center justify-between pb-6">
            <div className="flex-1 mr-4">
              <div className="flex justify-between text-[10px] font-bold text-gray-900 mb-1.5">
                <span>Profile Completeness</span>
                <span>95%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200">
                <div className="h-full bg-gray-900 w-[95%]"></div>
              </div>
            </div>
            <div className="bg-[#FEF08A] border border-gray-900 px-3 py-1 text-xs font-bold flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]">
              <span>☆</span> +50 XP
            </div>
          </div>

        </form>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white z-50 pt-2 pb-4 px-4 border-t border-gray-200">
        <button 
          onClick={handleContinue}
          disabled={loading}
          className="w-full group relative block mb-2"
        >
          <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 transition-transform group-active:translate-x-0 group-active:translate-y-0" />
          <div className="relative bg-[#f97316] border-2 border-gray-900 text-gray-900 text-center py-3.5 font-bold text-lg flex items-center justify-center gap-2 transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                Submitting profile...
              </span>
            ) : '🚀 Go Live as Mentor!'}
          </div>
        </button>
        <p className="text-center text-[10px] font-bold text-gray-500">
          By going live, you agree to our terms
        </p>
      </div>
    </div>
  );
};

export default MentorSignup4;