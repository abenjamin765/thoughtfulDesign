# Opportunity Statement — thoughtfulDesigner.io
## Phase 1 Evidence Gate artifact

---

## Problem Statement

**Current state:** Mid-career UX and product designers are expected to lead systems-level work — domain modeling, cross-functional facilitation, ethical product decisions, and responsible AI use — but the design education ecosystem has not caught up. Most available training covers tooling (Figma, prototyping) or surface-level process (Design Thinking sprints), not the deeper design judgment these roles require.

**Affected role:** UX designers and product designers with 2–8 years of experience who have outgrown beginner courses but lack access to practitioner-level systems education.

**Evidence (type: borrowed/assumed):**
- The UX bootcamp market exploded 2015–2022 producing entry-level practitioners, but left a recognized "mid-career ceiling" gap in publicly discussed design communities (assumed; no direct survey data in-hand — logged as A-01).
- Sophia Prater's OOUX methodology and related systems-design thinking content has demonstrated strong practitioner demand via paid workshops, online following, and the existing requirements doc scope (borrowed from domain knowledge).
- The existing codebase (Astro + Supabase LMS) represents committed product investment, confirming the course is already in active development.
- The requirements doc covers 11 fully scoped modules + 4 assessment tiers — a comprehensive curriculum exists but no marketing or discovery layer has been designed (observed from codebase review).

**Magnitude / reach (assumed):** The size of the addressable UX practitioner market is estimated, not observed. The US Bureau of Labor Statistics reports ~270k UX designers in the US (2022); global estimates from industry reports range 1–3 million. No source is authoritative. The mid-career segment (2–8 years) is estimated at 40–60% of practitioners based on career-stage distribution heuristics — this is assumed, not researched. Year-1 realistic target: 500–2,000 enrolled learners. This is a commercial estimate grounded in comparable self-paced practitioner courses (e.g., $150–300 price point, niche audience, no paid acquisition channel at launch).

**Cost of inaction:** Without a thoughtfully designed marketing and learning platform:
- Potential learners cannot discover the course or understand its differentiated value proposition.
- Learners who enroll face a minimal MVP UI that does not communicate the course's intellectual depth or reinforce motivation through the 11-module journey.
- Conversion from visitor to enrolled learner will remain low due to absent landing page and weak first-impression framing.
- The blog, resources, and tenets sections — which build authority and organic search traffic — are entirely absent.

**Desired outcome:** A self-led online learning platform where mid-career designers discover thoughtfulDesigner.io, understand its value, enroll, progress through a rigorous 11-module curriculum, and earn a completion certificate — all without requiring synchronous instruction or peer grading.

**Success metric (primary):** Module assessment pass rate ≥ 80% among learners who complete 3+ lessons, demonstrating genuine learning (not just enrollment).

**Secondary success metric:** 30-day lesson completion rate — at least 40% of enrolled learners complete their first full module within 30 days of enrollment.

**Confidence:** Medium. The curriculum design is well-specified (high confidence in content quality). The market sizing and conversion assumptions are estimated, not observed.

---

## Opportunity Sizing

| Dimension | Estimate | Classification |
|---|---|---|
| Reach | 500–2,000 enrolled learners (Year 1) | assumed |
| Value per learner | High — career-level skills development, likely $99–299 course price | assumed |
| Business value | Course revenue + authority/brand equity for future consulting, licensing | assumed |
| Confidence | Medium | — |

**Opportunity tier:** Medium-broad. Not a mass consumer product. A specialized practitioner course with high value per learner and strong word-of-mouth potential within the design community.

---

## Evidence Inventory

| ID | Item | Type | Source | Strength |
|---|---|---|---|---|
| E-01 | 11-module curriculum requirements doc (1,534 lines, fully specified) | observed | `docs/requirements--thoughtfuldesigner.md` | Strong — product is defined |
| E-02 | Supabase schema with profiles, lesson_progress, quiz_responses tables | observed | `supabase/migrations/001_initial_schema.sql` | Strong — LMS data model exists |
| E-03 | Astro + Supabase LMS codebase (auth, lessons, quiz, progress) | observed | `src/` directory | Strong — core platform is building |
| E-04 | Mid-career UX skills gap as recognized industry problem | borrowed | Community discourse, design education market patterns | Moderate |
| E-05 | OOUX methodology practitioner demand | borrowed | Sophia Prater public work, workshop history | Moderate |
| E-06 | Year-1 learner reach estimate (500–2,000) | assumed | Market sizing heuristics | Low — needs validation |
| E-07 | Course price point ($99–299) | assumed | Comparable practitioner courses | Low — needs validation |

**Evidence Gate status:** PASSED (conditional).
- ≥1 strong observed evidence item: Yes (E-01, E-02, E-03).
- Opportunity sized: Yes (reach × value estimated, classified as assumed).
- Unvalidated assumptions logged: Yes — see assumptions.md.

---

## Instrumentation Hypothesis

**Primary success event:** `lesson_completed` — fired when a learner marks a lesson done and passes its inline checks.

**What success would prove:** If ≥40% of enrolled learners complete Module 1 within 30 days, the platform is communicating value and the course structure supports self-directed progress.

**Falsification condition:** If <20% of enrolled learners complete Module 1 within 30 days despite high enrollment, the problem is the learning experience, not the market.

See `docs/metrics.md` for the full metrics register.
