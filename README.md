# Thoughtful Design

A self-led learning platform for **Thoughtful Design** — a modern UX practice for
designing complex, intelligent, human-centered systems. Built with **Astro + MDX**
and **Supabase** (auth + progress), deployed as a static site to **GitHub Pages**.

## Curriculum

11 modules across 4 parts, plus an introduction. Part/module order and core claims
are defined canonically in [`content/course.yaml`](content/course.yaml).

**Part 1 — Seeing the System**
1. From Screens to Systems
2. Object-Oriented UX
3. Systems Thinking for UX

**Part 2 — Understanding People and Decisions**
4. Research as Sensemaking
5. Facilitation for Designers
6. Product Strategy and Design Judgment

**Part 3 — Shaping Responsible Experiences**
7. Interaction Design Craft
8. Accessibility and Human Variation
9. Ethics and Product Consequences

**Part 4 — Designing With Intelligence**
10. AI in Modern UX
11. The Thoughtful Designer's Practice

Every module runs on the **Thoughtful Design Loop** (Model → Understand → Align →
Shape → Test → Account → Adapt).

### Assessments

- 11 module assessments, 3 milestone assessments (one per part 1–3), 1 final.
- 80% pass threshold, shown upfront; unlimited retries with per-question feedback.
- Judgment-moment and written-rationale questions are reflective and ungraded.
- Pass all 15 required assessments → certificate is issued automatically (distinction at ≥90% average).

## MVP scope

In scope: public enrollment, 11-module curriculum, one public preview lesson per
module, scored assessments with retry, dashboard with a Resume CTA, 12 downloadable
framework templates, a blog, the completion certificate, and the launch gates
(privacy/terms/contact, account deletion, analytics events, a11y).

Out of scope (deferred): payments, OAuth providers, admin CMS, cohort features,
interactive object-mapping tool, email notifications, localization. A pre-paid-marketing
usability test (5–8 participants) is a tracked future action — see
[`docs/sign-off-ledger.md`](docs/sign-off-ledger.md) (Learning Gate).

## Stack

- **Astro 6** — static site generation
- **MDX** — lesson + blog content in `content/`
- **React islands** — quizzes, assessments, auth, nav, dashboard, certificate, account
- **Supabase** — auth, lesson progress, quiz responses, assessment attempts, certificates, analytics
- **GitHub Actions** — deploy to GitHub Pages

## Quick start

```bash
cd ~/Sites/thoughtfulDesign
cp .env.example .env
# Add your Supabase URL + anon key
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321).

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migrations in order in the SQL editor (or `supabase db push`):
   - [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql) — `profiles`, `lesson_progress`, `quiz_responses`
   - [`supabase/migrations/002_assessments_certificates.sql`](supabase/migrations/002_assessments_certificates.sql) — `assessment_attempts`, `certificates`, `analytics_events`, and DELETE policies for account deletion
3. Enable **Email** auth under Authentication → Providers
4. Copy project URL and anon key into `.env`:

```env
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

All tables use row-level security scoped to `auth.uid()`. The site degrades
gracefully when Supabase is unconfigured: public pages render, and progress/auth
islands no-op.

## Content model

| Collection | Source | Notes |
|---|---|---|
| `lessons` | `content/lessons/**/*.mdx` | `title`, `module`, `order`, `estimated_minutes`, `public_preview`, optional `quiz[]` + `reflection` |
| `assessments` | `content/assessments/**/*.yaml` | `type` (module/milestone/final), `pass_threshold`, `questions[]` / `sections[]` |
| `resources` | `content/resources/*.md` | Printable framework templates, tagged to a `module_id` |
| `blog` | `content/blog/*.mdx` | Editorial posts |

`course.yaml` is the source of truth for part/module ordering everywhere; lesson
sequence within a module comes from each lesson's `order` frontmatter.

### MDX components

| Component | Usage |
| --- | --- |
| `<Callout type="tip\|warning\|truth\|principle\|tryit\|trap">` | Highlighted learning aids |
| `<Reveal label="...">` | Collapsible answer |
| `<Shift>` | "The Shift" serif couplet |
| Quiz / Reflection | Defined in frontmatter; rendered below lesson body |

## Routes

| Route | Auth | Purpose |
| --- | --- | --- |
| `/` | No | Landing (Concept B marketing) |
| `/login`, `/signup` | No | Supabase email/password (+ terms/privacy consent) |
| `/lessons/[slug]` | Preview lessons: no · others: yes | Lesson reader + exercises |
| `/course` | Yes | 11-module overview with progress |
| `/course/modules/[slug]` | Yes | Module index + assessment card |
| `/course/modules/[slug]/assessment` | Yes | Module assessment (focused layout) |
| `/course/milestones/[id]/assessment` | Yes | Milestone assessment |
| `/course/final/assessment` | Yes | Final assessment |
| `/resources`, `/resources/[slug]` | No | 12 printable templates |
| `/blog`, `/blog/[slug]` | No | Editorial posts |
| `/dashboard` | Yes | Resume CTA + module/assessment progress |
| `/certificate` | Yes | Eligibility check + printable certificate + share |
| `/account` | Yes | Account settings + delete-my-account |
| `/privacy`, `/terms`, `/contact` | No | Launch / legal pages |

## Analytics

`src/lib/analytics.ts` exposes `trackEvent(name, properties?)`, appending to
`public.analytics_events`. It is fire-and-forget and no-ops when Supabase is
unconfigured or the insert is rejected. Seven launch events are wired
(`signup`, `lesson_started`, `lesson_completed`, `assessment_passed`,
`assessment_failed`, `resource_downloaded`, `certificate_issued`).
See [`docs/metrics.md`](docs/metrics.md).

## GitHub Pages

Repository: [abenjamin765/thoughtfulDesign](https://github.com/abenjamin765/thoughtfulDesign)

Live site: `https://abenjamin765.github.io/thoughtfulDesign/`

1. Push this repo to GitHub
2. Enable **GitHub Pages** → Source: **GitHub Actions**
3. Add repository secrets `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`

To use a custom domain later, add a `public/CNAME` file and configure DNS in repo
**Settings → Pages**.

## Scripts

| Command | Action |
| --- | --- |
| `pnpm dev` | Start dev server |
| `pnpm build` | Build static site to `dist/` (lessons, course, assessments, resources, blog, dashboard, certificate, marketing/legal) |
| `pnpm preview` | Preview production build |

## Project structure

```
content/lessons/       MDX lessons + frontmatter
content/assessments/   Module / milestone / final YAML
content/resources/     Printable template markdown
content/blog/          Editorial MDX posts
content/course.yaml    Canonical course registry
src/components/         React islands + Astro UI components
src/lib/                course / lessons / assessments / progress / analytics / account helpers
src/pages/              Routes
supabase/migrations/    Database schema (001 + 002)
docs/                   Design dash artifacts, specs, metrics, a11y audit
```

## Design spec

See [`docs/superpowers/specs/2026-06-11-thoughtful-design-lms-design.md`](docs/superpowers/specs/2026-06-11-thoughtful-design-lms-design.md).
