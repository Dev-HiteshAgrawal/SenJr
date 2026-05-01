import { auth } from './firebase';

export async function fetchAiRuntimeConfig() {
  const response = await fetch('/api/runtime-config');
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Could not load AI tutor runtime configuration.');
  }
  return data;
}

export async function generateTutorReply({ tutor, messages, onStream }) {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  const response = await fetch('/api/ai-tutor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ tutor, messages, stream: true }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'The AI tutor could not generate a reply.');
  }

  if (onStream && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6).trim();
          if (dataStr === '[DONE]') {
            break;
          }
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.text) {
              fullText += parsed.text;
              onStream(fullText);
            } else if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (e) {
            console.error('Error parsing SSE data', e, dataStr);
          }
        }
      }
    }
    return fullText;
  } else {
    // Fallback if not streaming
    const data = await response.json().catch(() => ({}));
    return data.reply;
  }
}
