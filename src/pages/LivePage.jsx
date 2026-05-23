import { useEffect, useState } from 'react';
import './LivePage.css';

const streamerConfig = {
  'eaglegamingop': { name: 'Eagle Gaming', gang: 'Tva members live', avatar: '/images/eagle_gaming.jpg', color: '#ff0000' },
  'snipetva': { name: 'SnipeTVA', gang: 'Tva members live', avatar: 'S', color: '#53fc18' },
  'germankannapiog': { name: 'GermanKannapiOG', gang: 'Tva members live', avatar: 'G', color: '#53fc18' },
  'blindjoker': { name: 'BlindJoker', gang: 'Tva members live', avatar: 'B', color: '#53fc18' },
  'menatarms': { name: 'MenAtArms', gang: 'Tva members live', avatar: 'M', color: '#53fc18' },
  'killuaagaming': { name: 'KILLUAAGAMING', gang: 'Tva members live', avatar: 'K', color: '#53fc18' },
  'harithebeast': { name: 'HARITHEBEAST', gang: 'Tva members live', avatar: 'H', color: '#53fc18' },
  'destrotva': { name: 'DestroTVA', gang: 'Tva members live', avatar: 'D', color: '#53fc18' },
  'tvaraayan': { name: 'TVARAAYAN', gang: 'Tva members live', avatar: 'T', color: '#53fc18' },
  'verumsrk': { name: 'VERUMSRk', gang: 'Tva members live', avatar: 'V', color: '#53fc18' },
  'mrzgoku': { name: 'Mrz Goku', gang: 'Tva members live', avatar: 'M', color: '#53fc18' }
};

const filters = ['All', 'Kick', 'Youtube', 'Tva members live', 'Kva members live', 'Others'];

export default function LivePage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [liveStreamers, setLiveStreamers] = useState([]);
  const [error, setError] = useState(null);

  const fetchLiveStreams = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/api/live/all');
      if (!res.ok) throw new Error('Failed to fetch from live API');
      const data = await res.json();
      
      const mergedStreamers = data.map(stream => {
        const config = streamerConfig[stream.channelId.toLowerCase()] || {};
        return {
          ...stream,
          name: config.name || stream.channelId,
          gang: config.gang || 'Others',
          avatar: config.avatar || stream.channelId.charAt(0).toUpperCase(),
          color: config.color || (stream.platform === 'kick' ? '#53fc18' : '#ff0000'),
          viewers: stream.viewerCount >= 1000 ? (stream.viewerCount / 1000).toFixed(1) + 'K' : stream.viewerCount.toString(),
        };
      });
      setLiveStreamers(mergedStreamers);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error(err);
      setError('Could not connect to Live Aggregation Service.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchLiveStreams();
    const interval = setInterval(fetchLiveStreams, 15000); // Poll backend every 15s
    return () => clearInterval(interval);
  }, []);

  const filteredStreamers = liveStreamers
    .filter(streamer => {
      if (!streamer.isLive) return false; // Show ONLY live streamers

      if (activeFilter === 'All') return true;
      if (activeFilter === 'Kick') return streamer.platform.toLowerCase() === 'kick';
      if (activeFilter === 'Youtube') return streamer.platform.toLowerCase() === 'youtube';
      return streamer.gang.toLowerCase() === activeFilter.toLowerCase();
    })
    .sort((a, b) => b.isLive - a.isLive);

  return (
    <div className="live-page">
      <div className="container live-container">
        <div className="live-header">
          <h1 className="section-title">
            Currently <span className="gradient-text">Live</span>
          </h1>
          <p className="section-subtitle">
            Tune in to watch TVA members dominate the streets live on Kick and YouTube.
          </p>
        </div>

        <div className="live-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`live-filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="live-actions">
          <button className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`} onClick={fetchLiveStreams}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh Streams'}
          </button>
          <span className="last-refreshed">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </span>
        </div>

        {error && (
          <div style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <div className="live-grid" style={{ opacity: isRefreshing ? 0.5 : 1, transition: 'opacity 0.3s' }}>
          {filteredStreamers.map((streamer, i) => (
            <a 
              href={streamer.isLive ? streamer.url : '#'} 
              target={streamer.isLive ? "_blank" : "_self"}
              rel="noreferrer" 
              className={`live-card ${!streamer.isLive ? 'offline' : ''}`}
              key={i}
              style={{ '--brand-color': streamer.color }}
              onClick={(e) => {
                if (!streamer.isLive) e.preventDefault();
              }}
            >
              <div className="live-thumbnail">
                <div 
                  className="live-image" 
                  style={{ backgroundImage: `url(${streamer.thumbnail})` }}
                ></div>
                {streamer.isLive ? (
                  <div className="live-badge">LIVE</div>
                ) : (
                  <div className="live-badge offline-badge">OFFLINE</div>
                )}
                {streamer.isLive && (
                  <div className="live-viewers">
                    <span className="dot"></span> {streamer.viewers}
                  </div>
                )}
                <div className="live-play-overlay">
                  {streamer.isLive ? (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <span style={{ fontFamily: 'Orbitron', fontWeight: 700, letterSpacing: '2px', color: '#fff' }}>OFFLINE</span>
                  )}
                </div>
              </div>
              <div className="live-info">
                <div className="live-avatar">
                  {streamer.avatar.length === 1 ? (
                    <span>{streamer.avatar}</span>
                  ) : (
                    <img src={streamer.avatar} alt={streamer.name} />
                  )}
                </div>
                <div className="live-details">
                  <h3 className="live-title">{streamer.title}</h3>
                  <div className="live-meta">
                    <span className="live-name">{streamer.name}</span>
                    <span className="live-platform">{streamer.platform}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        {filteredStreamers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <p>No streams currently live in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
