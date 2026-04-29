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

// Prevent duplicate-app error during Vite HMR
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

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
