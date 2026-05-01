import { useEffect, useMemo, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { updateUser } from '../lib/firestore';
import { enqueueRetry, getConnectionState, replayRetryQueue } from '../lib/offlineQueue';
import { STUDY_ROOMS, toLocalDateKey } from '../lib/studentOS';
import { trackEvent } from '../lib/productAnalytics';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, doc, setDoc, deleteDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import './StudyRooms.css';

const SESSION_KEY = 'senjr:active-study-room';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function StudyRooms() {
  const { currentUser, userProfile } = useAuth();
  const { notifySuccess, notifyInfo, notifyError } = useNotification();
  const [activeRoom, setActiveRoom] = useState(null);
  const [goal, setGoal] = useState('');
  const [timer, setTimer] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedBlocks, setCompletedBlocks] = useState(() => Number(localStorage.getItem('senjr:focus-blocks') || 0));
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const displayName = userProfile?.displayName || currentUser?.displayName || 'You';
  const durationSeconds = (activeRoom?.durationMinutes || 25) * 60;
  const progress = Math.min(100, Math.round(((durationSeconds - timer) / durationSeconds) * 100));

  useEffect(() => {
    if (!activeRoom) return;

    const q = query(
      collection(db, 'room_chats', activeRoom.id, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((docSnap) => {
        msgs.push({ id: docSnap.id, ...docSnap.data() });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [activeRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.roomId) {
        // Only restore if session is less than 12 hours old
        const savedTime = new Date(saved.updatedAt || 0).getTime();
        const now = new Date().getTime();
        const twelveHours = 12 * 60 * 60 * 1000;

        if (now - savedTime < twelveHours) {
          const room = STUDY_ROOMS.find((item) => item.id === saved.roomId);
          if (room) {
            setActiveRoom(room);
            setGoal(saved.goal || '');
            setTimer(saved.timer || room.durationMinutes * 60);
          }
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (error) {
      console.warn('Could not restore study room session:', error);
    }
  }, []);

  useEffect(() => {
    if (!activeRoom) {
      localStorage.removeItem(SESSION_KEY);
      return;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({
      roomId: activeRoom.id,
      goal,
      timer,
      updatedAt: new Date().toISOString(),
    }));
  }, [activeRoom, goal, timer]);

  useEffect(() => {
    if (!isTimerRunning || timer <= 0) return undefined;
    const interval = setInterval(() => setTimer((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  useEffect(() => {
    if (timer === 0 && activeRoom) {
      setIsTimerRunning(false);
      completeFocusBlock();
    }
  }, [timer, activeRoom]);

  useEffect(() => {
    if (!currentUser) return undefined;
    const syncQueuedWork = async () => {
      if (!getConnectionState().online) return;
      const result = await replayRetryQueue(async (item) => {
        if (item.type === 'focus_block') {
          await updateUser(currentUser.uid, item.payload);
        }
      });
      if (result.attempted > 0 && result.remaining === 0) {
        notifySuccess('Offline study progress synced.');
      }
    };

    window.addEventListener('online', syncQueuedWork);
    syncQueuedWork();
    return () => window.removeEventListener('online', syncQueuedWork);
  }, [currentUser?.uid]);

  const [roomCounts, setRoomCounts] = useState({});

  useEffect(() => {
    // Sync presence
    if (!currentUser || !activeRoom) return;

    const presenceRef = doc(db, 'room_presence', currentUser.uid);
    setDoc(presenceRef, {
      roomId: activeRoom.id,
      userName: displayName,
      lastSeen: serverTimestamp()
    }, { merge: true });

    const interval = setInterval(() => {
      setDoc(presenceRef, { lastSeen: serverTimestamp() }, { merge: true });
    }, 30000); // refresh every 30s

    return () => {
      clearInterval(interval);
      deleteDoc(presenceRef).catch(() => {});
    };
  }, [activeRoom, currentUser, displayName]);

  useEffect(() => {
    // Listen to all presence to get counts
    const q = query(collection(db, 'room_presence'), where('lastSeen', '>', new Date(Date.now() - 60000))); // active in last 1m
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        counts[data.roomId] = (counts[data.roomId] || 0) + 1;
      });
      setRoomCounts(counts);
    });
    return unsubscribe;
  }, []);

  const totalStudying = Object.values(roomCounts).reduce((a, b) => a + b, 0);

  const joinRoom = (room) => {
    setActiveRoom(room);
    setTimer(room.durationMinutes * 60);
    setIsTimerRunning(false);
    setGoal('');
    trackEvent('study_room_joined', { roomId: room.id, mode: room.mode });
  };

  const leaveRoom = async () => {
    if (currentUser) {
      await deleteDoc(doc(db, 'room_presence', currentUser.uid)).catch(() => {});
    }
    setActiveRoom(null);
    setIsTimerRunning(false);
    setMessages([]);
    // We keep the localStorage so they can resume unless they explicit reset
  };

  const resetSession = () => {
    if (window.confirm("Reset this focus session?")) {
      setIsTimerRunning(false);
      if (activeRoom) {
        setTimer(activeRoom.durationMinutes * 60);
      }
      setGoal('');
      localStorage.removeItem(SESSION_KEY);
      notifyInfo("Session reset.");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !activeRoom) return;

    try {
      await addDoc(collection(db, 'room_chats', activeRoom.id, 'messages'), {
        text: newMessage.trim(),
        senderId: currentUser.uid,
        senderName: displayName,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  const completeFocusBlock = async () => {
    if (!activeRoom || !currentUser) return;
    const newCount = completedBlocks + 1;
    const todayKey = toLocalDateKey();
    const activeDays = Array.isArray(userProfile?.activeDays) ? userProfile.activeDays : [];
    const nextActiveDays = activeDays.includes(todayKey) ? activeDays : [...activeDays, todayKey];
    const payload = {
      studyPresence: {
        online: false,
        lastRoomId: activeRoom.id,
        lastGoal: goal,
        lastStudiedAt: new Date().toISOString(),
      },
      memoryGraph: {
        lastStudiedAt: new Date().toISOString(),
        lastRoomId: activeRoom.id,
        confidence: Math.min(95, Number(userProfile?.memoryGraph?.confidence || 52) + 4),
      },
      weeklyXP: Number(userProfile?.weeklyXP || 0) + Math.round(activeRoom.durationMinutes * 1.5),
      activeDays: nextActiveDays,
    };

    setCompletedBlocks(newCount);
    localStorage.setItem('senjr:focus-blocks', String(newCount));
    trackEvent('study_room_completed', { roomId: activeRoom.id, minutes: activeRoom.durationMinutes });

    try {
      if (!getConnectionState().online) {
        enqueueRetry({ type: 'focus_block', payload });
        notifyInfo('Focus block saved offline. Senjr will remind you to sync it.');
        return;
      }
      await updateUser(currentUser.uid, payload);
      notifySuccess('Focus block saved. Your rhythm moved forward.');
    } catch (error) {
      console.error('Failed to save focus block:', error);
      enqueueRetry({ type: 'focus_block', payload });
      notifyError('Saved locally. We will retry when the network is stable.');
    }
  };

  if (activeRoom) {
    return (
      <div className={`study-room-active theme-${activeRoom.theme} animate-fade-in-up`}>
        <div className="room-header">
          <div className="room-nav-controls">
            <button onClick={leaveRoom} className="btn-leave">
              <span className="back-icon">←</span> Back to rooms
            </button>
            <button onClick={resetSession} className="btn-reset-session" title="Reset current session">
              🔄 Reset
            </button>
          </div>
          <div className="room-title-bar">
            <span className="room-icon-large">{activeRoom.icon}</span>
            <div>
              <h1>{activeRoom.name}</h1>
              <div className="room-live-status">
                <span className="pulse-dot"></span> {roomCounts[activeRoom.id] || 1} focusing now · {activeRoom.mode}
              </div>
            </div>
          </div>
        </div>

        <div className="room-dashboard upgraded">
          <div className="timer-card glass-card">
            <div className="room-card-topline">
              <span>{activeRoom.durationMinutes} min cycle</span>
              <strong>{completedBlocks} completed</strong>
            </div>
            <div className="timer-display">
              <svg viewBox="0 0 100 100" className="timer-circle">
                <circle cx="50" cy="50" r="45" className="timer-bg" />
                <circle
                  cx="50" cy="50" r="45"
                  className="timer-progress"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                />
              </svg>
              <div className="timer-text">{formatTime(timer)}</div>
            </div>
            <label className="focus-goal-input">
              <span>Focus goal</span>
              <input
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                maxLength={80}
                placeholder="Example: revise thermodynamics notes"
              />
            </label>
            <div className="timer-controls">
              <button onClick={() => setIsTimerRunning((value) => !value)} className={`btn-primary btn-${isTimerRunning ? 'pause' : 'start'}`}>
                {isTimerRunning ? 'Pause cycle' : 'Start focus'}
              </button>
              <button onClick={completeFocusBlock} className="btn-secondary room-save-btn">
                Complete now
              </button>
            </div>
          </div>

          <div className="activity-card glass-card">
            <h3>Room Chat</h3>
            <div className="activity-feed chat-feed">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div className={`feed-item ${msg.senderId === currentUser?.uid ? 'tone-self' : 'tone-peer'}`} key={msg.id}>
                    <div className="feed-avatar">{msg.senderName?.slice(0, 2)}</div>
                    <div className="feed-content">
                      <strong>{msg.senderName}</strong> {msg.text}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-chat-state">No messages yet. Be the first!</div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form className="room-chat-input" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Say something..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!getConnectionState().online}
              />
              <button type="submit" disabled={!newMessage.trim() || !getConnectionState().online}>↑</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container study-rooms-page animate-fade-in-up">
      <div className="rooms-header">
        <div>
          <h1 className="page-title">Study Rooms</h1>
          <p className="page-subtitle">Pick a room, set one target, and study beside people already in motion.</p>
        </div>
        <div className="global-stats">
          <span className="pulse-dot"></span> {totalStudying} focusing right now
        </div>
      </div>

      <section className="rooms-command-band">
        <div>
          <span>Today</span>
          <strong>{completedBlocks} focus blocks</strong>
        </div>
        <div>
          <span>Recovery</span>
          <strong>Local restore on</strong>
        </div>
        <div>
          <span>Network</span>
          <strong>{getConnectionState().online ? 'Online' : 'Offline ready'}</strong>
        </div>
      </section>

      <div className="rooms-grid">
        {STUDY_ROOMS.map(room => (
          <button key={room.id} type="button" className={`room-card theme-${room.theme}`} onClick={() => joinRoom(room)}>
            <div className="room-card-header">
              <span className="room-icon">{room.icon}</span>
              <span className="live-count"><span className="pulse-dot"></span> {roomCounts[room.id] || 0}</span>
            </div>
            <span className="room-mode">{room.mode}</span>
            <h3 className="room-name">{room.name}</h3>
            <p className="room-desc">{room.description}</p>
            <div className="room-tags">
              {room.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <div className="room-action">
              Join room
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
