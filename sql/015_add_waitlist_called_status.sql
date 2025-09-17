-- Add 'called' status to waitlist status check constraint

DO $$
BEGIN
  -- Drop the existing check constraint
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'waitlist_status_check'
  ) THEN
    ALTER TABLE public.waitlist DROP CONSTRAINT waitlist_status_check;
  END IF;

  -- Add the new check constraint with 'called' included
  ALTER TABLE public.waitlist
    ADD CONSTRAINT waitlist_status_check
    CHECK (status IN ('waiting','called','seated','cancelled','no_show','completed'));
END $$;