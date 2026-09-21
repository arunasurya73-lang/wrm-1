import { getForecast } from '../backend/controllers/forecastController.js';
import { enhanceResponse } from '../backend/utils/responseHelper.js';

export default async function handler(req, res) {
  enhanceResponse(res);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  return await getForecast(req, res);
}
