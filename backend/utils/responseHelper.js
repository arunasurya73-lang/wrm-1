// Safe response helper for Vercel Serverless Functions and Node.js runtime
export function enhanceResponse(res) {
  if (!res) return res;

  const originalStatus = typeof res.status === 'function' ? res.status.bind(res) : null;
  const originalJson = typeof res.json === 'function' ? res.json.bind(res) : null;

  res.status = function(code) {
    res.statusCode = code;
    if (originalStatus) {
      try { originalStatus(code); } catch (e) {}
    }
    return res;
  };

  res.json = function(data) {
    if (originalJson) {
      try {
        return originalJson(data);
      } catch (e) {
        // Fallback to native end
      }
    }
    if (!res.headersSent) {
      try {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      } catch (e) {}
    }
    res.end(JSON.stringify(data, null, 2));
    return res;
  };

  return res;
}

export default enhanceResponse;
