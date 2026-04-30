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

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 401, 'Unauthorized. Please log in to join sessions.');
    return;
  }
  const idToken = authHeader.split('Bearer ')[1];

  try {
    const body = await readJsonBody(req);
    const roomName = cleanRoomName(body?.roomName);
    const participantIdentity = String(body?.participantIdentity || `user-${Date.now()}`);
    const participantName = String(body?.participantName || 'User');

    // Server-side validation
    if (roomName.startsWith('senjr-')) {
      const sessionId = roomName.replace('senjr-', '');
      const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'senjr-7a60f';
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/sessions/${sessionId}`;

      const sessionRes = await fetch(firestoreUrl, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });

      if (!sessionRes.ok) {
        sendError(res, 403, 'Session not found or access denied.');
        return;
      }

      const sessionData = await sessionRes.json();
      if (sessionData && sessionData.fields) {
        // We validate that the session exists and is not completed.
        // Time-window enforcement is done client-side via scheduledAtMs
        // because the server runs in UTC and session times are stored
        // in the user's local timezone without an offset.
        const status = sessionData.fields.status?.stringValue;
        if (status === 'completed') {
          sendError(res, 403, 'This session has already been completed.');
          return;
        }
      }
    }

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
