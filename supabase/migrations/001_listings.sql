-- Run once in Supabase → SQL Editor (or via `npm run db:setup` with SUPABASE_DB_URL)

create table if not exists public.listings (
  id text primary key,
  type text not null default 'sale',
  title text not null,
  suburb text not null,
  price text not null,
  beds integer not null,
  baths integer not null,
  parking integer not null,
  description text not null,
  images jsonb not null default '[]'::jsonb,
  status text not null check (status in ('available', 'sold', 'pending')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_created_at_idx
  on public.listings (created_at desc);

create index if not exists listings_featured_idx
  on public.listings (featured);

create index if not exists listings_status_idx
  on public.listings (status);

alter table public.listings enable row level security;

drop policy if exists "Public read listings" on public.listings;
create policy "Public read listings"
  on public.listings
  for select
  using (true);

-- Writes use the service role key from server routes (bypasses RLS).

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read property images" on storage.objects;
create policy "Public read property images"
  on storage.objects
  for select
  using (bucket_id = 'property-images');
