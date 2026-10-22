-- Backup do esquema implantado no projeto EmbeeTech.
create table if not exists public.embee_browser_sync (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 1048576),
  revision bigint not null default 1 check (revision > 0),
  updated_at timestamptz not null default now()
);
alter table public.embee_browser_sync enable row level security;
revoke all on public.embee_browser_sync from anon;
grant select, insert, update, delete on public.embee_browser_sync to authenticated;
create policy "embee_read_own" on public.embee_browser_sync for select to authenticated using ((select auth.uid()) = user_id);
create policy "embee_insert_own" on public.embee_browser_sync for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "embee_update_own" on public.embee_browser_sync for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "embee_delete_own" on public.embee_browser_sync for delete to authenticated using ((select auth.uid()) = user_id);
