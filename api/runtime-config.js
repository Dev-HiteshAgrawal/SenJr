import { runtimeConfigHandler } from '../server/handlers/runtimeConfig.js';

export default async function handler(req, res) {
  try {
    await runtimeConfigHandler(req, res);
  } catch (error) {
    console.error('API Error (runtime-config):', error);
    res.statusCode = 500;
    res.json({ error: 'Internal Server Error' });
  }
}
