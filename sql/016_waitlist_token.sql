-- Add waitlist_token to restaurants for securing waitlist QR
alter table if exists public.restaurants
  add column if not exists waitlist_token text unique;

-- Backfill for existing rows
update public.restaurants
set waitlist_token = gen_random_uuid()::text
where waitlist_token is null;
