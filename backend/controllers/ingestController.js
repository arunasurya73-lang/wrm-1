// Ingestion Controller: Handles /api/ingest
import { getAllStationsTelemetry } from '../services/stationService.js';
import { getLiveSatelliteHotspots } from '../services/nasaService.js';
import cache from '../services/cacheService.js';

export async function handleIngest(req, res) {
  const authHeader = req.headers ? req.headers['authorization'] : null;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized: Invalid CRON_SECRET token' });
  }

  const startTime = Date.now();
  cache.clear();

  try {
    const [stations, hotspots] = await Promise.all([
      getAllStationsTelemetry(),
      getLiveSatelliteHotspots()
    ]);

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Telemetry and satellite hotspot cache refreshed successfully',
      durationMs: Date.now() - startTime,
      syncedAt: new Date().toISOString(),
      summary: {
        stationsProcessed: stations.stations.length,
        hotspotsDetected: hotspots.hotspots.length,
        regionalAvgAqi: stations.summary.regionalAvgAqi
      }
    });
  } catch (error) {
    console.error('❌ Ingestion pipeline failure:', error);
    return res.status(500).json({
      status: 'FAILED',
      error: error.message
    });
  }
}

export default { handleIngest };
