-- Add image_url column to menu_items table
alter table public.menu_items
add column if not exists image_url text;

-- Add updated_at trigger for menu_items if not exists
create or replace trigger trg_menu_items_updated
before update on public.menu_items
for each row execute function public.set_updated_at();