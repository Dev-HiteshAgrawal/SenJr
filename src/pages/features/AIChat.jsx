import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MoreVertical, Mic, Send, GraduationCap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Fallback for local dev

const AIChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'model',
      content: 'Namaste! Aaj kya seekhna hai? 📐 I can help you with Maths, Reasoning, and Exam Prep.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 1. Try hitting the Vercel Serverless Function
      const apiMessages = [...messages, userMessage].map(m => ({ role: m.role, content: m.content }));
      
      let aiResponseText = '';

      try {
        const response = await fetch('/api/gemini-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages })
        });
        
        if (response.ok) {
          const data = await response.json();
          aiResponseText = data.content;
        } else {
          throw new Error('Serverless function failed or not running (local dev)');
        }
      } catch (fetchErr) {
        // 2. Fallback: Local client-side execution (if Vercel dev isn't running)
        console.warn('Falling back to client-side Gemini call:', fetchErr);
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) throw new Error('No API Key', { cause: fetchErr });
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const history = messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));
        
        const chat = model.startChat({
          history,
          systemInstruction: 'You are EduPulse AI Tutor, a highly intelligent and encouraging academic assistant designed to help students with their studies, exam prep, and career guidance. Provide clear, concise, and accurate explanations. Use emojis occasionally.',
        });
        
        const result = await chat.sendMessage(userMessage.content);
        aiResponseText = await result.response.text();
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'model',
        content: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'model',
        content: 'Sorry, I am having trouble connecting to my brain right now. 🧠❌',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="font-bold text-gray-900 leading-tight">Arya (AI)</h1>
            <p className="text-[10px] font-bold text-gray-500">24/7 EduPulse Tutor</p>
          </div>
        </div>
        
        <button className="p-1">
          <MoreVertical className="w-5 h-5 text-gray-700" />
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm text-sm whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-[#10b981] text-white rounded-tr-sm' 
                  : 'bg-[#EEF2FF] border border-blue-100 text-gray-800 rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
            <span className={`text-[10px] text-gray-400 font-medium mt-1 ${msg.role === 'user' ? 'mr-1' : 'ml-1'}`}>
              {msg.time}
            </span>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex flex-col items-start max-w-[85%] mt-2">
            <div className="bg-[#EEF2FF] border border-blue-100 text-gray-500 rounded-full px-4 py-2 shadow-sm text-lg flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Bottom Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 flex items-end gap-2">
        <div className="flex-1 bg-[#F1F5F9] rounded-full flex items-center px-4 py-1.5 border border-gray-200">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your doubt..." 
            className="flex-1 bg-transparent py-2 focus:outline-none text-sm text-gray-800 placeholder-gray-500"
          />
          <button className="p-2 text-gray-500 active:text-gray-700">
            <Mic className="w-5 h-5" />
          </button>
        </div>
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center text-white shrink-0 shadow-md active:bg-emerald-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
        </button>
      </div>

    </div>
  );
};

export default AIChat;
