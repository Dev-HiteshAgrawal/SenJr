import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Play, Clock, Star, Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const courses = [
  {
    id: 1,
    title: 'UP Police Constable Complete Prep',
    mentor: 'Rahul Sharma',
    mentorAvatar: 'https://i.pravatar.cc/100?img=11',
    lessons: 24,
    duration: '18 hrs',
    rating: 4.9,
    enrolled: 1240,
    price: 499,
    progress: 65,
    tag: 'Govt Jobs',
    tagColor: '#1E40AF',
    tagBg: '#EFF6FF',
    thumbnail: 'https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?w=400&q=80',
    enrolled_by_me: true,
  },
  {
    id: 2,
    title: 'SSC CGL Maths Crash Course',
    mentor: 'Priya Verma',
    mentorAvatar: 'https://i.pravatar.cc/100?img=47',
    lessons: 16,
    duration: '12 hrs',
    rating: 4.8,
    enrolled: 876,
    price: 299,
    progress: 0,
    tag: 'SSC',
    tagColor: '#065F46',
    tagBg: '#ECFDF5',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80',
    enrolled_by_me: false,
  },
  {
    id: 3,
    title: 'CAT 2025 Complete Strategy',
    mentor: 'Amit Kumar',
    mentorAvatar: 'https://i.pravatar.cc/100?img=12',
    lessons: 32,
    duration: '28 hrs',
    rating: 4.7,
    enrolled: 2100,
    price: 799,
    progress: 20,
    tag: 'MBA',
    tagColor: '#9D174D',
    tagBg: '#FDF2F8',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
    enrolled_by_me: true,
  },
];

const tabs = ['My Courses', 'Explore', 'Saved'];

const Courses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('My Courses');

  const displayCourses = activeTab === 'My Courses'
    ? courses.filter(c => c.enrolled_by_me)
    : courses;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      
      {/* Header */}
      <header className="bg-white px-5 py-4 sticky top-0 z-50 border-b border-gray-100 shadow-sm rounded-b-3xl">
        <div className="flex items-center gap-4 mb-5">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 flex-1">Courses</h1>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src="https://i.pravatar.cc/100?img=11" alt="user" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 bg-gray-100 p-1.5 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="px-5 pt-6 space-y-5">

        {activeTab === 'My Courses' && (
          <div className="bg-gradient-to-br from-primary-600 to-primary-500 rounded-3xl p-5 text-white shadow-lg shadow-primary-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold opacity-80 mb-1 tracking-wider uppercase">Learning Progress</p>
              <p className="text-3xl font-black mb-4">2 Active Courses</p>
              <div className="bg-white/20 rounded-full h-2.5 overflow-hidden">
                <div className="bg-white h-full rounded-full w-2/5 relative">
                  <div className="absolute inset-0 bg-white/50 animate-pulse"></div>
                </div>
              </div>
              <p className="text-xs mt-2 opacity-90 font-medium">40% of enrolled courses in progress</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {displayCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:border-primary-100 transition-all group">
              
              {/* Thumbnail */}
              <div className="relative h-44 overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute top-4 left-4">
                  <span
                    className="text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm"
                    style={{ backgroundColor: course.tagBg, color: course.tagColor }}
                  >
                    {course.tag}
                  </span>
                </div>

                {course.enrolled_by_me && course.progress > 0 && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between text-[11px] text-white font-bold mb-1.5 uppercase tracking-wider">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="bg-white/30 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-full rounded-full shadow-sm"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <button className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-white">
                  <Play className="w-6 h-6 text-primary-500 ml-1" fill="currentColor" />
                </button>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-3 leading-snug line-clamp-2">{course.title}</h3>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
                    <img src={course.mentorAvatar} alt={course.mentor} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">{course.mentor}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-5 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-1.5 font-medium">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-1 font-bold text-gray-700">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {course.enrolled_by_me ? (
                  <button className="w-full bg-primary-500 text-white py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-primary-500/20 active:scale-[0.98] hover:bg-primary-600 transition-all">
                    <Play className="w-4 h-4" />
                    {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                  </button>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-gray-900">₹{course.price}</span>
                      <span className="text-[11px] font-bold text-gray-400 ml-2 block uppercase tracking-wider mt-0.5">{course.enrolled.toLocaleString()} enrolled</span>
                    </div>
                    <button className="bg-gray-900 text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-md hover:bg-gray-800 active:scale-[0.98] transition-all">
                      Enroll Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default Courses;
