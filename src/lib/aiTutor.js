import { auth } from './firebase';

async function getAuthHeader() {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { 'Authorization': `Bearer ${token}` };
}

async function readApiResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || fallbackMessage);
  }

  return data;
}

export async function fetchAiRuntimeConfig() {
  const response = await fetch('/api/runtime-config');
  return readApiResponse(response, 'Could not load AI tutor runtime configuration.');
}

export async function generateTutorReply({ tutor, messages }) {
  const authHeader = await getAuthHeader();
  const response = await fetch('/api/ai-tutor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
    },
    body: JSON.stringify({ tutor, messages }),
  });

  const data = await readApiResponse(response, 'The AI tutor could not generate a reply.');
  return data.reply;
}
