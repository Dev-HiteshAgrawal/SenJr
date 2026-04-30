import { getUser, internalUpdateUser } from './firestore';

export const LEVELS = [
  { name: 'Seedling', icon: '🌱', min: 0, max: 499 },
  { name: 'Scholar', icon: '📚', min: 500, max: 1999 },
  { name: 'Sage', icon: '🧠', min: 2000, max: 4999 },
  { name: 'Guru', icon: '🏆', min: 5000, max: Infinity }
];

export function getLevelDetails(xp) {
  const safeXP = typeof xp === 'number' ? xp : 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (safeXP >= LEVELS[i].min && safeXP <= LEVELS[i].max) {
      const nextLevel = i < LEVELS.length - 1 ? LEVELS[i+1] : null;
      let progress = 100;
      if (nextLevel) {
        progress = ((safeXP - LEVELS[i].min) / (nextLevel.min - LEVELS[i].min)) * 100;
      }
      return {
        ...LEVELS[i],
        nextLevel,
        progress: Math.min(Math.max(progress, 0), 100)
      };
    }
  }
  return { ...LEVELS[0], nextLevel: LEVELS[1], progress: 0 };
}

export async function awardXP(userId, amount) {
  try {
    const user = await getUser(userId);
    if (!user) return null;
    
    const currentXP = user.xp || 0;
    const newXP = currentXP + amount;
    
    const currentLevel = getLevelDetails(currentXP);
    const newLevel = getLevelDetails(newXP);
    
    const leveledUp = newLevel.name !== currentLevel.name;
    
    await internalUpdateUser(userId, { xp: newXP });
    
    return { newXP, leveledUp, newLevel };
  } catch (error) {
    console.error("Failed to award XP:", error);
    return null;
  }
}
