import { useEffect, useRef } from 'react';
import './Games.css';

const games = [
  { name: 'GTA V Roleplay', genre: 'Open World / RP', image: '/images/gta.jpg' },
  { name: 'Valorant', genre: 'Tactical Shooter', image: '/images/valorant.jpg' },
  { name: 'Forza Horizon', genre: 'Racing', image: '/images/forza.jpg' },
  { name: 'CS:GO', genre: 'Tactical Shooter', image: '/images/csgo.png' },
];

export default function Games() {
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
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="games" id="games" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title reveal">
          Games We <span className="gradient-text">Dominate</span>
        </h2>
        <p className="section-subtitle reveal">
          GTA RP is home, but TVA shows up everywhere.
        </p>
        <div className="games-grid">
          {games.map((g, i) => (
            <div className="game-card reveal" key={i} style={{ transitionDelay: `${i * 0.12}s` }}>
              <div 
                className="game-card-bg" 
                style={{ 
                  backgroundImage: `url(${g.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <div className="game-card-overlay">
                <div className="game-name">{g.name}</div>
                <div className="game-genre">{g.genre}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
