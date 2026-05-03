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
export const isFirebaseConfigured = missingFirebaseKeys.length === 0;

if (!isFirebaseConfigured) {
  const detail = `Missing: ${missingFirebaseKeys.join(', ')}. Set matching VITE_FIREBASE_* vars in Vercel or Netlify (Build scope).`;
  console.error(`Senjr: Firebase client config missing. ${detail}`);
}

// Prevent blank-screen boot crash: use safe placeholder config if required keys are absent.
const safeFirebaseConfig = isFirebaseConfigured
  ? firebaseConfig
  : {
      apiKey: 'missing-api-key',
      authDomain: 'missing-auth-domain.invalid',
      projectId: 'missing-project-id',
      storageBucket: 'missing-storage-bucket',
      messagingSenderId: '0',
      appId: '1:0:web:0',
      measurementId: '',
    };

// Prevent duplicate-app error during Vite HMR
let app;
try {
  app = getApps().length ? getApp() : initializeApp(safeFirebaseConfig);
} catch (e) {
  const msg = e?.message || String(e);
  console.error(`Senjr: Firebase initializeApp failed (${msg}).`);
  app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: 'fallback',
        authDomain: 'fallback.invalid',
        projectId: 'fallback-project',
        storageBucket: 'fallback-bucket',
        messagingSenderId: '0',
        appId: '1:0:web:0',
      });
}

// Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider ? always show account picker
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
