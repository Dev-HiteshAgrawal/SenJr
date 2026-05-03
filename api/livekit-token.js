import { livekitTokenHandler } from '../server/handlers/livekitToken.js';

export default async function handler(req, res) {
  try {
    await livekitTokenHandler(req, res);
  } catch (error) {
    console.error('API Error (livekit-token):', error);
    res.statusCode = 500;
    res.json({ error: 'Internal Server Error' });
  }
}
