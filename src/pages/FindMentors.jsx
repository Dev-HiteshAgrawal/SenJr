import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getDocumentsPaginated, COLLECTIONS, where, orderBy } from '../lib/firestore';
import './FindMentors.css';

const SUBJECTS = ['All', 'Maths', 'Physics', 'Chemistry', 'Biology', 'History', 'Economics', 'English', 'Programming', 'Business', 'JEE Prep', 'NEET Prep', 'CUET Prep'];
const COURSES = ['All', 'BTech / BEng', 'BBA / Business', 'BSc', 'BA', 'BCom / Finance', 'MBA', 'Other'];
const TIMES = ['Any Time', 'Morning (6AM-12PM)', 'Afternoon (12PM-5PM)', 'Evening (5PM-9PM)'];
const SESSION_TYPES = ['All', '1-on-1', 'Group (max 4)'];

export default function FindMentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [activeSubject, setActiveSubject] = useState('All');
  const [activeCourse, setActiveCourse] = useState('All');
  const [activeTime, setActiveTime] = useState('Any Time');
  const [activeType, setActiveType] = useState('All');
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const PAGE_SIZE = 12;

  const fetchMentors = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const constraints = [
        where('role', '==', 'mentor'),
        orderBy('displayName', 'asc')
      ];

      if (activeSubject !== 'All') {
        constraints.push(where('subjects', 'array-contains', activeSubject));
      }
      if (activeCourse !== 'All') {
        constraints.push(where('course', '==', activeCourse));
      }

      const result = await getDocumentsPaginated(
        COLLECTIONS.USERS,
        PAGE_SIZE,
        isLoadMore ? lastDoc : null,
        ...constraints
      );

      const newMentors = result.docs;

      setMentors(prev => isLoadMore ? [...prev, ...newMentors] : newMentors);
      setLastDoc(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Error fetching mentors:', err);
      // If index is missing, we might want to fallback to just role filter
      if (err.code === 'failed-precondition') {
        console.warn('Falling back to client-side filtering due to missing Firestore index.');
        const fallbackResult = await getDocumentsPaginated(
          COLLECTIONS.USERS,
          PAGE_SIZE,
          isLoadMore ? lastDoc : null,
          where('role', '==', 'mentor')
          // Removed orderBy in fallback for maximum compatibility
        );
        const newMentors = fallbackResult.docs;
        setMentors(prev => isLoadMore ? [...prev, ...newMentors] : newMentors);
        setLastDoc(fallbackResult.lastVisible);
        setHasMore(fallbackResult.hasMore);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [lastDoc, activeSubject, activeCourse]);

  useEffect(() => {
    // Reset state and fetch from beginning when filters change
    setMentors([]);
    setLastDoc(null);
    setHasMore(false);
    fetchMentors(false);
  }, [activeSubject, activeCourse]);

  // When filters that should be server-side change, we would normally re-fetch.
  // For now, since we only query by role to avoid index issues, we keep filters client-side.
  // But if we had more mentors, we'd move these to the query.

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
    if (mentor.banned) return false;

    if (search.trim()) {
      const query = search.toLowerCase();
      const matchesName = mentor.displayName?.toLowerCase().includes(query) || false;
      const matchesCollege = mentor.college?.toLowerCase().includes(query) || false;
      const matchesSubject = mentor.subjects?.some((subject) => subject.toLowerCase().includes(query)) || false;
      if (!matchesName && !matchesCollege && !matchesSubject) return false;
    }

    // Only apply client-side if we haven't already filtered on the server (though it doesn't hurt to re-check)
    if (activeSubject !== 'All' && !mentor.subjects?.includes(activeSubject)) return false;
    if (activeCourse !== 'All' && mentor.course !== activeCourse) return false;
    if (!hasSlotMatching(mentor.availability, activeTime, activeType)) return false;

    return true;
  });

  return (
    <div className="page-container find-mentors-page animate-fade-in-up">
      <header className="page-header">
        <h1 className="page-title">Find your Senior</h1>
        <p className="page-subtitle">Connect with verified seniors who have walked the path before you.</p>
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
      ) : (
        <>
          {filteredMentors.length > 0 ? (
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

          {hasMore && (
            <div className="load-more-container">
              <button
                className="btn-secondary load-more-btn"
                onClick={() => fetchMentors(true)}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'Load More Seniors'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
