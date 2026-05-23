import { useEffect, useRef } from 'react';
import './Highlights.css';

const highlights = [
  {
    title: 'The Great Gang War — TVA vs Rivals',
    meta: '245K views • 3 months ago',
    emoji: '⚔️',
  },
  {
    title: '$10M Heist — Clean Getaway',
    meta: '189K views • 1 month ago',
    emoji: '💰',
  },
  {
    title: 'Insane Police Chase — 20 Min Escape',
    meta: '312K views • 2 weeks ago',
    emoji: '🚔',
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
            <div
              className="highlight-card reveal"
              key={i}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="highlight-thumbnail">
                <div className="highlight-placeholder">
                  <span>{h.emoji}</span>
                </div>
                <div className="highlight-play"></div>
              </div>
              <div className="highlight-info">
                <div className="highlight-title">{h.title}</div>
                <div className="highlight-meta">{h.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
