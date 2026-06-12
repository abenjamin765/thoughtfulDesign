-- Thoughtful Design LMS — assessments, certificates, analytics
-- Extends 001_initial_schema.sql. Run in the Supabase SQL editor or via supabase db push.
--
-- Scored assessments (module / milestone / final) are kept separate from the
-- inline lesson quizzes in public.quiz_responses. Inline quizzes keep their
-- per-question unique constraint; scored assessments are retryable here via
-- attempt_number (closes the schema gap noted in docs/metrics.md).

-- ---------------------------------------------------------------------------
-- assessment_attempts: one row per scored attempt of an assessment.
--   assessment_id  : matches the YAML `id` (e.g. "01-screens-to-systems",
--                    "01-seeing-the-system", "thoughtful-design-final")
--   score          : fraction in [0,1] to compare directly against pass_threshold
--   attempt_number : 1-based, increments per retry of the same assessment
-- ---------------------------------------------------------------------------
create table if not exists public.assessment_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  assessment_id text not null,
  assessment_type text not null check (assessment_type in ('module', 'milestone', 'final')),
  score numeric(5, 4) not null check (score >= 0 and score <= 1),
  passed boolean not null,
  attempt_number integer not null default 1 check (attempt_number >= 1),
  answered_at timestamptz not null default now(),
  unique (user_id, assessment_id, attempt_number)
);

create index if not exists assessment_attempts_user_idx
  on public.assessment_attempts (user_id);
create index if not exists assessment_attempts_assessment_idx
  on public.assessment_attempts (assessment_id);

-- ---------------------------------------------------------------------------
-- certificates: one certificate per learner, issued on full completion.
--   distinction   : true when the average score clears the distinction bar
--   average_score : fraction in [0,1] across all required assessments
--   pdf_hash      : optional integrity hash of the generated certificate PDF
-- ---------------------------------------------------------------------------
create table if not exists public.certificates (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  issued_at timestamptz not null default now(),
  distinction boolean not null default false,
  average_score numeric(5, 4) check (average_score >= 0 and average_score <= 1),
  pdf_hash text,
  unique (user_id)
);

-- ---------------------------------------------------------------------------
-- analytics_events: lightweight, append-only store for the metrics.md events
-- (enrollment, lesson_completed, inline_check_answered, assessment_passed,
-- reflection_submitted, resource_downloaded, certificate_issued).
-- ---------------------------------------------------------------------------
create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_user_idx
  on public.analytics_events (user_id);
create index if not exists analytics_events_name_idx
  on public.analytics_events (event_name);

alter table public.assessment_attempts enable row level security;
alter table public.certificates enable row level security;
alter table public.analytics_events enable row level security;

-- assessment_attempts policies (mirror lesson_progress / quiz_responses style)
create policy "Users can view own assessment attempts"
  on public.assessment_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own assessment attempts"
  on public.assessment_attempts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own assessment attempts"
  on public.assessment_attempts for update
  using (auth.uid() = user_id);

-- certificates policies
create policy "Users can view own certificate"
  on public.certificates for select
  using (auth.uid() = user_id);

create policy "Users can insert own certificate"
  on public.certificates for insert
  with check (auth.uid() = user_id);

create policy "Users can update own certificate"
  on public.certificates for update
  using (auth.uid() = user_id);

-- analytics_events policies
create policy "Users can view own analytics events"
  on public.analytics_events for select
  using (auth.uid() = user_id);

create policy "Users can insert own analytics events"
  on public.analytics_events for insert
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Account deletion (ethics-equity-checklist §1.3 — easy account deletion).
-- A signed-in learner can erase their own data from the client. The Supabase
-- anon client cannot delete the auth.users record itself (that requires the
-- service role), so the app deletes every owned row across these tables and
-- signs the user out; full sign-in-record removal is handled on request.
-- These DELETE policies make that client-side erasure possible.
-- (Tables from 001 are included here so deletion is complete.)
-- ---------------------------------------------------------------------------
create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = id);

create policy "Users can delete own lesson progress"
  on public.lesson_progress for delete
  using (auth.uid() = user_id);

create policy "Users can delete own quiz responses"
  on public.quiz_responses for delete
  using (auth.uid() = user_id);

create policy "Users can delete own assessment attempts"
  on public.assessment_attempts for delete
  using (auth.uid() = user_id);

create policy "Users can delete own certificate"
  on public.certificates for delete
  using (auth.uid() = user_id);

create policy "Users can delete own analytics events"
  on public.analytics_events for delete
  using (auth.uid() = user_id);
