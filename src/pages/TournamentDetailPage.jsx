import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TOURNAMENTS, GAMES } from './TournamentsPage';
import './TournamentDetailPage.css';

const gameMap = Object.fromEntries(GAMES.map((g) => [g.id, g]));

export default function TournamentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = TOURNAMENTS.find((x) => x.id === id);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!t) {
    return (
      <div className="tdp-not-found">
        <h2>Tournament not found.</h2>
        <button onClick={() => navigate('/tournaments')}>← Back to Tournaments</button>
      </div>
    );
  }

  const game = gameMap[t.gameId];

  return (
    <div className="tdp-page" style={{ '--c': t.color, '--cr': t.colorRgb }}>
      <div className="tdp-orb tdp-orb1" />
      <div className="tdp-orb tdp-orb2" />

      <div className="container tdp-container">

        {/* Back button */}
        <button className="tdp-back" onClick={() => navigate('/tournaments')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="15" height="15">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to Tournaments
        </button>

        {/* ── Hero card ───────────────────────────── */}
        <div className="tdp-hero-card">
          <div className="tdp-hero-glow" />

          <div className="tdp-hero-top">
            <div className="tdp-game-pill">
              {game.logo && <img src={game.logo} alt={game.label} className="tdp-game-logo" />}
              <span style={{ color: t.color }}>{game.label}</span>
            </div>
            {/* Completed chip — SVG check instead of emoji */}
            <span className="tdp-status-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              COMPLETED
            </span>
          </div>

          <h1 className="tdp-title">{t.title}</h1>
          <p className="tdp-subtitle">{t.subtitle} · {t.year}</p>

          {/* Quick stats */}
          <div className="tdp-quick-stats">
            <QuickStat icon={<TrophyIcon />}  label="Prize Pool" value={t.prizePool}           color={t.color} />
            <QuickStat icon={<TeamsIcon />}   label="Teams"      value={`${t.teams} Squads`}   color={t.color} />
            <QuickStat icon={<GamepadIcon />} label="Format"     value={t.format}              color={t.color} />
            <QuickStat icon={<GlobeIcon />}   label="Region"     value={t.region}              color={t.color} />
          </div>
        </div>

        {/* ── Content grid ────────────────────────── */}
        <div className="tdp-grid">

          {/* LEFT */}
          <div className="tdp-col">

            <Section icon={<CalendarIcon />} title="Qualifier Schedule" color={t.color}>
              <div className="tdp-schedule-list">
                {t.qualifiers.dates.map((d, i) => (
                  <div key={i} className="tdp-sched-row">
                    <div className="tdp-sched-num">{i + 1}</div>
                    <span>{d}</span>
                    <span className="tdp-sched-time">{t.qualifiers.time}</span>
                  </div>
                ))}
              </div>
              <div className="tdp-info-rows">
                <InfoRow label="Format"          value={t.qualifiers.format} />
                <InfoRow label="Matches per day" value={`${t.qualifiers.matchesPerDay} matches`} />
              </div>
            </Section>

            <Section icon={<BoltIcon />} title="Finals" color={t.color}>
              <div className="tdp-schedule-list">
                <div className="tdp-sched-row finals">
                  <div className="tdp-sched-num finals-num">F</div>
                  <span>{t.finals.date}</span>
                  <span className="tdp-sched-time">{t.finals.time}</span>
                </div>
              </div>
              <div className="tdp-info-rows">
                <InfoRow label="Finalists"     value={`${t.finals.teams} teams`} />
                <InfoRow label="Total matches" value={`${t.finals.matches} matches`} />
              </div>
              <div className="tdp-label">Map Pool</div>
              <div className="tdp-maps">
                {t.finals.maps.map((m) => (
                  <span key={m} className="tdp-map-chip">{m}</span>
                ))}
              </div>
            </Section>

            <Section icon={<PlatformIcon />} title="Required Platforms" color={t.color}>
              <p className="tdp-section-note">All teams must be available and active on these platforms during the tournament.</p>
              <div className="tdp-platform-list">
                {t.platforms.map((p, i) => (
                  <div key={i} className="tdp-platform-item">
                    <span className="tdp-platform-dot" style={{ background: t.color }} />
                    {p}
                  </div>
                ))}
              </div>
            </Section>

            <Section icon={<ShieldIcon />} title="Anti-Cheat" color={t.color}>
              <div className="tdp-anticheat">
                <div className="tdp-ac-icon" style={{ borderColor: t.color, color: t.color }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <div>
                  <p className="tdp-ac-name">{t.antiCheat}</p>
                  <p className="tdp-ac-note">Anyone already banned by this system cannot participate.</p>
                </div>
              </div>
            </Section>
          </div>

          {/* RIGHT */}
          <div className="tdp-col">

            <Section icon={<CrownIcon />} title="Tournament Winner" color={t.color}>
              <div className="tdp-winner-card">
                <div className="tdp-winner-glow" style={{ background: `rgba(${t.colorRgb}, 0.25)` }} />
                <div className="tdp-winner-logo-wrap">
                  {t.winnerLogo
                    ? <img src={t.winnerLogo} alt={t.winner} className="tdp-winner-logo" />
                    : <div className="tdp-winner-logo-ph">LOGO</div>
                  }
                </div>
                <div className="tdp-winner-label">Champion</div>
                <div className="tdp-winner-name" style={{ color: t.color }}>{t.winner}</div>
              </div>
            </Section>

            <Section icon={<PrizeIcon />} title="Prize Distribution" color={t.color}>
              <div className="tdp-total-prize" style={{ borderColor: `rgba(${t.colorRgb}, 0.35)`, background: `rgba(${t.colorRgb}, 0.07)` }}>
                <span className="tdp-total-label">Total Prize Pool</span>
                <span className="tdp-total-amount" style={{ color: t.color }}>{t.prizePool}</span>
              </div>
              <div className="tdp-prize-table">
                {t.prizes.map((p, i) => (
                  <div key={i} className={`tdp-prize-row ${i === 0 ? 'first' : ''}`}>
                    <span className="tdp-prize-icon-wrap">
                      <PrizePlaceIcon rank={i} color={t.color} />
                    </span>
                    <span className="tdp-prize-place">{p.place}</span>
                    <span className="tdp-prize-amount" style={{ color: i === 0 ? t.color : 'var(--text-secondary)' }}>{p.amount}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section icon={<BracketIcon />} title="Tournament Structure" color={t.color}>
              <div className="tdp-bracket">
                <div className="tdp-bracket-stage">
                  <div className="tdp-bracket-header" style={{ borderColor: t.color, color: t.color }}>Qualifiers</div>
                  <div className="tdp-bracket-detail">32 teams → 4 groups (A, B, C, D)</div>
                  <div className="tdp-bracket-detail">8 teams per group · 5 matches/day</div>
                  <div className="tdp-bracket-detail">Top 8 per day advance</div>
                </div>
                <div className="tdp-bracket-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
                    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                  </svg>
                </div>
                <div className="tdp-bracket-stage">
                  <div className="tdp-bracket-header" style={{ borderColor: '#c77dff', color: '#c77dff' }}>Finals</div>
                  <div className="tdp-bracket-detail">16 teams · 5 matches total</div>
                  <div className="tdp-bracket-detail">Maps: Erangel, Miramar, Taego, Rondo</div>
                </div>
              </div>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section component ──────────────────────────── */
function Section({ icon, title, color, children }) {
  return (
    <div className="tdp-section" style={{ '--c': color }}>
      <div className="tdp-section-title">
        <span className="tdp-section-icon">{icon}</span>
        {title}
      </div>
      <div className="tdp-section-body">{children}</div>
    </div>
  );
}

/* ── QuickStat — icon is now a component ────────── */
function QuickStat({ icon, label, value, color }) {
  return (
    <div className="tdp-qs" style={{ '--c': color }}>
      <span className="tdp-qs-icon">{icon}</span>
      <span className="tdp-qs-label">{label}</span>
      <span className="tdp-qs-value">{value}</span>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="tdp-info-row">
      <span className="tdp-info-label">{label}</span>
      <span className="tdp-info-value">{value}</span>
    </div>
  );
}

/* ── Prize rank icon ─────────────────────────────── */
function PrizePlaceIcon({ rank, color }) {
  const colors = [color, '#9ba4b5', '#cd7f32', '#6b7280'];
  const c = colors[rank] || '#6b7280';
  if (rank === 3) { // Top Kill — crosshair
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" width="16" height="16">
        <circle cx="12" cy="12" r="3"/>
        <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" width="16" height="16">
      <path d="M6 9H4a2 2 0 0 1-2-2V5h4M18 9h2a2 2 0 0 0 2-2V5h-4"/>
      <path d="M6 9c0 3.31 2.69 6 6 6s6-2.69 6-6V3H6v6z"/>
      <path d="M12 15v3M8 21h8"/>
    </svg>
  );
}

/* ── All SVG icon components ─────────────────────── */
function TrophyIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20">
    <path d="M6 9H4a2 2 0 0 1-2-2V5h4M18 9h2a2 2 0 0 0 2-2V5h-4"/>
    <path d="M6 9c0 3.31 2.69 6 6 6s6-2.69 6-6V3H6v6z"/>
    <path d="M12 15v3M8 21h8"/>
  </svg>;
}
function TeamsIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>;
}
function GamepadIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20">
    <line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/>
    <circle cx="15.5" cy="11.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="13.5" r=".5" fill="currentColor"/>
    <path d="M21.75 12.32c.23 1.67.02 3.25-.77 4.65a6 6 0 0 1-1.98 2.03C17.63 20.12 16 21 14.27 21c-.78 0-1.53-.19-2.27-.51-.74.32-1.49.51-2.27.51-1.73 0-3.36-.88-4.73-2-.77-.8-1.32-1.81-1.63-2.92-.31-1.12-.36-2.28-.12-3.4.24-1.12.76-2.17 1.52-3.03C5.55 8.68 6.73 8 8 8h8c1.27 0 2.45.68 3.23 1.65.54.65.93 1.4 1.13 2.2.13.49.2.99.19 1.47z"/>
  </svg>;
}
function GlobeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
  </svg>;
}
function CalendarIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="15" height="15">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>;
}
function BoltIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>;
}
function PlatformIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="15" height="15">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>;
}
function ShieldIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="15" height="15">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>;
}
function CrownIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    <path d="M2 19h20M3 9l4 5 5-8 5 8 4-5-2 10H5L3 9z"/>
    <circle cx="12" cy="3" r="1" fill="currentColor"/>
    <circle cx="3"  cy="9" r="1" fill="currentColor"/>
    <circle cx="21" cy="9" r="1" fill="currentColor"/>
  </svg>;
}
function PrizeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="15" height="15">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>;
}
function BracketIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="15" height="15">
    <rect x="2" y="3" width="6" height="5" rx="1"/><rect x="16" y="3" width="6" height="5" rx="1"/>
    <rect x="9" y="10" width="6" height="5" rx="1"/>
    <line x1="5" y1="8" x2="5" y2="12"/><line x1="19" y1="8" x2="19" y2="12"/>
    <line x1="5" y1="12" x2="12" y2="12"/><line x1="19" y1="12" x2="12" y2="12"/>
    <rect x="9" y="17" width="6" height="5" rx="1"/><line x1="12" y1="15" x2="12" y2="17"/>
  </svg>;
}
