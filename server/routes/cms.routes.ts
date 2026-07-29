import { Router } from 'express';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { loginAdmin, logoutAdmin, requireAdmin, getSession } from '../middleware/adminAuth';
import { readStore, updateStore } from '../services/store.service';
import {
  listCrewMembers,
  createCrewMember,
  updateCrewMember,
  deleteCrewMember,
} from '../services/members.service';

const IMAGES_DIR = path.resolve(__dirname, '../../public/images');
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

const memberUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, IMAGES_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
      cb(null, `member-${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|jpg|png|webp|gif)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const router = Router();

/* ── Public ───────────────────────────────────── */
router.get('/tournaments', (_req, res) => {
  const { tournaments } = readStore();
  res.json({ tournaments });
});

router.get('/tournaments/:id', (req, res) => {
  const { tournaments } = readStore();
  const t = tournaments.find((x: any) => x.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Tournament not found' });
  return res.json({ tournament: t });
});

router.post('/registrations', (req, res) => {
  const body = req.body || {};
  if (!body.tournamentId || !body.teamName || !body.captainName) {
    return res.status(400).json({ error: 'Missing required registration fields' });
  }
  const entry = {
    id: crypto.randomUUID(),
    status: 'pending',
    ...body,
    submittedAt: body.submittedAt || new Date().toISOString(),
  };
  updateStore((store) => {
    store.registrations.unshift(entry);
    return store;
  });
  return res.status(201).json({ registration: entry });
});

router.post('/tickets', (req, res) => {
  const body = req.body || {};
  if (!body.type || !body.name || !body.message) {
    return res.status(400).json({ error: 'Missing required ticket fields' });
  }
  if (!body.email && !body.discord) {
    return res.status(400).json({ error: 'Provide email or Discord' });
  }
  const entry = {
    id: crypto.randomUUID(),
    status: 'open',
    ...body,
    submittedAt: body.submittedAt || new Date().toISOString(),
  };
  updateStore((store) => {
    store.tickets.unshift(entry);
    return store;
  });
  return res.status(201).json({ ticket: entry });
});

/* ── Public crew members (Supabase) ───────────── */
router.get('/members', async (_req, res) => {
  try {
    const members = await listCrewMembers({ includeInactive: false });
    return res.json({ members });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to load members' });
  }
});

/* ── Admin auth (Supabase admin_users table) ───── */
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const result = await loginAdmin(String(email), String(password));
  if (!result.ok || !result.token) {
    return res.status(401).json({ error: result.error || 'Invalid password' });
  }
  return res.json({ token: result.token, admin: result.admin });
});

router.post('/admin/logout', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  logoutAdmin(token);
  res.json({ ok: true });
});

router.get('/admin/me', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const session = getSession(token);
  if (!session) return res.status(401).json({ error: 'Unauthorized. Please log in through the admin login page.' });
  return res.json({ ok: true, admin: session.admin });
});

/* ── Admin data ───────────────────────────────── */
router.get('/admin/stats', requireAdmin, async (_req, res) => {
  const { tournaments, registrations, tickets } = readStore();
  let membersCount = 0;
  try {
    const members = await listCrewMembers({ includeInactive: true });
    membersCount = members.length;
  } catch {
    membersCount = 0;
  }
  res.json({
    tournaments: tournaments.length,
    upcoming: tournaments.filter((t: any) => t.status === 'upcoming').length,
    registrations: registrations.length,
    pendingRegistrations: registrations.filter((r: any) => r.status === 'pending').length,
    tickets: tickets.length,
    openTickets: tickets.filter((t: any) => t.status === 'open').length,
    members: membersCount,
  });
});

router.post('/admin/members/upload-image', requireAdmin, memberUpload.single('image'), (req: any, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  const publicPath = `/images/${req.file.filename}`;
  return res.json({ path: publicPath });
});

router.get('/admin/members', requireAdmin, async (_req, res) => {
  try {
    const members = await listCrewMembers({ includeInactive: true });
    return res.json({ members });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to load members' });
  }
});

router.post('/admin/members', requireAdmin, async (req, res) => {
  try {
    const member = await createCrewMember(req.body || {});
    return res.status(201).json({ member });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to create member' });
  }
});

router.put('/admin/members/:id', requireAdmin, async (req, res) => {
  try {
    const member = await updateCrewMember(String(req.params.id), req.body || {});
    return res.json({ member });
  } catch (err: any) {
    const status = /not found/i.test(err.message || '') ? 404 : 400;
    return res.status(status).json({ error: err.message || 'Failed to update member' });
  }
});

router.delete('/admin/members/:id', requireAdmin, async (req, res) => {
  try {
    await deleteCrewMember(String(req.params.id));
    return res.json({ ok: true });
  } catch (err: any) {
    const status = /not found/i.test(err.message || '') ? 404 : 400;
    return res.status(status).json({ error: err.message || 'Failed to delete member' });
  }
});

router.get('/admin/tournaments', requireAdmin, (_req, res) => {
  res.json({ tournaments: readStore().tournaments });
});

router.put('/admin/tournaments/:id', requireAdmin, (req, res) => {
  const id = req.params.id;
  let updated: any = null;
  updateStore((store) => {
    const idx = store.tournaments.findIndex((t: any) => t.id === id);
    if (idx === -1) return store;
    store.tournaments[idx] = { ...store.tournaments[idx], ...req.body, id };
    updated = store.tournaments[idx];
    return store;
  });
  if (!updated) return res.status(404).json({ error: 'Tournament not found' });
  return res.json({ tournament: updated });
});

router.post('/admin/tournaments', requireAdmin, (req, res) => {
  const body = req.body || {};
  const id = body.id || `tournament-${Date.now()}`;
  const entry = {
    gameId: 'gta',
    status: 'upcoming',
    registrationOpen: true,
    year: String(new Date().getFullYear()),
    color: '#00aaff',
    colorRgb: '0,170,255',
    prizes: [],
    platforms: [],
    ...body,
    id,
  };
  updateStore((store) => {
    store.tournaments.unshift(entry);
    return store;
  });
  res.status(201).json({ tournament: entry });
});

router.delete('/admin/tournaments/:id', requireAdmin, (req, res) => {
  let removed = false;
  updateStore((store) => {
    const before = store.tournaments.length;
    store.tournaments = store.tournaments.filter((t: any) => t.id !== req.params.id);
    removed = store.tournaments.length < before;
    return store;
  });
  if (!removed) return res.status(404).json({ error: 'Tournament not found' });
  return res.json({ ok: true });
});

router.get('/admin/registrations', requireAdmin, (_req, res) => {
  res.json({ registrations: readStore().registrations });
});

router.patch('/admin/registrations/:id', requireAdmin, (req, res) => {
  let updated: any = null;
  updateStore((store) => {
    const idx = store.registrations.findIndex((r: any) => r.id === req.params.id);
    if (idx === -1) return store;
    store.registrations[idx] = { ...store.registrations[idx], ...req.body, id: req.params.id };
    updated = store.registrations[idx];
    return store;
  });
  if (!updated) return res.status(404).json({ error: 'Registration not found' });
  return res.json({ registration: updated });
});

router.delete('/admin/registrations/:id', requireAdmin, (req, res) => {
  let removed = false;
  updateStore((store) => {
    const before = store.registrations.length;
    store.registrations = store.registrations.filter((r: any) => r.id !== req.params.id);
    removed = store.registrations.length < before;
    return store;
  });
  if (!removed) return res.status(404).json({ error: 'Registration not found' });
  return res.json({ ok: true });
});

router.get('/admin/tickets', requireAdmin, (_req, res) => {
  res.json({ tickets: readStore().tickets });
});

router.patch('/admin/tickets/:id', requireAdmin, (req, res) => {
  let updated: any = null;
  updateStore((store) => {
    const idx = store.tickets.findIndex((t: any) => t.id === req.params.id);
    if (idx === -1) return store;
    store.tickets[idx] = { ...store.tickets[idx], ...req.body, id: req.params.id };
    updated = store.tickets[idx];
    return store;
  });
  if (!updated) return res.status(404).json({ error: 'Ticket not found' });
  return res.json({ ticket: updated });
});

router.delete('/admin/tickets/:id', requireAdmin, (req, res) => {
  let removed = false;
  updateStore((store) => {
    const before = store.tickets.length;
    store.tickets = store.tickets.filter((t: any) => t.id !== req.params.id);
    removed = store.tickets.length < before;
    return store;
  });
  if (!removed) return res.status(404).json({ error: 'Ticket not found' });
  return res.json({ ok: true });
});

export default router;
