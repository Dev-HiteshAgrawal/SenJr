/**
 * senJr — Authentication Service
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
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

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
  return onAuthStateChanged(auth, callback);
}
