# Typographic & Semantic Pattern Spec

**Date:** 2026-06-11
**Status:** Draft (for review)
**Source of requirement:** `docs/requirements--thoughtfuldesigner.md` §4 (Typographic Storytelling), §5 (Assessment), §8 (Accessibility), §12 (Voice & Tone)
**Closes:** Panel Review Action Plan — Task 3 (Mira + Ace)

## Why this exists

The course's pedagogy rests on ten recurring "typographic storytelling" patterns (§4). The requirements name the patterns but do not specify how each looks, how each is encoded for assistive technology, or how authors produce them consistently. This is the load-bearing instructional UI, and it is currently unspecified.

Two failure modes this spec prevents:

1. **Pattern masking (Mira).** Ten visual treatments that aren't deliberately differentiated blur together; the learner stops perceiving "The Shift" as special.
2. **Visual-only meaning (Ace).** A course that teaches WCAG 1.4.1 must not signal its own pattern types by color/italics alone. Every pattern needs a non-visual identity (a text label + a semantic region), or it fails its own Module 8 in front of the audience trained to notice.

### Success criteria

- A WCAG 2.2 AA check passes on a sample lesson that uses every pattern.
- Two different authors, given only this spec, produce visually and structurally consistent lessons.

---

## 1. Foundations

### 1.1 Existing tokens (do not duplicate)

The system already defines tokens in `src/styles/global.css` (`:root`). This spec **extends** them; it does not replace them. Existing relevant tokens: `--bg`, `--surface`, `--text`, `--muted`, `--accent`, `--accent-soft`, `--border`, `--warning`, `--warning-soft`, `--radius`, `--font-sans`, `--font-serif`, `--content-width: 42rem`.

### 1.2 Type scale (add to `:root`)

A single modular scale (ratio ≈ 1.25, base 1rem) so every pattern draws from the same set. `clamp()` keeps display sizes fluid without separate breakpoints.

```css
:root {
  --step--1: 0.8rem;    /* fine print: labels, feedback meta */
  --step-0: 1rem;       /* body copy */
  --step-1: 1.25rem;    /* lead paragraph, pattern labels at large */
  --step-2: clamp(1.4rem, 1.1rem + 1.2vw, 1.75rem);   /* h3 / pattern headings */
  --step-3: clamp(1.75rem, 1.3rem + 2vw, 2.4rem);     /* h2 */
  --step-4: clamp(2.2rem, 1.6rem + 3vw, 3.2rem);      /* h1 / The Shift */
  --measure: 66ch;      /* max line length for body prose */
  --flow: 1.1em;        /* vertical rhythm between flow elements */
}
```

**Font roles (already present, now assigned):**

- `--font-serif` (Georgia) → display/headings, The Shift, The Principle. Carries "narrative weight."
- `--font-sans` (Segoe UI) → body copy, labels, all interactive controls. Carries "working text."

**Rhythm rule:** body prose uses `max-width: var(--measure)` and a single owl selector (`* + * { margin-top: var(--flow); }`) inside `.prose` so spacing is consistent regardless of which patterns an author stacks.

### 1.3 Reading-level target (Ace)

- **Body instructional copy:** target US grade 9–11 (Flesch–Kincaid). Professional audience, but §12 requires plain language and "jargon without explanation" is banned.
- **Pattern labels, button text, quiz feedback:** target grade 6–8. These are wayfinding text and must be instantly parseable.
- **Every domain term** (object, system, attribute, relationship, etc.) gets its first-use definition inline or via a `Reveal` glossary entry. Enforced by the shared glossary (Action Plan Task 2).
- **Verification:** authors run copy through a readability check before merge; CI lint (future) can flag lessons whose body exceeds grade 12.

---

## 2. The ten patterns

Each pattern is specified as: **role · component · visual treatment · semantic encoding · a11y notes.** The unifying rule:

> **Every pattern is a labeled region.** It carries a visible text label (so meaning is never color-only — satisfies WCAG 1.4.1) *and* a programmatic identity (so it is announced and navigable — satisfies WCAG 1.3.1).

Most patterns consolidate onto the existing `Callout` component (which already renders a `.callout__label` — a non-visual-safe text label). Three patterns are narrative *sections* (headed prose, not asides). Three are interactive and reuse `Quiz` / `Reveal` / `ReflectionPrompt`.

| # | §4 Pattern | Component | Region type |
| --- | --- | --- | --- |
| 1 | The Situation | `<section>` (narrative) | `region`, headed |
| 2 | The Hidden Problem | `<section>` (narrative) | `region`, headed |
| 3 | The Shift | `Shift` (new) | `figure` |
| 4 | The Principle | `Callout type="principle"` | `aside`, labeled |
| 5 | Try It | `Callout type="tryit"` wrapping `ReflectionPrompt` | `aside`, labeled |
| 6 | Check Yourself | `Quiz` | `group` (fieldset) |
| 7 | Design Judgment Moment | `JudgmentMoment` (new) wrapping `Quiz` + `Reveal` | `region`, labeled |
| 8 | What Good Looks Like | `Reveal label="What good looks like"` | `group`, disclosure |
| 9 | Common Trap | `Callout type="trap"` | `aside`, labeled |
| 10 | Carry Forward | `<section>` (narrative, end-cap) | `region`, headed |

### 2.1 The Situation (narrative)
- **Visual:** standard body prose under an `<h2>` "The situation"; opening sentence set in `--step-1` lead style. No box — it is the page's ground floor.
- **Semantic:** `<section aria-labelledby>` tied to the heading. Lives in normal reading order.
- **a11y:** none beyond heading hierarchy. Do **not** put the scenario in an `aside` — it is primary content, not supplementary.

### 2.2 The Hidden Problem (narrative)
- **Visual:** body prose under an `<h2>` "The hidden problem." May include a `contrast table` (two-column `<table>` with a `<caption>`) for surface-request vs. real-problem.
- **Semantic:** `<section aria-labelledby>`. Any contrast table uses real `<th scope>` headers, never a layout grid of `<div>`s.
- **a11y:** tables get a `<caption>`; the surface/depth contrast is conveyed by the row/column headers, not by background color alone.

### 2.3 The Shift (new component `Shift`)
The signature reframe couplet ("The team asked for a better screen. / The user needed a clearer system.").
- **Visual:** `--font-serif`, `--step-4`, two lines; the second line in `--accent`, the first in `--muted`. Generous top/bottom margin (`calc(var(--flow) * 3)`). This is the most visually distinct moment in a lesson — earns its pixels by being rare (max one per lesson).
- **Semantic:** `<figure>` with a visually-hidden `<figcaption>` "The shift" so screen-reader users hear the pattern name. The couplet is two `<p>`s, not a single line with a `<br>`, so each reframe clause is announced separately.
- **a11y:** the contrast between line 1 and line 2 is carried by text content and a visually-hidden "→ becomes →" connector, **not** by color alone. Color is reinforcement, not the signal. Contrast of `--accent` (#2d5a4a) on `--bg` (#f7f4ef) = 6.6:1 — passes AA for large text.

### 2.4 The Principle (`Callout type="principle"`)
- **Visual:** add a `--callout--principle` variant. Tinted surface (reuse `--accent-soft`), 4px left rule in `--accent`, label "Principle." Body in `--font-serif`, `--step-1`.
- **Semantic:** existing `<aside class="callout">` with `.callout__label` text "Principle." Already non-visual-safe.
- **a11y:** label is real text. No change to existing accessible pattern.

### 2.5 Try It (`Callout type="tryit"` + `ReflectionPrompt`)
- **Visual:** new `--callout--tryit` variant, distinct tint (propose a fourth hue, e.g. soft sand `--tryit-soft`). Label "Try it." Contains a short instruction then the existing `ReflectionPrompt` textarea.
- **Semantic:** `<aside>` labeled "Try it" wrapping the existing reflection control. The textarea keeps its associated `<label>`.
- **a11y:** the activity instruction precedes the input in DOM order; the textarea has a programmatic label (already true in `ReflectionPrompt`).

### 2.6 Check Yourself (`Quiz`)
- **Visual:** existing `.quiz` card. Label "Check yourself" via the `<legend>`.
- **Semantic:** existing `<fieldset>` / `<legend>` (already correct). Radio group for single-select, checkbox group for multi-select.
- **a11y:** see §3 for the full interactive-question accessibility rules — this is where matching/ranking/ordering must be handled.

### 2.7 Design Judgment Moment (new component `JudgmentMoment`)
A scenario where more than one answer is defensible (§4.7) — explicitly **not** a right/wrong quiz.
- **Visual:** labeled region "Design judgment moment," prose scenario, a `Quiz` set to "no single correct answer" mode (selecting an option reveals reasoning for *each* option rather than marking correct/incorrect), then a `Reveal` with the trade-off discussion.
- **Semantic:** `<section aria-labelledby>` (region, not aside — it's core assessment content).
- **a11y:** because there is no "correct" answer, feedback is delivered per-option in an `aria-live="polite"` region; never rely on a green/red color to imply correctness (there is none).

### 2.8 What Good Looks Like (`Reveal`)
- **Visual:** existing `.reveal` (dashed border, summary in `--accent`). `label="What good looks like"`.
- **Semantic:** native `<details>/<summary>` — keyboard-operable and announced as a disclosure by default. No custom JS needed.
- **a11y:** native disclosure is the accessible baseline. Do not replace with a JS toggle that drops `aria-expanded`.

### 2.9 Common Trap (`Callout type="trap"`)
- **Visual:** reuse the existing `--callout--warning` styling (`--warning-soft`, amber border). Label "Common trap." Per §12, framing is corrective-not-shaming ("A common trap is…", never "Don't be the designer who…").
- **Semantic:** existing `<aside class="callout callout--warning">` with label text "Common trap."
- **a11y:** meaning carried by the "Common trap" label text + an icon with `aria-hidden`, not by amber color alone.

### 2.10 Carry Forward (narrative end-cap)
- **Visual:** `<section>` under `<h2>` "Carry forward"; a single `--step-1` paragraph plus a styled link to the next lesson. Visually quieter than The Shift — it is a soft close, not a climax.
- **Semantic:** `<section aria-labelledby>` as the last region; the next-lesson link is a normal `<a>` in reading order.
- **a11y:** link text names the destination ("Continue to Module 3: Systems Thinking"), never "Next" alone (WCAG 2.4.4 link purpose).

---

## 3. Interactive question accessibility (Ace — required before any non-MCQ ships)

§5 and §8 call for matching, ordering, and ranking question types. These are the classic keyboard/screen-reader failure points. **Drag-and-drop is not an acceptable sole interaction.** Each type below has an accessible baseline; drag-and-drop may be layered on **only** as progressive enhancement over a working accessible control.

### 3.1 Multiple choice / multiple select (exists)
- Radio group (single) or checkbox group (multi) inside `<fieldset>/<legend>`. Already correct in `Quiz`.
- Feedback (§9.2) rendered into an `aria-live="polite"` region so screen readers announce it without a focus jump. Correctness conveyed by text ("Correct —" / "Not quite —") **plus** color/icon, never color alone.

### 3.2 Matching
- **Accessible baseline:** each left-hand item is a row with a native `<select>` listing the right-hand options. Selecting builds the pairing. Fully keyboard- and screen-reader-operable with zero custom code.
- Each `<select>` has a programmatic label naming its left-hand item ("Match for: *Object*").
- Drag-to-connect is enhancement-only.

### 3.3 Ordering / Ranking
- **Accessible baseline:** an ordered list where each item has "Move up" / "Move down" buttons (or a position `<select>` 1..n). On reorder, announce the change via `aria-live` ("Moved *Discovery* to position 2 of 5").
- Buttons have item-specific accessible names ("Move *Discovery* up"), never bare "Up."
- Drag-to-reorder is enhancement-only.

### 3.4 Universal rules for all question types
- Every control reachable and operable by keyboard alone (WCAG 2.1.1); visible focus state on all controls (the existing `:focus` outline on form fields is the baseline — extend to buttons).
- Touch targets ≥ 44×44px (WCAG 2.5.8).
- Feedback never relies on color alone (WCAG 1.4.1); pair color with a text prefix and/or icon.
- Question text at grade 6–8; scenario stems may be higher but define their terms.

---

## 4. Component work implied by this spec

Concrete deltas, scoped against the current `src/components/` set:

1. **Extend `Callout.astro`** — add `principle`, `tryit`, `trap` to the `type` union and `labels` map; add matching label defaults. (One file, additive.)
2. **Add CSS variants** in `global.css` — `.callout--principle`, `.callout--tryit`, `.callout--trap`; add the type-scale tokens (§1.2) and `--tryit-soft`.
3. **New `Shift.astro`** — `<figure>` + visually-hidden `<figcaption>`, two `<p>` couplet, serif display styling.
4. **New `JudgmentMoment.astro`** — labeled `<section>` wrapping a no-correct-answer `Quiz` mode + `Reveal`.
5. **Extend `Quiz.tsx`** — add `matching`, `ordering` question modes with the accessible baselines in §3; add a `judgment` (no-correct-answer) mode; route feedback through an `aria-live` region.
6. **Add a `.visually-hidden` utility** to `global.css` (for figcaptions and connectors).

None of this changes the architecture in `docs/superpowers/specs/2026-06-11-thoughtful-design-lms-design.md` — it fills in the unspecified visual/semantic layer the LMS spec deferred.

---

## 5. Verification checklist (run on a sample lesson before adopting)

- [ ] Sample lesson uses all ten patterns at least once.
- [ ] Keyboard-only pass: every interactive element reachable and operable; focus visible throughout.
- [ ] Screen-reader pass (VoiceOver + one of NVDA/JAWS): each pattern's label is announced; The Shift couplet reads as two distinct clauses; quiz feedback is announced via live region.
- [ ] Grayscale pass: every pattern is still distinguishable with color removed (labels + structure carry meaning).
- [ ] Contrast pass: all text ≥ 4.5:1 (3:1 for large/UI) — verify `--muted`, `--accent`, and the trap amber against their backgrounds.
- [ ] Readability pass: body copy grade 9–11; labels/feedback grade 6–8.
- [ ] Consistency pass: a second author drafts a section from this spec; patterns render identically to the reference.

## Open items handed off

- **Glossary dependency:** first-use term definitions depend on the shared glossary (Action Plan Task 2). Spec assumes it exists.
- **Drag-and-drop enhancement:** out of scope here; only the accessible baselines are required for v1.
- **Motion:** any reveal/transition motion must respect `prefers-reduced-motion` — to be specified when motion is added.
