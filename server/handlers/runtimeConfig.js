import { getServerEnv } from '../env.js';
import { allowCors, sendError, sendJson } from '../http.js';

export async function runtimeConfigHandler(req, res) {
  allowCors(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    sendError(res, 405, 'Method not allowed.');
    return;
  }

  const { nvidiaApiKey, geminiApiKey, livekitApiKey, livekitApiSecret, adminEmail } = getServerEnv();
  const aiProvider = nvidiaApiKey ? 'nvidia' : geminiApiKey ? 'gemini' : null;

  sendJson(res, 200, {
    aiTutorEnabled: Boolean(aiProvider),
    aiProvider,
    livekitEnabled: Boolean(livekitApiKey && livekitApiSecret),
    adminConfigured: Boolean(adminEmail),
  });
}
