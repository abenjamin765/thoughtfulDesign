# Thoughtful Design LMS — Design Spec

**Date:** 2026-06-11 (updated 2026-06-12, Phase 8 launch readiness)
**Status:** Implemented (MVP)

## Goal

Build a self-led, public-enrollment learning platform for **Thoughtful Design** — a
modern UX practice for designing complex, intelligent, human-centered systems.
Lessons are authored as MDX in git; Supabase handles auth and learner progress; the
site deploys as a static app to GitHub Pages.

## Decisions

| Area | Choice |
| --- | --- |
| Enrollment | Public — anyone can sign up (free; no payments in MVP) |
| Curriculum | 11 modules across 4 parts + intro; canonical order in `content/course.yaml` |
| Lesson format | MDX typographic storytelling (Story → Concept → Example → Question → Application) + quiz + reflection |
| Assessment | Module / milestone / final, 80% pass threshold, retry with feedback; judgment + written questions ungraded |
| Access model | One public preview lesson per module; other lessons auth-gated; open navigation in the learning zone; only assessments gated by completion |
| Authoring | Markdown/MDX + YAML in repo; `course.yaml` registry for structure |
| Hosting | GitHub Pages (`abenjamin765.github.io/thoughtfulDesign`) |
| Stack | Astro + MDX + React islands + Supabase |

## Curriculum

Part 1 — Seeing the System (Modules 1–3). Part 2 — Understanding People and Decisions
(Modules 4–6). Part 3 — Shaping Responsible Experiences (Modules 7–9). Part 4 —
Designing With Intelligence (Modules 10–11). Course-wide framework: the Thoughtful
Design Loop (Model → Understand → Align → Shape → Test → Account → Adapt). See
`content/course.yaml` for module titles, core claims, loop steps, and preview lessons.

## Architecture

- **Build time:** Astro compiles MDX lessons/blog and YAML assessments into static
  HTML; `course.yaml` drives the navigation tree.
- **Runtime:** Supabase JS client in the browser for auth, quiz responses, lesson
  progress, assessment attempts, certificates, and analytics. Static pages stay
  reachable when Supabase is unconfigured (islands no-op).
- **Deploy:** GitHub Actions builds `dist/` and publishes via GitHub Pages.

## Content model

| Collection | Source |
| --- | --- |
| `lessons` | `content/lessons/**/*.mdx` |
| `assessments` | `content/assessments/{modules,milestones,final}/*.yaml` |
| `resources` | `content/resources/*.md` |
| `blog` | `content/blog/*.mdx` |

Lesson frontmatter: `title`, `module`, `order`, `estimated_minutes`, `published`,
`public_preview`, optional `quiz[]` and `reflection`.

## Supabase schema

Migration 001:
- `profiles` — extends auth users (`display_name`, `enrolled_at`)
- `lesson_progress` — reflection text + completion timestamp per lesson
- `quiz_responses` — per-question inline-quiz answers

Migration 002:
- `assessment_attempts` — scored attempts (score, passed, `attempt_number` for retries)
- `certificates` — one per user, distinction flag, average score
- `analytics_events` — append-only metrics events
- DELETE policies on all user tables (client-side account deletion)

RLS restricts all tables to `auth.uid()`.

## Pages

| Route | Auth | Purpose |
| --- | --- | --- |
| `/` | No | Landing |
| `/login`, `/signup` | No | Email/password (+ terms/privacy consent) |
| `/lessons/[slug]` | Preview: no · else yes | Lesson reader + exercises |
| `/course` | Yes | 11-module overview |
| `/course/modules/[slug]` | Yes | Module index + assessment card |
| `/course/modules/[slug]/assessment` | Yes | Module assessment |
| `/course/milestones/[id]/assessment` | Yes | Milestone assessment |
| `/course/final/assessment` | Yes | Final assessment |
| `/resources`, `/resources/[slug]` | No | 12 templates |
| `/blog`, `/blog/[slug]` | No | Editorial posts |
| `/dashboard` | Yes | Resume CTA + progress |
| `/certificate` | Yes | Eligibility + printable certificate |
| `/account` | Yes | Settings + account deletion |
| `/privacy`, `/terms`, `/contact` | No | Launch / legal |

## MDX components

- `Callout` — tip, warning, truth, principle, tryit, trap
- `Reveal` — collapsible answers
- `Shift` — "The Shift" serif couplet
- `Quiz` — multiple choice (frontmatter-driven), `aria-live` feedback
- `ReflectionPrompt` — saved open response
- `LessonComplete` — manual completion marker

## Launch readiness (Phase 8)

- Privacy / Terms / Contact pages, linked from footer and signup.
- Account deletion path (`/account`) with explicit confirmation and data-scope disclosure.
- Signup consent: "By creating an account you agree to Terms + Privacy."
- 7 analytics events wired via `src/lib/analytics.ts` (see `docs/metrics.md`).
- Accessibility: skip link, single-h1 per page, `prefers-reduced-motion`, focus
  rings, 44px touch targets, non-color-only status, plain-language error copy. See
  `docs/a11y-audit.md`.

## Deferred

- Payments, OAuth providers, admin CMS, cohort features, interactive object-mapping tool
- Email notifications, localization, video embeds, offline reading
- **Learning Gate:** usability test (5–8 participants) before paid marketing — tracked
  in `docs/sign-off-ledger.md`, out of code scope.

## Deployment

- `astro.config.mjs` → `site: https://abenjamin765.github.io`, `base: /thoughtfulDesign/`
- GitHub Actions workflow with Supabase env secrets
- Optional custom domain via `public/CNAME` later
