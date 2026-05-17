import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, Sparkles, BookOpen, FlaskConical, Atom, Leaf, PenLine, TrendingUp, Code2, Shield, Building2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tutors = [
  { id: 'arya',    name: 'Arya',    subject: 'Mathematics',        emoji: '📐', icon: <BookOpen className="w-5 h-5" />, color: '#1E40AF', bg: '#EFF6FF',  desc: 'Calculus, Algebra, Geometry' },
  { id: 'veda',    name: 'Veda',    subject: 'Physics',            emoji: '⚡', icon: <Atom className="w-5 h-5" />,     color: '#7C3AED', bg: '#F5F3FF',  desc: 'Mechanics, Waves, Optics' },
  { id: 'rasayan', name: 'Rasayan', subject: 'Chemistry',          emoji: '🧪', icon: <FlaskConical className="w-5 h-5" />, color: '#B45309', bg: '#FFF7ED', desc: 'Organic, Inorganic, Physical' },
  { id: 'jeev',    name: 'Jeev',    subject: 'Biology',            emoji: '🌿', icon: <Leaf className="w-5 h-5" />,     color: '#065F46', bg: '#ECFDF5',  desc: 'Botany, Zoology, Anatomy' },
  { id: 'lekhak',  name: 'Lekhak',  subject: 'English',            emoji: '✍️', icon: <PenLine className="w-5 h-5" />,  color: '#BE123C', bg: '#FFF1F2',  desc: 'Grammar, Writing Skills' },
  { id: 'arth',    name: 'Arth',    subject: 'Economics',          emoji: '📊', icon: <TrendingUp className="w-5 h-5" />, color: '#0F766E', bg: '#F0FDFA', desc: 'Micro, Macro, Indian Economy' },
  { id: 'codebot', name: 'CodeBot', subject: 'Programming',        emoji: '💻', icon: <Code2 className="w-5 h-5" />,   color: '#374151', bg: '#F9FAFB',  desc: 'Python, C++, Web Dev' },
  { id: 'sarkar',  name: 'Sarkar',  subject: 'Govt. Exams',        emoji: '🏛️', icon: <Shield className="w-5 h-5" />,  color: '#1E40AF', bg: '#EFF6FF',  desc: 'UP Police, SSC, Banking' },
  { id: 'shasan',  name: 'Shasan',  subject: 'UPSC',               emoji: '🏛', icon: <Building2 className="w-5 h-5" />, color: '#7C3AED', bg: '#F5F3FF', desc: 'Prelims, Mains, Current Affairs' },
];

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const buildSystemPrompt = (tutor) =>
  `You are ${tutor.name} on Senjr, an AI peer mentor. You ONLY teach ${tutor.subject}. 
Always respond in Hindi-English mix (Hinglish). Be warm, encouraging, and proactive.
When a student asks a question:
1. First ask their level if you don't know it.
2. Give a structured explanation: Definition → Indian real-life example → Step-by-step → Practice question.
Never answer questions outside ${tutor.subject}. If asked, politely redirect: "Yeh mere subject ke bahar hai! ${tutor.subject} ke baare mein poochho 😊"`;

const ChatView = ({ tutor, onBack }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Namaste! Main hoon ${tutor.name} ${tutor.emoji} — aapka ${tutor.subject} expert!\n\nAaj kya seekhna hai? Apna sawaal poochho, main poori detail se explain karoonga! 🚀`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content
      }));

      const res = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: buildSystemPrompt(tutor),
          messages: apiMessages
        }),
      });

      if (!res.ok) {
        throw new Error('API returned an error');
      }

      const data = await res.json();
      const reply = data?.content || 'Kuch error aa gaya, dobara try karo!';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Network error or function not available locally. Please try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* Chat Header */}
      <header className="bg-white px-5 py-4 flex items-center gap-4 sticky top-0 z-50 border-b border-gray-100 shadow-sm rounded-b-3xl">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 shadow-sm border-2 border-white"
          style={{ backgroundColor: tutor.bg }}
        >
          {tutor.emoji}
        </div>
        <div>
          <p className="font-extrabold text-gray-900 leading-tight">{tutor.name}</p>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{tutor.subject} Expert</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Online</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 pb-24">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-5 py-3.5 rounded-3xl text-sm font-medium leading-relaxed whitespace-pre-wrap shadow-sm ${
                msg.role === 'user'
                  ? 'bg-primary-500 text-white rounded-br-sm'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-3xl rounded-bl-sm px-5 py-4 shadow-sm">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 p-4 pb-[env(safe-area-inset-bottom)] flex items-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex-1 bg-gray-100 rounded-3xl flex items-center px-5 min-h-[56px]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Apna sawaal poochho..."
            className="flex-1 bg-transparent py-4 text-sm font-medium focus:outline-none text-gray-900 placeholder-gray-500"
          />
          <button className="text-gray-400 p-2 -mr-2 hover:text-primary-500 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-all shadow-md ${
            input.trim() && !loading ? 'bg-primary-500 text-white shadow-primary-500/30 active:scale-95' : 'bg-gray-100 text-gray-300 shadow-none'
          }`}
        >
          <Send className="w-6 h-6 ml-1" />
        </button>
      </div>
    </div>
  );
};

const AITutor = () => {
  const navigate = useNavigate();
  const [activeTutor, setActiveTutor] = useState(null);

  if (activeTutor) {
    return <ChatView tutor={activeTutor} onBack={() => setActiveTutor(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">

      {/* Header */}
      <header className="bg-white px-5 py-4 sticky top-0 z-50 border-b border-gray-100 shadow-sm rounded-b-3xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight">AI Tutors</h1>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">Powered by Gemini AI</p>
          </div>
          <div className="ml-auto bg-primary-50 p-2.5 rounded-xl border border-primary-100">
            <Sparkles className="w-5 h-5 text-primary-500" />
          </div>
        </div>
      </header>

      <main className="px-5 pt-6">
        {/* Banner */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-500 rounded-3xl p-6 mb-6 text-white shadow-lg shadow-primary-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 bg-white/20 w-max px-3 py-1 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">AI-Powered</span>
            </div>
            <p className="text-2xl font-black leading-tight mb-2">Learn in Hinglish,<br/>Anytime, Instantly</p>
            <p className="text-sm font-medium opacity-90">Choose your subject expert below</p>
          </div>
        </div>

        {/* Tutor Grid */}
        <div className="grid grid-cols-2 gap-4 pb-4">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              onClick={() => setActiveTutor(tutor)}
              className="bg-white border border-gray-100 rounded-3xl p-5 text-left flex flex-col h-full cursor-pointer hover:border-primary-200 hover:shadow-md transition-all group"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm mb-4 border border-white group-hover:scale-110 transition-transform"
                style={{ backgroundColor: tutor.bg }}
              >
                {tutor.emoji}
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-gray-900 text-base mb-1">{tutor.name}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: tutor.color }}>{tutor.subject}</p>
                <p className="text-[11px] font-medium text-gray-500 leading-relaxed line-clamp-2">{tutor.desc}</p>
              </div>
              <div
                className="w-full py-2.5 rounded-xl text-xs font-bold text-center text-white mt-4 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: tutor.color }}
              >
                Start Chat →
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AITutor;