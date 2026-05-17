import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Lock, Eye, EyeOff } from 'lucide-react';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    navigate('/signup/student/2');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-4 relative">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center z-10 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-base font-bold tracking-wide uppercase">CREATE ACCOUNT</h1>
        </div>
      </header>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-2 mb-8">
        <div className="w-3 h-3 rounded-full border-2 border-gray-900 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-white w-1/2"></div>
        </div>
        <div className="w-3 h-3 rounded-full border-2 border-gray-200"></div>
        <div className="w-3 h-3 rounded-full border-2 border-gray-200"></div>
        <div className="w-3 h-3 rounded-full border-2 border-gray-200"></div>
      </div>

      <main className="flex-1 px-4">
        <form onSubmit={handleContinue} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-900">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-900" />
              </div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Hitesh Agrawal"
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-900 focus:outline-none focus:border-primary-500 rounded-none placeholder-gray-400"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-900">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="font-bold text-lg text-gray-900">@</span>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-900 focus:outline-none focus:border-primary-500 rounded-none placeholder-gray-400"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-900">Phone Number</label>
            <div className="flex border-2 border-gray-900 focus-within:border-primary-500">
              <div className="pl-4 pr-3 py-3 border-r-2 border-gray-200 flex items-center">
                <span className="font-medium text-gray-900">+91</span>
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="98765 43210"
                required
                className="flex-1 px-3 py-3 focus:outline-none placeholder-gray-400"
              />
              <button type="button" className="px-4 py-3 border-l-2 border-gray-200 font-medium text-sm text-gray-900 whitespace-nowrap active:bg-gray-100">
                Send<br/>OTP
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1 relative">
            <label className="block text-sm font-medium text-gray-900">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-900" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-900 focus:outline-none focus:border-primary-500 rounded-none placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-900" /> : <Eye className="w-5 h-5 text-gray-900" />}
              </button>
            </div>
            {/* Password strength indicator mock */}
            <div className="absolute -bottom-1 left-0 w-1/4 h-1 bg-red-500 z-10 rounded"></div>
            <div className="absolute -bottom-1 left-0 w-full flex gap-1 h-1">
              <div className="flex-1 bg-gray-200 rounded"></div>
              <div className="flex-1 bg-gray-200 rounded"></div>
              <div className="flex-1 bg-gray-200 rounded"></div>
              <div className="flex-1 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1 pt-2">
            <label className="block text-sm font-medium text-gray-900">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-900" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-900 focus:outline-none focus:border-primary-500 rounded-none placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-900" /> : <Eye className="w-5 h-5 text-gray-900" />}
              </button>
            </div>
          </div>

          <div className="text-right pt-1">
            <button type="button" className="text-sm font-medium text-gray-900 underline underline-offset-2">
              Have a referral code?
            </button>
          </div>
        </form>
      </main>

      {/* Footer / Continue Button */}
      <footer className="mt-8">
        <div className="px-4 pb-4">
          <button 
            type="submit"
            onClick={handleContinue}
            className="w-full group relative block"
          >
            <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-none transition-transform group-active:translate-x-0 group-active:translate-y-0"></div>
            <div className="relative bg-primary-500 border-2 border-gray-900 text-gray-900 text-center py-3.5 font-bold text-lg flex items-center justify-center transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
              Continue
            </div>
          </button>
        </div>
        <div className="pb-8 text-center text-sm font-medium text-gray-900 border-t border-gray-200 pt-4 bg-white">
          Already have account?{' '}
          <Link to="/login" className="underline underline-offset-2 hover:text-primary-600">
            Login
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default StudentSignup1;