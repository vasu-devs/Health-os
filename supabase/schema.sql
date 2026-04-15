-- Health OS schema
-- Run via Supabase SQL editor or `supabase db push`.
-- Every table is scoped to auth.uid() via RLS — no row is readable or writable
-- without an authenticated session owning that row.

-- =========================================================================
-- Enums
-- =========================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'meal_type') then
    create type public.meal_type as enum ('breakfast', 'lunch', 'dinner', 'snack');
  end if;
end $$;

-- =========================================================================
-- daily_metrics
-- One row per (user, day). Tracks weight, sleep, calories targets, and steps.
-- =========================================================================

create table if not exists public.daily_metrics (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  date              date not null default current_date,
  current_weight    numeric(5, 2),
  sleep_hours       numeric(4, 2),
  target_calories   integer,
  consumed_calories integer,
  total_steps       integer,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (user_id, date)
);

create index if not exists daily_metrics_user_date_idx
  on public.daily_metrics (user_id, date desc);

alter table public.daily_metrics enable row level security;

drop policy if exists "daily_metrics_select_own" on public.daily_metrics;
drop policy if exists "daily_metrics_insert_own" on public.daily_metrics;
drop policy if exists "daily_metrics_update_own" on public.daily_metrics;
drop policy if exists "daily_metrics_delete_own" on public.daily_metrics;

create policy "daily_metrics_select_own"
  on public.daily_metrics for select
  using (auth.uid() = user_id);

create policy "daily_metrics_insert_own"
  on public.daily_metrics for insert
  with check (auth.uid() = user_id);

create policy "daily_metrics_update_own"
  on public.daily_metrics for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "daily_metrics_delete_own"
  on public.daily_metrics for delete
  using (auth.uid() = user_id);

-- =========================================================================
-- workouts
-- A user's planned/completed exercise for a given day.
-- =========================================================================

create table if not exists public.workouts (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  date              date not null default current_date,
  exercise_name     text not null,
  sets              integer not null check (sets >= 0),
  reps              integer not null check (reps >= 0),
  completion_status boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists workouts_user_date_idx
  on public.workouts (user_id, date desc);

alter table public.workouts enable row level security;

drop policy if exists "workouts_select_own" on public.workouts;
drop policy if exists "workouts_insert_own" on public.workouts;
drop policy if exists "workouts_update_own" on public.workouts;
drop policy if exists "workouts_delete_own" on public.workouts;

create policy "workouts_select_own"
  on public.workouts for select
  using (auth.uid() = user_id);

create policy "workouts_insert_own"
  on public.workouts for insert
  with check (auth.uid() = user_id);

create policy "workouts_update_own"
  on public.workouts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "workouts_delete_own"
  on public.workouts for delete
  using (auth.uid() = user_id);

-- =========================================================================
-- meals
-- is_vegetarian and is_eggless are NOT NULL booleans so dietary tracking
-- is always explicit — no "unknown" state.
-- =========================================================================

create table if not exists public.meals (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  date           date not null default current_date,
  meal_type      public.meal_type not null,
  food_name      text not null,
  calories       integer not null check (calories >= 0),
  is_vegetarian  boolean not null default false,
  is_eggless     boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists meals_user_date_idx
  on public.meals (user_id, date desc, meal_type);

alter table public.meals enable row level security;

drop policy if exists "meals_select_own" on public.meals;
drop policy if exists "meals_insert_own" on public.meals;
drop policy if exists "meals_update_own" on public.meals;
drop policy if exists "meals_delete_own" on public.meals;

create policy "meals_select_own"
  on public.meals for select
  using (auth.uid() = user_id);

create policy "meals_insert_own"
  on public.meals for insert
  with check (auth.uid() = user_id);

create policy "meals_update_own"
  on public.meals for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "meals_delete_own"
  on public.meals for delete
  using (auth.uid() = user_id);

-- =========================================================================
-- updated_at trigger
-- =========================================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists daily_metrics_set_updated_at on public.daily_metrics;
create trigger daily_metrics_set_updated_at
  before update on public.daily_metrics
  for each row execute function public.set_updated_at();

drop trigger if exists workouts_set_updated_at on public.workouts;
create trigger workouts_set_updated_at
  before update on public.workouts
  for each row execute function public.set_updated_at();

drop trigger if exists meals_set_updated_at on public.meals;
create trigger meals_set_updated_at
  before update on public.meals
  for each row execute function public.set_updated_at();
