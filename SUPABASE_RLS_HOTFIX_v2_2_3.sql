-- LGS 2027 v2.2.3 - mevcut Supabase projesi için RLS sonsuz döngü düzeltmesi
-- Supabase > SQL Editor > New query > TAMAMINI yapıştır > Run

create or replace function public.is_family_owner(p_family_id uuid)
returns boolean
language sql stable security definer set search_path=public,auth
as $$
  select exists(
    select 1 from public.families f
    where f.id=p_family_id and f.owner_id=auth.uid()
  );
$$;

create or replace function public.is_family_member(p_family_id uuid)
returns boolean
language sql stable security definer set search_path=public,auth
as $$
  select exists(
    select 1 from public.family_members fm
    where fm.family_id=p_family_id and fm.user_id=auth.uid()
  );
$$;

revoke all on function public.is_family_owner(uuid) from public;
revoke all on function public.is_family_member(uuid) from public;
grant execute on function public.is_family_owner(uuid) to authenticated;
grant execute on function public.is_family_member(uuid) to authenticated;

drop policy if exists families_select on public.families;
create policy families_select on public.families for select to authenticated
using (owner_id=(select auth.uid()) or public.is_family_member(id));

drop policy if exists family_members_select on public.family_members;
create policy family_members_select on public.family_members for select to authenticated
using (user_id=(select auth.uid()) or public.is_family_owner(family_id));

drop policy if exists snapshots_select on public.student_snapshots;
create policy snapshots_select on public.student_snapshots for select to authenticated
using (student_user_id=(select auth.uid()) or public.is_family_owner(family_id));

drop policy if exists snapshots_insert on public.student_snapshots;
create policy snapshots_insert on public.student_snapshots for insert to authenticated
with check (student_user_id=(select auth.uid()) and public.is_family_member(family_id));

drop policy if exists snapshots_update on public.student_snapshots;
create policy snapshots_update on public.student_snapshots for update to authenticated
using (student_user_id=(select auth.uid()))
with check (student_user_id=(select auth.uid()) and public.is_family_member(family_id));
