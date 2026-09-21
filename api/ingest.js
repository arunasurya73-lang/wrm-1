import { handleIngest } from '../backend/controllers/ingestController.js';
import { enhanceResponse } from '../backend/utils/responseHelper.js';

export default async function handler(req, res) {
  enhanceResponse(res);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  return await handleIngest(req, res);
}
