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
    uid: additionalData.uid || '',
    name: additionalData.name || additionalData.displayName || '',
    displayName: additionalData.displayName || additionalData.name || '',
    role,
    bio: '',
    xp: 0,
    level: 'Seedling',
    badges: [],
    streak: 0,
    activeDays: [],
    savedCourses: [],
    coursesCompleted: 0,
    homeworkCompleted: 0,
    totalSessionsCompleted: 0,
    missCount: 0,
    miss_count: 0,
    banned: false,
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

        if (!existingProfile) {
          setUserProfile(null);
          setLoading(false);
          return;
        }

        // Only sync basic info to avoid overwriting profile fields
        await upsertUser(user.uid, {
          email: user.email || existingProfile.email || '',
          displayName: existingProfile.displayName || user.displayName || existingProfile.name || '',
          name: existingProfile.name || existingProfile.displayName || user.displayName || '',
          photoURL: user.photoURL || existingProfile.photoURL || '',
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
    return signUpWithEmail(email, password, displayName);
  }

  async function handleSignIn(email, password) {
    return signInWithEmail(email, password);
  }

  async function handleGoogleSignIn() {
    return signInWithGoogle();
  }

  async function handleLogout() {
    await logout();
    setUserProfile(null);
  }

  async function handleResetPassword(email) {
    return resetPassword(email);
  }

  async function handleCompleteRegistration(uid, profileData) {
    if (!currentUser || currentUser.uid !== uid) {
      throw new Error('Unauthorized registration');
    }

    const role = profileData.role || 'student';
    await upsertUser(uid, {
      ...buildDefaultProfile(role, profileData),
      ...profileData,
    });

    const savedProfile = await getUser(uid);
    setUserProfile(savedProfile);
    return savedProfile;
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
    completeRegistration: handleCompleteRegistration,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
