import { auth } from '../lib/firebase';

export async function generateLiveKitToken(roomName, participantName, participantIdentity) {
  const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : '';
  
  const response = await fetch('/api/livekit-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(idToken ? { 'Authorization': `Bearer ${idToken}` } : {}),
    },
    body: JSON.stringify({
      roomName,
      participantName,
      participantIdentity,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Could not start session. Please try again.');
  }

  return data.token;
}
