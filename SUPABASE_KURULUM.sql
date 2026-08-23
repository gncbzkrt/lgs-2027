-- LGS 2027 v2.2 Veli-Öğrenci Bulut Senkronizasyonu
-- Supabase > SQL Editor > New query alanına TAMAMINI yapıştırıp Run çalıştırın.
-- Güvenlik: tüm tablolar RLS ile korunur. PWA'da sadece publishable key kullanılır.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  family_name text not null default 'Ailem',
  student_name text not null default 'Öğrenci',
  created_at timestamptz not null default now()
);

create table if not exists public.family_members (
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'student' check (role='student'),
  created_at timestamptz not null default now(),
  primary key (family_id,user_id)
);

create table if not exists public.pairing_codes (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  code_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists pairing_codes_hash_idx on public.pairing_codes(code_hash);

create table if not exists public.student_snapshots (
  family_id uuid not null references public.families(id) on delete cascade,
  student_user_id uuid not null unique references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (family_id,student_user_id)
);

alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.pairing_codes enable row level security;
alter table public.student_snapshots enable row level security;

revoke all on public.families, public.family_members, public.pairing_codes, public.student_snapshots from anon, authenticated;
grant select on public.families, public.family_members, public.student_snapshots to authenticated;
grant insert, update on public.student_snapshots to authenticated;

-- Aile bilgisi: yalnız veli veya o aileye eşlenmiş öğrenci görebilir.
drop policy if exists families_select on public.families;
create policy families_select on public.families for select to authenticated
using (
  owner_id = (select auth.uid())
  or exists(select 1 from public.family_members fm where fm.family_id=id and fm.user_id=(select auth.uid()))
);

-- Üyelik: öğrenci kendi üyeliğini; veli kendi ailesinin üyeliklerini görebilir.
drop policy if exists family_members_select on public.family_members;
create policy family_members_select on public.family_members for select to authenticated
using (
  user_id=(select auth.uid())
  or exists(select 1 from public.families f where f.id=family_id and f.owner_id=(select auth.uid()))
);

-- Snapshot: öğrenci yalnız kendisininkini; veli yalnız kendi ailesindekileri okuyabilir.
drop policy if exists snapshots_select on public.student_snapshots;
create policy snapshots_select on public.student_snapshots for select to authenticated
using (
  student_user_id=(select auth.uid())
  or exists(select 1 from public.families f where f.id=family_id and f.owner_id=(select auth.uid()))
);

drop policy if exists snapshots_insert on public.student_snapshots;
create policy snapshots_insert on public.student_snapshots for insert to authenticated
with check (
  student_user_id=(select auth.uid())
  and exists(select 1 from public.family_members fm where fm.family_id=student_snapshots.family_id and fm.user_id=(select auth.uid()))
);

drop policy if exists snapshots_update on public.student_snapshots;
create policy snapshots_update on public.student_snapshots for update to authenticated
using (student_user_id=(select auth.uid()))
with check (
  student_user_id=(select auth.uid())
  and exists(select 1 from public.family_members fm where fm.family_id=student_snapshots.family_id and fm.user_id=(select auth.uid()))
);

-- Veli aileyi oluşturur/günceller. Anonim öğrenci bu fonksiyonu kullanamaz.
create or replace function public.create_family(p_family_name text, p_student_name text)
returns table(id uuid, family_name text, student_name text)
language plpgsql security definer set search_path=public,auth
as $$
declare v_uid uuid := auth.uid(); v_id uuid;
begin
  if v_uid is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then raise exception 'Veli hesabı gerekli'; end if;
  insert into public.families(owner_id,family_name,student_name)
  values(v_uid,coalesce(nullif(trim(p_family_name),''),'Ailem'),coalesce(nullif(trim(p_student_name),''),'Öğrenci'))
  on conflict(owner_id) do update set family_name=excluded.family_name, student_name=excluded.student_name
  returning families.id into v_id;
  return query select f.id,f.family_name,f.student_name from public.families f where f.id=v_id;
end $$;

-- Veli 15 dakika geçerli, tek kullanımlık 8 haneli kod üretir.
create or replace function public.create_pairing_code()
returns table(code text, expires_at timestamptz)
language plpgsql security definer set search_path=public,auth,extensions
as $$
declare v_uid uuid := auth.uid(); v_family uuid; v_code text; v_exp timestamptz := now()+interval '15 minutes';
begin
  if v_uid is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then raise exception 'Veli hesabı gerekli'; end if;
  select f.id into v_family from public.families f where f.owner_id=v_uid;
  if v_family is null then raise exception 'Önce aile profili oluşturun'; end if;
  update public.pairing_codes set used_at=now() where family_id=v_family and used_at is null;
  v_code := lpad(floor(random()*100000000)::bigint::text,8,'0');
  insert into public.pairing_codes(family_id,code_hash,expires_at)
  values(v_family,encode(extensions.digest(v_code,'sha256'),'hex'),v_exp);
  return query select v_code,v_exp;
end $$;

-- Öğrenci kendi anonim oturumuyla tek kullanımlık kodu talep eder. Veli şifresi öğrenciye hiç gitmez.
create or replace function public.claim_pairing_code(p_code text)
returns table(family_id uuid)
language plpgsql security definer set search_path=public,auth,extensions
as $$
declare v_uid uuid := auth.uid(); v_pair public.pairing_codes%rowtype;
begin
  if v_uid is null then raise exception 'Öğrenci oturumu gerekli'; end if;
  if not coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then raise exception 'Bu işlem öğrenci cihazı içindir'; end if;
  select * into v_pair from public.pairing_codes pc
   where pc.code_hash=encode(extensions.digest(trim(p_code),'sha256'),'hex')
     and pc.used_at is null and pc.expires_at>now()
   order by pc.created_at desc limit 1 for update;
  if v_pair.id is null then raise exception 'Kod geçersiz veya süresi dolmuş'; end if;
  insert into public.family_members(family_id,user_id,role) values(v_pair.family_id,v_uid,'student')
  on conflict(user_id) do update set family_id=excluded.family_id, role='student', created_at=now();
  update public.pairing_codes set used_at=now() where id=v_pair.id;
  return query select v_pair.family_id;
end $$;

grant execute on function public.create_family(text,text) to authenticated;
grant execute on function public.create_pairing_code() to authenticated;
grant execute on function public.claim_pairing_code(text) to authenticated;
