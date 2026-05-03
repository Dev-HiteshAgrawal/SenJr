/**
 * Client-side Gemini streaming tutor. Uses VITE_GEMINI_API_KEY only.
 */
export async function askTutor(systemPrompt, conversationHistory, onToken, signal) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    throw new Error('Gemini API key is not configured.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${encodeURIComponent(String(apiKey).trim())}`;

  const fullPrompt =
    systemPrompt +
    '\n\n' +
    conversationHistory
      .map((m) => (m.role === 'user' ? 'Student: ' : 'Tutor: ') + m.content)
      .join('\n');

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2000 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error('Gemini API error: ' + err);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') continue;

        try {
          const json = JSON.parse(payload);
          const token = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (token) onToken(token);
        } catch {
          // Ignore malformed SSE fragments
        }
      }
    }
  }
}
