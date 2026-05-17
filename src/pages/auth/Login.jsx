import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
// Note: Assuming AuthContext provides login with email/password and google

const Login = () => {
  const navigate = useNavigate();
  // const { login, googleSignIn } = useAuthContext(); // Assuming these exist
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Implementation for login
    console.log('Login attempt', { email, password, rememberMe });
    // await login(email, password);
    // navigate('/dashboard/student');
  };

  const handleGoogleSignIn = async () => {
    // await googleSignIn();
    console.log('Google sign in attempt');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-8 flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-4 relative">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center z-10 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-lg font-bold tracking-wide uppercase">LOGIN</h1>
        </div>
      </header>

      <main className="flex-1 px-4 pt-8">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-900">
                <span className="font-bold text-lg">@</span>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-0 focus:border-primary-500 rounded-none transition-colors"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-900" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-900 focus:outline-none focus:ring-0 focus:border-primary-500 rounded-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-600" /> : <Eye className="w-5 h-5 text-gray-900" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-900 rounded-sm checked:bg-primary-500 transition-colors cursor-pointer"
                />
                <svg className="absolute w-3 h-3 text-white left-1 top-1 pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Remember me</span>
            </label>
            
            <button type="button" className="text-sm font-bold text-gray-900 underline underline-offset-2">
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <div className="pt-6">
            <button 
              type="submit" 
              className="w-full group relative block"
            >
              <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-none transition-transform group-active:translate-x-0 group-active:translate-y-0"></div>
              <div className="relative bg-primary-500 border-2 border-gray-900 text-gray-900 text-center py-3.5 font-bold text-lg flex items-center justify-center transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
                Login
              </div>
            </button>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <div>
            <button 
              type="button" 
              onClick={handleGoogleSignIn}
              className="w-full group relative block"
            >
              <div className="absolute inset-0 bg-gray-900 translate-y-1 translate-x-1 rounded-none transition-transform group-active:translate-x-0 group-active:translate-y-0"></div>
              <div className="relative bg-white border-2 border-gray-900 text-gray-900 text-center py-3.5 font-bold flex items-center justify-center gap-3 transition-transform group-active:translate-x-1 group-active:translate-y-1">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </div>
            </button>
          </div>
        </form>
      </main>

      <footer className="mt-auto py-6 text-center">
        <p className="text-gray-900 font-medium text-sm">
          Don't have an account?{' '}
          <Link to="/signup/student/1" className="font-bold underline underline-offset-2 hover:text-primary-600">
            Sign Up
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default Login;