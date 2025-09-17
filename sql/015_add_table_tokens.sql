-- Add token field to existing demo table and create some sample tables with tokens
UPDATE public.tables 
SET token = gen_random_uuid()::text 
WHERE token IS NULL;

-- Create a few more sample tables with tokens for testing
INSERT INTO public.tables (restaurant_id, name, token, capacity)
SELECT 
  r.id, 
  'B-' || generate_series(1,3), 
  gen_random_uuid()::text,
  4
FROM public.restaurants r 
WHERE r.slug = 'demo'
ON CONFLICT DO NOTHING;