import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Loader from './Loader';

const RoleRoute = ({ children, allowedRoles }) => {
  const { userData, loading, user } = useAuthContext();

  if (loading) {
    return <Loader fullScreen />;
  }

  // If we are checking for admin role, also check if the user matches the admin email env var
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const isAdminRequest = allowedRoles.includes('admin');
  const isAdminUser = user?.email === adminEmail || userData?.role === 'admin';

  if (!userData || !user) {
    return <Navigate to="/login" replace />;
  }

  if (isAdminRequest && isAdminUser) {
    return children;
  }

  if (!allowedRoles.includes(userData.role) && !isAdminUser) {
    // Redirect based on actual role if they try to access wrong route
    if (userData.role === 'mentor') return <Navigate to="/dashboard/mentor" replace />;
    if (userData.role === 'student') return <Navigate to="/dashboard/student" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleRoute;