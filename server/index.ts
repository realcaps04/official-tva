import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import liveRoutes from './routes/live.routes';
import cmsRoutes from './routes/cms.routes';
import { startPollingWorker } from './workers/refresh.worker';

// Load environment variables from server/.env regardless of cwd
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Rate Limiting (Prevent API burst from frontend)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Routes
app.use('/api/live', liveRoutes);
app.use('/api', cmsRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export app for Vercel serverless handler
export { app };

// Start Server & Background Workers (only when running directly, not on Vercel)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`[Server] TVA API running on port ${PORT}`);
    console.log(`[Admin] Login requires Supabase admin_users credentials`);
    const hasUrl = Boolean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
    const hasKey = Boolean(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY);
    const hasFallback = Boolean(process.env.ADMIN_PASSWORD);
    console.log(`[Admin] Supabase URL: ${hasUrl ? 'set' : 'MISSING'}, anon key: ${hasKey ? 'set' : 'MISSING'}, env fallback: ${hasFallback ? 'set' : 'off'}`);
    startPollingWorker();
  });
}
