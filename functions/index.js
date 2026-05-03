import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { AccessToken } from 'livekit-server-sdk';
import admin from 'firebase-admin';

admin.initializeApp();

const livekitApiKey = defineSecret('LIVEKIT_API_KEY');
const livekitApiSecret = defineSecret('LIVEKIT_API_SECRET');

async function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    return await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    console.error('Error verifying auth token:', err);
    return null;
  }
}

function allowCors(res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}

function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { error: message });
}

function getRequestPath(req) {
  const rawPath = req.path || req.url || '/';
  return rawPath.replace(/^\/api\/?/, '/');
}

async function handleRuntimeConfig(req, res) {
  if (req.method !== 'GET') {
    sendError(res, 405, 'Method not allowed.');
    return;
  }

  sendJson(res, 200, {
    aiTutorEnabled: false,
    aiProvider: null,
    livekitEnabled: Boolean(livekitApiKey.value() && livekitApiSecret.value()),
    adminConfigured: Boolean(process.env.ADMIN_EMAIL),
  });
}

function cleanRoomName(roomName) {
  return String(roomName || 'senjr-session')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 64);
}

async function handleLiveKitToken(req, res) {
  if (req.method !== 'POST') {
    sendError(res, 405, 'Method not allowed.');
    return;
  }

  const decodedToken = await verifyAuth(req);
  if (!decodedToken) {
    sendError(res, 401, 'Unauthorized: Missing or invalid authentication token.');
    return;
  }

  if (!livekitApiKey.value() || !livekitApiSecret.value()) {
    sendError(res, 500, 'LiveKit video service is not configured on the server.');
    return;
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];
  const { roomName: rawRoomName, participantIdentity: rawIdentity, participantName: rawName } = req.body || {};
  const roomName = cleanRoomName(rawRoomName);
  const participantIdentity = String(rawIdentity || `user-${Date.now()}`);
  const participantName = String(rawName || 'User');

  if (roomName.startsWith('senjr-')) {
    const sessionId = roomName.replace('senjr-', '');
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'senjr-7a60f';
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/sessions/${sessionId}`;

    try {
      const sessionRes = await fetch(firestoreUrl, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (!sessionRes.ok) {
        sendError(res, 403, 'Session not found or access denied.');
        return;
      }

      const sessionData = await sessionRes.json();
      if (sessionData?.fields?.status?.stringValue === 'completed') {
        sendError(res, 403, 'This session has already been completed.');
        return;
      }
    } catch (err) {
      console.error('Session validation error:', err);
      sendError(res, 500, 'Failed to validate session.');
      return;
    }
  }

  const token = new AccessToken(livekitApiKey.value(), livekitApiSecret.value(), {
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
}

export const api = onRequest(
  {
    region: 'us-central1',
    timeoutSeconds: 120,
    secrets: [livekitApiKey, livekitApiSecret],
  },
  async (req, res) => {
    allowCors(res);

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    const requestPath = getRequestPath(req);

    try {
      if (requestPath === '/runtime-config') {
        await handleRuntimeConfig(req, res);
        return;
      }

      if (requestPath === '/livekit-token') {
        await handleLiveKitToken(req, res);
        return;
      }

      sendError(res, 404, 'API route not found.');
    } catch (error) {
      console.error('Firebase API error:', error);
      sendError(res, 500, error.message || 'Unexpected server error.');
    }
  }
);
