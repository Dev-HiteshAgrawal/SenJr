import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { auth } from './config'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

const appleProvider = new OAuthProvider('apple.com')
appleProvider.addScope('email')
appleProvider.addScope('name')

export const registerWithEmail = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password)
}

export const loginWithEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

export const loginWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider)
}

export const loginWithApple = async () => {
  return await signInWithPopup(auth, appleProvider)
}

export const logout = async () => {
  return await signOut(auth)
}

export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email)
}

export const updateUserProfile = async (user, profileData) => {
  return await updateProfile(user, profileData)
}