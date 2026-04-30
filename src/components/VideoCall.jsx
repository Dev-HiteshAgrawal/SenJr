import { useState, useEffect } from 'react';
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import { useAuth } from '../contexts/AuthContext';
import '@livekit/components-styles';

export default function VideoCall({ roomName, participantName, participantIdentity, onSessionEnd }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryTick, setRetryTick] = useState(0);
  const { currentUser } = useAuth();
  const livekitUrl = import.meta.env.VITE_LIVEKIT_URL;

  useEffect(() => {
    let cancelled = false;

    async function getToken() {
      try {
        if (!currentUser) {
          throw new Error('You must be logged in to join a session.');
        }

        const idToken = await currentUser.getIdToken();
        const cleanRoom = String(roomName || 'senjr-session')
          .replace(/[^a-zA-Z0-9_-]/g, '-')
          .slice(0, 64) || 'senjr-session';

        const cleanIdentity = String(participantIdentity || `user-${Date.now()}`)
          .replace(/[^a-zA-Z0-9_-]/g, '-')
          .slice(0, 64) || `user-${Date.now()}`;

        const cleanName = String(participantName || 'Senjr User').slice(0, 80);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch('/api/livekit-token', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          signal: controller.signal,
          body: JSON.stringify({
            roomName: cleanRoom,
            participantName: cleanName,
            participantIdentity: cleanIdentity,
          }),
        });
        clearTimeout(timeout);

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to get token');
        }

        const data = await response.json();
        if (!cancelled) setToken(data.token);
      } catch (err) {
        console.error('LiveKit token error:', err);
        if (!cancelled) {
          setError(
            err?.name === 'AbortError'
              ? 'Request timed out while starting session. Please retry.'
              : 'Could not start video session. Please check your connection and try again.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    getToken();
    return () => { cancelled = true; };
  }, [roomName, participantName, participantIdentity, currentUser, retryTick]);

  if (loading) {
    return (
      <div style={overlayStyle}>
        <div style={{ fontSize: 50 }}>🎥</div>
        <div style={{ color: '#FF6B00', fontWeight: 700, fontSize: 20 }}>Connecting your study room...</div>
        <div style={{ color: '#8896B3', fontSize: 14 }}>Syncing camera, mic, and token</div>
      </div>
    );
  }

  if (error || !livekitUrl) {
    return (
      <div style={{ ...overlayStyle, gap: 16, padding: 24 }}>
        <div style={{ fontSize: 40 }}>❌</div>
        <div style={{ color: '#FF6B9D', fontWeight: 700, fontSize: 18, textAlign: 'center' }}>Session Error</div>
        <div style={{ color: '#8896B3', fontSize: 14, textAlign: 'center', maxWidth: 300 }}>
          {error || 'LiveKit is not configured. Please try again later.'}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { setLoading(true); setError(null); setRetryTick((v) => v + 1); }} style={primaryButtonStyle}>
            🔁 Retry
          </button>
          <button onClick={onSessionEnd} style={secondaryButtonStyle}>↩️ Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...overlayStyle, alignItems: 'stretch', justifyContent: 'flex-start' }}>
      <div style={meetingTopBarStyle}>
        <div style={meetingLeftStyle}>
          <div style={brandPillStyle}>🎓 Senjr Meet</div>
          <div style={roomPillStyle}>🧠 {String(roomName || 'session').slice(0, 28)}</div>
        </div>
        <div style={meetingCenterStyle}>
          <span style={liveDotStyle}></span>
          <span style={{ fontSize: 13, color: '#b6c2dd' }}>Live mentoring call</span>
        </div>
        <div style={meetingRightStyle}>
          <button style={utilityBtnStyle} title="Captions (coming soon)">📝 Captions</button>
          <button style={utilityBtnStyle} title="Raise hand (coming soon)">✋ Raise</button>
          <button onClick={onSessionEnd} style={hangupBtnStyle}>📴 End</button>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={livekitUrl}
          data-lk-theme="default"
          style={{ height: '100%', background: '#0A0E27' }}
          onDisconnected={onSessionEnd}
          onError={(err) => console.error('LiveKitRoom error:', err)}
        >
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
      <div style={meetingBottomDockStyle}>
        <div style={dockGroupStyle}>
          <button style={dockBtnStyle}>🎙️ Mic</button>
          <button style={dockBtnStyle}>📷 Cam</button>
          <button style={dockBtnStyle}>🖥️ Share</button>
        </div>
        <div style={dockInfoStyle}>Tip: Use headphones for cleaner audio</div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: '#0A0E27',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 20,
};

const primaryButtonStyle = {
  padding: '12px 28px',
  borderRadius: 10,
  border: 'none',
  background: '#FF6B00',
  color: '#fff',
  fontWeight: 700,
  fontSize: 15,
  cursor: 'pointer',
};

const secondaryButtonStyle = {
  ...primaryButtonStyle,
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.25)',
};

const meetingTopBarStyle = {
  background: 'rgba(17, 22, 38, 0.95)',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '10px 14px',
  flexShrink: 0,
};

const meetingLeftStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  minWidth: 0,
};

const meetingCenterStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const meetingRightStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const brandPillStyle = {
  background: 'rgba(255,107,0,0.18)',
  color: '#ffd3b2',
  border: '1px solid rgba(255,107,0,0.35)',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  padding: '6px 10px',
  whiteSpace: 'nowrap',
};

const roomPillStyle = {
  background: 'rgba(255,255,255,0.06)',
  color: '#d5def4',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  padding: '6px 10px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const liveDotStyle = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: '#22c55e',
  boxShadow: '0 0 0 6px rgba(34,197,94,0.15)',
};

const utilityBtnStyle = {
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.06)',
  color: '#dbe5ff',
  borderRadius: 10,
  padding: '7px 10px',
  fontWeight: 600,
  fontSize: 12,
  cursor: 'pointer',
};

const hangupBtnStyle = {
  border: '1px solid rgba(255,97,97,0.45)',
  background: 'rgba(255,97,97,0.18)',
  color: '#ffd2d2',
  borderRadius: 10,
  padding: '7px 12px',
  fontWeight: 700,
  fontSize: 12,
  cursor: 'pointer',
};

const meetingBottomDockStyle = {
  background: 'rgba(17, 22, 38, 0.95)',
  borderTop: '1px solid rgba(255,255,255,0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '10px 14px',
  flexShrink: 0,
};

const dockGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const dockBtnStyle = {
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.05)',
  color: '#d7e3ff',
  borderRadius: 12,
  padding: '8px 12px',
  fontWeight: 600,
  fontSize: 12,
  cursor: 'pointer',
};

const dockInfoStyle = {
  color: '#95a4c7',
  fontSize: 12,
  fontWeight: 500,
};
