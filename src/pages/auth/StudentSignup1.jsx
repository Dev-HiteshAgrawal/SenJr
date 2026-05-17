import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Lock, Eye, EyeOff, AtSign, Phone, AlertCircle } from 'lucide-react';
import { registerWithEmail } from '../../firebase/auth';
import SocialAuthButtons from '../../components/auth/SocialAuthButtons';

const StudentSignup1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = (pw) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const strength = getPasswordStrength(formData.password);
  const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-blue-400', 'bg-primary-500'];

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use': return 'This email is already registered. Try logging in.';
      case 'auth/weak-password': return 'Password must be at least 6 characters.';
      case 'auth/invalid-email': return 'Please enter a valid email address.';
      default: return 'Something went wrong. Please try again.';
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const result = await registerWithEmail(formData.email, formData.password);
      sessionStorage.setItem('senjr_signup', JSON.stringify({
        uid: result.user.uid,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        role: 'student',
        referralCode: formData.referralCode || null,
      }));
      navigate('/signup/student/2');
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center px-5 py-4 relative">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center z-10 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-base font-bold tracking-wide uppercase">Create Account</h1>
        </div>
      </header>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-1 mb-6">
        <div className="w-2 h-2 rounded-full bg-gray-900" />
        <div className="w-2 h-2 rounded-full bg-gray-300" />
        <div className="w-2 h-2 rounded-full bg-gray-300" />
        <div className="w-2 h-2 rounded-full bg-gray-300" />
      </div>

      <main className="flex-1 px-5">
        {error && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleContinue} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="w-4.5 h-4.5 text-gray-400" />
              </div>
              <input
                type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                placeholder="Hitesh Agrawal" required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <AtSign className="w-4.5 h-4.5 text-gray-400" />
              </div>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="you@email.com" required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 text-sm"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">Phone Number</label>
            <div className="flex border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
              <div className="pl-4 pr-3 py-3 bg-gray-50 border-r border-gray-300 flex items-center">
                <span className="text-sm font-medium text-gray-700">+91</span>
              </div>
              <input
                type="tel" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="98765 43210" required maxLength={10}
                className="flex-1 px-3 py-3 focus:outline-none placeholder-gray-400 text-sm"
              />
              <button type="button" className="px-4 text-sm font-semibold text-primary-600 hover:text-primary-700">
                Send OTP
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-4.5 h-4.5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'} name="password"
                value={formData.password} onChange={handleChange}
                placeholder="••••••••" required
                className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            {/* Password strength bar */}
            {formData.password && (
              <div className="flex gap-1 h-1 mt-1.5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`flex-1 rounded-full transition-colors ${i <= strength ? strengthColors[strength] : 'bg-gray-200'}`} />
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-4.5 h-4.5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange}
                placeholder="••••••" required
                className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 text-sm ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Referral Code */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowReferral(!showReferral)}
              className="text-sm font-medium text-primary-600 underline underline-offset-2"
            >
              Have a referral code?
            </button>
          </div>
          {showReferral && (
            <div className="space-y-1.5">
              <input
                type="text" name="referralCode" value={formData.referralCode} onChange={handleChange}
                placeholder="Enter referral code"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 text-sm"
              />
            </div>
          )}
        </form>
      </main>

      {/* Bottom CTA */}
      <footer className="px-5 pt-4 pb-6">
        <button
          type="button"
          onClick={handleContinue}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-primary-500 text-white text-center font-bold text-base hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating account...
            </span>
          ) : 'Continue'}
        </button>
        <p className="text-center text-sm text-gray-500 mt-3">
          Already have account?{' '}
          <Link to="/login" className="font-semibold text-gray-900 underline underline-offset-2">Login</Link>
        </p>
      </footer>
    </div>
  );
};

export default StudentSignup1;