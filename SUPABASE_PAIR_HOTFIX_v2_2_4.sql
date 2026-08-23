-- LGS 2027 v2.2.4 - öğrenci eşleştirme + ilk senkronu TEK işlemde yapar.
-- Mevcut tabloları/verileri silmez.
-- Supabase > SQL Editor > New query > tamamını yapıştır > Run

create or replace function public.claim_pairing_code_and_sync(p_code text, p_state jsonb)
returns table(family_id uuid)
language plpgsql
security definer
set search_path=public,auth,extensions
as $$
declare
  v_uid uuid := auth.uid();
  v_pair public.pairing_codes%rowtype;
begin
  if v_uid is null then
    raise exception 'Öğrenci oturumu gerekli';
  end if;

  if not coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then
    raise exception 'Bu işlem öğrenci cihazı içindir';
  end if;

  if trim(coalesce(p_code,'')) !~ '^[0-9]{8}$' then
    raise exception 'Eşleştirme kodu 8 haneli olmalı';
  end if;

  select * into v_pair
  from public.pairing_codes pc
  where pc.code_hash=encode(extensions.digest(trim(p_code),'sha256'),'hex')
    and pc.used_at is null
    and pc.expires_at>now()
  order by pc.created_at desc
  limit 1
  for update;

  if v_pair.id is null then
    raise exception 'Kod geçersiz veya süresi dolmuş';
  end if;

  insert into public.family_members(family_id,user_id,role)
  values(v_pair.family_id,v_uid,'student')
  on conflict(user_id) do update
    set family_id=excluded.family_id, role='student', created_at=now();

  insert into public.student_snapshots(family_id,student_user_id,state,updated_at)
  values(v_pair.family_id,v_uid,coalesce(p_state,'{}'::jsonb),now())
  on conflict(student_user_id) do update
    set family_id=excluded.family_id,
        state=excluded.state,
        updated_at=now();

  update public.pairing_codes set used_at=now() where id=v_pair.id;

  return query select v_pair.family_id;
end $$;

revoke all on function public.claim_pairing_code_and_sync(text,jsonb) from public;
grant execute on function public.claim_pairing_code_and_sync(text,jsonb) to authenticated;
