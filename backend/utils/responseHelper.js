// Helper to ensure res.status() and res.json() are always available on Vercel Serverless Functions
export function enhanceResponse(res) {
  if (!res) return res;
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
      return res;
    };
  }
  return res;
}

export default enhanceResponse;
