import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        {/* Left — Logo */}
        <a href="#home" className="nav-logo">
          <img src="/images/header-logo.png" alt="TVA Logo" className="nav-logo-img" />
        </a>

        {/* Center — Links */}
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`} id="nav-links">
          <li><a href="#home" onClick={closeMenu}>Home</a></li>
          <li><a href="#about" onClick={closeMenu}>About</a></li>
          <li><a href="#members" onClick={closeMenu}>Crew</a></li>
          <li><a href="#highlights" onClick={closeMenu}>Highlights</a></li>
          <li><a href="#games" onClick={closeMenu}>Games</a></li>
        </ul>

        {/* Right — CTA */}
        <div className="nav-right">
          <a href="#community" className="btn btn-primary nav-cta">
            Join Us
          </a>
          <div
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
}
