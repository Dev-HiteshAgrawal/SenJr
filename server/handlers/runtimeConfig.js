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

  const { geminiApiKey, livekitApiKey, livekitApiSecret, adminEmail } = getServerEnv();

  sendJson(res, 200, {
    aiTutorEnabled: Boolean(geminiApiKey),
    aiProvider: geminiApiKey ? 'gemini' : null,
    livekitEnabled: Boolean(livekitApiKey && livekitApiSecret),
    adminConfigured: Boolean(adminEmail),
  });
}
