import { aiTutorHandler } from '../server/handlers/aiTutor.js';

export default async function handler(req, res) {
  return aiTutorHandler(req, res);
}

