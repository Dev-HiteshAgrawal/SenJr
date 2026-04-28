import { getServerEnv } from '../env.js';
import { allowCors, readJsonBody, sendError, sendJson } from '../http.js';

const DAILY_API_URL = 'https://api.daily.co/v1/rooms';

export async function dailyRoomHandler(req, res) {
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

  const { dailyApiKey } = getServerEnv();
  if (!dailyApiKey) {
    sendError(res, 500, 'Daily video service is not configured on the server.');
    return;
  }

  try {
    const body = await readJsonBody(req);
    const durationSeconds = Math.min(Math.max(Number(body?.durationSeconds) || 7200, 1800), 14400);

    const response = await fetch(DAILY_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${dailyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          exp: Math.round(Date.now() / 1000) + durationSeconds,
          enable_chat: true,
          enable_screenshare: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Daily API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    sendJson(res, 200, {
      url: data.url,
      roomName: data.name,
    });
  } catch (error) {
    console.error('Daily room handler error:', error);
    sendError(res, 500, error.message || 'Failed to create Daily room.');
  }
}
