import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, CheckCircle2, Plus, Minus, Save, Calendar as CalIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AvailabilitySettings = () => {
  const navigate = useNavigate();
  
  // State for toggles
  const [activeDay, setActiveDay] = useState(13);
  const [fromAM, setFromAM] = useState(true);
  const [untilAM, setUntilAM] = useState(false);
  const [slotDuration, setSlotDuration] = useState(30);
  const [advancedOpen, setAdvancedOpen] = useState(true);
  const [repeatOption, setRepeatOption] = useState('weekly');
  const [autoAccept, setAutoAccept] = useState(true);

  const days = [
    { day: 'MON', date: 12 },
    { day: 'TUE', date: 13 },
    { day: 'WED', date: 14 },
    { day: 'THU', date: 15 },
    { day: 'FRI', date: 16 },
    { day: 'SAT', date: 17 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 flex flex-col pb-24">
      
      {/* Header */}
      <header className="bg-[#0B1527] px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Availability Settings</h1>
        </div>
        <button className="text-sm font-bold text-blue-400 active:text-blue-300">
          Save
        </button>
      </header>

      <main className="flex-1 p-4 space-y-6">
        
        {/* Working Days */}
        <div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3 block">
            Select Working Days
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {days.map((item) => (
              <button 
                key={item.date}
                onClick={() => setActiveDay(item.date)}
                className={`min-w-[60px] py-2 rounded-xl flex flex-col items-center border transition-colors ${
                  activeDay === item.date 
                    ? 'bg-[#10b981] border-[#10b981] text-white shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{item.day}</span>
                <span className="text-xl font-bold">{item.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Settings Container */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-6 shadow-sm">
          
          {/* AVAILABLE FROM */}
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4 block">
              Available From:
            </span>
            <div className="flex items-center gap-6 mb-4">
              {/* Hour */}
              <div className="flex flex-col items-center">
                <button className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 active:bg-gray-100 border border-gray-200">
                  <Plus className="w-5 h-5" />
                </button>
                <span className="text-5xl font-black font-display text-[#0B1527] my-2">09</span>
                <button className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 active:bg-gray-100 border border-gray-200">
                  <Minus className="w-5 h-5" />
                </button>
              </div>
              
              <span className="text-3xl font-bold text-gray-400 mb-2">:</span>
              
              {/* Minute */}
              <div className="flex flex-col items-center">
                <button className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 active:bg-gray-100 border border-gray-200">
                  <Plus className="w-5 h-5" />
                </button>
                <span className="text-5xl font-black font-display text-[#0B1527] my-2">00</span>
                <button className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 active:bg-gray-100 border border-gray-200">
                  <Minus className="w-5 h-5" />
                </button>
              </div>

              {/* AM/PM */}
              <div className="flex flex-col gap-2 ml-4">
                <button 
                  onClick={() => setFromAM(true)}
                  className={`w-14 py-2 rounded-lg text-sm font-bold transition-colors ${
                    fromAM ? 'bg-[#1E40AF] text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  AM
                </button>
                <button 
                  onClick={() => setFromAM(false)}
                  className={`w-14 py-2 rounded-lg text-sm font-bold transition-colors ${
                    !fromAM ? 'bg-[#1E40AF] text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Quick Times */}
            <div className="flex flex-wrap gap-2">
              {['6AM', '9AM', '12PM', '3PM', '6PM'].map((time) => (
                <button 
                  key={time}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    time === '9AM' ? 'bg-[#D1FAE5] text-[#10b981]' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full"></div>

          {/* AVAILABLE UNTIL */}
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4 block">
              Available Until:
            </span>
            <div className="flex items-center gap-6 mb-4">
              {/* Hour */}
              <div className="flex flex-col items-center">
                <button className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 active:bg-gray-100 border border-gray-200">
                  <Plus className="w-5 h-5" />
                </button>
                <span className="text-5xl font-black font-display text-[#1E40AF] my-2">12</span>
                <button className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 active:bg-gray-100 border border-gray-200">
                  <Minus className="w-5 h-5" />
                </button>
              </div>
              
              <span className="text-3xl font-bold text-gray-400 mb-2">:</span>
              
              {/* Minute */}
              <div className="flex flex-col items-center">
                <button className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 active:bg-gray-100 border border-gray-200">
                  <Plus className="w-5 h-5" />
                </button>
                <span className="text-5xl font-black font-display text-[#1E40AF] my-2">00</span>
                <button className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 active:bg-gray-100 border border-gray-200">
                  <Minus className="w-5 h-5" />
                </button>
              </div>

              {/* AM/PM */}
              <div className="flex flex-col gap-2 ml-4">
                <button 
                  onClick={() => setUntilAM(true)}
                  className={`w-14 py-2 rounded-lg text-sm font-bold transition-colors ${
                    untilAM ? 'bg-[#1E40AF] text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  AM
                </button>
                <button 
                  onClick={() => setUntilAM(false)}
                  className={`w-14 py-2 rounded-lg text-sm font-bold transition-colors ${
                    !untilAM ? 'bg-[#1E40AF] text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 font-medium italic">Defaulting to 3 hours after start time.</p>
          </div>

          <div className="h-px bg-gray-100 w-full"></div>

          {/* Slot Settings */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-gray-500 mb-2 block">Slot Duration (Min)</span>
              <div className="flex gap-2 flex-wrap">
                {[15, 30, 45, 60, 'Custom'].map((dur) => (
                  <button 
                    key={dur}
                    onClick={() => typeof dur === 'number' && setSlotDuration(dur)}
                    className={`flex-1 min-w-[50px] py-2 rounded-xl text-xs font-bold transition-colors ${
                      slotDuration === dur 
                        ? 'bg-[#10b981] text-white' 
                        : 'bg-gray-50 border border-gray-200 text-gray-600'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-gray-500 mb-2 block">Buffer</span>
                <select className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 outline-none">
                  <option>5 min</option>
                  <option>10 min</option>
                  <option>15 min</option>
                </select>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-500 mb-2 block">Break After</span>
                <select className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 outline-none">
                  <option>3 slots</option>
                  <option>4 slots</option>
                  <option>5 slots</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3">
              <span className="text-xs font-bold text-gray-500">Break Duration</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-blue-600">10 min</span>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                  <button className="w-6 h-6 flex items-center justify-center text-gray-500 active:bg-gray-200 rounded-md">
                    <Minus className="w-3 h-3" />
                  </button>
                  <button className="w-6 h-6 flex items-center justify-center text-gray-500 active:bg-gray-200 rounded-md">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Generated Slots */}
        <div className="bg-[#F8FAFC] border border-dashed border-gray-300 rounded-2xl p-4">
          <span className="text-sm font-bold text-gray-900 mb-3 block">Generated Slots:</span>
          
          <div className="space-y-2">
            {/* Slot 1 */}
            <div className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm">
              <span className="text-xs font-bold text-gray-700">09:00 AM - 09:30 AM</span>
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            </div>
            
            {/* Slot 2 */}
            <div className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm">
              <span className="text-xs font-bold text-gray-700">09:35 AM - 10:05 AM</span>
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            </div>
            
            {/* Slot 3 */}
            <div className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm">
              <span className="text-xs font-bold text-gray-700">10:10 AM - 10:40 AM</span>
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            </div>

            {/* Break */}
            <div className="flex items-center justify-center gap-2 py-2">
              <div className="h-px bg-orange-200 flex-1"></div>
              <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-wider flex items-center gap-1">
                ☕ 10 MIN BREAK
              </span>
              <div className="h-px bg-orange-200 flex-1"></div>
            </div>

            {/* Slot 4 */}
            <div className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm">
              <span className="text-xs font-bold text-gray-700">10:50 AM - 11:20 AM</span>
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <button 
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="w-full p-4 flex justify-between items-center bg-white"
          >
            <span className="text-sm font-bold text-gray-900">Advanced Options</span>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {advancedOpen && (
            <div className="p-4 pt-0 space-y-4 border-t border-gray-100 mt-2">
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Blackout Dates</span>
                <div className="flex gap-2">
                  <div className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-[10px] font-bold">15 AUG</div>
                  <div className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-[10px] font-bold">02 OCT</div>
                  <button className="text-gray-500 p-1">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Min Notice</span>
                <span className="text-xs font-bold text-gray-900">24 Hours</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Auto-accept Bookings</span>
                <button 
                  onClick={() => setAutoAccept(!autoAccept)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${autoAccept ? 'bg-[#10b981]' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autoAccept ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Repeating Options */}
        <div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3 block">
            Repeating Options
          </span>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            
            <label className="flex items-center gap-3 p-4 border-b border-gray-100 cursor-pointer active:bg-gray-50">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${repeatOption === 'weekly' ? 'border-[#10b981]' : 'border-gray-300'}`}>
                {repeatOption === 'weekly' && <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>}
              </div>
              <input 
                type="radio" 
                name="repeat" 
                value="weekly" 
                checked={repeatOption === 'weekly'} 
                onChange={() => setRepeatOption('weekly')}
                className="hidden" 
              />
              <span className="text-sm font-medium text-gray-700">Repeat every week</span>
            </label>

            <label className="flex items-center gap-3 p-4 border-b border-gray-100 cursor-pointer active:bg-gray-50">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${repeatOption === 'biweekly' ? 'border-[#10b981]' : 'border-gray-300'}`}>
                {repeatOption === 'biweekly' && <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>}
              </div>
              <input 
                type="radio" 
                name="repeat" 
                value="biweekly" 
                checked={repeatOption === 'biweekly'} 
                onChange={() => setRepeatOption('biweekly')}
                className="hidden" 
              />
              <span className="text-sm font-medium text-gray-700">Repeat every 2 weeks</span>
            </label>

            <label className="flex items-center gap-3 p-4 cursor-pointer active:bg-gray-50">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${repeatOption === 'custom' ? 'border-[#10b981]' : 'border-gray-300'}`}>
                {repeatOption === 'custom' && <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>}
              </div>
              <input 
                type="radio" 
                name="repeat" 
                value="custom" 
                checked={repeatOption === 'custom'} 
                onChange={() => setRepeatOption('custom')}
                className="hidden" 
              />
              <span className="text-sm font-medium text-gray-700">Custom</span>
            </label>
            
          </div>
        </div>

      </main>

      {/* Bottom Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
        <button className="w-full bg-[#10b981] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:bg-emerald-600 transition-colors shadow-sm">
          <Save className="w-4 h-4" /> Save Availability
        </button>
      </div>

    </div>
  );
};

export default AvailabilitySettings;
