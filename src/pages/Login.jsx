import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAuthErrorMessage } from '../lib/authErrors';
import { getUser } from '../lib/firestore';
import './Login.css';

function getDashboardRoute(role) {
  return role === 'mentor' ? '/mentor-dashboard' : '/student-dashboard';
}

export default function Login() {
  const { currentUser, userProfile, signInWithEmail, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser && userProfile?.role) {
      navigate(getDashboardRoute(userProfile.role), { replace: true });
    }
  }, [currentUser, navigate, userProfile]);

  if (currentUser && userProfile?.role) {
    return <Navigate to={getDashboardRoute(userProfile.role)} replace />;
  }

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
    setMessage('');
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const credential = await signInWithEmail(formData.email.trim(), formData.password);
      const profile = await getUser(credential.user.uid);

      if (profile?.role) {
        navigate(location.state?.from?.pathname || getDashboardRoute(profile.role), { replace: true });
        return;
      }

      navigate('/signup', {
        replace: true,
        state: {
          prefill: {
            name: credential.user.displayName || '',
            email: credential.user.email || formData.email.trim(),
          },
        },
      });
    } catch (authError) {
      console.error('Login error:', authError);
      setError(getAuthErrorMessage(authError.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const credential = await signInWithGoogle();
      const profile = await getUser(credential.user.uid);

      if (profile?.role) {
        navigate(location.state?.from?.pathname || getDashboardRoute(profile.role), { replace: true });
        return;
      }

      navigate('/signup', {
        replace: true,
        state: {
          googleSignup: true,
          prefill: {
            name: credential.user.displayName || '',
            email: credential.user.email || '',
          },
        },
      });
    } catch (authError) {
      console.error('Google login error:', authError);
      setError(getAuthErrorMessage(authError.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      setError('Please enter your email so we can send a reset link.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await resetPassword(formData.email.trim());
      setMessage("We've sent a reset link to your email. Check your spam folder if it's missing.");
    } catch (authError) {
      console.error('Reset password error:', authError);
      setError(getAuthErrorMessage(authError.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container login-page">
      <div className="login-wrapper animate-fade-in-up">
        <div className="login-header">
          <h1 className="page-title">Good to see you again</h1>
          <p className="page-subtitle">Continue your journey towards excellence.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        <div className="card login-card">
          <button type="button" className="btn-secondary google-login-btn" onClick={handleGoogleLogin} disabled={loading}>
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>OR LOGIN WITH EMAIL</span>
          </div>

          <form className="login-form" onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                className="glass-input"
                value={formData.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="login-password">Password</label>
                <button type="button" className="forgot-password-link" onClick={handleForgotPassword}>
                  Forgot Password?
                </button>
              </div>
              <input
                id="login-password"
                type="password"
                className="glass-input"
                value={formData.password}
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn-primary login-submit-btn" disabled={loading}>
              {loading ? 'Entering workspace...' : 'Enter workspace'}
            </button>
          </form>
        </div>

        <p className="auth-footer-text">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
