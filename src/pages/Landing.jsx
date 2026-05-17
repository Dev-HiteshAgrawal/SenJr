import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Star, BookOpen, User, Home, Book } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary-600" />
          <span className="text-xl font-bold tracking-tight text-primary-700 uppercase">Senjr</span>
        </div>
        <Link 
          to="/login"
          className="px-5 py-1.5 text-sm font-medium border-2 border-gray-900 rounded-full hover:bg-gray-50 transition-colors"
        >
          Login
        </Link>
      </nav>

      <main className="px-6 pt-6">
        {/* Hero Section */}
        <section className="mb-12 relative">
          <div className="relative mb-8">
            {/* Decorative orange blob */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-orange-200 rounded-full mix-blend-multiply opacity-70 -z-10"></div>
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight">
              Learn from
              <br />
              <span className="relative inline-block">
                Seniors,
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-gray-900" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 15 Q 50 0 100 15" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </svg>
              </span>
              <br />
              Not Teachers.
            </h1>
          </div>

          <div className="relative rounded-2xl overflow-hidden border-2 border-gray-900 bg-white mb-6">
            <div className="absolute inset-0 bg-orange-400 translate-x-2 translate-y-2 -z-10 rounded-2xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" 
              alt="Students learning together"
              className="w-full h-56 object-cover"
            />
            <div className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-full border-2 border-gray-900 flex items-center gap-2 shadow-sm">
              <GraduationCap className="w-4 h-4" />
              <span className="text-xs font-bold">Real advice</span>
            </div>
          </div>

          <Link to="/signup/student/1" className="block w-full group relative mb-6">
            <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-xl transition-transform group-active:translate-x-0 group-active:translate-y-0"></div>
            <div className="relative bg-primary-500 border-2 border-gray-900 text-gray-900 text-center py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
              Start Learning Free
            </div>
          </Link>

          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              <img src="https://i.pravatar.cc/100?img=1" className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" alt="Student" />
              <img src="https://i.pravatar.cc/100?img=2" className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" alt="Student" />
              <img src="https://i.pravatar.cc/100?img=3" className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" alt="Student" />
            </div>
            <span className="text-sm font-medium text-gray-600">500+ students joined</span>
          </div>
        </section>

        {/* Popular Lessons */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-orange-400" />
            <h2 className="text-2xl font-bold">Popular Lessons</h2>
          </div>

          <div className="space-y-6">
            {/* Card 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-2xl transition-transform"></div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-400 border-2 border-gray-900 rounded-full z-10 flex items-center justify-center">
                <span className="text-white text-xs">🚀</span>
              </div>
              <div className="relative bg-green-50 border-2 border-gray-900 rounded-2xl p-4 flex flex-col gap-4">
                <div className="relative rounded-xl overflow-hidden border-2 border-gray-900 h-40">
                  <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop" alt="Desk setup" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold border border-gray-900">45 mins</div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Mastering DSA for FAANG</h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <User className="w-4 h-4" />
                    <span>By Rahul S., IIT Delhi '24</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gray-200 border border-gray-900 rounded-full text-xs font-medium">Algorithms</span>
                    <span className="px-3 py-1 bg-gray-200 border border-gray-900 rounded-full text-xs font-medium">Interview</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-2xl transition-transform"></div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-500 border-2 border-gray-900 rounded-full z-10 flex items-center justify-center">
                <span className="text-white text-xs">💡</span>
              </div>
              <div className="relative bg-white border-2 border-gray-900 rounded-2xl p-4 flex flex-col gap-4">
                <div className="relative rounded-xl border-2 border-gray-900 h-40 bg-pink-100 flex items-center justify-center">
                  <span className="text-4xl">🎨</span>
                  <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold border border-gray-900">1.5 hrs</div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">UI/UX Basics for Devs</h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <User className="w-4 h-4" />
                    <span>By Priya M., NID '23</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-12 text-center border-t border-gray-200">
          <div className="font-bold text-gray-900 mb-6">Senjr</div>
          <div className="flex justify-center gap-6 text-sm font-medium text-gray-600 mb-8">
            <a href="#" className="underline decoration-orange-400 decoration-2 underline-offset-4">Terms</a>
            <a href="#" className="underline decoration-orange-400 decoration-2 underline-offset-4">Privacy</a>
            <a href="#" className="underline decoration-orange-400 decoration-2 underline-offset-4">Support</a>
          </div>
          <div className="text-xs text-gray-500 font-medium">
            © 2024 Senjr EdTech. Made in India 🇮🇳
          </div>
        </footer>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-900 flex justify-around p-3 z-50 rounded-t-xl">
        <Link to="/" className="flex flex-col items-center gap-1">
          <div className="bg-primary-500 p-2 rounded-xl border-2 border-gray-900">
            <Home className="w-6 h-6 text-gray-900" />
          </div>
          <span className="text-[10px] font-bold text-gray-900">Home</span>
        </Link>
        <Link to="/courses" className="flex flex-col items-center gap-1 p-2">
          <GraduationCap className="w-6 h-6 text-gray-500" />
          <span className="text-[10px] font-medium text-gray-500">Courses</span>
        </Link>
        <Link to="/learning" className="flex flex-col items-center gap-1 p-2">
          <BookOpen className="w-6 h-6 text-gray-500" />
          <span className="text-[10px] font-medium text-gray-500">My Learning</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1 p-2">
          <User className="w-6 h-6 text-gray-500" />
          <span className="text-[10px] font-medium text-gray-500">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Landing;