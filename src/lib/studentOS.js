const ONE_DAY = 24 * 60 * 60 * 1000;

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

  const momentum = Math.min(100, Math.round((sessions.length > 0 ? 55 : 35) + streak * 2));
  const consistency = Math.min(100, Math.round(streak * 3 + homeworkCompleted * 1.5));

  const studyScore = Math.min(
    999,
    Math.round(xp / 12 + completedSessions * 4 + homeworkCompleted * 3 + streak * 6)
  );

  return { studyScore, momentum, consistency };
}

export function buildMemoryInsights(profile = {}, completedSessions = [], homework = []) {
  const memoryGraph = profile.memoryGraph || {};
  const subjects = memoryGraph.subjects || {};
  let primarySubject = 'General';
  let weaknessProbability = 35;

  const keys = Object.keys(subjects);
  if (keys.length > 0) {
    primarySubject = keys.reduce((a, b) => (subjects[a]?.confidence < subjects[b]?.confidence ? a : b));
    weaknessProbability = Math.min(
      95,
      Math.round(100 - (subjects[primarySubject]?.confidence || 50))
    );
  }

  const confidence = Number(memoryGraph.confidence || 50);
  const revisionDue = homework.length > 2 || completedSessions.length === 0;

  const retentionEstimate = Math.max(18, Math.min(96, Math.round(confidence + completedSessions.length * 2)));

  return {
    primarySubject,
    retentionEstimate,
    weaknessProbability,
    recallScore: Math.round(confidence),
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
    title: 'Explore the community',
    detail: 'Swap notes, tips, and resources with peers on Senjr.',
    path: '/community',
    action: 'Open community',
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
