import React, { useState } from 'react';
import { ArrowLeft, X, CheckCircle2, Sun, Sunset, Moon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StaggerContainer, StaggerItem, HoverCard, PrimaryButton, FadeIn } from '../../components/common/MotionWrapper';

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
    <div className="min-h-screen bg-[#F3F9F6] font-sans text-gray-900 flex flex-col pb-24">
      
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between sticky top-0 z-50 bg-[#F3F9F6]">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center bg-white active:bg-gray-50">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold font-display text-[#064E3B]">Book Session</h1>
        <button className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center bg-white active:bg-gray-50">
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </header>

      <main className="flex-1 px-4 space-y-6">
        
        {/* Mentor Card */}
        <FadeIn delay={0.1}>
          <div className="relative group mt-2">
            <div className="absolute inset-0 bg-black translate-y-1.5 translate-x-1.5 rounded-xl"></div>
            <div className="relative bg-white border border-gray-900 rounded-xl p-4 flex gap-4 overflow-hidden">
              {/* Orange gradient blur background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-60 -mr-10 -mt-10 pointer-events-none"></div>
              
              <div className="relative">
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Rahul S." className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#10b981] rounded-full p-0.5 border-2 border-white">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="flex flex-col justify-center relative z-10">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">Rahul S.</h2>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <span className="font-bold">4.8</span>
                  <span className="text-yellow-400 text-xs">⭐</span>
                  <span>(120 reviews)</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-xs font-bold w-max">
                  ₹200/hr
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Date Selection */}
        <FadeIn delay={0.2}>
          <span className="text-xs font-bold text-gray-500 tracking-wider mb-3 block uppercase">Select Date</span>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            {dates.map((d) => (
              <button 
                key={d.label}
                onClick={() => setActiveDate(d.label)}
                className={`relative min-w-[70px] shrink-0 group`}
              >
                {activeDate === d.label && (
                  <div className="absolute inset-0 bg-[#10b981] translate-y-1 translate-x-1 rounded-lg"></div>
                )}
                <div className={`relative w-full py-2.5 rounded-lg border flex flex-col items-center transition-transform ${
                  activeDate === d.label 
                    ? 'bg-gray-900 text-white border-gray-900 font-bold' 
                    : 'bg-white text-gray-700 border-gray-200'
                }`}>
                  <span className="text-[10px] font-bold">{d.label}</span>
                  <span className="text-2xl font-black">{d.date}</span>
                </div>
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Duration Selection */}
        <FadeIn delay={0.3}>
          <span className="text-xs font-bold text-gray-500 tracking-wider mb-3 block uppercase">Duration</span>
          <div className="flex flex-wrap gap-3">
            {['30 min', '45 min', '60 min', '90 min'].map((dur) => (
              <button 
                key={dur}
                onClick={() => setDuration(dur)}
                className="relative group"
              >
                {duration === dur && (
                  <div className="absolute inset-0 bg-[#10b981] translate-y-1 translate-x-1 rounded-full"></div>
                )}
                <div className={`relative px-5 py-2 rounded-full border text-sm font-bold transition-transform ${
                  duration === dur 
                    ? 'bg-gray-900 text-white border-gray-900' 
                    : 'bg-white text-gray-700 border-gray-200'
                }`}>
                  {dur}
                </div>
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Time Slots */}
        <StaggerContainer className="space-y-5" staggerDelay={0.1}>
          {/* Morning */}
          <StaggerItem>
            <div className="flex items-center gap-1.5 mb-3 text-amber-700">
              <Sun className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wider uppercase">Morning</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button className="border border-gray-200 rounded-lg py-2 text-sm font-bold text-gray-700 bg-white">9:00 AM</button>
              <button className="border border-gray-100 rounded-lg py-2 text-sm font-bold text-gray-300 bg-gray-50 cursor-not-allowed" disabled>10:00 AM</button>
              <button className="border border-gray-200 rounded-lg py-2 text-sm font-bold text-gray-700 bg-white">11:00 AM</button>
            </div>
          </StaggerItem>
          
          {/* Afternoon */}
          <StaggerItem>
            <div className="flex items-center gap-1.5 mb-3 text-orange-700">
              <Sunset className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wider uppercase">Afternoon</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button className="relative group">
                <div className="absolute inset-0 bg-[#10b981] translate-y-1 translate-x-1 rounded-lg"></div>
                <div className="relative border border-gray-900 rounded-lg py-2 text-sm font-bold text-white bg-gray-900">2:00 PM</div>
              </button>
              <button className="border border-gray-200 rounded-lg py-2 text-sm font-bold text-gray-700 bg-white">3:30 PM</button>
              <button className="border border-gray-200 rounded-lg py-2 text-sm font-bold text-gray-700 bg-white">4:30 PM</button>
            </div>
          </StaggerItem>
          
          {/* Evening */}
          <StaggerItem>
            <div className="flex items-center gap-1.5 mb-3 text-indigo-800">
              <Moon className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wider uppercase">Evening</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button className="border border-gray-200 rounded-lg py-2 text-sm font-bold text-gray-700 bg-white">6:00 PM</button>
              <button className="border border-gray-200 rounded-lg py-2 text-sm font-bold text-gray-700 bg-white">7:00 PM</button>
              <button className="border border-gray-200 rounded-lg py-2 text-sm font-bold text-gray-700 bg-white">8:30 PM</button>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* What do you want to learn? */}
        <FadeIn delay={0.6}>
          <span className="text-xs font-bold text-gray-500 tracking-wider mb-3 block uppercase">What do you want to learn?</span>
          <textarea 
            rows="3"
            placeholder="E.g. I need help with my Data Structures assignment or want to discuss internship prep..."
            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-[#10b981]"
          ></textarea>
        </FadeIn>

        {/* Price Calculation */}
        <FadeIn delay={0.7}>
          <div className="relative group">
            <div className="absolute inset-0 bg-[#064E3B] translate-y-1.5 translate-x-1.5 rounded-xl"></div>
            <div className="relative bg-[#D1FAE5] border border-gray-900 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-600 mb-0.5">Price Calculation</p>
                <p className="text-sm font-bold text-gray-800">₹200 × 1 hour</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-600 mb-0.5">Total Amount</p>
                <p className="text-3xl font-black text-[#064E3B]">₹200</p>
              </div>
            </div>
          </div>
        </FadeIn>

      </main>

      {/* Bottom Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F3F9F6] p-4 pb-6 z-50">
        <PrimaryButton className="w-full relative py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2">
          Confirm Booking <ArrowRight className="w-5 h-5" />
        </PrimaryButton>
      </div>

    </div>
  );
};

export default BookSession;