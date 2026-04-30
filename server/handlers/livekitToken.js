import { AccessToken } from 'livekit-server-sdk';
import { getServerEnv } from '../env.js';
import { allowCors, readJsonBody, sendError, sendJson } from '../http.js';

function cleanRoomName(roomName) {
  return String(roomName || 'senjr-session')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 64);
}

export async function livekitTokenHandler(req, res) {
  allowCors(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendError(res, 405, 'Method not allowed.');
    return;
  }

  const { livekitApiKey, livekitApiSecret } = getServerEnv();
  if (!livekitApiKey || !livekitApiSecret) {
    sendError(res, 500, 'LiveKit video service is not configured on the server.');
    return;
  }

  try {
    const body = await readJsonBody(req);
    const roomName = cleanRoomName(body?.roomName);
    const participantIdentity = String(body?.participantIdentity || `user-${Date.now()}`);
    const participantName = String(body?.participantName || 'User');

    const token = new AccessToken(livekitApiKey, livekitApiSecret, {
      identity: participantIdentity,
      name: participantName,
      ttl: '2h',
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    sendJson(res, 200, {
      token: await token.toJwt(),
      roomName,
    });
  } catch (error) {
    console.error('LiveKit token handler error:', error);
    sendError(res, 500, error.message || 'Failed to create LiveKit token.');
  }
}
