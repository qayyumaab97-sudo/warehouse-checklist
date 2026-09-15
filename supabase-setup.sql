-- ============================================================
-- Daily Warehouse Checklist - Supabase setup
-- ReLive Pharmacy & Medtech
--
-- Where to run this:
--   Supabase dashboard -> SQL Editor -> New query -> paste -> Run
--
-- Safe to run more than once.
-- ============================================================


-- 1. One row per person per day -----------------------------

create table if not exists entries (
  id         text primary key,          -- "2026-09-15__aisar"
  person     text not null,             -- aisar | azmi | idham | erfa
  date       date not null,
  nums       jsonb not null default '{}'::jsonb,   -- counts
  checks     jsonb not null default '{}'::jsonb,   -- routine tasks ticked
  issues     jsonb not null default '{}'::jsonb,   -- problem types ticked
  texts      jsonb not null default '{}'::jsonb,   -- problem details, ad-hoc
  stock      jsonb not null default '{}'::jsonb,   -- consumable balances
  updated_at timestamptz not null default now()
);

create index if not exists entries_date_idx   on entries (date);
create index if not exists entries_person_idx on entries (person);


-- 2. Shared settings (reorder levels) -----------------------

create table if not exists settings (
  key   text primary key,               -- "reorder"
  value jsonb not null default '{}'::jsonb
);


-- 3. Access ------------------------------------------------
-- Anyone holding the page link can read and write, with no login.
-- This is the same openness as a Google Form: the link IS the key.
-- Do not put anything confidential in this checklist, and do not
-- post the link anywhere public.

alter table entries  enable row level security;
alter table settings enable row level security;

drop policy if exists "anon read entries"   on entries;
drop policy if exists "anon insert entries" on entries;
drop policy if exists "anon update entries" on entries;

create policy "anon read entries"   on entries for select to anon using (true);
create policy "anon insert entries" on entries for insert to anon with check (true);
create policy "anon update entries" on entries for update to anon using (true) with check (true);

drop policy if exists "anon read settings"   on settings;
drop policy if exists "anon insert settings" on settings;
drop policy if exists "anon update settings" on settings;

create policy "anon read settings"   on settings for select to anon using (true);
create policy "anon insert settings" on settings for insert to anon with check (true);
create policy "anon update settings" on settings for update to anon using (true) with check (true);


-- 4. Check it worked ---------------------------------------
-- Should return two rows: entries, settings

select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('entries','settings');
