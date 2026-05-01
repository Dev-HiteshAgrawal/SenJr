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

function getGreeting(tutor) {
  return {
    role: 'model',
    content: `Hi, I'm ${tutor.name}, your ${tutor.subject} guide. I'm here to help you understand, not just find the answer. What are we working on today?`,
    timestamp: new Date().toISOString(),
  };
}

function getFreshStartMessage() {
  return {
    role: 'model',
    content: "Cleared and ready. What's next?",
    timestamp: new Date().toISOString(),
  };
}

export default function AITutorChat() {
  const { subject } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { notifyError, notifyInfo, notifySuccess } = useNotification();
  const tutor = TUTORS[subject];

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [aiProvider, setAiProvider] = useState(null);
  const [runtimeReady, setRuntimeReady] = useState(false);
  const [storageConsent, setStorageConsent] = useState(null);
  const messagesEndRef = useRef(null);

  const chatId = currentUser ? `${currentUser.uid}_${subject}` : null;
  const storageKey = `senjr_chat_${subject}_${currentUser?.uid || 'guest'}`;

  useEffect(() => {
    try {
      setStorageConsent(localStorage.getItem('senjr_storage_ok'));
    } catch (error) {
      console.warn('Could not read local storage preference:', error);
      setStorageConsent('no');
    }
  }, []);

  useEffect(() => {
    if (!tutor) {
      navigate('/ai-tutor');
      return;
    }

    async function initChat() {
      if (storageConsent === 'yes') {
        try {
          const savedMessages = localStorage.getItem(storageKey);
          if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
            return;
          }
        } catch (error) {
          console.warn('Could not load local tutor history:', error);
        }
      }

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
  }, [chatId, currentUser, navigate, storageConsent, storageKey, tutor]);

  useEffect(() => {
    if (messages.length === 0 || storageConsent !== 'yes') return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(messages.slice(-50)));
    } catch (error) {
      console.warn('Could not save local tutor history:', error);
    }
  }, [messages, storageConsent, storageKey]);

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

    const newUserMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };
    const nextMessages = [...messages, newUserMessage];

    setMessages(nextMessages);
    setInputValue('');
    setErrorMessage('');
    setIsTyping(true);

    // Create a placeholder message for the AI response
    const aiMessagePlaceholder = {
      role: 'model',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };
    
    setMessages([...nextMessages, aiMessagePlaceholder]);

    try {
      const finalReply = await generateTutorReply({
        tutor,
        messages: nextMessages,
        onStream: (currentText) => {
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (updated[lastIndex].role === 'model') {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: currentText,
              };
            }
            return updated;
          });
        }
      });

      // Once done, remove the streaming flag
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex].role === 'model') {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: finalReply,
            isStreaming: false,
          };
        }
        return updated;
      });
      
      const finalMessages = [...nextMessages, { role: 'model', content: finalReply, timestamp: new Date().toISOString() }];
      await persistMessages(finalMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      notifyError(error.message || 'I hit a small snag processing that.');
      // Remove the placeholder message on error
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[updated.length - 1].role === 'model' && updated[updated.length - 1].content === '') {
          updated.pop();
        }
        return [
          ...updated,
          {
            role: 'model',
            content: "I hit a small snag. Could you try asking that again?",
            timestamp: new Date().toISOString(),
          },
        ];
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = async () => {
    const initialMessages = [getFreshStartMessage()];
    setMessages(initialMessages);
    notifyInfo("Chat history cleared.");

    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Could not clear local tutor history:', error);
    }

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

      {storageConsent === null && (
        <div className="card" style={{ margin: '1rem 1.5rem 0' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.9rem' }}>
            Would you like to keep your chat history saved on this device for next time?
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              type="button"
              onClick={() => {
                localStorage.setItem('senjr_storage_ok', 'yes');
                setStorageConsent('yes');
                notifySuccess("History saving enabled.");
              }}
            >
              Yes, save it
            </button>
            <button
              className="btn-secondary"
              type="button"
              onClick={() => {
                localStorage.setItem('senjr_storage_ok', 'no');
                setStorageConsent('no');
                notifyInfo("History saving skipped.");
              }}
            >
              Not right now
            </button>
          </div>
        </div>
      )}

      {runtimeReady && !aiProvider && (
        <div className="card" style={{ margin: '1rem 1.5rem 0', borderColor: 'rgba(255, 77, 109, 0.35)' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            AI tutor is not configured on the backend yet.
          </p>
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
          placeholder={`Ask ${tutor.name}...`}
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
