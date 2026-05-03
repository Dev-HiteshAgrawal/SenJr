/**
 * Vercel Serverless Function: /api/livekit-token
 * Creates LiveKit video room tokens.
 * Uses firebase-admin for auth verification + livekit-server-sdk for token generation.
 */
import admin from 'firebase-admin';
import { AccessToken } from 'livekit-server-sdk';

let adminInitialized = false;

function parseServiceAccount() {
  const raw = (
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT || ''
  ).trim();
  if (!raw) return null;

  const candidates = [raw];
  if (!raw.startsWith('{')) {
    try { candidates.push(Buffer.from(raw, 'base64').toString('utf8')); } catch {}
  }

  for (const c of candidates) {
    try {
      const parsed = JSON.parse(c);
      if (parsed?.private_key) {
        parsed.private_key = String(parsed.private_key).replace(/\\n/g, '\n');
      }
      return parsed;
    } catch {}
  }
  console.error('Invalid Firebase service account JSON');
  return null;
}

function initAdmin() {
  if (adminInitialized) return;
  if (admin.apps.length > 0) { adminInitialized = true; return; }

  const projectId = (process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'senjr-7a60f').trim();
  const sa = parseServiceAccount();

  if (sa) {
    admin.initializeApp({ credential: admin.credential.cert(sa) });
  } else {
    admin.initializeApp({ projectId });
  }
  adminInitialized = true;
}

async function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const idToken = authHeader.split('Bearer ')[1];
  try {
    initAdmin();
    return await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return null;
  }
}

function cleanRoom(name) {
  return String(name || 'senjr-session').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 64);
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const user = await verifyToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authentication token.' });
  }

  const livekitApiKey = (process.env.LIVEKIT_API_KEY || '').trim();
  const livekitApiSecret = (process.env.LIVEKIT_API_SECRET || '').trim();
  if (!livekitApiKey || !livekitApiSecret) {
    return res.status(500).json({ error: 'LiveKit video service is not configured on the server.' });
  }

  try {
    const body = req.body || {};
    const roomName = cleanRoom(body.roomName);
    const participantIdentity = String(body.participantIdentity || `user-${Date.now()}`);
    const participantName = String(body.participantName || 'User');

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
      canPublishData: true,
    });

    return res.status(200).json({ token: await token.toJwt(), roomName });
  } catch (error) {
    console.error('LiveKit token error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create LiveKit token.' });
  }
}
