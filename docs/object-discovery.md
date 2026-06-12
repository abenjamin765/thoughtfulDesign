# Object Discovery — thoughtfulDesigner.io
## Phase 2–3 artifact | ORCA Step 01: Object Discovery

Last updated: 2026-06-11
Method: Noun foraging from requirements doc + codebase review + SIP validation

---

## Noun Foraging Source Materials

- `docs/requirements--thoughtfuldesigner.md` — 1,534-line curriculum spec
- `supabase/migrations/001_initial_schema.sql` — current data model
- `src/` — Astro + React components (Auth, Quiz, Lesson, Progress, Dashboard)
- Platform scope: LMS + Landing + Blog + Resources + Tenets

---

## SIP Test Reference

**SIP = Separate · Instances · Persistable**

For each candidate noun: Does it need its own separate page? Can it have multiple instances? Does it persist over time independently?

---

## Validated Objects (passed SIP test)

### 1. Course

**SIP validation:**
- Separate page? Yes — the Course has an overview page and is the top-level navigation anchor.
- Multiple instances? Yes — future versions could offer multiple distinct courses; even now the Course is a distinct named thing.
- Persists independently? Yes — the Course exists whether or not any learner is enrolled.

**Definition:** The top-level learning product. A named, structured curriculum with a stated purpose, target audience, learning promise, and sequence of Modules. Currently: "Thoughtful Design."

**Source evidence:** The requirements doc names it as "Thoughtful Design Course" throughout (§1).

**Schema note:** Not yet a table in the schema (implied by content structure). Flag as schema gap.

---

### 2. Module

**SIP validation:**
- Separate page? Yes — each module should have an index/overview page showing its lessons.
- Multiple instances? Yes — 11 modules, each distinct.
- Persists independently? Yes — modules exist in the curriculum regardless of learner state.

**Definition:** A thematic grouping of Lessons covering one major topic area. Has a name, learning objectives, narrative theme, and a sequence number. Modules belong to Parts (groupings of modules), which are an attribute, not a separate object.

**Source evidence:** 11 modules fully specified in requirements doc §6. Modules appear in `lessons.ts` as a grouping attribute.

---

### 3. Lesson

**SIP validation:**
- Separate page? Yes — `src/pages/lessons/[slug].astro` confirms this.
- Multiple instances? Yes — many lessons per module.
- Persists independently? Yes — lesson content persists in the content system.

**Definition:** A single learning unit within a Module. Follows the typographic storytelling structure (Opening Scenario → Core Claim → Explanation → Inline Checks → Guided Practice → Summary). Has a title, slug, order, estimated_minutes, and published state.

**Source evidence:** Content collection structure in `src/content.config.ts`; `lesson_progress` table in schema.

---

### 4. Assessment

**SIP validation:**
- Separate page? Debatable — it may render within a lesson page, but it is a named, distinct learning event.
- Multiple instances? Yes — module assessments, milestone assessments (3), and the final assessment.
- Persists independently? Yes — the assessment exists as a content object with questions and scoring rules.

**Definition:** A scored set of questions associated with a Module, Milestone, or the full Course. Distinguished from Inline Checks by: it is scored with a pass threshold (80%), has defined passing criteria, and produces a completion state that gates progression.

**Distinction from Inline Check:** Inline checks are low-stakes engagement tools embedded in lesson flow. Assessments are gated checkpoints that must be passed.

**Source evidence:** §5 of requirements doc defines 4 levels of assessment.

---

### 5. Question

**SIP validation:**
- Separate page? No — Questions live within Lesson or Assessment pages.
- Multiple instances? Yes — many questions per lesson/assessment.
- Persists independently? Yes — questions have distinct content, type, correct answer, and feedback.

**Definition:** A single quiz item. Has a type (multiple choice, multiple select, true/false, scenario judgment, ordering, matching, short reflection, spot-the-issue), a stem, answer options, correct answer(s), and feedback text for each option. Belongs to either a Lesson (as an Inline Check) or an Assessment.

**SIP clarification:** Questions do not need their own page, but they persist as distinct content units with their own identity, feedback, and difficulty. They pass SIP on "instances" and "persistable" alone — the separate-page criterion is overruled by content persistence.

**Source evidence:** `quiz_responses` schema stores `question_index`; requirements §9 details question style and feedback requirements.

---

### 6. Response

**SIP validation:**
- Separate page? No.
- Multiple instances? Yes — one per (learner × question).
- Persists independently? Yes — stored in `quiz_responses` table.

**Definition:** A Learner's recorded answer to a Question. Captures selected_answer, whether it was correct, and timestamp. A response is distinct from the question itself — it belongs to the intersection of Learner and Question.

**Source evidence:** `quiz_responses` table (schema).

**Note:** Response is a junction object — it is the relationship artifact between Learner and Question. It needs to be in the model even though it has no standalone page.

---

### 7. Learner

**SIP validation:**
- Separate page? Yes — dashboard page.
- Multiple instances? Yes — many learners.
- Persists independently? Yes — `profiles` table.

**Definition:** A registered user of the platform who is enrolled in a Course. Has a display_name, email, enrolled_at date, and a Progress state across all Lessons and Assessments.

**Source evidence:** `profiles` table; `auth.users` in Supabase; `src/pages/dashboard.astro`.

**Role note:** Distinguished from Admin (course author/owner). Admin is a separate role — see Admin note below.

---

### 8. Progress

**SIP validation:**
- Separate page? Yes — the dashboard is essentially a Progress view.
- Multiple instances? Yes — each learner has progress per lesson.
- Persists independently? Yes — `lesson_progress` table.

**Definition:** A Learner's tracked state for a given Lesson or Assessment. Records whether the lesson has been started, completed, and what reflection_text was submitted. Progress is the system's record of a learner's journey through the Course.

**Source evidence:** `lesson_progress` table (schema); `DashboardProgress.tsx` component.

---

### 9. Certificate

**SIP validation:**
- Separate page? Yes — certificate view/download page.
- Multiple instances? Yes — one per qualifying learner.
- Persists independently? Yes — issued upon completion, should persist as a durable record.

**Definition:** A credential issued to a Learner who has completed all required Modules, passed all Module Assessments at ≥80%, passed all Milestone Assessments, and passed the Final Assessment. Has an issue date, learner name, and course name. May include a distinction level (≥90% average).

**Source evidence:** §13 of requirements doc; §15 MVP scope includes certificate criteria.

**Schema gap:** No `certificates` table exists yet.

---

### 10. Resource

**SIP validation:**
- Separate page? Yes — resources library page, plus individual resource pages.
- Multiple instances? Yes — 12+ downloadable framework templates specified.
- Persists independently? Yes — templates exist independently of any learner.

**Definition:** A downloadable or reusable framework, template, or tool associated with the course. Examples: Thoughtful Design Loop, Object Map Template, Assumption Audit, Human Variation Audit. Has a name, description, associated module(s), and a download/access mechanic.

**Source evidence:** §10 requirements doc lists 12 "Recommended reusable frameworks."

---

### 11. Post (Blog Post)

**SIP validation:**
- Separate page? Yes — each blog post has its own page.
- Multiple instances? Yes — ongoing editorial content.
- Persists independently? Yes — blog posts are evergreen content objects.

**Definition:** An editorial article on the platform covering topics related to Thoughtful Design practice — analysis, opinion, methodology, industry context. Has a title, author, publish date, topic tags, and body content. Different from a Lesson in that it is non-linear, non-assessed, and discoverable via blog index or search.

**Source evidence:** Blog is named in project scope; not yet built in codebase. Logged as gap.

---

### 12. Tenet

**SIP validation:**
- Separate page? Debatable — tenets may be a section of a Manifesto page rather than individual pages.
- Multiple instances? Yes — the Thoughtful Design Loop has 7 steps; the platform likely has 5–10 tenets.
- Persists independently? Yes — tenets are stable intellectual claims that persist independently of learners or content.

**Definition:** A core design principle or belief that anchors the Thoughtful Design philosophy. Examples drawn from requirements: "Design judgment means choosing what matters most under real constraints." "Accessibility is one way thoughtful design becomes real for more people." Tenets form the intellectual backbone of the platform's identity.

**SIP clarification:** Tenets may render as a collection within a single Manifesto page (not requiring individual pages), but they pass SIP on instances and persistability. They are content objects that can be authored, versioned, and referenced across courses.

**Source evidence:** §12 (voice/tone), §11 (Thoughtful Design Loop), throughout the requirements doc.

---

## Eliminated Candidates (failed SIP test)

| Candidate | Reason eliminated |
|---|---|
| Dashboard | It's a VIEW of Progress and Course data — not an object with its own identity |
| Part (Part 1–4) | It's an attribute of Module (part_number), not a standalone object — no separate lifecycle |
| Topic / Tag | It's an attribute of Lesson or Post — no separate page, no distinct lifecycle |
| Badge | Subsumed into Certificate for MVP — if a separate Badge system is added later, revisit |
| Section (of a lesson) | Part of Lesson content — no separate persistence or page |
| Meeting Invite | Out of scope (group mode) |
| Inline Check | It's a type-variant of Question, not a separate object — distinguished by a `type` attribute |
| Step (of Thoughtful Design Loop) | Rendered within Course/Manifesto content — attribute of Tenet cluster, not standalone |
| Exercise | Subsumed into Lesson as a content block type — does not need separate page or persistence in MVP |

---

## Validated Object List (summary)

| # | Object | Hub? | Has own page? | Schema status |
|---|---|---|---|---|
| 1 | Course | Yes | Yes (overview) | Gap — add table |
| 2 | Module | Yes | Yes (index) | Gap — inferred from lesson frontmatter |
| 3 | Lesson | Yes | Yes | Exists (content collection + lesson_progress) |
| 4 | Assessment | Yes | Within lesson/module | Gap — no explicit table |
| 5 | Question | No | No (within lesson/assessment) | Partial (quiz_responses.question_index) |
| 6 | Response | No | No | Exists (quiz_responses) |
| 7 | Learner | Yes | Yes (dashboard) | Exists (profiles) |
| 8 | Progress | No | Yes (dashboard) | Exists (lesson_progress) |
| 9 | Certificate | No | Yes | Gap — no table |
| 10 | Resource | No | Yes | Gap — not yet built |
| 11 | Post | No | Yes | Gap — not yet built |
| 12 | Tenet | No | Collection page | Gap — not yet built |

**Hub objects:** Course, Module, Lesson, Assessment, Learner (5 hub objects)
