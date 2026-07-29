-- TVA Admin credentials table
-- Run this in Supabase → SQL Editor → New query → Run

-- On Supabase, pgcrypto lives in the `extensions` schema
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  display_name text,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_users_email_format check (position('@' in email) > 1)
);

comment on table public.admin_users is 'Admin panel login credentials (password stored as bcrypt hash)';
comment on column public.admin_users.password_hash is 'bcrypt hash via pgcrypto crypt() — never store plaintext';

create index if not exists admin_users_email_idx on public.admin_users (email);
create index if not exists admin_users_active_idx on public.admin_users (is_active);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admin_users_set_updated_at on public.admin_users;
create trigger admin_users_set_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

-- Secure login RPC (runs with definer rights; clients never read password_hash)
create or replace function public.admin_login(p_email text, p_password text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_admin public.admin_users%rowtype;
begin
  if p_email is null or length(trim(p_email)) = 0 then
    return json_build_object('ok', false, 'error', 'Email is required');
  end if;

  if p_password is null or length(p_password) = 0 then
    return json_build_object('ok', false, 'error', 'Password is required');
  end if;

  select *
  into v_admin
  from public.admin_users
  where lower(email) = lower(trim(p_email))
    and is_active = true
  limit 1;

  if not found then
    return json_build_object('ok', false, 'error', 'Invalid email or password');
  end if;

  if v_admin.password_hash <> extensions.crypt(p_password, v_admin.password_hash) then
    return json_build_object('ok', false, 'error', 'Invalid email or password');
  end if;

  update public.admin_users
  set last_login_at = now()
  where id = v_admin.id;

  return json_build_object(
    'ok', true,
    'admin', json_build_object(
      'id', v_admin.id,
      'email', v_admin.email,
      'display_name', coalesce(v_admin.display_name, split_part(v_admin.email, '@', 1))
    )
  );
end;
$$;

revoke all on function public.admin_login(text, text) from public;
grant execute on function public.admin_login(text, text) to anon, authenticated;

-- Helper to create / rotate an admin password (call from SQL editor only)
create or replace function public.admin_set_password(p_email text, p_password text, p_display_name text default null)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_id uuid;
begin
  if p_password is null or length(p_password) < 8 then
    return json_build_object('ok', false, 'error', 'Password must be at least 8 characters');
  end if;

  insert into public.admin_users (email, password_hash, display_name)
  values (
    lower(trim(p_email)),
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    p_display_name
  )
  on conflict (email) do update
    set password_hash = excluded.password_hash,
        display_name = coalesce(excluded.display_name, public.admin_users.display_name),
        is_active = true,
        updated_at = now()
  returning id into v_id;

  return json_build_object('ok', true, 'id', v_id, 'email', lower(trim(p_email)));
end;
$$;

revoke all on function public.admin_set_password(text, text, text) from public;
-- Keep password-setting callable only by service role / SQL editor (not anon)
grant execute on function public.admin_set_password(text, text, text) to service_role;
-- Also allow running from SQL Editor (postgres role already can)

-- Row Level Security: block direct table reads/writes from anon clients
alter table public.admin_users enable row level security;

drop policy if exists "No direct anon access to admin_users" on public.admin_users;
-- No policies for anon/authenticated => default deny for direct SELECT/INSERT/UPDATE/DELETE
-- Login goes through admin_login() only

-- Seed default admin
-- Email: admintvaofficial@tva.com
-- Password: Tvaadmin@#2026
select public.admin_set_password('admintvaofficial@tva.com', 'Tvaadmin@#2026', 'TVA Admin');
