import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, Lightbulb, Zap, AlertCircle, ArrowRight, Camera } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuthContext } from '../../context/AuthContext';
import { awardXP, XP_REWARDS } from '../../utils/gamification';

const MentorSignup4 = () => {
  const navigate = useNavigate();
  const { setUserData } = useAuthContext();

  const [subjects, setSubjects] = useState([]);
  const [languages, setLanguages] = useState(['Hinglish']);
  const [experience, setExperience] = useState('Fresher');
  const [teachingStyle, setTeachingStyle] = useState([]);
  const [hourlyRate, setHourlyRate] = useState(200);
  const [availability, setAvailability] = useState({ AM: [], PM: [] });
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
        college: signupData.college || '',
        degree: signupData.degree || '',
        graduationYear: signupData.graduationYear || '',
        upiId: signupData.upiId || '',
        subjects,
        languages,
        experience,
        teachingStyle,
        hourlyRate: Number(hourlyRate),
        bio,
        availability,
        xp: XP_REWARDS.SIGNUP,
        level: 1,
        streak: 1,
        lastLoginDate: serverTimestamp(),
        verificationStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', signupData.uid), userDoc);
      setUserData({ id: signupData.uid, ...userDoc });
      awardXP(signupData.uid, XP_REWARDS.PROFILE_COMPLETE, 'Mentor profile complete').catch(console.error);
      sessionStorage.removeItem('senjr_signup');
      navigate('/signup/mentor/success', { replace: true });
    } catch (err) {
      console.error('Mentor signup error:', err);
      setError('Failed to save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) setList(list.filter(i => i !== item));
    else setList([...list, item]);
  };

  const toggleAvailability = (period, day) => {
    const list = availability[period];
    if (list.includes(day)) setAvailability({ ...availability, [period]: list.filter(d => d !== day) });
    else setAvailability({ ...availability, [period]: [...list, day] });
  };

  const allSubjects = ['BBA', 'Economics', 'English', 'BCom', 'Maths', 'Reasoning', 'GK', 'UP Police', 'SSC', 'Banking'];
  const allLanguages = ['English', 'Hinglish', 'Hindi'];
  const allExperiences = ['College Senior', 'Fresher', '1-2 Years'];
  const allStyles = ['Conceptual', 'Exam-focused', 'Practical', 'Doubt-solving'];
  const days = [
    { label: 'M', value: 'M' }, { label: 'T', value: 'Tu' }, { label: 'W', value: 'W' },
    { label: 'T', value: 'T' }, { label: 'F', value: 'F' },
    { label: 'S', value: 'S' }, { label: 'S', value: 'Su' },
  ];

  const completeness = Math.min(95, 20 + (subjects.length > 0 ? 15 : 0) + (bio.length > 10 ? 15 : 0) + (teachingStyle.length > 0 ? 15 : 0) + (hourlyRate > 0 ? 15 : 0) + (availability.AM.length + availability.PM.length > 0 ? 15 : 0));

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col pb-28">
      {/* Header */}
      <header className="flex items-center px-5 py-4 relative">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center z-10 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-base font-bold">Complete Your Profile</h1>
        </div>
      </header>

      {/* Progress */}
      <div className="flex justify-center gap-1.5 mt-1 mb-2 px-5">
        <div className="flex-1 h-1.5 rounded-full bg-mentor-500" />
        <div className="flex-1 h-1.5 rounded-full bg-mentor-500" />
        <div className="flex-1 h-1.5 rounded-full bg-mentor-500" />
        <div className="flex-1 h-1.5 rounded-full bg-mentor-500" />
      </div>
      <p className="text-center text-xs text-gray-500 font-medium mb-5">Step 4 of 4</p>

      <main className="flex-1 px-5">
        {error && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-100 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-mentor-400 transition-colors">
            <Camera className="w-7 h-7 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Upload Photo</span>
          </div>
          <span className="text-xs font-semibold text-gray-600 mt-2">Professional Photo</span>
        </div>

        <div className="space-y-7">
          {/* Subjects */}
          <section>
            <div className="flex justify-between items-end mb-3">
              <h2 className="text-lg font-bold">Subjects</h2>
              <span className="text-[10px] font-bold text-mentor-500 tracking-wider">MULTI-SELECT</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allSubjects.map(subject => (
                <button key={subject} type="button" onClick={() => toggleSelection(subject, subjects, setSubjects)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    subjects.includes(subject) ? 'bg-mentor-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}>
                  {subject}
                </button>
              ))}
            </div>
          </section>

          {/* Languages */}
          <section>
            <h2 className="text-lg font-bold mb-3">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {allLanguages.map(lang => (
                <button key={lang} type="button" onClick={() => toggleSelection(lang, languages, setLanguages)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    languages.includes(lang) ? 'bg-mentor-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}>
                  {lang}
                </button>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-lg font-bold mb-3">Experience</h2>
            <div className="flex gap-2">
              {allExperiences.map(exp => (
                <button key={exp} type="button" onClick={() => setExperience(exp)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                    experience === exp ? 'bg-mentor-50 text-mentor-600 border-2 border-mentor-500' : 'bg-white border border-gray-200 text-gray-600'
                  }`}>
                  {exp}
                </button>
              ))}
            </div>
          </section>

          {/* Hourly Rate */}
          <section className="border border-gray-200 rounded-2xl p-5 bg-white">
            <h2 className="text-lg font-bold mb-1">Hourly Rate</h2>
            <div className="text-3xl font-black text-center mb-4 text-mentor-600">₹{hourlyRate}</div>
            <input type="range" min="50" max="2000" step="50" value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-mentor-500 mb-2" />
            <div className="flex justify-between text-xs font-medium text-gray-400 mb-4">
              <span>₹50</span><span>₹2000</span>
            </div>
            <div className="bg-mentor-50 border border-mentor-200 rounded-xl py-2 px-3 flex items-center justify-center gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-mentor-500" />
              <span className="text-xs font-medium text-gray-600">Suggested: ₹200 based on experience</span>
            </div>
          </section>

          {/* Availability */}
          <section>
            <h2 className="text-lg font-bold mb-3">Availability</h2>
            <div className="border border-gray-200 rounded-2xl p-4 bg-white">
              <div className="grid grid-cols-8 gap-1.5 items-center mb-3 text-center">
                <div />
                {days.map((day, i) => (
                  <div key={i} className="text-[10px] font-bold text-gray-500">{day.label}</div>
                ))}

                <div className="text-[10px] font-bold text-gray-700">AM</div>
                {days.map((day, i) => (
                  <button key={`am-${i}`} type="button" onClick={() => toggleAvailability('AM', day.value)}
                    className={`aspect-square rounded-lg border transition-all ${
                      availability.AM.includes(day.value) ? 'bg-mentor-500 border-mentor-600' : 'bg-gray-50 border-gray-200'
                    }`} />
                ))}

                <div className="text-[10px] font-bold text-gray-700">PM</div>
                {days.map((day, i) => (
                  <button key={`pm-${i}`} type="button" onClick={() => toggleAvailability('PM', day.value)}
                    className={`aspect-square rounded-lg border transition-all ${
                      availability.PM.includes(day.value) ? 'bg-mentor-500 border-mentor-600' : 'bg-gray-50 border-gray-200'
                    }`} />
                ))}
              </div>

              <button type="button" className="w-full py-2.5 rounded-xl border border-gray-200 flex items-center justify-center gap-2 font-semibold text-xs bg-white hover:bg-gray-50 transition-colors text-gray-600">
                <Zap className="w-4 h-4 text-mentor-500" /> Quick select: Weekdays 6-8 PM
              </button>
            </div>
          </section>

          {/* Teaching Style */}
          <section>
            <h2 className="text-lg font-bold mb-3">Teaching Style</h2>
            <div className="flex flex-wrap gap-2">
              {allStyles.map(style => (
                <button key={style} type="button" onClick={() => toggleSelection(style, teachingStyle, setTeachingStyle)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    teachingStyle.includes(style) ? 'bg-mentor-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}>
                  {style}
                </button>
              ))}
            </div>
          </section>

          {/* Bio */}
          <section>
            <div className="flex justify-between items-end mb-3">
              <h2 className="text-lg font-bold">Bio</h2>
              <span className="text-xs text-gray-400">{bio.length}/300</span>
            </div>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300}
              placeholder="Tell students about yourself..."
              rows={4}
              className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-mentor-500 resize-none text-sm font-medium placeholder-gray-400" />
          </section>

          {/* Profile Completeness */}
          <div className="flex items-center justify-between py-4 px-4 border border-gray-200 rounded-2xl bg-gray-50">
            <div className="flex-1 mr-4">
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                <span>Profile Completeness</span>
                <span>{completeness}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-mentor-500 rounded-full transition-all" style={{ width: `${completeness}%` }} />
              </div>
            </div>
            <span className="bg-mentor-50 text-mentor-600 px-3 py-1 text-xs font-bold rounded-full">⭐ +50 XP</span>
          </div>
        </div>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/95 backdrop-blur-sm border-t border-gray-100 z-50">
        <button onClick={handleContinue} disabled={loading}
          className="w-full py-4 rounded-2xl bg-mentor-500 text-white text-center font-bold text-base hover:bg-mentor-600 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (<>🚀 Go Live as Mentor <ArrowRight className="w-5 h-5" /></>)}
        </button>
        <p className="text-center text-[11px] text-gray-400 mt-2">By going live, you agree to our terms</p>
      </div>
    </div>
  );
};

export default MentorSignup4;