// Vercel Serverless Function — api/livekit-token.js
// POST { roomName, participantIdentity } → { token }

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { roomName, participantIdentity } = req.body;

  if (!roomName || !participantIdentity) {
    return res.status(400).json({ error: 'roomName and participantIdentity are required' });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: 'LiveKit credentials not configured' });
  }

  try {
    // Dynamic import to avoid bundling issues
    const { AccessToken } = await import('livekit-server-sdk');

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
      ttl: '2h',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();
    return res.status(200).json({ token });
  } catch (error) {
    console.error('LiveKit token error:', error);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
}
