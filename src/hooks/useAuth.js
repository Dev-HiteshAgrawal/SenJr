import { useAuthContext } from '../context/AuthContext'
import { loginWithEmail, registerWithEmail, loginWithGoogle, logout, resetPassword } from '../firebase/auth'

export const useAuth = () => {
  const { user, userData, loading } = useAuthContext()

  const login = async (email, password) => {
    return await loginWithEmail(email, password)
  }

  const register = async (email, password) => {
    return await registerWithEmail(email, password)
  }

  const signInWithGoogle = async () => {
    return await loginWithGoogle()
  }

  const signOut = async () => {
    return await logout()
  }

  const forgotPassword = async (email) => {
    return await resetPassword(email)
  }

  return {
    user,
    userData,
    loading,
    login,
    register,
    signInWithGoogle,
    signOut,
    forgotPassword,
    isAuthenticated: !!user
  }
}