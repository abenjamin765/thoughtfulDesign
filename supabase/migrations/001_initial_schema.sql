-- Thoughtful Design LMS — initial schema
-- Run in the Supabase SQL editor or via supabase db push

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  enrolled_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_slug text not null,
  reflection_text text,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_slug)
);

create table if not exists public.quiz_responses (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_slug text not null,
  question_index integer not null,
  selected_answer integer not null,
  correct boolean not null,
  answered_at timestamptz not null default now(),
  unique (user_id, lesson_slug, question_index)
);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_responses enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can view own lesson progress"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own lesson progress"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own lesson progress"
  on public.lesson_progress for update
  using (auth.uid() = user_id);

create policy "Users can view own quiz responses"
  on public.quiz_responses for select
  using (auth.uid() = user_id);

create policy "Users can insert own quiz responses"
  on public.quiz_responses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own quiz responses"
  on public.quiz_responses for update
  using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
