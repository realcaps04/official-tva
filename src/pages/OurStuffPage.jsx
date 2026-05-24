import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OurStuffPage.css';

/* ── Data ─────────────────────────────────────── */
const DRESS_ITEMS = [];

const VEHICLE_ITEMS = [];


const TABS = [
  { id: 'dress',    label: 'Dress Collections', icon: <DressIcon /> },
  { id: 'vehicles', label: 'Gang Vehicles',      icon: <VehicleIcon /> },
  { id: 'servers',  label: 'FiveM Servers',      icon: <ServerIcon /> },
];

/* ── Server data ─────────────────────────────── */
const SERVER_ITEMS = [
  {
    id: 's1',
    name: 'Xlantis City',
    tagline: 'A premium FiveM GTA RP server — home of the TVA gang. Serious roleplay, custom scripts, and a thriving community.',
    status: 'online',
    logo: '/images/xlantis_logo.png',
    tags: ['FiveM', 'GTA RP', 'Custom Scripts', 'Whitelisted', 'TVA Official'],
    color: '#00aaff',
    colorRgb: '0,170,255',
  },
];

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function OurStuffPage() {
  const [activeTab, setActiveTab] = useState('dress');
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="os-page">
      <div className="os-orb os-orb1" />
      <div className="os-orb os-orb2" />
      <div className="os-orb os-orb3" />

      <div className="container os-container">

        {/* Back */}
        <button className="os-back" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="15" height="15">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>

        {/* Hero */}
        <div className="os-hero">
          <span className="os-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            TVA COLLECTIONS
          </span>
          <h1 className="os-title">Our <span className="gradient-text">Stuff</span></h1>
          <p className="os-sub">The drip and the rides — everything the crew rocks.</p>
        </div>

        {/* Tab switcher */}
        <div className="os-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`os-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="os-tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dress Collections */}
        {activeTab === 'dress' && (
          <div className="os-section">
            <ShowcasingSoon label="Dress Collections" />
          </div>
        )}

        {/* Gang Vehicles */}
        {activeTab === 'vehicles' && (
          <div className="os-section">
            <ShowcasingSoon label="Gang Vehicles" />
          </div>
        )}

        {/* FiveM Servers */}
        {activeTab === 'servers' && (
          <div className="os-section">
            <div className="os-grid server-grid">
              {SERVER_ITEMS.map(item => (
                <ServerCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ── Dress Card ───────────────────────────────── */
function DressCard({ item }) {
  return (
    <div className="os-card dress-card">
      <div className="os-card-glow" />

      {/* Colour swatch preview */}
      <div className="dress-preview">
        <div className="dress-icon-wrap">
          <DressIcon large />
        </div>
        <div className="dress-swatches">
          {item.colors.map((c, i) => (
            <span key={i} className="swatch" style={{ background: c }} title={c} />
          ))}
        </div>
      </div>

      <div className="os-card-info">
        <span className="os-tag">{item.tag}</span>
        <h3 className="os-card-title">{item.name}</h3>
        <p className="os-card-desc">{item.desc}</p>
      </div>
    </div>
  );
}

/* ── Vehicle Card ─────────────────────────────── */
function VehicleCard({ item }) {
  return (
    <div className="os-card vehicle-card" style={{ '--vc': item.color }}>
      <div className="vehicle-glow" style={{ background: `radial-gradient(circle, ${item.color}33 0%, transparent 70%)` }} />

      {/* Type chip */}
      <div className="vehicle-top">
        <span className="vehicle-type" style={{ color: item.color, borderColor: `${item.color}44`, background: `${item.color}18` }}>
          {item.type}
        </span>
      </div>

      {/* Vehicle icon */}
      <div className="vehicle-icon-area" style={{ color: item.color }}>
        {item.type === 'Motorcycle' ? <BikeIcon /> : item.type === 'Luxury' ? <LuxuryIcon /> : item.type === 'Heavy' ? <TruckIcon /> : item.type === 'Supercar' ? <SupercarIcon /> : <CarIcon />}
      </div>

      {/* Info */}
      <div className="os-card-info">
        <h3 className="os-card-title">{item.name}</h3>
        <p className="os-card-desc">{item.desc}</p>
      </div>

      {/* Stats */}
      <div className="vehicle-stats">
        <StatBar label="Speed"    value={item.speed}    color={item.color} />
        <StatBar label="Handling" value={item.handling} color={item.color} />
      </div>
    </div>
  );
}

/* ── Showcasing Soon placeholder ───────────────── */
function ShowcasingSoon({ label }) {
  return (
    <div className="showcasing-soon">
      <div className="showcasing-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="38" height="38">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <h3 className="showcasing-title">Showcasing Soon!</h3>
      <p className="showcasing-sub">The {label} collection is being curated. Check back soon.</p>
    </div>
  );
}

/* ── Server Card ──────────────────────────────── */
function ServerCard({ item }) {
  const isOnline = item.status === 'online';
  return (
    <div className={`os-card server-card ${!isOnline ? 'offline' : ''}`} style={{ '--vc': item.color }}>
      <div className="vehicle-glow" style={{ background: `radial-gradient(circle, ${item.color}22 0%, transparent 70%)` }} />

      {/* Logo text badge */}
      <div className="server-logo-area">
        <div className="xlantis-logo-text">
          <div>
            <span className="xlantis-xl">XL</span><span className="xlantis-an" style={{ color: item.color }}>AN</span><span className="xlantis-tis">TIS</span>
          </div>
          <div className="xlantis-sub">XLANTIS CITY</div>
        </div>
      </div>

      {/* Status dot */}
      <div className="server-status-block">
        <span className={`server-status-dot ${isOnline ? 'online' : 'offline'}`} />
        <span className="server-status-label">{isOnline ? 'Online' : 'Offline'}</span>
      </div>

      {/* Info */}
      <div className="os-card-info">
        <h3 className="os-card-title" style={{ color: item.color }}>{item.name}</h3>
        <p className="os-card-desc">{item.tagline}</p>
      </div>

      {/* Tags */}
      <div className="server-tags">
        {item.tags.map(t => (
          <span key={t} className="server-tag" style={{ borderColor: `${item.color}33`, color: item.color, background: `${item.color}10` }}>{t}</span>
        ))}
      </div>
    </div>
  );
}
function StatBar({ label, value, color }) {
  return (
    <div className="stat-bar-row">
      <span className="stat-label">{label}</span>
      <div className="stat-track">
        <div className="stat-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="stat-val">{value}</span>
    </div>
  );
}

/* ── SVG Icons ───────────────────────────────── */
function DressIcon({ large }) {
  const s = large ? 44 : 18;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={s} height={s}>
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
    </svg>
  );
}
function VehicleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3"/>
      <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  );
}
function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="48" height="48">
      <path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h.5l3-4h7l3 4H19a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z"/>
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
      <line x1="9" y1="9" x2="15" y2="9"/>
    </svg>
  );
}
function BikeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="48" height="48">
      <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
      <path d="M15 6h-5l-3 8h9.5M15 6l2 5"/>
      <path d="M12 6V3h3"/>
    </svg>
  );
}
function LuxuryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="48" height="48">
      <path d="M20 17H4a2 2 0 0 1-2-2v-3l2-5h16l2 5v3a2 2 0 0 1-2 2z"/>
      <path d="M6 7l1.5-4h9L18 7"/>
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
      <line x1="9" y1="11" x2="15" y2="11"/>
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="48" height="48">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3"/>
      <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  );
}
function SupercarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="48" height="48">
      <path d="M22 15H2v-2l4-6h12l4 6v2z"/>
      <path d="M6 9l1.5 3M18 9l-1.5 3"/>
      <circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
      <line x1="10" y1="15" x2="14" y2="15"/>
    </svg>
  );
}
function ServerIcon({ large }) {
  const s = large ? 36 : 18;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={s} height={s}>
      <rect x="2" y="2" width="20" height="8" rx="2"/>
      <rect x="2" y="14" width="20" height="8" rx="2"/>
      <line x1="6" y1="6" x2="6.01" y2="6"/>
      <line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  );
}
