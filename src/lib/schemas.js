/**
 * senJr — Firestore Collection Schemas
 *
 * This file documents the expected shape of each Firestore collection.
 * It is for reference only — Firestore is schemaless, but this serves
 * as the single source of truth for field names and types.
 *
 * All documents automatically include:
 *   createdAt: Timestamp (server)
 *   updatedAt: Timestamp (server)
 */

// ─── users ──────────────────────────────────────────────────
// Document ID = Firebase Auth UID
export const USER_SCHEMA = {
  email: '',            // string — user's email
  displayName: '',      // string — full name
  photoURL: '',         // string — profile picture URL
  role: 'student',      // 'student' | 'mentor' | 'admin'
  bio: '',              // string — short bio
  xp: 0,               // number — experience points
  level: 1,             // number — current level
  badges: [],           // string[] — array of badge IDs
  enrolledCourses: [],  // string[] — array of course IDs
  // createdAt, updatedAt added automatically
};

// ─── mentors ────────────────────────────────────────────────
export const MENTOR_SCHEMA = {
  uid: '',              // string — Firebase Auth UID (ref to users)
  displayName: '',      // string — mentor's name
  email: '',            // string
  photoURL: '',         // string
  expertise: [],        // string[] — areas of expertise
  bio: '',              // string — detailed bio
  rating: 0,            // number — average rating (0-5)
  totalSessions: 0,     // number — total sessions conducted
  hourlyRate: 0,        // number — rate per session (0 = free)
  availability: [],     // object[] — { day, startTime, endTime }
  isVerified: false,    // boolean — admin-verified mentor
};

// ─── students ───────────────────────────────────────────────
export const STUDENT_SCHEMA = {
  uid: '',              // string — Firebase Auth UID (ref to users)
  displayName: '',      // string
  email: '',            // string
  enrolledCourses: [],  // string[] — course IDs
  completedCourses: [], // string[] — course IDs
  xp: 0,               // number
  level: 1,            // number
  streakDays: 0,        // number — consecutive learning days
  mentorIds: [],        // string[] — assigned mentor IDs
};

// ─── sessions ───────────────────────────────────────────────
export const SESSION_SCHEMA = {
  mentorId: '',         // string — mentor document ID
  studentId: '',        // string — student document ID
  topic: '',            // string — session topic
  description: '',      // string
  scheduledAt: null,    // Timestamp — when the session is scheduled
  duration: 30,         // number — minutes
  status: 'pending',    // 'pending' | 'confirmed' | 'completed' | 'cancelled'
  meetingLink: '',      // string — video call link
  notes: '',            // string — session notes
  rating: 0,            // number — student's rating (0-5)
  feedback: '',         // string — student feedback
};

// ─── homework ───────────────────────────────────────────────
export const HOMEWORK_SCHEMA = {
  studentId: '',        // string
  mentorId: '',         // string
  courseId: '',          // string — optional, related course
  title: '',            // string
  description: '',      // string — task description
  dueDate: null,        // Timestamp
  status: 'assigned',   // 'assigned' | 'submitted' | 'reviewed' | 'completed'
  submissionURL: '',    // string — link to student's submission
  grade: '',            // string — mentor's grade
  mentorFeedback: '',   // string
};

// ─── courses ────────────────────────────────────────────────
export const COURSE_SCHEMA = {
  title: '',            // string
  description: '',      // string
  category: '',         // string — e.g. 'programming', 'design'
  thumbnail: '',        // string — image URL
  authorId: '',         // string — mentor/admin who created it
  authorName: '',       // string
  lessons: [],          // object[] — { title, videoURL, duration, order }
  totalLessons: 0,      // number
  isFree: true,         // boolean
  price: 0,             // number — if not free
  enrolledCount: 0,     // number
  rating: 0,            // number — average rating
  tags: [],             // string[]
  difficulty: 'beginner', // 'beginner' | 'intermediate' | 'advanced'
};

// ─── badges ─────────────────────────────────────────────────
export const BADGE_SCHEMA = {
  name: '',             // string — badge display name
  description: '',      // string — how to earn this badge
  icon: '',             // string — emoji or image URL
  criteria: '',         // string — machine-readable criteria key
  xpReward: 0,          // number — XP granted when earned
  rarity: 'common',     // 'common' | 'rare' | 'epic' | 'legendary'
};

// ─── feed ───────────────────────────────────────────────────
export const FEED_SCHEMA = {
  authorId: '',         // string — user UID
  authorName: '',       // string
  authorPhotoURL: '',   // string
  content: '',          // string — post body
  type: 'post',         // 'post' | 'achievement' | 'question' | 'resource'
  likes: 0,             // number
  likedBy: [],          // string[] — user UIDs who liked
  commentCount: 0,      // number
  tags: [],             // string[]
  imageURL: '',         // string — optional attached image
};
