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
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 pb-24">
      
      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1">Earnings</h1>
          <button className="p-2 bg-gray-50 rounded-xl border border-gray-200">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </header>

      <main className="px-4 pt-5 space-y-5">

        {/* Earnings Overview Card */}
        <div className="bg-gradient-to-br from-[#064E3B] to-[#10b981] rounded-2xl p-5 text-white">
          <p className="text-xs font-bold opacity-70 mb-1">TOTAL EARNED</p>
          <p className="text-4xl font-black mb-4">₹{totalEarned.toLocaleString()}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-[10px] opacity-70 mb-1">THIS MONTH</p>
              <p className="text-xl font-black">₹{thisMonth.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-[10px] opacity-70 mb-1">PENDING</p>
              <p className="text-xl font-black">₹{pending}</p>
            </div>
          </div>
        </div>

        {/* Withdraw Banner */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-900 mb-0.5">Available to Withdraw</p>
            <p className="text-2xl font-black text-[#10b981]">₹{(thisMonth * 0.9).toFixed(0)}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">After 10% Senjr platform fee</p>
          </div>
          <button className="bg-[#10b981] text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm">
            <CreditCard className="w-4 h-4" /> Withdraw
          </button>
        </div>

        {/* UPI Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-blue-800">UPI: rahul.sharma@okicici</p>
            <p className="text-[10px] text-blue-600">Transfers process in 24 hrs</p>
          </div>
          <button className="ml-auto text-xs font-bold text-blue-700">Edit</button>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Monthly Breakdown</h2>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {['5M', '1Y'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-end gap-2 h-28">
            {earningsData.map((e, i) => (
              <div key={e.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold text-gray-500">₹{(e.amount/1000).toFixed(1)}k</span>
                <div
                  className={`w-full rounded-t-lg ${i === earningsData.length - 1 ? 'bg-[#10b981]' : 'bg-[#D1FAE5]'}`}
                  style={{ height: `${(e.amount / maxEarning) * 80}px` }}
                ></div>
                <span className="text-[10px] font-bold text-gray-500">{e.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Recent Payments</h2>
            <button className="text-xs font-bold text-[#10b981]">View All</button>
          </div>
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ECFDF5] rounded-full flex items-center justify-center text-sm font-bold text-[#10b981]">
                  {t.student.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{t.student}</p>
                  <p className="text-[10px] text-gray-500 truncate">{t.subject} • {t.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">+₹{t.amount}</p>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    t.status === 'paid' ? 'bg-[#ECFDF5] text-[#10b981]' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {t.status === 'paid' ? 'Received' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default MentorEarnings;
