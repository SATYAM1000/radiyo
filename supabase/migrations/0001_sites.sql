-- Core tables: sites, reserved_slugs, site_stats
create extension if not exists citext;

create table public.reserved_slugs (
  slug citext primary key
);

create table public.sites (
  id               uuid primary key default gen_random_uuid(),
  owner_id         uuid not null references auth.users(id) on delete cascade,
  slug             citext not null unique,
  name             text not null default 'My Vibe Radio',
  draft_config     jsonb not null,
  published_config jsonb,
  is_published     boolean not null default false,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint slug_format check (slug ~ '^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$'),
  constraint slug_min_length check (char_length(slug) >= 3)
);

create index sites_owner_idx on public.sites(owner_id);

create table public.site_stats (
  site_id     uuid primary key references public.sites(id) on delete cascade,
  visit_count bigint not null default 0
);

-- Reserved slugs cannot be a CHECK constraint (no subqueries allowed) — use a trigger.
create or replace function public.check_slug_not_reserved()
returns trigger language plpgsql as $$
begin
  if exists (select 1 from public.reserved_slugs where slug = new.slug) then
    raise exception 'slug_reserved';
  end if;
  return new;
end $$;

create trigger sites_reserved_slug
  before insert or update of slug on public.sites
  for each row execute function public.check_slug_not_reserved();

-- Every site gets a stats row.
create or replace function public.create_site_stats()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into site_stats (site_id) values (new.id);
  return new;
end $$;

create trigger sites_create_stats
  after insert on public.sites
  for each row execute function public.create_site_stats();

-- Keep updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger sites_touch_updated_at
  before update on public.sites
  for each row execute function public.touch_updated_at();
