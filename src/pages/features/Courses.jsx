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
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 pb-24">
      
      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1">Courses</h1>
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src="https://i.pravatar.cc/100?img=11" alt="user" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 pt-5 space-y-4">

        {activeTab === 'My Courses' && (
          <div className="bg-gradient-to-r from-[#10b981] to-[#059669] rounded-2xl p-4 text-white mb-5">
            <p className="text-xs font-bold opacity-80 mb-1">LEARNING PROGRESS</p>
            <p className="text-2xl font-black">2 Active Courses</p>
            <div className="mt-3 bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full w-2/5"></div>
            </div>
            <p className="text-xs mt-1 opacity-80">40% of enrolled courses in progress</p>
          </div>
        )}

        {displayCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            
            {/* Thumbnail */}
            <div className="relative h-36 overflow-hidden">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              <div className="absolute top-3 left-3">
                <span
                  className="text-[10px] font-bold px-2 py-1 rounded-full"
                  style={{ backgroundColor: course.tagBg, color: course.tagColor }}
                >
                  {course.tag}
                </span>
              </div>

              {course.enrolled_by_me && course.progress > 0 && (
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex justify-between text-xs text-white font-medium mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="bg-white/30 rounded-full h-1.5">
                    <div
                      className="bg-[#10b981] h-1.5 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                <Play className="w-5 h-5 text-[#10b981] ml-0.5" fill="#10b981" />
              </button>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-2 leading-snug">{course.title}</h3>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img src={course.mentorAvatar} alt={course.mentor} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-medium text-gray-600">{course.mentor}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{course.lessons} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span>{course.rating}</span>
                </div>
              </div>

              {course.enrolled_by_me ? (
                <button className="w-full bg-[#10b981] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                  <Play className="w-3.5 h-3.5" />
                  {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                </button>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-gray-900">₹{course.price}</span>
                    <span className="text-xs text-gray-400 ml-1">{course.enrolled.toLocaleString()} enrolled</span>
                  </div>
                  <button className="bg-[#10b981] text-white px-5 py-2.5 rounded-xl text-xs font-bold">
                    Enroll Now
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

      </main>
    </div>
  );
};

export default Courses;
