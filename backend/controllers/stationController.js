// Station Controller: Handles /api/stations & /api/stations/:id
import { getAllStationsTelemetry, getStationById } from '../services/stationService.js';
import { getLiveSatelliteHotspots } from '../services/nasaService.js';

export async function getStations(req, res) {
  try {
    const [stationData, hotspotData] = await Promise.all([
      getAllStationsTelemetry(),
      getLiveSatelliteHotspots()
    ]);

    const combinedPayload = {
      ...stationData,
      hotspots: hotspotData.hotspots,
      satelliteSource: hotspotData.source
    };

    return res.status(200).json(combinedPayload);
  } catch (error) {
    console.error('? Error in getStations:', error);
    return res.status(500).json({
      error: 'Failed to retrieve station telemetry',
      message: error.message
    });
  }
}

export async function getStationDetails(req, res, stationId) {
  try {
    const station = await getStationById(stationId);
    if (!station) {
      return res.status(404).json({ error: `Station '${stationId}' not found` });
    }
    return res.status(200).json({ station });
  } catch (error) {
    console.error(`❌ Error in getStationDetails (${stationId}):`, error);
    return res.status(500).json({
      error: 'Failed to retrieve station details',
      message: error.message
    });
  }
}

export default { getStations, getStationDetails };
