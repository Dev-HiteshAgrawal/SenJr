import { allowCors, readJsonBody, sendError } from '../http.js';
import { sanitize } from '../sanitizer.js';
import { getServerEnv } from '../env.js';

const GEMINI_STREAM_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse';

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

function forwardSseLine(res, line) {
  res.write(`${line}\n`);
  if (!line.trim()) {
    res.flush?.();
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

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  const upstream = await fetch(`${GEMINI_STREAM_URL}&key=${encodeURIComponent(geminiApiKey)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!upstream.ok || !upstream.body) {
    const rawText = await upstream.text().catch(() => '');
    const message =
      getGeminiErrorMessage(rawText) ||
      rawText ||
      'Could not get a response from the AI provider.';
    sendError(res, upstream.status || 500, message);
    return;
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';

      for (const line of lines) {
        forwardSseLine(res, line);
      }
    }
  } catch (error) {
    const message = error?.message || 'Upstream stream closed unexpectedly.';
    forwardSseLine(res, `event: error`);
    forwardSseLine(res, `data: ${JSON.stringify({ error: { message } })}`);
    forwardSseLine(res, ``);
  } finally {
    res.end();
  }
}

