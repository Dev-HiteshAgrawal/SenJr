import React from 'react';
import { Menu, Bell, Wallet, Calendar, User, Star, BarChart2, ArrowRight, Home, IndianRupee } from 'lucide-react';

const MentorDashboard = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col pb-24">
      
      {/* Top App Bar */}
      <header className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Menu className="w-6 h-6 text-gray-900" />
          <h1 className="text-xl font-bold font-display text-gray-900">Mentor Hub</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-[#10b981] font-bold">
            <span className="text-sm">₹2,450</span>
          </div>
          <Bell className="w-5 h-5 text-gray-700" />
          <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
            <img src="https://i.pravatar.cc/100?img=8" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-6 space-y-6">
        
        {/* Greeting */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-1">
            Welcome back, Rahul! 🎓
          </h2>
          <p className="text-gray-600 text-sm">You have 3 sessions today</p>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="border border-gray-200 rounded-2xl py-3 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-gray-500 tracking-wider mb-1">SESSIONS</span>
            <span className="text-xl font-black text-blue-500">12</span>
          </div>
          <div className="border border-gray-200 rounded-2xl py-3 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-gray-500 tracking-wider mb-1">STUDENTS</span>
            <span className="text-xl font-black text-[#10b981]">8</span>
          </div>
          <div className="border border-gray-200 rounded-2xl py-3 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-gray-500 tracking-wider mb-1">RATING</span>
            <div className="flex items-center gap-1">
              <span className="text-xl font-black text-gray-900">4.8</span>
              <span className="text-sm text-yellow-400">★</span>
            </div>
          </div>
        </div>

        {/* Earnings Section */}
        <div className="bg-[#F0FDF4] border border-[#D1FAE5] rounded-3xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">💰</span>
              <h3 className="font-bold text-gray-800">Earnings This Month</h3>
            </div>
            <button className="text-[10px] font-bold text-gray-900 flex items-center gap-1">
              View <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="text-3xl font-black text-gray-900 mb-6">₹2,450</div>
          
          {/* Simple Bar Chart */}
          <div className="flex items-end gap-2 h-16 mb-6">
            <div className="flex-1 bg-[#34d399] rounded-t-sm h-[30%]"></div>
            <div className="flex-1 bg-[#34d399] rounded-t-sm h-[50%]"></div>
            <div className="flex-1 bg-[#34d399] rounded-t-sm h-[40%]"></div>
            <div className="flex-1 bg-[#34d399] rounded-t-sm h-[70%]"></div>
            <div className="flex-1 bg-[#10b981] rounded-t-sm h-[90%]"></div>
            <div className="flex-1 bg-[#34d399] rounded-t-sm h-[50%]"></div>
            <div className="flex-1 bg-[#34d399] rounded-t-sm h-[80%]"></div>
          </div>
          
          <button className="w-full bg-white border border-[#10b981] text-[#10b981] font-bold py-3 rounded-full active:bg-green-50 transition-colors">
            Withdraw to UPI
          </button>
        </div>

        {/* Schedule */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <h3 className="font-bold font-display text-gray-900">Today's Schedule</h3>
            </div>
            <button className="text-[10px] font-bold text-gray-600 flex items-center gap-1">
              View Calendar <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Upcoming Session */}
            <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-[#10b981] shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700">
                  HA
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Hitesh A.</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">9:00 AM • BBA Economics</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="bg-[#EFF6FF] text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold">Upcoming</span>
                <button className="bg-[#10b981] text-white text-xs font-bold px-4 py-1.5 rounded-full active:bg-emerald-600">
                  Start
                </button>
              </div>
            </div>

            {/* Completed Session */}
            <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3 opacity-60">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
                  MS
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Megha S.</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">11:30 AM • BCom Maths</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-gray-400 px-2 py-0.5 text-[10px] font-medium">Completed</span>
                <span className="text-gray-900 text-xs font-medium px-4 py-1.5">Review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm active:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xs font-medium text-gray-700">Set Availability</span>
          </button>
          
          <button className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm active:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xs font-medium text-gray-700">My Profile</span>
          </button>
          
          <button className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm active:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xs font-medium text-gray-700">View Reviews</span>
          </button>
          
          <button className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm active:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <BarChart2 className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xs font-medium text-gray-700">Analytics</span>
          </button>
        </div>

        {/* Recent Reviews */}
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400 text-lg">⭐</span>
            <h3 className="font-bold text-gray-900">Recent Reviews</h3>
          </div>
          
          <div className="mb-4">
            <div className="flex gap-1 mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-gray-800 fill-gray-800" />)}
            </div>
            <p className="text-sm font-medium text-gray-700 italic mb-2">
              "Best mentor ever! Explains complex concepts with ease."
            </p>
            <p className="text-xs text-gray-500 text-right">— Hitesh, BBA 2nd Year</p>
          </div>
          
          <button className="w-full text-center text-xs font-bold text-gray-600 flex items-center justify-center gap-1 py-2">
            View All Reviews <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Performance Insights */}
        <div className="border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-600 mb-4">Performance Insights</h3>
          
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-[10px] font-bold text-gray-500 mb-1">Avg Response</p>
              <p className="text-sm font-medium text-gray-900">2 hrs</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 mb-1">Completion Rate</p>
              <p className="text-sm font-medium text-gray-900">95%</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 mb-1">Repeat Students</p>
              <p className="text-sm font-medium text-gray-900">60%</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 mb-1">Total Earnings</p>
              <p className="text-sm font-medium text-gray-900">₹12,500</p>
            </div>
          </div>
        </div>

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center z-50">
        <button className="flex flex-col items-center gap-1">
          <Home className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Calendar className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Schedule</span>
        </button>
        
        {/* Empty space for FAB */}
        <div className="w-12"></div>
        
        <button className="flex flex-col items-center gap-1">
          <IndianRupee className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Earnings</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <User className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Profile</span>
        </button>
      </nav>

      {/* FAB */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex justify-center">
        <button className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
          {/* Typically a + or mic icon, leaving it blank/circle as per mockup, wait, the mockup has an empty circle wireframe? No, it looks like a large empty circle or maybe a scan button. I will put a simple plus or just a white circle with a drop shadow. Let's make it a prominent empty button. */}
          <div className="w-8 h-8 rounded-full border-2 border-gray-200"></div>
        </button>
      </div>

    </div>
  );
};

export default MentorDashboard;