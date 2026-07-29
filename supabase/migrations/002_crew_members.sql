-- TVA Family / Crew members
-- Run in Supabase → SQL Editor

create table if not exists public.crew_members (
  id uuid primary key default gen_random_uuid(),
  initial text not null default '',
  name text not null,
  role text not null default 'Member',
  image text,
  instagram text,
  youtube text,
  kick text,
  discord text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crew_members_name_len check (char_length(trim(name)) > 0)
);

comment on table public.crew_members is 'TVA family / crew members shown on the public Crew page';

create index if not exists crew_members_sort_idx on public.crew_members (sort_order, name);
create index if not exists crew_members_active_idx on public.crew_members (is_active);

drop trigger if exists crew_members_set_updated_at on public.crew_members;
create trigger crew_members_set_updated_at
before update on public.crew_members
for each row execute function public.set_updated_at();

alter table public.crew_members enable row level security;

drop policy if exists "Public read crew members" on public.crew_members;
create policy "Public read crew members"
  on public.crew_members for select
  to anon, authenticated
  using (true);

-- Writes go through the Express admin API (anon key). Tighten later with service role if needed.
drop policy if exists "Anon insert crew members" on public.crew_members;
create policy "Anon insert crew members"
  on public.crew_members for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Anon update crew members" on public.crew_members;
create policy "Anon update crew members"
  on public.crew_members for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Anon delete crew members" on public.crew_members;
create policy "Anon delete crew members"
  on public.crew_members for delete
  to anon, authenticated
  using (true);

grant select, insert, update, delete on public.crew_members to anon, authenticated;

-- Seed from current site data (skip if already seeded)
insert into public.crew_members (initial, name, role, image, instagram, sort_order)
select * from (values
  ('E', 'Eagle Gaming (Dilin Dineshan)', 'Founder, Leader', '/images/eagle_gaming.jpg', 'https://www.instagram.com/eagle.gamingop', 1),
  ('B', 'Blind joker (Sharathettan)', 'God Father', '/images/blind_joker.jpg', 'https://www.instagram.com/blindjok3r', 2),
  ('C', 'Chandra Boss', 'Co-Leader', '/images/chandra_boss.jpg', 'https://www.instagram.com/dreamerop', 3),
  ('A', 'Ap Pappan', 'Co-Leader', '/images/ap_pappan.jpg', 'https://www.instagram.com/ig_bravoo', 4),
  ('M', 'Madara Uchiha', 'Member', '/images/madara_uchiha.jpg', 'https://www.instagram.com/ig.rhaegar', 5),
  ('B', 'Babu Namboothiri', 'Undeclared Co leader', '/images/babu_namboothiri.jpg', 'https://www.instagram.com/le_njn_ajmal', 6),
  ('S', 'Snipe', 'Member', '/images/snipe.jpg', 'https://www.instagram.com/the__snipe', 7),
  ('J', 'Juggru', 'Member', '/images/juggru.jpg', 'https://www.instagram.com/juggru.yt', 8),
  ('N', 'Neelan', 'Member', '/images/neelan.jpg', 'https://www.instagram.com/hari.the.beast', 9),
  ('K', 'Kuruppu', 'Member', null, null, 10),
  ('D', 'Demon', 'Member', '/images/demon.jpg', 'https://www.instagram.com/its.demon._', 11),
  ('M', 'Messboi Goku', 'Member', '/images/messboi_goku.jpg', 'https://www.instagram.com/messboi_gokuo7', 12),
  ('B', 'Balan K Nair', 'Member', '/images/balan_k_nair.jpg', 'https://www.instagram.com/ig_mallu.viner', 13),
  ('S', 'Savage', 'Member', '/images/savage.jpg', 'https://www.instagram.com/s1vage_op', 14),
  ('M', 'Maddy Kindi', 'Member', '/images/maddy_kindi.jpg', 'https://www.instagram.com/maddykindi', 15),
  ('M', 'Moby', 'Member', '/images/moby.jpg', 'https://www.instagram.com/moby.xd', 16),
  ('A', 'Ash', 'Member', '/images/ash.jpg', 'https://www.instagram.com/ash_brutal', 17),
  ('B', 'Barathan', 'Member', null, null, 18),
  ('L', 'Lex', 'Member', '/images/lex.jpg', 'https://www.instagram.com/lx2_pc', 19),
  ('J', 'Jude', 'Member', null, null, 20),
  ('V', 'Villu', 'Member', null, null, 21),
  ('B', 'Boboy', 'Member', null, null, 22),
  ('K', 'Kannapi', 'Member', null, null, 23),
  ('S', 'Srk', 'Member', null, null, 24),
  ('C', 'Coach', 'Member', null, null, 25),
  ('L', 'Lolan', 'Member', null, null, 26),
  ('A', 'Appukuttan', 'Member', null, null, 27),
  ('Z', 'Zekkan', 'Member', null, null, 28),
  ('A', 'Amabathoor', 'Member', null, null, 29),
  ('A', 'Abel Joseph', 'Member', null, null, 30),
  ('K', 'Kevin', 'Inactive', null, null, 31),
  ('N', 'Neegan', 'Member', null, null, 32),
  ('S', 'Steve', 'Member', null, null, 33),
  ('D', 'Destro', 'Member', null, null, 34),
  ('K', 'Keerikkadan', 'Member', null, null, 35),
  ('M', 'Muchiri', 'Member', null, null, 36),
  ('R', 'Rayan', 'Member', null, null, 37),
  ('I', 'Ittachi', 'Member', null, null, 38),
  ('N', 'Neel', 'Member', null, null, 39),
  ('M', 'Miles', 'Member', null, null, 40),
  ('Z', 'Zakir', 'Member', null, null, 41)
) as v(initial, name, role, image, instagram, sort_order)
where not exists (select 1 from public.crew_members limit 1);
