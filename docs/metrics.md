# Metrics Register — thoughtfulDesigner.io
## North-star, guardrail, and diagnostic metrics for the platform

Last updated: 2026-06-11

---

## North-Star Metric

**Module assessment pass rate among active learners (≥3 lessons completed)**

This is the single metric that proves the course works as a learning tool — not just as a product people try and abandon. Learners who reach 3 lessons are past the casual-curiosity stage; their pass rate measures actual learning quality.

| Metric | Event / Measure | Source | Baseline | Target |
|---|---|---|---|---|
| Module assessment pass rate | `quiz_response.correct` aggregated by `lesson_slug` (assessment type) for users with `lesson_progress.completed_at` count ≥ 3 | Supabase `quiz_responses` + `lesson_progress` | Unknown (launch baseline) | ≥ 80% of active learners pass each module assessment |

---

## Primary Conversion Metrics

| Metric | Event / Measure | Source | Baseline | Target |
|---|---|---|---|---|
| Visitor → Enrollment rate | Sessions on landing page ÷ signups | Supabase Auth + analytics | Unknown | ≥ 5% (assumed: comparable niche practitioner courses report 2–8%; no cited study) |
| Enrolled → Module 1 start | `lesson_progress` row created ≤ 7 days after `profiles.enrolled_at` | Supabase | Unknown | ≥ 70% within 7 days |
| Module 1 completion rate (30-day) | `lesson_progress.completed_at` for all Module 1 lessons within 30 days of enrollment | Supabase | Unknown | ≥ 40% |

---

## Retention / Progress Metrics

| Metric | Event / Measure | Source | Baseline | Target |
|---|---|---|---|---|
| Module-to-module continuation rate | % of learners who start Module N and also start Module N+1 | Supabase `lesson_progress` | Unknown | ≥ 65% per module transition |
| Course completion rate | % of enrolled learners who complete all 11 modules + final assessment | Supabase | Unknown | ≥ 20% (assumed: MOOCs report 5–15% completion; paid niche courses typically higher; no hard source for this specific context) |
| Certificate issuance rate | Certificates generated ÷ enrolled learners | Certificate table (to be built) | — | ≥ 15% |

---

## Learning Quality Metrics

| Metric | Event / Measure | Source | Baseline | Target |
|---|---|---|---|---|
| Inline check accuracy (first attempt) | `quiz_responses.correct` = true on first attempt per `question_index` | Supabase `quiz_responses` | Unknown | ≥ 70% across all inline checks |
| Assessment retry rate | Learners who attempt the same lesson_slug assessment ≥ 2 times | Supabase (requires `attempt_number` column — flag as schema gap) | — | ≤ 30% retry rate (higher signals misaligned questions) |
| Module fail rate | % of assessment-takers who fail first attempt | Supabase | Unknown | ≤ 25% per module |

---

## Engagement / Experience Metrics

| Metric | Event / Measure | Source | Baseline | Target |
|---|---|---|---|---|
| Lesson session time | Time between `lesson_progress` creation and completion (proxy for engagement) | Supabase timestamps | Unknown | Average 20–40 min per lesson (module-dependent) |
| Reflection prompt submission rate | `lesson_progress.reflection_text` non-null ÷ lessons with reflection prompts | Supabase | Unknown | ≥ 50% of learners who reach a reflection submit one |
| Resource download rate | Download CTAs clicked ÷ resource page views | Analytics (to be wired) | — | ≥ 25% of resource page visitors download ≥ 1 item |
| Blog-to-enrollment attribution | % of enrolled learners whose first visit was via blog | Analytics (UTM or referrer) | — | ≥ 15% of enrollments from organic/blog |

---

## Guardrail Metrics (do not let these degrade)

| Metric | Threshold | Why it matters |
|---|---|---|
| Assessment retry abandonment | < 15% of learners who fail an assessment abandon the course within 7 days | Failed assessments should motivate re-engagement, not quitting |
| Mobile completion rate parity | Mobile course completion rate ≥ 80% of desktop rate | Mid-career designers browse on mobile; course must work there |
| Page load time (lesson pages) | p95 < 3 seconds | Slow lessons directly harm engagement metrics |

---

## Schema Gaps (items requiring future migration)

| Gap | Description | Priority |
|---|---|---|
| Assessment `attempt_number` | Current `quiz_responses` has `unique (user_id, lesson_slug, question_index)` — prevents retry tracking | High |
| Module-level completion | No `module_progress` table — completion must be inferred from lessons | Medium |
| Certificate table | No `certificates` table in current schema | Medium |
| Resource interaction events | No analytics events for resource downloads | Low (can be external analytics) |

---

## Instrumentation Hooks (to wire into prototype/production)

The following events must be instrumented before the Learning Gate can close:

1. `lesson_started` — when learner navigates to a lesson page
2. `lesson_completed` — when `LessonComplete` component fires
3. `inline_check_answered` — when Quiz component submits a response
4. `assessment_passed` — when a module assessment score ≥ 80%
5. `reflection_submitted` — when reflection text is saved
6. `resource_downloaded` — when a resource download CTA is clicked
7. `certificate_generated` — when certificate is issued
