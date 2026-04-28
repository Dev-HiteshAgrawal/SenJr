import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, where } from '../lib/firestore';
import './FindMentors.css';

const SUBJECTS = ['All', 'Maths', 'Physics', 'Chemistry', 'Biology', 'History', 'Economics', 'English', 'Programming', 'Business', 'JEE Prep', 'NEET Prep', 'CUET Prep'];
const COURSES = ['All', 'BTech / BEng', 'BBA / Business', 'BSc', 'BA', 'BCom / Finance', 'MBA', 'Other'];
const TIMES = ['Any Time', 'Morning (6AM-12PM)', 'Afternoon (12PM-5PM)', 'Evening (5PM-9PM)'];
const SESSION_TYPES = ['All', '1-on-1', 'Group (max 4)'];

export default function FindMentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSubject, setActiveSubject] = useState('All');
  const [activeCourse, setActiveCourse] = useState('All');
  const [activeTime, setActiveTime] = useState('Any Time');
  const [activeType, setActiveType] = useState('All');

  useEffect(() => {
    async function loadMentors() {
      try {
        const data = await getAllUsers(where('role', '==', 'mentor'));
        setMentors(data.filter((mentor) => !mentor.banned));
      } catch (err) {
        console.error('Error fetching mentors:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMentors();
  }, []);

  const hasSlotMatching = (availability, timeFilter, typeFilter) => {
    if (timeFilter === 'Any Time' && typeFilter === 'All') return true;
    if (!availability) return false;

    for (const day of Object.keys(availability)) {
      for (const slot of availability[day]) {
        let timeMatch = timeFilter === 'Any Time';
        let typeMatch = typeFilter === 'All';

        if (!timeMatch && slot.start) {
          const hour = parseInt(slot.start.split(':')[0], 10);
          if (timeFilter === 'Morning (6AM-12PM)' && hour >= 6 && hour < 12) timeMatch = true;
          if (timeFilter === 'Afternoon (12PM-5PM)' && hour >= 12 && hour < 17) timeMatch = true;
          if (timeFilter === 'Evening (5PM-9PM)' && hour >= 17 && hour <= 21) timeMatch = true;
        }

        if (!typeMatch && slot.type) {
          if (typeFilter === '1-on-1' && slot.type === '1-on-1') typeMatch = true;
          if (typeFilter === 'Group (max 4)' && slot.type.includes('Group')) typeMatch = true;
        }

        if (timeMatch && typeMatch) return true;
      }
    }

    return false;
  };

  const isAvailableToday = (availability) => {
    if (!availability) return false;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    return Boolean(availability[today]?.length);
  };

  const filteredMentors = mentors.filter((mentor) => {
    if (search.trim()) {
      const query = search.toLowerCase();
      const matchesName = mentor.displayName?.toLowerCase().includes(query) || false;
      const matchesCollege = mentor.college?.toLowerCase().includes(query) || false;
      const matchesSubject = mentor.subjects?.some((subject) => subject.toLowerCase().includes(query)) || false;
      if (!matchesName && !matchesCollege && !matchesSubject) return false;
    }

    if (activeSubject !== 'All' && !mentor.subjects?.includes(activeSubject)) return false;
    if (activeCourse !== 'All' && mentor.course !== activeCourse) return false;
    if (!hasSlotMatching(mentor.availability, activeTime, activeType)) return false;

    return true;
  });

  return (
    <div className="page-container find-mentors-page animate-fade-in-up">
      <header className="page-header">
        <h1 className="page-title">Find a Mentor</h1>
        <p className="page-subtitle">Discover expert seniors who can guide your learning path.</p>
      </header>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, college, or subject..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="filters-container">
          <div className="filter-row">
            <span className="filter-label">Subject:</span>
            <div className="pill-scroll">
              {SUBJECTS.map((subject) => (
                <button
                  key={subject}
                  className={`filter-pill ${activeSubject === subject ? 'active' : ''}`}
                  onClick={() => setActiveSubject(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-row">
            <span className="filter-label">Course:</span>
            <div className="pill-scroll">
              {COURSES.map((course) => (
                <button
                  key={course}
                  className={`filter-pill ${activeCourse === course ? 'active' : ''}`}
                  onClick={() => setActiveCourse(course)}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-row">
            <span className="filter-label">Time:</span>
            <div className="pill-scroll">
              {TIMES.map((time) => (
                <button
                  key={time}
                  className={`filter-pill ${activeTime === time ? 'active' : ''}`}
                  onClick={() => setActiveTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-row">
            <span className="filter-label">Type:</span>
            <div className="pill-scroll">
              {SESSION_TYPES.map((type) => (
                <button
                  key={type}
                  className={`filter-pill ${activeType === type ? 'active' : ''}`}
                  onClick={() => setActiveType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
        </div>
      ) : filteredMentors.length > 0 ? (
        <div className="mentors-grid">
          {filteredMentors.map((mentor, index) => {
            const initial = mentor.displayName ? mentor.displayName.charAt(0).toUpperCase() : 'M';
            const avatarColor = mentor.avatarColor || '#FF6B00';
            const hasTodaySlot = isAvailableToday(mentor.availability);
            const mentorRating = mentor.averageRating || 0;

            return (
              <div key={mentor.id} className="mentor-card card" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="mentor-card-header">
                  <div className="mentor-card-avatar" style={{ backgroundColor: avatarColor }}>
                    {initial}
                  </div>
                  <div className="mentor-card-info">
                    <h3>
                      {mentor.displayName}
                      {mentor.verificationStatus === 'verified' && (
                        <span className="verified-icon" style={{ marginLeft: '4px', fontSize: '1rem', color: '#38bdf8' }}>
                          ✓
                        </span>
                      )}
                    </h3>
                    <p>
                      {mentor.college || 'Mentor'} {mentor.year ? `• Year ${mentor.year}` : ''}
                    </p>
                  </div>
                </div>

                <div className="mentor-card-tags">
                  {mentor.subjects?.slice(0, 3).map((subject) => (
                    <span key={subject} className="subject-pill">
                      {subject}
                    </span>
                  ))}
                  {mentor.subjects?.length > 3 && <span className="subject-pill">+{mentor.subjects.length - 3}</span>}
                </div>

                <div className="mentor-card-footer">
                  <div className="mentor-stats-row">
                    <div className="mentor-rating">{mentorRating ? `${mentorRating} ⭐` : 'New Mentor'}</div>
                    {hasTodaySlot && <div className="today-badge">🟢 Available today</div>}
                  </div>
                  <Link to={`/mentor/${mentor.id}`} className="btn-primary card-btn">
                    Book Session
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state-card card mt-4">
          <div className="empty-state-icon">🔍</div>
          <h3>No mentors found for this filter</h3>
          <p>Try adjusting your search criteria or clearing filters.</p>
          <button
            className="btn-secondary mt-3"
            onClick={() => {
              setSearch('');
              setActiveSubject('All');
              setActiveCourse('All');
              setActiveTime('Any Time');
              setActiveType('All');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
