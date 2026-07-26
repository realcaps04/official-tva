import { useEffect, useState } from 'react';
import './TeamRegisterModal.css';

const EMPTY = {
  teamName: '',
  captainName: '',
  discord: '',
  phone: '',
  member1: '',
  member2: '',
  member3: '',
  member4: '',
};

export default function TeamRegisterModal({ tournament: t, game, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.teamName.trim()) { setError('Enter your crew / team name.'); return; }
    if (!form.captainName.trim()) { setError('Enter the captain name.'); return; }
    if (!form.discord.trim()) { setError('Enter a Discord username.'); return; }
    if (!form.phone.trim()) { setError('Enter a WhatsApp / phone number.'); return; }
    if (!form.member1.trim()) { setError('Add at least one driver / member.'); return; }

    const entry = {
      ...form,
      tournamentId: t.id,
      tournamentTitle: t.title,
      submittedAt: new Date().toISOString(),
    };

    try {
      const key = `tva-registrations-${t.id}`;
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      prev.push(entry);
      localStorage.setItem(key, JSON.stringify(prev));
    } catch {
      /* ignore storage errors */
    }

    setDone(true);
  }

  return (
    <div className="trm-overlay" onClick={onClose} role="presentation">
      <div
        className="trm-modal"
        style={{ '--c': t.color, '--cr': t.colorRgb }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trm-title"
      >
        <div className="trm-header">
          <div>
            <p className="trm-eyebrow">Team Registration</p>
            <h2 id="trm-title" className="trm-title">Register a New Team</h2>
          </div>
          <button type="button" className="trm-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tournament summary */}
        <div className="trm-summary">
          <div className="trm-summary-top">
            <div className="trm-game-pill">
              {game?.logo && <img src={game.logo} alt={game.label} />}
              <span>{game?.label}</span>
            </div>
            <span className="trm-status">{t.status === 'upcoming' ? 'UPCOMING' : t.status.toUpperCase()}</span>
          </div>
          <h3 className="trm-tour-title">{t.title}</h3>
          <p className="trm-tour-sub">{t.subtitle} · {t.year}</p>
        </div>

        {done ? (
          <div className="trm-success">
            <div className="trm-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="28" height="28">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3>Registration Submitted</h3>
            <p>Your crew <strong>{form.teamName}</strong> is registered for {t.title}. TVA & Xlantis will contact you on Discord.</p>
            <button type="button" className="trm-submit" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form className="trm-form" onSubmit={handleSubmit}>
            <div className="trm-grid">
              <Field label="Crew / Team Name *" value={form.teamName} onChange={(v) => setField('teamName', v)} placeholder="e.g. Street Kings" />
              <Field label="Captain Name *" value={form.captainName} onChange={(v) => setField('captainName', v)} placeholder="In-game / RP name" />
              <Field label="Discord Username *" value={form.discord} onChange={(v) => setField('discord', v)} placeholder="username" />
              <Field label="WhatsApp / Phone *" value={form.phone} onChange={(v) => setField('phone', v)} placeholder="+91 ..." />
            </div>

            <p className="trm-section-label">Crew Members / Drivers</p>
            <div className="trm-grid">
              <Field label="Member 1 *" value={form.member1} onChange={(v) => setField('member1', v)} placeholder="Driver 1" />
              <Field label="Member 2" value={form.member2} onChange={(v) => setField('member2', v)} placeholder="Driver 2" />
              <Field label="Member 3" value={form.member3} onChange={(v) => setField('member3', v)} placeholder="Driver 3" />
              <Field label="Member 4" value={form.member4} onChange={(v) => setField('member4', v)} placeholder="Driver 4" />
            </div>

            {error && <p className="trm-error">{error}</p>}

            <div className="trm-actions">
              <button type="button" className="trm-cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="trm-submit">Register Team</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="trm-field">
      <span>{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
