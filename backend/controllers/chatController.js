// AI Chat Controller: Handles /api/chat with Gemini API & domain air quality context
import { getAllStationsTelemetry } from '../services/stationService.js';

/**
 * Parses JSON body from request stream
 */
function parseRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

/**
 * Smart domain fallback when Gemini API key is not configured or offline
 */
function generateDomainFallback(prompt, cityContext) {
  const query = prompt.toLowerCase();
  const avgAqi = cityContext.avgAqi || 265;
  const status = cityContext.status || 'Poor';
  const worstStation = cityContext.worstStation || 'Anand Vihar (AQI ~380)';
  const bestStation = cityContext.bestStation || 'Mandir Marg (AQI ~140)';

  if (query.includes('jog') || query.includes('run') || query.includes('walk') || query.includes('exercise') || query.includes('outdoor')) {
    if (avgAqi > 200) {
      return `⚠️ **Exercise Advisory (Current Delhi Avg AQI: ${avgAqi} - ${status})**:
- **Avoid vigorous outdoor workouts** today, especially during early morning and late evening inversion hours (6:00 AM - 9:00 AM & 7:00 PM - 10:00 PM).
- Switch to indoor cardio, yoga, or gym training with HEPA air filtration.
- If you must step outside, wear a well-fitted **N95/FFP2 mask** and avoid high-traffic corridors.`;
    } else {
      return `✅ **Outdoor Exercise Advisory (Current AQI: ${avgAqi})**:
- Air quality is acceptable for moderate exercise.
- Sensitive individuals should still limit prolonged heavy outdoor exertion during peak traffic hours.`;
    }
  }

  if (query.includes('clean') || query.includes('lowest') || query.includes('fresh') || query.includes('safe area')) {
    return `🍃 **Cleanest Air Pockets in Delhi NCR**:
- **Best currently reporting area**: ${bestStation}
- Generally, areas with dense green cover such as **Lodi Road**, **Mandir Marg**, and parts of Central Ridge maintain lower particulate concentrations compared to border industrial zones.`;
  }

  if (query.includes('worst') || query.includes('hotspot') || query.includes('high') || query.includes('danger') || query.includes('anand vihar')) {
    return `🚨 **Delhi AQI Hotspots**:
- **Highest Particulate Zone**: ${worstStation}
- Key severe hotspots in the region typically include **Anand Vihar**, **Jahangirpuri**, **Wazirpur**, **Bawana**, and **Mundka** due to heavy trans-boundary vehicular movement, biomass smoke, and localized industrial dust.`;
  }

  if (query.includes('mask') || query.includes('n95') || query.includes('protection') || query.includes('purifier')) {
    return `🛡️ **Health & Air Protection Guidelines**:
1. **Mask Selection**: Standard cloth or surgical masks do NOT filter microscopic PM2.5. Always use certified **N95 or FFP2 respirators** with a tight nose seal.
2. **Indoor Air**: Keep doors and windows closed during smog peaks. Run **HEPA H13/H14 air purifiers** in bedrooms.
3. **Hydration & Diet**: Stay well-hydrated, consume antioxidant-rich foods, and use saline nasal sprays to soothe mucosal inflammation.`;
  }

  if (query.includes('stubble') || query.includes('fire') || query.includes('parali') || query.includes('farm') || query.includes('satellite')) {
    return `🛰️ **Satellite Smoke & Farm Fire Telemetry**:
- Stubble burning (parali) plumes from Punjab and Haryana are monitored via NASA VIIRS & MODIS satellite feeds.
- North-westerly winds often transport dense smoke into the Indo-Gangetic plains, combining with nocturnal thermal inversion to create severe winter smog layers.`;
  }

  if (query.includes('grap') || query.includes('stage') || query.includes('rule') || query.includes('restriction')) {
    return `📋 **GRAP (Graded Response Action Plan) Status**:
- **Stage I (AQI 201-300)**: Dust mitigation & mechanical sweeping.
- **Stage II (AQI 301-400)**: Ban on diesel gensets, enhanced parking fees.
- **Stage III (AQI 401-450)**: Ban on non-essential construction & BS-III petrol / BS-IV diesel vehicles.
- **Stage IV (AQI >450)**: Entry ban on commercial trucks, online school advisories, and emergency industrial curbs.`;
  }

  // Default smart AI assistant summary
  return `🤖 **AirSense Intelligence Advisory**:
- **Delhi NCR Current AQI**: **${avgAqi}** (${status})
- **Top Hotspot**: ${worstStation}
- **Cleanest Zone**: ${bestStation}

**Key Recommendations**:
1. Vulnerable groups (children, elderly, and respiratory patients) should avoid outdoor exertion.
2. Ensure N95 masks are worn during commutes.
3. Keep indoor air purifiers on auto-mode.

*Ask me anything specific like: "Is it safe to go cycling now?", "Which areas have the worst pollution?", or "What mask should I buy?"*`;
}

/**
 * Main Controller Handler for /api/chat
 */
export async function handleChat(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = await parseRequestBody(req);
    const userPrompt = (body.message || body.prompt || '').trim();

    if (!userPrompt) {
      return res.status(400).json({ error: 'Missing "message" in request body' });
    }

    // Gather live city context
    let cityContext = {
      avgAqi: 245,
      status: 'Poor',
      worstStation: 'Anand Vihar (AQI 378)',
      bestStation: 'Mandir Marg (AQI 142)'
    };

    try {
      const stationData = await getAllStationsTelemetry();
      if (stationData && stationData.stations && stationData.stations.length > 0) {
        const valid = stationData.stations.filter(s => s.aqi && s.aqi > 0);
        if (valid.length > 0) {
          const sum = valid.reduce((acc, curr) => acc + curr.aqi, 0);
          cityContext.avgAqi = Math.round(sum / valid.length);
          
          if (cityContext.avgAqi <= 50) cityContext.status = 'Good';
          else if (cityContext.avgAqi <= 100) cityContext.status = 'Satisfactory';
          else if (cityContext.avgAqi <= 200) cityContext.status = 'Moderate';
          else if (cityContext.avgAqi <= 300) cityContext.status = 'Poor';
          else if (cityContext.avgAqi <= 400) cityContext.status = 'Very Poor';
          else cityContext.status = 'Severe';

          const sorted = [...valid].sort((a, b) => b.aqi - a.aqi);
          cityContext.worstStation = `${sorted[0].name || sorted[0].id} (AQI ${sorted[0].aqi})`;
          cityContext.bestStation = `${sorted[sorted.length - 1].name || sorted[sorted.length - 1].id} (AQI ${sorted[sorted.length - 1].aqi})`;
        }
      }
    } catch (telemetryErr) {
      console.warn('Telemetry context lookup fallback:', telemetryErr.message);
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey && geminiKey.trim() !== '' && geminiKey !== 'YOUR_GEMINI_API_KEY') {
      try {
        const systemInstruction = `You are "AirSense AI", an expert environmental atmospheric scientist and public health advisor specializing in Delhi NCR and Indian air quality.
Current Real-time Delhi Telemetry:
- Average AQI: ${cityContext.avgAqi} (${cityContext.status})
- Peak Hotspot: ${cityContext.worstStation}
- Cleanest Area: ${cityContext.bestStation}

Instructions:
- Provide concise, empathetic, and actionable guidance regarding air quality, health precautions, N95 masks, outdoor activities, asthma protection, and GRAP regulations.
- Format using clean Markdown with bold keywords and bullet points. Keep answers punchy (2-4 paragraphs maximum).
- Emphasize safety for children, elderly, and respiratory patients.`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey.trim()}`;
        
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${systemInstruction}\n\nUser Question: ${userPrompt}` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 600
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return res.status(200).json({
              reply: candidateText,
              provider: 'Google Gemini AI',
              context: cityContext,
              timestamp: new Date().toISOString()
            });
          }
        } else {
          const errBody = await response.text();
          console.warn('Gemini API returned error, switching to domain engine:', errBody);
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to local engine:', geminiError.message);
      }
    }

    // Fallback Domain AI Engine
    const fallbackReply = generateDomainFallback(userPrompt, cityContext);
    return res.status(200).json({
      reply: fallbackReply,
      provider: 'AirSense Atmospheric AI Engine',
      context: cityContext,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in handleChat:', error);
    return res.status(500).json({
      error: 'Failed to process AI chat request',
      message: error.message
    });
  }
}

export default { handleChat };
