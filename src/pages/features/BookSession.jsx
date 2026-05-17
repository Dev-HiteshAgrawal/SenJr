import React, { useState } from 'react';
import { ArrowLeft, X, CheckCircle2, Sun, Sunset, Moon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookSession = () => {
  const navigate = useNavigate();
  
  const [activeDate, setActiveDate] = useState('Today');
  const [duration, setDuration] = useState('60 min');
  const [activeTime, setActiveTime] = useState('2:00 PM');
  
  const dates = [
    { label: 'Today', date: '13' },
    { label: 'Tomorrow', date: '14' },
    { label: 'Thu', date: '15' },
    { label: 'Fri', date: '16' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col pb-24">
      
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm rounded-b-3xl">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Book Session</h1>
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </header>

      <main className="flex-1 px-5 pt-6 space-y-6">
        
        {/* Mentor Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 flex gap-4 overflow-hidden shadow-sm relative">
          {/* subtle glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="relative shrink-0 z-10">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
              <img src="https://i.pravatar.cc/150?img=11" alt="Rahul S." className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary-500 rounded-full p-0.5 border-2 border-white shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="flex flex-col justify-center relative z-10">
            <h2 className="text-xl font-bold text-gray-900 leading-tight mb-1">Rahul S.</h2>
            <div className="flex items-center gap-1 text-sm text-gray-500 font-medium mb-2">
              <span className="font-bold text-gray-800">4.8</span>
              <span className="text-yellow-400 text-xs">⭐</span>
              <span>(120 reviews)</span>
            </div>
            <div className="bg-primary-50 text-primary-600 rounded-full px-3 py-1 text-[11px] font-bold w-max uppercase tracking-wider">
              ₹200/hr
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <section>
          <span className="text-[11px] font-bold text-gray-500 tracking-wider mb-3 block uppercase">Select Date</span>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar">
            {dates.map((d) => (
              <button 
                key={d.label}
                onClick={() => setActiveDate(d.label)}
                className={`relative min-w-[72px] shrink-0 w-full py-3 rounded-2xl border flex flex-col items-center transition-all ${
                  activeDate === d.label 
                    ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${activeDate === d.label ? 'text-primary-100' : 'text-gray-500'}`}>{d.label}</span>
                <span className="text-2xl font-black mt-1">{d.date}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Duration Selection */}
        <section>
          <span className="text-[11px] font-bold text-gray-500 tracking-wider mb-3 block uppercase">Duration</span>
          <div className="flex flex-wrap gap-2">
            {['30 min', '45 min', '60 min', '90 min'].map((dur) => (
              <button 
                key={dur}
                onClick={() => setDuration(dur)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  duration === dur 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {dur}
              </button>
            ))}
          </div>
        </section>

        {/* Time Slots */}
        <section className="space-y-6">
          {/* Morning */}
          <div>
            <div className="flex items-center gap-1.5 mb-3 text-amber-600">
              <Sun className="w-4 h-4" />
              <span className="text-[11px] font-bold tracking-wider uppercase">Morning</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <button className="border border-gray-200 rounded-xl py-3 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-primary-200 transition-colors">9:00 AM</button>
              <button className="border border-gray-100 rounded-xl py-3 text-sm font-bold text-gray-300 bg-gray-50 cursor-not-allowed" disabled>10:00 AM</button>
              <button className="border border-gray-200 rounded-xl py-3 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-primary-200 transition-colors">11:00 AM</button>
            </div>
          </div>
          
          {/* Afternoon */}
          <div>
            <div className="flex items-center gap-1.5 mb-3 text-orange-500">
              <Sunset className="w-4 h-4" />
              <span className="text-[11px] font-bold tracking-wider uppercase">Afternoon</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <button className="border-none rounded-xl py-3 text-sm font-bold text-white bg-primary-500 shadow-md shadow-primary-500/20 active:scale-95 transition-all">2:00 PM</button>
              <button className="border border-gray-200 rounded-xl py-3 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-primary-200 transition-colors">3:30 PM</button>
              <button className="border border-gray-200 rounded-xl py-3 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-primary-200 transition-colors">4:30 PM</button>
            </div>
          </div>
          
          {/* Evening */}
          <div>
            <div className="flex items-center gap-1.5 mb-3 text-indigo-500">
              <Moon className="w-4 h-4" />
              <span className="text-[11px] font-bold tracking-wider uppercase">Evening</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <button className="border border-gray-200 rounded-xl py-3 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-primary-200 transition-colors">6:00 PM</button>
              <button className="border border-gray-200 rounded-xl py-3 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-primary-200 transition-colors">7:00 PM</button>
              <button className="border border-gray-200 rounded-xl py-3 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-primary-200 transition-colors">8:30 PM</button>
            </div>
          </div>
        </section>

        {/* What do you want to learn? */}
        <section>
          <span className="text-[11px] font-bold text-gray-500 tracking-wider mb-3 block uppercase">What do you want to learn?</span>
          <textarea 
            rows="3"
            placeholder="E.g. I need help with my Data Structures assignment..."
            className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium placeholder-gray-400 transition-all shadow-sm"
          ></textarea>
        </section>

        {/* Price Calculation */}
        <section>
          <div className="bg-primary-50 border border-primary-100 rounded-3xl p-5 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-primary-600 mb-0.5 uppercase tracking-wider">Calculation</p>
              <p className="text-sm font-bold text-gray-900">₹200 × 1 hour</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-primary-600 mb-0.5 uppercase tracking-wider">Total Amount</p>
              <p className="text-3xl font-black text-primary-600">₹200</p>
            </div>
          </div>
        </section>

      </main>

      {/* Bottom Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-5 border-t border-gray-100 z-50">
        <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg">
          Confirm Booking <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};

export default BookSession;