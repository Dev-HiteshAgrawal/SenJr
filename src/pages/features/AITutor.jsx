import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, Sparkles, BookOpen, FlaskConical, Atom, Leaf, PenLine, TrendingUp, Code2, Shield, Building2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tutors = [
  { id: 'arya',    name: 'Arya',    subject: 'Mathematics',        emoji: '📐', icon: <BookOpen className="w-5 h-5" />, color: '#1E40AF', bg: '#EFF6FF',  desc: 'Calculus, Algebra, Geometry & Stats' },
  { id: 'veda',    name: 'Veda',    subject: 'Physics',            emoji: '⚡', icon: <Atom className="w-5 h-5" />,     color: '#7C3AED', bg: '#F5F3FF',  desc: 'Mechanics, Waves, Modern Physics' },
  { id: 'rasayan', name: 'Rasayan', subject: 'Chemistry',          emoji: '🧪', icon: <FlaskConical className="w-5 h-5" />, color: '#B45309', bg: '#FFF7ED', desc: 'Organic, Inorganic, Physical Chem' },
  { id: 'jeev',    name: 'Jeev',    subject: 'Biology',            emoji: '🌿', icon: <Leaf className="w-5 h-5" />,     color: '#065F46', bg: '#ECFDF5',  desc: 'Botany, Zoology, Human Body' },
  { id: 'lekhak',  name: 'Lekhak',  subject: 'English',            emoji: '✍️', icon: <PenLine className="w-5 h-5" />,  color: '#BE123C', bg: '#FFF1F2',  desc: 'Grammar, Comprehension, Writing' },
  { id: 'arth',    name: 'Arth',    subject: 'Economics',          emoji: '📊', icon: <TrendingUp className="w-5 h-5" />, color: '#0F766E', bg: '#F0FDFA', desc: 'Micro, Macro, Indian Economy' },
  { id: 'codebot', name: 'CodeBot', subject: 'Programming',        emoji: '💻', icon: <Code2 className="w-5 h-5" />,   color: '#374151', bg: '#F9FAFB',  desc: 'Python, C++, DSA, Web Dev' },
  { id: 'sarkar',  name: 'Sarkar',  subject: 'Government Exams',   emoji: '🏛️', icon: <Shield className="w-5 h-5" />,  color: '#1E40AF', bg: '#EFF6FF',  desc: 'UP Police, SSC CGL, Banking, GK' },
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
      // Build Gemini API conversation
      const contents = updatedMessages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: buildSystemPrompt(tutor) }] },
            contents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
          }),
        }
      );

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Kuch error aa gaya, dobara try karo!';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Network error. Please try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAF9] font-sans">
      {/* Chat Header */}
      <header className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <button onClick={onBack} className="p-1">
          <X className="w-5 h-5 text-gray-700" />
        </button>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
          style={{ backgroundColor: tutor.bg }}
        >
          {tutor.emoji}
        </div>
        <div>
          <p className="font-bold text-gray-900 leading-tight">{tutor.name}</p>
          <p className="text-[10px] text-gray-500 font-medium">{tutor.subject} Expert</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-[10px] font-medium text-gray-500">Online</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#10b981] text-white rounded-tr-sm'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-3 py-2.5 flex items-end gap-2">
        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl flex items-center px-4 py-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Apna sawaal poochho..."
            className="flex-1 bg-transparent py-2 text-sm focus:outline-none text-gray-800 placeholder-gray-400"
          />
          <button className="text-gray-400 p-1">
            <Mic className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            input.trim() && !loading ? 'bg-[#10b981] text-white' : 'bg-gray-100 text-gray-300'
          }`}
        >
          <Send className="w-4 h-4 ml-0.5" />
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
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 pb-24">

      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">AI Tutors</h1>
            <p className="text-[11px] text-gray-400">Powered by Gemini AI</p>
          </div>
          <div className="ml-auto">
            <Sparkles className="w-5 h-5 text-[#10b981]" />
          </div>
        </div>
      </header>

      <main className="px-4 pt-5">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#064E3B] to-[#10b981] rounded-2xl p-4 mb-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">AI-Powered Peer Mentors</span>
          </div>
          <p className="text-xl font-black leading-tight">Learn in Hinglish,<br/>Anytime, Instantly</p>
          <p className="text-xs opacity-70 mt-1">Choose your subject expert below</p>
        </div>

        {/* Tutor Grid */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          {tutors.map((tutor) => (
            <button
              key={tutor.id}
              onClick={() => setActiveTutor(tutor)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left active:scale-95 transition-transform flex flex-col gap-3"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: tutor.bg }}
              >
                {tutor.emoji}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{tutor.name}</p>
                <p className="text-[10px] font-bold mb-1" style={{ color: tutor.color }}>{tutor.subject}</p>
                <p className="text-[10px] text-gray-400 leading-relaxed">{tutor.desc}</p>
              </div>
              <div
                className="w-full py-2 rounded-xl text-xs font-bold text-center text-white mt-auto"
                style={{ backgroundColor: tutor.color }}
              >
                Start Chat →
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AITutor;