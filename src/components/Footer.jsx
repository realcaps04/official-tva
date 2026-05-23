import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/images/header-logo.png" alt="TVA Logo" style={{ height: '48px', objectFit: 'contain' }} />
            </Link>
            <p>
              The ultimate page for the TVA Family. Dominating GTA RP and every game we touch. Built by fans, for the family.
            </p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><HashLink smooth to="/#about">About</HashLink></li>
              <li><HashLink smooth to="/#members">Crew</HashLink></li>
              <li><HashLink smooth to="/#highlights">Highlights</HashLink></li>
              <li><HashLink smooth to="/#games">Games</HashLink></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <ul>
              <li><a href="#">YouTube</a></li>
              <li><a href="#">Discord</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Twitter / X</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Developer</h4>
            <ul>
              <li><a href="#">Why I built ?</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 TVA Family all rights reserved</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
