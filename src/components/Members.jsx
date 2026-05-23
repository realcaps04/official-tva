import { useEffect, useRef } from 'react';
import './Members.css';

const members = [
  { initial: 'K', name: 'Kairo', role: 'Founder / OG' },
  { initial: 'V', name: 'Venom', role: 'Warlord' },
  { initial: 'R', name: 'Reaper', role: 'Enforcer' },
  { initial: 'S', name: 'Shadow', role: 'Strategist' },
  { initial: 'B', name: 'Blaze', role: 'Driver' },
  { initial: 'N', name: 'Nova', role: 'Hacker' },
];

export default function Members() {
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
    <section className="members" id="members" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title reveal">
          The <span className="gradient-text">Crew</span>
        </h2>
        <p className="section-subtitle reveal">
          The faces behind the chaos. Meet the legends who make TVA unstoppable.
        </p>
        <div className="members-grid">
          {members.map((m, i) => (
            <div
              className="member-card reveal"
              key={i}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="card-glow"></div>
              <div className="member-avatar">{m.initial}</div>
              <div className="member-name">{m.name}</div>
              <div className="member-role">{m.role}</div>
              <div className="member-socials">
                <a href="#" aria-label="YouTube">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
