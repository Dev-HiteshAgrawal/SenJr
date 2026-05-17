import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Eye, EyeOff, ChevronDown, AlertCircle } from 'lucide-react';
import { registerWithEmail } from '../../firebase/auth';
import SocialAuthButtons from '../../components/auth/SocialAuthButtons';

const MentorSignup1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    source: '',
    isAdult: false,
    agreedToGuidelines: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use': return 'This email is already registered. Try logging in.';
      case 'auth/weak-password': return 'Password must be at least 6 characters.';
      default: return 'Something went wrong. Please try again.';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.isAdult || !formData.agreedToGuidelines) {
      setError('Please confirm you are 18+ and agree to Mentor Guidelines.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match.");
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
        source: formData.source,
        role: 'mentor',
      }));
      navigate('/signup/mentor/2');
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col pb-28">
      {/* Header */}
      <header className="flex items-center px-5 py-4 relative">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center z-10 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-base font-bold tracking-wide uppercase">Become a Mentor</h1>
        </div>
      </header>

      {/* Progress */}
      <div className="flex justify-center gap-1.5 mt-1 mb-4 px-5">
        <div className="flex-1 h-1.5 rounded-full bg-mentor-500" />
        <div className="flex-1 h-1.5 rounded-full bg-gray-200" />
        <div className="flex-1 h-1.5 rounded-full bg-gray-200" />
        <div className="flex-1 h-1.5 rounded-full bg-gray-200" />
      </div>

      <main className="flex-1 px-5">
        {/* Banner */}
        <div className="bg-mentor-50 border border-mentor-200 rounded-2xl p-4 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-mentor-500 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm font-semibold text-gray-900 leading-snug">
            Share your knowledge. Earn money.<br />Build your profile.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <SocialAuthButtons role="mentor" onError={setError} />

        <form onSubmit={handleContinue} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
              placeholder="Rahul Sharma" required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mentor-500 focus:border-transparent placeholder-gray-400 text-sm" />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="mentor@email.com" required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mentor-500 focus:border-transparent placeholder-gray-400 text-sm" />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">Phone Number</label>
            <div className="flex border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-mentor-500 focus-within:border-transparent">
              <div className="pl-4 pr-3 py-3 bg-gray-50 border-r border-gray-300 flex items-center">
                <span className="text-sm font-medium text-gray-700">+91</span>
              </div>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="Enter mobile number" required
                className="flex-1 px-3 py-3 focus:outline-none placeholder-gray-400 text-sm min-w-0" />
              <button type="button" className="px-4 text-sm font-semibold text-mentor-600 hover:text-mentor-700">
                Send OTP
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                placeholder="Create a strong password" required
                className="w-full px-4 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mentor-500 focus:border-transparent placeholder-gray-400 text-sm" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                {showPassword ? <Eye className="w-5 h-5 text-gray-400" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
              placeholder="Re-enter password" required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mentor-500 focus:border-transparent placeholder-gray-400 text-sm" />
          </div>

          {/* How did you hear about us? */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">How did you hear about us?</label>
            <div className="relative">
              <select name="source" value={formData.source} onChange={handleChange}
                className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mentor-500 focus:border-transparent bg-white text-sm font-medium">
                <option value="" disabled>Select an option</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
                <option value="Friend">Friend/Colleague</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="isAdult" checked={formData.isAdult} onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-mentor-500 focus:ring-mentor-500 mt-0.5" />
              <span className="text-sm text-gray-700">I confirm I am 18+ years old</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="agreedToGuidelines" checked={formData.agreedToGuidelines} onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-mentor-500 focus:ring-mentor-500 mt-0.5" />
              <span className="text-sm text-gray-700">
                I agree to <Link to="/terms" className="text-mentor-600 underline underline-offset-2 font-semibold">Mentor Guidelines</Link>
              </span>
            </label>
          </div>
        </form>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/95 backdrop-blur-sm border-t border-gray-100 z-50">
        <button onClick={handleContinue} disabled={loading}
          className="w-full py-4 rounded-2xl bg-mentor-500 text-white text-center font-bold text-base hover:bg-mentor-600 active:scale-[0.98] transition-all disabled:opacity-60">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating account...
            </span>
          ) : 'Continue'}
        </button>
        <p className="text-center text-sm text-gray-500 mt-3">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-gray-900 underline underline-offset-2">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default MentorSignup1;