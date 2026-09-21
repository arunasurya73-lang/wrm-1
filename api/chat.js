import { handleChat } from '../backend/controllers/chatController.js';
import { enhanceResponse } from '../backend/utils/responseHelper.js';

export default async function handler(req, res) {
  enhanceResponse(res);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return await handleChat(req, res);
}
