-- Add table_count and default_table_capacity to restaurants
-- Safe to run multiple times; uses IF NOT EXISTS

alter table public.restaurants
  add column if not exists table_count integer default 0;

alter table public.restaurants
  add column if not exists default_table_capacity integer default 4;

-- Optionally, ensure no nulls (if you want NOT NULL in future migrations):
-- update public.restaurants set table_count = 0 where table_count is null;
-- update public.restaurants set default_table_capacity = 4 where default_table_capacity is null;
