import { useEffect, useState } from 'react';
import { updateSession } from '../lib/firestore';
import { useAuth } from '../contexts/AuthContext';
import './VideoSession.css';

const JITSI_BASE_URL = 'https://meet.jit.si';

function buildJitsiRoomUrl(session) {
  const roomSeed = session.id || `${session.mentorId || 'mentor'}-${session.studentId || 'student'}-${session.date || 'class'}`;
  const roomName = `senjr-class-${String(roomSeed).replace(/[^a-zA-Z0-9-]/g, '-')}`;
  return `${JITSI_BASE_URL}/${encodeURIComponent(roomName)}`;
}

export default function VideoSession({ session, onClose, onSessionEnded }) {
  const [roomUrl, setRoomUrl] = useState(session.jitsiRoomUrl || session.meetingRoomUrl || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('prompt');
  const { currentUser } = useAuth();

  const isMentor = session.mentorId === currentUser?.uid;

  useEffect(() => {
    async function prepareRoom() {
      try {
        const existingUrl = session.jitsiRoomUrl || session.meetingRoomUrl;
        if (existingUrl) {
          setRoomUrl(existingUrl);
          return;
        }

        const url = buildJitsiRoomUrl(session);

        // Save the same Jitsi room for both mentor and student.
        await updateSession(session.id, {
          jitsiRoomUrl: url,
          meetingRoomUrl: url,
          videoProvider: 'jitsi',
        });
        setRoomUrl(url);
      } catch (err) {
        console.error('VideoSession error:', err);
        setError(err.message || 'Failed to prepare video session.');
      }
    }

    prepareRoom();
  }, [session]);

  const openMeeting = () => {
    if (roomUrl) {
      window.open(roomUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const requestMediaAccess = async () => {
    setError(null);
    setLoading(true);
    setPermissionStatus('checking');
    const meetingWindow = roomUrl ? window.open('', '_blank') : null;

    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
      setPermissionStatus('ready');
      if (meetingWindow && roomUrl) {
        meetingWindow.opener = null;
        meetingWindow.location.href = roomUrl;
      } else {
        openMeeting();
      }
    } catch (err) {
      console.error('Media permission error:', err);
      setPermissionStatus('blocked');
      if (meetingWindow) {
        meetingWindow.close();
      }
      setError('Camera or microphone permission was blocked. You can still join, but please allow camera and microphone when Jitsi asks.');
    } finally {
      setLoading(false);
    }
  };

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
              <button className="btn-primary end-session-btn glow-btn" onClick={handleLeave}>
                End Session
              </button>
            )}
            {!isMentor && (
              <button className="btn-secondary end-session-btn" onClick={handleLeave}>
                Leave Session
              </button>
            )}
            <button className="close-btn" onClick={onClose} title="Minimize (session keeps running)">
              x
            </button>
          </div>
        </div>

        <div className="video-container">
          {error && (
            <div className="video-error">
              <p>{error}</p>
              {roomUrl && (
                <button className="btn-primary mt-3" onClick={openMeeting}>
                  Open Jitsi Meet
                </button>
              )}
              <button className="btn-secondary mt-3" onClick={onClose}>
                Go Back
              </button>
            </div>
          )}

          {loading && !error && (
            <div className="video-loading">
              <div className="loading-spinner"></div>
              <p>Checking camera and microphone access...</p>
            </div>
          )}

          {roomUrl && !loading && !error && (
            <div className="video-permission-card">
              <div className="video-permission-icon">VC</div>
              <h4>Allow camera and microphone</h4>
              <p>
                Your browser will ask for camera and microphone access before the class starts.
                Please tap Allow so your mentor and student can hear and see each other.
              </p>
              <div className="video-permission-actions">
                <button className="btn-primary glow-btn" onClick={requestMediaAccess}>
                  {permissionStatus === 'ready' ? 'Open Class Again' : 'Allow & Open Class'}
                </button>
                <button className="btn-secondary" onClick={openMeeting}>
                  Open Without Check
                </button>
              </div>
              <p className="video-meeting-note">
                Jitsi opens in a secure tab so it works reliably on mobile browsers too.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
