import { getAllSessions, where, updateSession, getDocuments, COLLECTIONS, updateDocument, internalUpdateUser, getUser } from './firestore';

export async function checkAndProcessMisses(userId) {
  try {
    const profile = await getUser(userId);
    if (!profile) return 0;

    let newMisses = 0;
    const now = new Date();

    // 1. Check Sessions
    const sessions = await getAllSessions(where('studentId', '==', userId), where('status', '==', 'upcoming'));
    for (const session of sessions) {
      if (!session.date || !session.time) continue;
      const [hours, minutes] = session.time.split(':').map(Number);
      const sessionDate = new Date(session.date);
      sessionDate.setHours(hours, minutes, 0, 0);
      
      const diffMinutes = (now - sessionDate) / (1000 * 60);
      
      // Missed if 15 minutes past start time
      if (diffMinutes > 15) {
        newMisses++;
        await updateSession(session.id, { status: 'missed' });
      }
    }

    // 2. Check Homework
    const homeworkTasks = await getDocuments(COLLECTIONS.HOMEWORK, where('studentId', '==', userId), where('status', '==', 'pending'));
    for (const hw of homeworkTasks) {
      if (!hw.dueDate) continue;
      const dueDate = new Date(hw.dueDate);
      dueDate.setHours(23, 59, 59, 999); // Due at end of the day

      const diffHours = (now - dueDate) / (1000 * 60 * 60);

      // Missed if more than 24 hours past the due date deadline
      if (diffHours > 24) {
        newMisses++;
        await updateDocument(COLLECTIONS.HOMEWORK, hw.id, { status: 'missed' });
      }
    }

    let currentMisses = profile.miss_count || 0;

    // Handle existing ban state
    if (profile.banned && profile.ban_until) {
      const banUntil = new Date(profile.ban_until);
      if (now > banUntil) {
        // Unban
        await internalUpdateUser(userId, { banned: false, ban_until: null, miss_count: 0 });
        return 0; // Fresh start
      } else {
        // Still banned, don't accrue more misses
        return currentMisses;
      }
    }

    if (newMisses > 0) {
      currentMisses += newMisses;
    }

    // Check Ban Threshold
    if (currentMisses >= 10 && !profile.banned) {
      const banUntil = new Date();
      banUntil.setDate(banUntil.getDate() + 7); // Ban for 7 days
      await internalUpdateUser(userId, {
        miss_count: currentMisses, 
        banned: true, 
        ban_until: banUntil.toISOString() 
      });
      return currentMisses;
    }

    // Save normally if not banned
    if (newMisses > 0) {
      await internalUpdateUser(userId, { miss_count: currentMisses });
    }

    return currentMisses;
  } catch (error) {
    console.error("Error processing misses:", error);
    return 0;
  }
}
