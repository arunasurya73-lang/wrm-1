// Forecast Controller: Handles /api/forecast
import { getAtmosphericProfile } from '../services/atmosphereService.js';

export async function getForecast(req, res) {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
    const lat = parseFloat(parsedUrl.searchParams.get('lat') || '28.6139');
    const lng = parseFloat(parsedUrl.searchParams.get('lng') || '77.2090');
    const hours = parseInt(parsedUrl.searchParams.get('hours') || '72', 10);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude parameters' });
    }

    const profile = await getAtmosphericProfile(lat, lng, Math.min(Math.max(hours, 24), 72));
    return res.status(200).json(profile);
  } catch (error) {
    console.error('❌ Error in getForecast:', error);
    return res.status(500).json({
      error: 'Failed to compute atmospheric forecast',
      message: error.message
    });
  }
}

export default { getForecast };
