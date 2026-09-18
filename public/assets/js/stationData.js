// Comprehensive Global & Delhi NCR Monitoring Stations & AQI Dataset
export const AQI_LEVELS = [
  { min: 0, max: 50, label: 'Good', color: '#10B981', bgGlow: 'rgba(16, 185, 129, 0.2)', textColor: '#10B981', desc: 'Air quality is satisfactory, poses little or no risk.' },
  { min: 51, max: 100, label: 'Moderate', color: '#84CC16', bgGlow: 'rgba(132, 204, 22, 0.2)', textColor: '#84CC16', desc: 'Air quality is acceptable; slight concern for sensitive individuals.' },
  { min: 101, max: 200, label: 'Poor', color: '#F59E0B', bgGlow: 'rgba(245, 158, 11, 0.2)', textColor: '#F59E0B', desc: 'Breathing discomfort to people with lung, asthma and heart diseases.' },
  { min: 201, max: 300, label: 'Very Poor', color: '#F97316', bgGlow: 'rgba(249, 115, 22, 0.2)', textColor: '#F97316', desc: 'Breathing discomfort to most people on prolonged exposure.' },
  { min: 301, max: 400, label: 'Severe', color: '#EF4444', bgGlow: 'rgba(239, 68, 68, 0.25)', textColor: '#EF4444', desc: 'Respiratory effects even on healthy people; serious impact on sensitive groups.' },
  { min: 401, max: 500, label: 'Hazardous', color: '#A855F7', bgGlow: 'rgba(168, 85, 247, 0.3)', textColor: '#A855F7', desc: 'Health warning of emergency conditions. Entire population likely affected.' }
];

export function getAQIInfo(aqi) {
  for (const level of AQI_LEVELS) {
    if (aqi <= level.max) return level;
  }
  return { min: 501, max: 999, label: 'Severe+', color: '#7E22CE', bgGlow: 'rgba(126, 34, 206, 0.35)', textColor: '#9333EA', desc: 'Extreme emergency conditions. Avoid all outdoor activities.' };
}

// -------------------------------------------------------------
// DELHI NCR HIGH-RESOLUTION STATIONS (20 Monitoring Zones)
// -------------------------------------------------------------
export const DELHI_STATIONS = [
  {
    id: 'anand-vihar',
    name: 'Anand Vihar, East Delhi',
    city: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.6469,
    lng: 77.3160,
    aqi: 382,
    pm25: 295,
    pm10: 412,
    no2: 68,
    so2: 18,
    co: 2.8,
    o3: 24,
    stubbleShare: 32,
    wind: { speed: 6.2, direction: 'NW (315°)', deg: 315 },
    temp: 24.5,
    humidity: 68,
    visibility: 1.2
  },
  {
    id: 'bawana',
    name: 'Bawana Industrial Area',
    city: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.7762,
    lng: 77.0510,
    aqi: 415,
    pm25: 320,
    pm10: 448,
    no2: 82,
    so2: 24,
    co: 3.4,
    o3: 18,
    stubbleShare: 38,
    wind: { speed: 6.0, direction: 'NNW (330°)', deg: 330 },
    temp: 23.8,
    humidity: 71,
    visibility: 0.9
  },
  {
    id: 'mundka',
    name: 'Mundka, West Delhi',
    city: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.6840,
    lng: 77.0315,
    aqi: 396,
    pm25: 305,
    pm10: 430,
    no2: 76,
    so2: 20,
    co: 3.0,
    o3: 21,
    stubbleShare: 36,
    wind: { speed: 6.4, direction: 'NW (315°)', deg: 315 },
    temp: 24.1,
    humidity: 69,
    visibility: 1.0
  },
  {
    id: 'jahangirpuri',
    name: 'Jahangirpuri, North Delhi',
    city: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.7328,
    lng: 77.1706,
    aqi: 388,
    pm25: 298,
    pm10: 422,
    no2: 70,
    so2: 19,
    co: 2.9,
    o3: 20,
    stubbleShare: 34,
    wind: { speed: 6.6, direction: 'NNW (325°)', deg: 325 },
    temp: 24.3,
    humidity: 67,
    visibility: 1.1
  },
  {
    id: 'wazirpur',
    name: 'Wazirpur Industrial Area',
    city: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.6998,
    lng: 77.1652,
    aqi: 392,
    pm25: 302,
    pm10: 428,
    no2: 78,
    so2: 22,
    co: 3.1,
    o3: 19,
    stubbleShare: 35,
    wind: { speed: 6.3, direction: 'NW (315°)', deg: 315 },
    temp: 24.0,
    humidity: 70,
    visibility: 1.0
  },
  {
    id: 'rohini',
    name: 'Rohini Sector 16',
    city: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.7325,
    lng: 77.1190,
    aqi: 376,
    pm25: 288,
    pm10: 405,
    no2: 65,
    so2: 17,
    co: 2.7,
    o3: 23,
    stubbleShare: 33,
    wind: { speed: 6.5, direction: 'NNW (330°)', deg: 330 },
    temp: 24.2,
    humidity: 68,
    visibility: 1.2
  },
  {
    id: 'punjabi-bagh',
    name: 'Punjabi Bagh, West Delhi',
    city: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.6720,
    lng: 77.1310,
    aqi: 368,
    pm25: 280,
    pm10: 395,
    no2: 62,
    so2: 16,
    co: 2.5,
    o3: 25,
    stubbleShare: 30,
    wind: { speed: 6.1, direction: 'NW (315°)', deg: 315 },
    temp: 24.6,
    humidity: 66,
    visibility: 1.3
  },
  {
    id: 'rk-puram',
    name: 'R.K. Puram, South Delhi',
    city: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.5660,
    lng: 77.1820,
    aqi: 342,
    pm25: 260,
    pm10: 368,
    no2: 54,
    so2: 14,
    co: 2.2,
    o3: 28,
    stubbleShare: 26,
    wind: { speed: 5.8, direction: 'WNW (295°)', deg: 295 },
    temp: 25.1,
    humidity: 64,
    visibility: 1.5
  },
  {
    id: 'ito',
    name: 'ITO Central Intersection',
    city: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.6289,
    lng: 77.2410,
    aqi: 355,
    pm25: 272,
    pm10: 382,
    no2: 72,
    so2: 17,
    co: 3.2,
    o3: 22,
    stubbleShare: 28,
    wind: { speed: 5.9, direction: 'NW (315°)', deg: 315 },
    temp: 24.8,
    humidity: 65,
    visibility: 1.4
  },
  {
    id: 'mandir-marg',
    name: 'Mandir Marg, Central Delhi',
    city: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.6364,
    lng: 77.2010,
    aqi: 328,
    pm25: 248,
    pm10: 350,
    no2: 48,
    so2: 12,
    co: 1.9,
    o3: 31,
    stubbleShare: 24,
    wind: { speed: 5.7, direction: 'WNW (300°)', deg: 300 },
    temp: 25.3,
    humidity: 63,
    visibility: 1.6
  },
  {
    id: 'dwarka',
    name: 'Dwarka Sector 8',
    city: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.5710,
    lng: 77.0680,
    aqi: 338,
    pm25: 256,
    pm10: 362,
    no2: 50,
    so2: 13,
    co: 2.1,
    o3: 29,
    stubbleShare: 27,
    wind: { speed: 6.2, direction: 'WNW (290°)', deg: 290 },
    temp: 25.0,
    humidity: 64,
    visibility: 1.5
  },
  {
    id: 'siri-fort',
    name: 'Siri Fort, South Delhi',
    city: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.5504,
    lng: 77.2159,
    aqi: 318,
    pm25: 238,
    pm10: 338,
    no2: 46,
    so2: 11,
    co: 1.8,
    o3: 33,
    stubbleShare: 22,
    wind: { speed: 5.6, direction: 'WNW (295°)', deg: 295 },
    temp: 25.4,
    humidity: 62,
    visibility: 1.7
  },
  {
    id: 'igi-airport',
    name: 'IGI Airport T3',
    city: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.5562,
    lng: 77.0999,
    aqi: 324,
    pm25: 242,
    pm10: 345,
    no2: 52,
    so2: 14,
    co: 2.0,
    o3: 30,
    stubbleShare: 25,
    wind: { speed: 6.8, direction: 'WNW (300°)', deg: 300 },
    temp: 25.2,
    humidity: 63,
    visibility: 1.6
  },
  {
    id: 'okhla',
    name: 'Okhla Phase 2, SE Delhi',
    city: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.5308,
    lng: 77.2711,
    aqi: 362,
    pm25: 275,
    pm10: 388,
    no2: 66,
    so2: 19,
    co: 2.6,
    o3: 24,
    stubbleShare: 29,
    wind: { speed: 5.5, direction: 'NW (315°)', deg: 315 },
    temp: 25.0,
    humidity: 66,
    visibility: 1.3
  },
  {
    id: 'narela',
    name: 'Narela Border Zone',
    city: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.8527,
    lng: 77.0928,
    aqi: 408,
    pm25: 315,
    pm10: 440,
    no2: 74,
    so2: 21,
    co: 3.2,
    o3: 17,
    stubbleShare: 40,
    wind: { speed: 7.0, direction: 'NNW (330°)', deg: 330 },
    temp: 23.5,
    humidity: 72,
    visibility: 0.9
  },
  {
    id: 'noida-sec62',
    name: 'Noida Sector 62',
    city: 'Noida',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.6245,
    lng: 77.3638,
    aqi: 358,
    pm25: 270,
    pm10: 385,
    no2: 58,
    so2: 16,
    co: 2.4,
    o3: 26,
    stubbleShare: 28,
    wind: { speed: 5.8, direction: 'NW (315°)', deg: 315 },
    temp: 24.9,
    humidity: 66,
    visibility: 1.4
  },
  {
    id: 'ghaziabad-vasundhara',
    name: 'Ghaziabad Vasundhara',
    city: 'Ghaziabad',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.6603,
    lng: 77.3573,
    aqi: 378,
    pm25: 290,
    pm10: 408,
    no2: 64,
    so2: 18,
    co: 2.7,
    o3: 22,
    stubbleShare: 31,
    wind: { speed: 6.0, direction: 'NW (315°)', deg: 315 },
    temp: 24.6,
    humidity: 68,
    visibility: 1.2
  },
  {
    id: 'gurugram-cybercity',
    name: 'Gurugram Cyber Hub',
    city: 'Gurugram',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.4950,
    lng: 77.0895,
    aqi: 330,
    pm25: 248,
    pm10: 355,
    no2: 52,
    so2: 13,
    co: 2.0,
    o3: 31,
    stubbleShare: 25,
    wind: { speed: 6.4, direction: 'WNW (290°)', deg: 290 },
    temp: 25.5,
    humidity: 62,
    visibility: 1.6
  },
  {
    id: 'faridabad-sec16a',
    name: 'Faridabad Sector 16A',
    city: 'Faridabad',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.4112,
    lng: 77.3178,
    aqi: 348,
    pm25: 265,
    pm10: 375,
    no2: 56,
    so2: 15,
    co: 2.3,
    o3: 27,
    stubbleShare: 26,
    wind: { speed: 5.6, direction: 'NW (310°)', deg: 310 },
    temp: 25.3,
    humidity: 65,
    visibility: 1.5
  },
  {
    id: 'sonipat-rgue',
    name: 'Sonipat Rajiv Gandhi City',
    city: 'Sonipat',
    country: 'India',
    flag: '🇮🇳',
    region: 'Delhi NCR',
    lat: 28.9880,
    lng: 77.0850,
    aqi: 395,
    pm25: 304,
    pm10: 426,
    no2: 68,
    so2: 20,
    co: 2.9,
    o3: 19,
    stubbleShare: 37,
    wind: { speed: 7.2, direction: 'NNW (330°)', deg: 330 },
    temp: 23.6,
    humidity: 71,
    visibility: 1.0
  }
];

// -------------------------------------------------------------
// INDIA METROPOLITAN HUBS & MAJOR CITIES
// -------------------------------------------------------------
export const INDIA_METROS = [
  {
    id: 'mumbai-bkc',
    name: 'Mumbai (BKC Telemetry)',
    city: 'Mumbai',
    country: 'India',
    flag: '🇮🇳',
    region: 'India',
    lat: 19.0600,
    lng: 72.8680,
    aqi: 148,
    pm25: 58,
    pm10: 122,
    no2: 38,
    so2: 12,
    co: 1.4,
    o3: 28,
    stubbleShare: 4,
    wind: { speed: 12.5, direction: 'WSW (240°)', deg: 240 },
    temp: 29.2,
    humidity: 78,
    visibility: 4.5
  },
  {
    id: 'kolkata-victoria',
    name: 'Kolkata (Victoria Memorial)',
    city: 'Kolkata',
    country: 'India',
    flag: '🇮🇳',
    region: 'India',
    lat: 22.5448,
    lng: 88.3426,
    aqi: 215,
    pm25: 112,
    pm10: 195,
    no2: 44,
    so2: 15,
    co: 1.8,
    o3: 22,
    stubbleShare: 8,
    wind: { speed: 7.8, direction: 'NE (45°)', deg: 45 },
    temp: 27.8,
    humidity: 74,
    visibility: 3.0
  },
  {
    id: 'bengaluru-btm',
    name: 'Bengaluru (BTM Layout)',
    city: 'Bengaluru',
    country: 'India',
    flag: '🇮🇳',
    region: 'India',
    lat: 12.9166,
    lng: 77.6101,
    aqi: 68,
    pm25: 22,
    pm10: 54,
    no2: 24,
    so2: 6,
    co: 0.8,
    o3: 35,
    stubbleShare: 0,
    wind: { speed: 9.4, direction: 'E (90°)', deg: 90 },
    temp: 22.4,
    humidity: 62,
    visibility: 8.0
  },
  {
    id: 'chennai-velachery',
    name: 'Chennai (Velachery Coastal)',
    city: 'Chennai',
    country: 'India',
    flag: '🇮🇳',
    region: 'India',
    lat: 12.9815,
    lng: 80.2180,
    aqi: 82,
    pm25: 28,
    pm10: 68,
    no2: 26,
    so2: 8,
    co: 0.9,
    o3: 32,
    stubbleShare: 0,
    wind: { speed: 14.2, direction: 'SE (135°)', deg: 135 },
    temp: 28.5,
    humidity: 82,
    visibility: 6.5
  },
  {
    id: 'hyderabad-hitec',
    name: 'Hyderabad (HITEC City)',
    city: 'Hyderabad',
    country: 'India',
    flag: '🇮🇳',
    region: 'India',
    lat: 17.4435,
    lng: 78.3772,
    aqi: 124,
    pm25: 45,
    pm10: 98,
    no2: 32,
    so2: 10,
    co: 1.1,
    o3: 30,
    stubbleShare: 2,
    wind: { speed: 8.6, direction: 'ENE (70°)', deg: 70 },
    temp: 26.5,
    humidity: 58,
    visibility: 5.0
  },
  {
    id: 'ahmedabad-maninagar',
    name: 'Ahmedabad (Maninagar)',
    city: 'Ahmedabad',
    country: 'India',
    flag: '🇮🇳',
    region: 'India',
    lat: 23.0039,
    lng: 72.6015,
    aqi: 185,
    pm25: 84,
    pm10: 160,
    no2: 42,
    so2: 14,
    co: 1.6,
    o3: 26,
    stubbleShare: 5,
    wind: { speed: 8.0, direction: 'NW (310°)', deg: 310 },
    temp: 28.0,
    humidity: 52,
    visibility: 3.8
  },
  {
    id: 'lucknow-talkatora',
    name: 'Lucknow (Talkatora Industrial)',
    city: 'Lucknow',
    country: 'India',
    flag: '🇮🇳',
    region: 'India',
    lat: 26.8320,
    lng: 80.8980,
    aqi: 310,
    pm25: 230,
    pm10: 335,
    no2: 58,
    so2: 18,
    co: 2.5,
    o3: 20,
    stubbleShare: 22,
    wind: { speed: 5.4, direction: 'WNW (290°)', deg: 290 },
    temp: 25.0,
    humidity: 68,
    visibility: 1.8
  }
];

// -------------------------------------------------------------
// GLOBAL MEGA-CITIES & WORLD AIR QUALITY STATIONS (Removed)
// -------------------------------------------------------------
export const GLOBAL_STATIONS = [];

// All combined stations (Delhi NCR + India Metros)
export const STATIONS = [
  ...DELHI_STATIONS,
  ...INDIA_METROS
];

// -------------------------------------------------------------
// SATELLITE FIRE HOTSPOTS (Local Delhi/Punjab + Global Mega-fires)
// -------------------------------------------------------------
export const STUBBLE_FIRE_HOTSPOTS = [
  // Northern India Agricultural Crop Burning Belt
  { lat: 30.3400, lng: 76.3800, intensity: 'High (840 detections)', region: 'Patiala / Sangrur, Punjab 🇮🇳', type: 'Agricultural Stubble' },
  { lat: 30.9000, lng: 75.8500, intensity: 'Severe (1,120 detections)', region: 'Ludhiana, Punjab 🇮🇳', type: 'Agricultural Stubble' },
  { lat: 29.9600, lng: 76.8700, intensity: 'Moderate (420 detections)', region: 'Kurukshetra, Haryana 🇮🇳', type: 'Agricultural Stubble' },
  { lat: 29.6800, lng: 76.9900, intensity: 'High (690 detections)', region: 'Karnal, Haryana 🇮🇳', type: 'Agricultural Stubble' },
  { lat: 29.3900, lng: 76.9600, intensity: 'Moderate (350 detections)', region: 'Panipat, Haryana 🇮🇳', type: 'Agricultural Stubble' },
  { lat: 31.1471, lng: 75.3412, intensity: 'High (760 detections)', region: 'Moga / Ferozepur, Punjab 🇮🇳', type: 'Agricultural Stubble' },
  { lat: 30.1365, lng: 77.2982, intensity: 'Moderate (310 detections)', region: 'Yamunanagar, Haryana 🇮🇳', type: 'Agricultural Stubble' },
  
  // Global Satellite Thermal Anomalies (NASA FIRMS Global Feed)
  { lat: -3.4653, lng: -62.2159, intensity: 'Severe (1,840 detections)', region: 'Amazon Basin, Brazil 🇧🇷', type: 'Tropical Deforestation & Biomass Fire' },
  { lat: 37.1661, lng: -119.4494, intensity: 'High (920 detections)', region: 'Sierra Nevada, California 🇺🇸', type: 'Forest Wildfire Hotspot' },
  { lat: -0.7893, lng: 113.9213, intensity: 'Severe (1,450 detections)', region: 'Kalimantan Peatland, Indonesia 🇮🇩', type: 'Peatland Biomass Smoke' },
  { lat: -31.8400, lng: 148.1200, intensity: 'High (780 detections)', region: 'New South Wales Bush, Australia 🇦🇺', type: 'Bushfire Thermal Flare' },
  { lat: 62.0397, lng: 129.7422, intensity: 'Moderate (530 detections)', region: 'Sakha Republic Taiga, Siberia 🇷🇺', type: 'Boreal Taiga Wildfire' },
  { lat: 6.6111, lng: 20.9394, intensity: 'Severe (2,100 detections)', region: 'Central African Savannah 🇨🇫', type: 'Savannah Biomass Burning' }
];

export function generate72HourTrend(baseAqi, basePm25 = null, basePm10 = null, profileData = null) {
  const pm25Val = basePm25 !== null ? basePm25 : Math.round(baseAqi * 0.75);
  const pm10Val = basePm10 !== null ? basePm10 : Math.round(baseAqi * 1.08);
  const labels = [];
  const aqiData = [];
  const pm25Data = [];
  const pm10Data = [];
  const stubbleData = [];
  const now = new Date();

  for (let i = 0; i < 72; i++) {
    const time = new Date(now.getTime() + i * 3600 * 1000);
    const hour = time.getHours();
    const hourLabel = (i % 6 === 0 || i === 0) 
      ? `${time.toLocaleDateString('en-IN', { weekday: 'short' })} ${hour.toString().padStart(2, '0')}:00`
      : `${hour.toString().padStart(2, '0')}:00`;
    labels.push(hourLabel);

    let diurnal = 1.0;
    if (hour >= 6 && hour <= 9) diurnal = 1.25;
    else if (hour >= 20 && hour <= 23) diurnal = 1.22;
    else if (hour >= 13 && hour <= 16) diurnal = 0.82;

    const inv = (profileData && profileData.inversionIndices && profileData.inversionIndices[i] !== undefined)
      ? profileData.inversionIndices[i]
      : ((hour >= 20 || hour <= 8) ? 1.4 : -2.5);

    const invImpact = inv > 0 ? (inv * 10) : (inv * 4);
    const projectedAqi = Math.round(Math.max(25, Math.min(490, (baseAqi * diurnal * 0.92) + invImpact + Math.sin(i / 3) * 6)));
    const projectedPm25 = Math.round(Math.max(15, (pm25Val * diurnal * 0.92) + (invImpact * 0.8) + Math.sin(i / 3) * 5));
    const projectedPm10 = Math.round(Math.max(25, (pm10Val * diurnal * 0.92) + (invImpact * 1.1) + Math.sin(i / 3) * 7));
    const stubbleShare = Math.round(Math.max(0, Math.min(55, (baseAqi > 250 ? 30 : 8) + (inv > 0 ? 8 : -4) + Math.sin(i / 4) * 6)));

    aqiData.push(projectedAqi);
    pm25Data.push(projectedPm25);
    pm10Data.push(projectedPm10);
    stubbleData.push(stubbleShare);
  }

  return { labels, aqi: aqiData, pm25: pm25Data, pm10: pm10Data, stubble: stubbleData };
}

export function generate24HourTrend(baseAqi) {
  const hours = [];
  const aqiData = [];
  const pm25Data = [];
  const stubbleData = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600 * 1000);
    const hourLabel = time.getHours().toString().padStart(2, '0') + ':00';
    hours.push(hourLabel);

    const hour = time.getHours();
    let diurnalFactor = 1.0;
    if (hour >= 6 && hour <= 9) diurnalFactor = 1.25;
    else if (hour >= 20 && hour <= 23) diurnalFactor = 1.2;
    else if (hour >= 13 && hour <= 16) diurnalFactor = 0.82;

    const val = Math.round(baseAqi * diurnalFactor + (Math.sin(i) * 12));
    aqiData.push(Math.max(20, Math.min(500, val)));
    pm25Data.push(Math.round(val * 0.72));
    stubbleData.push(Math.round(Math.max(0, (baseAqi > 250 ? 25 : 5) + Math.sin(i / 2) * 10)));
  }

  return { labels: hours, aqi: aqiData, pm25: pm25Data, stubble: stubbleData };
}

export function generate7DayForecast(baseAqi) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIdx = new Date().getDay();
  const labels = [];
  const minAqi = [];
  const maxAqi = [];
  const avgAqi = [];

  for (let i = 0; i < 7; i++) {
    const dayName = i === 0 ? 'Today' : days[(todayIdx + i) % 7];
    labels.push(dayName);
    const variance = (i * 6) - (i > 3 ? 18 : 0);
    const avg = Math.round(Math.max(20, baseAqi + variance));
    avgAqi.push(avg);
    minAqi.push(Math.max(15, avg - 25));
    maxAqi.push(avg + 35);
  }

  return { labels, avg: avgAqi, min: minAqi, max: maxAqi };
}

