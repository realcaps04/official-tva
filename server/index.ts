import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import liveRoutes from './routes/live.routes';
import { startPollingWorker } from './workers/refresh.worker';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middleware
app.use(cors());
app.use(express.json());

// Rate Limiting (Prevent API burst from frontend)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window` (here, per minute)
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Routes
app.use('/api/live', liveRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server & Background Workers
app.listen(PORT, () => {
  console.log(`[Server] Live Aggregation Service running on port ${PORT}`);
  startPollingWorker();
});
