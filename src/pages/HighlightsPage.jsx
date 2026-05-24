import { useEffect } from 'react';
import './HighlightsPage.css';

const allHighlights = [
  {
    title: 'CAPS 4 YEAR JOURNEY 🥺 | TVA GANG | GTA 5 ROLEPLAY MALAYALAM |',
    channel: 'Eagle Gaming',
    url: 'https://youtu.be/ol3Y1HhaavM?si=OceEvOf2quojw9ix',
    thumbnail: 'https://img.youtube.com/vi/ol3Y1HhaavM/maxresdefault.jpg',
  },
  {
    title: 'THE BOYS IS BACK.. 😈 | TVA ROLEPLAY | GTA 5 ROLEPLAY MALAYALAM |',
    channel: 'Eagle Gaming',
    url: 'https://youtu.be/YDvtoLZKVDg?si=rwfklOQn-KVgsULH',
    thumbnail: 'https://img.youtube.com/vi/YDvtoLZKVDg/maxresdefault.jpg',
  },
  {
    title: 'THE END 🥺 | TVA GANG | GTA 5 ROLEPLAY MALAYALAM |',
    channel: 'Eagle Gaming',
    url: 'https://youtu.be/1kmwxA91SUQ?si=-Cq_ePjMpwHdAUMm',
    thumbnail: 'https://img.youtube.com/vi/1kmwxA91SUQ/maxresdefault.jpg',
  },
];

export default function HighlightsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="highlights-page">
      <div className="highlights-page-hero">
        <div className="highlights-page-orb"></div>
        <div className="highlights-page-orb2"></div>
        <div className="container">
          <h1 className="highlights-page-title">
            TVA <span className="gradient-text">Highlights</span>
          </h1>
          <p className="highlights-page-subtitle">
            Every legendary moment. Every clutch play. Every war. All in one place.
          </p>
        </div>
      </div>

      <div className="container highlights-page-content">
        <div className="highlights-page-grid">
          {allHighlights.map((h, i) => (
            <a
              key={i}
              href={h.url}
              target="_blank"
              rel="noreferrer"
              className="highlights-page-card"
            >
              <div className="highlights-page-thumb">
                <div
                  className="highlights-page-img"
                  style={{ backgroundImage: `url(${h.thumbnail})` }}
                />
                <div className="highlights-page-play"></div>
                <div className="highlights-page-badge">YouTube</div>
              </div>
              <div className="highlights-page-info">
                <h3 className="highlights-page-card-title">{h.title}</h3>
                <div className="highlights-page-meta">
                  <span className="highlights-page-channel">{h.channel}</span>
                  <span className="highlights-page-platform">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff0000">
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/>
                    </svg>
                    Watch on YouTube
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
