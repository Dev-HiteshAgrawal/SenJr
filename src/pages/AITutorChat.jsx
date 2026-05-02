import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { fetchAiRuntimeConfig, generateTutorReply } from '../lib/aiTutor';
import { useNotification } from '../contexts/NotificationContext';
import './AITutorChat.css';

const TUTORS = {
  maths: { name: 'Arya', emoji: '🧮', subject: 'Maths' },
  physics: { name: 'Veda', emoji: '🔭', subject: 'Physics' },
  chemistry: { name: 'Rasayan', emoji: '⚗️', subject: 'Chemistry' },
  biology: { name: 'Jeev', emoji: '🧬', subject: 'Biology' },
  english: { name: 'Lekhak', emoji: '✍️', subject: 'English' },
  economics: { name: 'Arth', emoji: '📊', subject: 'Economics & Commerce' },
  programming: { name: 'CodeBot', emoji: '💻', subject: 'Programming' },
  ssc: { name: 'Sarkar', emoji: '🏛️', subject: 'SSC & Govt Exams' },
  upsc: { name: 'Shasan', emoji: '🇮🇳', subject: 'UPSC & IAS' },
  history: { name: 'Itihas', emoji: '📜', subject: 'History & Social Science' },
  ca: { name: 'Nidhi', emoji: '📈', subject: 'CA & Commerce' },
  law: { name: 'Nyaya', emoji: '⚖️', subject: 'Law' },
  aptitude: { name: 'Tark', emoji: '🧠', subject: 'General Aptitude' },
};

const EXAMPLE_QUESTIONS = {
  maths: ['Explain quadratic equations', 'Help me with JEE preparation', 'I have my exam tomorrow', 'Start from basics'],
  physics: ['Explain Newton laws', 'Help me solve numericals', 'Explain ray optics', 'Start from basics'],
  chemistry: ['Explain mole concept', 'Help with organic chemistry', 'Prepare me for NEET', 'Start from basics'],
  biology: ['Explain photosynthesis', 'Help me with NEET Biology', 'Teach genetics simply', 'Start from basics'],
  english: ['Improve my grammar', 'Help me write an essay', 'Practice IELTS speaking', 'Start from basics'],
  economics: ['Explain demand and supply', 'Help with macroeconomics', 'Explain RBI policy', 'Start from basics'],
  programming: ['Teach Python basics', 'Explain arrays', 'Help me with React', 'Start from basics'],
  ssc: ['Make an SSC CGL plan', 'Teach percentage shortcuts', 'Practice reasoning', 'Start from basics'],
  upsc: ['Make a UPSC plan', 'Explain polity basics', 'Practice CSAT', 'Start from basics'],
  history: ['Explain modern history', 'Teach polity basics', 'Make a timeline', 'Start from basics'],
  ca: ['Explain journal entries', 'Help with GST basics', 'Make a CA Foundation plan', 'Start from basics'],
  law: ['Explain constitutional law', 'Help with CLAT prep', 'Explain IPC basics', 'Start from basics'],
  aptitude: ['Teach ratio shortcuts', 'Practice logical reasoning', 'Improve my speed', 'Start from basics'],
};

export default function AITutorChat() {
  const { subject } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { notifyError, notifyInfo } = useNotification();
  const tutor = TUTORS[subject];

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [aiProvider, setAiProvider] = useState(null);
  const [runtimeReady, setRuntimeReady] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const hasLoadedHistoryRef = useRef(false);

  const chatId = currentUser ? `${currentUser.uid}_${subject}` : null;
  const storageKey = `senjr_tutor_history_${subject}_${currentUser?.uid || 'guest'}`;

  useEffect(() => {
    if (!tutor) {
      navigate('/ai-tutor');
      return;
    }

    let isMounted = true;
    hasLoadedHistoryRef.current = false;

    async function initChat() {
      try {
        const savedMessages = localStorage.getItem(storageKey);
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
          if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
            if (isMounted) {
              setMessages(parsedMessages.slice(-30));
              hasLoadedHistoryRef.current = true;
            }
            return;
          }
        }
      } catch (error) {
        console.warn('Could not load local tutor history:', error);
      }

      if (currentUser && chatId) {
        try {
          const chatDoc = await getDoc(doc(db, 'ai_chats', chatId));
          if (chatDoc.exists() && chatDoc.data().messages?.length > 0) {
            if (isMounted) {
              setMessages(chatDoc.data().messages.slice(-30));
              hasLoadedHistoryRef.current = true;
            }
            return;
          }
        } catch (error) {
          console.warn('Could not load remote tutor history:', error);
        }
      }

      if (isMounted) {
        setMessages([]);
        hasLoadedHistoryRef.current = true;
      }
    }

    initChat();

    return () => {
      isMounted = false;
    };
  }, [chatId, currentUser, navigate, storageKey, tutor]);

  useEffect(() => {
    if (!hasLoadedHistoryRef.current) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(messages.slice(-30)));
    } catch (error) {
      console.warn('Could not save local tutor history:', error);
    }
  }, [messages, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showThinking]);

  useEffect(() => {
    let isMounted = true;

    async function loadRuntimeConfig() {
      try {
        const config = await fetchAiRuntimeConfig();
        if (!isMounted) return;
        setAiProvider(config.aiProvider || null);
      } catch (error) {
        if (!isMounted) return;
        console.error('Runtime config error:', error);
        notifyError(error.message || 'Could not load AI tutor runtime configuration.');
        setAiProvider(null);
      } finally {
        if (isMounted) {
          setRuntimeReady(true);
        }
      }
    }

    loadRuntimeConfig();

    return () => {
      isMounted = false;
      abortControllerRef.current?.abort();
    };
  }, [notifyError]);

  async function persistMessages(nextMessages) {
    if (!chatId) return;

    await setDoc(
      doc(db, 'ai_chats', chatId),
      { messages: nextMessages.slice(-30), updatedAt: new Date() },
      { merge: true }
    );
  }

  async function sendMessage(rawText) {
    const trimmedText = rawText.trim();

    if (!trimmedText || isGenerating || !aiProvider) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const newUserMessage = {
      role: 'user',
      content: trimmedText,
      timestamp: new Date().toISOString(),
    };
    const nextMessages = [...messages, newUserMessage].slice(-30);
    const aiMessagePlaceholder = {
      role: 'model',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages([...nextMessages, aiMessagePlaceholder]);
    setInputValue('');
    setErrorMessage('');
    setIsGenerating(true);
    setShowThinking(true);

    try {
      const finalReply = await generateTutorReply({
        tutor,
        messages: nextMessages,
        signal: controller.signal,
        onStream: (currentText) => {
          if (currentText.length > 0) {
            setShowThinking(false);
          }

          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (updated[lastIndex]?.role === 'model') {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: currentText,
              };
            }
            return updated;
          });
        },
      });

      const cleanReply = finalReply || 'I am here. Could you send that once more?';
      const finalMessages = [
        ...nextMessages,
        { role: 'model', content: cleanReply, timestamp: new Date().toISOString() },
      ].slice(-30);

      setMessages(finalMessages);
      await persistMessages(finalMessages);
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      console.error('Error sending message:', error);
      const friendlyMessage = error.message || 'I hit a small snag processing that.';
      setErrorMessage(friendlyMessage);
      notifyError(friendlyMessage);
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[updated.length - 1]?.role === 'model' && updated[updated.length - 1].content === '') {
          updated.pop();
        }
        return [
          ...updated,
          {
            role: 'model',
            content: 'I hit a small snag. Could you try asking that again?',
            timestamp: new Date().toISOString(),
          },
        ].slice(-30);
      });
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
        setIsGenerating(false);
        setShowThinking(false);
      }
    }
  }

  const handleSend = async (event) => {
    event.preventDefault();
    await sendMessage(inputValue);
  };

  const handleClearChat = async () => {
    abortControllerRef.current?.abort();
    setMessages([]);
    setInputValue('');
    setErrorMessage('');
    setIsGenerating(false);
    setShowThinking(false);
    notifyInfo('Chat history cleared.');

    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Could not clear local tutor history:', error);
    }

    if (chatId) {
      await setDoc(
        doc(db, 'ai_chats', chatId),
        { messages: [], updatedAt: new Date() },
        { merge: true }
      );
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(inputValue);
    }
  };

  if (!tutor) {
    return null;
  }

  return (
    <div className="ai-chat-container animate-fade-in">
      <header className="ai-chat-header">
        <div className="ai-chat-header-left">
          <Link to="/ai-tutor" className="ai-chat-back-btn">
            ←
          </Link>
          <div className="ai-chat-tutor-info">
            <span className="ai-chat-tutor-emoji">{tutor.emoji}</span>
            <div className="ai-chat-tutor-details">
              <h2>{tutor.name}</h2>
              <p>{tutor.subject} Tutor</p>
            </div>
          </div>
        </div>
        <button className="ai-chat-clear-btn" type="button" onClick={handleClearChat}>
          Clear History
        </button>
      </header>

      {runtimeReady && !aiProvider && (
        <div className="card ai-chat-error-card" style={{ margin: '1rem 1.5rem 0', borderColor: 'rgba(255, 77, 109, 0.35)' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            AI tutor is not configured on Groq yet.
          </p>
          <button className="btn-secondary" type="button" onClick={() => window.location.reload()}>
            Retry Connection
          </button>
        </div>
      )}

      <main className="ai-chat-messages">
        {messages.length === 0 && (
          <section className="ai-welcome-card">
            <div className="ai-welcome-emoji">{tutor.emoji}</div>
            <h1>{tutor.name}</h1>
            <p>Your {tutor.subject} tutor is ready. Pick a starter or ask your own question.</p>
            <div className="ai-example-chip-grid">
              {(EXAMPLE_QUESTIONS[subject] || EXAMPLE_QUESTIONS.maths).map((question) => (
                <button
                  type="button"
                  key={question}
                  className="ai-example-chip"
                  disabled={isGenerating || !aiProvider || !runtimeReady}
                  onClick={() => sendMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </section>
        )}

        {messages.map((message, index) => {
          if (message.isStreaming && !message.content) return null;

          const isUser = message.role === 'user';
          const isFirstTutorMessage =
            !isUser && (index === 0 || messages[index - 1]?.role === 'user');

          return (
            <div key={`${message.role}-${index}-${message.timestamp || ''}`} className={`ai-message-group ${isUser ? 'user' : 'tutor'}`}>
              <div className="ai-message-wrapper">
                {!isUser && isFirstTutorMessage ? (
                  <div className="ai-message-emoji">{tutor.emoji}</div>
                ) : !isUser ? (
                  <div className="ai-message-emoji" />
                ) : null}

                <div className="ai-message-bubble markdown-body">{message.content}</div>
              </div>
            </div>
          );
        })}

        {showThinking && (
          <div className="ai-message-group tutor">
            <div className="ai-message-wrapper">
              <div className="ai-message-emoji">{tutor.emoji}</div>
              <div className="ai-message-bubble" aria-label={`${tutor.name} is thinking`}>
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          </div>
        )}

        {errorMessage && <p className="ai-chat-inline-error">{errorMessage}</p>}
        <div ref={messagesEndRef} />
      </main>

      <form className="ai-chat-input-area" onSubmit={handleSend}>
        <input
          type="text"
          className="ai-chat-input"
          placeholder={`Ask ${tutor.name}...`}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating || !aiProvider || !runtimeReady}
          autoFocus
        />
        <button
          type="submit"
          className="ai-chat-send-btn"
          disabled={!inputValue.trim() || isGenerating || !aiProvider || !runtimeReady}
        >
          ↑
        </button>
      </form>
    </div>
  );
}
