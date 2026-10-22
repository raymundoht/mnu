-- Public images used by proposal pages. Upload and management are restricted
-- to active administrators; published proposal pages can display the images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'proposal-assets',
  'proposal-assets',
  true,
  8388608,
  array['image/png', 'image/jpeg', 'image/webp']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view proposal assets" on storage.objects;
create policy "Public can view proposal assets"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'proposal-assets');

drop policy if exists "Active admins can upload proposal assets" on storage.objects;
create policy "Active admins can upload proposal assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'proposal-assets'
  and exists (
    select 1 from public.admin_profiles
    where id = auth.uid() and active is true
  )
);

drop policy if exists "Active admins can update proposal assets" on storage.objects;
create policy "Active admins can update proposal assets"
on storage.objects for update
to authenticated
using (
  bucket_id = 'proposal-assets'
  and exists (
    select 1 from public.admin_profiles
    where id = auth.uid() and active is true
  )
)
with check (
  bucket_id = 'proposal-assets'
  and exists (
    select 1 from public.admin_profiles
    where id = auth.uid() and active is true
  )
);

drop policy if exists "Active admins can delete proposal assets" on storage.objects;
create policy "Active admins can delete proposal assets"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'proposal-assets'
  and exists (
    select 1 from public.admin_profiles
    where id = auth.uid() and active is true
  )
);
