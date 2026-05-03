// Firebase configuration for Senjr
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredClientKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missingFirebaseKeys = requiredClientKeys.filter((key) => !firebaseConfig[key]?.trim?.());

if (missingFirebaseKeys.length > 0) {
  const detail = `Missing: ${missingFirebaseKeys.join(', ')}. Set matching VITE_FIREBASE_* vars in Netlify (Build scope).`;
  if (import.meta.env.PROD) {
    throw new Error(`Senjr: Firebase client is not configured. ${detail}`);
  }
  console.warn(`Senjr: ${detail}`);
}

// Prevent duplicate-app error during Vite HMR
let app;
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  const msg = e?.message || String(e);
  throw new Error(
    `Senjr: Firebase initializeApp failed (${msg}). Verify VITE_FIREBASE_* in the Netlify build environment.`
  );
}

// Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider — always show account picker
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Firestore Database
export const db = getFirestore(app);

// Firebase Storage
export const storage = getStorage(app);

// Analytics (browser only, skip if measurementId missing)
let analytics = null;
try {
  if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
} catch (e) {
  console.warn('Analytics init skipped:', e.message);
}
export { analytics };

export default app;
