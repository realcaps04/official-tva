import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import './Footer.css';

export default function Footer() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
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
              <h4>Other Gangs</h4>
              <ul>
                <li><Link to="/kva" className="hover-green">Gang KVA</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Developer</h4>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setShowModal(true); }}>Why I built ?</a></li>
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            <div className="modal-body">
              <h3 className="modal-title">To my TVA Family ❤️</h3>
              <p>I honestly don’t even know where to begin because words will never truly be enough to explain how grateful I am for every single one of you.</p>
              
              <p>Life hasn’t always been easy for me. There were moments when I felt completely broken, lost, stressed, and mentally exhausted. Times when I doubted myself, stayed silent, and carried battles nobody could see. But during every one of those dark phases, TVA never felt like just a crew, a server, or a gaming family… it felt like home.</p>
              
              <p>You all stood beside me when I needed support the most. Not only for me, but for so many others who were struggling in their own ways too. That’s what makes this family different. We don’t just play together — we stand together.</p>
              
              <p>Every laugh in voice chat, every late-night conversation, every random moment of madness, every “are you okay?” message, every time someone checked in, supported, defended, motivated, or simply stayed beside me… those things meant more than you’ll ever realize.</p>
              
              <p>Special thanks to <strong className="gradient-text">Eagle Gaming 🦅❤️</strong><br/>
              You’ve been more than just a leader or a gamer to this family. Your support, loyalty, guidance, and the energy you bring into TVA helped build something truly special. You created a place where people feel valued, respected, and connected. Thank you for believing in all of us, especially during the times when we struggled to believe in ourselves.</p>
              
              <p>And to every single crew member of TVA — old members, new members, active ones, silent supporters, everyone — thank you from the bottom of my heart. You all became a part of my journey, my memories, and honestly, a part of my life.</p>
              
              <div className="modal-quote">
                TVA is not just a name.<br/>
                It’s loyalty.<br/>
                It’s brotherhood.<br/>
                It’s memories.<br/>
                It’s support during the worst days.<br/>
                It’s happiness during the best days.<br/>
                It’s a family that stays together no matter what happens.
              </div>
              
              <p>No matter where life takes us, I will always carry respect and love for this family in my heart forever.</p>
              
              <p>Legacy isn’t built alone…<br/>
              and TVA proved that.</p>
              
              <p className="modal-signature">
                Love you all forever ❤️<br/>
                <span>TVA ON TOP 👑</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
