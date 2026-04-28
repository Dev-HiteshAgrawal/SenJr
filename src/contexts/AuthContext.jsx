/**
 * senJr — Auth Context Provider
 *
 * Wraps the app to provide authentication state everywhere.
 * Exposes:
 *   - currentUser   (Firebase User object or null)
 *   - userProfile   (Firestore user doc or null)
 *   - loading       (true while auth state is being resolved)
 *   - signUpWithEmail, signInWithEmail, signInWithGoogle, logout, resetPassword
 */

import { createContext, useContext, useState, useEffect } from 'react';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logout,
  resetPassword,
  onAuthChange,
} from '../lib/auth';
import { upsertUser, getUser, subscribeToUser } from '../lib/firestore';

const AuthContext = createContext(null);

function buildDefaultProfile(role = 'student', additionalData = {}) {
  const isMentor = role === 'mentor';

  return {
    role,
    bio: '',
    xp: 0,
    level: 1,
    badges: [],
    streak: 0,
    activeDays: [],
    savedCourses: [],
    coursesCompleted: 0,
    homeworkCompleted: 0,
    totalSessionsCompleted: 0,
    miss_count: 0,
    totalReviews: 0,
    averageRating: 0,
    ...(isMentor
      ? {
          availability: {
            Mon: [],
            Tue: [],
            Wed: [],
            Thu: [],
            Fri: [],
            Sat: [],
            Sun: [],
          },
          verificationStatus: 'unverified',
          studentIdsHelped: [],
          uniqueStudentsHelped: 0,
        }
      : {}),
    ...additionalData,
  };
}

/**
 * Hook to access auth context values.
 * Must be used within <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

/**
 * AuthProvider component.
 * Listens to Firebase auth state and syncs with Firestore user profile.
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    let unsubscribeProfile = () => {};

    const unsubscribe = onAuthChange(async (user) => {
      unsubscribeProfile();
      setCurrentUser(user);

      if (!user) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        const existingProfile = await getUser(user.uid);
        const needsDefaults = !existingProfile || !existingProfile.role;

        await upsertUser(user.uid, {
          email: user.email || '',
          displayName: user.displayName || existingProfile?.displayName || '',
          photoURL: user.photoURL || existingProfile?.photoURL || '',
          ...(needsDefaults ? buildDefaultProfile(existingProfile?.role || 'student', existingProfile || {}) : {}),
        });

        unsubscribeProfile = subscribeToUser(user.uid, (profile) => {
          setUserProfile(profile);
          setLoading(false);
        });
      } catch (err) {
        console.error('Error syncing user profile:', err);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeProfile();
      unsubscribe();
    };
  }, []);

  // ─── Wrapped auth methods ──────────────────────────────────

  async function handleSignUp(email, password, displayName, additionalData = {}) {
    const credential = await signUpWithEmail(email, password, displayName);
    const role = additionalData.role || 'student';
    // Create Firestore profile immediately with explicit role
    await upsertUser(credential.user.uid, {
      email,
      displayName: displayName || '',
      photoURL: '',
      ...buildDefaultProfile(role, additionalData),
      ...additionalData,
    });
    return credential;
  }

  async function handleSignIn(email, password) {
    return signInWithEmail(email, password);
  }

  async function handleGoogleSignIn() {
    const credential = await signInWithGoogle();
    const existingProfile = await getUser(credential.user.uid);
    const needsDefaults = !existingProfile || !existingProfile.role;
    // Ensure Firestore profile on first Google login
    await upsertUser(credential.user.uid, {
      email: credential.user.email,
      displayName: credential.user.displayName || '',
      photoURL: credential.user.photoURL || '',
      ...(needsDefaults ? buildDefaultProfile(existingProfile?.role || 'student', existingProfile || {}) : {}),
    });
    return credential;
  }

  async function handleLogout() {
    await logout();
    setUserProfile(null);
  }

  async function handleResetPassword(email) {
    return resetPassword(email);
  }

  // ─── Context value ─────────────────────────────────────────

  const value = {
    currentUser,
    userProfile,
    loading,
    signUpWithEmail: handleSignUp,
    signInWithEmail: handleSignIn,
    signInWithGoogle: handleGoogleSignIn,
    logout: handleLogout,
    resetPassword: handleResetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
