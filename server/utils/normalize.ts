export interface UnifiedStreamerResponse {
  platform: 'kick' | 'youtube';
  channelId: string;
  isLive: boolean;
  viewerCount: number;
  title: string;
  thumbnail: string;
  category: string;
  startedAt: string;
  url: string;
  lastUpdated: string;
}

export function createOfflineResponse(platform: 'kick' | 'youtube', channelId: string, url: string): UnifiedStreamerResponse {
  return {
    platform,
    channelId,
    isLive: false,
    viewerCount: 0,
    title: '',
    thumbnail: '',
    category: '',
    startedAt: '',
    url,
    lastUpdated: new Date().toISOString()
  };
}
