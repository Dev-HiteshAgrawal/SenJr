export const getAuthErrorMessage = (errorCode) => {
  const messages = {
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Please use Google login.',
    'auth/email-already-in-use': 'This email is already registered. Please login instead.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/user-not-found': 'No account found. Please sign up first.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please wait a few minutes.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
    'auth/popup-blocked': 'Popup was blocked. Please allow popups for this site.',
    'auth/invalid-credential': 'Incorrect email or password. Please try again.',
  };

  return messages[errorCode] || 'Something went wrong. Please try again.';
};
