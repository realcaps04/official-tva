import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="footer-logo">
              <img src="/images/header-logo.png" alt="TVA Logo" style={{ height: '48px', objectFit: 'contain' }} />
            </a>
            <p>
              The ultimate page for the TVA Family. Dominating GTA RP and every game we touch. Built by fans, for the family.
            </p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#members">Crew</a></li>
              <li><a href="#highlights">Highlights</a></li>
              <li><a href="#games">Games</a></li>
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
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 TVA Gang. Fan Page — Not officially affiliated.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
