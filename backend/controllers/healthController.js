// Health & Backend Telemetry Controller: Handles /api/health
import cache from '../services/cacheService.js';

const START_TIME = Date.now();

export async function getHealth(req, res) {
  try {
    const uptimeSeconds = Math.floor((Date.now() - START_TIME) / 1000);
    const memory = process.memoryUsage();
    const cacheMetrics = cache.getMetrics();

    return res.status(200).json({
      status: 'HEALTHY',
      service: 'AirSense Delhi NCR Core Backend',
      version: '1.2.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      uptimeFormatted: `${Math.floor(uptimeSeconds / 60)}m ${uptimeSeconds % 60}s`,
      environment: process.env.VERCEL ? 'Vercel Serverless Edge' : 'Node.js Production Runtime',
      memoryUsage: {
        rssMb: (memory.rss / 1024 / 1024).toFixed(1),
        heapUsedMb: (memory.heapUsed / 1024 / 1024).toFixed(1),
        heapTotalMb: (memory.heapTotal / 1024 / 1024).toFixed(1)
      },
      cache: cacheMetrics,
      integrations: {
        nasaFirms: {
          configured: !!(process.env.NASA_FIRMS_MAP_KEY && process.env.NASA_FIRMS_MAP_KEY !== 'your_firms_key_here'),
          status: 'Active'
        },
        waqi: {
          configured: !!(process.env.WAQI_API_KEY && process.env.WAQI_API_KEY !== 'your_waqi_api_key_here'),
          status: 'Active'
        },
        openMeteo: {
          status: 'Active (Direct Hourly Sounding)'
        }
      }
    });
  } catch (error) {
    console.error('❌ Health check error:', error);
    return res.status(500).json({
      status: 'DEGRADED',
      error: error.message
    });
  }
}

export default { getHealth };
