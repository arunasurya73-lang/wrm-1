// Hotspot Controller: Handles /api/hotspots
import { getLiveSatelliteHotspots } from '../services/nasaService.js';

export async function getHotspots(req, res) {
  try {
    const data = await getLiveSatelliteHotspots();
    return res.status(200).json({
      timestamp: new Date().toISOString(),
      source: data.source,
      count: data.hotspots.length,
      hotspots: data.hotspots
    });
  } catch (error) {
    console.error('❌ Error in getHotspots:', error);
    return res.status(500).json({
      error: 'Failed to retrieve satellite fire hotspots',
      message: error.message
    });
  }
}

export default { getHotspots };
