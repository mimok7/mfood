-- Add table_id to waitlist table for tracking assigned tables
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS table_id uuid REFERENCES public.tables(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_table_id ON public.waitlist(table_id);

-- Update RLS policy to allow table_id updates
DROP POLICY IF EXISTS "manage waitlist by managers" ON public.waitlist;
CREATE POLICY "manage waitlist by managers" ON public.waitlist FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profile up
    WHERE up.id = auth.uid() AND up.role IN ('manager','admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profile up
    WHERE up.id = auth.uid() AND up.role IN ('manager','admin')
  )
);