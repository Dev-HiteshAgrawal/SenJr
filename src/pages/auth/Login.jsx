import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { updateStreak } from '../../utils/gamification';

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

const Login = () => {
  const navigate = useNavigate();
  const { login, signInWithGoogle, signInWithApple, forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(''); // 'google' | 'apple'
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a moment and try again.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in window was closed. Please try again.';
      case 'auth/popup-blocked':
        return 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
      case 'auth/cancelled-popup-request':
        return '';
      default:
        return 'Login failed. Please try again.';
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      updateStreak(result.user.uid).catch(console.error);
      navigate('/dashboard/student');
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    setError('');
    setSocialLoading(provider);
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithApple();
      }
      navigate('/dashboard/student');
    } catch (err) {
      const msg = getErrorMessage(err.code);
      if (msg) setError(msg);
    } finally {
      setSocialLoading('');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await forgotPassword(forgotEmail);
      setForgotSent(true);
    } catch {
      setError('Could not send reset email. Please check the address.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-8 flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-4 relative">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center z-10 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#10b981]" />
            <span className="text-lg font-bold tracking-wide uppercase">Senjr</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 max-w-md mx-auto w-full">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-1">Welcome back 👋</h1>
          <p className="text-gray-500 text-sm">Log in to continue your learning journey.</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-3 mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Social Sign-In Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialSignIn('google')}
            disabled={!!socialLoading || loading}
            className="relative group flex items-center justify-center gap-2.5 bg-white border-2 border-gray-200 rounded-xl py-3 font-semibold text-gray-700 text-sm hover:border-gray-400 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-60"
          >
            {socialLoading === 'google' ? (
              <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Google
          </button>

          {/* Apple */}
          <button
            type="button"
            onClick={() => handleSocialSignIn('apple')}
            disabled={!!socialLoading || loading}
            className="relative group flex items-center justify-center gap-2.5 bg-gray-900 border-2 border-gray-900 rounded-xl py-3 font-semibold text-white text-sm hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-60"
          >
            {socialLoading === 'apple' ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <AppleIcon />
            )}
            Apple
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">or with email</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Email Form */}
        {!showForgot ? (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={() => setShowForgot(true)} className="text-sm font-semibold text-[#10b981] hover:underline">
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </>
              ) : 'Log In →'}
            </button>
          </form>
        ) : (
          /* Forgot Password Panel */
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-1">Reset Password</h2>
            <p className="text-sm text-gray-500 mb-4">Enter your email and we'll send you a reset link.</p>
            {forgotSent ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">📬</div>
                <p className="font-semibold text-gray-800">Check your inbox!</p>
                <p className="text-sm text-gray-500 mt-1">Reset link sent to <strong>{forgotEmail}</strong></p>
                <button onClick={() => { setShowForgot(false); setForgotSent(false); }} className="mt-4 text-sm text-[#10b981] font-semibold hover:underline">
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                  placeholder="you@email.com"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#10b981]"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowForgot(false)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={forgotLoading} className="flex-1 py-3 rounded-xl bg-[#10b981] text-white text-sm font-bold hover:bg-[#059669] transition-colors disabled:opacity-60">
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      <footer className="mt-auto py-6 text-center">
        <p className="text-gray-500 text-sm">
          Don't have an account?{' '}
          <Link to="/join" className="font-bold text-[#10b981] hover:underline">
            Join Senjr
          </Link>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-gray-600">Terms</Link> &amp;{' '}
          <Link to="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
        </p>
      </footer>
    </div>
  );
};

export default Login;