import { CacheService } from './cache.service';
import { YouTubeAdapter } from '../adapters/youtube.adapter';
import { KickAdapter } from '../adapters/kick.adapter';
import { dedupeRequest } from '../utils/dedupe';
import { UnifiedStreamerResponse, createOfflineResponse } from '../utils/normalize';

// Maintain a static list of tracked channels (this could be moved to a DB later)
type TrackedChannel = {
  platform: 'kick' | 'youtube';
  id: string;
  url: string;
};

export const TRACKED_CHANNELS: TrackedChannel[] = [
  { platform: 'youtube', id: 'eaglegamingop', url: 'https://www.youtube.com/@eaglegamingop' }, // Actually requires channel ID, placeholder here
  { platform: 'kick', id: 'snipetva', url: 'https://kick.com/snipetva' },
  { platform: 'kick', id: 'germankannapiog', url: 'https://kick.com/germankannapiog' },
  { platform: 'kick', id: 'blindjoker', url: 'https://kick.com/blindjoker' },
  { platform: 'kick', id: 'menatarms', url: 'https://kick.com/menatarms' },
  { platform: 'kick', id: 'killuaagaming', url: 'https://kick.com/killuaagaming' },
  { platform: 'kick', id: 'harithebeast', url: 'https://kick.com/harithebeast' },
  { platform: 'kick', id: 'destrotva', url: 'https://kick.com/destrotva' },
  { platform: 'kick', id: 'tvaraayan', url: 'https://kick.com/tvaraayan' },
  { platform: 'kick', id: 'savagetva', url: 'https://kick.com/savagetva' },
  { platform: 'kick', id: 'rhaegargaming', url: 'https://kick.com/rhaegargaming' },
  { platform: 'kick', id: 'malluvinvergaming', url: 'https://kick.com/malluvinvergaming' },
  { platform: 'kick', id: 'verumserk', url: 'https://kick.com/verumserk' },
  { platform: 'kick', id: 'mrzgoku', url: 'https://kick.com/mrzgoku' }
];

export class LiveService {
  /**
   * Fetches data for a single streamer.
   * Checks cache first. If not found, dedupes the upstream request and fetches.
   */
  static async getStreamerData(platform: string, id: string, url: string): Promise<UnifiedStreamerResponse> {
    const cacheKey = `live:${platform}:${id}`;
    
    // 1. Check Cache
    const cached = CacheService.getStreamer(cacheKey);
    if (cached) {
      return cached;
    }

    // 2. Fetch upstream (Deduped)
    return await dedupeRequest(cacheKey, async () => {
      let data: UnifiedStreamerResponse;
      
      if (platform === 'youtube') {
        data = await YouTubeAdapter.fetchChannel(id, url);
      } else if (platform === 'kick') {
        data = await KickAdapter.fetchChannel(id);
      } else {
        data = createOfflineResponse(platform as any, id, url);
      }

      // 3. Store in Cache
      CacheService.setStreamer(cacheKey, data);
      return data;
    });
  }

  /**
   * Refreshes a single streamer forcefully (used by background worker)
   */
  static async refreshStreamer(platform: string, id: string, url: string): Promise<void> {
    const cacheKey = `live:${platform}:${id}`;
    let data: UnifiedStreamerResponse;

    if (platform === 'youtube') {
      data = await YouTubeAdapter.fetchChannel(id, url);
    } else if (platform === 'kick') {
      data = await KickAdapter.fetchChannel(id);
    } else {
      return;
    }

    CacheService.setStreamer(cacheKey, data);
  }

  /**
   * Gets all tracked channels' current data (mostly from cache)
   */
  static async getAllLiveStreams(): Promise<UnifiedStreamerResponse[]> {
    const promises = TRACKED_CHANNELS.map(channel => 
      this.getStreamerData(channel.platform, channel.id, channel.url)
    );
    return await Promise.all(promises);
  }
}
