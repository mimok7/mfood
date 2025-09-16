-- Add email and full_name columns to user_profile table
ALTER TABLE public.user_profile
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS full_name text;

-- Update existing records to populate email from auth.users if needed
-- Note: This requires a join with auth.users, but since auth.users is not directly queryable,
-- you may need to update this manually or through application logic