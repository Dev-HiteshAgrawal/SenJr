import admin from 'firebase-admin';

let app;

export function getAdminApp() {
  if (app) return app;

  if (admin.apps.length > 0) {
    app = admin.apps[0];
  } else {
    // For Vercel/Production, it should use default credentials or environment variables
    // For local development, you might need a service account JSON
    app = admin.initializeApp({
      projectId: 'senjr-7a60f',
    });
  }
  return app;
}

export async function verifyIdToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth(getAdminApp()).verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return null;
  }
}
