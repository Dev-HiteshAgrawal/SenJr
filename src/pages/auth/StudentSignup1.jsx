import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Lock, Eye, EyeOff, Mail, AlertCircle } from 'lucide-react';
import { registerWithEmail } from '../../firebase/auth';

const StudentSignup1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];
  const strengthLabels = ['', 'Too weak', 'Fair', 'Good', 'Strong'];

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
      // Store step 1 data in sessionStorage for the multi-step flow
      sessionStorage.setItem('senjr_signup', JSON.stringify({
        uid: result.user.uid,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        role: 'student',
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
      <header className="flex items-center px-4 py-4 relative">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center z-10 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-base font-bold tracking-wide uppercase">Create Account</h1>
        </div>
      </header>

      {/* Progress */}
      <div className="flex justify-center gap-2 mt-2 mb-8">
        <div className="w-8 h-1.5 rounded-full bg-gray-900 border border-gray-900" />
        <div className="w-6 h-1.5 rounded-full border-2 border-gray-200" />
        <div className="w-6 h-1.5 rounded-full border-2 border-gray-200" />
        <div className="w-6 h-1.5 rounded-full border-2 border-gray-200" />
      </div>

      <main className="flex-1 px-4">
        {error && (
          <div className="flex items-center gap-3 mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleContinue} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-900">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-900" />
              </div>
              <input
                type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                placeholder="Hitesh Agrawal" required
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-900 focus:outline-none focus:border-primary-500 rounded-none placeholder-gray-400"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-900">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-900" />
              </div>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="you@email.com" required
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-900 focus:outline-none focus:border-primary-500 rounded-none placeholder-gray-400"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-900">Phone Number</label>
            <div className="flex border-2 border-gray-900 focus-within:border-primary-500">
              <div className="pl-4 pr-3 py-3 border-r-2 border-gray-200 flex items-center">
                <span className="font-medium text-gray-900">+91</span>
              </div>
              <input
                type="tel" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="98765 43210" required maxLength={10}
                className="flex-1 px-3 py-3 focus:outline-none placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-900">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-900" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'} name="password"
                value={formData.password} onChange={handleChange}
                placeholder="Min 6 characters" required
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-900 focus:outline-none focus:border-primary-500 rounded-none placeholder-gray-400"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-900" /> : <Eye className="w-5 h-5 text-gray-900" />}
              </button>
            </div>
            {/* Password strength */}
            {formData.password && (
              <div className="space-y-1 pt-1">
                <div className="flex gap-1 h-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`flex-1 rounded-full ${i <= strength ? strengthColors[strength] : 'bg-gray-200'}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-500 font-medium">{strengthLabels[strength]}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1 pt-1">
            <label className="block text-sm font-medium text-gray-900">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-900" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange}
                placeholder="••••••••" required
                className={`w-full pl-10 pr-12 py-3 border-2 focus:outline-none rounded-none placeholder-gray-400 ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-red-500 bg-red-50' : 'border-gray-900 focus:border-primary-500'
                }`}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-900" /> : <Eye className="w-5 h-5 text-gray-900" />}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-500 font-medium">Passwords don't match</p>
            )}
          </div>
        </form>
      </main>

      <footer className="mt-4">
        <div className="px-4 pb-4">
          <button type="button" onClick={handleContinue} disabled={loading} className="w-full group relative block">
            <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-none transition-transform group-active:translate-x-0 group-active:translate-y-0" />
            <div className="relative bg-primary-500 border-2 border-gray-900 text-gray-900 text-center py-3.5 font-bold text-lg flex items-center justify-center transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Continue'}
            </div>
          </button>
        </div>
        <div className="pb-8 text-center text-sm font-medium text-gray-900 border-t border-gray-200 pt-4 bg-white">
          Already have an account?{' '}
          <Link to="/login" className="underline underline-offset-2 hover:text-primary-600">Log In</Link>
        </div>
      </footer>
    </div>
  );
};

export default StudentSignup1;