import { getStations } from '../backend/controllers/stationController.js';
import { enhanceResponse } from '../backend/utils/responseHelper.js';

export default async function handler(req, res) {
  enhanceResponse(res);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
  const id = req.query?.id || url.searchParams.get('id');
  if (id) {
    return await getStationDetails(req, res, id);
  }

  return await getStations(req, res);
}
