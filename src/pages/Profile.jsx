import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateUser } from '../lib/firestore';
import './Signup.css';
import './Profile.css';

function normalizeSubjects(value) {
  return value
    .split(',')
    .map((subject) => subject.trim())
    .filter(Boolean);
}

export default function Profile() {
  const { currentUser, userProfile } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    photoURL: '',
    bio: '',
    college: '',
    course: '',
    year: '',
    language: 'English',
    linkedin: '',
    aboutMe: '',
    achievement: '',
    subjects: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userProfile && !currentUser) return;

    setFormData({
      displayName: userProfile?.displayName || currentUser?.displayName || '',
      photoURL: userProfile?.photoURL || currentUser?.photoURL || '',
      bio: userProfile?.bio || '',
      college: userProfile?.college || '',
      course: userProfile?.course || '',
      year: userProfile?.year || '',
      language: userProfile?.language || 'English',
      linkedin: userProfile?.linkedin || '',
      aboutMe: userProfile?.aboutMe || '',
      achievement: userProfile?.achievement || '',
      subjects: (userProfile?.subjects || []).join(', '),
    });
  }, [currentUser, userProfile]);

  const profileStats = useMemo(
    () => [
      {
        label: userProfile?.role === 'mentor' ? 'Sessions Given' : 'Sessions Completed',
        value: userProfile?.totalSessionsCompleted || 0,
      },
      {
        label: 'Current XP',
        value: userProfile?.xp || 0,
      },
      {
        label: userProfile?.role === 'mentor' ? 'Average Rating' : 'Current Streak',
        value: userProfile?.role === 'mentor' ? userProfile?.averageRating || '—' : `${userProfile?.streak || 0} days`,
      },
    ],
    [userProfile]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      await updateUser(currentUser.uid, {
        displayName: formData.displayName.trim(),
        photoURL: formData.photoURL.trim(),
        bio: formData.bio.trim(),
        college: formData.college.trim(),
        course: formData.course.trim(),
        year: formData.year.trim(),
        language: formData.language.trim(),
        linkedin: formData.linkedin.trim(),
        aboutMe: formData.aboutMe.trim(),
        achievement: formData.achievement.trim(),
        ...(userProfile?.role === 'mentor' ? { subjects: normalizeSubjects(formData.subjects) } : {}),
      });

      setMessage('Profile updated successfully.');
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Could not save your profile right now. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container profile-page animate-fade-in-up">
      <div className="profile-header">
        <div>
          <h1 className="page-title">Your Profile</h1>
          <p className="page-subtitle">Keep your profile fresh so students, mentors, and the platform all stay in sync.</p>
        </div>
        <div className="profile-stats-grid">
          {profileStats.map((stat) => (
            <div key={stat.label} className="card profile-stat-card">
              <span className="profile-stat-value">{stat.value}</span>
              <span className="profile-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}
      {message && (
        <div
          className="auth-error"
          style={{
            background: 'rgba(16, 185, 129, 0.12)',
            borderColor: 'rgba(16, 185, 129, 0.35)',
            color: '#34d399',
          }}
        >
          {message}
        </div>
      )}

      <form className="card profile-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Display Name</label>
            <input
              className="glass-input"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
              placeholder="Your public display name"
            />
          </div>
          <div className="form-group">
            <label>Photo URL</label>
            <input
              className="glass-input"
              name="photoURL"
              value={formData.photoURL}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="form-group">
          <label>Short Bio</label>
          <textarea
            className="glass-input"
            name="bio"
            rows="3"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell people what you are focused on right now."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>College / University</label>
            <input className="glass-input" name="college" value={formData.college} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Course</label>
            <input className="glass-input" name="course" value={formData.course} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Year</label>
            <input className="glass-input" name="year" value={formData.year} onChange={handleChange} placeholder="1st, 2nd, 3rd..." />
          </div>
          <div className="form-group">
            <label>Language</label>
            <input className="glass-input" name="language" value={formData.language} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>LinkedIn</label>
          <input className="glass-input" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
        </div>

        {userProfile?.role === 'mentor' && (
          <>
            <div className="form-group">
              <label>About Me</label>
              <textarea
                className="glass-input"
                name="aboutMe"
                rows="4"
                value={formData.aboutMe}
                onChange={handleChange}
                placeholder="What should juniors know about your teaching style and background?"
              />
            </div>

            <div className="form-group">
              <label>Subjects</label>
              <input
                className="glass-input"
                name="subjects"
                value={formData.subjects}
                onChange={handleChange}
                placeholder="Maths, Physics, Programming"
              />
            </div>

            <div className="form-group">
              <label>Biggest Achievement</label>
              <textarea
                className="glass-input"
                name="achievement"
                rows="3"
                value={formData.achievement}
                onChange={handleChange}
                placeholder="Dean's list, internship, research, competition..."
              />
            </div>
          </>
        )}

        <div className="profile-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
