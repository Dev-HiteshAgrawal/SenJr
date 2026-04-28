import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Signup.css';

const COURSES = ['BTech / BEng', 'BBA / Business', 'BA', 'BSc', 'BCom / Finance', 'MBA', 'Diploma', 'Other'];
const SUBJECTS = [
  'Maths', 'Physics', 'Chemistry', 'Biology', 
  'History', 'Economics', 'English', 'Programming', 
  'Business Studies', 'Accounts', 'JEE Prep', 'NEET Prep', 'CUET Prep'
];

export default function Signup() {
  const { signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null); // 'student' or 'mentor'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    course: '',
    year: '',
    subjects: [] // For mentors only
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const additionalData = {
        role,
        college: formData.college,
        course: formData.course,
        year: formData.year,
      };

      if (role === 'mentor') {
        additionalData.subjects = formData.subjects;
      }

      await signUpWithEmail(formData.email, formData.password, formData.name, additionalData);
      
      navigate(role === 'mentor' ? '/mentor-setup' : '/student-dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container signup-page">
      <div className="signup-wrapper animate-fade-in-up">
        
        <div className="signup-header">
          <h1 className="page-title">Join Senjr</h1>
          <p className="page-subtitle">
            {step === 1 ? 'Choose how you want to use the platform.' : `Create your ${role} account.`}
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {step === 1 && (
          <div className="role-selection">
            <button 
              className="role-card card"
              onClick={() => handleRoleSelect('student')}
            >
              <div className="role-icon">🎓</div>
              <h3>I am a Student</h3>
              <p>I want to find a mentor and level up</p>
            </button>

            <button 
              className="role-card card"
              onClick={() => handleRoleSelect('mentor')}
            >
              <div className="role-icon">⭐</div>
              <h3>I am a Mentor</h3>
              <p>I want to teach juniors and earn</p>
            </button>
          </div>
        )}

        {step === 2 && (
          <form className="signup-form card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                className="glass-input"
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                className="glass-input"
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                className="glass-input"
                value={formData.password} 
                onChange={handleChange} 
                required 
                placeholder="Min. 6 characters"
                minLength="6"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>University / College Name</label>
                <input 
                  type="text" 
                  name="college" 
                  className="glass-input"
                  value={formData.college} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. IIT Delhi, VIT, MIT, Oxford"
                />
              </div>

              <div className="form-group">
                <label>Course</label>
                <select name="course" className="glass-input" value={formData.course} onChange={handleChange} required>
                  <option value="" disabled>Select Course</option>
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Year of Study</label>
              <select name="year" className="glass-input" value={formData.year} onChange={handleChange} required>
                <option value="" disabled>Select Year</option>
                {role === 'student' && <option value="1st">1st Year</option>}
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>

            {role === 'mentor' && (
              <div className="form-group">
                <label>Subjects I can teach (Select multiple)</label>
                <div className="subjects-grid">
                  {SUBJECTS.map(subject => (
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
            )}

            <div className="form-actions">
              <button type="button" className="btn-secondary btn-back" onClick={() => setStep(1)}>
                Back
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating Account...' : 'Complete Signup'}
              </button>
            </div>
          </form>
        )}

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}
