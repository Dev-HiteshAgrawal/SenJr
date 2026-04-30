import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllSessions, where, updateSession, updateUser, getUser, getDocuments, COLLECTIONS, updateDocument } from '../lib/firestore';
import { auth } from '../lib/firebase';
import UnreadBadge from '../components/UnreadBadge';
import VideoCall from '../components/VideoCall';
import { getLevelDetails, awardXP } from '../lib/xpHelpers';
import { checkAndAwardBadges, getBadgeById } from '../lib/badgeHelpers';
import { checkAndProcessMisses } from '../lib/missTracker';
import BadgeGrid from '../components/BadgeGrid';
import BadgePopup from '../components/BadgePopup';
import { COURSES } from '../lib/coursesData';
import { generateAndDownloadCertificate } from '../lib/certificateHelpers';
import './StudentDashboard.css';

function isJoinable(session) {
  if (session.scheduledAtMs) {
    const now = Date.now();
    const diffMinutes = (session.scheduledAtMs - now) / (1000 * 60);
    return diffMinutes <= 15 && diffMinutes >= -90;
  }
  // Fallback for legacy sessions without scheduledAtMs
  const dateStr = session.date;
  const timeStr = session.time;
  if (!dateStr || !timeStr) return false;
  const [hours, minutes] = timeStr.split(':').map(Number);
  const sessionDate = new Date(dateStr); 
  sessionDate.setHours(hours, minutes, 0, 0);
  const now = new Date();
  const diffMinutes = (sessionDate - now) / (1000 * 60);
  return diffMinutes <= 15 && diffMinutes >= -90;
}

// Utility function to get YYYY-MM-DD in local time
function toLocalDateString(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
}

export default function StudentDashboard() {
  const { userProfile, currentUser } = useAuth();
  
  // Format current date: e.g., "Monday, October 12"
  const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString('en-US', dateOptions);

  const displayName = userProfile?.displayName || currentUser?.displayName || 'Student';

  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [uniqueMentors, setUniqueMentors] = useState([]);
  const [pendingHomework, setPendingHomework] = useState([]);
  const [certificates, setCertificates] = useState([]);
  
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
          updateUser(currentUser.uid, { streak: currentStreak });
          if (isBroken) setShowBrokenAlert(true);
          
          if (currentStreak > 0 && [7, 30, 100].includes(currentStreak) && currentStreak > (userProfile.lastMilestone || 0)) {
             setShowCelebration(true);
             updateUser(currentUser.uid, { lastMilestone: currentStreak });
             
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
          const activeSessions = data.filter(s => s.status === 'upcoming');
          setUpcomingSessions(activeSessions);

          const mentorsMap = new Map();
          data.forEach(s => {
            if (s.mentorId && s.mentorName) {
              mentorsMap.set(s.mentorId, { id: s.mentorId, name: s.mentorName });
            }
          });
          setUniqueMentors(Array.from(mentorsMap.values()));
        } catch (err) {
          console.error("Failed to load sessions:", err);
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
      await updateUser(currentUser.uid, { miss_count: currentMissCount - 1 });
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
    } catch (err) {
      console.error("Failed to submit review", err);
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

    } catch (err) {
      console.error("Failed to complete homework:", err);
    }
  };

  const savedCourses = userProfile?.savedCourses || [];

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
      <div className="dashboard-wrapper animate-fade-in-up">
        
        {/* Miss Warnings */}
        {(userProfile?.miss_count || 0) >= 10 ? (
          <div className="alert-banner" style={{ background: 'rgba(255, 60, 60, 0.1)', border: '1px solid rgba(255, 60, 60, 0.3)', color: '#ff5c5c', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🚨</span>
            <p style={{ margin: 0, fontWeight: 500 }}><strong>10 misses</strong> — you're at risk of a study break. Complete 3 tasks to reduce your count.</p>
          </div>
        ) : (userProfile?.miss_count || 0) >= 5 ? (
          <div className="alert-banner" style={{ background: 'rgba(255, 107, 0, 0.1)', border: '1px solid rgba(255, 107, 0, 0.3)', color: '#FF6B00', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <p style={{ margin: 0, fontWeight: 500 }}><strong>5 misses!</strong> Your mentor can see this. Get back on track.</p>
          </div>
        ) : (userProfile?.miss_count || 0) >= 3 ? (
          <div className="alert-banner" style={{ background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.3)', color: '#ffc107', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <p style={{ margin: 0, fontWeight: 500 }}>You've missed 3 tasks. Stay consistent — your mentor has been notified.</p>
          </div>
        ) : null}

        {/* Welcome Banner */}
        <header className="dashboard-header">
          <div>
            <p className="dashboard-date">{currentDate}</p>
            <h1 className="dashboard-title">
              Welcome back, <span className="highlight">{displayName}</span>! 👋
            </h1>
            <p className="dashboard-subtitle">Ready to level up today?</p>
          </div>
        </header>

        {/* Level & Stats Section */}
        <div className="stats-container">
          <div className="level-card card">
             <div className="level-header">
                <div className="level-icon-large">{levelDetails.icon}</div>
                <div className="level-info">
                   <h2>{levelDetails.name}</h2>
                   <div className="xp-total">{currentXP} <span className="xp-label">Total XP</span></div>
                </div>
             </div>
             {levelDetails.nextLevel && (
                <div className="level-progress-section">
                   <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${levelDetails.progress}%` }}></div>
                   </div>
                   <p className="progress-text">
                      {currentXP} / {levelDetails.nextLevel.min} XP to reach {levelDetails.nextLevel.name}
                   </p>
                </div>
             )}
             {!levelDetails.nextLevel && (
                <p className="progress-text mt-3">You've reached the highest level! 🏆</p>
             )}
          </div>
          
          <div className="hud-stats">
            <div className="hud-card card">
              <span className="hud-icon">🎯</span>
              <div className="hud-info">
                <span className="hud-value">{userProfile?.totalSessionsCompleted || 0}</span>
                <span className="hud-label">Sessions</span>
              </div>
            </div>
            <div className="hud-card card">
              <span className="hud-icon">🔥</span>
              <div className="hud-info">
                <span className="hud-value">{streak}</span>
                <span className="hud-label">Day Streak</span>
              </div>
            </div>
            <div className="hud-card card" style={{ position: 'relative' }}>
              <span className="hud-icon">🏅</span>
              <div className="hud-info">
                <span className="hud-value">{(userProfile?.badges || []).length}</span>
                <span className="hud-label">Badges</span>
              </div>
              {(userProfile?.miss_count || 0) > 0 && (
                 <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff3c3c', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', boxShadow: '0 4px 10px rgba(255, 60, 60, 0.4)' }} title={`${userProfile.miss_count} misses`}>
                   {userProfile.miss_count}
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Grid Content */}
        <div className="dashboard-grid">
          
          <div className="dashboard-column">
            {/* Mentor Section */}
            <section className="dashboard-section">
              <h2 className="section-title">Your Mentors</h2>
              {uniqueMentors.length > 0 ? (
                <div className="mentors-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {uniqueMentors.map(m => (
                    <div key={m.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                           {m.name.charAt(0)}
                         </div>
                         <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{m.name}</h3>
                       </div>
                       <Link 
                         to={`/chat/${currentUser.uid}_${m.id}`} 
                         state={{ otherUser: { displayName: m.name } }}
                         className="btn-secondary btn-sm"
                         style={{ display: 'flex', alignItems: 'center' }}
                       >
                         Message 💬
                         <UnreadBadge chatId={`${currentUser.uid}_${m.id}`} userId={currentUser.uid} />
                       </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-card card">
                  <div className="empty-state-icon">👤</div>
                  <h3>No mentor yet</h3>
                  <p>Get personalized 1-on-1 guidance from a senior who just did it.</p>
                  <Link to="/find-mentors" className="btn-primary mt-3">
                    Find one now →
                  </Link>
                </div>
              )}
            </section>

            {/* Upcoming Sessions */}
            <section className="dashboard-section">
              <h2 className="section-title">Upcoming Sessions</h2>
              {upcomingSessions.length > 0 ? (
                <div className="sessions-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {upcomingSessions.map(session => {
                    const joinable = isJoinable(session);
                    return (
                      <div key={session.id} className="card session-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.5rem 0' }}>Session with {session.mentorName}</h4>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            🗓️ {session.date} at {session.time} • {session.sessionType}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          {joinable ? (
                            <button className="btn-primary glow-btn" onClick={() => joinSession(session)}>
                              Join Session 🎥
                            </button>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Opens at {session.time}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state-card card">
                  <div className="empty-state-icon">🗓️</div>
                  <h3>No sessions scheduled</h3>
                  <p>Book a session with your mentor to clear doubts and get feedback.</p>
                  <Link to="/find-mentors" className="btn-secondary mt-3">
                    Book one now →
                  </Link>
                </div>
              )}
            </section>
          </div>

          <div className="dashboard-column">
            {/* Pending Homework */}
            <section className="dashboard-section">
              <h2 className="section-title">Pending Homework</h2>
              {pendingHomework.length > 0 ? (
                <div className="sessions-list">
                  {pendingHomework.map(hw => (
                    <div key={hw.id} className="session-card card hover-lift">
                      <div className="session-info">
                        <h3 className="session-title">{hw.title}</h3>
                        <p className="session-mentor">Assigned by {hw.mentorName}</p>
                        {hw.description && <p className="session-time mt-2" style={{color: 'var(--text-secondary)'}}>{hw.description}</p>}
                        <p className="session-time mt-2">
                          <span className="calendar-icon">📅</span> Due: {new Date(hw.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="btn-secondary" onClick={() => handleCompleteHomework(hw.id)}>
                          Mark Complete ✓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-card card">
                  <div className="empty-state-icon">🎉</div>
                  <h3>All caught up!</h3>
                  <p>No homework assigned yet. Relax or start a free course.</p>
                </div>
              )}
            </section>

            {/* My Saved Courses */}
            <section className="dashboard-section">
              <h2 className="section-title">My Courses</h2>
              {savedCourses.length > 0 ? (
                <div className="sessions-list">
                  {savedCourses.map(savedCourse => {
                    const courseData = COURSES.find(c => c.id === savedCourse.id);
                    if (!courseData) return null;
                    
                    let btnStyle = { width: '160px', display: 'flex', justifyContent: 'center', transition: 'all 0.2s' };
                    if (savedCourse.status === 'Completed! 🎓') {
                      btnStyle = { ...btnStyle, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981' };
                    } else if (savedCourse.status === 'Currently Doing') {
                      btnStyle = { ...btnStyle, background: 'var(--accent-saffron)', color: '#fff', border: 'none' };
                    } else {
                      btnStyle = { ...btnStyle, background: 'var(--bg-secondary)', color: 'var(--text-muted)' };
                    }

                    return (
                      <div key={savedCourse.id} className="session-card card hover-lift" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div className="session-info">
                          <h3 className="session-title">{courseData.title}</h3>
                          <p className="session-mentor" style={{ fontSize: '0.85rem' }}>{courseData.provider}</p>
                        </div>
                        <div>
                          <button 
                            className="btn-secondary btn-sm" 
                            style={btnStyle}
                            onClick={() => handleUpdateCourseStatus(savedCourse.id, savedCourse.status)}
                          >
                            {savedCourse.status}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state-card card">
                  <div className="empty-state-icon">📚</div>
                  <h3>No courses saved yet</h3>
                  <p>Discover free gems and save them here.</p>
                  <Link to="/free-courses" className="btn-secondary mt-3">
                    Browse Courses →
                  </Link>
                </div>
              )}
            </section>

            {/* Streak Calendar */}
            <section className="dashboard-section">
              <h2 className="section-title">Your Streak Journey</h2>
              <div className="streak-display-card card">
                <div className="streak-hero">
                   <div className="streak-count" style={{ fontSize: fireSize, fontWeight: 'bold' }}>
                      {streak} <span className="fire-emoji">🔥</span>
                   </div>
                   <p className="streak-subtitle">{streakSubtitle}</p>
                </div>
                
                <div className="streak-grid mt-4">
                  {last30Days.map(dayStr => {
                    const isCompleted = userProfile?.activeDays?.includes(dayStr);
                    const isToday = dayStr === toLocalDateString(new Date());
                    return (
                      <div 
                        key={dayStr} 
                        className={`streak-square ${isCompleted ? 'completed' : 'missed'} ${isToday ? 'today' : ''}`}
                        title={dayStr}
                      ></div>
                    )
                  })}
                </div>
                <p className="streak-footer">Complete sessions or homework to light up your calendar!</p>
              </div>
            </section>

            {/* Achievements */}
            <section className="dashboard-section">
              <h2 className="section-title">Achievements</h2>
              <BadgeGrid earnedBadges={userProfile?.badges || []} />
            </section>

            {/* Certificates */}
            <section className="dashboard-section">
              <h2 className="section-title">My Certificates</h2>
              {certificates.length > 0 ? (
                <div className="sessions-list">
                  {certificates.map(cert => (
                    <div key={cert.id} className="card hover-lift" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>{cert.subject} Mentorship</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Issued: {cert.dateOfIssue}
                        </p>
                      </div>
                      <button 
                        className="btn-secondary btn-sm" 
                        onClick={() => generateAndDownloadCertificate({ ...cert, persist: false })}
                      >
                        Download 📥
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-card card" style={{ padding: '2rem' }}>
                  <div className="empty-state-icon" style={{ fontSize: '2rem' }}>🎓</div>
                  <h3 style={{ fontSize: '1.1rem' }}>No certificates yet</h3>
                  <p style={{ fontSize: '0.9rem' }}>Complete a mentorship program to earn a verified certificate.</p>
                </div>
              )}
            </section>
          </div>

        </div>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/find-mentors" className="quick-action-btn card">
              <span className="qa-icon">🎓</span>
              <span className="qa-text">Find Mentor</span>
            </Link>
            <Link to="/ai-tutor" className="quick-action-btn card">
              <span className="qa-icon">🤖</span>
              <span className="qa-text">Ask AI Tutor</span>
            </Link>
            <Link to="/free-courses" className="quick-action-btn card">
              <span className="qa-icon">📚</span>
              <span className="qa-text">Browse Free Courses</span>
            </Link>
          </div>
        </section>

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
