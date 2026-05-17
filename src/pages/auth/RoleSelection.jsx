import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Briefcase, ArrowRight, GraduationCap } from 'lucide-react';
import { FadeIn, SlideUp, HoverCard } from '../../components/common/MotionWrapper';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[0%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[120px]"></div>
      </div>

      <FadeIn delay={0.1} className="w-full max-w-4xl z-10">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <GraduationCap className="w-8 h-8 text-primary-500" />
            <span className="text-2xl font-bold font-display text-gray-900 tracking-tight">Senjr</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            How would you like to join?
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            Choose your path to get started on the platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Student Card */}
          <SlideUp delay={0.2}>
            <HoverCard 
              className="h-full p-8 flex flex-col items-center text-center cursor-pointer border-2 border-transparent hover:border-primary-100 group"
              onClick={() => navigate('/signup/student/1')}
            >
              <div className="w-16 h-16 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">I'm a Student</h2>
              <p className="text-gray-500 mb-8 flex-grow">
                Find mentors, book 1:1 sessions, and accelerate your career with guidance from top alumni.
              </p>
              <div className="flex items-center text-primary-500 font-bold group-hover:gap-3 transition-all gap-2">
                Join as Student <ArrowRight className="w-5 h-5" />
              </div>
            </HoverCard>
          </SlideUp>

          {/* Mentor Card */}
          <SlideUp delay={0.3}>
            <HoverCard 
              className="h-full p-8 flex flex-col items-center text-center cursor-pointer border-2 border-transparent hover:border-gray-900 group"
              onClick={() => navigate('/signup/mentor/1')}
            >
              <div className="w-16 h-16 bg-gray-100 text-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">I'm a Mentor</h2>
              <p className="text-gray-500 mb-8 flex-grow">
                Share your expertise, guide the next generation of builders, and earn on your own schedule.
              </p>
              <div className="flex items-center text-gray-900 font-bold group-hover:gap-3 transition-all gap-2">
                Apply as Mentor <ArrowRight className="w-5 h-5" />
              </div>
            </HoverCard>
          </SlideUp>
        </div>
        
        <div className="mt-12 text-center text-gray-500 font-medium">
          Already have an account? <Link to="/login" className="text-gray-900 font-bold hover:underline underline-offset-4">Log in here</Link>
        </div>
      </FadeIn>
    </div>
  );
};

export default RoleSelection;
