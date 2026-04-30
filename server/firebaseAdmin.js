import admin from 'firebase-admin';

let app;

export function getAdminApp() {
  if (app) return app;

  // For Vercel/Local: use environment variables for service account if available,
  // or just initialize with defaults if in a Firebase environment.
  if (admin.apps.length > 0) {
    app = admin.apps[0];
  } else {
    // Attempt to initialize. If it fails, it might be due to missing credentials.
    // In many environments (like Firebase Functions or GAE), it works without args.
    try {
      app = admin.initializeApp();
    } catch (error) {
      console.warn('Firebase Admin init failed with default credentials, trying service account from env...');

      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (serviceAccount) {
        try {
          app = admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccount))
          });
        } catch (parseError) {
          console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', parseError);
          throw parseError;
        }
      } else {
        console.error('FIREBASE_SERVICE_ACCOUNT is missing and default credentials failed.');
        throw error;
      }
    }
  }

  return app;
}

export async function verifyIdToken(req) {
  getAdminApp();
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header.');
  }

  const idToken = authHeader.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  return decodedToken;
}
