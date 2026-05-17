import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Loader from './Loader'

const RoleRoute = ({ children, allowedRoles }) => {
  const { userData, loading } = useAuth()

  if (loading) {
    return <Loader fullScreen />
  }

  if (!userData || !allowedRoles.includes(userData.role)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RoleRoute