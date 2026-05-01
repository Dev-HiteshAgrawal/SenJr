import admin from 'firebase-admin';

let initialized = false;

export function ensureAdmin() {
  if (initialized) return;

  // In Vercel or Firebase environment, the credentials are often
  // picked up automatically if configured correctly.
  // We check if it's already initialized (Firebase Functions case)
  if (admin.apps.length === 0) {
    admin.initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'senjr-7a60f',
    });
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
