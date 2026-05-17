import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Star, CheckCircle2, Link as LinkIcon, MessageSquare, AlertCircle } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { useAuthContext } from '../../context/AuthContext';
import { awardXP, XP_REWARDS } from '../../utils/gamification';

const StudentSignup4 = () => {
  const navigate = useNavigate();
  const { setUserData } = useAuthContext();
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [whatsappSameNumber, setWhatsappSameNumber] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be under 5MB');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = async () => {
    setError('');
    const signupData = JSON.parse(sessionStorage.getItem('senjr_signup') || '{}');
    if (!signupData.uid) {
      setError('Session expired. Please start signup again.');
      return;
    }

    setLoading(true);
    try {
      let photoURL = '';
      if (profileImage) {
        const storageRef = ref(storage, `profile-photos/${signupData.uid}`);
        const snapshot = await uploadBytes(storageRef, profileImage);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      const userDoc = {
        uid: signupData.uid,
        email: signupData.email,
        displayName: signupData.fullName,
        phone: signupData.phone,
        role: 'student',
        photoURL,
        username: username || '',
        bio: bio || '',
        linkedin: linkedin || '',
        whatsappSameNumber,
        primaryGoal: signupData.primaryGoal || '',
        targetExams: signupData.targetExams || [],
        weakSubjects: signupData.weakSubjects || [],
        strongSubjects: signupData.strongSubjects || [],
        preferredLanguage: signupData.preferredLanguage || '',
        studyHoursPerDay: signupData.studyHoursPerDay || '',
        educationLevel: signupData.educationLevel || '',
        college: signupData.college || '',
        university: signupData.university || '',
        city: signupData.city || '',
        state: signupData.state || '',
        yearOfStudy: signupData.yearOfStudy || '',
        graduationYear: signupData.graduationYear || '',
        referralCode: signupData.referralCode || null,
        xp: XP_REWARDS.SIGNUP,
        level: 1,
        streak: 1,
        lastLoginDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', signupData.uid), userDoc);
      setUserData({ id: signupData.uid, ...userDoc });
      awardXP(signupData.uid, XP_REWARDS.PROFILE_COMPLETE, 'Profile complete').catch(console.error);
      sessionStorage.removeItem('senjr_signup');
      navigate('/dashboard/student', { replace: true });
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-lg font-bold">Complete Profile</h1>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="flex justify-center gap-1.5 mt-1 px-5">
        <div className="flex-1 h-1.5 rounded-full bg-primary-500" />
        <div className="flex-1 h-1.5 rounded-full bg-primary-500" />
        <div className="flex-1 h-1.5 rounded-full bg-primary-500" />
        <div className="flex-1 h-1.5 rounded-full bg-primary-500" />
      </div>
      <p className="text-center text-xs text-gray-500 font-medium mt-1.5 mb-5">Step 4 of 4</p>

      <main className="flex-1 px-5">
        {error && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* XP Banner */}
        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <Star className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">Complete profile to earn +50 XP!</p>
            <span className="inline-block px-2.5 py-0.5 bg-primary-500 text-white text-xs font-bold rounded-full mt-1">
              🏆 Level 1 Newcomer
            </span>
          </div>
        </div>

        {/* Profile Photo Upload */}
        <div className="flex flex-col items-center mb-8">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-100 flex flex-col items-center justify-center gap-1.5 hover:border-primary-400 transition-colors overflow-hidden"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera className="w-7 h-7 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">Tap to upload</span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Username */}
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-bold text-gray-900">Username</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <span className="text-gray-400 font-medium text-sm">@</span>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="senjr_student"
              className="w-full pl-9 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium placeholder-gray-400"
            />
            {username.length >= 3 && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-bold text-gray-900">Bio</label>
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              placeholder="Tell the community a bit about yourself..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium placeholder-gray-400 resize-none"
            />
            <span className="absolute bottom-2.5 right-3 text-xs text-gray-400">{bio.length}/200</span>
          </div>
        </div>

        {/* LinkedIn */}
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-bold text-gray-900">
            LinkedIn <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <LinkIcon className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="linkedin.com/in/username"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium placeholder-gray-400"
            />
          </div>
        </div>

        {/* WhatsApp Toggle */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white mb-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-semibold text-gray-900">Use same number for WhatsApp</span>
          </div>
          <button
            onClick={() => setWhatsappSameNumber(!whatsappSameNumber)}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              whatsappSameNumber ? 'bg-primary-500' : 'bg-gray-300'
            }`}
          >
            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
              whatsappSameNumber ? 'translate-x-5' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/95 backdrop-blur-sm border-t border-gray-100 z-50">
        <button
          onClick={handleComplete}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-primary-500 text-white text-center font-bold text-base hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Setting up...
            </span>
          ) : 'Complete Signup'}
        </button>
      </div>
    </div>
  );
};

export default StudentSignup4;
