import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAuthErrorMessage } from '../lib/authErrors';
import { getUser, serverTimestamp } from '../lib/firestore';
import { ALL_SUBJECT_OPTIONS, SUBJECT_CATEGORIES, YEAR_OPTIONS } from '../lib/subjectCatalog';
import './Signup.css';

const AUTH_SECTION_SEPARATOR = 'Create your account';
const CATEGORY_FILTERS = ['All', ...SUBJECT_CATEGORIES];
const TEACHING_LANGUAGE_OPTIONS = ['Hindi only', 'English only', 'Both'];

function getDashboardRoute(role) {
  return role === 'mentor' ? '/mentor-dashboard' : '/student-dashboard';
}

function defaultIntroMessage(role) {
  return role === 'mentor'
    ? 'Teach juniors, earn money, get certificate'
    : 'Find a senior mentor, learn faster';
}

function createInitialState(prefill = {}) {
  return {
    name: prefill.name || prefill.displayName || '',
    email: prefill.email || '',
    password: '',
    year: '',
    college: '',
    city: '',
    subjects: [],
    aboutMe: '',
    teachingLanguage: 'Both',
  };
}

function SubjectSelector({ label, selectedSubjects, onToggle }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredSubjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return ALL_SUBJECT_OPTIONS.filter((option) => {
      const matchesCategory = activeCategory === 'All' || option.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        option.label.toLowerCase().includes(normalizedSearch) ||
        option.category.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  return (
    <div className="subject-selector">
      <div className="label-row">
        <label>{label}</label>
        <span className="helper-text">{selectedSubjects.length} selected</span>
      </div>

      {selectedSubjects.length > 0 && (
        <div className="selected-subjects">
          {selectedSubjects.map((subject) => (
            <button
              key={subject}
              type="button"
              className="selected-subject-chip"
              onClick={() => onToggle(subject)}
            >
              <span>{subject}</span>
              <span aria-hidden="true">x</span>
            </button>
          ))}
        </div>
      )}

      <input
        type="text"
        className="glass-input"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search subject, exam, or course..."
      />

      <div className="category-chip-row">
        {CATEGORY_FILTERS.map((category) => (
          <button
            key={category}
            type="button"
            className={`category-chip ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="subject-option-list">
        {filteredSubjects.map((option) => {
          const selected = selectedSubjects.includes(option.label);

          return (
            <button
              key={`${option.category}-${option.label}`}
              type="button"
              className={`subject-option ${selected ? 'active' : ''}`}
              onClick={() => onToggle(option.label)}
            >
              <div>
                <div className="subject-option-title">{option.label}</div>
                <div className="subject-option-category">{option.category}</div>
              </div>
              <span className="subject-option-check">{selected ? 'Selected' : 'Add'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Signup() {
  const { currentUser, userProfile, signUpWithEmail, signInWithGoogle, completeRegistration } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const prefill = location.state?.prefill || {};
  const [step, setStep] = useState(location.state?.role ? 2 : 1);
  const [role, setRole] = useState(location.state?.role || null);
  const [formData, setFormData] = useState(() => createInitialState(prefill));
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successRoute, setSuccessRoute] = useState('/student-dashboard');

  const hasPendingGoogleSignup = Boolean(currentUser && !userProfile);

  useEffect(() => {
    if (currentUser && userProfile?.role) {
      navigate(getDashboardRoute(userProfile.role), { replace: true });
    }
  }, [currentUser, navigate, userProfile]);

  useEffect(() => {
    if (!prefill.name && !prefill.email && !currentUser) return;

    setFormData((prev) => ({
      ...prev,
      name: prev.name || prefill.name || currentUser?.displayName || '',
      email: prev.email || prefill.email || currentUser?.email || '',
    }));
  }, [currentUser, prefill.email, prefill.name]);

  useEffect(() => {
    if (step !== 3) return undefined;

    const timer = window.setTimeout(() => {
      navigate(successRoute, { replace: true });
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [navigate, step, successRoute]);

  if (currentUser && userProfile?.role) {
    return <Navigate to={getDashboardRoute(userProfile.role)} replace />;
  }

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const toggleSubject = (subject) => {
    updateField(
      'subjects',
      formData.subjects.includes(subject)
        ? formData.subjects.filter((item) => item !== subject)
        : [...formData.subjects, subject]
    );
  };

  const validateForm = ({ requireAuth }) => {
    const errors = {};

    if (!role) errors.role = 'Please choose how you want to join Senjr.';
    if (!formData.name.trim()) errors.name = 'Full Name is required.';
    if (!formData.year) errors.year = 'Year of Study is required.';
    if (!formData.college.trim()) errors.college = 'College / Institution Name is required.';
    if (!formData.city.trim()) errors.city = 'City is required.';
    if (formData.subjects.length === 0) errors.subjects = 'Select at least one subject, exam, or course.';
    if (role === 'mentor' && !formData.teachingLanguage) {
      errors.teachingLanguage = 'Choose your teaching language.';
    }

    if (requireAuth) {
      if (!formData.email.trim()) errors.email = 'Email is required.';
      if (!formData.password.trim()) errors.password = 'Password is required.';
      if (formData.password.trim() && formData.password.trim().length < 6) {
        errors.password = 'Password must be at least 6 characters.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveProfileAndContinue = async (authUser) => {
    const profilePayload = {
      uid: authUser.uid,
      name: formData.name.trim(),
      displayName: formData.name.trim(),
      email: authUser.email || formData.email.trim(),
      photoURL: authUser.photoURL || '',
      role,
      year: formData.year,
      college: formData.college.trim(),
      city: formData.city.trim(),
      subjects: formData.subjects,
      course: formData.subjects[0] || '',
      aboutMe: role === 'mentor' ? formData.aboutMe.trim() : '',
      bio: role === 'mentor' ? formData.aboutMe.trim() : '',
      teachingLanguage: role === 'mentor' ? formData.teachingLanguage : '',
      language: role === 'mentor' ? formData.teachingLanguage : '',
      xp: 0,
      level: 'Seedling',
      streak: 0,
      missCount: 0,
      miss_count: 0,
      banned: false,
      createdAt: serverTimestamp(),
    };

    await completeRegistration(authUser.uid, profilePayload);
    setSuccessRoute(getDashboardRoute(role));
    setStep(3);
  };

  const handleEmailSignup = async (event) => {
    event.preventDefault();
    if (hasPendingGoogleSignup) {
      setFormError('You already started with Google. Finish signup with Google to keep the same account.');
      return;
    }

    setFormError('');
    if (!validateForm({ requireAuth: true })) return;

    setIsSubmitting(true);

    try {
      const credential = await signUpWithEmail(
        formData.email.trim(),
        formData.password.trim(),
        formData.name.trim()
      );

      await saveProfileAndContinue(credential.user);
    } catch (error) {
      console.error('Email signup error:', error);
      setFormError(getAuthErrorMessage(error.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setFormError('');
    if (!validateForm({ requireAuth: false })) return;

    setIsSubmitting(true);

    try {
      const credential = hasPendingGoogleSignup ? { user: currentUser } : await signInWithGoogle();
      const existingProfile = await getUser(credential.user.uid);

      if (existingProfile?.role) {
        navigate(getDashboardRoute(existingProfile.role), { replace: true });
        return;
      }

      await saveProfileAndContinue(credential.user);
    } catch (error) {
      console.error('Google signup error:', error);
      setFormError(getAuthErrorMessage(error.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <div className="page-container signup-page">
        <div className="signup-wrapper animate-fade-in-up">
          <div className="card success-card">
            <div className="success-icon">Welcome to Senjr! 🎉</div>
            <h1 className="page-title">Setting up your profile...</h1>
            <p className="page-subtitle">We’re getting your dashboard ready.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container signup-page">
      <div className="signup-wrapper animate-fade-in-up">
        <div className="signup-header">
          <h1 className="page-title">Join Senjr</h1>
          <p className="page-subtitle">
            {step === 1 ? 'Choose your path first.' : `Tell us a bit about yourself${role ? ` as a ${role}` : ''}.`}
          </p>
        </div>

        {formError && <div className="auth-error">{formError}</div>}

        {step === 1 && (
          <>
            <div className="role-selection-grid">
              <button type="button" className="role-selection-card card" onClick={() => { setRole('student'); setStep(2); }}>
                <div className="role-icon">🎓</div>
                <h2>I am a Student</h2>
                <p>{defaultIntroMessage('student')}</p>
              </button>

              <button type="button" className="role-selection-card card" onClick={() => { setRole('mentor'); setStep(2); }}>
                <div className="role-icon">⭐</div>
                <h2>I am a Mentor</h2>
                <p>{defaultIntroMessage('mentor')}</p>
              </button>
            </div>

            <p className="auth-footer-text">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </>
        )}

        {step === 2 && (
          <div className="card signup-form-shell">
            <div className="signup-form-header">
              <button type="button" className="step-back-btn" onClick={() => setStep(1)}>
                ← Back
              </button>
              <div className="role-pill">{role === 'mentor' ? 'Mentor onboarding' : 'Student onboarding'}</div>
            </div>

            {hasPendingGoogleSignup && (
              <div className="signup-info-banner">
                Continuing with Google as <strong>{currentUser?.email}</strong>.
              </div>
            )}

            <form className="signup-form" onSubmit={handleEmailSignup}>
              <div className="form-group">
                <label htmlFor="signup-name">Full Name</label>
                <input
                  id="signup-name"
                  type="text"
                  className={`glass-input ${fieldErrors.name ? 'input-error' : ''}`}
                  value={formData.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Enter your full name"
                />
                {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="signup-year">Year of Study</label>
                <select
                  id="signup-year"
                  className={`glass-input ${fieldErrors.year ? 'input-error' : ''}`}
                  value={formData.year}
                  onChange={(event) => updateField('year', event.target.value)}
                >
                  <option value="">Select your year</option>
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {fieldErrors.year && <span className="field-error">{fieldErrors.year}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="signup-college">College / Institution Name</label>
                <input
                  id="signup-college"
                  type="text"
                  className={`glass-input ${fieldErrors.college ? 'input-error' : ''}`}
                  value={formData.college}
                  onChange={(event) => updateField('college', event.target.value)}
                  placeholder="IIT Delhi, VIT, DU, AIIMS..."
                />
                {fieldErrors.college && <span className="field-error">{fieldErrors.college}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="signup-city">City</label>
                <input
                  id="signup-city"
                  type="text"
                  className={`glass-input ${fieldErrors.city ? 'input-error' : ''}`}
                  value={formData.city}
                  onChange={(event) => updateField('city', event.target.value)}
                  placeholder="Delhi, Pune, Bengaluru..."
                />
                {fieldErrors.city && <span className="field-error">{fieldErrors.city}</span>}
              </div>

              <div className="form-group">
                <SubjectSelector
                  label={role === 'mentor' ? 'What can you teach?' : 'What do you want to learn?'}
                  selectedSubjects={formData.subjects}
                  onToggle={toggleSubject}
                />
                {fieldErrors.subjects && <span className="field-error">{fieldErrors.subjects}</span>}
              </div>

              {role === 'mentor' && (
                <>
                  <div className="form-group">
                    <div className="label-row">
                      <label htmlFor="signup-about-me">About Me</label>
                      <span className="helper-text">{formData.aboutMe.length}/200</span>
                    </div>
                    <textarea
                      id="signup-about-me"
                      className="glass-input"
                      rows="3"
                      maxLength="200"
                      value={formData.aboutMe}
                      onChange={(event) => updateField('aboutMe', event.target.value)}
                      placeholder="Your biggest achievement? e.g. Scored AIR 247 in JEE 2024"
                    />
                  </div>

                  <div className="form-group">
                    <label>Teaching Language</label>
                    <div className="radio-group">
                      {TEACHING_LANGUAGE_OPTIONS.map((option) => (
                        <label key={option} className="radio-card">
                          <input
                            type="radio"
                            name="teachingLanguage"
                            value={option}
                            checked={formData.teachingLanguage === option}
                            onChange={(event) => updateField('teachingLanguage', event.target.value)}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                    {fieldErrors.teachingLanguage && (
                      <span className="field-error">{fieldErrors.teachingLanguage}</span>
                    )}
                  </div>
                </>
              )}

              <div className="auth-section">
                <div className="auth-section-title">{AUTH_SECTION_SEPARATOR}</div>

                <div className="form-group">
                  <label htmlFor="signup-email">Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    className={`glass-input ${fieldErrors.email ? 'input-error' : ''}`}
                    value={formData.email}
                    disabled={hasPendingGoogleSignup}
                    onChange={(event) => updateField('email', event.target.value)}
                    placeholder="you@example.com"
                  />
                  {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <input
                    id="signup-password"
                    type="password"
                    className={`glass-input ${fieldErrors.password ? 'input-error' : ''}`}
                    value={formData.password}
                    disabled={hasPendingGoogleSignup}
                    onChange={(event) => updateField('password', event.target.value)}
                    placeholder="Minimum 6 characters"
                  />
                  {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
                </div>

                <button type="submit" className="btn-primary auth-submit-btn" disabled={isSubmitting || hasPendingGoogleSignup}>
                  {isSubmitting ? 'Creating account...' : 'Sign Up with Email'}
                </button>

                <div className="auth-divider">
                  <span>OR</span>
                </div>

                <button type="button" className="btn-secondary google-auth-btn" onClick={handleGoogleSignup} disabled={isSubmitting}>
                  Continue with Google
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
