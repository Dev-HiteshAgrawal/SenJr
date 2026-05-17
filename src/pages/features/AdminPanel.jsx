import React from 'react';
import { Menu, AlertTriangle, Wallet, Megaphone, ChevronRight, Users, ClipboardList, CreditCard, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col pb-24">
      
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between sticky top-0 z-50 bg-white">
        <button className="p-1">
          <Menu className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-xl font-bold font-display text-gray-900">Admin Panel</h1>
        <button className="text-sm font-bold text-[#10b981] active:text-emerald-700">
          Logout
        </button>
      </header>

      <main className="flex-1 px-4 space-y-8 pt-4">
        
        {/* Top Stats Grid */}
        <div className="grid grid-cols-2 gap-y-8 gap-x-4">
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Total Users</span>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-black text-gray-900">156</span>
              <span className="bg-[#ECFDF5] text-[#10b981] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                ↑12%
              </span>
            </div>
          </div>
          
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Active Mentors</span>
            <span className="text-4xl font-black text-gray-900 block">23</span>
          </div>
          
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Today's Sessions</span>
            <span className="text-4xl font-black text-gray-900 block">8</span>
          </div>
          
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Revenue</span>
            <span className="text-4xl font-black text-gray-900 block">₹4,200</span>
          </div>
        </div>

        {/* Pending Actions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Actions</h2>
          <div className="space-y-3">
            
            <button className="w-full flex items-center justify-between bg-[#FEF2F2] p-4 rounded-xl active:bg-red-100 transition-colors border border-red-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-bold text-red-800 text-sm">5 Mentor Verifications Pending</span>
              </div>
              <ChevronRight className="w-5 h-5 text-red-600" />
            </button>
            
            <button className="w-full flex items-center justify-between bg-[#FFF7ED] p-4 rounded-xl active:bg-orange-100 transition-colors border border-orange-50">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-[#9A3412]" />
                <span className="font-bold text-[#9A3412] text-sm">3 Payments to Verify</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9A3412]" />
            </button>
            
            <button className="w-full flex items-center justify-between bg-[#FEF2F2] p-4 rounded-xl active:bg-red-100 transition-colors border border-red-50">
              <div className="flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-red-600" />
                <span className="font-bold text-red-800 text-sm">2 Student Complaints</span>
              </div>
              <ChevronRight className="w-5 h-5 text-red-600" />
            </button>

          </div>
        </div>

        {/* Recent Signups */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Signups</h2>
          <div className="space-y-4 mb-4">
            
            {/* User 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200">
                  <img src="https://i.pravatar.cc/100?img=11" alt="Rahul K." className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Rahul K.</h3>
                  <p className="text-xs text-gray-500">rahul@univ.edu</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-gray-400 font-medium">2m ago</span>
                <span className="bg-[#E0E7FF] text-[#4F46E5] text-[10px] font-bold px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)]">Student</span>
              </div>
            </div>
            <div className="h-px bg-gray-100 w-full ml-14"></div>
            
            {/* User 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200">
                  <img src="https://i.pravatar.cc/100?img=5" alt="Dr. Sharma" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Dr. Sharma</h3>
                  <p className="text-xs text-gray-500">sharma@mentors.org</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-gray-400 font-medium">1h ago</span>
                <span className="bg-[#ECFDF5] text-[#10b981] text-[10px] font-bold px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)]">Mentor</span>
              </div>
            </div>
            <div className="h-px bg-gray-100 w-full ml-14"></div>
            
            {/* User 3 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center border border-indigo-100">
                  <span className="font-bold text-[#4F46E5]">AP</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Anita P.</h3>
                  <p className="text-xs text-gray-500">anita.p@mail.com</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-gray-400 font-medium">3h ago</span>
                <span className="bg-[#E0E7FF] text-[#4F46E5] text-[10px] font-bold px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)]">Student</span>
              </div>
            </div>
            <div className="h-px bg-gray-100 w-full ml-14"></div>
            
            {/* User 4 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200">
                  <img src="https://i.pravatar.cc/100?img=12" alt="Vikram S." className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Vikram S.</h3>
                  <p className="text-xs text-gray-500">vikram.s@univ.edu</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-gray-400 font-medium">5h ago</span>
                <span className="bg-[#E0E7FF] text-[#4F46E5] text-[10px] font-bold px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)]">Student</span>
              </div>
            </div>
            
          </div>
          
          <button className="w-full bg-[#F8FAFC] text-gray-900 font-bold py-3.5 rounded-xl border border-gray-200 text-sm active:bg-gray-100 transition-colors shadow-sm">
            View All Users
          </button>
        </div>

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center z-50">
        <button className="flex flex-col items-center gap-1 border-t-2 border-[#10b981] pt-1 -mt-[9px]">
          <Users className="w-6 h-6 text-[#10b981]" />
          <span className="text-[10px] font-bold text-[#10b981]">USERS</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-50">
          <ClipboardList className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600 uppercase">Sessions</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-50">
          <CreditCard className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600 uppercase">Payments</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-50">
          <Settings className="w-6 h-6 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600 uppercase">Settings</span>
        </button>
      </nav>

    </div>
  );
};

export default AdminPanel;