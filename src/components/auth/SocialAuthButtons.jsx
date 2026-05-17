import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAuthContext } from '../../context/AuthContext';
import { getDocument } from '../../firebase/firestore';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

/**
 * Reusable social authentication buttons component.
 * @param {string} role - 'student' or 'mentor' — determines where to redirect and what data to persist
 * @param {function} onError - callback to surface errors to the parent page
 */
const SocialAuthButtons = ({ role = 'student', onError }) => {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithApple } = useAuth();
  const { setUserData } = useAuthContext();
  const [loading, setLoading] = useState(''); // 'google' | 'apple'

  const dashboardPath = role === 'mentor' ? '/dashboard/mentor' : '/dashboard/student';

  const handleSocial = async (provider) => {
    setLoading(provider);
    try {
      const result = provider === 'google'
        ? await signInWithGoogle()
        : await signInWithApple();

      // Check if this user already completed signup
      const existingDoc = await getDocument('users', result.user.uid);
      if (existingDoc) {
        // Returning user — go straight to their dashboard
        setUserData(existingDoc);
        navigate(existingDoc.role === 'mentor' ? '/dashboard/mentor' : '/dashboard/student', { replace: true });
        return;
      }

      // New user — populate session and continue signup flow
      sessionStorage.setItem('senjr_signup', JSON.stringify({
        uid: result.user.uid,
        email: result.user.email,
        fullName: result.user.displayName || '',
        phone: '',
        role,
        fromSocial: true,
      }));

      navigate(role === 'mentor' ? '/signup/mentor/2' : '/signup/student/2');
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;
      if (onError) onError(
        code === 'auth/popup-blocked'
          ? 'Pop-up was blocked. Please allow pop-ups for this site and try again.'
          : 'Social sign-in failed. Please try again.'
      );
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="space-y-3 mb-6">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-4">
        Quick sign up — no password needed
      </p>
      <div className="grid grid-cols-2 gap-3">
        {/* Google */}
        <button
          type="button"
          onClick={() => handleSocial('google')}
          disabled={!!loading}
          className="flex items-center justify-center gap-2.5 bg-white border-2 border-gray-200 rounded-xl py-3 font-semibold text-gray-700 text-sm hover:border-gray-400 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-60"
        >
          {loading === 'google' ? (
            <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : <GoogleIcon />}
          Google
        </button>

        {/* Apple */}
        <button
          type="button"
          onClick={() => handleSocial('apple')}
          disabled={!!loading}
          className="flex items-center justify-center gap-2.5 bg-gray-900 border-2 border-gray-900 rounded-xl py-3 font-semibold text-white text-sm hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-60"
        >
          {loading === 'apple' ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : <AppleIcon />}
          Apple
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center gap-3 pt-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">or with email</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    </div>
  );
};

export default SocialAuthButtons;
