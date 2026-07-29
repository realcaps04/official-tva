import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import './TeamRegisterModal.css';

const EMPTY_MEMBER = { name: '', discord: '', phone: '' };

const EMPTY = {
  teamName: '',
  captainName: '',
  members: [
    { ...EMPTY_MEMBER },
    { ...EMPTY_MEMBER },
    { ...EMPTY_MEMBER },
    { ...EMPTY_MEMBER },
  ],
};

/** Indian mobile: 10 digits starting 6–9; allows +91 / 91 / 0 prefix */
function isValidIndianPhone(phone) {
  const digits = String(phone).replace(/\D/g, '');
  let n = digits;
  if (n.length === 12 && n.startsWith('91')) n = n.slice(2);
  if (n.length === 11 && n.startsWith('0')) n = n.slice(1);
  return /^[6-9]\d{9}$/.test(n);
}

function normalizeIndianPhone(phone) {
  const digits = String(phone).replace(/\D/g, '');
  let n = digits;
  if (n.length === 12 && n.startsWith('91')) n = n.slice(2);
  if (n.length === 11 && n.startsWith('0')) n = n.slice(1);
  return n;
}

export default function TeamRegisterModal({ tournament: t, game, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  function setTeamField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  }

  function setMemberField(index, key, value) {
    setForm((f) => {
      const members = f.members.map((m, i) => (i === index ? { ...m, [key]: value } : m));
      return { ...f, members };
    });
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.teamName.trim()) { setError('Enter your crew / team name.'); return; }
    if (!form.captainName.trim()) { setError('Enter the captain name.'); return; }

    const filled = form.members
      .map((m, i) => ({ ...m, index: i + 1 }))
      .filter((m) => m.name.trim() || m.discord.trim() || m.phone.trim());

    if (filled.length === 0 || !form.members[0].name.trim()) {
      setError('Add at least Member 1 with name, Discord, and phone.');
      return;
    }

    for (const m of filled) {
      if (!m.name.trim()) {
        setError(`Member ${m.index}: enter the member name.`);
        return;
      }
      if (!m.discord.trim()) {
        setError(`Member ${m.index}: enter their Discord username.`);
        return;
      }
      if (!m.phone.trim()) {
        setError(`Member ${m.index}: enter their Indian phone number.`);
        return;
      }
      if (!isValidIndianPhone(m.phone)) {
        setError(`Member ${m.index}: enter a valid Indian mobile (10 digits, starts with 6–9).`);
        return;
      }
    }

    const entry = {
      teamName: form.teamName.trim(),
      captainName: form.captainName.trim(),
      members: filled.map((m) => ({
        name: m.name.trim(),
        discord: m.discord.trim(),
        phone: normalizeIndianPhone(m.phone),
      })),
      tournamentId: t.id,
      tournamentTitle: t.title,
      submittedAt: new Date().toISOString(),
    };

    try {
      await api.createRegistration(entry);
    } catch {
      try {
        const key = `tva-registrations-${t.id}`;
        const prev = JSON.parse(localStorage.getItem(key) || '[]');
        prev.push(entry);
        localStorage.setItem(key, JSON.stringify(prev));
      } catch {
        /* ignore storage errors */
      }
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

        <div className="trm-body">
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
              <p>
                Your crew <strong>{form.teamName}</strong> is registered for {t.title}.{' '}
                {(() => {
                  const discord = t.platforms?.find((p) => typeof p === 'object' && p.url?.includes('discord'));
                  return discord ? (
                    <>Join the <a href={discord.url} target="_blank" rel="noopener noreferrer">tournament Discord</a> for updates.</>
                  ) : (
                    <>TVA & Xlantis will contact you on Discord.</>
                  );
                })()}
              </p>
              <button type="button" className="trm-submit" onClick={onClose}>Done</button>
            </div>
          ) : (
            <form className="trm-form" onSubmit={handleSubmit}>
              <div className="trm-grid">
                <Field label="Crew / Team Name *" value={form.teamName} onChange={(v) => setTeamField('teamName', v)} placeholder="e.g. Street Kings" />
                <Field label="Captain Name *" value={form.captainName} onChange={(v) => setTeamField('captainName', v)} placeholder="In-game / RP name" />
              </div>

              <p className="trm-section-label">Crew Members / Drivers</p>
              <p className="trm-hint">Each member needs name, Discord, and a valid Indian mobile (+91 optional).</p>

              {form.members.map((m, i) => (
                <div key={i} className="trm-member">
                  <div className="trm-member-head">Member {i + 1}{i === 0 ? ' *' : ''}</div>
                  <div className="trm-member-grid">
                    <Field
                      label="Name"
                      value={m.name}
                      onChange={(v) => setMemberField(i, 'name', v)}
                      placeholder={`Driver ${i + 1}`}
                    />
                    <Field
                      label="Discord"
                      value={m.discord}
                      onChange={(v) => setMemberField(i, 'discord', v)}
                      placeholder="discord_username"
                    />
                    <Field
                      label="Phone (India)"
                      value={m.phone}
                      onChange={(v) => setMemberField(i, 'phone', v)}
                      placeholder="9876543210"
                      type="tel"
                      inputMode="tel"
                      maxLength={14}
                    />
                  </div>
                </div>
              ))}

              <div className="trm-actions">
                <button type="button" className="trm-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="trm-submit">Register Team</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {error && (
        <div
          className="trm-alert-overlay"
          onClick={(e) => { e.stopPropagation(); setError(''); }}
          role="presentation"
        >
          <div className="trm-alert" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-labelledby="trm-alert-msg">
            <div className="trm-alert-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="26" height="26">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p id="trm-alert-msg" className="trm-alert-msg">{error}</p>
            <button type="button" className="trm-alert-btn" onClick={() => setError('')}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', inputMode, maxLength }) {
  return (
    <label className="trm-field">
      <span>{label}</span>
      <input
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
