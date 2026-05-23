import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './KvaPage.css';

export default function KvaPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    // Add a class to body for global theme override if needed, 
    // or keep styles scoped to kva-page
  }, []);

  return (
    <div className="kva-page">
      <div className="kva-container">
        <div className="kva-glitch-wrapper">
          <h1 className="kva-title" data-text="GANG KVA">GANG KVA</h1>
        </div>
        <div className="kva-status">
          <span className="pulse-dot"></span>
          SYSTEM UNDER DEVELOPMENT
        </div>
        <p className="kva-subtitle">
          The shadows are gathering. Something big is coming soon.
        </p>
        <Link to="/" className="kva-back-btn">
          RETURN TO BASE
        </Link>
      </div>
    </div>
  );
}
