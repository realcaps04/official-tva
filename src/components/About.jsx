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
            <h2 className="section-title about-title">
              Who is <img src="/images/about-tva-logo.png" alt="TVA Logo" className="about-tva-logo" />?
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
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="stat-number" data-target="40">0</div>
              <div className="stat-label">Crew Members</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
              </div>
              <div className="stat-number" data-target="1200">0</div>
              <div className="stat-label">Streams</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
                  <line x1="13" x2="19" y1="19" y2="13"/>
                  <line x1="16" x2="20" y1="16" y2="20"/>
                  <line x1="19" x2="21" y1="21" y2="19"/>
                  <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/>
                  <line x1="5" x2="9" y1="14" y2="18"/>
                  <line x1="7" x2="4" y1="17" y2="20"/>
                  <line x1="3" x2="5" y1="19" y2="21"/>
                </svg>
              </div>
              <div className="stat-number" data-target="300">0</div>
              <div className="stat-label">Wars Won</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                </svg>
              </div>
              <div className="stat-number" data-target="100">0</div>
              <div className="stat-label">K Followers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
