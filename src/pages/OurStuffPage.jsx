import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OurStuffPage.css';

/* ── Data ─────────────────────────────────────── */
const DRESS_ITEMS = [
  {
    id: 'd1',
    name: 'TVA Street Fit',
    desc: 'Classic black oversized hoodie with red TVA logo print. Standard crew uniform.',
    colors: ['#1a1a1a', '#e63946', '#ffffff'],
    tag: 'Crew Uniform',
  },
  {
    id: 'd2',
    name: 'Savage Drop Tee',
    desc: 'Drop-shoulder graphic tee worn by Savage. Limited run, red & black colorway.',
    colors: ['#1a1a1a', '#e63946'],
    tag: 'Limited',
  },
  {
    id: 'd3',
    name: 'OG Tracksuit',
    desc: 'All-black tracksuit with gold trim — the signature look of TVA veterans.',
    colors: ['#111111', '#d4af37'],
    tag: 'OG Exclusive',
  },
  {
    id: 'd4',
    name: 'Demon Edition Jacket',
    desc: 'Biker-style leather jacket, custom patched with the TVA gang emblem.',
    colors: ['#0d0d0d', '#7209b7', '#e63946'],
    tag: 'Gang Edition',
  },
  {
    id: 'd5',
    name: 'TVA Cap — Black',
    desc: '6-panel structured cap with embroidered TVA wordmark on the front panel.',
    colors: ['#111111', '#e63946'],
    tag: 'Accessory',
  },
  {
    id: 'd6',
    name: 'Recon Cargo Pants',
    desc: 'Tactical cargo pants in charcoal grey, standard issue for TVA field ops.',
    colors: ['#3a3a3a', '#1a1a1a'],
    tag: 'Crew Uniform',
  },
  {
    id: 'd7',
    name: 'Warlord Vest',
    desc: 'Gang colours vest, worn over a plain white tee. Back patch with TVA crest.',
    colors: ['#1c1c1c', '#f4a023'],
    tag: 'Gang Edition',
  },
  {
    id: 'd8',
    name: 'Goku Drip Set',
    desc: 'Full GTA RP drip set curated by MRZ Goku — joggers, oversized tee & chain.',
    colors: ['#0d0d0d', '#4361ee', '#ffffff'],
    tag: 'Member Edition',
  },
];

const VEHICLE_ITEMS = [
  {
    id: 'v1',
    name: 'TVA Crew Stallion',
    desc: 'Blacked-out Bravado Buffalo S — the primary gang cruiser. Red brake calipers.',
    type: 'Muscle Car',
    speed: 92,
    handling: 78,
    color: '#e63946',
  },
  {
    id: 'v2',
    name: 'Savage Hellride',
    desc: 'Declasse Vigero ZX, full matte black, widebody kit. Driven by Savage TVA.',
    type: 'Muscle Car',
    speed: 88,
    handling: 82,
    color: '#ff4655',
  },
  {
    id: 'v3',
    name: 'Demon Blade',
    desc: 'Western Deathbike — Demon\'s signature two-wheeler. Fastest in the crew.',
    type: 'Motorcycle',
    speed: 98,
    handling: 70,
    color: '#7209b7',
  },
  {
    id: 'v4',
    name: 'GodFather Phantom',
    desc: 'Rolls Royce Phantom custom — Blind Joker\'s vehicle. Maroon with gold trim.',
    type: 'Luxury',
    speed: 75,
    handling: 85,
    color: '#d4af37',
  },
  {
    id: 'v5',
    name: 'OG Maverick',
    desc: 'Vapid Pisswasser Dominator. The original TVA crew car — retro muscle build.',
    type: 'Muscle Car',
    speed: 85,
    handling: 72,
    color: '#f4a023',
  },
  {
    id: 'v6',
    name: 'Reaper Superbike',
    desc: 'Shitzu Hakuchou Drag — tuned for top speed. Used in street racing events.',
    type: 'Motorcycle',
    speed: 99,
    handling: 65,
    color: '#4361ee',
  },
  {
    id: 'v7',
    name: 'Convoy Truck',
    desc: 'HVY Insurgent Pick-Up — crew logistics and heavy operations vehicle.',
    type: 'Heavy',
    speed: 68,
    handling: 60,
    color: '#555577',
  },
  {
    id: 'v8',
    name: 'Shadow Runner',
    desc: 'Principe Deveste Eight, deep ocean blue. Used for night-time crew escapes.',
    type: 'Supercar',
    speed: 97,
    handling: 90,
    color: '#4cc9f0',
  },
];

const TABS = [
  { id: 'dress',    label: 'Dress Collections', icon: <DressIcon /> },
  { id: 'vehicles', label: 'Gang Vehicles',      icon: <VehicleIcon /> },
  { id: 'servers',  label: 'FiveM Servers',      icon: <ServerIcon /> },
];

/* ── Server data ─────────────────────────────── */
const SERVER_ITEMS = [
  {
    id: 's1',
    name: 'TVA Roleplay',
    tagline: 'The official TVA GTA RP server. Whitelisted, serious RP.',
    status: 'online',
    players: 64,
    maxPlayers: 128,
    framework: 'ESX',
    tags: ['Whitelisted', 'Serious RP', 'Custom Cars', 'Gang System'],
    ip: 'connect tva-rp.fivem.net',
    color: '#e63946',
  },
  {
    id: 's2',
    name: 'TVA Street Wars',
    tagline: 'PvP-focused deathmatch & gang war server. No whitelist.',
    status: 'online',
    players: 102,
    maxPlayers: 128,
    framework: 'vRP',
    tags: ['Open', 'PvP', 'Gang Wars', 'Deathmatch'],
    ip: 'connect tva-wars.fivem.net',
    color: '#f4a023',
  },
  {
    id: 's3',
    name: 'TVA Dev Server',
    tagline: 'Private development & testing environment. Staff only.',
    status: 'offline',
    players: 0,
    maxPlayers: 32,
    framework: 'QBCore',
    tags: ['Private', 'Staff Only', 'Testing'],
    ip: 'Private',
    color: '#7209b7',
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
            <div className="os-grid dress-grid">
              {DRESS_ITEMS.map(item => (
                <DressCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Gang Vehicles */}
        {activeTab === 'vehicles' && (
          <div className="os-section">
            <div className="os-grid vehicle-grid">
              {VEHICLE_ITEMS.map(item => (
                <VehicleCard key={item.id} item={item} />
              ))}
            </div>
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

/* ── Server Card ──────────────────────────────── */
function ServerCard({ item }) {
  const isOnline = item.status === 'online';
  const pct = Math.round((item.players / item.maxPlayers) * 100);
  return (
    <div className={`os-card server-card ${!isOnline ? 'offline' : ''}`} style={{ '--vc': item.color }}>
      <div className="vehicle-glow" style={{ background: `radial-gradient(circle, ${item.color}22 0%, transparent 70%)` }} />

      {/* Header */}
      <div className="server-header">
        <div className="server-icon-wrap" style={{ borderColor: `${item.color}55`, background: `${item.color}18`, color: item.color }}>
          <ServerIcon large />
        </div>
        <div className="server-status-block">
          <span className={`server-status-dot ${isOnline ? 'online' : 'offline'}`} />
          <span className="server-status-label">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* Info */}
      <div className="os-card-info">
        <div className="server-framework" style={{ color: item.color }}>{item.framework}</div>
        <h3 className="os-card-title">{item.name}</h3>
        <p className="os-card-desc">{item.tagline}</p>
      </div>

      {/* Tags */}
      <div className="server-tags">
        {item.tags.map(t => (
          <span key={t} className="server-tag">{t}</span>
        ))}
      </div>

      {/* Players bar */}
      <div className="server-players">
        <div className="server-players-top">
          <span className="server-players-label">Players</span>
          <span className="server-players-count" style={{ color: isOnline ? item.color : 'var(--text-muted)' }}>
            {item.players} / {item.maxPlayers}
          </span>
        </div>
        <div className="stat-track">
          <div className="stat-fill" style={{ width: `${pct}%`, background: item.color }} />
        </div>
      </div>

      {/* Join button */}
      {isOnline ? (
        <button className="server-join-btn" style={{ '--vc': item.color }}
          onClick={() => navigator.clipboard?.writeText(item.ip)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Copy IP to Connect
        </button>
      ) : (
        <div className="server-offline-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="13" height="13">
            <line x1="1" y1="1" x2="23" y2="23"/>
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
          </svg>
          Server Offline
        </div>
      )}
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
