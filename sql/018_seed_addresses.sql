-- Update demo restaurant with address
UPDATE public.restaurants
SET address = '서울시 강남구 역삼동 123-45'
WHERE slug = 'demo' AND address IS NULL;

-- Add a few more sample restaurants with different addresses
INSERT INTO public.restaurants (name, slug, address)
VALUES
  ('강남점', 'gangnam', '서울시 강남구 강남대로 456'),
  ('홍대점', 'hongdae', '서울시 마포구 홍대입구 789'),
  ('신촌점', 'sinchon', '서울시 서대문구 신촌역 101'),
  ('종로점', 'jongno', '서울시 종로구 종로1가 202')
ON CONFLICT (slug) DO NOTHING;