-- Run once in the alikhanye-project Supabase SQL Editor.
-- Deploy does not apply this file. Writes use the service role (bypasses RLS).
-- The anon key can only select rows where published = true.

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  suburb text,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_client_name_not_blank check (char_length(btrim(client_name)) > 0),
  constraint reviews_comment_not_blank check (char_length(btrim(comment)) > 0)
);

create index if not exists reviews_published_order_idx
  on public.reviews (sort_order asc, created_at desc)
  where published = true;

alter table public.reviews enable row level security;

drop policy if exists "Public read published reviews" on public.reviews;
create policy "Public read published reviews"
  on public.reviews
  for select
  to anon, authenticated
  using (published = true);

grant select on public.reviews to anon, authenticated;
revoke insert, update, delete on public.reviews from anon, authenticated;

create or replace function public.set_reviews_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row
  execute function public.set_reviews_updated_at();
