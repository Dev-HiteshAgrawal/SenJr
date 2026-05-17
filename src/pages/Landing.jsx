import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, Star, Users, Zap, BookOpen, Briefcase } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '../components/common/MotionWrapper';

const TRUST_COLLEGES = ['IIT', 'BITS', 'DU', 'VIT', 'NID', 'Oxford', 'MIT'];

const FEATURES = [
  {
    icon: <Users className="w-6 h-6" />,
    title: '1:1 Mentorship',
    desc: 'Book sessions with alumni who have been exactly where you are.'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'AI Tutor',
    desc: 'Instant AI-powered explanations, practice sets, and study guides.'
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: 'Career Clarity',
    desc: 'Internship guides, resume reviews, and interview simulations.'
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'War Room',
    desc: 'Curated prep packs for competitive exams and top-company interviews.'
  }
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

  const ctaLabel = !user
    ? 'Start Learning Free'
    : userData?.role === 'mentor'
    ? 'Open Mentor Hub'
    : 'Continue Learning';

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">

      {/* ===== HERO ===== */}
      <section className="relative pt-28 pb-20 px-5 max-w-5xl mx-auto text-center">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-500/8 rounded-full blur-[120px] pointer-events-none" />

        <FadeIn delay={0.1}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-8 border border-primary-100">
            <Star className="w-3.5 h-3.5 fill-primary-500" /> Mentorship without borders
          </span>
        </FadeIn>

        <SlideUp delay={0.2}>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.07] tracking-tight text-gray-900 mb-6">
            Learn from Seniors,
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-primary-500">Not Teachers.</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M0 9 Q 150 0 300 9" stroke="#ed7d12" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
        </SlideUp>

        <SlideUp delay={0.3}>
          <p className="text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Real guidance from people who cracked the same exams, landed the same internships, and built the careers you want.
          </p>
        </SlideUp>

        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCTA}
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-gray-900/20 text-lg"
            >
              {ctaLabel} <ArrowRight className="w-5 h-5" />
            </motion.button>

            {!user && (
              <Link
                to="/join"
                className="inline-flex items-center gap-2 text-gray-700 font-semibold px-6 py-4 rounded-2xl border-2 border-gray-200 hover:border-gray-900 transition-colors text-base"
              >
                Become a Mentor
              </Link>
            )}
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map(i => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  className="w-9 h-9 rounded-full border-2 border-white"
                  alt="Student"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <span className="text-sm text-gray-400 font-medium">
              Joined by students from{' '}
              {TRUST_COLLEGES.slice(0, 4).join(', ')} & more
            </span>
          </div>
        </FadeIn>
      </section>

      {/* ===== HERO IMAGE ===== */}
      <FadeIn delay={0.5}>
        <div className="max-w-4xl mx-auto px-5 mb-24">
          <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200/60">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
              alt="Students collaborating with mentors"
              className="w-full h-[340px] md:h-[440px] object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
            <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-semibold text-gray-800">Mentors live now</span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ===== FEATURES ===== */}
      <section className="px-5 pb-24 max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to accelerate
            </h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Built for ambitious students who don't want to wait until graduation to figure things out.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer staggerDelay={0.1} className="grid sm:grid-cols-2 gap-5">
          {FEATURES.map((f) => (
            <StaggerItem key={f.title}>
              <div className="group p-6 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 bg-white cursor-default">
                <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ===== CTA BAND ===== */}
      <section className="mx-5 mb-24">
        <FadeIn>
          <div className="max-w-4xl mx-auto bg-gray-900 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5 tracking-tight">
                Built for ambitious students everywhere.
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-sm mx-auto">
                Stop Googling. Start talking to people who've actually done it.
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleCTA}
                className="inline-flex items-center gap-2 bg-primary-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-primary-500/30 text-base"
              >
                {ctaLabel} <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-gray-100 py-10 px-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="w-6 h-6 bg-primary-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">Senjr</span>
        </div>
        <div className="flex justify-center gap-6 text-sm text-gray-400 mb-5">
          <a href="#" className="hover:text-gray-700 transition-colors">Terms</a>
          <a href="#" className="hover:text-gray-700 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
        </div>
        <p className="text-xs text-gray-300">
          © 2025 Senjr EdTech. Designed for the next generation of builders.
        </p>
      </footer>
    </div>
  );
};

export default Landing;