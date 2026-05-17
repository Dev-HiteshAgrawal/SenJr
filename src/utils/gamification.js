/**
 * Senjr Gamification & Streak System
 * All XP awards, level calculations, and streak logic.
 */

import { doc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

// ─── XP Configuration ──────────────────────────────────────────────────────
export const XP_REWARDS = {
  SIGNUP:             10,
  PROFILE_COMPLETE:   50,
  FIRST_SESSION:     100,
  SESSION_COMPLETED:  25,
  STREAK_7_DAYS:      50,
  LEAVE_REVIEW:       15,
  FIRST_COURSE:       20,
  WAR_ROOM_ENROLL:    30,
};

// ─── Level System ────────────────────────────────────────────────────────────
export const LEVEL_NAMES = {
  1: 'Newcomer',
  2: 'Scholar',
  3: 'Explorer',
  4: 'Achiever',
  5: 'Champion',
};

export const XP_PER_LEVEL = 200;

export const calculateLevel = (xp = 0) => Math.floor(xp / XP_PER_LEVEL) + 1;

export const getLevelName = (xp = 0) => {
  const level = calculateLevel(xp);
  return LEVEL_NAMES[Math.min(level, 5)] || 'Champion';
};

export const getXpToNextLevel = (xp = 0) => {
  const level = calculateLevel(xp);
  return level * XP_PER_LEVEL - xp;
};

export const getLevelProgress = (xp = 0) => {
  const xpIntoLevel = xp % XP_PER_LEVEL;
  return Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);
};

// ─── Award XP ────────────────────────────────────────────────────────────────
/**
 * Award XP to a user and update their level.
 * @param {string} uid   - Firebase user UID
 * @param {number} amount - XP to award
 * @param {string} reason - human-readable reason (for logging)
 */
export const awardXP = async (uid, amount, reason = '') => {
  if (!uid || !amount) return;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;

    const currentXp = snap.data().xp || 0;
    const newXp = currentXp + amount;
    const newLevel = calculateLevel(newXp);

    await updateDoc(userRef, {
      xp: increment(amount),
      level: newLevel,
    });

    console.log(`[XP] +${amount} XP to ${uid} for "${reason}" → Total: ${newXp} (Level ${newLevel})`);
    return { newXp, newLevel, levelName: getLevelName(newXp) };
  } catch (error) {
    console.error('[XP] Error awarding XP:', error);
  }
};

// ─── Streak System ────────────────────────────────────────────────────────────
/**
 * Call on every login to update streak.
 * - If last login was yesterday → increment streak
 * - If already logged in today → do nothing
 * - If gap > 1 day → reset streak to 1
 */
export const updateStreak = async (uid) => {
  if (!uid) return;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastLogin = data.lastLoginDate?.toDate?.();
    let streakDays = data.streakDays || 1;
    let streakBonusAwarded = false;

    if (lastLogin) {
      const last = new Date(lastLogin);
      last.setHours(0, 0, 0, 0);

      const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Already logged in today — no change
        return { streakDays, alreadyLoggedIn: true };
      } else if (diffDays === 1) {
        // Consecutive day — increment
        streakDays = streakDays + 1;
      } else {
        // Missed a day — reset
        streakDays = 1;
      }
    }

    const updates = {
      streakDays,
      lastLoginDate: serverTimestamp(),
    };

    // Award bonus XP on 7-day streak
    if (streakDays === 7) {
      const currentXp = data.xp || 0;
      const newXp = currentXp + XP_REWARDS.STREAK_7_DAYS;
      updates.xp = newXp;
      updates.level = calculateLevel(newXp);
      streakBonusAwarded = true;
    }

    await updateDoc(userRef, updates);
    return { streakDays, streakBonusAwarded };
  } catch (error) {
    console.error('[Streak] Error updating streak:', error);
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getStreakEmoji = (streak) => {
  if (streak >= 30) return '🔥🏆';
  if (streak >= 14) return '🔥⚡';
  if (streak >= 7)  return '🔥';
  if (streak >= 3)  return '⚡';
  return '✨';
};
