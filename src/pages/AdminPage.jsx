import { useState, useEffect, useMemo, useRef } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { api } from '../lib/api';
import './AdminPage.css';

function clearAdminSession() {
  localStorage.removeItem('tva-admin-token');
  localStorage.removeItem('tva-admin-user');
  localStorage.removeItem('tva-admin-auth-source');
}

function useAdminAuth() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('tva-admin-token');
    if (!token) {
      clearAdminSession();
      setReady(true);
      setAuthed(false);
      return;
    }

    // Always verify with the API — no localStorage-only bypass
    api.adminMe()
      .then((data) => {
        setAdmin(data.admin || null);
        setAuthed(true);
      })
      .catch(() => {
        clearAdminSession();
        setAdmin(null);
        setAuthed(false);
      })
      .finally(() => setReady(true));
  }, []);

  return { ready, authed, setAuthed, admin, setAdmin };
}

export default function AdminPage() {
  const { ready, authed, setAuthed, setAdmin } = useAdminAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('tva-admin-sidebar') === 'collapsed';
    } catch {
      return false;
    }
  });

  function toggleSidebar() {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('tva-admin-sidebar', next ? 'collapsed' : 'expanded');
      } catch { /* ignore */ }
      return next;
    });
  }

  if (!ready) {
    return <div className="adm-loading">Loading admin…</div>;
  }

  if (!authed) {
    return (
      <AdminLogin
        onSuccess={(sessionAdmin) => {
          setAdmin(sessionAdmin || null);
          setAuthed(true);
        }}
      />
    );
  }

  const navItems = [
    { to: '/admin', end: true, label: 'Dashboard', icon: <IconDashboard /> },
    { to: '/admin/members', label: 'Members', icon: <IconUsers /> },
    { to: '/admin/tournaments', label: 'Tournaments', icon: <IconTrophy /> },
    { to: '/admin/registrations', label: 'Registrations', icon: <IconClipboard /> },
    { to: '/admin/tickets', label: 'Support Tickets', icon: <IconTicket /> },
  ];

  return (
    <div className={`adm-shell${sidebarCollapsed ? ' is-collapsed' : ''}`}>
      <aside className="adm-sidebar">
        <div className="adm-sidebar-top">
          <div className="adm-brand">
            <img src="/images/header-logo.png" alt="TVA" />
          </div>
          <button
            type="button"
            className="adm-sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <IconPanelOpen /> : <IconPanelClose />}
          </button>
        </div>

        <nav className="adm-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              end={item.end}
              to={item.to}
              title={item.label}
              className={({ isActive }) => `adm-nav-link${isActive ? ' active' : ''}`}
            >
              <span className="adm-nav-icon" aria-hidden="true">{item.icon}</span>
              {!sidebarCollapsed && <span className="adm-nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="adm-logout"
          title="Log out"
          onClick={async () => {
            try { await api.adminLogout(); } catch { /* ignore */ }
            clearAdminSession();
            setAdmin(null);
            setAuthed(false);
          }}
        >
          <span className="adm-nav-icon" aria-hidden="true"><IconLogout /></span>
          {!sidebarCollapsed && <span className="adm-nav-label">Log out</span>}
        </button>
      </aside>

      <main className="adm-main">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<MembersAdmin />} />
          <Route path="tournaments" element={<TournamentsAdmin />} />
          <Route path="registrations" element={<RegistrationsAdmin />} />
          <Route path="tickets" element={<TicketsAdmin />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function IconPanelClose() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
      <path d="M14 9l-3 3 3 3" />
    </svg>
  );
}

function IconPanelOpen() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
      <path d="M12 9l3 3-3 3" />
    </svg>
  );
}

function IconDashboard() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function IconTrophy() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M17 6h2a2 2 0 0 1 0 4h-2" />
      <path d="M7 6H5a2 2 0 0 0 0 4h2" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 19a6.5 6.5 0 0 1 13 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 19a5 5 0 0 1 5.5-4.8" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </svg>
  );
}

function IconTicket() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9a2 2 0 0 0 2-2V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2v6a2 2 0 0 0-2 2v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2a2 2 0 0 0-2-2V9z" />
      <path d="M9 8v8" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function AdminLogin({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!email.trim() || !password) {
        throw new Error('Email and password are required');
      }

      const session = await api.adminLogin(email.trim(), password);
      if (!session?.token) throw new Error('Invalid password');

      localStorage.setItem('tva-admin-token', session.token);
      localStorage.setItem('tva-admin-user', JSON.stringify(session.admin || null));
      localStorage.setItem('tva-admin-auth-source', 'supabase');
      onSuccess(session.admin);
    } catch {
      clearAdminSession();
      setError('Invalid password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adm-login-page">
      <div className="adm-login-shell">
        <aside className="adm-login-visual" aria-hidden="true">
          <img src="/images/banners/banner-1.jpg" alt="" className="adm-login-bg" />
          <div className="adm-login-visual-overlay" />
          <div className="adm-login-visual-content">
            <img src="/images/header-logo.png" alt="TVA" className="adm-login-visual-logo" />
            <p>Manage tournaments, team registrations, and support operations from one protected console.</p>
          </div>
        </aside>

        <form className="adm-login-card" onSubmit={handleSubmit}>
          <div className="adm-login-card-top">
            <img src="/images/header-logo.png" alt="TVA" className="adm-login-logo" />
          </div>
          <h1>Admin Sign In</h1>
          <p>Enter your credentials to continue. Sessions are verified on every request.</p>

          <label className="adm-field">
            <span>Admin Email</span>
            <div className="adm-input-wrap">
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                required
              />
            </div>
          </label>

          <label className="adm-field">
            <span>Password</span>
            <div className="adm-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                autoFocus
                required
              />
              <button
                type="button"
                className="adm-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </label>

          <button type="submit" className="adm-login-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in securely'}
          </button>
          <small>Restricted access · TVA administrators only</small>
        </form>
      </div>

      {error && (
        <div
          className="adm-alert-overlay"
          onClick={() => setError('')}
          role="presentation"
        >
          <div
            className="adm-alert"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-labelledby="adm-alert-msg"
          >
            <div className="adm-alert-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="26" height="26">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p id="adm-alert-msg" className="adm-alert-msg">{error}</p>
            <button type="button" className="adm-alert-btn" onClick={() => setError('')}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.adminStats()
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="adm-error">{error}</p>;
  if (!stats) return <p className="adm-muted">Loading dashboard…</p>;

  const cards = [
    { label: 'Members', value: stats.members ?? 0, sub: 'TVA family' },
    { label: 'Tournaments', value: stats.tournaments, sub: `${stats.upcoming} upcoming` },
    { label: 'Registrations', value: stats.registrations, sub: `${stats.pendingRegistrations} pending` },
    { label: 'Support Tickets', value: stats.tickets, sub: `${stats.openTickets} open` },
  ];

  return (
    <div>
      <header className="adm-header">
        <h1>Dashboard</h1>
        <p>Overview of user-side activity</p>
      </header>
      <div className="adm-stat-grid">
        {cards.map((c) => (
          <div key={c.label} className="adm-stat-card">
            <span>{c.label}</span>
            <strong>{c.value}</strong>
            <em>{c.sub}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

function emptyMember() {
  return {
    id: null,
    initial: '',
    name: '',
    role: 'Member',
    image: '',
    instagram: '',
    youtube: '',
    kick: '',
    discord: '',
    sort_order: 0,
    is_active: true,
  };
}

const ROLES = [
  { value: 'Founder, Leader', color: '#e63946' },
  { value: 'God Father', color: '#ff8a00' },
  { value: 'Co-Leader', color: '#4361ee' },
  { value: 'Undeclared Co leader', color: '#7c3aed' },
  { value: 'Member', color: '#22c55e' },
  { value: 'Inactive', color: '#6b7280' },
];

function MembersAdmin() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, name }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((m) => {
      const haystack = [
        m.name,
        m.role,
        m.initial,
        m.instagram,
        m.youtube,
        m.kick,
        m.discord,
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [items, search]);

  async function load() {
    const data = await api.adminMembers();
    setItems(data.members || []);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function save() {
    if (!selected) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...selected,
        initial: selected.initial || (selected.name ? selected.name.charAt(0).toUpperCase() : '?'),
        is_active: selected.is_active !== false,
        sort_order: Number(selected.sort_order) || 0,
      };
      if (selected.id) {
        await api.updateMember(selected.id, payload);
      } else {
        await api.createMember(payload);
      }
      await load();
      setSelected(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    setError('');
    try {
      await api.deleteMember(id);
      await load();
      if (selected?.id === id) setSelected(null);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <header className="adm-header-toolbar">
        <div>
          <h1>Members <span className="adm-count-badge">{items.filter(m => m.is_active).length} active</span></h1>
          <p>Manage TVA family / crew profiles shown on the site</p>
        </div>
        <div className="adm-toolbar-actions">
          <label className="adm-search">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members…"
              aria-label="Search members"
            />
            {search && (
              <button type="button" className="adm-search-clear" onClick={() => setSearch('')} aria-label="Clear search">×</button>
            )}
          </label>
          <button type="button" className="adm-primary adm-add-btn" onClick={() => setSelected(emptyMember())}>
            + Add member
          </button>
        </div>
      </header>
      {error && <p className="adm-error">{error}</p>}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th>Order</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="adm-member-avatar">
                      {m.image ? <img src={m.image} alt="" /> : <span>{m.initial}</span>}
                    </div>
                    <div>
                      <strong>{m.name}</strong>
                      <div className="adm-muted">{[m.instagram && 'IG', m.youtube && 'YT', m.kick && 'Kick', m.discord && 'Discord'].filter(Boolean).join(' · ') || 'No socials'}</div>
                    </div>
                  </div>
                </td>
                <td>{m.role}</td>
                <td>{m.sort_order}</td>
                <td>
                  <span className={`adm-pill ${m.is_active ? 'active' : 'rejected'}`}>
                    {m.is_active ? 'active' : 'hidden'}
                  </span>
                </td>
                <td>
                  <button type="button" className="adm-link-btn" onClick={() => setSelected({ ...emptyMember(), ...m })}>Edit</button>
                  {' '}
                  <button type="button" className="adm-chip-btn danger" onClick={() => setConfirmDelete({ id: m.id, name: m.name })}>Delete</button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={5} className="adm-muted">
                  {items.length && search
                    ? `No members match "${search}"`
                    : 'No members yet. Run the Supabase migration, then add members here.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div className="adm-confirm-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="adm-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-confirm-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </div>
            <h3>Remove member?</h3>
            <p>Remove <strong>{confirmDelete.name}</strong> from the TVA family? This cannot be undone.</p>
            <div className="adm-confirm-actions">
              <button type="button" className="adm-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                type="button"
                className="adm-primary adm-danger-btn"
                onClick={() => { remove(confirmDelete.id); setConfirmDelete(null); }}
              >
                Yes, remove
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="adm-drawer-overlay" onClick={() => setSelected(null)}>
          <div className="adm-drawer adm-member-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="adm-drawer-head adm-member-drawer-head">
              <div className="adm-member-avatar-edit" onClick={() => fileInputRef.current?.click()} title="Change photo">
                <div className="adm-member-avatar-wrap">
                  {selected.image ? (
                    <img src={selected.image} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <span>{(selected.initial || selected.name?.charAt(0) || '?').toUpperCase()}</span>
                  )}
                </div>
                <div className="adm-avatar-edit-badge">
                  {uploading ? (
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" className="adm-spin">
                      <circle cx="12" cy="12" r="10" strokeDasharray="30 60" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const res = await api.uploadMemberImage(file);
                      setSelected((prev) => ({ ...prev, image: res.path }));
                    } catch (err) {
                      setError(err.message || 'Upload failed');
                    } finally {
                      setUploading(false);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
              <div className="adm-member-drawer-info">
                <p className="adm-drawer-eyebrow">{selected.id ? 'Edit profile' : 'New member'}</p>
                <h2>{selected.name || 'Crew member'}</h2>
                {selected.role && (
                  <span className="adm-member-drawer-role" style={{ color: ROLES.find(r => r.value === selected.role)?.color || '#aaa' }}>
                    {selected.role}
                  </span>
                )}
              </div>
              <button type="button" className="adm-drawer-close" onClick={() => setSelected(null)} aria-label="Close">×</button>
            </div>

            <form
              className="adm-form adm-member-form"
              onSubmit={(e) => { e.preventDefault(); save(); }}
            >
              <div className="adm-form-section">
                <h3>Profile</h3>
                <label>
                  <span>Display name</span>
                  <input
                    value={selected.name || ''}
                    onChange={(e) => setSelected({
                      ...selected,
                      name: e.target.value,
                      initial: selected.initial || e.target.value.charAt(0).toUpperCase(),
                    })}
                    placeholder="Eagle Gaming (Dilin Dineshan)"
                    required
                  />
                </label>
                <label>
                  <span>Avatar initial</span>
                  <input
                    value={selected.initial || ''}
                    maxLength={2}
                    onChange={(e) => setSelected({ ...selected, initial: e.target.value.toUpperCase() })}
                    placeholder="E"
                  />
                </label>
                <div>
                  <span className="adm-field-label">Role</span>
                  <div className="adm-role-chips">
                    {ROLES.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        className={`adm-role-chip${selected.role === r.value ? ' selected' : ''}`}
                        style={{ '--role-color': r.color }}
                        onClick={() => setSelected({ ...selected, role: r.value })}
                      >
                        {r.value}
                      </button>
                    ))}
                  </div>
                </div>
                <label>
                  <span>Sort order</span>
                  <input
                    type="number"
                    min="0"
                    value={selected.sort_order ?? 0}
                    onChange={(e) => setSelected({ ...selected, sort_order: e.target.value })}
                  />
                  <em className="adm-field-note">Lower numbers appear first on the Crew page</em>
                </label>
              </div>


              <div className="adm-form-section">
                <h3>Social links</h3>
                <div className="adm-social-fields">
                  <label className="adm-social-field">
                    <span className="adm-social-label">
                      <img src="/images/youtube.png" alt="" /> YouTube
                    </span>
                    <input
                      value={selected.youtube || ''}
                      onChange={(e) => setSelected({ ...selected, youtube: e.target.value })}
                      placeholder="https://youtube.com/..."
                    />
                  </label>
                  <label className="adm-social-field">
                    <span className="adm-social-label">
                      <img src="/images/kick.png" alt="" /> Kick
                    </span>
                    <input
                      value={selected.kick || ''}
                      onChange={(e) => setSelected({ ...selected, kick: e.target.value })}
                      placeholder="https://kick.com/..."
                    />
                  </label>
                  <label className="adm-social-field">
                    <span className="adm-social-label">
                      <img src="/images/instagram.png" alt="" /> Instagram
                    </span>
                    <input
                      value={selected.instagram || ''}
                      onChange={(e) => setSelected({ ...selected, instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                    />
                  </label>
                  <label className="adm-social-field">
                    <span className="adm-social-label">
                      <img src="/images/discord.png" alt="" /> Discord
                    </span>
                    <input
                      value={selected.discord || ''}
                      onChange={(e) => setSelected({ ...selected, discord: e.target.value })}
                      placeholder="https://discord.gg/..."
                    />
                  </label>
                </div>
              </div>

              <div className="adm-form-section adm-form-section-last">
                <h3>Visibility</h3>
                <label className="adm-toggle-card">
                  <input
                    type="checkbox"
                    checked={selected.is_active !== false}
                    onChange={(e) => setSelected({ ...selected, is_active: e.target.checked })}
                  />
                  <span className="adm-toggle-card-body">
                    <strong>Show on Crew page</strong>
                  </span>
                </label>
              </div>

              <div className="adm-drawer-actions">
                <button type="button" className="adm-secondary" onClick={() => setSelected(null)}>Cancel</button>
                <button type="submit" className="adm-primary" disabled={saving || uploading}>
                  {uploading ? 'Uploading…' : saving ? 'Saving…' : (selected.id ? 'Save changes' : 'Add member')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TournamentsAdmin() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await api.adminTournaments();
    setItems(data.tournaments || []);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function save() {
    if (!selected) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...selected,
        registrationOpen: !!selected.registrationOpen,
        teams: Number(selected.teams) || 0,
      };
      await api.updateTournament(selected.id, payload);
      await load();
      setSelected(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleRegistration(t) {
    try {
      await api.updateTournament(t.id, { registrationOpen: !t.registrationOpen });
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <header className="adm-header">
        <h1>Tournaments</h1>
        <p>Edit status, prizes, and registration availability</p>
      </header>
      {error && <p className="adm-error">{error}</p>}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Prize</th>
              <th>Registration</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id}>
                <td>
                  <strong>{t.title}</strong>
                  <div className="adm-muted">{t.subtitle}</div>
                </td>
                <td><span className={`adm-pill ${t.status}`}>{t.status}</span></td>
                <td>{t.prizePool}</td>
                <td>
                  <button type="button" className="adm-chip-btn" onClick={() => toggleRegistration(t)}>
                    {t.registrationOpen ? 'Open' : 'Closed'}
                  </button>
                </td>
                <td>
                  <button type="button" className="adm-link-btn" onClick={() => setSelected({ ...t })}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="adm-drawer-overlay" onClick={() => setSelected(null)}>
          <div className="adm-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="adm-drawer-head">
              <h2>Edit Tournament</h2>
              <button type="button" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="adm-form">
              <label><span>Title</span><input value={selected.title || ''} onChange={(e) => setSelected({ ...selected, title: e.target.value })} /></label>
              <label><span>Subtitle</span><input value={selected.subtitle || ''} onChange={(e) => setSelected({ ...selected, subtitle: e.target.value })} /></label>
              <div className="adm-form-row">
                <label>
                  <span>Status</span>
                  <select value={selected.status || 'upcoming'} onChange={(e) => setSelected({ ...selected, status: e.target.value })}>
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>
                <label><span>Prize Pool</span><input value={selected.prizePool || ''} onChange={(e) => setSelected({ ...selected, prizePool: e.target.value })} /></label>
              </div>
              <div className="adm-form-row">
                <label><span>Format</span><input value={selected.format || ''} onChange={(e) => setSelected({ ...selected, format: e.target.value })} /></label>
                <label><span>Region</span><input value={selected.region || ''} onChange={(e) => setSelected({ ...selected, region: e.target.value })} /></label>
              </div>
              <div className="adm-form-row">
                <label><span>Teams / Crews</span><input type="number" value={selected.teams || 0} onChange={(e) => setSelected({ ...selected, teams: e.target.value })} /></label>
                <label className="adm-check">
                  <input type="checkbox" checked={!!selected.registrationOpen} onChange={(e) => setSelected({ ...selected, registrationOpen: e.target.checked })} />
                  <span>Registration open</span>
                </label>
              </div>
              <label><span>Winner</span><input value={selected.winner || ''} onChange={(e) => setSelected({ ...selected, winner: e.target.value })} placeholder="Optional" /></label>
              <label><span>Anti-Cheat</span><input value={selected.antiCheat || ''} onChange={(e) => setSelected({ ...selected, antiCheat: e.target.value })} /></label>
              <div className="adm-drawer-actions">
                <button type="button" className="adm-secondary" onClick={() => setSelected(null)}>Cancel</button>
                <button type="button" className="adm-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RegistrationsAdmin() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [active, setActive] = useState(null);

  async function load() {
    const data = await api.adminRegistrations();
    setItems(data.registrations || []);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((r) => r.status === filter);
  }, [items, filter]);

  async function setStatus(id, status) {
    try {
      await api.patchRegistration(id, { status });
      await load();
      if (active?.id === id) setActive((a) => ({ ...a, status }));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <header className="adm-header">
        <h1>Team Registrations</h1>
        <p>Review crews registering for tournaments</p>
      </header>
      {error && <p className="adm-error">{error}</p>}

      <div className="adm-filters">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button key={f} type="button" className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Tournament</th>
              <th>Captain</th>
              <th>Status</th>
              <th>Submitted</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="adm-muted">No registrations yet.</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.teamName}</strong></td>
                <td>{r.tournamentTitle || r.tournamentId}</td>
                <td>{r.captainName}</td>
                <td><span className={`adm-pill ${r.status}`}>{r.status}</span></td>
                <td>{r.submittedAt ? new Date(r.submittedAt).toLocaleString() : '—'}</td>
                <td><button type="button" className="adm-link-btn" onClick={() => setActive(r)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {active && (
        <div className="adm-drawer-overlay" onClick={() => setActive(null)}>
          <div className="adm-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="adm-drawer-head">
              <h2>{active.teamName}</h2>
              <button type="button" onClick={() => setActive(null)}>×</button>
            </div>
            <div className="adm-detail">
              <p><strong>Captain:</strong> {active.captainName}</p>
              <p><strong>Tournament:</strong> {active.tournamentTitle || active.tournamentId}</p>
              <p><strong>Status:</strong> {active.status}</p>
              <h3>Members</h3>
              <ul>
                {(active.members || []).map((m, i) => (
                  <li key={i}>{m.name} · {m.discord} · {m.phone}</li>
                ))}
              </ul>
              <div className="adm-drawer-actions">
                <button type="button" className="adm-secondary" onClick={() => setStatus(active.id, 'rejected')}>Reject</button>
                <button type="button" className="adm-primary" onClick={() => setStatus(active.id, 'approved')}>Approve</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TicketsAdmin() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [active, setActive] = useState(null);

  async function load() {
    const data = await api.adminTickets();
    setItems(data.tickets || []);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    if (filter === 'open' || filter === 'closed') return items.filter((t) => t.status === filter);
    return items.filter((t) => t.type === filter);
  }, [items, filter]);

  async function setStatus(id, status) {
    try {
      await api.patchTicket(id, { status });
      await load();
      if (active?.id === id) setActive((a) => ({ ...a, status }));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <header className="adm-header">
        <h1>Support Tickets</h1>
        <p>General, partnerships, and sponsorship requests</p>
      </header>
      {error && <p className="adm-error">{error}</p>}

      <div className="adm-filters">
        {['all', 'open', 'closed', 'general', 'partnership', 'sponsorship'].map((f) => (
          <button key={f} type="button" className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Submitted</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="adm-muted">No tickets yet.</td></tr>
            )}
            {filtered.map((t) => (
              <tr key={t.id}>
                <td><strong>{t.name}</strong></td>
                <td>{t.type}</td>
                <td>{t.subject}</td>
                <td><span className={`adm-pill ${t.status}`}>{t.status}</span></td>
                <td>{t.submittedAt ? new Date(t.submittedAt).toLocaleString() : '—'}</td>
                <td><button type="button" className="adm-link-btn" onClick={() => setActive(t)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {active && (
        <div className="adm-drawer-overlay" onClick={() => setActive(null)}>
          <div className="adm-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="adm-drawer-head">
              <h2>{active.subject}</h2>
              <button type="button" onClick={() => setActive(null)}>×</button>
            </div>
            <div className="adm-detail">
              <p><strong>From:</strong> {active.name}</p>
              <p><strong>Email:</strong> {active.email || '—'}</p>
              <p><strong>Discord:</strong> {active.discord || '—'}</p>
              <p><strong>Type:</strong> {active.type}</p>
              <p><strong>Message:</strong></p>
              <pre className="adm-message">{active.message}</pre>
              <div className="adm-drawer-actions">
                <button type="button" className="adm-secondary" onClick={() => setStatus(active.id, 'closed')}>Mark closed</button>
                <button type="button" className="adm-primary" onClick={() => setStatus(active.id, 'open')}>Reopen</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
