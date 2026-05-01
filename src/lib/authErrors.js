export const getAuthErrorMessage = (errorCode) => {
  const messages = {
    'auth/operation-not-allowed': 'This sign-in method is temporarily unavailable. Try Google instead.',
    'auth/email-already-in-use': "You've already joined! Let's get you logged in instead.",
    'auth/wrong-password': 'That password didn’t quite match. Let’s try again.',
    'auth/user-not-found': 'We couldn’t find an account with that email. Want to join us?',
    'auth/weak-password': 'Try a slightly stronger password (at least 6 characters).',
    'auth/invalid-email': 'That email address doesn’t look quite right.',
    'auth/too-many-requests': 'You’re moving fast! Please wait a moment before trying again.',
    'auth/network-request-failed': 'We’re having trouble connecting. Check your signal.',
    'auth/popup-closed-by-user': 'The sign-in window was closed. Shall we try again?',
    'auth/popup-blocked': 'A popup was blocked. Please allow them so we can sign you in.',
    'auth/invalid-credential': 'Those details didn’t match our records. Let’s double check.',
  };

  return messages[errorCode] || 'We hit a small snag. Let’s try that again.';
};
