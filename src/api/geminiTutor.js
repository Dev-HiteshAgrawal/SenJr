export async function askTutor(systemPrompt, conversationHistory, onToken, signal) {
  const response = await fetch('/api/ai-tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      systemPrompt,
      conversationHistory,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'AI tutor request failed.');
  }

  const data = await response.json();
  if (!data.text) throw new Error('AI tutor returned an empty response.');
  onToken(data.text);
}
