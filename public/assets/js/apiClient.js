// Resilient End-to-End API Client
// Connects the AirSense Delhi frontend directly to the backend API layer with automatic retry,
// timeout management, offline fallback caching, and latency telemetry.

class APIClient {
  constructor() {
    // ⚠️ IMPORTANT: Replace this URL with your actual Render.com live URL
    const RENDER_BACKEND_URL = 'https://wrm-1-1.onrender.com'; 
    
    // Use localhost for local development, otherwise use the Render backend
    this.baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? window.location.origin 
      : RENDER_BACKEND_URL;
      
    this.latencyMs = 0;
    this.status = 'CONNECTING'; // 'CONNECTED' | 'OFFLINE' | 'DEGRADED'
    this.listeners = [];
  }

  onStatusChange(callback) {
    this.listeners.push(callback);
  }

  notify(status, latencyMs) {
    this.status = status;
    this.latencyMs = latencyMs;
    this.listeners.forEach(cb => cb({ status, latencyMs }));
  }

  async request(endpoint, options = {}, retries = 2, timeoutMs = 6000) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const startTime = performance.now();

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
          }
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const latency = Math.round(performance.now() - startTime);
          this.notify('CONNECTED', latency);

          // Save to offline storage cache
          try {
            localStorage.setItem(`airsense_cache_${endpoint}`, JSON.stringify({
              data,
              cachedAt: Date.now()
            }));
          } catch (e) {
            // Storage quota warning ignored
          }

          return data;
        }
      } catch (err) {
        if (attempt === retries) {
          console.warn(`⚠️ API Client error on ${endpoint}:`, err.message);
          this.notify('OFFLINE', 0);

          // Fallback to offline localStorage cache if available
          try {
            const cached = localStorage.getItem(`airsense_cache_${endpoint}`);
            if (cached) {
              const parsed = JSON.parse(cached);
              console.info(`📦 Serving ${endpoint} from offline storage cache`);
              return parsed.data;
            }
          } catch (storageErr) {
            // Ignore storage fallback error
          }
          throw err;
        }
        // Wait before next retry
        await new Promise(r => setTimeout(r, 400 * Math.pow(2, attempt)));
      }
    }
  }

  // Core API Methods
  async getHealth() {
    return await this.request('/api/health');
  }

  async getStations() {
    return await this.request('/api/stations');
  }

  async getStationDetails(id) {
    return await this.request(`/api/stations/${id}`);
  }

  async getForecast(lat = 28.6139, lng = 77.2090, hours = 72) {
    return await this.request(`/api/forecast?lat=${lat}&lng=${lng}&hours=${hours}`);
  }

  async getHotspots() {
    return await this.request('/api/hotspots');
  }

  async sendChatMessage(message, context = {}) {
    return await this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context })
    }, 1, 8000);
  }
}

export const apiClient = new APIClient();
export default apiClient;
