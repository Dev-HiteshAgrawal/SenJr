/**
 * Senjr — Authentication Service
 *
 * Provides all auth operations:
 *  - Email/Password signup & login
 *  - Google Sign-In
 *  - Logout
 *  - Password reset
 *  - Auth state listener
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

let persistenceReady = null;

function ensureAuthPersistence() {
  if (!persistenceReady) {
    persistenceReady = setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.warn('Could not set auth persistence:', error);
    });
  }
  return persistenceReady;
}

// ─── Email / Password ────────────────────────────────────────

/**
 * Register a new user with email and password.
 * Optionally sets a displayName on the Firebase user profile.
 *
 * @param {string} email
 * @param {string} password
 * @param {string} [displayName]
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signUpWithEmail(email, password, displayName) {
  await ensureAuthPersistence();
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  // Set display name if provided
  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }

  return credential;
}

/**
 * Sign in an existing user with email and password.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signInWithEmail(email, password) {
  await ensureAuthPersistence();
  return signInWithEmailAndPassword(auth, email, password);
}

// ─── Google Sign-In ──────────────────────────────────────────

/**
 * Sign in with Google popup.
 * Returns the UserCredential which contains the user object
 * and additional provider data (Google profile, tokens, etc.)
 *
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signInWithGoogle() {
  await ensureAuthPersistence();
  return signInWithPopup(auth, googleProvider);
}

// ─── Sign Out ────────────────────────────────────────────────

/**
 * Sign out the current user.
 *
 * @returns {Promise<void>}
 */
export async function logout() {
  return signOut(auth);
}

// ─── Password Reset ─────────────────────────────────────────

/**
 * Send a password-reset email.
 *
 * @param {string} email
 * @returns {Promise<void>}
 */
export async function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

// ─── Auth State Observer ────────────────────────────────────

/**
 * Subscribe to auth-state changes.
 * Returns an unsubscribe function.
 *
 * @param {(user: import('firebase/auth').User | null) => void} callback
 * @returns {import('firebase/auth').Unsubscribe}
 */
export function onAuthChange(callback) {
  ensureAuthPersistence();
  return onAuthStateChanged(auth, callback);
}
