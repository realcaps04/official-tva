import axios from 'axios';
import { UnifiedStreamerResponse, createOfflineResponse } from '../utils/normalize';

export class KickAdapter {
  static async fetchChannel(username: string): Promise<UnifiedStreamerResponse> {
    const customUrl = `https://kick.com/${username}`;
    try {
      // NOTE: Kick endpoints are heavily protected by Cloudflare.
      // This might fail depending on server IP and headers.
      const res = await axios.get(`https://kick.com/api/v1/channels/${username}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        },
        timeout: 8000
      });

      const data = res.data;
      if (!data || !data.livestream) {
        return createOfflineResponse('kick', username, customUrl);
      }

      const stream = data.livestream;
      return {
        platform: 'kick',
        channelId: username,
        isLive: true,
        viewerCount: stream.viewer_count || 0,
        title: stream.session_title || '',
        thumbnail: stream.thumbnail?.url || '',
        category: stream.categories?.[0]?.name || '',
        startedAt: stream.created_at || '',
        url: customUrl,
        lastUpdated: new Date().toISOString()
      };
    } catch (error: any) {
      console.error(`Kick API Error for ${username}:`, error.message);
      // Return offline rather than crashing if Cloudflare blocks or stream is offline
      return createOfflineResponse('kick', username, customUrl);
    }
  }
}
