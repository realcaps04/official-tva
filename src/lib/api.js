const API_BASE = '';

function authHeaders() {
  const token = localStorage.getItem('tva-admin-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && path.startsWith('/api/admin') && path !== '/api/admin/login') {
      localStorage.removeItem('tva-admin-token');
      localStorage.removeItem('tva-admin-user');
      localStorage.removeItem('tva-admin-auth-source');
    }
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  getTournaments: () => request('/api/tournaments'),
  getMembers: () => request('/api/members'),
  createRegistration: (body) => request('/api/registrations', { method: 'POST', body: JSON.stringify(body) }),
  createTicket: (body) => request('/api/tickets', { method: 'POST', body: JSON.stringify(body) }),

  adminLogin: (email, password) =>
    request('/api/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  adminLogout: () => request('/api/admin/logout', { method: 'POST' }),
  adminMe: () => request('/api/admin/me'),
  adminStats: () => request('/api/admin/stats'),
  adminMembers: () => request('/api/admin/members'),
  createMember: (body) => request('/api/admin/members', { method: 'POST', body: JSON.stringify(body) }),
  updateMember: (id, body) => request(`/api/admin/members/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteMember: (id) => request(`/api/admin/members/${id}`, { method: 'DELETE' }),
  uploadMemberImage: async (file) => {
    const token = localStorage.getItem('tva-admin-token');
    const form = new FormData();
    form.append('image', file);
    const res = await fetch('/api/admin/members/upload-image', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },
  adminTournaments: () => request('/api/admin/tournaments'),
  updateTournament: (id, body) => request(`/api/admin/tournaments/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  createTournament: (body) => request('/api/admin/tournaments', { method: 'POST', body: JSON.stringify(body) }),
  deleteTournament: (id) => request(`/api/admin/tournaments/${id}`, { method: 'DELETE' }),
  adminRegistrations: () => request('/api/admin/registrations'),
  patchRegistration: (id, body) => request(`/api/admin/registrations/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteRegistration: (id) => request(`/api/admin/registrations/${id}`, { method: 'DELETE' }),
  adminTickets: () => request('/api/admin/tickets'),
  patchTicket: (id, body) => request(`/api/admin/tickets/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteTicket: (id) => request(`/api/admin/tickets/${id}`, { method: 'DELETE' }),
};
