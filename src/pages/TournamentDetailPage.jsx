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
      {/* Background orbs */}
      <div className="tdp-orb tdp-orb1" />
      <div className="tdp-orb tdp-orb2" />

      <div className="container tdp-container">
        {/* Back button */}
        <button className="tdp-back" onClick={() => navigate('/tournaments')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="16" height="16">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to Tournaments
        </button>

        {/* ── Hero card ─────────────────────── */}
        <div className="tdp-hero-card">
          <div className="tdp-hero-glow" />

          <div className="tdp-hero-top">
            <div className="tdp-game-pill">
              {game.logo && <img src={game.logo} alt={game.label} className="tdp-game-logo" />}
              <span style={{ color: t.color }}>{game.label}</span>
            </div>
            <span className="tdp-status-chip">✅ COMPLETED</span>
          </div>

          <h1 className="tdp-title">{t.title}</h1>
          <p className="tdp-subtitle">{t.subtitle} · {t.year}</p>

          {/* Quick stats row */}
          <div className="tdp-quick-stats">
            <QuickStat icon="🏆" label="Prize Pool" value={t.prizePool} color={t.color} />
            <QuickStat icon="👥" label="Teams"      value={`${t.teams} Squads`} color={t.color} />
            <QuickStat icon="🎮" label="Format"     value={t.format} color={t.color} />
            <QuickStat icon="🌏" label="Region"     value={t.region} color={t.color} />
          </div>
        </div>

        {/* ── Content grid ──────────────────── */}
        <div className="tdp-grid">

          {/* LEFT column */}
          <div className="tdp-col">

            {/* Qualifier Schedule */}
            <Section title="🗓 Qualifier Schedule" color={t.color}>
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
                <InfoRow label="Format"         value={t.qualifiers.format} />
                <InfoRow label="Matches per day" value={`${t.qualifiers.matchesPerDay} matches`} />
              </div>
            </Section>

            {/* Finals Schedule */}
            <Section title="⚡ Finals" color={t.color}>
              <div className="tdp-schedule-list">
                <div className="tdp-sched-row finals">
                  <div className="tdp-sched-num finals-num">F</div>
                  <span>{t.finals.date}</span>
                  <span className="tdp-sched-time">{t.finals.time}</span>
                </div>
              </div>
              <div className="tdp-info-rows">
                <InfoRow label="Finalists"  value={`${t.finals.teams} teams`} />
                <InfoRow label="Total matches" value={`${t.finals.matches} matches`} />
              </div>
              <div className="tdp-label">Map Pool</div>
              <div className="tdp-maps">
                {t.finals.maps.map((m) => (
                  <span key={m} className="tdp-map-chip">{m}</span>
                ))}
              </div>
            </Section>

            {/* Platforms */}
            <Section title="📡 Required Platforms" color={t.color}>
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

            {/* Anti-cheat */}
            <Section title="🛡 Anti-Cheat" color={t.color}>
              <div className="tdp-anticheat">
                <div className="tdp-ac-icon" style={{ borderColor: t.color, color: t.color }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
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

          {/* RIGHT column */}
          <div className="tdp-col">

            {/* Winner */}
            <Section title="👑 Tournament Winner" color={t.color}>
              <div className="tdp-winner-card">
                <div className="tdp-winner-glow" style={{ background: `rgba(${t.colorRgb}, 0.2)` }} />
                {t.winnerLogo
                  ? <img src={t.winnerLogo} alt={t.winner} className="tdp-winner-logo" />
                  : <div className="tdp-winner-logo-ph">LOGO</div>
                }
                <div className="tdp-winner-label">Champion</div>
                <div className="tdp-winner-name" style={{ color: t.color }}>{t.winner}</div>
              </div>
            </Section>

            {/* Prize Pool */}
            <Section title="💰 Prize Distribution" color={t.color}>
              <div className="tdp-total-prize" style={{ borderColor: `rgba(${t.colorRgb}, 0.35)`, background: `rgba(${t.colorRgb}, 0.07)` }}>
                <span className="tdp-total-label">Total Prize Pool</span>
                <span className="tdp-total-amount" style={{ color: t.color }}>{t.prizePool}</span>
              </div>
              <div className="tdp-prize-table">
                {t.prizes.map((p, i) => (
                  <div key={i} className={`tdp-prize-row ${i === 0 ? 'first' : ''}`}>
                    <span className="tdp-prize-icon">{p.icon}</span>
                    <span className="tdp-prize-place">{p.place}</span>
                    <span className="tdp-prize-amount" style={{ color: i === 0 ? t.color : 'var(--text-secondary)' }}>{p.amount}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Tournament Structure */}
            <Section title="📊 Tournament Structure" color={t.color}>
              <div className="tdp-bracket">
                <div className="tdp-bracket-stage">
                  <div className="tdp-bracket-header" style={{ borderColor: t.color, color: t.color }}>Qualifiers</div>
                  <div className="tdp-bracket-detail">32 teams → 4 groups (A, B, C, D)</div>
                  <div className="tdp-bracket-detail">8 teams per group · 5 matches/day</div>
                  <div className="tdp-bracket-detail">Top 8 per day advance</div>
                </div>
                <div className="tdp-bracket-arrow">↓</div>
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

/* ── Sub-components ───────────────── */
function Section({ title, color, children }) {
  return (
    <div className="tdp-section" style={{ '--c': color }}>
      <div className="tdp-section-title">{title}</div>
      <div className="tdp-section-body">{children}</div>
    </div>
  );
}

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
