import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateUser } from '../lib/firestore';
import { COURSES } from '../lib/coursesData';
import './FreeCourses.css';

const CATEGORIES = ['All', 'Tech', 'Business', 'Design', 'Science', 'Language', 'Life Skills'];

export default function FreeCourses() {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('Discover All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [bookmarks, setBookmarks] = useState(new Set());
  const [savedCoursesData, setSavedCoursesData] = useState([]);
  const [toast, setToast] = useState(null);

  // Initialize bookmarks from user profile
  useEffect(() => {
    if (userProfile?.savedCourses) {
      setSavedCoursesData(userProfile.savedCourses);
      setBookmarks(new Set(userProfile.savedCourses.map(sc => sc.id)));
    }
  }, [userProfile]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleBookmark = async (id) => {
    if (!currentUser) {
      alert("Please log in to save courses!");
      return;
    }

    const isSaved = bookmarks.has(id);
    const newBookmarks = new Set(bookmarks);
    let newSavedCourses = [...savedCoursesData];

    if (isSaved) {
      newBookmarks.delete(id);
      newSavedCourses = newSavedCourses.filter(sc => sc.id !== id);
    } else {
      newBookmarks.add(id);
      newSavedCourses.push({ id, status: 'Not Started yet' });
      showToast("Course saved to your list ✓");
    }

    setBookmarks(newBookmarks);
    setSavedCoursesData(newSavedCourses);

    try {
      await updateUser(currentUser.uid, { savedCourses: newSavedCourses });
    } catch (err) {
      console.error("Failed to update saved courses", err);
    }
  };

  // Filter Logic
  let displayCourses = COURSES;
  
  if (activeTab === 'My Saved Courses') {
    displayCourses = COURSES.filter(c => bookmarks.has(c.id));
  }

  const filteredCourses = activeCategory === 'All' 
    ? displayCourses 
    : displayCourses.filter(course => course.category === activeCategory);

  return (
    <div className="page-container animate-fade-in-up">
      <div className="courses-header">
        <h1 className="page-title">Free Certified Courses — Hidden Gems 💎</h1>
        <p className="page-subtitle">These world-class courses are 100% free. Most people don't know they exist. Now you do.</p>
      </div>

      {/* Tabs */}
      <div className="courses-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={`btn-secondary ${activeTab === 'Discover All' ? 'active-tab' : ''}`}
          style={activeTab === 'Discover All' ? { background: 'var(--accent-saffron)', color: '#fff' } : {}}
          onClick={() => setActiveTab('Discover All')}
        >
          Discover All
        </button>
        <button 
          className={`btn-secondary ${activeTab === 'My Saved Courses' ? 'active-tab' : ''}`}
          style={activeTab === 'My Saved Courses' ? { background: 'var(--accent-saffron)', color: '#fff' } : {}}
          onClick={() => {
            if (!currentUser) {
               alert("Please log in to view saved courses.");
               return;
            }
            setActiveTab('My Saved Courses')
          }}
        >
          My Saved Courses
        </button>
      </div>

      <div className="courses-filter-bar">
        {CATEGORIES.map(category => (
          <button
            key={category}
            className={`filter-pill ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="courses-grid">
        {filteredCourses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-card-header">
              <span className={`provider-badge ${course.providerClass}`}>
                {course.provider}
              </span>
              <button 
                className={`bookmark-btn ${bookmarks.has(course.id) ? 'active' : ''}`}
                onClick={() => toggleBookmark(course.id)}
                title={bookmarks.has(course.id) ? "Remove Bookmark" : "Save Course"}
              >
                {bookmarks.has(course.id) ? '🌟' : '🔖'}
              </button>
            </div>
            
            <h2 className="course-title">{course.title}</h2>
            
            <div className="course-meta">
              <div className="course-meta-item">
                <span>⏱️</span> {course.duration}
              </div>
              <div className="course-meta-item">
                <span>📈</span> {course.difficulty}
              </div>
            </div>

            <div className="course-badges">
              <span className={`cert-badge ${course.certType}`}>
                {course.certText}
              </span>
            </div>

            <div className="course-footer">
              <a 
                href={course.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="enroll-btn"
              >
                Enroll Now <span>→</span>
              </a>
            </div>
          </div>
        ))}
        {filteredCourses.length === 0 && activeTab === 'My Saved Courses' && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            You haven't saved any courses yet. Go to Discover All to find some hidden gems!
          </div>
        )}
      </div>

      {toast && (
        <div className="toast-notification animate-fade-in-up" style={{
          position: 'fixed', bottom: '2rem', right: '2rem', 
          background: 'var(--accent-mint)', color: 'var(--bg-primary)',
          padding: '1rem 1.5rem', borderRadius: '8px', fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 1000
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
