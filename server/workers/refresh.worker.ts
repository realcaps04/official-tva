import cron from 'node-cron';
import { LiveService, TRACKED_CHANNELS } from '../services/live.service';
import { CacheService } from '../services/cache.service';

/**
 * The Polling Engine runs entirely in the background.
 * It loops over tracked channels and updates the cache.
 * Live streams refresh every 30 seconds.
 * Offline streams refresh every 5 minutes.
 */
export function startPollingWorker() {
  console.log('[Worker] Starting background polling engine...');

  // 1. Cron for LIVE channels (Every 30 seconds)
  cron.schedule('*/30 * * * * *', async () => {
    // console.log('[Worker] Refreshing known LIVE channels...');
    for (const channel of TRACKED_CHANNELS) {
      const cacheKey = `live:${channel.platform}:${channel.id}`;
      const cachedData = CacheService.getStreamer(cacheKey);
      
      // If we don't have it cached, or it's known to be live, fetch it frequently
      if (!cachedData || cachedData.isLive) {
        try {
          await LiveService.refreshStreamer(channel.platform, channel.id, channel.url);
        } catch (e) {
          console.error(`[Worker Error] Failed to refresh ${channel.id}:`, e);
        }
        // Small delay to prevent bursting upstream APIs
        await new Promise(r => setTimeout(r, 500)); 
      }
    }
  });

  // 2. Cron for OFFLINE channels (Every 5 minutes)
  cron.schedule('*/5 * * * *', async () => {
    console.log('[Worker] Deep refreshing OFFLINE channels...');
    for (const channel of TRACKED_CHANNELS) {
      const cacheKey = `live:${channel.platform}:${channel.id}`;
      const cachedData = CacheService.getStreamer(cacheKey);
      
      if (cachedData && !cachedData.isLive) {
        try {
          await LiveService.refreshStreamer(channel.platform, channel.id, channel.url);
        } catch (e) {
          console.error(`[Worker Error] Failed to deep refresh ${channel.id}:`, e);
        }
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  });

  // 3. Perform an initial fetch immediately on startup
  setTimeout(() => {
    console.log('[Worker] Performing initial data hydration...');
    LiveService.getAllLiveStreams().catch(console.error);
  }, 1000);
}
