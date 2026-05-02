import { livekitTokenHandler } from '../server/handlers/livekitToken.js';

export default async function handler(req, res) {
  return livekitTokenHandler(req, res);
}
