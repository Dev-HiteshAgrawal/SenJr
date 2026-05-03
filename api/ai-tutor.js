/**
 * Vercel Serverless Function: /api/ai-tutor
 * Proxies chat messages to the Gemini API.
 * Fully self-contained — no imports from server/ to avoid bundling firebase-admin.
 */

const GEMINI_MODEL = 'gemini-2.5-flash';
const MAX_PROMPT_CHARS = 24000;

function sanitize(input) {
  if (typeof input === 'string') return input.replace(/<\/?[^>]+(>|$)/g, '');
  if (Array.isArray(input)) return input.map(sanitize);
  if (typeof input === 'object' && input !== null) {
    const out = {};
    for (const k in input) out[k] = sanitize(input[k]);
    return out;
  }
  return input;
}

function buildPrompt(systemPrompt, conversationHistory) {
  const messages = Array.isArray(conversationHistory) ? conversationHistory : [];
  const transcript = messages
    .slice(-30)
    .map((m) => {
      const role = m?.role === 'user' ? 'Student' : 'Tutor';
      return `${role}: ${String(m?.content || '').trim()}`;
    })
    .filter((line) => line.length > 8)
    .join('\n');
  return `${String(systemPrompt || '').trim()}\n\n${transcript}`.slice(-MAX_PROMPT_CHARS);
}

function extractGeminiText(payload) {
  return (payload?.candidates || [])
    .flatMap((c) => c?.content?.parts || [])
    .map((p) => p?.text || '')
    .join('')
    .trim();
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const geminiApiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!geminiApiKey) {
    return res.status(503).json({ error: 'AI tutor is not configured on the server.' });
  }

  try {
    const body = sanitize(req.body || {});
    const prompt = buildPrompt(body?.systemPrompt, body?.conversationHistory);

    if (!prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
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
      return res.status(upstream.status >= 500 ? 502 : upstream.status).json({ error: 'AI provider request failed.' });
    }

    const payload = await upstream.json();
    const text = extractGeminiText(payload);
    if (!text) {
      return res.status(502).json({ error: 'AI provider returned an empty response.' });
    }

    return res.status(200).json({ provider: 'gemini', model: GEMINI_MODEL, text });
  } catch (error) {
    console.error('AI tutor handler error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate tutor response.' });
  }
}
