/**
 * senJr — API Runtime Configuration Service
 *
 * Exposes server-side availability of certain features to the client.
 */

import { getServerEnv } from '../env.js';
import { allowCors, sendError, sendJson } from '../http.js';

function getProvider() {
  const { nvidiaApiKey, geminiApiKey } = getServerEnv();
  if (nvidiaApiKey) return 'nvidia';
  if (geminiApiKey) return 'gemini';
  return null;
}

export async function runtimeConfigHandler(req, res) {
  allowCors(res);

  if (req.method !== 'GET') {
    sendError(res, 405, 'Method not allowed.');
    return;
  }

  const { dailyApiKey, adminEmail } = getServerEnv();

  sendJson(res, 200, {
    aiTutorEnabled: Boolean(getProvider()),
    aiProvider: getProvider(),
    dailyEnabled: Boolean(dailyApiKey),
    adminConfigured: Boolean(adminEmail),
  });
}
