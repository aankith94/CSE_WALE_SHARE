-- Run this once in Supabase: SQL Editor > New query > paste > Run.
-- Tables start EMPTY. No sample data.

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table public.exams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  subject_id uuid not null references public.subjects(id) on delete restrict,
  exam_id uuid references public.exams(id) on delete set null,
  pdf_path text not null,               -- file name inside the "notes" storage bucket
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.notes (subject_id);
create index on public.notes (exam_id);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.notes(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  author_name text not null default 'Student',
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (note_id, user_id)             -- one review per user per note
);

create table public.youtube_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_url text not null,
  note_id uuid references public.notes(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Create a users row whenever someone signs up
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, display_name)
  values (new.id, coalesce(nullif(new.raw_user_meta_data->>'name', ''), split_part(new.email, '@', 1)));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select coalesce((select is_admin from public.users where id = auth.uid()), false)
$$;

-- Row Level Security
alter table public.users enable row level security;
alter table public.subjects enable row level security;
alter table public.exams enable row level security;
alter table public.notes enable row level security;
alter table public.reviews enable row level security;
alter table public.youtube_videos enable row level security;

-- users: read own row (or all if admin). No update policy, so nobody can make themselves admin.
create policy "read own user" on public.users for select using (id = auth.uid() or public.is_admin());

-- content: everyone reads, only admin writes
create policy "public read" on public.subjects for select using (true);
create policy "admin write" on public.subjects for all using (public.is_admin()) with check (public.is_admin());
create policy "public read" on public.exams for select using (true);
create policy "admin write" on public.exams for all using (public.is_admin()) with check (public.is_admin());
create policy "public read" on public.notes for select using (true);
create policy "admin write" on public.notes for all using (public.is_admin()) with check (public.is_admin());
create policy "public read" on public.youtube_videos for select using (true);
create policy "admin write" on public.youtube_videos for all using (public.is_admin()) with check (public.is_admin());

-- reviews: everyone reads, logged-in users write their own, admin can delete any
create policy "public read" on public.reviews for select using (true);
create policy "insert own" on public.reviews for insert with check (user_id = auth.uid());
create policy "update own" on public.reviews for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "delete own or admin" on public.reviews for delete using (user_id = auth.uid() or public.is_admin());

-- PDF storage: public bucket (anyone can view/download), only admin can upload/change/delete
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('notes', 'notes', true, 52428800, array['application/pdf'])
on conflict (id) do nothing;

create policy "admin insert pdf" on storage.objects for insert with check (bucket_id = 'notes' and public.is_admin());
create policy "admin update pdf" on storage.objects for update using (bucket_id = 'notes' and public.is_admin());
create policy "admin delete pdf" on storage.objects for delete using (bucket_id = 'notes' and public.is_admin());

-- MAKE YOURSELF ADMIN: sign up on the site first, then run this with your email:
-- update public.users set is_admin = true where id = (select id from auth.users where email = 'you@example.com');
