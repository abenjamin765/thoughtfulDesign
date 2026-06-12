# Assumptions Register — thoughtfulDesigner.io Design Dash
## Running log of every unvalidated decision in this design sprint

Last updated: 2026-06-11
Format: id · statement · type · confidence · validation method · owner · status · linked decision

---

## Key

- **Type:** `observed` = backed by evidence link | `borrowed` = credibly sourced domain knowledge | `assumed` = not yet validated
- **Confidence:** high / medium / low
- **Status:** open / validated / invalidated / deferred

---

## A-01 — Mid-career skills gap is real and undersupported

| Field | Value |
|---|---|
| Statement | Mid-career UX designers (2–8 yrs experience) lack access to systems-level design education beyond tooling bootcamps. |
| Type | borrowed |
| Confidence | medium |
| Validation method | Survey 20 mid-career designers (LinkedIn outreach or community post) asking about unmet education needs; check for explicit "systems thinking" or "design judgment" mentions. |
| Owner | TBD (user) |
| Status | open |
| Linked decision | Curriculum positioning at "systems-level design" rather than foundational UX |

---

## A-02 — Learners will self-direct through 11 modules without synchronous support

| Field | Value |
|---|---|
| Statement | Mid-career designers have the discipline and motivation to complete a rigorous 11-module async course without cohorts, live sessions, or peer accountability. |
| Type | assumed |
| Confidence | medium |
| Validation method | Run a pilot with 10–20 beta learners; track 30-day Module 1 completion rate. Target: ≥40%. |
| Owner | TBD (user) |
| Status | open |
| Linked decision | MVP excludes cohorts, live workshops, peer review |

---

## A-03 — Course price point $99–299 is acceptable to target audience

| Field | Value |
|---|---|
| Statement | Mid-career designers will pay $99–299 for this course; free or sub-$50 price signals low quality; >$299 creates friction without enterprise/team licensing. |
| Type | assumed |
| Confidence | low |
| Validation method | Landing page price sensitivity test (e.g., Van Westendorp survey or simple A/B on waitlist). |
| Owner | TBD (user) |
| Status | open |
| Linked decision | Conversion copy on landing page (value prop framing depends on price tier) |

---

## A-04 — Module assessment 80% passing threshold is calibrated correctly

| Field | Value |
|---|---|
| Statement | 80% is the right passing threshold — rigorous enough to signal real learning, not so high that it creates excessive frustration and abandonment. |
| Type | assumed |
| Confidence | medium |
| Validation method | Pilot: track retry rates and completion rates per module. If retry rate >50% on a single assessment, the threshold or the question calibration needs review. |
| Owner | TBD (user) |
| Status | open |
| Linked decision | Assessment design, pass/fail UX, retry flow |

---

## A-05 — The blog and resources library drive discovery/SEO, not just retention

| Field | Value |
|---|---|
| Statement | Publishing the blog and resources library (downloadable templates) will generate organic search traffic and convert visitors to enrolled learners at a meaningful rate. |
| Type | assumed |
| Confidence | medium |
| Validation method | Track organic search attribution to enrollment conversions 3 months post-launch. Target: ≥15% of enrollments attributed to organic search. |
| Owner | TBD (user) |
| Status | open |
| Linked decision | Blog and Resources are in-scope for MVP (not post-MVP) |

---

## A-06 — Core Tenets / Manifesto section builds authority, not noise

| Field | Value |
|---|---|
| Statement | A clearly articulated design philosophy (Thoughtful Design tenets) will increase perceived credibility and differentiate the platform from generic UX courses. |
| Type | assumed |
| Confidence | medium |
| Validation method | Qualitative: include in first-impression user test; ask landing-page visitors what they believe the platform stands for. Target: ≥70% correctly identify the platform's POV. |
| Owner | TBD (user) |
| Status | open |
| Linked decision | Tenets section is in-scope and prominently placed on landing page |

---

## A-07 — Learners want a certificate at completion (not just knowledge)

| Field | Value |
|---|---|
| Statement | A completion certificate is a meaningful motivator for mid-career designers, either for portfolio signal, LinkedIn credibility, or employer evidence. |
| Type | borrowed |
| Confidence | medium |
| Validation method | Survey beta learners: "How important is a certificate of completion to your decision to enroll?" |
| Owner | TBD (user) |
| Status | open |
| Linked decision | Certificate system is in-scope for MVP |

---

## A-08 — Admin/content-authoring interface is not in MVP scope

| Field | Value |
|---|---|
| Statement | The course author (platform owner) will manage content directly via markdown/MDX files in the codebase, without needing a CMS-style admin UI in the MVP. |
| Type | assumed |
| Confidence | high |
| Validation method | Confirm with user that content workflow is code-first. |
| Owner | TBD (user) |
| Status | open |
| Linked decision | Admin role is in object model but admin UI is deferred |

---

## A-09 — Learning Gate deferred (autonomous run)

| Field | Value |
|---|---|
| Statement | This dash was run autonomously without a named human owner. The Learning Gate (P8) usability test and sign-off ledger completion are deferred to a scheduled validation. |
| Type | assumed |
| Confidence | high |
| Validation method | User schedules a usability test with 5–8 mid-career designer participants within 15 business days of first prototype delivery. |
| Owner | TBD (user) |
| Status | open — evidence debt |
| Linked decision | Quality confidence capped at grade B until Learning Gate runs |

---

## A-10 — Typographic storytelling format works for adult async learners

| Field | Value |
|---|---|
| Statement | The narrative-forward, typography-rich lesson format (Story → Concept → Example → Question → Application) will sustain engagement across 11 modules without becoming fatiguing. |
| Type | borrowed |
| Confidence | medium |
| Validation method | Track time-on-lesson vs. module completion rate. If lessons with longer narrative sections have lower completion, consider restructuring to front-load concept. |
| Owner | TBD (user) |
| Status | open |
| Linked decision | Lesson template design, typographic storytelling spec |

---

## A-11 — Resources library needs download/save mechanic, not just browsing

| Field | Value |
|---|---|
| Statement | Learners want to download or save templates (PDF or printable HTML) — not just view them inline. A resources page without download capability will underdeliver. |
| Type | assumed |
| Confidence | medium |
| Validation method | First-impression test: show resources page mock to 5 designers; observe whether they immediately look for a download button. |
| Owner | TBD (user) |
| Status | open |
| Linked decision | Resource card CTA design; file delivery mechanism |

---

## Evidence Debt Log (Standard tier deferred items)

| Gate | Deferred item | Due date (target) |
|---|---|---|
| Learning Gate | Usability test (5–8 mid-career designer participants) | 15 business days from first prototype |
| Learning Gate | Named owner for sign-off ledger rows | Before test scheduling |
| Evidence Gate | Survey: mid-career skills gap validation (A-01) | Before paid acquisition begins |
| Evidence Gate | Price sensitivity test (A-03) | Before pricing is set on landing page |
