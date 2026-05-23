import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
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
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src="/images/header-logo.png" alt="TVA Logo" className="nav-logo-img" />
        </Link>

        {/* Center — Links */}
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`} id="nav-links">
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><HashLink smooth to="/#about" onClick={closeMenu}>About</HashLink></li>
          <li><HashLink smooth to="/#members" onClick={closeMenu}>Crew</HashLink></li>
          <li><HashLink smooth to="/#highlights" onClick={closeMenu}>Highlights</HashLink></li>
          <li><HashLink smooth to="/#games" onClick={closeMenu}>Games</HashLink></li>
          <li><HashLink smooth to="/#tournaments" onClick={closeMenu}>Tournaments</HashLink></li>
        </ul>

        {/* Right — CTA */}
        <div className="nav-right">
          <div className="dev-notice-wrapper">
            <span className="dev-icon">!</span>
            <div className="dev-popup">
              <p>The website is under development so mistakes may be occured. So kindly support until the completion.</p>
              <p>Regards, developer <a href="https://www.instagram.com/caps_real_?igsh=MW5majV6b3c0cHY0Yg==" target="_blank" rel="noreferrer" className="dev-ig-link">Caps</a></p>
            </div>
          </div>
          <HashLink smooth to="/#community" className="btn btn-primary nav-cta">
            Join Us
          </HashLink>
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
