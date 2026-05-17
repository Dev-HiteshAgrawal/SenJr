import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MoreVertical, Mic, Send, Bot, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      const apiMessages = [...messages, userMessage].map(m => ({ role: m.role, content: m.content }));
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'AI tutor is temporarily unavailable');
      }

      const data = await response.json();
      const aiResponseText = data.content;

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'model',
        content: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Chat error:', error);
      }
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
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      {/* Header */}
      <header className="bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100 shadow-sm rounded-b-3xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 shadow-sm border-2 border-white">
              <Bot className="w-6 h-6" />
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          <div>
            <h1 className="font-extrabold text-gray-900 leading-tight">Arya (AI)</h1>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Online Tutor</p>
          </div>
        </div>
        
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-700" />
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-5 pb-24 space-y-5">
        
        <div className="text-center">
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">TODAY</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`rounded-3xl px-5 py-3.5 shadow-sm text-sm whitespace-pre-wrap font-medium ${
                  msg.role === 'user' 
                    ? 'bg-primary-500 text-white rounded-br-sm' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
              <span className={`text-[10px] font-semibold text-gray-400 mt-1.5 ${msg.role === 'user' ? 'mr-2' : 'ml-2'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex w-full justify-start mt-2">
            <div className="flex flex-col max-w-[80%] items-start">
              <div className="bg-white border border-gray-100 text-primary-500 rounded-3xl rounded-bl-sm px-5 py-3 shadow-sm text-lg flex items-center gap-1.5 h-[48px]">
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Bottom Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-[env(safe-area-inset-bottom)] flex items-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex-1 bg-gray-100 rounded-3xl flex items-center px-5 min-h-[56px]">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your doubt here..." 
            className="flex-1 bg-transparent py-4 focus:outline-none text-sm font-medium text-gray-900 placeholder-gray-500"
          />
          <button className="p-2 -mr-2 text-gray-400 hover:text-primary-500 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
        </div>
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-500/30 active:scale-95 hover:bg-primary-600 transition-all disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 ml-1" />}
        </button>
      </div>

    </div>
  );
};

export default AIChat;
