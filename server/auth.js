import admin from 'firebase-admin';

let initialized = false;

function parseServiceAccountJson() {
  const raw =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw || !String(raw).trim()) return null;
  try {
    return JSON.parse(String(raw).trim());
  } catch (e) {
    console.error('Invalid Firebase service account JSON in environment');
    return null;
  }
}

export function ensureAdmin() {
  if (initialized) return;
  if (admin.apps.length > 0) {
    initialized = true;
    return;
  }

  const projectId =
    process.env.VITE_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    'senjr-7a60f';
  const serviceAccount = parseServiceAccountJson();

  if (serviceAccount) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } else {
    // Firebase Functions / GCP: default credentials. Netlify & local: set
    // FIREBASE_SERVICE_ACCOUNT_JSON for verifyIdToken in serverless APIs.
    admin.initializeApp({ projectId });
  }

  initialized = true;
}

/**
 * Verifies the Firebase ID token from the Authorization header.
 * @param {import('node:http').IncomingMessage} req
 * @returns {Promise<admin.auth.DecodedIdToken | null>}
 */
export async function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    ensureAdmin();
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return null;
  }
}
