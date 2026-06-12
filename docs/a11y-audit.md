# Accessibility Audit — Thoughtful Design (Phase 8)

**Date:** 2026-06-12
**Standard:** WCAG 2.2 AA
**Audience / grade band:** Adult professionals (18+)
**Gate type:** Pre-launch review pass (findings + fixes applied)
**Artifacts audited:**
- Lesson page — `src/pages/lessons/[slug].astro` (+ `BaseLayout`, `Quiz`, `ReflectionPrompt`, `LessonComplete`)
- Assessment page — `src/components/AssessmentRunner.tsx` (+ `FocusedLayout`, module/milestone/final routes)
- Landing page — `src/pages/index.astro`

---

## Summary

| Category | Pass | Fail (fixed) | N/A |
|---|---|---|---|
| Landmarks & structure | 3 | 2 | 0 |
| Focus management | 4 | 1 | 1 |
| Color & contrast | 4 | 0 | 0 |
| Interactive elements | 5 | 0 | 1 |
| Motion & time | 2 | 1 | 0 |
| Semantics | 4 | 0 | 0 |
| Cognitive a11y | 3 | 1 | 0 |
| ui-rule TBD | — | 0 | — |

**Blocking issues at start:** 0 hard failures. **Issues fixed this pass:** 5. **Open TBD items:** 0.

The platform entered this audit in strong shape: `global.css` already shipped
`:focus-visible` outlines, a `.visually-hidden` utility, and 44px touch-target
minimums; the assessment runner already used `aria-live` feedback regions and
non-color-only status text. The fixes below close the remaining gaps.

---

## Issues found and fixed

### 1. No skip link on primary-nav pages — WCAG 2.4.1 (Bypass Blocks)
**Where:** `BaseLayout.astro` (every public/learning page).
**Fix:** Added a `.skip-link` ("Skip to main content") as the first focusable
element, targeting `<main id="main">`. Hidden until focused. Style in `global.css`.

### 2. Missing top-level heading on the focused assessment page — WCAG 1.3.1 / 2.4.6
**Where:** `FocusedLayout.astro` — the assessment flow began at an `<h2>` (the
runner's intro/question heading) with no `<h1>`, creating a skipped heading level.
**Fix:** `FocusedLayout` now renders one visually-hidden `<h1>` derived from the
page title, so the runner's `<h2>` sections nest under a real top-level heading.

### 3. Motion not gated by `prefers-reduced-motion` — WCAG 2.3.3 / ethics §4.8
**Where:** `global.css` — button hover `translateY`, card hover lift, progress-bar
width transitions animated unconditionally.
**Fix:** Added a `@media (prefers-reduced-motion: reduce)` block that neutralizes
animations, transitions, and hover transforms for users who request reduced motion.

### 4. Generic / raw error messages — WCAG 3.3.3 (Error Suggestion), ethics §3.3
**Where:** `Quiz.tsx`, `ReflectionPrompt.tsx`, `LessonComplete.tsx` surfaced raw
Supabase messages or "Supabase is not configured yet."
**Fix:** Rewrote every learner-facing error to the pattern *what happened + what to
do next* (e.g. "We couldn't save your answers (…). Your feedback is shown above;
check your connection and press 'Update answers' to try again.").

### 5. `<main>` had no landmark id / target — WCAG 1.3.1
**Where:** `BaseLayout.astro`, `FocusedLayout.astro`.
**Fix:** Added `id="main"` to both `<main>` elements (also the skip-link target).

---

## Passed checks (notable)

- **Landmarks:** one `<main>` per page; `<header>`/`<nav>`/`<footer>` used correctly;
  every `<nav>` carries an `aria-label` (Primary, Footer, Breadcrumb, Lesson navigation).
- **Focus:** all interactive controls are native `<a>`/`<button>`/`<input>`/`<select>`;
  visible `:focus-visible` ring at ≥3:1; the account menu closes on outside click.
- **Contrast:** text/UI combinations validated against the palette — body `--text`
  on `--bg` ≈ 12:1, `--muted` (#5c5c5c) on `--bg` ≈ 6.1:1, white on `--accent`
  (#2d5a4a) ≈ 7.8:1, error red (#9b2c2c) on white ≈ 7.5:1. All clear AA.
- **Color is never the only signal:** quiz/assessment feedback prefixes
  "Correct —" / "Not quite —"; locked modules show "🔒 Enroll to access" text;
  required form fields use `required` + `type`.
- **Touch targets:** buttons, quiz labels, `<summary>`, `<select>`, and filter chips
  are ≥44px on coarse pointers / small viewports.
- **Live regions:** assessment feedback, ordering-move announcements, and results
  use `role="status"` / `aria-live="polite"`; save failures use `role="alert"`.
- **Semantics:** assessment inputs use real `fieldset`/`legend`, labelled `<select>`
  rows for matching, and move-up/down buttons with `aria-label` for ordering.

---

## Runtime-only / future checks (not code-fixable in this pass)

- **Lighthouse performance** (ethics §6.1, p95 < 3s) — run against the deployed
  static build; not measurable from source.
- **MDX heading hierarchy per lesson** — lessons render author-controlled `h2`/`h3`.
  Spot-checked structure is correct; a full content lint should run before launch.
- **Screen-reader pass** (NVDA/VoiceOver) on the live site to confirm the auth-aware
  nav swap and client-island state changes announce as expected.
