export async function generateLiveKitToken(roomName, participantName, participantIdentity) {
  const response = await fetch('/api/livekit-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
