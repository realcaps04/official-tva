import NodeCache from 'node-cache';
import { UnifiedStreamerResponse } from '../utils/normalize';

// In-memory cache fallback using node-cache
// stdTTL is default time to live in seconds
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export class CacheService {
  /**
   * Sets a streamer's normalized data into the cache.
   * TTL is 30 seconds if live, 300 seconds if offline.
   */
  static setStreamer(key: string, data: UnifiedStreamerResponse): void {
    const ttl = data.isLive ? 30 : 300;
    cache.set(key, data, ttl);
  }

  /**
   * Gets a streamer's normalized data from the cache.
   */
  static getStreamer(key: string): UnifiedStreamerResponse | undefined {
    return cache.get<UnifiedStreamerResponse>(key);
  }

  /**
   * Delete a streamer from the cache
   */
  static deleteStreamer(key: string): void {
    cache.del(key);
  }

  /**
   * Get all cached keys matching a pattern (simulated for node-cache)
   */
  static getAllKeys(): string[] {
    return cache.keys();
  }
}
