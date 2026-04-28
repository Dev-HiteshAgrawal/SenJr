import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './ChatRoom.css';

export default function ChatRoom() {
  const { chatId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser] = useState(location.state?.otherUser || { displayName: 'User' });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Load messages and mark as read
  useEffect(() => {
    if (!currentUser) return;
    
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        msgs.push({ id: docSnap.id, ...data });
        
        // Mark as read if from the other user
        if (data.senderId !== currentUser.uid && !data.read) {
          updateDoc(docSnap.ref, { read: true });
        }
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId, currentUser]);

  // Typing indicator listener
  useEffect(() => {
    const chatDocRef = doc(db, 'chats', chatId);
    const unsubscribe = onSnapshot(chatDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.typing && data.typing !== currentUser?.uid) {
           setIsTyping(true);
        } else {
           setIsTyping(false);
        }
      }
    });
    return () => unsubscribe();
  }, [chatId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || userProfile?.banned) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      text: newMessage,
      senderId: currentUser.uid,
      timestamp: serverTimestamp(),
      read: false
    });
    setNewMessage('');
    
    // reset typing
    const chatDocRef = doc(db, 'chats', chatId);
    await setDoc(chatDocRef, { typing: null }, { merge: true });
  };

  const handleTyping = async (e) => {
    if (userProfile?.banned) return;
    setNewMessage(e.target.value);
    const chatDocRef = doc(db, 'chats', chatId);
    if (e.target.value.length > 0) {
      await setDoc(chatDocRef, { typing: currentUser.uid }, { merge: true });
    } else {
      await setDoc(chatDocRef, { typing: null }, { merge: true });
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = ts.toDate();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (userProfile?.banned) {
    return (
      <div className="page-container animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="card" style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem 2rem' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🔒</span>
          <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', color: '#ff5c5c', marginBottom: '1rem' }}>Chat Disabled</h1>
          <p style={{ color: 'var(--text-secondary)' }}>You cannot access chat while on a study break.</p>
          <Link to="/student-dashboard" className="btn-primary mt-4">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const initial = otherUser.displayName?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="page-container chat-page animate-fade-in-up">
      <div className="chat-wrapper card">
        <div className="chat-header">
          <div className="chat-header-info">
            <Link to={-1} className="back-btn">←</Link>
            <div className="chat-avatar">
              {initial}
              <span className="online-dot"></span>
            </div>
            <h3>{otherUser.displayName}</h3>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map(msg => {
            const isMe = msg.senderId === currentUser?.uid;
            return (
              <div key={msg.id} className={`message-wrapper ${isMe ? 'mine' : 'theirs'}`}>
                <div className={`message-bubble ${isMe ? 'my-bubble' : 'their-bubble'}`}>
                  {msg.text}
                </div>
                <div className="message-time">{formatTime(msg.timestamp)}</div>
              </div>
            );
          })}
          {isTyping && (
             <div className="message-wrapper theirs">
                <div className="message-bubble their-bubble typing-indicator">
                  <span></span><span></span><span></span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <input 
            type="text" 
            className="glass-input" 
            placeholder="Type a message..." 
            value={newMessage}
            onChange={handleTyping}
          />
          <button type="submit" className="btn-primary send-btn" disabled={!newMessage.trim()}>Send</button>
        </form>
      </div>
    </div>
  );
}
