import { useEffect, useState } from 'react';
import './SupportPage.css';

const DISCORD_URL = 'https://discord.com/channels/1531067880676921546/1531073347939729460/1531106709907706057';
const SUPPORT_EMAIL = 'support@rgcofficial.live';

const TICKET_TYPES = {
  general: {
    title: 'General Support',
    accent: '#3b82f6',
    accentRgb: '59,130,246',
    subjects: ['Account Issue', 'Tournament Registration', 'Technical Problem', 'Website Enquiry', 'Other'],
  },
  partnership: {
    title: 'Partnerships & Apprenticeship',
    accent: '#eab308',
    accentRgb: '234,179,8',
    subjects: ['Apprenticeship', 'Team Collaboration', 'Content Partnership', 'Business Collaboration', 'Other'],
  },
  sponsorship: {
    title: 'Sponsorships',
    accent: '#a855f7',
    accentRgb: '168,85,247',
    subjects: ['Brand Sponsorship', 'Event Sponsorship', 'Commercial Enquiry', 'Other'],
  },
};

const FAQ = [
  {
    q: 'How do I report a tournament issue?',
    a: 'Choose General Support, include the tournament name, your team name, the round involved, and attach screenshots or video evidence if available.',
  },
  {
    q: 'Can I submit a ticket without being logged in?',
    a: 'Yes. Provide an email address and a Discord username so our team can reach you even without an account.',
  },
  {
    q: 'What if I want to partner with the organization?',
    a: 'Select Partnerships & Apprenticeship, explain the proposed collaboration, include a timeline, and share previous work or experience if applicable.',
  },
  {
    q: 'Where should sponsorship questions go?',
    a: 'Use the Sponsorships section and share brand information, budget range, desired sponsorship scope, and marketing expectations.',
  },
];

export default function SupportPage() {
  const [ticketType, setTicketType] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="spg-page">
      <div className="spg-orb spg-orb1" />
      <div className="spg-orb spg-orb2" />

      {/* Hero */}
      <section className="spg-hero">
        <div className="container">
          <div className="spg-hero-card">
            <div className="spg-hero-glow" />
            <div className="spg-hero-icon">
              <HeadsetIcon />
            </div>
            <div className="spg-hero-copy">
              <h1>Support &amp; Partnerships</h1>
              <p>
                Need help with a tournament? Want to become a sponsor? Looking for apprenticeship
                opportunities? Open a ticket or contact us directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container spg-body">
        {/* Direct Contact */}
        <section className="spg-section">
          <h2 className="spg-section-title">Direct Contact</h2>
          <div className="spg-contact-grid">
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="spg-contact-card">
              <div className="spg-contact-icon discord">
                <img src="/images/discord.png" alt="" />
              </div>
              <div>
                <h3>Discord Community</h3>
                <p>Join our server for fast community support.</p>
              </div>
            </a>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="spg-contact-card">
              <div className="spg-contact-icon email">
                <MailIcon />
              </div>
              <div>
                <h3>Email Support</h3>
                <p>{SUPPORT_EMAIL}</p>
              </div>
            </a>
          </div>
        </section>

        {/* Open a Ticket */}
        <section className="spg-section" id="open-ticket">
          <h2 className="spg-section-title">Open a Ticket</h2>
          <div className="spg-ticket-grid">
            <TicketCard
              accent="#3b82f6"
              accentRgb="59,130,246"
              icon={<SupportIcon />}
              title="General Support"
              desc="Account issues, tournament registration problems, website enquiries, and technical help."
              cta="Create Ticket"
              onClick={() => setTicketType('general')}
            />
            <TicketCard
              accent="#eab308"
              accentRgb="234,179,8"
              icon={<HandshakeIcon />}
              title="Partnerships & Apprenticeship"
              desc="Join the organization, apply as an apprentice, or explore business collaborations with TVA."
              cta="Apply Now"
              onClick={() => setTicketType('partnership')}
            />
            <TicketCard
              accent="#a855f7"
              accentRgb="168,85,247"
              icon={<GemIcon />}
              title="Sponsorships"
              desc="For brands and organizations interested in supporting TVA tournaments and esports events."
              cta="Contact Us"
              onClick={() => setTicketType('sponsorship')}
            />
          </div>
        </section>

        {/* Support Process */}
        <section className="spg-section">
          <div className="spg-process-head">
            <div>
              <p className="spg-eyebrow">How we handle requests</p>
              <h2 className="spg-section-title">Support Process</h2>
            </div>
            <p className="spg-process-intro">
              More details help us route your request faster and cut down on follow-up questions.
            </p>
          </div>
          <div className="spg-steps">
            <StepCard
              n="1"
              title="Pick the Right Category"
              text="Choose General Support, Partnerships, or Sponsorships so your request reaches the right team quickly."
            />
            <StepCard
              n="2"
              title="Add Clear Details"
              text="Include team name, match time, screenshots, payment references, error messages, and any extra context."
            />
            <StepCard
              n="3"
              title="Track the Response"
              text="Tickets are reviewed in order. Replies go to the contact you provide — keep the conversation in that same channel."
            />
          </div>
        </section>

        {/* What to Include + Response Times */}
        <section className="spg-section spg-info-row">
          <div className="spg-include-panel">
            <h3>What to Include</h3>
            <div className="spg-include-grid">
              <IncludeItem icon={<UserIcon />} title="Account Details" text="Username, team name, and alternate contact info." />
              <IncludeItem icon={<ImageIcon />} title="Screenshots" text="Registration errors, rule disputes, payments, or bugs." />
              <IncludeItem icon={<ClockIcon />} title="Time & Match Info" text="Tournament name, lobby, round, and deadlines." />
              <IncludeItem icon={<AlertIcon />} title="Exact Error" text="Copy the error and describe what you were doing." />
            </div>
          </div>

          <div className="spg-response-panel">
            <h3>Expected Response Times</h3>
            <ul className="spg-response-list">
              <li><span>General Support</span><strong>12–24h</strong></li>
              <li><span>Partnerships</span><strong>12–24h</strong></li>
              <li><span>Sponsorships</span><strong>12–24h</strong></li>
            </ul>
            <div className="spg-urgent">
              <p className="spg-urgent-label">Urgent Issues</p>
              <p>
                If a live event is affected, open a ticket immediately and notify the Discord community
                so the team can respond faster during active tournaments.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="spg-section">
          <p className="spg-eyebrow">Common Questions</p>
          <h2 className="spg-section-title">FAQ</h2>
          <div className="spg-faq-grid">
            {FAQ.map((item) => (
              <article key={item.q} className="spg-faq-card">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      {ticketType && (
        <TicketModal
          type={ticketType}
          meta={TICKET_TYPES[ticketType]}
          onClose={() => setTicketType(null)}
        />
      )}
    </div>
  );
}

function TicketCard({ accent, accentRgb, icon, title, desc, cta, onClick }) {
  return (
    <div className="spg-ticket-card" style={{ '--c': accent, '--cr': accentRgb }}>
      <div className="spg-ticket-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <button type="button" className="spg-ticket-btn" onClick={onClick}>{cta}</button>
    </div>
  );
}

function StepCard({ n, title, text }) {
  return (
    <div className="spg-step-card">
      <span className="spg-step-num">{n}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function IncludeItem({ icon, title, text }) {
  return (
    <div className="spg-include-item">
      <span className="spg-include-icon">{icon}</span>
      <div>
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
    </div>
  );
}

function TicketModal({ type, meta, onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    discord: '',
    subject: meta.subjects[0],
    message: '',
  });
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
    if (!form.name.trim()) { setError('Enter your name.'); return; }
    if (!form.email.trim() && !form.discord.trim()) {
      setError('Provide an email or Discord username so we can reply.');
      return;
    }
    if (!form.message.trim()) { setError('Describe your request in detail.'); return; }

    try {
      const key = `tva-support-tickets-${type}`;
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      prev.push({ ...form, type, submittedAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(prev));
    } catch { /* ignore */ }

    setDone(true);
  }

  return (
    <div className="spg-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="spg-modal"
        style={{ '--c': meta.accent, '--cr': meta.accentRgb }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="spg-modal-head">
          <div>
            <p className="spg-modal-eyebrow">{meta.title}</p>
            <h2>{done ? 'Ticket Submitted' : 'Open a Ticket'}</h2>
          </div>
          <button type="button" className="spg-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {done ? (
          <div className="spg-modal-success">
            <p>Thanks {form.name}. We&apos;ll review your {meta.title.toLowerCase()} request and reply within 12–24 hours.</p>
            <button type="button" className="spg-ticket-btn" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form className="spg-modal-form" onSubmit={handleSubmit}>
            <label>
              <span>Name *</span>
              <input value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Your name" />
            </label>
            <div className="spg-modal-row">
              <label>
                <span>Email</span>
                <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="you@email.com" />
              </label>
              <label>
                <span>Discord</span>
                <input value={form.discord} onChange={(e) => setField('discord', e.target.value)} placeholder="username" />
              </label>
            </div>
            <label>
              <span>Subject *</span>
              <select value={form.subject} onChange={(e) => setField('subject', e.target.value)}>
                {meta.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label>
              <span>Details *</span>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setField('message', e.target.value)}
                placeholder="Include account details, screenshots description, match info, and exact errors…"
              />
            </label>
            {error && <p className="spg-modal-error">{error}</p>}
            <div className="spg-modal-actions">
              <button type="button" className="spg-modal-cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="spg-ticket-btn">Submit Ticket</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────── */
function HeadsetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
      <path d="M4 14v-3a8 8 0 0 1 16 0v3"/><path d="M18 19a3 3 0 0 0 3-3v-2a2 2 0 0 0-2-2h-1v7h0a3 3 0 0 0 0 0z"/><path d="M6 19a3 3 0 0 1-3-3v-2a2 2 0 0 1 2-2h1v7h0a3 3 0 0 1 0 0z"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
      <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>
    </svg>
  );
}
function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>
    </svg>
  );
}
function HandshakeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
      <path d="M8 13l3 3 7-7"/><path d="M3 12l4-4 3 1 3-3 4 2"/><path d="M14 17l2 2 5-5"/>
    </svg>
  );
}
function GemIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
      <path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 21 8 9l4-6 4 6z"/>
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
      <circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/>
    </svg>
  );
}
function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
      <rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10.5" r="1.5"/><path d="m21 15-5-5-8 8"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
      <path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>
    </svg>
  );
}
