import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { fetchAiRuntimeConfig, generateTutorReply } from '../lib/aiTutor';
import './AITutorChat.css';

const TUTORS = {
  maths: { name: 'Nova', emoji: '🧮', subject: 'Maths' },
  science: { name: 'Atom', emoji: '⚗️', subject: 'Science' },
  history: { name: 'Sage', emoji: '📜', subject: 'History' },
  economics: { name: 'Axis', emoji: '📊', subject: 'Economics & Business' },
  english: { name: 'Quill', emoji: '✍️', subject: 'English & Writing' },
  programming: { name: 'CodeBot', emoji: '💻', subject: 'Programming' },
  geography: { name: 'Terra', emoji: '🌍', subject: 'Geography' },
  biology: { name: 'Gene', emoji: '🧬', subject: 'Biology Deep Dive' },
};

function getGreeting(tutor) {
  return {
    role: 'model',
    content: `Hi! I'm ${tutor.name}, your ${tutor.subject} tutor. Ask me anything. No question is too basic!`,
  };
}

export default function AITutorChat() {
  const { subject } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const tutor = TUTORS[subject];

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [aiProvider, setAiProvider] = useState(null);
  const [runtimeReady, setRuntimeReady] = useState(false);
  const messagesEndRef = useRef(null);

  const chatId = currentUser ? `${currentUser.uid}_${subject}` : null;

  useEffect(() => {
    if (!tutor) {
      navigate('/ai-tutor');
      return;
    }

    async function initChat() {
      if (!currentUser || !chatId) {
        setMessages([getGreeting(tutor)]);
        return;
      }

      const chatDocRef = doc(db, 'ai_chats', chatId);
      const chatDoc = await getDoc(chatDocRef);

      if (chatDoc.exists() && chatDoc.data().messages?.length > 0) {
        setMessages(chatDoc.data().messages);
        return;
      }

      const initialMessages = [getGreeting(tutor)];
      await setDoc(chatDocRef, { messages: initialMessages, updatedAt: new Date() }, { merge: true });
      setMessages(initialMessages);
    }

    initChat();
  }, [chatId, currentUser, navigate, tutor]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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
        setErrorMessage(error.message || 'Could not load AI tutor runtime configuration.');
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
    };
  }, []);

  async function persistMessages(nextMessages) {
    if (!chatId) return;

    await setDoc(
      doc(db, 'ai_chats', chatId),
      { messages: nextMessages, updatedAt: new Date() },
      { merge: true }
    );
  }

  const handleSend = async (event) => {
    event.preventDefault();

    if (!inputValue.trim() || isTyping || !aiProvider) {
      return;
    }

    const newUserMessage = { role: 'user', content: inputValue.trim() };
    const nextMessages = [...messages, newUserMessage];

    setMessages(nextMessages);
    setInputValue('');
    setErrorMessage('');
    setIsTyping(true);

    try {
      const reply = await generateTutorReply({
        tutor,
        messages: nextMessages,
      });

      const finalMessages = [...nextMessages, { role: 'model', content: reply }];
      setMessages(finalMessages);
      await persistMessages(finalMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage(error.message || 'The AI tutor could not generate a reply.');
      setMessages([
        ...nextMessages,
        {
          role: 'model',
          content:
            "I'm having trouble replying right now. Please check the AI configuration and try again in a moment.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm('Are you sure you want to clear the chat history?')) {
      return;
    }

    const initialMessages = [getGreeting(tutor)];
    setMessages(initialMessages);
    setErrorMessage('');

    if (chatId) {
      await setDoc(
        doc(db, 'ai_chats', chatId),
        { messages: initialMessages, updatedAt: new Date() },
        { merge: true }
      );
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend(event);
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
        <button className="ai-chat-clear-btn" onClick={handleClearChat}>
          Clear Chat
        </button>
      </header>

      {runtimeReady && !aiProvider && (
        <div className="card" style={{ margin: '1rem 1.5rem 0', borderColor: 'rgba(255, 77, 109, 0.35)' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            AI tutor is not configured on the backend yet. Add `NVIDIA_API_KEY` or `GEMINI_API_KEY` on the server.
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="card" style={{ margin: '1rem 1.5rem 0', borderColor: 'rgba(255, 77, 109, 0.35)' }}>
          <p style={{ color: 'var(--text-secondary)' }}>{errorMessage}</p>
        </div>
      )}

      <main className="ai-chat-messages">
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          const isFirstTutorMessage =
            !isUser && (index === 0 || messages[index - 1].role === 'user');

          return (
            <div key={`${message.role}-${index}`} className={`ai-message-group ${isUser ? 'user' : 'tutor'}`}>
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

        {isTyping && (
          <div className="ai-message-group tutor">
            <div className="ai-message-wrapper">
              <div className="ai-message-emoji">{tutor.emoji}</div>
              <div className="ai-message-bubble">
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <form className="ai-chat-input-area" onSubmit={handleSend}>
        <input
          type="text"
          className="ai-chat-input"
          placeholder={`Message ${tutor.name}...`}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping || !aiProvider || !runtimeReady}
          autoFocus
        />
        <button
          type="submit"
          className="ai-chat-send-btn"
          disabled={!inputValue.trim() || isTyping || !aiProvider || !runtimeReady}
        >
          ↑
        </button>
      </form>
    </div>
  );
}
