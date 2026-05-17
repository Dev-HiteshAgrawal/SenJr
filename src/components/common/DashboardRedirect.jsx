import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Loader from './Loader';

/**
 * Smart redirect component: sends authenticated users to the correct dashboard
 * based on their role. Handles loading and missing-profile states gracefully.
 */
const DashboardRedirect = () => {
  const { userData, loading, user } = useAuthContext();

  if (loading) return <Loader fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!userData) return <Navigate to="/join" replace />;
  if (userData.role === 'mentor') return <Navigate to="/dashboard/mentor" replace />;
  return <Navigate to="/dashboard/student" replace />;
};

export default DashboardRedirect;
