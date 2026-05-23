import axios from 'axios';
import { UnifiedStreamerResponse, createOfflineResponse } from '../utils/normalize';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

export class YouTubeAdapter {
  static async fetchChannel(channelId: string, customUrl: string): Promise<UnifiedStreamerResponse> {
    if (!YOUTUBE_API_KEY) {
      console.warn('YOUTUBE_API_KEY is not set. Returning offline response.');
      return createOfflineResponse('youtube', channelId, customUrl);
    }

    try {
      // Step 1: Search for active live broadcasts for this channel
      const searchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          channelId: channelId,
          eventType: 'live',
          type: 'video',
          key: YOUTUBE_API_KEY
        }
      });

      const items = searchRes.data.items;
      if (!items || items.length === 0) {
        return createOfflineResponse('youtube', channelId, customUrl);
      }

      const videoId = items[0].id.videoId;

      // Step 2: Get live streaming details to extract concurrent viewers
      const videoRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,liveStreamingDetails',
          id: videoId,
          key: YOUTUBE_API_KEY
        }
      });

      const videoData = videoRes.data.items[0];
      if (!videoData || !videoData.liveStreamingDetails) {
        return createOfflineResponse('youtube', channelId, customUrl);
      }

      const snippet = videoData.snippet;
      const liveDetails = videoData.liveStreamingDetails;

      return {
        platform: 'youtube',
        channelId: channelId,
        isLive: true,
        viewerCount: parseInt(liveDetails.concurrentViewers || '0', 10),
        title: snippet.title,
        thumbnail: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || '',
        category: 'Gaming', // YouTube category IDs require a separate mapping, keeping simple
        startedAt: liveDetails.actualStartTime,
        url: customUrl,
        lastUpdated: new Date().toISOString()
      };
    } catch (error: any) {
      console.error(`YouTube API Error for ${channelId}:`, error.message);
      // Return offline/stale rather than throwing to avoid crashing
      return createOfflineResponse('youtube', channelId, customUrl);
    }
  }
}
