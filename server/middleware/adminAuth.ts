import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

type AdminUser = { id: string; email: string; display_name?: string };

type Session = {
  expiresAt: number;
  admin: AdminUser;
};

const tokens = new Map<string, Session>();
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSupabaseConfig() {
  return {
    url: (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, ''),
    anonKey: (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim(),
  };
}

function parseRpcResult(raw: unknown) {
  let data: any = raw;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return null;
    }
  }
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return null;
    }
  }
  return data;
}

/** Verify email/password against public.admin_users via admin_login RPC */
async function verifyWithSupabase(email: string, password: string): Promise<AdminUser> {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    throw new Error('Supabase is not configured on the server');
  }

  const res = await fetch(`${url}/rest/v1/rpc/admin_login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({
      p_email: email,
      p_password: password,
    }),
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = parseRpcResult(JSON.parse(text));
  } catch {
    data = parseRpcResult(text);
  }

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Supabase login failed (${res.status})`);
  }
  if (!data?.ok || !data?.admin?.id) {
    throw new Error(data?.error || 'Invalid password');
  }

  return {
    id: String(data.admin.id),
    email: String(data.admin.email || email),
    display_name: data.admin.display_name ? String(data.admin.display_name) : undefined,
  };
}

function issueToken(admin: AdminUser) {
  const token = crypto.randomBytes(32).toString('hex');
  tokens.set(token, {
    expiresAt: Date.now() + TOKEN_TTL_MS,
    admin,
  });
  return token;
}

/** Login against Supabase admin_users table */
export async function loginAdmin(email: string, password: string) {
  if (!email?.trim() || !password) {
    return { ok: false as const, error: 'Email and password are required' };
  }

  try {
    const admin = await verifyWithSupabase(email.trim(), password);
    return { ok: true as const, token: issueToken(admin), admin };
  } catch (err: any) {
    console.error('[Admin] Supabase admin_users login failed:', err?.message || err);
    return { ok: false as const, error: err?.message || 'Invalid password' };
  }
}

export function logoutAdmin(token: string | undefined) {
  if (token) tokens.delete(token);
}

export function getSession(token: string | undefined): Session | null {
  if (!token) return null;
  const session = tokens.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    tokens.delete(token);
    return null;
  }
  return session;
}

export function isValidToken(token: string | undefined) {
  return Boolean(getSession(token));
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const session = getSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized. Please log in through the admin login page.' });
  }
  (req as any).admin = session.admin;
  return next();
}
