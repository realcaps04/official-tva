import { Router, Request, Response } from 'express';
import { LiveService } from '../services/live.service';

const router = Router();

// GET /api/live/all
// Returns all tracked channels (mostly from cache)
router.get('/all', async (req: Request, res: Response) => {
  try {
    const streams = await LiveService.getAllLiveStreams();
    res.json(streams);
  } catch (error: any) {
    console.error('Error fetching all live streams:', error);
    res.status(500).json({ error: 'Failed to fetch live streams.' });
  }
});

// GET /api/live/:platform/:id
// Fetches specific channel
router.get('/:platform/:id', async (req: Request, res: Response) => {
  try {
    const { platform, id } = req.params;
    // URL would typically be retrieved from a DB, hardcoding for Kick mostly here
    const url = platform === 'kick' ? `https://kick.com/${id}` : `https://youtube.com/channel/${id}`;
    
    const stream = await LiveService.getStreamerData(platform, id, url);
    res.json(stream);
  } catch (error: any) {
    console.error(`Error fetching stream ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch stream data.' });
  }
});

export default router;
