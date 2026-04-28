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
  const response = await fetch('/api/ai-tutor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tutor, messages }),
  });

  const data = await readApiResponse(response, 'The AI tutor could not generate a reply.');
  return data.reply;
}
