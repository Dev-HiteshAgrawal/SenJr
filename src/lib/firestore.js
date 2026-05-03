/**
 * Senjr — Firestore Service
 *
 * Centralised CRUD helpers for every Firestore collection.
 * Collections:
 *   users, mentors, students, sessions, homework, courses, badges, feed
 *
 * Each collection section exports:
 *   - create / add document
 *   - get single document by ID
 *   - get all documents (with optional query constraints)
 *   - update document
 *   - delete document
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Collection References ──────────────────────────────────

export const COLLECTIONS = {
  USERS: 'users',
  MENTORS: 'mentors',
  STUDENTS: 'students',
  SESSIONS: 'sessions',
  HOMEWORK: 'homework',
  COURSES: 'courses',
  BADGES: 'badges',
  FEED: 'feed',
};

// Helper: get a collection ref
const colRef = (name) => collection(db, name);

// Helper: get a document ref
const docRef = (collectionName, id) => doc(db, collectionName, id);

// ─── Generic CRUD Helpers ───────────────────────────────────

/**
 * Create a document with an auto-generated ID.
 * Automatically adds createdAt and updatedAt server timestamps.
 */
export async function createDocument(collectionName, data) {
  const ref = await addDoc(colRef(collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Create (or overwrite) a document with a specific ID.
 * Useful for user profiles where the doc ID = Firebase UID.
 */
export async function setDocument(collectionName, id, data, merge = true) {
  await setDoc(
    docRef(collectionName, id),
    {
      ...data,
      updatedAt: serverTimestamp(),
      ...(merge ? {} : { createdAt: serverTimestamp() }),
    },
    { merge }
  );
  return id;
}

/**
 * Get a single document by ID.
 * Returns the document data with its `id`, or null if not found.
 */
export async function getDocument(collectionName, id) {
  const snap = await getDoc(docRef(collectionName, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Subscribe to a single document.
 * Returns an unsubscribe function.
 */
export function subscribeToDocument(collectionName, id, callback) {
  return onSnapshot(docRef(collectionName, id), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

/**
 * Get all documents in a collection.
 * Optionally pass Firestore query constraints (where, orderBy, limit…).
 *
 * @param {string} collectionName
 * @param  {...import('firebase/firestore').QueryConstraint} constraints
 * @returns {Promise<Array<{id: string, [key: string]: any}>>}
 */
export async function getDocuments(collectionName, ...constraints) {
  const q = constraints.length
    ? query(colRef(collectionName), ...constraints)
    : colRef(collectionName);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Update fields on an existing document.
 * Automatically bumps `updatedAt`.
 */
export async function updateDocument(collectionName, id, data) {
  // Prevent sensitive field updates from generic helper
  const forbiddenFields = ['role', 'xp', 'level', 'banned'];
  const filteredData = { ...data };

  if (collectionName === COLLECTIONS.USERS) {
    forbiddenFields.forEach(field => delete filteredData[field]);
  }

  await updateDoc(docRef(collectionName, id), {
    ...filteredData,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Admin-only update helper that bypasses field restrictions.
 */
export async function adminUpdateDocument(collectionName, id, data) {
  await updateDoc(docRef(collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a document by ID.
 */
export async function removeDocument(collectionName, id) {
  await deleteDoc(docRef(collectionName, id));
}

// ═══════════════════════════════════════════════════════════
//  Collection-specific helpers
// ═══════════════════════════════════════════════════════════

// ─── USERS ──────────────────────────────────────────────────

/**
 * Create or update a user profile.
 * Uses the Firebase UID as the document ID.
 *
 * @param {string} uid    Firebase Auth UID
 * @param {object} data   { displayName, email, photoURL, role, bio, … }
 */
export async function upsertUser(uid, data) {
  return setDocument(COLLECTIONS.USERS, uid, data);
}

export async function getUser(uid) {
  return getDocument(COLLECTIONS.USERS, uid);
}

export function subscribeToUser(uid, callback) {
  return subscribeToDocument(COLLECTIONS.USERS, uid, callback);
}

export async function getAllUsers(...constraints) {
  return getDocuments(COLLECTIONS.USERS, ...constraints);
}

export async function updateUser(uid, data) {
  return updateDocument(COLLECTIONS.USERS, uid, data);
}

/**
 * Higher-privileged update for internal logic like XP or Badges.
 */
export async function internalUpdateUser(uid, data) {
  return adminUpdateDocument(COLLECTIONS.USERS, uid, data);
}

export async function deleteUser(uid) {
  return removeDocument(COLLECTIONS.USERS, uid);
}

// ─── MENTORS ────────────────────────────────────────────────

/**
 * @param {object} data  { uid, displayName, expertise, bio, rating, … }
 */
export async function createMentor(data) {
  return createDocument(COLLECTIONS.MENTORS, data);
}

export async function getMentor(id) {
  return getDocument(COLLECTIONS.MENTORS, id);
}

export async function getAllMentors(...constraints) {
  return getDocuments(COLLECTIONS.MENTORS, ...constraints);
}

export async function updateMentor(id, data) {
  return updateDocument(COLLECTIONS.MENTORS, id, data);
}

export async function deleteMentor(id) {
  return removeDocument(COLLECTIONS.MENTORS, id);
}

// ─── STUDENTS ───────────────────────────────────────────────

/**
 * @param {object} data  { uid, displayName, enrolledCourses, xp, level, … }
 */
export async function createStudent(data) {
  return createDocument(COLLECTIONS.STUDENTS, data);
}

export async function getStudent(id) {
  return getDocument(COLLECTIONS.STUDENTS, id);
}

export async function getAllStudents(...constraints) {
  return getDocuments(COLLECTIONS.STUDENTS, ...constraints);
}

export async function updateStudent(id, data) {
  return updateDocument(COLLECTIONS.STUDENTS, id, data);
}

export async function deleteStudent(id) {
  return removeDocument(COLLECTIONS.STUDENTS, id);
}

// ─── SESSIONS ───────────────────────────────────────────────

/**
 * @param {object} data  { mentorId, studentId, scheduledAt, duration, status, topic, … }
 */
export async function createSession(data) {
  return createDocument(COLLECTIONS.SESSIONS, data);
}

/**
 * Atomic session booking using a transaction.
 * Checks if the slot is still available in the mentor's profile.
 *
 * @param {object} bookingData
 */
export async function bookSessionTransaction(bookingData) {
  const { mentorId, studentId, dayName, time, ...otherData } = bookingData;

  return runTransaction(db, async (transaction) => {
    const mentorRef = doc(db, COLLECTIONS.USERS, mentorId);
    const mentorSnap = await transaction.get(mentorRef);

    if (!mentorSnap.exists()) {
      throw new Error("Mentor not found.");
    }

    const mentorData = mentorSnap.data();
    const availability = mentorData.availability || {};
    const daySlots = availability[dayName] || [];

    // Check if the requested slot exists and is available
    const slotIndex = daySlots.findIndex(s => s.start === time);
    if (slotIndex === -1) {
      throw new Error("This slot is no longer available.");
    }

    const slot = daySlots[slotIndex];

    // Create the session document
    const sessionsCol = collection(db, COLLECTIONS.SESSIONS);
    const newSessionRef = doc(sessionsCol);

    transaction.set(newSessionRef, {
      ...otherData,
      mentorId,
      studentId,
      dayName,
      time,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update mentor's availability: Remove the slot if it's a 1-on-1 session
    // For group sessions, we might just decrement a capacity counter
    const consumesSlot =
      slot.type === '1-on-1' ||
      slot.type === '1-on-1 Session' ||
      slot.type === 'Quick Help';
    if (consumesSlot) {
      const updatedDaySlots = daySlots.filter((_, i) => i !== slotIndex);
      transaction.update(mentorRef, {
        [`availability.${dayName}`]: updatedDaySlots,
        updatedAt: serverTimestamp(),
      });
    }

    return newSessionRef.id;
  });
}

export async function getSession(id) {
  return getDocument(COLLECTIONS.SESSIONS, id);
}

export async function getAllSessions(...constraints) {
  return getDocuments(COLLECTIONS.SESSIONS, ...constraints);
}

export async function updateSession(id, data) {
  return updateDocument(COLLECTIONS.SESSIONS, id, data);
}

export async function deleteSession(id) {
  return removeDocument(COLLECTIONS.SESSIONS, id);
}

// ─── HOMEWORK ───────────────────────────────────────────────

/**
 * @param {object} data  { studentId, mentorId, title, description, dueDate, status, … }
 */
export async function createHomework(data) {
  return createDocument(COLLECTIONS.HOMEWORK, data);
}

export async function getHomework(id) {
  return getDocument(COLLECTIONS.HOMEWORK, id);
}

export async function getAllHomework(...constraints) {
  return getDocuments(COLLECTIONS.HOMEWORK, ...constraints);
}

export async function updateHomework(id, data) {
  return updateDocument(COLLECTIONS.HOMEWORK, id, data);
}

export async function deleteHomework(id) {
  return removeDocument(COLLECTIONS.HOMEWORK, id);
}

// ─── COURSES ────────────────────────────────────────────────

/**
 * @param {object} data  { title, description, category, thumbnail, lessons, isFree, … }
 */
export async function createCourse(data) {
  return createDocument(COLLECTIONS.COURSES, data);
}

export async function getCourse(id) {
  return getDocument(COLLECTIONS.COURSES, id);
}

export async function getAllCourses(...constraints) {
  return getDocuments(COLLECTIONS.COURSES, ...constraints);
}

export async function updateCourse(id, data) {
  return updateDocument(COLLECTIONS.COURSES, id, data);
}

export async function deleteCourse(id) {
  return removeDocument(COLLECTIONS.COURSES, id);
}

// ─── BADGES ─────────────────────────────────────────────────

/**
 * @param {object} data  { name, description, icon, criteria, xpReward, … }
 */
export async function createBadge(data) {
  return createDocument(COLLECTIONS.BADGES, data);
}

export async function getBadge(id) {
  return getDocument(COLLECTIONS.BADGES, id);
}

export async function getAllBadges(...constraints) {
  return getDocuments(COLLECTIONS.BADGES, ...constraints);
}

export async function updateBadge(id, data) {
  return updateDocument(COLLECTIONS.BADGES, id, data);
}

export async function deleteBadge(id) {
  return removeDocument(COLLECTIONS.BADGES, id);
}

// ─── FEED ───────────────────────────────────────────────────

/**
 * @param {object} data  { authorId, authorName, content, type, likes, comments, … }
 */
export async function createFeedPost(data) {
  return createDocument(COLLECTIONS.FEED, data);
}

export async function getFeedPost(id) {
  return getDocument(COLLECTIONS.FEED, id);
}

export async function getAllFeedPosts(...constraints) {
  return getDocuments(COLLECTIONS.FEED, ...constraints);
}

export async function updateFeedPost(id, data) {
  return updateDocument(COLLECTIONS.FEED, id, data);
}

export async function deleteFeedPost(id) {
  return removeDocument(COLLECTIONS.FEED, id);
}

/**
 * Updates user XP and level securely.
 */
export async function addXpTransaction(uid, xpAmount) {
  return runTransaction(db, async (transaction) => {
    const userRef = docRef(COLLECTIONS.USERS, uid);
    const userSnap = await transaction.get(userRef);

    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    const currentXp = userSnap.data().xp || 0;
    const newXp = currentXp + xpAmount;

    // Level logic (simplified)
    let newLevel = userSnap.data().level || 'Seedling';
    if (newXp > 1000) newLevel = 'Sprout';
    if (newXp > 5000) newLevel = 'Tree';

    transaction.update(userRef, {
      xp: newXp,
      level: newLevel,
      updatedAt: serverTimestamp(),
    });
  });
}

// ─── Re-export query helpers for convenience ────────────────

export { where, orderBy, limit, serverTimestamp, Timestamp, runTransaction };
