import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TournamentsPage.css';

/* ── Status filter categories ───────────────────── */
const STATUS_FILTERS = [
  { id: 'all',      label: 'All Tournaments' },
  { id: 'live',     label: 'Live Now',   dot: '#ff4444' },
  { id: 'upcoming', label: 'Upcoming',   dot: '#ffaa00' },
  { id: 'completed',label: 'Completed',  dot: '#53fc18' },
];

/* ── Game categories ────────────────────────────── */
export const GAMES = [
  { id: 'all',      label: 'All',      logo: null,                      color: '#a0a0c0' },
  { id: 'pubg',     label: 'PUBG PC',  logo: '/images/pubg.png',        color: '#f4a023' },
  { id: 'valorant', label: 'Valorant', logo: '/images/valorant_logo.png', color: '#ff4655' },
  { id: 'gta',      label: 'GTA RP',   logo: '/images/gta_logo.png',    color: '#ff7bff' },
];

/* ── All tournament data (source of truth) ──────── */
export const TOURNAMENTS = [
  {
    id: 'pubg-tva-xlantis-2026',
    gameId: 'pubg',
    status: 'completed',
    title: 'PUBG – Powered by TVA & Xlantis',
    subtitle: 'India Squads Open',
    year: '2026',
    prizePool: '₹1,00,000',
    format: 'Squads (4v4)',
    region: 'India',
    teams: 32,
    winner: 'Team Danjaar',
    winnerLogo: '/images/danjaar_logo.png',
    color: '#f4a023',
    colorRgb: '244,160,35',
    qualifiers: {
      dates: ['April 19, 2026 (Sunday) – Groups A vs B', 'April 20, 2026 (Monday) – Groups C vs D'],
      time: '22:30 IST',
      format: '32 teams → 4 groups of 8 → Top 8/day qualify to finals',
      matchesPerDay: 5,
    },
    finals: {
      date: 'April 21, 2026 (Tuesday)',
      time: '22:30 IST',
      teams: 16,
      matches: 5,
      maps: ['Erangel', 'Miramar', 'Taego', 'Rondo'],
    },
    platforms: ['eWave.gg', 'Squad One Elite Battlegrounds Discord', 'eWave.gg Discord'],
    prizes: [
      { place: '1st Place', icon: '🥇', amount: '₹40,000' },
      { place: '2nd Place', icon: '🥈', amount: '₹30,000' },
      { place: '3rd Place', icon: '🥉', amount: '₹20,000' },
      { place: 'Top Kill',  icon: '🔫', amount: '₹10,000' },
    ],
    antiCheat: 'eWave AntiCheat System',
  },
  {
    id: 'valorant-clash',
    gameId: 'valorant',
    status: 'upcoming',
    title: 'TVA Valorant Clash',
    subtitle: '5v5 Competitive',
    color: '#ff4655',
    colorRgb: '255,70,85',
  },
  {
    id: 'gta-grand-prix',
    gameId: 'gta',
    status: 'upcoming',
    title: 'TVA RP Grand Prix',
    subtitle: 'Street Racing & Events',
    color: '#ff7bff',
    colorRgb: '255,123,255',
  },
  {
    id: 'pubg-mobile-open',
    gameId: 'pubg',
    status: 'upcoming',
    title: 'TVA PUBG Mobile Open',
    subtitle: 'Community Open Squads',
    color: '#f4a023',
    colorRgb: '244,160,35',
  },
];

const gameMap = Object.fromEntries(GAMES.map((g) => [g.id, g]));

/* ═══════════════════════════════════════════════
   TOURNAMENTS LIST PAGE
═══════════════════════════════════════════════ */
export default function TournamentsPage() {
  const [activeGame,   setActiveGame]   = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = TOURNAMENTS.filter((t) => {
    const matchGame   = activeGame   === 'all' || t.gameId === activeGame;
    const matchStatus = activeStatus === 'all' || t.status === activeStatus;
    return matchGame && matchStatus;
  });

  const completed = filtered.filter((t) => t.status === 'completed');
  const upcoming  = filtered.filter((t) => t.status === 'upcoming');
  const live      = filtered.filter((t) => t.status === 'live');

  return (
    <div className="tp-page">
      {/* Hero */}
      <div className="tp-hero">
        <div className="tp-orb tp-orb1" />
        <div className="tp-orb tp-orb2" />
        <div className="container">
          <span className="tp-badge">⚔️ OFFICIAL TVA TOURNAMENTS</span>
          <h1 className="tp-hero-title">Battle for <span className="gradient-text">Glory</span></h1>
          <p className="tp-hero-sub">TVA doesn't just dominate the streets — we own the competitive scene.</p>
          <div className="tp-stats-bar">
            <div className="tp-stat">
              <span className="tp-stat-n">1</span>
              <span className="tp-stat-l">Completed</span>
            </div>
            <div className="tp-stat-sep" />
            <div className="tp-stat">
              <span className="tp-stat-n">3</span>
              <span className="tp-stat-l">Upcoming</span>
            </div>
            <div className="tp-stat-sep" />
            <div className="tp-stat">
              <span className="tp-stat-n">₹1L+</span>
              <span className="tp-stat-l">Prize Distributed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container tp-body">
        {/* Game category filter */}
        <div className="tp-cats">
          {GAMES.map((g) => (
            <button
              key={g.id}
              className={`tp-cat-btn ${activeGame === g.id ? 'active' : ''}`}
              style={{ '--cat-color': g.color }}
              onClick={() => setActiveGame(g.id)}
            >
              {g.logo
                ? <img src={g.logo} alt={g.label} className="tp-cat-logo" />
                : <svg className="tp-cat-all-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
              }
              <span>{g.label}</span>
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="tp-status-filters">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.id}
              className={`tp-status-btn ${activeStatus === s.id ? 'active' : ''}`}
              onClick={() => setActiveStatus(s.id)}
            >
              {s.dot && <span className="tp-status-dot" style={{ background: s.dot, boxShadow: s.id === 'live' ? `0 0 6px ${s.dot}` : 'none' }} />}
              {s.id === 'live' && activeStatus === 'live' && <span className="tp-live-pulse" />}
              {s.label}
            </button>
          ))}
        </div>

        {/* Live */}
        {live.length > 0 && (
          <section className="tp-section">
            <div className="tp-section-head">
              <span className="tp-section-pill live">🔴 Live Now</span>
              <h2 className="tp-section-title">Live Tournaments</h2>
            </div>
            <div className="tp-grid">
              {live.map((t) => (
                <CompletedCard key={t.id} t={t} game={gameMap[t.gameId]}
                  onClick={() => navigate(`/tournaments/${t.id}`)} />
              ))}
            </div>
          </section>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <section className="tp-section">
            <div className="tp-section-head">
              <span className="tp-section-pill done">✅ Completed</span>
              <h2 className="tp-section-title">Past Tournaments</h2>
            </div>
            <div className="tp-grid">
              {completed.map((t) => (
                <CompletedCard key={t.id} t={t} game={gameMap[t.gameId]}
                  onClick={() => navigate(`/tournaments/${t.id}`)} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="tp-section">
            <div className="tp-section-head">
              <span className="tp-section-pill coming">🔥 Coming Soon</span>
              <h2 className="tp-section-title">Upcoming Tournaments</h2>
            </div>
            <div className="tp-grid">
              {upcoming.map((t) => (
                <UpcomingCard key={t.id} t={t} game={gameMap[t.gameId]} />
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <p className="tp-empty">No tournaments match this filter. Check back soon!</p>
        )}
      </div>
    </div>
  );
}

/* ── Completed Card — clean summary only ─────── */
function CompletedCard({ t, game, onClick }) {
  return (
    <div
      className="tp-card completed"
      style={{ '--c': t.color, '--cr': t.colorRgb }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="tp-card-blob" />

      {/* Header row */}
      <div className="tp-card-top">
        <div className="tp-card-game-badge">
          {game.logo && <img src={game.logo} alt={game.label} className="tp-game-logo-sm" />}
          <span style={{ color: t.color }}>{game.label}</span>
        </div>
        <span className="tp-chip done">COMPLETED</span>
      </div>

      {/* Title */}
      <h3 className="tp-card-title">{t.title}</h3>
      <p className="tp-card-sub">{t.subtitle} · {t.year}</p>

      {/* Facts grid */}
      <div className="tp-facts">
        <div className="tp-fact"><TrophyIcon color={t.color} /><span>{t.prizePool}</span></div>
        <div className="tp-fact"><TeamsIcon  color={t.color} /><span>{t.teams} Teams</span></div>
        <div className="tp-fact"><GamepadIcon color={t.color} /><span>{t.format}</span></div>
        <div className="tp-fact"><GlobeIcon  color={t.color} /><span>{t.region}</span></div>
      </div>

      {/* Winner */}
      <div className="tp-winner-banner">
        <span className="tp-winner-crown">👑</span>
        <div className="tp-winner-info">
          <span className="tp-winner-label">Tournament Winner</span>
          <span className="tp-winner-name">{t.winner}</span>
        </div>
        {t.winnerLogo
          ? <img src={t.winnerLogo} alt={t.winner} className="tp-winner-logo" />
          : <div className="tp-winner-logo-placeholder"><span>LOGO</span></div>
        }
      </div>

      {/* View details CTA */}
      <div className="tp-card-cta">
        View Full Details
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>
    </div>
  );
}

/* ── Upcoming Card — greyed & locked ─────────── */
function UpcomingCard({ t, game }) {
  return (
    <div className="tp-card upcoming" style={{ '--c': t.color, '--cr': t.colorRgb }}>
      <div className="tp-card-blob-grey" />
      <div className="tp-card-top">
        <div className="tp-card-game-badge greyed">
          {game.logo && <img src={game.logo} alt={game.label} className="tp-game-logo-sm greyed-img" />}
          <span>{game.label}</span>
        </div>
        <span className="tp-chip upcoming-chip">COMING SOON</span>
      </div>
      <h3 className="tp-card-title greyed">{t.title}</h3>
      <p className="tp-card-sub greyed">{t.subtitle}</p>
      <div className="tp-locked-overlay">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <p>Details coming soon</p>
      </div>
    </div>
  );
}

/* ── Icons ────────────────────────────────────── */
function TrophyIcon({ color }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" width="15" height="15" style={{flexShrink:0}}>
    <path d="M6 9H4a2 2 0 0 1-2-2V5h4M18 9h2a2 2 0 0 0 2-2V5h-4"/>
    <path d="M6 9c0 3.31 2.69 6 6 6s6-2.69 6-6V3H6v6z"/>
    <path d="M12 15v3M8 21h8"/>
  </svg>;
}
function TeamsIcon({ color }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" width="15" height="15" style={{flexShrink:0}}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>;
}
function GamepadIcon({ color }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" width="15" height="15" style={{flexShrink:0}}>
    <line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/>
    <circle cx="15.5" cy="11.5" r=".5" fill={color || 'currentColor'}/>
    <circle cx="17.5" cy="13.5" r=".5" fill={color || 'currentColor'}/>
    <path d="M21.75 12.32c.23 1.67.02 3.25-.77 4.65a6 6 0 0 1-1.98 2.03C17.63 20.12 16 21 14.27 21c-.78 0-1.53-.19-2.27-.51-.74.32-1.49.51-2.27.51-1.73 0-3.36-.88-4.73-2-.77-.8-1.32-1.81-1.63-2.92-.31-1.12-.36-2.28-.12-3.4.24-1.12.76-2.17 1.52-3.03C5.55 8.68 6.73 8 8 8h8c1.27 0 2.45.68 3.23 1.65.54.65.93 1.4 1.13 2.2.13.49.2.99.19 1.47z"/>
  </svg>;
}
function GlobeIcon({ color }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" width="15" height="15" style={{flexShrink:0}}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
  </svg>;
}
