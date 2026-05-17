export const USER_ROLES = {
  STUDENT: 'student',
  MENTOR: 'mentor',
  ADMIN: 'admin'
}

export const SESSION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'Geography',
  'Economics',
  'Art',
  'Music',
  'Other'
]

export const EDUCATION_LEVELS = [
  'Primary School',
  'Middle School',
  'High School',
  'College/University',
  'Post Graduate',
  'Professional'
]

export const SESSION_DURATIONS = [
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 }
]

export const XP_PER_LEVEL = 1000
export const STREAK_BONUS_XP = 50
export const SESSION_COMPLETE_XP = 100