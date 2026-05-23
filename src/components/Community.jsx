import { useEffect, useRef } from 'react';
import './Community.css';

export default function Community() {
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
    <section className="community" id="community" ref={sectionRef}>
      <div className="community-orb community-orb--1"></div>
      <div className="community-orb community-orb--2"></div>
      <div className="container">
        <div className="community-content">
          <h2 className="section-title reveal">
            Join the <span className="gradient-text">Family</span>
          </h2>
          <p className="community-desc reveal">
            Be part of something bigger. Follow TVA across platforms, catch every stream,
            and connect with the community that runs the streets.
          </p>
          <div className="social-links reveal">
            <a href="https://www.youtube.com/@eaglegamingop" className="social-link youtube" target="_blank" rel="noopener noreferrer">
              <span className="social-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
              </span>
              YouTube
            </a>
            <a href="https://discord.gg/eagle-gaming-641181356394807309" className="social-link discord" target="_blank" rel="noopener noreferrer">
              <span className="social-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.32 4.37A19.8 19.8 0 0 0 15.39 3c-.22.4-.47.93-.64 1.35a18.27 18.27 0 0 0-5.5 0A14 14 0 0 0 8.6 3 19.74 19.74 0 0 0 3.68 4.37 20.3 20.3 0 0 0 .1 17.26a19.94 19.94 0 0 0 6.07 3.06 15 15 0 0 0 1.32-2.14 12.88 12.88 0 0 1-2.08-1l.5-.39a14.17 14.17 0 0 0 12.18 0l.5.39a12.9 12.9 0 0 1-2.08 1 15.03 15.03 0 0 0 1.32 2.14 19.87 19.87 0 0 0 6.07-3.06A20.27 20.27 0 0 0 20.32 4.37zM8.01 14.6c-1.12 0-2.04-1.03-2.04-2.3s.9-2.3 2.04-2.3 2.06 1.03 2.04 2.3c0 1.27-.9 2.3-2.04 2.3zm7.98 0c-1.12 0-2.04-1.03-2.04-2.3s.9-2.3 2.04-2.3 2.06 1.03 2.04 2.3c0 1.27-.9 2.3-2.04 2.3z"/></svg>
              </span>
              Discord
            </a>
            <a href="https://www.instagram.com/official.tva?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="social-link instagram" target="_blank" rel="noopener noreferrer">
              <span className="social-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </span>
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
