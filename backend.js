import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getStations, getStationDetails } from './backend/controllers/stationController.js';
import { getForecast } from './backend/controllers/forecastController.js';
import { getHotspots } from './backend/controllers/hotspotController.js';
import { getHealth } from './backend/controllers/healthController.js';
import { handleIngest } from './backend/controllers/ingestController.js';
import { handleChat } from './backend/controllers/chatController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Automatic Environment Loading
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath) && process.loadEnvFile) {
    process.loadEnvFile(envPath);
    console.log('🔑 Environment variables loaded from .env');
  }
} catch (e) {
  console.warn('Note: .env parsing skipped:', e.message);
}

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

function enhanceResponse(res) {
  if (!res.status) {
    res.status = function(code) {
      res.statusCode = code;
      return res;
    };
  }
  if (!res.json) {
    res.json = function(data) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(data, null, 2));
    };
  }
}

async function handler(req, res) {
  enhanceResponse(res);
  const host = req.headers ? (req.headers.host || 'localhost:3000') : 'localhost:3000';
  const parsedUrl = new URL(req.url, `http://${host}`);
  const pathname = parsedUrl.pathname;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // API Routing Layer
  if (pathname === '/api/health' || pathname === '/api/health.js') {
    return await getHealth(req, res);
  }

  if (pathname === '/api/stations' || pathname === '/api/stations.js') {
    return await getStations(req, res);
  }

  if (pathname.startsWith('/api/stations/')) {
    const stationId = pathname.replace('/api/stations/', '');
    return await getStationDetails(req, res, stationId);
  }

  if (pathname === '/api/forecast' || pathname === '/api/forecast.js') {
    return await getForecast(req, res);
  }

  if (pathname === '/api/hotspots' || pathname === '/api/hotspots.js') {
    return await getHotspots(req, res);
  }

  if (pathname === '/api/ingest' || pathname === '/api/ingest.js') {
    return await handleIngest(req, res);
  }

  if (pathname === '/api/chat' || pathname === '/api/chat.js') {
    return await handleChat(req, res);
  }

  // Static File Serving
  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);

  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      return fs.createReadStream(filePath).pipe(res);
    }

    // Client-side fallback to index.html
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return fs.createReadStream(indexPath).pipe(res);
    }
  } catch (err) {
    console.error('Static serving error:', err);
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ error: 'Endpoint or asset not found', path: pathname }));
}

const server = http.createServer(handler);

if (!process.env.VERCEL && !process.env.NOW_REGION) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 AirSense Delhi Production Backend is running at: http://0.0.0.0:${PORT}`);
    console.log(`📡 Endpoints available:`);
    console.log(`   - GET  /api/health`);
    console.log(`   - GET  /api/stations`);
    console.log(`   - GET  /api/forecast?lat=28.6139&lng=77.2090`);
    console.log(`   - GET  /api/hotspots`);
    console.log(`   - POST /api/ingest`);
  });
}

export default handler;
