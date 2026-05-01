import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateUser } from '../lib/firestore';
import './MentorSetup.css';

const AVATAR_COLORS = [
  '#FF6B00', '#34A853', '#4285F4', '#EA4335', 
  '#9C27B0', '#00BCD4', '#FFC107', '#E91E63'
];

const SUBJECTS_LIST = [
  'Maths', 'Physics', 'Chemistry', 'Biology', 
  'History', 'Economics', 'English', 'Programming', 
  'Business', 'Accounts', 'General Studies'
];

export default function MentorSetup() {
  const { userProfile, currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    avatarColor: AVATAR_COLORS[0],
    aboutMe: '',
    college: '',
    course: '',
    subjects: [],
    language: 'English',
    achievement: '',
    linkedin: ''
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load existing data if available
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        college: userProfile.college || '',
        course: userProfile.course || '',
        subjects: userProfile.subjects || [],
        aboutMe: userProfile.aboutMe || '',
        language: userProfile.language || 'English',
        achievement: userProfile.achievement || '',
        linkedin: userProfile.linkedin || '',
        avatarColor: userProfile.avatarColor || AVATAR_COLORS[0]
      }));
    }
  }, [userProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubjectToggle = (subject) => {
    setFormData(prev => {
      const isSelected = prev.subjects.includes(subject);
      if (isSelected) {
        return { ...prev, subjects: prev.subjects.filter(s => s !== subject) };
      } else {
        return { ...prev, subjects: [...prev.subjects, subject] };
      }
    });
  };

  const calculateProgress = () => {
    let completed = 0;
    let total = 7; // excluding linkedin as optional, avatar always has default

    if (formData.aboutMe.trim().length > 0) completed++;
    if (formData.college.trim().length > 0) completed++;
    if (formData.course.trim().length > 0) completed++;
    if (formData.subjects.length > 0) completed++;
    if (formData.language) completed++;
    if (formData.achievement.trim().length > 0) completed++;
    
    // Add small bonus for linkedin
    let percentage = Math.round((completed / total) * 100);
    if (formData.linkedin.trim().length > 0 && percentage < 100) percentage += 5;
    
    return Math.min(percentage, 100);
  };

  const progress = calculateProgress();
  const displayName = userProfile?.displayName || currentUser?.displayName || 'Mentor';
  const initial = displayName.charAt(0).toUpperCase();

  const handleSave = async () => {
    if (!currentUser?.uid) return;
    setSaving(true);
    setError('');

    try {
      await updateUser(currentUser.uid, {
        ...formData,
        profileSetupComplete: true
      });
      navigate('/mentor-dashboard');
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container setup-page">
      
      <div className="setup-header">
        <div className="progress-container">
          <div className="progress-text">
            Profile {progress}% complete {progress < 100 && '— finish your setup.'}
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <h1 className="page-title">Set up your Mentor Profile</h1>
        <p className="page-subtitle">Craft your public persona.</p>
      </div>

      <div className="setup-layout">
        
        {/* Left Form Column */}
        <div className="setup-form-column">
          {error && <div className="auth-error">{error}</div>}

          <div className="setup-card card">
            
            {/* Avatar Selection */}
            <div className="form-section">
              <label>Avatar Color</label>
              <div className="avatar-options">
                {AVATAR_COLORS.map(color => (
                  <button
                    key={color}
                    className={`avatar-circle ${formData.avatarColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, avatarColor: color })}
                  >
                    {initial}
                  </button>
                ))}
              </div>
            </div>

            {/* About Me */}
            <div className="form-section">
              <div className="label-row">
                <label>About Me</label>
                <span className={`char-count ${formData.aboutMe.length > 200 ? 'error-text' : ''}`}>
                  {formData.aboutMe.length}/200
                </span>
              </div>
              <textarea 
                className="glass-input" 
                name="aboutMe"
                rows="3"
                value={formData.aboutMe}
                onChange={handleChange}
                placeholder="I'm passionate about helping others understand complex topics clearly."
                maxLength="200"
              ></textarea>
            </div>

            {/* Education */}
            <div className="form-row">
              <div className="form-group">
                <label>College Name</label>
                <input 
                  type="text" 
                  name="college" 
                  className="glass-input"
                  value={formData.college} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label>Course</label>
                <input 
                  type="text" 
                  name="course" 
                  className="glass-input"
                  value={formData.course} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Subjects */}
            <div className="form-section">
              <label>Subjects I can teach</label>
              <div className="subjects-grid">
                {SUBJECTS_LIST.map(subject => (
                  <button
                    key={subject}
                    type="button"
                    className={`subject-pill ${formData.subjects.includes(subject) ? 'active' : ''}`}
                    onClick={() => handleSubjectToggle(subject)}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="form-section">
              <label>Language I teach in</label>
              <div className="radio-group">
                {['English', 'French', 'Spanish', 'Arabic', 'Mandarin', 'Hindi', 'Other'].map(lang => (
                  <label key={lang} className="radio-label">
                    <input 
                      type="radio" 
                      name="language" 
                      value={lang}
                      checked={formData.language === lang}
                      onChange={handleChange}
                    />
                    <span className="radio-custom"></span>
                    {lang}
                  </label>
                ))}
              </div>
            </div>

            {/* Biggest Achievement */}
            <div className="form-section">
              <label>My Biggest Achievement</label>
              <textarea 
                className="glass-input" 
                name="achievement"
                rows="2"
                value={formData.achievement}
                onChange={handleChange}
                placeholder="e.g. Dean's List 2023, Published research paper, Placed at Google"
              ></textarea>
            </div>

            {/* LinkedIn */}
            <div className="form-section">
              <label>LinkedIn Profile URL (Optional)</label>
              <input 
                type="url" 
                name="linkedin" 
                className="glass-input"
                value={formData.linkedin} 
                onChange={handleChange} 
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>

            <div className="setup-actions">
              <button 
                className="btn-primary full-width" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Go to Dashboard'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Column */}
        <div className="setup-preview-column">
          <div className="preview-sticky">
            <h3 className="preview-title">Live Preview</h3>
            
            <div className="mentor-preview-card card">
              <div className="preview-header-section">
                <div 
                  className="preview-avatar"
                  style={{ backgroundColor: formData.avatarColor }}
                >
                  {initial}
                </div>
                <div className="preview-info">
                  <h4>{displayName} <span className="verified-icon">✅</span></h4>
                  <p className="preview-college">
                    {formData.course || 'Course'} • {formData.college || 'College Name'}
                  </p>
                </div>
              </div>

              <div className="preview-about">
                {formData.aboutMe || "About me snippet will appear here. Write something catchy!"}
              </div>

              <div className="preview-achievement">
                <span className="achievement-icon">🏆</span>
                <span>{formData.achievement || "Your biggest achievement here"}</span>
              </div>

              <div className="preview-meta">
                <div className="meta-item">
                  <span className="meta-icon">🗣️</span>
                  {formData.language}
                </div>
              </div>

              <div className="preview-subjects">
                {formData.subjects.length > 0 ? (
                  formData.subjects.map(sub => (
                    <span key={sub} className="preview-pill">{sub}</span>
                  ))
                ) : (
                  <span className="preview-pill empty">Select subjects</span>
                )}
              </div>

              <button className="btn-primary preview-cta" disabled>
                Book a Session
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
