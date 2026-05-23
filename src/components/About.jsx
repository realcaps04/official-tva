import { useEffect, useRef } from 'react';
import './About.css';

export default function About() {
  const sectionRef = useRef(null);
  const statsAnimated = useRef(false);

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

  /* Animated counter */
  useEffect(() => {
    const statsGrid = sectionRef.current?.querySelector('.stats-grid');
    if (!statsGrid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated.current) {
            statsAnimated.current = true;
            const nums = statsGrid.querySelectorAll('.stat-number');
            nums.forEach((num) => {
              const target = parseInt(num.getAttribute('data-target'), 10);
              const duration = 2200;
              const start = performance.now();
              function tick(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                num.textContent = Math.floor(eased * target).toLocaleString() + (progress >= 1 ? '+' : '');
                if (progress < 1) requestAnimationFrame(tick);
              }
              requestAnimationFrame(tick);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(statsGrid);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      {/* Decorative background elements */}
      <div className="about-orb about-orb--red"></div>
      <div className="about-orb about-orb--blue"></div>

      <div className="container">
        <div className="about-grid">
          <div className="about-text reveal">
            <div className="about-label">Our Story</div>
            <h2 className="section-title">
              Who is <span className="gradient-text">TVA</span>?
            </h2>
            <p>
              <strong>TVA</strong> isn't just a gang — it's a brotherhood forged in the chaos of the streets.
              Born in the world of GTA Roleplay, the crew has risen through wars, heists, and
              legendary moments that keep thousands of viewers locked in.
            </p>
            <p>
              From high-speed chases through the city to intense standoffs that rewrite server
              history, TVA stands as one of the most dominant forces in the RP scene and beyond.
            </p>
          </div>
          <div className="stats-grid reveal">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-number" data-target="50">0</div>
              <div className="stat-label">Crew Members</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎬</div>
              <div className="stat-number" data-target="1200">0</div>
              <div className="stat-label">Streams</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚔️</div>
              <div className="stat-number" data-target="300">0</div>
              <div className="stat-label">Wars Won</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-number" data-target="100">0</div>
              <div className="stat-label">K Followers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
