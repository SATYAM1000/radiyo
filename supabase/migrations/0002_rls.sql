-- Row Level Security.
-- Deliberately NO anon select policy on sites: RLS is row-level, not
-- column-level, so a `using (is_published)` policy would leak draft_config
-- and owner_id through the public REST API. Published pages are fetched
-- server-side with the service-role client instead.

alter table public.sites enable row level security;
alter table public.site_stats enable row level security;
alter table public.reserved_slugs enable row level security;

create policy "owner_select" on public.sites
  for select using (auth.uid() = owner_id);
create policy "owner_insert" on public.sites
  for insert with check (auth.uid() = owner_id);
create policy "owner_update" on public.sites
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner_delete" on public.sites
  for delete using (auth.uid() = owner_id);

create policy "reserved_read" on public.reserved_slugs
  for select using (true);

-- Counter is public to read; writes only via the increment_visits RPC.
create policy "stats_read" on public.site_stats
  for select using (true);
