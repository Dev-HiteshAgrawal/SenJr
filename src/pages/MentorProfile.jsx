import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUser, createSession } from '../lib/firestore';
import { useAuth } from '../contexts/AuthContext';
import './MentorProfile.css';

export default function MentorProfile() {
  const { mentorId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('idle');

  useEffect(() => {
    async function loadMentor() {
      try {
        const data = await getUser(mentorId);
        if (data && data.role === 'mentor') {
          setMentor(data);
        } else {
          setError('Mentor not found.');
        }
      } catch (err) {
        console.error('Error fetching mentor:', err);
        setError('Failed to load mentor profile.');
      } finally {
        setLoading(false);
      }
    }

    loadMentor();
  }, [mentorId]);

  const getNext7Days = () => {
    const days = [];
    const today = new Date();

    for (let offset = 0; offset < 7; offset += 1) {
      const date = new Date(today);
      date.setDate(date.getDate() + offset);

      days.push({
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: date.toLocaleDateString('en-US'),
        isToday: offset === 0,
      });
    }

    return days;
  };

  const next7Days = getNext7Days();

  const formatTime = (timeValue) => {
    if (!timeValue) return '';
    const parsedHour = parseInt(timeValue.split(':')[0], 10);
    const hour = ((parsedHour % 24) + 24) % 24;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  const openBookingModal = (defaultDate = null, defaultSlot = null) => {
    if (!currentUser) {
      alert('Please log in to book a session.');
      return;
    }

    setBookingStatus('idle');
    setSelectedDate(defaultDate || next7Days[0].dayName);
    setSelectedSlot(defaultSlot);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    setBookingStatus('loading');

    try {
      const selectedDay = next7Days.find((day) => day.dayName === selectedDate);
      await createSession({
        studentId: currentUser.uid,
        studentName: userProfile?.displayName || currentUser.displayName || 'Student',
        mentorId: mentor.id,
        mentorName: mentor.displayName,
        date: selectedDay ? selectedDay.fullDate : selectedDate,
        dayName: selectedDate,
        time: selectedSlot.start,
        sessionType: selectedSlot.type,
        status: 'upcoming',
      });
      setBookingStatus('success');
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Failed to book session. Please try again.');
      setBookingStatus('idle');
    }
  };

  if (loading) {
    return (
      <div className="page-container flex-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="page-container flex-center">
        <h2>{error}</h2>
        <Link to="/find-mentors" className="btn-primary mt-3">
          Back to Mentors
        </Link>
      </div>
    );
  }

  const initial = mentor.displayName ? mentor.displayName.charAt(0).toUpperCase() : 'M';
  const avatarColor = mentor.avatarColor || '#FF6B00';
  const joinedDate =
    mentor.createdAt?.toDate?.().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) || 'Recently';
  const totalSessions = mentor.totalSessionsCompleted || 0;
  const studentsHelped = mentor.uniqueStudentsHelped || mentor.studentIdsHelped?.length || 0;
  const averageRating = mentor.averageRating || 0;
  const reviewCount = mentor.totalReviews || mentor.reviews?.length || 0;

  return (
    <div className="page-container mentor-profile-page">
      <div className="profile-wrapper animate-fade-in-up">
        <section className="profile-hero card">
          <div className="hero-content">
            <div className="hero-avatar" style={{ backgroundColor: avatarColor }}>
              {initial}
            </div>
            <div className="hero-info">
              <h1 className="mentor-name">
                {mentor.displayName}
                {mentor.verificationStatus === 'verified' && (
                  <span
                    className="verification-badge inline tier-blue"
                    style={{
                      background: 'rgba(56, 189, 248, 0.1)',
                      color: '#38bdf8',
                      border: '1px solid rgba(56,189,248,0.3)',
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.8rem',
                      borderRadius: '12px',
                    }}
                  >
                    <span className="badge-icon">✓</span> Verified
                  </span>
                )}
              </h1>
              <p className="mentor-education">
                {mentor.course || 'Degree'} {mentor.year ? `(Year ${mentor.year})` : ''} •{' '}
                {mentor.college || 'Institution'}
              </p>

              <div className="mentor-tags">
                <span className="lang-badge">🗣️ {mentor.language || 'English'}</span>
                {mentor.subjects?.map((subject) => (
                  <span key={subject} className="subject-pill">
                    {subject}
                  </span>
                ))}
              </div>

              {mentor.aboutMe && (
                <div className="mentor-about">
                  <p>"{mentor.aboutMe}"</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="profile-stats">
          <div className="stat-card card">
            <div className="stat-value">{totalSessions}</div>
            <div className="stat-label">Total Sessions</div>
          </div>
          <div className="stat-card card">
            <div className="stat-value">{studentsHelped}</div>
            <div className="stat-label">Students Helped</div>
          </div>
          <div className="stat-card card">
            <div className="stat-value">{averageRating ? `${averageRating} ⭐` : '—'}</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-card card">
            <div className="stat-value">{joinedDate}</div>
            <div className="stat-label">Joined Date</div>
          </div>
        </section>

        <div className="profile-grid">
          <div className="main-column">
            <section className="profile-section">
              <h2 className="section-title">Available Slots</h2>
              <div className="calendar-card card">
                <div className="calendar-scroll">
                  {next7Days.map((day) => {
                    const daySlots = mentor.availability?.[day.dayName] || [];

                    return (
                      <div key={`${day.dayName}-${day.fullDate}`} className="calendar-day-col">
                        <div className={`day-header ${day.isToday ? 'today' : ''}`}>
                          <span className="day-name">{day.dayName}</span>
                          <span className="day-date">
                            {day.dateNum} {day.month}
                          </span>
                          {day.isToday && <span className="today-badge">Today</span>}
                        </div>

                        <div className="day-slots">
                          {daySlots.length > 0 ? (
                            daySlots.map((slot, index) => (
                              <button
                                key={`${day.dayName}-${slot.start}-${index}`}
                                className="slot-btn available"
                                onClick={() => openBookingModal(day.dayName, slot)}
                              >
                                {formatTime(slot.start)}
                              </button>
                            ))
                          ) : (
                            <div className="no-slots">Full</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="profile-section">
              <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="section-title">What students say</h2>
                <div className="rating-average">
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{averageRating || '—'}</span>
                  {averageRating ? <span className="star" style={{ marginLeft: '4px' }}>⭐</span> : null}
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '6px' }}>
                    ({reviewCount} reviews)
                  </span>
                </div>
              </div>
              <div className="reviews-card card">
                {mentor.reviews?.length ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {mentor.reviews
                      .slice()
                      .reverse()
                      .slice(0, 3)
                      .map((review, index) => (
                        <div
                          key={`${review.studentName || 'student'}-${index}`}
                          style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.35rem' }}>
                            <strong>{review.studentName || 'Student'}</strong>
                            <span style={{ color: 'var(--text-secondary)' }}>{review.rating} ⭐</span>
                          </div>
                          <p style={{ color: 'var(--text-secondary)' }}>{review.text || 'Great session.'}</p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="reviews-empty">
                    <span className="empty-icon">💬</span>
                    <p>No reviews yet. Be the first to book a session and leave a review!</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="sidebar-column">
            {mentor.achievement && (
              <section className="profile-section">
                <h2 className="section-title">Biggest Achievement</h2>
                <div className="achievement-box card">
                  <span className="trophy-icon">🏆</span>
                  <p className="achievement-text">{mentor.achievement}</p>
                </div>
              </section>
            )}

            {mentor.linkedin && (
              <a href={mentor.linkedin} target="_blank" rel="noreferrer" className="linkedin-link card">
                <span>🔗 LinkedIn Profile</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="booking-sticky-bar">
        <div className="booking-bar-content">
          <div className="price-info">
            <span className="price">$0</span>
            <span className="price-note">Free for early users!</span>
          </div>
          {userProfile?.banned ? (
            <button
              className="btn-secondary glow-btn"
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
              title="You are currently on a study break."
            >
              🔒 Study Break Active
            </button>
          ) : (
            <button className="btn-primary glow-btn" onClick={() => openBookingModal()}>
              Book a Session
            </button>
          )}
        </div>
      </div>

      {isBookingModalOpen && (
        <div className="modal-overlay animate-fade-in" onClick={() => setIsBookingModalOpen(false)}>
          <div className="bottom-sheet card animate-slide-up" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-header">
              <h3>Book a Session with {mentor.displayName.split(' ')[0]}</h3>
              <button className="close-btn" onClick={() => setIsBookingModalOpen(false)}>
                ✕
              </button>
            </div>

            {bookingStatus === 'success' ? (
              <div className="sheet-success">
                <div className="success-icon">🎉</div>
                <h3>Session Booked!</h3>
                <p>You'll get a reminder before the session starts.</p>
                <button className="btn-primary full-width mt-4" onClick={() => setIsBookingModalOpen(false)}>
                  Done
                </button>
              </div>
            ) : (
              <div className="sheet-body">
                <div className="booking-dates-scroll">
                  {next7Days.map((day) => (
                    <button
                      key={day.fullDate}
                      className={`date-chip ${selectedDate === day.dayName ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedDate(day.dayName);
                        setSelectedSlot(null);
                      }}
                    >
                      <span className="chip-day">{day.dayName}</span>
                      <span className="chip-date">{day.dateNum}</span>
                    </button>
                  ))}
                </div>

                <div className="booking-slots-grid mt-4">
                  {(mentor.availability?.[selectedDate] || []).map((slot, index) => (
                    <button
                      key={`${selectedDate}-${slot.start}-${index}`}
                      className={`slot-chip ${selectedSlot === slot ? 'active' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <span className="slot-time">{formatTime(slot.start)}</span>
                      <span className="slot-type">{slot.type}</span>
                      {slot.type.includes('Group') && <span className="slot-spots">Shared slot</span>}
                    </button>
                  ))}
                  {(!mentor.availability?.[selectedDate] || mentor.availability[selectedDate].length === 0) && (
                    <div className="no-slots-msg card">No available slots on this day.</div>
                  )}
                </div>

                {selectedSlot && (
                  <div className="booking-summary card mt-4">
                    <p>
                      <strong>Date:</strong> {next7Days.find((day) => day.dayName === selectedDate)?.fullDate}
                    </p>
                    <p>
                      <strong>Time:</strong> {formatTime(selectedSlot.start)}
                    </p>
                    <p>
                      <strong>Type:</strong> {selectedSlot.type}
                    </p>
                    <p>
                      <strong>Duration:</strong> 1 hour
                    </p>
                  </div>
                )}

                <button
                  className="btn-primary glow-btn full-width mt-4"
                  disabled={!selectedSlot || bookingStatus === 'loading'}
                  onClick={handleConfirmBooking}
                >
                  {bookingStatus === 'loading' ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
