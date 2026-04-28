import { runtimeConfigHandler } from '../server/handlers/runtimeConfig.js';

export default async function handler(req, res) {
  return runtimeConfigHandler(req, res);
}
