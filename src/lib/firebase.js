// Firebase configuration for Senjr
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBOWE62eqXeAlYlDqNclN6VLYabC-ezGdQ",
  authDomain: "senjr-7a60f.firebaseapp.com",
  projectId: "senjr-7a60f",
  storageBucket: "senjr-7a60f.appspot.com",
  messagingSenderId: "1080629567443",
  appId: "1:1080629567443:web:7c614a547e8adf1cd8d926",
  measurementId: "G-SDC4LSGJHJ"
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
