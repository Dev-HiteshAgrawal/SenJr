const ONE_DAY = 24 * 60 * 60 * 1000;

export const STUDY_ROOMS = [
  {
    id: 'silent',
    name: 'Silent Library',
    description: 'Quiet deep work with visible accountability.',
    icon: 'SL',
    activeUsers: 340,
    theme: 'amber',
    mode: 'Silent',
    durationMinutes: 50,
    tags: ['Silent', 'Deep Work', 'No Chat'],
  },
  {
    id: 'pomodoro',
    name: 'Pomodoro Room',
    description: 'Shared 25 minute cycles with short resets.',
    icon: 'PO',
    activeUsers: 226,
    theme: 'green',
    mode: 'Pomodoro',
    durationMinutes: 25,
    tags: ['25:5', 'Focus Sprint', 'Live Timer'],
  },
  {
    id: 'upsc',
    name: 'UPSC Focus',
    description: 'Long-form preparation for current affairs and GS.',
    icon: 'UP',
    activeUsers: 142,
    theme: 'purple',
    mode: 'Exam',
    durationMinutes: 50,
    tags: ['UPSC', 'Revision', 'Daily Targets'],
  },
  {
    id: 'jee-neet',
    name: 'JEE / NEET Lab',
    description: 'Problem solving room for competitive exam practice.',
    icon: 'JN',
    activeUsers: 89,
    theme: 'blue',
    mode: 'Exam',
    durationMinutes: 45,
    tags: ['Physics', 'Chemistry', 'Problem Sets'],
  },
  {
    id: 'community',
    name: 'Community Study',
    description: 'Goal sharing, accountability, and steady progress.',
    icon: 'CS',
    activeUsers: 210,
    theme: 'indigo',
    mode: 'Community',
    durationMinutes: 40,
    tags: ['Accountability', 'Goals', 'Friends'],
  },
];

export function toLocalDateKey(date = new Date()) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
}

export function getWeekKey(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return toLocalDateKey(d);
}

export function buildStudyScore(profile = {}, sessions = [], homework = []) {
  const xp = Number(profile.xp || 0);
  const streak = Number(profile.streak || 0);
  const completedSessions = Number(profile.totalSessionsCompleted || 0);
  const homeworkCompleted = Number(profile.homeworkCompleted || 0);
  const missCount = Number(profile.miss_count || profile.missCount || 0);
  const activeDays = Array.isArray(profile.activeDays) ? profile.activeDays : [];
  const recentDays = activeDays.slice(-14).length;
  const upcomingCount = sessions.filter((session) => session.status === 'upcoming').length;
  const pendingCount = homework.length;

  const consistency = Math.min(100, Math.round((recentDays / 14) * 65 + Math.min(streak, 14) * 2.5));
  const studyScore = Math.max(
    0,
    Math.min(100, Math.round(xp / 80 + streak * 4 + completedSessions * 3 + homeworkCompleted * 2 - missCount * 8))
  );
  const momentum = Math.max(0, Math.min(100, Math.round(studyScore * 0.55 + consistency * 0.35 + (upcomingCount ? 10 : 0))));

  return {
    consistency,
    studyScore,
    momentum,
    weeklyXP: Number(profile.weeklyXP || Math.round(xp * 0.18)),
    pendingCount,
    upcomingCount,
  };
}

export function buildMemoryInsights(profile = {}, completedSessions = [], pendingHomework = []) {
  const memory = profile.memoryGraph || {};
  const savedCourses = Array.isArray(profile.savedCourses) ? profile.savedCourses : [];
  const completedCourseCount = Number(profile.coursesCompleted || 0);
  const sessionSubjects = completedSessions
    .map((session) => session.sessionType || session.subject || session.topic)
    .filter(Boolean);
  const candidateSubjects = [...sessionSubjects, ...savedCourses.map((course) => course.title || course.name).filter(Boolean)];
  const primarySubject = candidateSubjects[0] || pendingHomework[0]?.subject || pendingHomework[0]?.title || 'Core study plan';
  const lastStudiedAt = memory.lastStudiedAt || completedSessions[0]?.completedAt || completedSessions[0]?.updatedAt;
  const daysSinceStudy = lastStudiedAt ? Math.max(0, Math.floor((Date.now() - new Date(lastStudiedAt).getTime()) / ONE_DAY)) : null;
  const confidence = Number(memory.confidence ?? Math.min(92, 48 + completedCourseCount * 8 + completedSessions.length * 5));
  const retentionEstimate = Math.max(18, Math.min(96, Math.round(confidence - (daysSinceStudy || 2) * 7 + completedSessions.length * 2)));
  const weaknessProbability = Math.max(4, Math.min(92, 100 - retentionEstimate + pendingHomework.length * 4));
  const recallScore = Math.max(0, Math.min(100, Math.round(retentionEstimate - weaknessProbability * 0.18)));
  const revisionDue = daysSinceStudy === null || daysSinceStudy >= 2 || weaknessProbability >= 45 || pendingHomework.length > 0;

  return {
    primarySubject,
    retentionEstimate,
    weaknessProbability,
    recallScore,
    revisionDue,
    revisionLabel: revisionDue ? 'Revision due today' : 'Memory holding well',
    confidenceLabel: confidence >= 75 ? 'High confidence' : confidence >= 50 ? 'Building confidence' : 'Needs a light review',
  };
}

export function buildNextBestAction({ profile = {}, upcomingSessions = [], pendingHomework = [], memory = {} }) {
  if (upcomingSessions.length > 0) {
    const next = upcomingSessions[0];
    return {
      title: 'Prepare for your next session',
      detail: `${next.mentorName || 'Your mentor'} at ${next.time || 'the scheduled time'}. Bring one clear question.`,
      path: '/student-dashboard',
      action: 'Review session',
    };
  }

  if (pendingHomework.length > 0) {
    return {
      title: 'Clear one target',
      detail: `${pendingHomework[0].title || 'Your pending task'} is the cleanest win right now.`,
      path: '/student-dashboard',
      action: 'Start target',
    };
  }

  if (memory.revisionDue) {
    return {
      title: 'Protect your memory',
      detail: `${memory.primarySubject} needs a short recall pass before it fades.`,
      path: '/ai-tutor',
      action: 'Revise now',
    };
  }

  if ((profile.friends || []).length === 0) {
    return {
      title: 'Add accountability',
      detail: 'Find one serious study partner and make progress visible.',
      path: '/community',
      action: 'Find peers',
    };
  }

  return {
    title: 'Join a live room',
    detail: 'A focused block now keeps today from becoming a blank day.',
    path: '/study-rooms',
    action: 'Enter room',
  };
}

export function buildFriendStandings(profile = {}, friends = []) {
  const me = {
    id: profile.uid || 'me',
    displayName: profile.displayName || profile.name || 'You',
    streak: Number(profile.streak || 0),
    weeklyXP: Number(profile.weeklyXP || profile.xp || 0),
    isMe: true,
  };

  return [me, ...friends.map((friend) => ({
    id: friend.id,
    displayName: friend.displayName || friend.name || 'Study friend',
    streak: Number(friend.streak || 0),
    weeklyXP: Number(friend.weeklyXP || friend.xp || 0),
    isOnline: Boolean(friend.isOnline || friend.studyPresence?.online),
  }))]
    .sort((a, b) => b.weeklyXP - a.weeklyXP || b.streak - a.streak)
    .slice(0, 5)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

export function summarizeRoomActivity(room, displayName = 'You') {
  return [
    { id: 'joined', actor: displayName, text: 'joined with a focus goal.', tone: 'self' },
    { id: 'cycle', actor: 'Room', text: `${room.mode} cycle is active for ${room.durationMinutes} minutes.`, tone: 'system' },
    { id: 'finish', actor: 'Aarav', text: 'completed a clean focus block.', tone: 'peer' },
    { id: 'goal', actor: 'Priya', text: 'set a revision target for the next sprint.', tone: 'peer' },
  ];
}
