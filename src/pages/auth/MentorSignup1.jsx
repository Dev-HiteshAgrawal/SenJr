import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Eye, EyeOff, ChevronDown } from 'lucide-react';

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    navigate('/signup/mentor/2');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center px-4 py-4 relative bg-white">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center z-10 bg-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="absolute inset-0 flex items-center pl-14 pointer-events-none">
          <h1 className="text-xl font-bold font-display">Become a Mentor</h1>
        </div>
      </header>

      <main className="flex-1 px-4 pt-2">
        {/* Progress Dashes */}
        <div className="flex gap-2 mb-6 px-1">
          <div className="flex-1 h-1.5 rounded-full bg-[#f97316]"></div>
          <div className="flex-1 h-1.5 rounded-full bg-gray-200"></div>
          <div className="flex-1 h-1.5 rounded-full bg-gray-200"></div>
          <div className="flex-1 h-1.5 rounded-full bg-gray-200"></div>
        </div>

        {/* Banner */}
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-gray-900 translate-y-1 translate-x-1 rounded-lg"></div>
          <div className="relative bg-[#FFF4ED] border border-gray-900 rounded-lg p-4 flex gap-3">
            <GraduationCap className="w-6 h-6 text-[#f97316] shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-gray-900 leading-snug">
              Share your knowledge. Earn money.<br/>Build your profile.
            </p>
          </div>
        </div>

        <form onSubmit={handleContinue} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Rahul Sharma"
              required
              className="w-full px-4 py-3 border border-gray-400 focus:outline-none focus:border-[#f97316] rounded-none placeholder-gray-500 text-gray-900"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="mentor@email.com"
              required
              className="w-full px-4 py-3 border border-gray-400 focus:outline-none focus:border-[#f97316] rounded-none placeholder-gray-500 text-gray-900"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">Phone Number</label>
            <div className="flex border border-gray-400 focus-within:border-[#f97316]">
              <div className="pl-4 pr-3 py-3 border-r border-gray-400 flex items-center">
                <span className="font-medium text-gray-900">+91</span>
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter mobile number"
                required
                className="flex-1 px-3 py-3 focus:outline-none placeholder-gray-500 text-gray-900 min-w-0"
              />
              <button type="button" className="px-4 py-3 border-l border-gray-400 font-bold text-sm text-[#f97316] whitespace-nowrap active:bg-gray-50">
                Send OTP
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5 relative">
            <label className="block text-sm font-bold text-gray-900">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                className="w-full pl-4 pr-12 py-3 border border-gray-400 focus:outline-none focus:border-[#f97316] rounded-none placeholder-gray-500 text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <Eye className="w-5 h-5 text-gray-500" /> : <EyeOff className="w-5 h-5 text-gray-500" />}
              </button>
            </div>
            
            {/* Password strength indicator */}
            <div className="flex items-center gap-1 pt-1">
              <div className="flex-1 h-1 bg-[#f97316] rounded-full"></div>
              <div className="flex-1 h-1 bg-gray-200 rounded-full"></div>
              <div className="flex-1 h-1 bg-gray-200 rounded-full"></div>
              <div className="flex-1 h-1 bg-gray-200 rounded-full"></div>
              <span className="text-xs font-medium text-gray-500 ml-2">Weak</span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-sm font-bold text-gray-900">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
              className="w-full px-4 py-3 border border-gray-400 focus:outline-none focus:border-[#f97316] rounded-none placeholder-gray-500 text-gray-900"
            />
          </div>

          {/* How did you hear about us? */}
          <div className="space-y-1.5 pt-2 mb-2">
            <label className="block text-sm font-bold text-gray-900">How did you hear about us?</label>
            <div className="relative">
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full appearance-none pl-4 pr-10 py-3 border border-gray-400 focus:outline-none focus:border-[#f97316] rounded-none bg-white font-medium text-gray-900"
              >
                <option value="" disabled>Select an option</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
                <option value="Friend">Friend/Colleague</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-900" />
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-2 pb-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  name="isAdult"
                  checked={formData.isAdult}
                  onChange={handleChange}
                  className="peer appearance-none w-5 h-5 border border-gray-400 rounded-sm checked:bg-[#f97316] checked:border-[#f97316] transition-colors cursor-pointer"
                />
                <svg className="absolute w-3.5 h-3.5 text-white left-0.5 top-0.5 pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">I confirm I am 18+ years old</span>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  name="agreedToGuidelines"
                  checked={formData.agreedToGuidelines}
                  onChange={handleChange}
                  className="peer appearance-none w-5 h-5 border border-gray-400 rounded-sm checked:bg-[#f97316] checked:border-[#f97316] transition-colors cursor-pointer"
                />
                <svg className="absolute w-3.5 h-3.5 text-white left-0.5 top-0.5 pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">
                I agree to <a href="#" className="text-[#f97316] underline underline-offset-2">Mentor Guidelines</a>
              </span>
            </label>
          </div>

        </form>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white z-50">
        <div className="p-4 bg-white">
          <button 
            onClick={handleContinue}
            className="w-full group relative block"
          >
            <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-none transition-transform group-active:translate-x-0 group-active:translate-y-0"></div>
            <div className="relative bg-[#f97316] border-2 border-gray-900 text-gray-900 text-center py-3.5 font-bold text-lg flex items-center justify-center transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
              Continue
            </div>
          </button>
        </div>
        <div className="pb-6 text-center text-sm font-medium text-gray-900 bg-white">
          Already registered?{' '}
          <Link to="/login" className="text-[#f97316] underline underline-offset-2 font-bold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MentorSignup1;