import { aiTutorHandler } from '../server/handlers/aiTutor.js';

export default async function handler(req, res) {
  try {
    await aiTutorHandler(req, res);
  } catch (error) {
    console.error('API Error (ai-tutor):', error);
    res.statusCode = 500;
    res.json({ error: 'Internal Server Error' });
  }
}
