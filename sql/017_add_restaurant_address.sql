-- Add address column to restaurants table
ALTER TABLE public.restaurants
ADD COLUMN IF NOT EXISTS address text;