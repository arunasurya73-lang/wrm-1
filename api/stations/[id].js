import { getStationDetails } from '../../backend/controllers/stationController.js';
import { enhanceResponse } from '../../backend/utils/responseHelper.js';

export default async function handler(req, res) {
  enhanceResponse(res);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const id = req.query?.id || (req.url ? req.url.split('?')[0].split('/').pop() : '');
  return await getStationDetails(req, res, id);
}
