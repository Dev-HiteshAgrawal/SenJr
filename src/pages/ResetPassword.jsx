import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';
import './Signup.css';

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await resetPassword(email.trim());
      setSuccess('Reset link sent. Check your inbox and spam folder.');
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Could not send the reset email. Please verify the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container login-page">
      <div className="login-wrapper animate-fade-in-up">
        <div className="login-header">
          <Link to="/" className="login-logo">
            Sen<span>jr</span> ⚡
          </Link>
          <h1 className="page-title">Reset Password</h1>
          <p className="page-subtitle">We will send you a secure link to get back into your account.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && (
          <div
            className="auth-error"
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              borderColor: 'rgba(16, 185, 129, 0.35)',
              color: '#34d399',
            }}
          >
            {success}
          </div>
        )}

        <div className="login-card card">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                className="glass-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="john@example.com"
              />
            </div>

            <button type="submit" className="btn-primary login-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>

        <p className="auth-footer-text">
          Remembered your password? <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
