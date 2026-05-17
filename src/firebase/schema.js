/**
 * Firestore Collections Schema Reference
 * 
 * This file serves as documentation for the expected structures of 
 * the Firestore documents in each collection.
 */

export const collections = {
  USERS: 'users',
  MENTORS: 'mentors',
  STUDENTS: 'students',
  SESSIONS: 'sessions',
  BOOKINGS: 'bookings',
  WAR_ROOMS: 'warRooms',
  REVIEWS: 'reviews',
  PAYMENTS: 'payments',
  ACHIEVEMENTS: 'achievements',
  CERTIFICATES: 'certificates',
}

export const Schemas = {
  // users (uid, name, email, role, avatar, bio, xp, level, streak, badges, createdAt)
  User: {
    uid: String,
    name: String,
    email: String,
    role: ['student', 'mentor', 'admin'],
    avatar: String,
    bio: String,
    xp: Number,
    level: Number,
    streak: Number,
    badges: Array, // Array of achievement IDs or strings
    createdAt: Date // or Firestore Timestamp
  },

  // mentors (uid, name, verified, doubleverified, expertise, pricing, availability, rating, totalSessions, earnings, documents, videoIntro)
  Mentor: {
    uid: String,
    name: String,
    verified: Boolean,
    doubleverified: Boolean,
    expertise: Array, // Array of strings e.g. ['React', 'Node.js']
    pricing: Number, // Session price
    availability: Array, // Schedule structure
    rating: Number, // e.g. 4.8
    totalSessions: Number,
    earnings: Number,
    documents: Array, // URLs to verification documents
    videoIntro: String // URL to intro video
  },

  // students (uid, name, education, goals, subjects, achievements, friends)
  Student: {
    uid: String,
    name: String,
    education: {
      level: String,
      collegeName: String,
      university: String,
      city: String,
      state: String,
      yearOfStudy: String,
      graduationYear: String
    },
    goals: {
      primaryGoal: String,
      targetExams: Array,
      weakSubjects: Array,
      strongSubjects: Array,
      preferredLanguage: String,
      studyHoursPerDay: String
    },
    subjects: Array,
    achievements: Array, // Array of achievement IDs
    friends: Array // Array of user UIDs
  },

  // sessions (id, mentorId, studentId, date, startTime, endTime, duration, price, status, paymentStatus)
  Session: {
    id: String,
    mentorId: String,
    studentId: String,
    date: Date, // Date or string
    startTime: String, // HH:MM
    endTime: String, // HH:MM
    duration: Number, // in minutes
    price: Number,
    status: ['scheduled', 'completed', 'cancelled'],
    paymentStatus: ['pending', 'paid', 'refunded']
  },

  // bookings (id, sessionId, upiQR, paymentScreenshot, adminVerified)
  Booking: {
    id: String,
    sessionId: String,
    upiQR: String, // URL to UPI QR generated or saved
    paymentScreenshot: String, // URL to uploaded screenshot
    adminVerified: Boolean
  },

  // warRooms (id, title, examType, mentor, price, students, schedule, materials)
  WarRoom: {
    id: String,
    title: String,
    examType: String,
    mentor: String, // Mentor UID
    price: Number,
    students: Array, // Array of Student UIDs
    schedule: Array, // Array of dates/times
    materials: Array // Array of URLs to PDFs/docs
  },

  // reviews (id, mentorId, studentId, rating, comment, createdAt)
  Review: {
    id: String,
    mentorId: String,
    studentId: String,
    rating: Number, // 1-5
    comment: String,
    createdAt: Date
  },

  // payments (id, bookingId, amount, upiId, screenshot, verified, verifiedBy)
  Payment: {
    id: String,
    bookingId: String,
    amount: Number,
    upiId: String,
    screenshot: String, // URL
    verified: Boolean,
    verifiedBy: String // Admin UID
  },

  // achievements (id, userId, badge, title, description, earnedAt)
  Achievement: {
    id: String,
    userId: String,
    badge: String, // Icon/Image URL or string identifier
    title: String,
    description: String,
    earnedAt: Date
  },

  // certificates (id, userId, mentorId, title, issueDate, fileUrl)
  Certificate: {
    id: String,
    userId: String,
    mentorId: String, // Optionally the mentor who issued it or associated session mentor
    title: String,
    issueDate: Date,
    fileUrl: String // PDF URL
  }
}
