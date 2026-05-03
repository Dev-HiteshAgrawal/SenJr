/**
 * Vercel Serverless Function: /api/runtime-config
 * Returns feature flags based on which env vars are configured.
 * Fully self-contained — no imports from server/ to avoid bundling issues.
 */
export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const t = (v) => (v || '').trim();
  const geminiApiKey = t(process.env.GEMINI_API_KEY);
  const livekitApiKey = t(process.env.LIVEKIT_API_KEY);
  const livekitApiSecret = t(process.env.LIVEKIT_API_SECRET);
  const adminEmail = t(process.env.ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL);

  return res.status(200).json({
    aiTutorEnabled: Boolean(geminiApiKey),
    aiProvider: geminiApiKey ? 'gemini' : null,
    livekitEnabled: Boolean(livekitApiKey && livekitApiSecret),
    adminConfigured: Boolean(adminEmail),
  });
}
