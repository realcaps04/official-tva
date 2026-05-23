import { useEffect, useRef } from 'react';
import './Highlights.css';

const highlights = [
  {
    title: 'CAPS 4 YEAR JOURNEY 🥺 | TVA GANG | GTA 5 ROLEPLAY MALAYALAM |',
    meta: 'TVA Highlights',
    url: 'https://youtu.be/ol3Y1HhaavM?si=OceEvOf2quojw9ix',
    thumbnail: 'https://img.youtube.com/vi/ol3Y1HhaavM/maxresdefault.jpg',
  },
  {
    title: 'THE BOYS IS BACK.. 😈 | TVA ROLEPLAY | GTA 5 ROLEPLAY MALAYALAM |',
    meta: 'TVA Highlights',
    url: 'https://youtu.be/YDvtoLZKVDg?si=rwfklOQn-KVgsULH',
    thumbnail: 'https://img.youtube.com/vi/YDvtoLZKVDg/maxresdefault.jpg',
  },
  {
    title: 'THE END 🥺 | TVA GANG | GTA 5 ROLEPLAY MALAYALAM |',
    meta: 'TVA Highlights',
    url: 'https://youtu.be/1kmwxA91SUQ?si=-Cq_ePjMpwHdAUMm',
    thumbnail: 'https://img.youtube.com/vi/1kmwxA91SUQ/maxresdefault.jpg',
  },
];

export default function Highlights() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="highlights" id="highlights" ref={sectionRef}>
      <div className="highlights-orb"></div>
      <div className="container">
        <h2 className="section-title reveal">
          Top <span className="gradient-text">Highlights</span>
        </h2>
        <p className="section-subtitle reveal">
          The moments that made history. Clutch plays, epic wars, and legendary escapes.
        </p>
        <div className="highlights-grid">
          {highlights.map((h, i) => (
            <a
              href={h.url}
              target="_blank"
              rel="noreferrer"
              className="highlight-card reveal"
              key={i}
              style={{ transitionDelay: `${i * 0.1}s`, textDecoration: 'none', display: 'block' }}
            >
              <div className="highlight-thumbnail">
                <div 
                  className="highlight-image" 
                  style={{ 
                    backgroundImage: `url(${h.thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '100%',
                    transition: 'transform var(--transition-med)'
                  }} 
                />
                <div className="highlight-play"></div>
              </div>
              <div className="highlight-info">
                <div className="highlight-title">{h.title}</div>
                <div className="highlight-meta">{h.meta}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
