import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type CrewMember = {
  id?: string;
  initial: string;
  name: string;
  role: string;
  image?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  kick?: string | null;
  discord?: string | null;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

function getClient(): SupabaseClient {
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ''
  ).trim();
  if (!url || !key) {
    throw new Error('Supabase is not configured for crew members');
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function normalize(row: any): CrewMember {
  return {
    id: row.id,
    initial: row.initial || (row.name ? String(row.name).charAt(0).toUpperCase() : '?'),
    name: row.name,
    role: row.role || 'Member',
    image: row.image || null,
    instagram: row.instagram || null,
    youtube: row.youtube || null,
    kick: row.kick || null,
    discord: row.discord || null,
    sort_order: Number(row.sort_order) || 0,
    is_active: row.is_active !== false,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function sanitizeInput(body: any, { partial = false } = {}): Partial<CrewMember> {
  const out: Partial<CrewMember> = {};
  if (!partial || body.name !== undefined) out.name = String(body.name || '').trim();
  if (!partial || body.role !== undefined) out.role = String(body.role || 'Member').trim() || 'Member';
  if (!partial || body.initial !== undefined) {
    const initial = String(body.initial || '').trim();
    out.initial = initial || (out.name ? out.name.charAt(0).toUpperCase() : '?');
  }
  if (!partial || body.image !== undefined) out.image = body.image ? String(body.image).trim() : null;
  if (!partial || body.instagram !== undefined) out.instagram = body.instagram ? String(body.instagram).trim() : null;
  if (!partial || body.youtube !== undefined) out.youtube = body.youtube ? String(body.youtube).trim() : null;
  if (!partial || body.kick !== undefined) out.kick = body.kick ? String(body.kick).trim() : null;
  if (!partial || body.discord !== undefined) out.discord = body.discord ? String(body.discord).trim() : null;
  if (!partial || body.sort_order !== undefined) out.sort_order = Number(body.sort_order) || 0;
  if (!partial || body.is_active !== undefined) out.is_active = body.is_active !== false && body.is_active !== 'false';
  return out;
}

export async function listCrewMembers({ includeInactive = false } = {}) {
  const supabase = getClient();
  let query = supabase
    .from('crew_members')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []).map(normalize);
}

export async function createCrewMember(body: any) {
  const payload = sanitizeInput(body);
  if (!payload.name) throw new Error('Name is required');

  const supabase = getClient();
  if (payload.sort_order === undefined || payload.sort_order === 0) {
    const { count } = await supabase
      .from('crew_members')
      .select('*', { count: 'exact', head: true });
    payload.sort_order = (count || 0) + 1;
  }

  const { data, error } = await supabase
    .from('crew_members')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return normalize(data);
}

export async function updateCrewMember(id: string, body: any) {
  const payload = sanitizeInput(body, { partial: true });
  if (payload.name !== undefined && !payload.name) throw new Error('Name is required');

  const supabase = getClient();
  const { data, error } = await supabase
    .from('crew_members')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Member not found');
  return normalize(data);
}

export async function deleteCrewMember(id: string) {
  const supabase = getClient();
  const { error, count } = await supabase
    .from('crew_members')
    .delete({ count: 'exact' })
    .eq('id', id);

  if (error) throw new Error(error.message);
  if (!count) throw new Error('Member not found');
  return true;
}
