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
