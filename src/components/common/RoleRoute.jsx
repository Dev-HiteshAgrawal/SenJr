import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Loader from './Loader';

const RoleRoute = ({ children, allowedRoles }) => {
  const { userData, loading, user } = useAuthContext();

  if (loading) {
    return <Loader fullScreen />;
  }

  // Not logged in at all
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but no Firestore document yet (e.g., Google sign-in new user)
  // Send them to role selection to complete signup
  if (!userData) {
    return <Navigate to="/join" replace />;
  }

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const isAdminUser = user?.email === adminEmail || userData?.role === 'admin';

  // Admin override — can access everything
  if (isAdminUser) {
    return children;
  }

  // Role mismatch — redirect to their own dashboard
  if (!allowedRoles.includes(userData.role)) {
    if (userData.role === 'mentor') return <Navigate to="/dashboard/mentor" replace />;
    if (userData.role === 'student') return <Navigate to="/dashboard/student" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleRoute;