import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './StudyRooms.css';

const ROOMS = [
  {
    id: 'upsc',
    name: 'UPSC Aspirants',
    description: 'Deep focus room for UPSC preparation. Strict pomodoro cycles.',
    icon: '🏛️',
    activeUsers: 142,
    theme: 'purple',
    tags: ['Silent', 'Deep Work', 'Pomodoro'],
  },
  {
    id: 'jee',
    name: 'JEE/NEET Grind',
    description: 'Physics, Chemistry, Maths & Biology problem solving.',
    icon: '🔬',
    activeUsers: 89,
    theme: 'blue',
    tags: ['Problem Solving', 'Competitive'],
  },
  {
    id: 'productivity',
    name: 'Productivity Masters',
    description: 'General study room. Share daily goals and stay accountable.',
    icon: '⚡',
    activeUsers: 210,
    theme: 'green',
    tags: ['Accountability', 'General'],
  },
  {
    id: 'silent',
    name: 'The Silent Library',
    description: 'No chatting allowed. Just pure, uninterrupted focus.',
    icon: '📚',
    activeUsers: 340,
    theme: 'amber',
    tags: ['Strict Silence', 'Long Sessions'],
  },
  {
    id: 'nightowl',
    name: 'Night Owls',
    description: 'For those who study best when the world is asleep.',
    icon: '🦉',
    activeUsers: 45,
    theme: 'indigo',
    tags: ['Late Night', 'Chill Vibes'],
  }
];

export default function StudyRooms() {
  const { currentUser, userProfile } = useAuth();
  const [activeRoom, setActiveRoom] = useState(null);
  const [timer, setTimer] = useState(25 * 60); // 25 min pomodoro
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
        setProgress(((25 * 60 - timer) / (25 * 60)) * 100);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const joinRoom = (room) => {
    setActiveRoom(room);
    setTimer(25 * 60);
    setIsTimerRunning(false);
    setProgress(0);
  };

  const leaveRoom = () => {
    setActiveRoom(null);
    setIsTimerRunning(false);
  };

  if (activeRoom) {
    return (
      <div className={`study-room-active theme-${activeRoom.theme} animate-fade-in-up`}>
        <div className="room-header">
          <button onClick={leaveRoom} className="btn-leave">← Leave Room</button>
          <div className="room-title-bar">
            <span className="room-icon-large">{activeRoom.icon}</span>
            <div>
              <h1>{activeRoom.name}</h1>
              <div className="room-live-status">
                <span className="pulse-dot"></span> {activeRoom.activeUsers + 1} focusing now
              </div>
            </div>
          </div>
        </div>

        <div className="room-dashboard">
          {/* POMODORO TIMER */}
          <div className="timer-card glass-card">
            <h3>Group Rhythm</h3>
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
            <div className="timer-controls">
              <button onClick={toggleTimer} className={`btn-primary btn-${isTimerRunning ? 'pause' : 'start'}`}>
                {isTimerRunning ? 'Pause' : 'Start'}
              </button>
            </div>
          </div>

          {/* ROOM ACTIVITY */}
          <div className="activity-card glass-card">
            <h3>Room Activity</h3>
            <div className="activity-feed">
              <div className="feed-item">
                <div className="feed-avatar">A</div>
                <div className="feed-content">
                  <strong>Aarav</strong> just completed a 50min session.
                </div>
              </div>
              <div className="feed-item">
                <div className="feed-avatar" style={{background: '#c9a96e'}}>You</div>
                <div className="feed-content">
                  Joined the room. Ready to focus.
                </div>
              </div>
              <div className="feed-item">
                <div className="feed-avatar">P</div>
                <div className="feed-content">
                  <strong>Priya</strong> started a new Pomodoro cycle.
                </div>
              </div>
            </div>
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
          <p className="page-subtitle">Join a live room. Surround yourself with focus.</p>
        </div>
        <div className="global-stats">
          <div className="stat-badge">
            <span className="pulse-dot"></span> 826 focusing right now
          </div>
        </div>
      </div>

      <div className="rooms-grid">
        {ROOMS.map(room => (
          <div key={room.id} className={`room-card theme-${room.theme}`} onClick={() => joinRoom(room)}>
            <div className="room-card-header">
              <span className="room-icon">{room.icon}</span>
              <span className="live-count"><span className="pulse-dot"></span> {room.activeUsers}</span>
            </div>
            <h3 className="room-name">{room.name}</h3>
            <p className="room-desc">{room.description}</p>
            <div className="room-tags">
              {room.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <div className="room-action">
              Join Room →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
