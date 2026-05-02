import { allowCors, readJsonBody, sendError, sendJson } from '../http.js';
import { sanitize } from '../sanitizer.js';
import { getServerEnv } from '../env.js';
import { verifyAuth } from '../auth.js';

const GEMINI_GENERATE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

function getGeminiErrorMessage(rawText) {
  if (!rawText) return '';
  try {
    const parsed = JSON.parse(rawText);
    const message = parsed?.error?.message;
    return typeof message === 'string' ? message : '';
  } catch {
    return '';
  }
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

  const user = await verifyAuth(req);
  if (!user) {
    sendError(res, 401, 'Unauthorized: Missing or invalid authentication token.');
    return;
  }

  const { geminiApiKey } = getServerEnv();
  if (!geminiApiKey) {
    sendError(res, 500, 'AI Tutor is not configured on the server (missing GEMINI_API_KEY).');
    return;
  }

  let body;
  try {
    const rawBody = await readJsonBody(req);
    body = sanitize(rawBody);
  } catch (error) {
    sendError(res, 400, 'Invalid request body.');
    return;
  }

  const upstream = await fetch(`${GEMINI_GENERATE_URL}?key=${encodeURIComponent(geminiApiKey)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!upstream.ok) {
    const rawText = await upstream.text().catch(() => '');
    const message =
      getGeminiErrorMessage(rawText) ||
      rawText ||
      'Could not get a response from the AI provider.';
    sendError(res, upstream.status || 500, message);
    return;
  }

  try {
    const payload = await upstream.json();
    const parts = payload?.candidates?.[0]?.content?.parts || [];
    const text = parts.map((part) => (typeof part?.text === 'string' ? part.text : '')).join('').trim();
    sendJson(res, 200, { text });
  } catch (error) {
    sendError(res, 500, error?.message || 'Failed to parse AI provider response.');
  }
}

