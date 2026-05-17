import { useAuthContext } from '../context/AuthContext'
import { loginWithEmail, registerWithEmail, loginWithGoogle, loginWithApple, logout, resetPassword } from '../firebase/auth'

// eslint-disable-next-line react-refresh/only-export-components
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

  const signInWithApple = async () => {
    return await loginWithApple()
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
    signInWithApple,
    signOut,
    forgotPassword,
    isAuthenticated: !!user
  }
}