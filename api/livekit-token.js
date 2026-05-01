export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { roomName, participantName, participantIdentity } = req.body || {};

  const cleanRoomName = String(roomName || 'senjr-session')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 64) || 'senjr-session';
  const cleanIdentity = String(participantIdentity || `user-${Date.now()}`)
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 64) || `user-${Date.now()}`;
  const cleanName = String(participantName || 'Senjr User').slice(0, 80);

  if (!cleanRoomName || !cleanIdentity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Support both VITE_ prefixed and unprefixed env var names
  const apiKey = process.env.LIVEKIT_API_KEY || process.env.VITE_LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET || process.env.VITE_LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: 'LiveKit credentials not configured' });
  }

  // Server-side validation against Firestore
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ') && cleanRoomName.startsWith('senjr-')) {
    const idToken = authHeader.split('Bearer ')[1];
    const sessionId = cleanRoomName.replace('senjr-', '');
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'senjr-7a60f';
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/sessions/${sessionId}`;

    try {
      const sessionRes = await fetch(firestoreUrl, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });

      if (!sessionRes.ok) {
        return res.status(403).json({ error: 'Session not found or access denied.' });
      }

      const sessionData = await sessionRes.json();
      if (sessionData && sessionData.fields) {
        const status = sessionData.fields.status?.stringValue;
        if (status === 'completed') {
          return res.status(403).json({ error: 'This session has already been completed.' });
        }
      }
    } catch (err) {
      console.error('Session validation error:', err);
      // We continue if it's a non-critical network error to avoid blocking the user
    }
  }

  try {
    const { AccessToken } = await import('livekit-server-sdk');

    const at = new AccessToken(
      apiKey.replace(/[\r\n\t ]+$/g, ''),
      apiSecret.replace(/[\r\n\t ]+$/g, ''),
      {
        identity: cleanIdentity,
        name: cleanName,
        ttl: 18000, // 5 hours
      }
    );

    at.addGrant({
      roomJoin: true,
      room: cleanRoomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Token generation error:', error);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
}
