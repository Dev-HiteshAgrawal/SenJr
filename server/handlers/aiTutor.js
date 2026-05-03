import { getServerEnv } from '../env.js';
import { allowCors, readJsonBody, sendError, sendJson } from '../http.js';
import { sanitize } from '../sanitizer.js';

const GEMINI_MODEL = 'gemini-2.5-flash';
const MAX_PROMPT_CHARS = 24000;

function buildPrompt(systemPrompt, conversationHistory) {
  const messages = Array.isArray(conversationHistory) ? conversationHistory : [];
  const transcript = messages
    .slice(-30)
    .map((message) => {
      const role = message?.role === 'user' ? 'Student' : 'Tutor';
      return `${role}: ${String(message?.content || '').trim()}`;
    })
    .filter((line) => line.length > 8)
    .join('\n');

  return `${String(systemPrompt || '').trim()}\n\n${transcript}`.slice(-MAX_PROMPT_CHARS);
}

function extractGeminiText(payload) {
  return (payload?.candidates || [])
    .flatMap((candidate) => candidate?.content?.parts || [])
    .map((part) => part?.text || '')
    .join('')
    .trim();
}

export async function aiTutorHandler(req, res) {
  allowCors(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendError(res, 405, 'Method not allowed.');
    return;
  }

  const { geminiApiKey } = getServerEnv();
  if (!geminiApiKey) {
    sendError(res, 503, 'AI tutor is not configured on the server.');
    return;
  }

  try {
    const body = sanitize(await readJsonBody(req));
    const prompt = buildPrompt(body?.systemPrompt, body?.conversationHistory);

    if (!prompt.trim()) {
      sendError(res, 400, 'Prompt is required.');
      return;
    }

    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': geminiApiKey,
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2000 },
        }),
      }
    );

    if (!upstream.ok) {
      const errorText = await upstream.text();
      console.error('Gemini API error:', errorText);
      sendError(res, upstream.status >= 500 ? 502 : upstream.status, 'AI provider request failed.');
      return;
    }

    const payload = await upstream.json();
    const text = extractGeminiText(payload);
    if (!text) {
      sendError(res, 502, 'AI provider returned an empty response.');
      return;
    }

    sendJson(res, 200, {
      provider: 'gemini',
      model: GEMINI_MODEL,
      text,
    });
  } catch (error) {
    console.error('AI tutor handler error:', error);
    sendError(res, 500, error.message || 'Failed to generate tutor response.');
  }
}
