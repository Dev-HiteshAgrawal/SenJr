import { getUser, updateUser } from './firestore';

export const ALL_BADGES = [
  {
    id: 'first_step',
    name: 'First Step',
    icon: '👣',
    description: 'Complete your first session',
    howToEarn: 'Complete at least 1 mentoring session',
    check: (profile) => (profile.totalSessionsCompleted || 0) >= 1,
  },
  {
    id: 'on_fire',
    name: 'On Fire!',
    icon: '🔥',
    description: 'Maintain a 7-day streak',
    howToEarn: 'Keep a daily learning streak for 7 consecutive days',
    check: (profile) => (profile.streak || 0) >= 7,
  },
  {
    id: 'month_master',
    name: 'Month Master',
    icon: '📅',
    description: 'Maintain a 30-day streak',
    howToEarn: 'Keep a daily learning streak for 30 consecutive days',
    check: (profile) => (profile.streak || 0) >= 30,
  },
  {
    id: 'star_student',
    name: 'Star Student',
    icon: '⭐',
    description: 'Get a 5-star rating from a mentor',
    howToEarn: 'Receive a perfect 5-star review on any session',
    check: (profile) => (profile.fiveStarCount || 0) >= 1,
  },
  {
    id: 'homework_hero',
    name: 'Homework Hero',
    icon: '📝',
    description: 'Complete 10 homework tasks',
    howToEarn: 'Finish 10 homework assignments given by your mentors',
    check: (profile) => (profile.homeworkCompleted || 0) >= 10,
  },
  {
    id: 'course_explorer',
    name: 'Course Explorer',
    icon: '📚',
    description: 'Complete 3 free courses',
    howToEarn: 'Finish all modules in 3 free courses',
    check: (profile) => (profile.coursesCompleted || 0) >= 3,
  },
  {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    icon: '🔭',
    description: 'Complete 1 free course',
    howToEarn: 'Finish all modules in any free course',
    check: (profile) => (profile.coursesCompleted || 0) >= 1,
  },
  {
    id: 'guide',
    name: 'Guide',
    icon: '🧭',
    description: 'Complete first 5 sessions as mentor',
    howToEarn: 'Host and complete 5 mentoring sessions',
    check: (profile) => profile.role === 'mentor' && (profile.totalSessionsCompleted || 0) >= 5,
  },
  {
    id: 'guru',
    name: 'Guru',
    icon: '🏆',
    description: 'Help 20 students as mentor',
    howToEarn: 'Mentor 20 different students through sessions',
    check: (profile) => profile.role === 'mentor' && (profile.uniqueStudentsHelped || 0) >= 20,
  },
  {
    id: 'century',
    name: 'Century!',
    icon: '💯',
    description: 'Complete 100 homework tasks',
    howToEarn: 'Finish 100 homework assignments — true dedication!',
    check: (profile) => (profile.homeworkCompleted || 0) >= 100,
  },
];

/**
 * Check all badges against user profile and award any newly earned ones.
 * Returns an array of newly earned badge objects.
 */
export async function checkAndAwardBadges(userId) {
  try {
    const profile = await getUser(userId);
    if (!profile) return [];

    const earnedBadges = profile.badges || [];
    const earnedIds = earnedBadges.map(b => b.id);
    const newlyEarned = [];

    for (const badge of ALL_BADGES) {
      if (earnedIds.includes(badge.id)) continue;
      
      if (badge.check(profile)) {
        newlyEarned.push({
          id: badge.id,
          earnedAt: new Date().toISOString(),
        });
      }
    }

    if (newlyEarned.length > 0) {
      const updatedBadges = [...earnedBadges, ...newlyEarned];
      await updateUser(userId, { badges: updatedBadges });
    }

    return newlyEarned;
  } catch (error) {
    console.error("Failed to check badges:", error);
    return [];
  }
}

/**
 * Get the full badge details given a badge id
 */
export function getBadgeById(id) {
  return ALL_BADGES.find(b => b.id === id) || null;
}
