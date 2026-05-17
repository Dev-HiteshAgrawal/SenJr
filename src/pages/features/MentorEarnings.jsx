import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, DollarSign, Calendar, ChevronRight, Download, CreditCard, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const earningsData = [
  { month: 'Jan', amount: 1800 },
  { month: 'Feb', amount: 2400 },
  { month: 'Mar', amount: 2100 },
  { month: 'Apr', amount: 3200 },
  { month: 'May', amount: 2450 },
];

const transactions = [
  { id: 1, student: 'Hitesh Agrawal', subject: 'UP Police Prep', date: 'Today, 4:00 PM', amount: 180, status: 'paid' },
  { id: 2, student: 'Anita Patel', subject: 'BBA Entrance Prep', date: 'May 16, 11:00 AM', amount: 180, status: 'paid' },
  { id: 3, student: 'Vikram Singh', subject: 'Reasoning Session', date: 'May 15, 6:00 PM', amount: 180, status: 'pending' },
  { id: 4, student: 'Riya Sharma', subject: 'Economics Doubt', date: 'May 13, 9:00 AM', amount: 180, status: 'paid' },
];

const maxEarning = Math.max(...earningsData.map(e => e.amount));

const MentorEarnings = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('This Month');

  const totalEarned = earningsData.reduce((a, b) => a + b.amount, 0);
  const thisMonth = earningsData[earningsData.length - 1].amount;
  const pending = transactions.filter(t => t.status === 'pending').reduce((a, t) => a + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      
      {/* Header */}
      <header className="bg-white px-5 py-4 sticky top-0 z-50 border-b border-gray-100 shadow-sm rounded-b-3xl">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 flex-1">Earnings</h1>
          <button className="p-2.5 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl border border-gray-200">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </header>

      <main className="px-5 pt-6 space-y-6">

        {/* Earnings Overview Card */}
        <div className="bg-gradient-to-br from-mentor-600 to-mentor-500 rounded-3xl p-6 text-white shadow-lg shadow-mentor-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <p className="text-xs font-bold opacity-80 mb-1 tracking-wider uppercase">Total Earned</p>
            <p className="text-4xl font-black mb-6">₹{totalEarned.toLocaleString()}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <p className="text-[10px] opacity-80 mb-1 tracking-wider uppercase">This Month</p>
                <p className="text-xl font-black">₹{thisMonth.toLocaleString()}</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <p className="text-[10px] opacity-80 mb-1 tracking-wider uppercase">Pending</p>
                <p className="text-xl font-black">₹{pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Withdraw Banner */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="font-bold text-gray-900 mb-0.5">Available to Withdraw</p>
            <p className="text-3xl font-black text-mentor-600">₹{(thisMonth * 0.9).toFixed(0)}</p>
            <p className="text-[10px] font-semibold text-gray-400 mt-1">After 10% platform fee</p>
          </div>
          <button className="bg-mentor-500 text-white px-5 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-mentor-600 active:scale-[0.98] transition-all shadow-md shadow-mentor-500/20 relative z-10">
            <CreditCard className="w-5 h-5" /> Withdraw
          </button>
        </div>

        {/* UPI Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-blue-900">UPI: rahul.sharma@okicici</p>
            <p className="text-xs font-medium text-blue-600 mt-0.5">Transfers process in 24 hrs</p>
          </div>
          <button className="ml-auto text-sm font-bold text-blue-700 bg-blue-100/50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">Edit</button>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900 text-lg">Monthly Breakdown</h2>
            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
              {['5M', '1Y'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    period === p ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-end gap-3 h-32">
            {earningsData.map((e, i) => (
              <div key={e.month} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-mentor-600 transition-colors">₹{(e.amount/1000).toFixed(1)}k</span>
                <div
                  className={`w-full rounded-t-xl transition-all ${i === earningsData.length - 1 ? 'bg-mentor-500' : 'bg-mentor-100 group-hover:bg-mentor-200'}`}
                  style={{ height: `${(e.amount / maxEarning) * 100}px` }}
                ></div>
                <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors">{e.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="font-bold text-gray-900 text-lg">Recent Payments</h2>
            <button className="text-sm font-bold text-mentor-600">View All</button>
          </div>
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:border-mentor-100 transition-colors">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${
                  t.status === 'paid' ? 'bg-mentor-50 text-mentor-600' : 'bg-yellow-50 text-yellow-600'
                }`}>
                  {t.student.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-gray-900 truncate mb-0.5">{t.student}</p>
                  <p className="text-xs font-medium text-gray-500 truncate">{t.subject} • {t.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-black text-gray-900 mb-1">+₹{t.amount}</p>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    t.status === 'paid' ? 'bg-mentor-50 text-mentor-600' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {t.status === 'paid' ? 'Received' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default MentorEarnings;
