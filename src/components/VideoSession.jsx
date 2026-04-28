import { useEffect, useRef, useState } from 'react';
import { updateSession } from '../lib/firestore';
import { useAuth } from '../contexts/AuthContext';
import './VideoSession.css';

export default function VideoSession({ session, onClose, onSessionEnded }) {
  const iframeRef = useRef(null);
  const [roomUrl, setRoomUrl] = useState(session.dailyRoomUrl || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  const isMentor = session.mentorId === currentUser?.uid;

  useEffect(() => {
    async function createRoom() {
      try {
        if (session.dailyRoomUrl) {
          setRoomUrl(session.dailyRoomUrl);
          setLoading(false);
          return;
        }

        const res = await fetch('/api/daily-room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            durationSeconds: 7200
          })
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload.error || 'Failed to create Daily room');
        }
        const data = await res.json();
        const url = data.url;

        // Save room URL to Firestore so the other person can join the same room
        await updateSession(session.id, { dailyRoomUrl: url });
        setRoomUrl(url);
        setLoading(false);
      } catch (err) {
        console.error("VideoSession error:", err);
        setError(err.message);
        setLoading(false);
      }
    }

    createRoom();
  }, [session.id]);

  const handleLeave = async () => {
    if (isMentor) {
      await updateSession(session.id, { status: 'completed' });
    }
    onSessionEnded(isMentor, session);
  };

  return (
    <div className="video-session-overlay animate-fade-in">
      <div className="video-session-modal">
        <div className="video-session-header">
          <h3>Session with {isMentor ? session.studentName : session.mentorName}</h3>
          <div className="video-header-actions">
            {isMentor && (
               <button className="btn-primary end-session-btn glow-btn" onClick={handleLeave}>End Session</button>
            )}
            {!isMentor && (
               <button className="btn-secondary end-session-btn" onClick={handleLeave}>Leave Session</button>
            )}
            <button className="close-btn" onClick={onClose} title="Minimize (session keeps running)">✕</button>
          </div>
        </div>

        <div className="video-container">
           {error && (
              <div className="video-error">
                <p>⚠️ {error}</p>
                <button className="btn-secondary mt-3" onClick={onClose}>Go Back</button>
              </div>
           )}
           {loading && !error && (
              <div className="video-loading">
                <div className="loading-spinner"></div>
                <p>Setting up your session...</p>
              </div>
           )}
           {roomUrl && !error && (
              <iframe
                ref={iframeRef}
                src={roomUrl}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '0 0 16px 16px',
                }}
              />
           )}
        </div>
      </div>
    </div>
  );
}
