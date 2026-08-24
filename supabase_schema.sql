-- =============================================================
-- PharmaAI — Supabase Database Schema & RLS Security Policies
-- =============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── 1. PROFILES TABLE ─────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  email text not null,
  role text default 'patient' check (role in ('patient', 'student', 'pharmacy_student')),
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Trigger to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'patient')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. MEDICINES TABLE ────────────────────────────────────────
create table if not exists public.medicines (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  generic_name text,
  brand_name text,
  manufacturer text,
  active_ingredient text,
  strength text,
  dosage_form text,
  dosage_instructions text,
  frequency text,
  next_dose text,
  reminder_enabled boolean default true,
  icon text default '💊',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.medicines enable row level security;

create policy "Users can read own medicines" on public.medicines
  for select using (auth.uid() = user_id);

create policy "Users can insert own medicines" on public.medicines
  for insert with check (auth.uid() = user_id);

create policy "Users can update own medicines" on public.medicines
  for update using (auth.uid() = user_id);

create policy "Users can delete own medicines" on public.medicines
  for delete using (auth.uid() = user_id);

-- ── 3. REMINDERS TABLE ────────────────────────────────────────
create table if not exists public.reminders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  medicine_id uuid references public.medicines(id) on delete cascade,
  medicine text not null,
  dosage text not null,
  time text not null,
  status text default 'pending' check (status in ('pending', 'taken', 'skipped', 'snoozed')),
  enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reminders enable row level security;

create policy "Users can read own reminders" on public.reminders
  for select using (auth.uid() = user_id);

create policy "Users can insert own reminders" on public.reminders
  for insert with check (auth.uid() = user_id);

create policy "Users can update own reminders" on public.reminders
  for update using (auth.uid() = user_id);

create policy "Users can delete own reminders" on public.reminders
  for delete using (auth.uid() = user_id);

-- ── 4. ADHERENCE LOGS TABLE ───────────────────────────────────
create table if not exists public.adherence_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  reminder_id uuid references public.reminders(id) on delete cascade,
  medicine text not null,
  status text not null check (status in ('taken', 'skipped', 'snoozed')),
  logged_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.adherence_logs enable row level security;

create policy "Users can read own adherence" on public.adherence_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert own adherence" on public.adherence_logs
  for insert with check (auth.uid() = user_id);

-- ── 5. FCM TOKENS TABLE ───────────────────────────────────────
create table if not exists public.fcm_tokens (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  token text not null unique,
  device_info text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.fcm_tokens enable row level security;

create policy "Users can manage own FCM tokens" on public.fcm_tokens
  for all using (auth.uid() = user_id);

-- ── 6. PRESCRIPTIONS TABLE ───────────────────────────────────
create table if not exists public.prescriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  image_url text,
  raw_ocr_text text,
  extracted_medicines jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.prescriptions enable row level security;

create policy "Users can manage own prescriptions" on public.prescriptions
  for all using (auth.uid() = user_id);

-- ── 7. STORAGE BUCKETS & POLICIES ────────────────────────────
insert into storage.buckets (id, name, public)
values ('prescriptions', 'prescriptions', false), ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Users can upload prescription images" on storage.objects
  for insert with check (bucket_id = 'prescriptions' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view own prescription images" on storage.objects
  for select using (bucket_id = 'prescriptions' and auth.uid()::text = (storage.foldername(name))[1]);
