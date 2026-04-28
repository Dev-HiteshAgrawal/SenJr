import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllUsers, where, orderBy, limit } from '../lib/firestore';
import { getLevelDetails } from '../lib/xpHelpers';
import './Leaderboard.css';

// Get Monday of the current week
function getWeekStart() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon...
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust for Sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getWeekEnd() {
  const monday = getWeekStart();
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return sunday;
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const RANK_MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function Leaderboard() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch all students
        const allStudents = await getAllUsers(where('role', '==', 'student'));
        // Sort by XP descending (weeklyXP if available, fallback to total xp)
        const sortedStudents = allStudents
          .map(s => ({
            ...s,
            weekXP: s.weeklyXP || s.xp || 0,
            level: getLevelDetails(s.xp || 0),
          }))
          .sort((a, b) => b.weekXP - a.weekXP)
          .slice(0, 50); // take top 50 for rank calculation

        setStudents(sortedStudents);

        // Fetch all mentors
        const allMentors = await getAllUsers(where('role', '==', 'mentor'));
        const sortedMentors = allMentors
          .map(m => ({
            ...m,
            weekSessions: m.weeklySessionsCompleted || m.totalSessionsCompleted || 0,
          }))
          .sort((a, b) => b.weekSessions - a.weekSessions)
          .slice(0, 50);

        setMentors(sortedMentors);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Find current user rank
  const getMyRank = (list, key) => {
    if (!currentUser) return null;
    const idx = list.findIndex(u => u.id === currentUser.uid);
    return idx >= 0 ? { rank: idx + 1, data: list[idx] } : null;
  };

  const myStudentRank = getMyRank(students, 'weekXP');
  const myMentorRank = getMyRank(mentors, 'weekSessions');

  return (
    <div className="page-container leaderboard-page animate-fade-in-up">
      <header className="lb-header">
        <h1 className="lb-title">This Week's Champions 🏆</h1>
        <p className="lb-subtitle">
          Top performers from <strong>{formatDate(weekStart)}</strong> to <strong>{formatDate(weekEnd)}</strong>
        </p>
      </header>

      {/* Tabs */}
      <div className="lb-tabs">
        <button
          className={`lb-tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <span className="lb-tab-icon">🎓</span> Top Students
        </button>
        <button
          className={`lb-tab ${activeTab === 'mentors' ? 'active' : ''}`}
          onClick={() => setActiveTab('mentors')}
        >
          <span className="lb-tab-icon">🧭</span> Top Mentors
        </button>
      </div>

      {loading ? (
        <div className="loading-container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading leaderboard...</p>
        </div>
      ) : (
        <div className="lb-table-wrapper card">
          {activeTab === 'students' ? (
            <>
              {/* Students Table Header */}
              <div className="lb-row lb-header-row">
                <span className="lb-col lb-rank">Rank</span>
                <span className="lb-col lb-user">Student</span>
                <span className="lb-col lb-stat">XP This Week</span>
                <span className="lb-col lb-level">Level</span>
                <span className="lb-col lb-streak">Streak</span>
              </div>

              {students.length > 0 ? (
                students.slice(0, 10).map((student, idx) => {
                  const rank = idx + 1;
                  const initial = student.displayName?.charAt(0).toUpperCase() || '?';
                  const avatarColor = student.avatarColor || '#FF6B00';

                  return (
                    <div
                      key={student.id}
                      className={`lb-row ${rank <= 3 ? `lb-top-${rank}` : ''} ${student.id === currentUser?.uid ? 'lb-me' : ''}`}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <span className="lb-col lb-rank">
                        {RANK_MEDALS[rank] || `#${rank}`}
                      </span>
                      <span className="lb-col lb-user">
                        <div className="lb-avatar" style={{ backgroundColor: avatarColor }}>{initial}</div>
                        <div className="lb-user-info">
                          <span className="lb-name">{student.displayName || 'Student'}</span>
                          <span className="lb-college">{student.college || '—'}</span>
                        </div>
                      </span>
                      <span className="lb-col lb-stat">
                        <span className="lb-stat-value">{student.weekXP}</span>
                        <span className="lb-stat-label">XP</span>
                      </span>
                      <span className="lb-col lb-level">
                        <span className="lb-level-badge">{student.level.icon} {student.level.name}</span>
                      </span>
                      <span className="lb-col lb-streak">
                        {student.streak || 0} 🔥
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="lb-empty">
                  <p>No students to display yet. Be the first to earn XP! ⚡</p>
                </div>
              )}

              {/* My rank if not in top 10 */}
              {myStudentRank && myStudentRank.rank > 10 && (
                <div className="lb-my-rank">
                  <span className="lb-my-rank-text">
                    Your rank: <strong>#{myStudentRank.rank}</strong> — Keep going! 💪
                  </span>
                  <span className="lb-my-rank-xp">{myStudentRank.data.weekXP} XP</span>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Mentors Table Header */}
              <div className="lb-row lb-header-row">
                <span className="lb-col lb-rank">Rank</span>
                <span className="lb-col lb-user">Mentor</span>
                <span className="lb-col lb-stat">Sessions</span>
                <span className="lb-col lb-level">Students</span>
                <span className="lb-col lb-streak">Rating</span>
              </div>

              {mentors.length > 0 ? (
                mentors.slice(0, 10).map((mentor, idx) => {
                  const rank = idx + 1;
                  const initial = mentor.displayName?.charAt(0).toUpperCase() || '?';
                  const avatarColor = mentor.avatarColor || '#FF6B00';

                  return (
                    <div
                      key={mentor.id}
                      className={`lb-row ${rank <= 3 ? `lb-top-${rank}` : ''} ${mentor.id === currentUser?.uid ? 'lb-me' : ''}`}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <span className="lb-col lb-rank">
                        {RANK_MEDALS[rank] || `#${rank}`}
                      </span>
                      <span className="lb-col lb-user">
                        <div className="lb-avatar" style={{ backgroundColor: avatarColor }}>{initial}</div>
                        <div className="lb-user-info">
                          <span className="lb-name">{mentor.displayName || 'Mentor'}</span>
                          <span className="lb-college">{mentor.college || '—'}</span>
                        </div>
                      </span>
                      <span className="lb-col lb-stat">
                        <span className="lb-stat-value">{mentor.weekSessions}</span>
                        <span className="lb-stat-label">sessions</span>
                      </span>
                      <span className="lb-col lb-level">
                        {mentor.uniqueStudentsHelped || mentor.totalReviews || 0}
                      </span>
                      <span className="lb-col lb-streak">
                        {mentor.averageRating ? `${mentor.averageRating} ⭐` : '—'}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="lb-empty">
                  <p>No mentors to display yet. Start mentoring to climb the ranks! 🧭</p>
                </div>
              )}

              {/* My rank if not in top 10 */}
              {myMentorRank && myMentorRank.rank > 10 && (
                <div className="lb-my-rank">
                  <span className="lb-my-rank-text">
                    Your rank: <strong>#{myMentorRank.rank}</strong> — Keep going! 💪
                  </span>
                  <span className="lb-my-rank-xp">{myMentorRank.data.weekSessions} sessions</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
