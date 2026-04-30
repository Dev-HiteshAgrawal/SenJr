import { useState, useEffect } from 'react';
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';

export default function VideoCall({ roomName, participantName, participantIdentity, onSessionEnd }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const livekitUrl = import.meta.env.VITE_LIVEKIT_URL;

  useEffect(() => {
    let cancelled = false;

    async function getToken() {
      try {
        const cleanRoom = String(roomName || 'senjr-session')
          .replace(/[^a-zA-Z0-9_-]/g, '-')
          .slice(0, 64);

        const response = await fetch('/api/livekit-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomName: cleanRoom,
            participantName: participantName || 'Senjr User',
            participantIdentity: participantIdentity || 'user-' + Date.now(),
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to get token');
        }

        const data = await response.json();
        if (!cancelled) setToken(data.token);
      } catch (err) {
        console.error('LiveKit token error:', err);
        if (!cancelled) setError('Could not start video session. Please check your connection and try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    getToken();
    return () => { cancelled = true; };
  }, [roomName, participantName, participantIdentity]);

  if (loading) {
    return (
      <div style={overlayStyle}>
        <div style={{ fontSize: 50 }}>📹</div>
        <div style={{ color: '#FF6B00', fontWeight: 700, fontSize: 20 }}>Starting Senjr Session...</div>
        <div style={{ color: '#8896B3', fontSize: 14 }}>Please wait</div>
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
        <button onClick={onSessionEnd} style={primaryButtonStyle}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ ...overlayStyle, alignItems: 'stretch', justifyContent: 'flex-start' }}>
      <div style={{
        background: '#131929',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,107,0,0.3)',
        flexShrink: 0,
      }}>
        <div style={{ fontWeight: 800, color: '#FF6B00', fontSize: 18 }}>Senjr ⚡ Session</div>
        <button
          onClick={onSessionEnd}
          style={{
            padding: '6px 18px',
            borderRadius: 8,
            border: '1px solid rgba(255,100,100,0.5)',
            background: 'rgba(255,100,100,0.1)',
            color: '#ff6464',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          End Session
        </button>
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
