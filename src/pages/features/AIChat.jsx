import React from 'react';
import { ArrowLeft, MoreVertical, Mic, Send, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIChat = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">Arya</h1>
            <p className="text-[10px] font-bold text-gray-500">Maths Expert</p>
          </div>
        </div>
        
        <button className="p-1">
          <MoreVertical className="w-5 h-5 text-gray-700" />
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        
        {/* Received Message */}
        <div className="flex flex-col items-start max-w-[85%]">
          <div className="bg-[#EEF2FF] border border-blue-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm text-sm">
            Namaste Hitesh! Aaj kya seekhna hai? 📐
          </div>
          <span className="text-[10px] text-gray-400 font-medium mt-1 ml-1">10:02 AM</span>
        </div>

        {/* Sent Message */}
        <div className="flex flex-col items-end w-full">
          <div className="bg-[#10b981] text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm text-sm max-w-[85%]">
            Sir, calculus samajh nahi aa raha
          </div>
          <span className="text-[10px] text-gray-400 font-medium mt-1 mr-1">10:03 AM</span>
        </div>

        {/* Received Message */}
        <div className="flex flex-col items-start max-w-[85%]">
          <div className="bg-[#EEF2FF] border border-blue-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm text-sm">
            Arre tension mat lo! Calculus = rate of change...
          </div>
        </div>

        {/* Received Message */}
        <div className="flex flex-col items-start max-w-[85%]">
          <div className="bg-[#EEF2FF] border border-blue-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm text-sm">
            Example: Agar car 60km/hr se chal rahi hai, toh woh constant rate hai. Calculus humein batata hai ki speed har second kaise badal rahi hai.
          </div>
        </div>

        {/* Rich Card (Practice Question) */}
        <div className="flex flex-col items-start max-w-[90%]">
          <div className="bg-[#F4F9F8] border border-dashed border-[#10b981] rounded-2xl p-4 shadow-sm w-full">
            <div className="flex items-center gap-1.5 mb-3 text-[#10b981]">
              <GraduationCap className="w-4 h-4" />
              <span className="text-[10px] font-bold tracking-wider uppercase">Practice Question</span>
            </div>
            
            <p className="font-bold text-gray-900 mb-4 text-sm leading-relaxed">
              Find the derivative of f(x) = x² + 3x
            </p>
            
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 active:bg-gray-50 transition-colors">
                A) 2x + 3
              </button>
              <button className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 active:bg-gray-50 transition-colors">
                B) x + 3
              </button>
              <button className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 active:bg-gray-50 transition-colors">
                C) 2x
              </button>
            </div>
          </div>
        </div>

        {/* Typing Indicator */}
        <div className="flex flex-col items-start max-w-[85%] mt-2">
          <div className="bg-[#EEF2FF] border border-blue-100 text-gray-500 rounded-full px-4 py-2 shadow-sm text-lg flex gap-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
          </div>
        </div>

      </main>

      {/* Bottom Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 flex items-end gap-2">
        <div className="flex-1 bg-[#F1F5F9] rounded-full flex items-center px-4 py-1.5 border border-gray-200">
          <input 
            type="text" 
            placeholder="Type your doubt..." 
            className="flex-1 bg-transparent py-2 focus:outline-none text-sm text-gray-800 placeholder-gray-500"
          />
          <button className="p-2 text-gray-500 active:text-gray-700">
            <Mic className="w-5 h-5" />
          </button>
        </div>
        <button className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center text-white shrink-0 shadow-md active:bg-emerald-600 transition-colors">
          <Send className="w-5 h-5 ml-1" />
        </button>
      </div>

    </div>
  );
};

export default AIChat;
