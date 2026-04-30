import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateUser, getAllSessions, where, updateSession, getDocument, createDocument, COLLECTIONS } from '../lib/firestore';
import { auth, storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import UnreadBadge from '../components/UnreadBadge';
import VideoCall from '../components/VideoCall';
import { generateAndDownloadCertificate } from '../lib/certificateHelpers';
import './MentorDashboard.css';

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

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Generate times for full 24-hour clock (12 AM to 11 PM)
const TIME_OPTIONS = [];
for (let i = 0; i < 24; i++) {
  const ampm = i >= 12 ? 'PM' : 'AM';
  const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
  TIME_OPTIONS.push({ value: `${i}:00`, label: `${hour}:00 ${ampm}` });
}

export default function MentorDashboard() {
  const { userProfile, currentUser } = useAuth();
  
  const displayName = userProfile?.displayName || currentUser?.displayName || 'Mentor';
  const collegeName = userProfile?.college || 'Institution';

  // Availability State
  const [availability, setAvailability] = useState({
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
  });
  
  const [editingDay, setEditingDay] = useState(null);
  const [newSlot, setNewSlot] = useState({
    start: '09:00',
    end: '10:00',
    type: '1-on-1',
    recurring: true
  });

  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [uniqueStudents, setUniqueStudents] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [hwForm, setHwForm] = useState({ studentId: '', title: '', description: '', dueDate: '' });
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }

    setIsUploadingDocument(true);
    try {
      const storageRef = ref(storage, `mentor_verification/${currentUser.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      await updateUser(currentUser.uid, {
        verificationStatus: 'pending',
        verificationDocumentUrl: downloadURL
      });
      alert("Document submitted successfully! Under review.");
    } catch (err) {
      console.error("Error uploading document:", err);
      alert("Failed to upload document.");
    }
    setIsUploadingDocument(false);
  };

  useEffect(() => {
    if (currentUser?.uid) {
      async function fetchSessions() {
        try {
          const data = await getAllSessions(where('mentorId', '==', currentUser.uid));
          const activeSessions = data.filter(s => s.status === 'upcoming');
          setUpcomingSessions(activeSessions);

          const studentsMap = new Map();
          data.forEach(s => {
            if (s.studentId && s.studentName) {
              studentsMap.set(s.studentId, { id: s.studentId, name: s.studentName });
            }
          });
          
          // Fetch full profile for each unique student to get miss_count
          const studentsWithProfiles = await Promise.all(
            Array.from(studentsMap.values()).map(async (student) => {
               const profile = await getDocument(COLLECTIONS.USERS, student.id);
               return { ...student, ...profile };
            })
          );
          
          setUniqueStudents(studentsWithProfiles);
        } catch (err) {
          console.error("Failed to load sessions:", err);
        }
      }
      fetchSessions();
    }
  }, [currentUser?.uid]);

  // Load availability from user profile
  useEffect(() => {
    if (userProfile?.availability) {
      setAvailability(userProfile.availability);
    }
  }, [userProfile]);

  const handleStartChange = (e) => {
    const startVal = e.target.value;
    const startHour = parseInt(startVal.split(':')[0]);
    const endHour = (startHour + 1) % 24;
    setNewSlot({
      ...newSlot,
      start: startVal,
      end: `${endHour}:00`
    });
  };

  const handleAddSlot = async () => {
    if (!editingDay) return;
    
    const updatedDaySlots = [...(availability[editingDay] || []), newSlot].sort((a, b) => {
      return parseInt(a.start) - parseInt(b.start);
    });
    
    const updatedAvailability = { ...availability, [editingDay]: updatedDaySlots };
    
    setAvailability(updatedAvailability);
    setEditingDay(null);

    if (currentUser?.uid) {
      try {
        await updateUser(currentUser.uid, { availability: updatedAvailability });
      } catch (err) {
        console.error("Error saving availability:", err);
      }
    }
  };

  const handleRemoveSlot = async (day, index) => {
    const updatedDaySlots = availability[day].filter((_, i) => i !== index);
    const updatedAvailability = { ...availability, [day]: updatedDaySlots };
    
    setAvailability(updatedAvailability);
    
    if (currentUser?.uid) {
      try {
        await updateUser(currentUser.uid, { availability: updatedAvailability });
      } catch (err) {
        console.error("Error removing slot:", err);
      }
    }
  };

  const handleAssignHomework = async (e) => {
    e.preventDefault();
    if (!hwForm.studentId || !hwForm.title) return;

    try {
      const student = uniqueStudents.find(s => s.id === hwForm.studentId);
      
      await createDocument(COLLECTIONS.HOMEWORK, {
        mentorId: currentUser.uid,
        mentorName: displayName,
        studentId: student.id,
        studentName: student.name,
        title: hwForm.title,
        description: hwForm.description,
        dueDate: hwForm.dueDate,
        status: 'pending'
      });
      
      setShowHomeworkModal(false);
      setHwForm({ studentId: '', title: '', description: '', dueDate: '' });
      alert("Homework assigned successfully!");
    } catch (err) {
      console.error("Failed to assign homework:", err);
      alert("Failed to assign homework. Please try again.");
    }
  };

  const handleForgiveMiss = async (studentId, currentMisses) => {
    if (currentMisses <= 0) return;
    try {
      await updateUser(studentId, { miss_count: currentMisses - 1 });
      // Update local state instantly
      setUniqueStudents(prev => prev.map(s => 
        s.id === studentId ? { ...s, miss_count: currentMisses - 1 } : s
      ));
    } catch (err) {
      console.error("Failed to forgive miss:", err);
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

    setShowCompletionModal(true);
    setUpcomingSessions(prev => prev.filter(s => s.id !== session.id));
    setActiveSession(null);
  };

  const handleDownloadMentorCertificate = async () => {
    if (!currentUser || !userProfile) return;
    try {
      await generateAndDownloadCertificate({
        type: 'mentor',
        mentorName: displayName,
        studentCount: uniqueStudents.length || (userProfile.uniqueStudentsHelped || 0),
        subjects: userProfile.subjects?.join(', ') || 'Various Subjects',
        userId: currentUser.uid
      });
    } catch (err) {
      console.error("Error generating mentor certificate", err);
      alert("Could not generate certificate.");
    }
  };

  const handleMarkMentorshipComplete = async (studentId, studentName) => {
    if (!currentUser || !userProfile) return;
    try {
      await generateAndDownloadCertificate({
        type: 'student',
        studentName: studentName,
        mentorName: displayName,
        mentorCollege: userProfile.college || 'Senjr Mentor',
        subject: userProfile.subjects?.[0] || 'Mentorship Program',
        duration: '1 Month',
        userId: studentId
      });
      alert(`Mentorship marked complete for ${studentName}. Certificate downloaded!`);
    } catch (err) {
      console.error("Error generating student certificate", err);
      alert("Could not generate certificate.");
    }
  };

  const getSlotColorClass = (startVal) => {
    const hour = parseInt(startVal.split(':')[0]);
    if (hour < 6) return 'slot-night';
    if (hour < 12) return 'slot-morning';
    if (hour < 17) return 'slot-afternoon';
    if (hour < 21) return 'slot-evening';
    return 'slot-night';
  };

  const formatTime = (timeVal) => {
    const parsedHour = parseInt(timeVal.split(':')[0]);
    const hour = ((parsedHour % 24) + 24) % 24;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  return (
    <div className="page-container dashboard-page">
      <div className="dashboard-wrapper animate-fade-in-up">
        
        {/* Welcome Banner */}
        <header className="dashboard-header mentor-header">
          <div>
            <div className="verification-badge">
              <span className="badge-icon">✅</span>
              <span className="badge-text">{collegeName} Verified</span>
            </div>
            <h1 className="dashboard-title">
              Welcome, Mentor <span className="highlight">{displayName}</span>! 🌟
            </h1>
            <p className="dashboard-subtitle">You're making a difference.</p>
          </div>
        </header>

        {/* HUD Stats Row */}
        <section className="hud-stats">
          <div className="hud-card card">
            <span className="hud-icon">👥</span>
            <div className="hud-info">
              <span className="hud-value">{uniqueStudents.length}</span>
              <span className="hud-label">Total Students</span>
            </div>
          </div>
          <div className="hud-card card">
            <span className="hud-icon">🎤</span>
            <div className="hud-info">
              <span className="hud-value">{userProfile?.totalSessionsCompleted || 0}</span>
              <span className="hud-label">Sessions Given</span>
            </div>
          </div>
          <div className="hud-card card">
            <span className="hud-icon">⭐</span>
            <div className="hud-info">
              <span className="hud-value">{userProfile?.averageRating || '—'}</span>
              <span className="hud-label">Average Rating</span>
            </div>
          </div>
          <div className="hud-card card">
            <span className="hud-icon">🎓</span>
            <div className="hud-info">
              <button 
                className="btn-secondary btn-sm" 
                onClick={handleDownloadMentorCertificate}
                disabled={(userProfile?.totalSessionsCompleted || 0) < 10}
                style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
              >
                {(userProfile?.totalSessionsCompleted || 0) >= 10 ? 'Download Certificate 📥' : '10 Sessions Required'}
              </button>
              <span className="hud-label" style={{marginTop: '0.3rem'}}>Mentor Cert</span>
            </div>
          </div>
        </section>

        {/* Dashboard Grid Content */}
        <div className="dashboard-grid">
          
          <div className="dashboard-column">
            {/* My Students */}
            <section className="dashboard-section">
              <h2 className="section-title">My Students</h2>
              {uniqueStudents.length > 0 ? (
                <div className="students-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {uniqueStudents.map(s => {
                    const misses = s.miss_count || 0;
                    return (
                      <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                           <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                             {s.name.charAt(0)}
                           </div>
                           <div>
                             <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{s.name}</h3>
                             {misses > 0 && (
                               <span style={{ fontSize: '0.8rem', color: misses >= 5 ? '#ff5c5c' : '#ffc107', fontWeight: 'bold' }}>
                                 {misses} {misses === 1 ? 'Miss' : 'Misses'}
                               </span>
                             )}
                           </div>
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                           {misses > 0 && (
                             <button className="btn-secondary btn-sm" onClick={() => handleForgiveMiss(s.id, misses)}>
                               Forgive Miss
                             </button>
                           )}
                           <button 
                             className="btn-secondary btn-sm"
                             style={{ display: 'flex', alignItems: 'center', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
                             onClick={() => handleMarkMentorshipComplete(s.id, s.name)}
                           >
                             Mark Complete 🎓
                           </button>
                           <Link 
                             to={`/chat/${s.id}_${currentUser.uid}`} 
                             state={{ otherUser: { displayName: s.name } }}
                             className="btn-secondary btn-sm"
                             style={{ display: 'flex', alignItems: 'center' }}
                           >
                             Message 💬
                             <UnreadBadge chatId={`${s.id}_${currentUser.uid}`} userId={currentUser.uid} />
                           </Link>
                         </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state-card card">
                  <div className="empty-state-icon">🎒</div>
                  <h3>No students yet</h3>
                  <p>Ensure your profile is complete with subjects and bio to attract students.</p>
                  <Link to="/profile" className="btn-primary mt-3">
                    Complete your profile →
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
                          <h4 style={{ margin: '0 0 0.5rem 0' }}>Session with {session.studentName}</h4>
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
                  <p>Once students book you, their sessions will appear here.</p>
                </div>
              )}
            </section>
          </div>

          <div className="dashboard-column">
            {/* My Availability */}
            <section className="dashboard-section">
              <h2 className="section-title">My Availability</h2>
              <div className="availability-card card">
                <p className="availability-desc">Set your weekly recurring slots.</p>
                <div className="availability-grid">
                  {WEEKDAYS.map(day => (
                    <div key={day} className="availability-col">
                      <div className="col-header">{day}</div>
                      
                      <div className="slots-container">
                        {availability[day]?.map((slot, index) => (
                          <div key={index} className={`slot-tag ${getSlotColorClass(slot.start)}`}>
                            <div className="slot-time">{formatTime(slot.start)} - {formatTime(slot.end)}</div>
                            <div className="slot-type">{slot.type}{slot.recurring ? ' 🔄' : ''}</div>
                            <button className="remove-slot" onClick={() => handleRemoveSlot(day, index)}>✕</button>
                          </div>
                        ))}
                      </div>

                      {editingDay === day ? (
                        <div className="add-slot-form">
                          <select className="glass-input slot-input" value={newSlot.start} onChange={handleStartChange}>
                            {TIME_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                          <select className="glass-input slot-input" value={newSlot.type} onChange={(e) => setNewSlot({...newSlot, type: e.target.value})}>
                            <option value="1-on-1">1-on-1</option>
                            <option value="Group (2)">Group (2)</option>
                            <option value="Group (4)">Group (4)</option>
                          </select>
                          <label className="checkbox-label">
                            <input type="checkbox" checked={newSlot.recurring} onChange={(e) => setNewSlot({...newSlot, recurring: e.target.checked})} />
                            Recurring?
                          </label>
                          <div className="slot-form-actions">
                            <button className="btn-secondary btn-sm" onClick={() => setEditingDay(null)}>Cancel</button>
                            <button className="btn-primary btn-sm" onClick={handleAddSlot}>Add</button>
                          </div>
                        </div>
                      ) : (
                        <button className="add-slot-btn" onClick={() => {
                          setEditingDay(day);
                          setNewSlot({ start: '09:00', end: '10:00', type: '1-on-1', recurring: true });
                        }}>
                          <span>+</span> Add Slot
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Pending Homework Reviews */}
            <section className="dashboard-section">
              <h2 className="section-title">Pending Homework Reviews</h2>
              <div className="empty-state-card card">
                <div className="empty-state-icon">📝</div>
                <h3>All caught up!</h3>
                <p>No homework submissions pending review right now.</p>
              </div>
            </section>

            {/* Verification Section */}
            <section className="dashboard-section">
              <h2 className="section-title">Get Verified ✓</h2>
              <div className="card" style={{ padding: '1.5rem' }}>
                {userProfile?.verificationStatus === 'verified' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2rem' }}>✅</div>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#10b981' }}>You are Verified!</h3>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your blue badge is visible on your profile.</p>
                    </div>
                  </div>
                ) : userProfile?.verificationStatus === 'pending' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2rem' }}>⏳</div>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#ffc107' }}>Under Review</h3>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Document submitted — under review (within 48 hours).</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Verify Your College</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      Upload your College ID, Marksheet, or Admit Card (Image or PDF, max 5MB).
                    </p>
                    <label className="btn-primary" style={{ display: 'inline-block', cursor: 'pointer' }}>
                      {isUploadingDocument ? 'Uploading...' : 'Upload Document 📄'}
                      <input 
                        type="file" 
                        accept="image/*,application/pdf" 
                        style={{ display: 'none' }} 
                        onChange={handleDocumentUpload}
                        disabled={isUploadingDocument}
                      />
                    </label>
                  </div>
                )}
              </div>
            </section>
          </div>

        </div>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions">
            <Link to={`/mentor/${currentUser?.uid}`} className="quick-action-btn card">
              <span className="qa-icon">👀</span>
              <span className="qa-text">View Public Profile</span>
            </Link>
            <Link to="/profile" className="quick-action-btn card">
              <span className="qa-icon">⚙️</span>
              <span className="qa-text">Edit Profile</span>
            </Link>
            <button className="quick-action-btn card">
              <span className="qa-icon">⏰</span>
              <span className="qa-text">Add Time Slots</span>
            </button>
            <button className="quick-action-btn card" onClick={() => setShowHomeworkModal(true)}>
              <span className="qa-icon">📋</span>
              <span className="qa-text">Assign Homework</span>
            </button>
          </div>
        </section>

      </div>

      {showHomeworkModal && (
        <div className="review-modal-overlay animate-fade-in">
          <div className="review-modal-card">
            <h3>Assign Homework</h3>
            <p className="review-subtitle">Give your student a task to complete before the next session.</p>
            
            <form onSubmit={handleAssignHomework} className="form-group mt-4">
              <label>Select Student</label>
              <select 
                className="glass-input mb-3" 
                value={hwForm.studentId}
                onChange={(e) => setHwForm({...hwForm, studentId: e.target.value})}
                required
              >
                <option value="">-- Choose a student --</option>
                {uniqueStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <label>Task Title</label>
              <input 
                type="text" 
                className="glass-input mb-3" 
                placeholder="e.g. Build a Todo App"
                value={hwForm.title}
                onChange={(e) => setHwForm({...hwForm, title: e.target.value})}
                required
              />

              <label>Description</label>
              <textarea 
                className="glass-input mb-3" 
                rows="3" 
                placeholder="Provide details, links, and expectations..."
                value={hwForm.description}
                onChange={(e) => setHwForm({...hwForm, description: e.target.value})}
              ></textarea>

              <label>Due Date</label>
              <input 
                type="date" 
                className="glass-input mb-4" 
                value={hwForm.dueDate}
                onChange={(e) => setHwForm({...hwForm, dueDate: e.target.value})}
                required
              />

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowHomeworkModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVideo && activeSession && (
        <VideoCall
          roomName={`senjr-${activeSession.id}`}
          participantName={auth.currentUser?.displayName || auth.currentUser?.email || 'User'}
          participantIdentity={auth.currentUser?.uid || `user-${Date.now()}`}
          onSessionEnd={endSession}
        />
      )}

      {showCompletionModal && (
        <div className="completion-overlay animate-fade-in">
          <div className="completion-modal card animate-slide-up">
            <div className="completion-icon">✅</div>
            <h3>Session Completed!</h3>
            <p>Great job hosting this session. The student will be prompted to leave a review.</p>
            <button 
              className="btn-primary full-width mt-4"
              onClick={() => setShowCompletionModal(false)}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
