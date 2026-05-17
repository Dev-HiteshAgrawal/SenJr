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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col pb-24">
      
      {/* Header */}
      <header className="bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100 shadow-sm rounded-b-3xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900">Availability</h1>
        </div>
        <button className="text-sm font-bold text-mentor-600 active:text-mentor-700 bg-mentor-50 px-3 py-1.5 rounded-lg hover:bg-mentor-100 transition-colors">
          Save
        </button>
      </header>

      <main className="flex-1 px-5 pt-6 space-y-6">
        
        {/* Working Days */}
        <section>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3 block">
            Select Working Days
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar">
            {days.map((item) => (
              <button 
                key={item.date}
                onClick={() => setActiveDay(item.date)}
                className={`min-w-[70px] py-3 rounded-2xl flex flex-col items-center border transition-all ${
                  activeDay === item.date 
                    ? 'bg-mentor-500 border-mentor-500 text-white shadow-md shadow-mentor-500/20' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-mentor-200 hover:bg-gray-50'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase ${activeDay === item.date ? 'text-mentor-100' : 'text-gray-400'}`}>{item.day}</span>
                <span className="text-2xl font-black mt-1">{item.date}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Time Settings Container */}
        <section className="bg-white rounded-3xl border border-gray-100 p-5 space-y-6 shadow-sm">
          
          {/* AVAILABLE FROM */}
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4 block">
              Available From
            </span>
            <div className="flex items-center gap-6 mb-5">
              {/* Hour */}
              <div className="flex flex-col items-center">
                <button className="w-12 h-10 bg-gray-50 rounded-t-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-mentor-500 transition-colors border border-b-0 border-gray-200">
                  <Plus className="w-5 h-5" />
                </button>
                <div className="w-12 h-16 bg-white border-x border-gray-200 flex items-center justify-center">
                  <span className="text-4xl font-black text-gray-900">09</span>
                </div>
                <button className="w-12 h-10 bg-gray-50 rounded-b-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-mentor-500 transition-colors border border-t-0 border-gray-200">
                  <Minus className="w-5 h-5" />
                </button>
              </div>
              
              <span className="text-4xl font-black text-gray-300 -mt-2">:</span>
              
              {/* Minute */}
              <div className="flex flex-col items-center">
                <button className="w-12 h-10 bg-gray-50 rounded-t-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-mentor-500 transition-colors border border-b-0 border-gray-200">
                  <Plus className="w-5 h-5" />
                </button>
                <div className="w-12 h-16 bg-white border-x border-gray-200 flex items-center justify-center">
                  <span className="text-4xl font-black text-gray-900">00</span>
                </div>
                <button className="w-12 h-10 bg-gray-50 rounded-b-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-mentor-500 transition-colors border border-t-0 border-gray-200">
                  <Minus className="w-5 h-5" />
                </button>
              </div>

              {/* AM/PM */}
              <div className="flex flex-col gap-2 ml-auto">
                <button 
                  onClick={() => setFromAM(true)}
                  className={`w-14 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    fromAM ? 'bg-mentor-500 text-white shadow-md' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  AM
                </button>
                <button 
                  onClick={() => setFromAM(false)}
                  className={`w-14 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    !fromAM ? 'bg-mentor-500 text-white shadow-md' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
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
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                    time === '9AM' ? 'bg-mentor-50 text-mentor-600 border-mentor-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
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
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4 block">
              Available Until
            </span>
            <div className="flex items-center gap-6 mb-4">
              {/* Hour */}
              <div className="flex flex-col items-center">
                <button className="w-12 h-10 bg-gray-50 rounded-t-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-mentor-500 transition-colors border border-b-0 border-gray-200">
                  <Plus className="w-5 h-5" />
                </button>
                <div className="w-12 h-16 bg-white border-x border-gray-200 flex items-center justify-center">
                  <span className="text-4xl font-black text-gray-900">12</span>
                </div>
                <button className="w-12 h-10 bg-gray-50 rounded-b-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-mentor-500 transition-colors border border-t-0 border-gray-200">
                  <Minus className="w-5 h-5" />
                </button>
              </div>
              
              <span className="text-4xl font-black text-gray-300 -mt-2">:</span>
              
              {/* Minute */}
              <div className="flex flex-col items-center">
                <button className="w-12 h-10 bg-gray-50 rounded-t-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-mentor-500 transition-colors border border-b-0 border-gray-200">
                  <Plus className="w-5 h-5" />
                </button>
                <div className="w-12 h-16 bg-white border-x border-gray-200 flex items-center justify-center">
                  <span className="text-4xl font-black text-gray-900">00</span>
                </div>
                <button className="w-12 h-10 bg-gray-50 rounded-b-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-mentor-500 transition-colors border border-t-0 border-gray-200">
                  <Minus className="w-5 h-5" />
                </button>
              </div>

              {/* AM/PM */}
              <div className="flex flex-col gap-2 ml-auto">
                <button 
                  onClick={() => setUntilAM(true)}
                  className={`w-14 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    untilAM ? 'bg-mentor-500 text-white shadow-md' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  AM
                </button>
                <button 
                  onClick={() => setUntilAM(false)}
                  className={`w-14 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    !untilAM ? 'bg-mentor-500 text-white shadow-md' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 font-medium">Defaulting to 3 hours after start time.</p>
          </div>

          <div className="h-px bg-gray-100 w-full"></div>

          {/* Slot Settings */}
          <div className="space-y-5">
            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3 block">Slot Duration (Min)</span>
              <div className="flex gap-2 flex-wrap">
                {[15, 30, 45, 60, 'Custom'].map((dur) => (
                  <button 
                    key={dur}
                    onClick={() => typeof dur === 'number' && setSlotDuration(dur)}
                    className={`flex-1 min-w-[50px] py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      slotDuration === dur 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Buffer Time</span>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-mentor-500 transition-shadow appearance-none">
                  <option>5 min</option>
                  <option>10 min</option>
                  <option>15 min</option>
                </select>
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Break After</span>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-mentor-500 transition-shadow appearance-none">
                  <option>3 slots</option>
                  <option>4 slots</option>
                  <option>5 slots</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <span className="text-sm font-bold text-gray-700">Break Duration</span>
              <div className="flex items-center gap-3">
                <span className="text-base font-black text-mentor-600">10 min</span>
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
                  <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </section>

        {/* Generated Slots */}
        <section className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-extrabold text-gray-900">Preview Slots</span>
            <span className="text-[10px] font-bold text-mentor-600 bg-mentor-50 px-2 py-1 rounded-md uppercase tracking-wider">Generated</span>
          </div>
          
          <div className="space-y-2">
            {/* Slot 1 */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-800">09:00 AM - 09:30 AM</span>
              <CheckCircle2 className="w-5 h-5 text-mentor-500" />
            </div>
            
            {/* Slot 2 */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-800">09:35 AM - 10:05 AM</span>
              <CheckCircle2 className="w-5 h-5 text-mentor-500" />
            </div>
            
            {/* Slot 3 */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-800">10:10 AM - 10:40 AM</span>
              <CheckCircle2 className="w-5 h-5 text-mentor-500" />
            </div>

            {/* Break */}
            <div className="flex items-center justify-center gap-3 py-3">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                ☕ 10 MIN BREAK
              </span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Slot 4 */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-800">10:50 AM - 11:20 AM</span>
              <CheckCircle2 className="w-5 h-5 text-mentor-500" />
            </div>
          </div>
        </section>

        {/* Advanced Options */}
        <section className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <button 
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="w-full p-5 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-bold text-gray-900">Advanced Options</span>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {advancedOpen && (
            <div className="p-5 pt-2 space-y-5 border-t border-gray-100">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">Blackout Dates</span>
                <div className="flex gap-2">
                  <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-[10px] font-bold">15 AUG</div>
                  <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-[10px] font-bold">02 OCT</div>
                  <button className="text-mentor-500 bg-mentor-50 p-1 rounded-md hover:bg-mentor-100 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">Min Notice</span>
                <span className="text-xs font-bold text-gray-900 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">24 Hours</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">Auto-accept Bookings</span>
                <button 
                  onClick={() => setAutoAccept(!autoAccept)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors ${autoAccept ? 'bg-mentor-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${autoAccept ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>

            </div>
          )}
        </section>

        {/* Repeating Options */}
        <section>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3 block">
            Repeating Options
          </span>
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            
            <label className="flex items-center gap-3 p-5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${repeatOption === 'weekly' ? 'border-mentor-500 bg-mentor-50' : 'border-gray-300'}`}>
                {repeatOption === 'weekly' && <div className="w-3 h-3 rounded-full bg-mentor-500"></div>}
              </div>
              <input 
                type="radio" 
                name="repeat" 
                value="weekly" 
                checked={repeatOption === 'weekly'} 
                onChange={() => setRepeatOption('weekly')}
                className="hidden" 
              />
              <span className="text-sm font-bold text-gray-800">Repeat every week</span>
            </label>

            <label className="flex items-center gap-3 p-5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${repeatOption === 'biweekly' ? 'border-mentor-500 bg-mentor-50' : 'border-gray-300'}`}>
                {repeatOption === 'biweekly' && <div className="w-3 h-3 rounded-full bg-mentor-500"></div>}
              </div>
              <input 
                type="radio" 
                name="repeat" 
                value="biweekly" 
                checked={repeatOption === 'biweekly'} 
                onChange={() => setRepeatOption('biweekly')}
                className="hidden" 
              />
              <span className="text-sm font-bold text-gray-800">Repeat every 2 weeks</span>
            </label>

            <label className="flex items-center gap-3 p-5 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${repeatOption === 'custom' ? 'border-mentor-500 bg-mentor-50' : 'border-gray-300'}`}>
                {repeatOption === 'custom' && <div className="w-3 h-3 rounded-full bg-mentor-500"></div>}
              </div>
              <input 
                type="radio" 
                name="repeat" 
                value="custom" 
                checked={repeatOption === 'custom'} 
                onChange={() => setRepeatOption('custom')}
                className="hidden" 
              />
              <span className="text-sm font-bold text-gray-800">Custom...</span>
            </label>
            
          </div>
        </section>

      </main>

      {/* Bottom Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 p-5 pb-[env(safe-area-inset-bottom)] z-50">
        <button className="w-full bg-mentor-500 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-[0.98] hover:bg-mentor-600 transition-all shadow-lg shadow-mentor-500/20">
          <Save className="w-5 h-5" /> Save Availability
        </button>
      </div>

    </div>
  );
};

export default AvailabilitySettings;
