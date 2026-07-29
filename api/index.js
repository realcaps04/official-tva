// Vercel serverless handler for all /api/* requests.
// This folder has its own package.json with "type":"commonjs" so require() works
// even though the project root uses "type":"module".
const { app } = require('../server/dist/index.js');
module.exports = app;
