# wrm-1 | AirSense Delhi NCR ?????

> **Next-generation Delhi NCR air quality forecasting, real-time multi-pollutant telemetry, NASA FIRMS satellite farm fire tracking, and atmospheric boundary layer inversion physics.**

---

## ?? Key Features

- **?? Real-Time Multi-Pollutant Telemetry**: Live AQI, PM2.5, PM10, NO2, SO2, CO, and O3 from 20 high-resolution monitoring stations across Delhi NCR.
- **?? NASA FIRMS Satellite Smoke Tracking**: Real-time stubble burning detection across Punjab & Haryana with physics-based smoke dispersion modeling.
- **??? Atmospheric Boundary Layer Inversion Modeling**: 72-hour thermal inversion risk detection and ventilation index calculations.
- **?? 72-Hour Air Quality Forecast**: High-resolution hourly AQI and multi-pollutant outlook with uncertainty envelopes.
- **??? Interactive Map**: Real-time Leaflet GIS mapping with dynamic smoke plume visualization and fire corridor overlays.
- **??? Dynamic Health Advisories**: Personalized, actionable health guidelines for vulnerable groups, commuters, and outdoor activities.

---

## ?? Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/arunasurya73-lang/wrm-1.git
cd wrm-1
```

### 2. Run locally
```bash
node server.js
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ?? Deploy to Vercel

This repository is pre-configured for seamless zero-config deployment on **Vercel**:

1. Import this repository in [Vercel](https://vercel.com/new).
2. Click **Deploy**.
3. (Optional) Set environment variables:
   - `NASA_FIRMS_MAP_KEY` — (Optional) Your NASA FIRMS MAP API key for live satellite fire detection.
   - `WAQI_API_KEY` — (Optional) Your World Air Quality Index token.

---

## ?? License

MIT © [AirSense Team](https://github.com/arunasurya73-lang)
