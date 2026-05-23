import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { members } from '../data/members';
import './Members.css';

export default function Members({ limit, showViewAll }) {
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

  const displayedMembers = limit ? members.slice(0, limit) : members;

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
          {displayedMembers.map((m, i) => (
            <div
              className="member-card reveal"
              key={i}
              style={{ transitionDelay: `${(i % 6) * 0.08}s` }}
            >
              <div className="card-glow"></div>
              <div className="member-avatar">{m.initial}</div>
              <div className="member-name">{m.name}</div>
              <div className="member-role">{m.role}</div>
              <div className="member-socials">
                <a href="#" aria-label="YouTube" className="social-icon">
                  <img src="/images/youtube.png" alt="YouTube" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </a>
                <a href="#" aria-label="Kick" className="social-icon">
                  <img src="/images/kick.png" alt="Kick" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </a>
                <a href="#" aria-label="Instagram" className="social-icon">
                  <img src="/images/instagram.png" alt="Instagram" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </a>
                <a href="#" aria-label="Discord" className="social-icon">
                  <img src="/images/discord.png" alt="Discord" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {showViewAll && (
          <div className="members-action reveal" style={{ marginTop: '40px' }}>
            <Link to="/crew" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '0.85rem' }}>
              View All Members
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
