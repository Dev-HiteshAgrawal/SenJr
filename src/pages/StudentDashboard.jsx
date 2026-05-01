import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllSessions, where, updateSession, updateUser, internalUpdateUser, getUser, getDocuments, COLLECTIONS, updateDocument } from '../lib/firestore';
import { auth, db } from '../lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, query, getDocs, collection } from 'firebase/firestore';
import UnreadBadge from '../components/UnreadBadge';
import VideoCall from '../components/VideoCall';
import { getLevelDetails, awardXP } from '../lib/xpHelpers';
import { checkAndAwardBadges, getBadgeById } from '../lib/badgeHelpers';
import { checkAndProcessMisses } from '../lib/missTracker';
import BadgeGrid from '../components/BadgeGrid';
import BadgePopup from '../components/BadgePopup';
import { COURSES } from '../lib/coursesData';
import { generateAndDownloadCertificate } from '../lib/certificateHelpers';
import { useNotification } from '../contexts/NotificationContext';
import {
  STUDY_ROOMS,
  buildFriendStandings,
  buildMemoryInsights,
  buildNextBestAction,
  buildStudyScore,
} from '../lib/studentOS';
import './StudentDashboard.css';

function canJoin(session) {
  try {
    const dateStr = session.date;
    const timeStr = session.time;
    if (!dateStr || !timeStr) return false;
    // Build ISO-8601 string so Date parses in local time
    const sessionStart = new Date(dateStr + 'T' + timeStr);
    const durationMinutes = session.durationMinutes || 60;
    const sessionEnd = new Date(sessionStart.getTime() + durationMinutes * 60 * 1000);
    const now = new Date();
    const minutesBeforeStart = (sessionStart - now) / 60000;
    // Allow joining up to 60 minutes early, and anytime until session ends
    return minutesBeforeStart <= 60 && now <= sessionEnd;
  } catch (e) {
    return false;
  }
}

// Utility function to get YYYY-MM-DD in local time
function toLocalDateString(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
}

export default function StudentDashboard() {
  const { userProfile, currentUser } = useAuth();
  const { notifyError, notifySuccess, notifyInfo } = useNotification();
  
  // Format current date: e.g., "Monday, October 12"
  const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString('en-US', dateOptions);

  const displayName = userProfile?.displayName || currentUser?.displayName || 'Student';

  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [uniqueMentors, setUniqueMentors] = useState([]);
  const [pendingHomework, setPendingHomework] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  
  useEffect(() => {
    async function fetchFriendsAndRequests() {
      if (userProfile?.friends && userProfile.friends.length > 0) {
        try {
          const friendIds = userProfile.friends.slice(0, 10);
          const q = query(collection(db, 'users'), where('__name__', 'in', friendIds));
          const snapshot = await getDocs(q);
          const friendsData = [];
          snapshot.forEach(docSnap => {
            friendsData.push({ id: docSnap.id, ...docSnap.data() });
          });
          setFriends(friendsData);
        } catch (err) {
          console.error("Error fetching friends:", err);
        }
      }
      
      if (userProfile?.friendRequests && userProfile.friendRequests.length > 0) {
        try {
          const requestIds = userProfile.friendRequests.slice(0, 10);
          const q = query(collection(db, 'users'), where('__name__', 'in', requestIds));
          const snapshot = await getDocs(q);
          const reqData = [];
          snapshot.forEach(docSnap => {
            reqData.push({ id: docSnap.id, ...docSnap.data() });
          });
          setFriendRequests(reqData);
        } catch (err) {
          console.error("Error fetching friend requests:", err);
        }
      } else {
        setFriendRequests([]);
      }
    }
    fetchFriendsAndRequests();
  }, [userProfile?.friends, userProfile?.friendRequests]);
  
  const [showVideo, setShowVideo] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [sessionToReview, setSessionToReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  
  const [showBrokenAlert, setShowBrokenAlert] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(null);
  const [badgePopupQueue, setBadgePopupQueue] = useState([]);

  // Check badges on profile load
  useEffect(() => {
    if (currentUser?.uid && userProfile) {
      checkAndAwardBadges(currentUser.uid).then(newBadges => {
        if (newBadges.length > 0) {
          setBadgePopupQueue(newBadges.map(b => b.id));
        }
      });
    }
  }, [currentUser?.uid, userProfile?.totalSessionsCompleted, userProfile?.streak, userProfile?.homeworkCompleted]);

  const currentXP = userProfile?.xp || 0;
  const levelDetails = getLevelDetails(currentXP);

  useEffect(() => {
    if (userProfile && currentUser) {
       const todayStr = toLocalDateString(new Date());
       const yesterday = new Date();
       yesterday.setDate(yesterday.getDate() - 1);
       const yesterdayStr = toLocalDateString(yesterday);

       const activeDays = userProfile.activeDays || [];
       let currentStreak = 0;
       let isBroken = false;

       let checkDate = new Date();
       let checkStr = toLocalDateString(checkDate);
       
       if (!activeDays.includes(todayStr) && !activeDays.includes(yesterdayStr)) {
          if (userProfile.streak > 0) {
             isBroken = true;
          }
          currentStreak = 0;
       } else {
          if (!activeDays.includes(todayStr)) {
             checkDate.setDate(checkDate.getDate() - 1);
             checkStr = toLocalDateString(checkDate);
          }
          while (activeDays.includes(checkStr)) {
             currentStreak++;
             checkDate.setDate(checkDate.getDate() - 1);
             checkStr = toLocalDateString(checkDate);
          }
       }

       if (currentStreak !== (userProfile.streak || 0) || isBroken) {
          internalUpdateUser(currentUser.uid, { streak: currentStreak });
          if (isBroken) setShowBrokenAlert(true);
          
          if (currentStreak > 0 && [7, 30, 100].includes(currentStreak) && currentStreak > (userProfile.lastMilestone || 0)) {
             setShowCelebration(true);
             internalUpdateUser(currentUser.uid, { lastMilestone: currentStreak });
             
             const bonus = currentStreak === 7 ? 200 : 500;
             awardXP(currentUser.uid, bonus).then(res => {
                if (res && res.leveledUp) setShowLevelUp(res.newLevel);
             });
          }
       }
    }
  }, [userProfile, currentUser]);

  useEffect(() => {
    if (currentUser?.uid) {
      async function fetchSessions() {
        try {
          // Wait for miss processing first to clean up missed items
          await checkAndProcessMisses(currentUser.uid);

          const data = await getAllSessions(where('studentId', '==', currentUser.uid));
          const activeSessions = data.filter((s) => s.status === 'upcoming');
          const doneSessions = data
            .filter((s) => s.status === 'completed')
            .sort((a, b) => {
              const aTime = new Date(a.completedAt || a.updatedAt || a.date || 0).getTime();
              const bTime = new Date(b.completedAt || b.updatedAt || b.date || 0).getTime();
              return bTime - aTime;
            });
          setUpcomingSessions(activeSessions);
          setCompletedSessions(doneSessions);

          const mentorsMap = new Map();
          data.forEach(s => {
            if (s.mentorId && s.mentorName) {
              mentorsMap.set(s.mentorId, { id: s.mentorId, name: s.mentorName });
            }
          });
          setUniqueMentors(Array.from(mentorsMap.values()));
        } catch (err) {
          console.error("Failed to load sessions:", err);
          notifyError("Failed to load your sessions. Please refresh.");
        }
      }
      fetchSessions();

      async function fetchHomework() {
        try {
          const hw = await getDocuments(COLLECTIONS.HOMEWORK, where('studentId', '==', currentUser.uid), where('status', '==', 'pending'));
          setPendingHomework(hw);
        } catch (err) {
          console.error("Failed to load homework:", err);
        }
      }
      fetchHomework();

      async function fetchCertificates() {
        try {
          const certs = await getDocuments('certificates', where('userId', '==', currentUser.uid));
          setCertificates(certs);
        } catch (err) {
          console.error("Failed to load certificates:", err);
        }
      }
      fetchCertificates();
    }
  }, [currentUser?.uid]);

  // Calculate Daily Focus Progress
  const todayStr = toLocalDateString(new Date());
  const sessionsToday = [...upcomingSessions, ...completedSessions].filter(s => s.date === todayStr);
  const completedTodayCount = completedSessions.filter(s => s.date === todayStr).length;
  const homeworkPendingToday = pendingHomework.length;
  // We don't easily have 'completed homework today' count without searching all homework docs, 
  // so we'll use a heuristic: Focus = (sessions completed today) + (1 if no pending homework)
  const totalFocusItems = (sessionsToday.length || 0) + (homeworkPendingToday > 0 ? 1 : 0);
  const finishedFocusItems = completedTodayCount + (homeworkPendingToday === 0 ? 1 : 0);
  const focusProgress = totalFocusItems > 0 ? Math.round((finishedFocusItems / totalFocusItems) * 100) : 100;

  // Streak Variables
  const streak = userProfile?.streak || 0;
  let fireSize = '2rem';
  if (streak >= 7 && streak <= 29) fireSize = '3rem';
  else if (streak >= 30) fireSize = '4.5rem';

  let streakSubtitle = "Keep it going! 💪";
  if (streak >= 7) streakSubtitle = "You're on fire! 🔥🔥";
  if (streak === 0) streakSubtitle = "Time to start a new streak! 🚀";

  // Streak Calendar (last 30 days)
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
     const d = new Date();
     d.setDate(d.getDate() - i);
     last30Days.push(toLocalDateString(d));
  }

  const recordActivity = async () => {
    if (!currentUser) return;
    const todayStr = toLocalDateString(new Date());
    const activeDays = userProfile?.activeDays || [];
    if (!activeDays.includes(todayStr)) {
       const newActiveDays = [...activeDays, todayStr];
       await updateUser(currentUser.uid, { activeDays: newActiveDays });
    }
  };

  const lowerMissCount = async () => {
    if (!currentUser) return;
    const currentMissCount = userProfile?.miss_count || 0;
    if (currentMissCount > 0) {
      await internalUpdateUser(currentUser.uid, { miss_count: currentMissCount - 1 });
    }
  };

  const handleAcceptFriend = async (requesterId) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const requesterRef = doc(db, 'users', requesterId);
      
      await updateDoc(userRef, {
        friendRequests: arrayRemove(requesterId),
        friends: arrayUnion(requesterId)
      });
      
      await updateDoc(requesterRef, {
        friends: arrayUnion(currentUser.uid),
        outgoingFriendRequests: arrayRemove(currentUser.uid)
      });
      
      setFriendRequests(prev => prev.filter(r => r.id !== requesterId));
    } catch (err) {
      console.error("Failed to accept friend request:", err);
    }
  };

  const handleDeclineFriend = async (requesterId) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        friendRequests: arrayRemove(requesterId)
      });
      await updateDoc(doc(db, 'users', requesterId), {
        outgoingFriendRequests: arrayRemove(currentUser.uid)
      });
      setFriendRequests(prev => prev.filter(r => r.id !== requesterId));
    } catch (err) {
      console.error("Failed to decline friend request:", err);
    }
  };

  const joinSession = (session) => {
    setActiveSession(session);
    setShowVideo(true);
  };

  const endSession = async () => {
    const session = activeSession;
    setShowVideo(false);
    if (!session) return;

    try {
      await updateSession(session.id, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to complete session', err);
    }

    setSessionToReview(session);
    setShowReviewModal(true);
    setUpcomingSessions(prev => prev.filter(s => s.id !== session.id));
    setActiveSession(null);
  };

  const handleDownloadStudentCertificate = async () => {
    if (!currentUser) return;
    if (completedSessions.length < 1) {
      notifyInfo('Complete at least one session to unlock your certificate.');
      return;
    }
    try {
      const latestSession = completedSessions[0];
      await generateAndDownloadCertificate({
        type: 'student',
        studentName: displayName,
        mentorName: latestSession?.mentorName || 'Senjr Mentor',
        subject: latestSession?.sessionType || 'Mentorship Programme',
        duration: `${completedSessions.length} Session${completedSessions.length > 1 ? 's' : ''}`,
        sessionsCompleted: completedSessions.length,
        sessionsTotal: completedSessions.length,
        userId: currentUser.uid,
        sourceId: latestSession?.id || currentUser.uid,
      });
    } catch (err) {
      console.error('Failed to generate student certificate:', err);
      notifyError('Could not generate certificate. Please try again.');
    }
  };

  const submitReview = async () => {
    if (!sessionToReview) return;
    try {
      // Update session with rating
      await updateSession(sessionToReview.id, {
        rating,
        reviewText,
        status: 'completed'
      });

      // Update the mentor's profile
      const mentorDoc = await getUser(sessionToReview.mentorId);
      if (mentorDoc) {
        const currentReviews = mentorDoc.reviews || [];
        const newReview = {
          rating,
          text: reviewText,
          studentName: currentUser?.displayName || 'Student',
          date: new Date().toISOString()
        };
        const updatedReviews = [...currentReviews, newReview];
        
        const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = (totalRating / updatedReviews.length).toFixed(1);
        const studentIdsHelped = Array.isArray(mentorDoc.studentIdsHelped) ? mentorDoc.studentIdsHelped : [];
        const nextStudentIdsHelped = studentIdsHelped.includes(currentUser.uid)
          ? studentIdsHelped
          : [...studentIdsHelped, currentUser.uid];

        await updateUser(sessionToReview.mentorId, {
          reviews: updatedReviews,
          averageRating: parseFloat(averageRating),
          totalReviews: updatedReviews.length,
          totalSessionsCompleted: (mentorDoc.totalSessionsCompleted || 0) + 1,
          studentIdsHelped: nextStudentIdsHelped,
          uniqueStudentsHelped: nextStudentIdsHelped.length
        });
      }

        // Record this session as an activity for the daily streak!
        await recordActivity();
        await lowerMissCount();

        // Award XP
        let studentAward = 50;
        if (!userProfile?.totalSessionsCompleted) {
           studentAward += 100; // First session bonus
        }
        await updateUser(currentUser.uid, { 
           totalSessionsCompleted: (userProfile?.totalSessionsCompleted || 0) + 1 
        });
        
        const res = await awardXP(currentUser.uid, studentAward);
        if (res && res.leveledUp) {
           setShowLevelUp(res.newLevel);
        }

        if (rating === 5) {
           await awardXP(sessionToReview.mentorId, 100);
        }

      setShowReviewModal(false);
      setSessionToReview(null);
      
      // Check for new badges after completing a session
      const newBadges = await checkAndAwardBadges(currentUser.uid);
      if (newBadges.length > 0) {
        setBadgePopupQueue(prev => [...prev, ...newBadges.map(b => b.id)]);
      }

      // Remove from upcoming list
      setUpcomingSessions(prev => prev.filter(s => s.id !== sessionToReview.id));
      notifySuccess("Review submitted! XP awarded.");
    } catch (err) {
      console.error("Failed to submit review", err);
      notifyError("Failed to submit your review.");
    }
  };

  const handleCompleteHomework = async (hwId) => {
    try {
      // 1. Mark homework as completed
      await updateDocument(COLLECTIONS.HOMEWORK, hwId, { status: 'completed' });
      setPendingHomework(prev => prev.filter(h => h.id !== hwId));

      // 2. Record daily activity streak
      await recordActivity();
      await lowerMissCount();

      // 3. Update homework completed count
      await updateUser(currentUser.uid, {
        homeworkCompleted: (userProfile?.homeworkCompleted || 0) + 1
      });

      // 4. Award XP for homework
      const res = await awardXP(currentUser.uid, 30);
      if (res && res.leveledUp) {
         setShowLevelUp(res.newLevel);
      }

      // 5. Check badges
      const newBadges = await checkAndAwardBadges(currentUser.uid);
      if (newBadges.length > 0) {
        setBadgePopupQueue(prev => [...prev, ...newBadges.map(b => b.id)]);
      }
      notifySuccess("Target cleared! XP earned.");
    } catch (err) {
      console.error("Failed to complete homework:", err);
      notifyError("Failed to mark task as completed.");
    }
  };

  const savedCourses = userProfile?.savedCourses || [];

  const studyScore = useMemo(
    () => buildStudyScore(userProfile || {}, [...upcomingSessions, ...completedSessions], pendingHomework),
    [userProfile, upcomingSessions, completedSessions, pendingHomework]
  );

  const memoryInsight = useMemo(
    () => buildMemoryInsights(userProfile || {}, completedSessions, pendingHomework),
    [userProfile, completedSessions, pendingHomework]
  );

  const nextBestAction = useMemo(
    () => buildNextBestAction({
      profile: userProfile || {},
      upcomingSessions,
      pendingHomework,
      memory: memoryInsight,
    }),
    [userProfile, upcomingSessions, pendingHomework, memoryInsight]
  );

  const friendStandings = useMemo(
    () => buildFriendStandings(userProfile || {}, friends),
    [userProfile, friends]
  );

  const featuredRooms = STUDY_ROOMS.slice(0, 3);

  const handleUpdateCourseStatus = async (courseId, currentStatus) => {
    const statusCycle = {
      'Not Started yet': 'Currently Doing',
      'Currently Doing': 'Completed! 🎓',
      'Completed! 🎓': 'Not Started yet'
    };
    const newStatus = statusCycle[currentStatus] || 'Not Started yet';
    
    const updatedCourses = savedCourses.map(sc => 
      sc.id === courseId ? { ...sc, status: newStatus } : sc
    );
    
    await updateUser(currentUser.uid, { savedCourses: updatedCourses });

    if (newStatus === 'Completed! 🎓') {
      const newCompletedCount = (userProfile?.coursesCompleted || 0) + 1;
      await updateUser(currentUser.uid, { coursesCompleted: newCompletedCount });
      
      const res = await awardXP(currentUser.uid, 150);
      if (res && res.leveledUp) {
         setShowLevelUp(res.newLevel);
      }

      const newBadges = await checkAndAwardBadges(currentUser.uid);
      if (newBadges.length > 0) {
        setBadgePopupQueue(prev => [...prev, ...newBadges.map(b => b.id)]);
      }
    }
  };

  if (userProfile?.banned) {
    const banUntil = new Date(userProfile.ban_until);
    const now = new Date();
    let diffMs = banUntil - now;
    if (diffMs < 0) diffMs = 0;
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <div className="page-container ban-overlay animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="ban-card card" style={{ maxWidth: '600px', textAlign: 'center', padding: '3rem 2rem' }}>
          <span className="ban-icon" style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🔒</span>
          <h1 className="ban-title" style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', color: '#ff5c5c', marginBottom: '1rem' }}>Study Break Mode</h1>
          <p className="ban-message" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            You've missed too many tasks. Sometimes we all need a reset. Use these 7 days to reflect, plan, and come back stronger.
          </p>
          
          <div className="ban-timer" style={{ background: 'rgba(255, 92, 92, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255, 92, 92, 0.3)', marginBottom: '2rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            You'll be back in: <br/>
            <strong style={{ color: '#ff5c5c', fontSize: '1.5rem', fontFamily: 'var(--font-mono)' }}>{days}d {hours}h {minutes}m</strong>
          </div>

          <blockquote className="ban-quote" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '2.5rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1rem', textAlign: 'left' }}>
            "Rest and self-care are so important. When you take time to replenish your spirit, it allows you to serve from the overflow."
          </blockquote>

          <div className="ban-checklist" style={{ textAlign: 'left', background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>While you're away, try to:</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><input type="checkbox" style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} /> <span style={{ color: 'var(--text-secondary)' }}>Write your study plan</span></li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><input type="checkbox" style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} /> <span style={{ color: 'var(--text-secondary)' }}>Sleep 8 hours a night</span></li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><input type="checkbox" style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} /> <span style={{ color: 'var(--text-secondary)' }}>Talk to your mentor</span></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container dashboard-page">
    <div className="os-dashboard-container animate-fade-in">
      
      {/* ⚠️ Warning Banners (Keep existing logic, style updated) */}
      {(userProfile?.miss_count || 0) >= 10 ? (
        <div className="os-alert critical">
          <span>🚨</span> <p><strong>10 misses</strong> — you're at risk of a study break. Complete 3 tasks to reduce your count.</p>
        </div>
      ) : (userProfile?.miss_count || 0) >= 5 ? (
        <div className="os-alert warning">
          <span>⚠️</span> <p><strong>5 misses!</strong> Your mentor can see this. Get back on track.</p>
        </div>
      ) : (userProfile?.miss_count || 0) >= 3 ? (
        <div className="os-alert caution">
          <span>⚠️</span> <p>You've missed 3 tasks. Stay consistent — your mentor has been notified.</p>
        </div>
      ) : null}

      <div className="os-layout">
        
        {/* Main Workspace Column */}
        <div className="os-main">
          
          {/* AI Coach Greeting Header */}
          <header className="os-header card">
            <div className="os-header-text">
              <p className="os-date">{currentDate}</p>
              <h1 className="os-title">Good to see you, {displayName}.</h1>
              <div className="os-ai-suggestion">
                <span className="ai-sparkle">✨</span>
                <p>
                  <strong>AI Coach:</strong>{' '}
                  {upcomingSessions.length > 0
                    ? `You have a session at ${upcomingSessions[0].time}. A good moment to gather your questions.`
                    : pendingHomework.length > 0
                    ? `You have ${pendingHomework.length} task${pendingHomework.length > 1 ? 's' : ''} lined up. Let's clear them to keep your rhythm.`
                    : userProfile?.streak > 0
                    ? `${userProfile.streak} days strong. Keep the momentum going by exploring the community.`
                    : "Ready when you are. Pick a small goal to start your rhythm today."}
                </p>
              </div>
            </div>
            <div className="os-focus-ring">
              <svg viewBox="0 0 36 36" className="circular-chart orange">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle" strokeDasharray={`${focusProgress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="ring-text">
                <span className="ring-value">{focusProgress}%</span>
                <span className="ring-label">Today's Rhythm</span>
              </div>
            </div>
          </header>

          <section className="os-command-grid" aria-label="Study operating system overview">
            <div className="os-command-card priority">
              <span className="os-card-kicker">Next best action</span>
              <h2>{nextBestAction.title}</h2>
              <p>{nextBestAction.detail}</p>
              <Link to={nextBestAction.path} className="os-mini-action">{nextBestAction.action}</Link>
            </div>
            <div className="os-command-card">
              <span className="os-card-kicker">Study score</span>
              <strong>{studyScore.studyScore}</strong>
              <p>{studyScore.momentum}% momentum today</p>
              <div className="os-meter"><span style={{ width: `${studyScore.momentum}%` }} /></div>
            </div>
            <div className="os-command-card">
              <span className="os-card-kicker">Memory</span>
              <strong>{memoryInsight.recallScore}</strong>
              <p>{memoryInsight.revisionLabel} · {memoryInsight.primarySubject}</p>
              <div className="os-meter mint"><span style={{ width: `${memoryInsight.retentionEstimate}%` }} /></div>
            </div>
            <div className="os-command-card">
              <span className="os-card-kicker">Consistency</span>
              <strong>{studyScore.consistency}%</strong>
              <p>{streak > 0 ? `${streak} day rhythm` : 'Start with one clean block'}</p>
              <div className="os-meter purple"><span style={{ width: `${studyScore.consistency}%` }} /></div>
            </div>
          </section>

          <div className="os-grid-2">
            {/* Today's Target (Pending Homework) */}
            <section className="os-section card">
              <div className="os-section-header">
                <h2>Today's Goals</h2>
                <span className="badge-count">{pendingHomework.length} remaining</span>
              </div>
              
              {pendingHomework.length > 0 ? (
                <div className="os-task-list">
                  {pendingHomework.map(hw => (
                    <div key={hw.id} className="os-task-item">
                      <div className="task-info">
                        <h3>{hw.title}</h3>
                        <p>Assigned by {hw.mentorName} • Due: {new Date(hw.dueDate).toLocaleDateString()}</p>
                      </div>
                      <button className="os-btn-check" onClick={() => handleCompleteHomework(hw.id)}>
                        <div className="check-circle"></div>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="os-empty-state">
                  <div className="empty-icon">✅</div>
                  <p>All goals cleared today. Great rhythm.</p>
                </div>
              )}
            </section>

            {/* Upcoming Sessions */}
            <section className="os-section card">
              <div className="os-section-header">
                <h2>Upcoming Sessions</h2>
              </div>
              
              {upcomingSessions.length > 0 ? (
                <div className="os-session-list">
                  {upcomingSessions.map(session => (
                    <div key={session.id} className="os-session-item">
                      <div className="session-time-block">
                        <span className="s-time">{session.time}</span>
                        <span className="s-date">{session.date}</span>
                      </div>
                      <div className="session-details">
                        <h4>{session.mentorName}</h4>
                        <p>{session.sessionType}</p>
                        {canJoin(session) ? (
                          <button className="os-btn-join glow-btn" onClick={() => joinSession(session)}>
                            Join Room
                          </button>
                        ) : (
                          <span className="s-waiting">Waiting...</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="os-empty-state">
                  <div className="empty-icon">🗓️</div>
                  <p>Your upcoming sessions will appear here.</p>
                  <Link to="/find-mentors" className="os-link">Explore Mentors →</Link>
                </div>
              )}
            </section>
          </div>

          {/* Quick Actions & Courses */}
          <section className="os-section card">
            <h2>Quick Actions</h2>
            <div className="os-quick-actions">
              <Link to="/ai-tutor" className="os-qa-btn">
                <span className="qa-icon">🤖</span>
                <div>
                  <h4>AI Study Space</h4>
                  <p>Work through a tricky concept.</p>
                </div>
              </Link>
              <Link to="/free-courses" className="os-qa-btn">
                <span className="qa-icon">📚</span>
                <div>
                  <h4>Explore Courses</h4>
                  <p>Pick up a new skill.</p>
                </div>
              </Link>
              <Link to="/find-mentors" className="os-qa-btn">
                <span className="qa-icon">🎓</span>
                <div>
                  <h4>Find a Mentor</h4>
                  <p>Book a 1-on-1 session.</p>
                </div>
              </Link>
              <button
                type="button"
                className="os-qa-btn"
                onClick={handleDownloadStudentCertificate}
                disabled={completedSessions.length < 1}
                title={completedSessions.length < 1 ? 'Complete one session to unlock' : 'Download your certificate'}
              >
                <span className="qa-icon">📜</span>
                <div>
                  <h4>Your Certificates</h4>
                  <p>{completedSessions.length < 1 ? 'Keep going to unlock your first certificate.' : `Issued (${certificates.length} saved).`}</p>
                </div>
              </button>
              <Link to="/study-rooms" className="os-qa-btn">
                <span className="qa-icon">LIVE</span>
                <div>
                  <h4>Study Rooms</h4>
                  <p>Join students focusing right now.</p>
                </div>
              </Link>
            </div>
          </section>

          <section className="os-section card">
            <div className="os-section-header">
              <h2>Live Study Rooms</h2>
              <Link to="/study-rooms" className="os-link">Open rooms</Link>
            </div>
            <div className="os-room-strip">
              {featuredRooms.map(room => (
                <Link to="/study-rooms" key={room.id} className={`os-room-chip theme-${room.theme}`}>
                  <span>{room.icon}</span>
                  <div>
                    <strong>{room.name}</strong>
                    <p>{room.activeUsers} focusing · {room.mode}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>

        {/* Right Sidebar: Social & Stats Loop */}
        <aside className="os-sidebar">
          
          {/* Identity & Level */}
          <div className="os-profile-card card">
            <div className="os-avatar-ring">
              <div className="os-avatar">{displayName.charAt(0)}</div>
            </div>
            <h2>{displayName}</h2>
            <p className="os-level-text">{levelDetails.name}</p>
            
            <div className="os-stats-mini">
              <div className="stat">
                <span>🔥</span>
                <strong>{streak}</strong>
                <label>Streak</label>
              </div>
              <div className="stat">
                <span>🏅</span>
                <strong>{(userProfile?.badges || []).length}</strong>
                <label>Badges</label>
              </div>
              <div className="stat">
                <span>🎯</span>
                <strong>{userProfile?.totalSessionsCompleted || 0}</strong>
                <label>Sessions</label>
              </div>
            </div>

            {levelDetails.nextLevel && (
              <div className="os-xp-bar">
                <div className="xp-fill" style={{ width: `${levelDetails.progress}%` }}></div>
                <span className="xp-text">{currentXP} / {levelDetails.nextLevel.min} XP</span>
              </div>
            )}
          </div>

          {/* Activity / Streak Graph */}
          <div className="os-streak-card card">
            <h3>Consistency Loop</h3>
            <div className="streak-dots">
              {last30Days.slice(-14).map((dayStr, idx) => {
                const isCompleted = userProfile?.activeDays?.includes(dayStr);
                const isToday = dayStr === toLocalDateString(new Date());
                return (
                  <div 
                    key={idx} 
                    className={`dot ${isCompleted ? 'active' : ''} ${isToday ? 'today' : ''}`}
                    title={dayStr}
                  ></div>
                )
              })}
            </div>
          </div>

          <div className="os-memory-card card">
            <h3>Revision Signal</h3>
            <div className="memory-score-row">
              <span>{memoryInsight.retentionEstimate}%</span>
              <div>
                <strong>{memoryInsight.confidenceLabel}</strong>
                <p>{memoryInsight.weaknessProbability}% weakness probability</p>
              </div>
            </div>
            <p className="memory-copy">
              {memoryInsight.revisionDue
                ? `${memoryInsight.primarySubject} should be recalled today before it fades.`
                : `${memoryInsight.primarySubject} is stable. Keep it warm with a short check-in.`}
            </p>
          </div>

          {/* Friend Requests (NEW) */}
          {friendRequests.length > 0 && (
            <div className="os-requests-card card">
              <h3>Study Clan Requests</h3>
              <div className="os-friends-list">
                {friendRequests.map(req => (
                  <div key={req.id} className="friend-item request-item">
                    <div className="friend-avatar">{req.displayName?.charAt(0) || 'S'}</div>
                    <div className="friend-info">
                      <h4>{req.displayName}</h4>
                      <p>Wants to study together</p>
                    </div>
                    <div className="request-actions">
                      <button onClick={() => handleAcceptFriend(req.id)} className="btn-accept" title="Accept">✓</button>
                      <button onClick={() => handleDeclineFriend(req.id)} className="btn-decline" title="Decline">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social / Friend Activity (NEW) */}
          <div className="os-social-card card">
            <h3>Study Clan</h3>
            {friends.length > 0 ? (
              <div className="os-friends-list">
                {friends.map(friend => (
                  <div key={friend.id} className="friend-item">
                    <div className="friend-avatar">{friend.displayName?.charAt(0) || 'S'}</div>
                    <div className="friend-info">
                      <h4>{friend.displayName}</h4>
                      <p>🔥 {friend.streak || 0} days strong</p>
                    </div>
                    <Link to={`/student/${friend.id}`} className="friend-link">→</Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="os-empty-state small">
                <p>Study alone, fail alone. Build your clan.</p>
                <Link to="/community" className="os-link">Find Friends</Link>
              </div>
            )}
          </div>

          <div className="os-social-card card">
            <h3>Friend Ranking</h3>
            <div className="os-friends-list">
              {friendStandings.map(friend => (
                <div key={friend.id} className={`friend-rank-item ${friend.isMe ? 'me' : ''}`}>
                  <span className="friend-rank">#{friend.rank}</span>
                  <div className="friend-info">
                    <h4>{friend.displayName}</h4>
                    <p>{friend.weeklyXP} XP this week · {friend.streak} day streak</p>
                  </div>
                  {friend.isOnline && <span className="online-pill">Live</span>}
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>
      </div>

      {badgePopupQueue.length > 0 && (
        <BadgePopup 
          badgeId={badgePopupQueue[0]} 
          onClose={() => setBadgePopupQueue(prev => prev.slice(1))}
        />
      )}

      {showVideo && activeSession && (
        <VideoCall
          roomName={`senjr-${activeSession.id}`}
          participantName={auth.currentUser?.displayName || auth.currentUser?.email || 'User'}
          participantIdentity={auth.currentUser?.uid || `user-${Date.now()}`}
          onSessionEnd={endSession}
        />
      )}

      {showReviewModal && sessionToReview && (
        <div className="completion-overlay animate-fade-in">
          <div className="completion-modal card animate-slide-up">
            <div className="completion-icon">🎉</div>
            <h3>Session Completed!</h3>
            <p>How was your session with {sessionToReview.mentorName}?</p>
            
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  className={`star-btn ${rating >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea 
              className="review-input" 
              placeholder="Leave a one-line review..."
              rows="2"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <button 
              className="btn-primary full-width glow-btn"
              disabled={rating === 0}
              onClick={submitReview}
            >
              Submit Rating
            </button>
          </div>
        </div>
      )}

      {showBrokenAlert && (
        <div className="completion-overlay animate-fade-in" style={{ zIndex: 3000 }}>
          <div className="completion-modal card animate-slide-up">
            <div className="completion-icon">😔</div>
            <h3>Streak Reset</h3>
            <p>Streak reset. But every champion has a comeback. Start again today! 💪</p>
            <button className="btn-primary full-width mt-4" onClick={() => setShowBrokenAlert(false)}>Let's Go!</button>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="completion-overlay animate-fade-in" style={{ zIndex: 3000 }}>
          <div className="completion-modal card animate-slide-up" style={{ border: '2px solid var(--accent-saffron)' }}>
            <div className="completion-icon" style={{ animation: 'glowPulse 2s infinite alternate' }}>🎉🔥🏆</div>
            <h3>Amazing Milestone!</h3>
            <p>You hit a {streak} day streak! Keep the momentum going!</p>
            <button className="btn-primary full-width mt-4 glow-btn" onClick={() => setShowCelebration(false)}>Keep it up!</button>
          </div>
        </div>
      )}

      {showLevelUp && (
        <div className="completion-overlay animate-fade-in" style={{ zIndex: 3000 }}>
          <div className="completion-modal card animate-slide-up" style={{ border: '2px solid var(--accent-saffron)' }}>
            <div className="completion-icon" style={{ fontSize: '5rem', animation: 'glowPulse 2s infinite alternate' }}>{showLevelUp.icon}</div>
            <h3>Level Up!</h3>
            <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>You've reached <strong style={{ color: 'var(--accent-saffron)' }}>{showLevelUp.name}</strong>!</p>
            <button className="btn-primary full-width mt-4 glow-btn" onClick={() => setShowLevelUp(null)}>Awesome!</button>
          </div>
        </div>
      )}
    </div>
  );
}
