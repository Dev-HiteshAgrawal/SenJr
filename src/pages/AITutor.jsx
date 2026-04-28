import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './AITutor.css';

const TUTORS = [
  {
    id: 'maths',
    name: 'Nova',
    emoji: '🧮',
    subject: 'Maths',
    topics: ['JEE Maths', 'Algebra', 'Calculus', 'Statistics'],
    theme: 'theme-saffron'
  },
  {
    id: 'science',
    name: 'Atom',
    emoji: '⚗️',
    subject: 'Science',
    topics: ['NEET Physics', 'NEET Chemistry', 'JEE Physics', 'JEE Chemistry'],
    theme: 'theme-mint'
  },
  {
    id: 'history',
    name: 'Sage',
    emoji: '📜',
    subject: 'History',
    topics: ['Ancient', 'Medieval', 'Modern', 'World History'],
    theme: 'theme-gold'
  },
  {
    id: 'economics',
    name: 'Axis',
    emoji: '📊',
    subject: 'Economics & Business',
    topics: ['Micro', 'Macro', 'Commerce', 'Finance'],
    theme: 'theme-blue'
  },
  {
    id: 'english',
    name: 'Quill',
    emoji: '✍️',
    subject: 'English & Writing',
    topics: ['CUET English', 'IELTS', 'Grammar', 'Literature'],
    theme: 'theme-pink'
  },
  {
    id: 'programming',
    name: 'CodeBot',
    emoji: '💻',
    subject: 'Programming',
    topics: ['Python', 'Java', 'Web Dev', 'DSA'],
    theme: 'theme-purple'
  },
  {
    id: 'geography',
    name: 'Terra',
    emoji: '🌍',
    subject: 'Geography',
    topics: ['Maps', 'Climate', 'Physical Geography'],
    theme: 'theme-green'
  },
  {
    id: 'biology',
    name: 'Gene',
    emoji: '🧬',
    subject: 'Biology Deep Dive',
    topics: ['Human body', 'Genetics', 'Ecology'],
    theme: 'theme-teal'
  }
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
