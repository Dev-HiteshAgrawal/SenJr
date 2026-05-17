import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Star, Clock, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import BottomNav from '../components/common/BottomNav';

const LESSONS = [
  {
    id: 1,
    title: 'Mastering DSA for FAANG',
    mentor: 'Rahul S.',
    college: 'IIT Delhi \'24',
    duration: '45 mins',
    tags: ['Algorithms', 'Interview'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80',
    color: '#f0fdf4',
  },
  {
    id: 2,
    title: 'UI/UX Basics for Devs',
    mentor: 'Priya M.',
    college: 'NID \'23',
    duration: '1.5 hrs',
    tags: ['Design', 'Figma'],
    image: null,
    color: '#fce7f3',
    icon: '✏️',
  },
];

const Landing = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const handleCTA = () => {
    if (!user) {
      navigate('/join');
    } else if (userData?.role === 'mentor') {
      navigate('/dashboard/mentor');
    } else {
      navigate('/dashboard/student');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      {/* ===== HEADER ===== */}
      <header className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary-500" />
          <span className="text-lg font-bold font-display tracking-tight uppercase">Senjr</span>
        </div>
        {!user ? (
          <Link
            to="/login"
            className="px-5 py-2 rounded-full border border-gray-900 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Login
          </Link>
        ) : (
          <Link
            to={userData?.role === 'mentor' ? '/dashboard/mentor' : '/dashboard/student'}
            className="px-5 py-2 rounded-full bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
          >
            Dashboard
          </Link>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section className="px-5 pt-6 pb-8">
        <h1 className="text-[2.1rem] leading-[1.15] font-extrabold text-gray-900 mb-6">
          <span className="relative inline-block">
            <span className="absolute -left-3 top-1 w-3 h-3 bg-primary-500 rounded-full" />
            Learn from
          </span>
          <br />
          Seniors,
          <br />
          Not Teachers.
        </h1>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden mb-6">
          <img
            src="/images/hero-students.png"
            alt="Students learning together"
            className="w-full h-52 object-cover"
            loading="eager"
          />
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-primary-500" />
            <span className="text-xs font-semibold text-gray-700">Real advice</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleCTA}
          className="w-full py-3.5 rounded-full border-2 border-gray-900 text-center font-bold text-base hover:bg-gray-50 active:scale-[0.98] transition-all mb-5"
        >
          {!user ? 'Start Learning Free' : userData?.role === 'mentor' ? 'Open Mentor Hub' : 'Continue Learning'}
        </button>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {[11, 12, 13].map(i => (
              <img
                key={i}
                src={`https://i.pravatar.cc/80?img=${i}`}
                className="w-8 h-8 rounded-full border-2 border-white"
                alt="Student"
                loading="lazy"
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 font-medium">500+ students joined</span>
        </div>
      </section>

      {/* ===== POPULAR LESSONS ===== */}
      <section className="px-5 pb-10">
        <div className="flex items-center gap-2 mb-5">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <h2 className="text-xl font-bold">Popular Lessons</h2>
        </div>

        <div className="space-y-4">
          {LESSONS.map(lesson => (
            <div key={lesson.id} className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Lesson Image */}
              {lesson.image ? (
                <div className="relative">
                  <img
                    src={lesson.image}
                    alt={lesson.title}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs font-semibold text-gray-700">{lesson.duration}</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">▶</span>
                  </div>
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center" style={{ backgroundColor: lesson.color }}>
                  <span className="text-4xl">{lesson.icon}</span>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs font-semibold text-gray-700">{lesson.duration}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson Info */}
              <div className="p-4">
                <h3 className="font-bold text-base mb-1">{lesson.title}</h3>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                  <User className="w-3.5 h-3.5" />
                  <span>By {lesson.mentor}, {lesson.college}</span>
                </div>
                <div className="flex gap-2">
                  {lesson.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-5 py-8 text-center border-t border-gray-100">
        <p className="font-bold text-gray-900 mb-3">Senjr</p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <Link to="/terms" className="text-sm text-gray-500 underline underline-offset-2">Terms</Link>
          <Link to="/privacy" className="text-sm text-gray-500 underline underline-offset-2">Privacy</Link>
          <Link to="/help" className="text-sm text-gray-500 underline underline-offset-2">Support</Link>
        </div>
        <p className="text-xs text-gray-400">© 2024 Senjr EdTech. Made in India 🇮🇳</p>
      </footer>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Landing;