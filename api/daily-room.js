import { dailyRoomHandler } from '../server/handlers/dailyRoom.js';

export default async function handler(req, res) {
  return dailyRoomHandler(req, res);
}
