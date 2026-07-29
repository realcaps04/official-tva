// Vercel serverless handler for all /api/* requests.
// api/package.json has "type":"commonjs" so require() works
// even though the project root uses "type":"module".

let app;
let loadError;

try {
  const mod = require('../server/dist/index.js');
  app = mod.app;
  if (!app) throw new Error('server/dist/index.js did not export `app`');
} catch (err) {
  loadError = err;
  console.error('[Vercel] Failed to load Express app:', err);
}

module.exports = function handler(req, res) {
  if (loadError || !app) {
    res.status(500).json({
      error: 'Server failed to initialise',
      detail: loadError ? loadError.message : 'app is undefined',
    });
    return;
  }
  app(req, res);
};
