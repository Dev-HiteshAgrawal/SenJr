import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './AITutor.css';

const TUTORS = [
  { id: 'maths', name: 'Arya', emoji: '🧮', subject: 'Maths', topics: ['JEE', 'Calculus', 'Algebra'], theme: 'theme-saffron' },
  { id: 'physics', name: 'Veda', emoji: '🔭', subject: 'Physics', topics: ['Mechanics', 'Optics', 'Thermodynamics'], theme: 'theme-blue' },
  { id: 'chemistry', name: 'Rasayan', emoji: '⚗️', subject: 'Chemistry', topics: ['Organic', 'Inorganic', 'Physical'], theme: 'theme-mint' },
  { id: 'biology', name: 'Jeev', emoji: '🧬', subject: 'Biology', topics: ['Botany', 'Zoology', 'NEET'], theme: 'theme-teal' },
  { id: 'english', name: 'Lekhak', emoji: '✍️', subject: 'English', topics: ['Grammar', 'Literature', 'IELTS'], theme: 'theme-pink' },
  { id: 'economics', name: 'Arth', emoji: '📊', subject: 'Economics', topics: ['Micro', 'Macro', 'Commerce'], theme: 'theme-purple' },
  { id: 'programming', name: 'CodeBot', emoji: '💻', subject: 'Programming', topics: ['Python', 'Java', 'DSA'], theme: 'theme-blue' },
  { id: 'ssc', name: 'Sarkar', emoji: '🏛️', subject: 'SSC & Govt', topics: ['CGL', 'CHSL', 'Banking'], theme: 'theme-saffron' },
  { id: 'upsc', name: 'Shasan', emoji: '🇮🇳', subject: 'UPSC & IAS', topics: ['Prelims', 'Mains', 'CSAT'], theme: 'theme-gold' },
  { id: 'history', name: 'Itihas', emoji: '📜', subject: 'History', topics: ['Ancient', 'Modern', 'Polity'], theme: 'theme-gold' },
  { id: 'ca', name: 'Nidhi', emoji: '📈', subject: 'CA & Commerce', topics: ['Accounts', 'Taxation', 'Law'], theme: 'theme-mint' },
  { id: 'law', name: 'Nyaya', emoji: '⚖️', subject: 'Law', topics: ['CLAT', 'Constitution', 'Criminal Law'], theme: 'theme-purple' },
  { id: 'aptitude', name: 'Tark', emoji: '🧠', subject: 'Aptitude', topics: ['Reasoning', 'Quant', 'Verbal'], theme: 'theme-teal' },
];

export default function AITutor() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  if (userProfile?.banned) {
    return (
      <div className="page-container animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="card" style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem 2rem' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🔒</span>
          <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', color: '#ff5c5c', marginBottom: '1rem' }}>AI Tutor Disabled</h1>
          <p style={{ color: 'var(--text-secondary)' }}>You cannot access the AI Tutor while on a study break.</p>
          <Link to="/student-dashboard" className="btn-primary mt-4">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in-up">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="page-title">Your AI Teachers — Available 24/7 ⚡</h1>
        <p className="page-subtitle">Pick a subject. Start learning right now.</p>
      </div>

      <div className="ai-tutor-grid">
        {TUTORS.map((tutor) => (
          <div 
            key={tutor.id}
            className={`tutor-card ${tutor.theme}`}
            onClick={() => navigate(`/ai-tutor/${tutor.id}`)}
          >
            <span className="tutor-emoji">{tutor.emoji}</span>
            <h2 className="tutor-name">{tutor.name}</h2>
            <div className="tutor-subject">{tutor.subject}</div>
            
            <div className="tutor-topics">
              {tutor.topics.map(topic => (
                <span key={topic} className="topic-chip">{topic}</span>
              ))}
            </div>

            <button className="start-learning-btn">
              Start Learning <span>→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
