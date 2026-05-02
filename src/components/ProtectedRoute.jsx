import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function getDefaultDashboard(role) {
  return role === 'mentor' ? '/mentor-dashboard' : '/student-dashboard';
}

export default function ProtectedRoute({ children, allowedRoles = null }) {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!userProfile) {
    return (
      <Navigate
        to="/signup"
        replace
        state={{
          googleSignup: true,
          prefill: {
            name: currentUser.displayName || '',
            email: currentUser.email || '',
          },
        }}
      />
    );
  }

  // Enforce profile completion
  if (!userProfile.profileSetupComplete && location.pathname !== '/mentor-setup' && userProfile.role === 'mentor') {
    return <Navigate to="/mentor-setup" replace />;
  }

  if (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to={getDefaultDashboard(userProfile.role)} replace />;
  }

  return children;
}
