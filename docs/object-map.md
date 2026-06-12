# Object Map — thoughtfulDesigner.io
## Phase 2–3 artifact | ORCA Step 04: Object Map Builder

Last updated: 2026-06-11
Format: Object · Attributes (priority: card / list / detail / search-filter-sort) · Relationships · Primary CTA

---

## Purpose

The Object Map is the "X-ray" of the system — a low-fidelity view of every object's attributes, key relationships, and primary action. This feeds the Attribute Prioritization step and informs card + page design.

---

## Object: Course

**Hub object. Top-level organizing unit.**

| Attribute | Display priority | Source |
|---|---|---|
| title | Card + detail | Requirements §1 |
| subtitle / tagline | Card | Requirements §1 ("A modern UX practice…") |
| description / promise | Detail | Requirements §1 ("By the end of…") |
| target_audience | Detail | Requirements §1 |
| part_count (4) | Detail | Requirements §7 |
| module_count (11) | Card | Requirements §6 |
| total_estimated_hours | Card | Calculated from lesson minutes |
| current_learner_count | Card (marketing) | Platform metric |
| certificate_offered | Card | Boolean — differentiator |
| published_at | Detail | Admin |
| version | Detail | Content versioning |

**Key relationships:** Has many Modules, has many Resources (library), has many Tenets

**Primary CTA:** Enroll (visitor) / Resume (learner)

**States:** preview (pre-enrollment) | in-progress (enrolled, not complete) | complete (all modules passed)

---

## Object: Module

**Hub object. Organizes lessons thematically.**

| Attribute | Display priority | Source |
|---|---|---|
| name | Card + list + detail | Requirements §6 |
| part_name (Part 1–4) | Card + list | Requirements §7 |
| part_number | Sort | Requirements §7 |
| order (1–11) | Card + list + sort | Requirements §7 |
| description (core claim) | Card | Requirements §6 (each module has a core claim) |
| lesson_count | Card | Derived |
| estimated_minutes | Card | Derived from lessons |
| learning_objectives | Detail | Requirements §6 |
| key_topics | Detail | Requirements §6 |
| assessment_pass_threshold | Detail | 80% (requirements §5.2) |
| loop_connection (Thoughtful Design Loop step) | Detail | Requirements §11 |
| status (learner-specific) | Card | not_started / in_progress / complete |

**Key relationships:** Belongs to Course, has many Lessons, has 1 Assessment (module), linked to Resources

**Primary CTA:** Start module (not started) / Continue (in progress) / Review (complete)

**States:** not_started | in_progress | completed | locked (if sequential access assumed)

---

## Object: Lesson

**Hub object. The core learning experience unit.**

| Attribute | Display priority | Source |
|---|---|---|
| title | Card + list + detail | Content frontmatter |
| slug | URL | Content frontmatter |
| order | Card + list + sort | Content frontmatter |
| module | Card + list | Content frontmatter |
| estimated_minutes | Card + list | Content frontmatter |
| published | Filter | Content frontmatter |
| core_claim | Detail | Requirements §3.1 |
| opening_scenario_summary | Card (teaser) | Requirements §3.1 |
| learning_objectives | Detail | Requirements §3.1 |
| inline_check_count | List | Derived |
| has_exercise | List | Boolean |
| has_resource | List | Boolean |
| loop_step_connection | Detail | Requirements §11 |
| completion_status (learner-specific) | Card | not_started / in_progress / complete |
| reflection_submitted | Card | Boolean (learner-specific) |

**Key relationships:** Belongs to Module, has many Questions (inline), may have Exercise, may have linked Resource

**Primary CTA:** Start lesson (not started) / Continue (in progress) / Mark complete (in progress, at end) / Review (complete)

**States:** not_started | in_progress | complete | locked

---

## Object: Assessment

**Hub object. The gated evaluation artifact.**

| Attribute | Display priority | Source |
|---|---|---|
| title | Detail | "Module 1 Assessment" etc. |
| type | Card | module / milestone / final |
| question_count | Card | Requirements §5 |
| pass_threshold | Detail | 80% (requirements §5.2) |
| time_limit | Detail | None stated — assumed untimed |
| associated_module or scope | Card | FK |
| learner_score (learner-specific) | Card | Derived from Responses |
| attempt_count (learner-specific) | Detail | Derived |
| status (learner-specific) | Card | not_started / attempted / passed / failed |
| unlock_condition | Detail | "Complete all module lessons" (assumed) |

**Key relationships:** Belongs to Module (1:1), has many Questions, referenced by Learner Progress

**Primary CTA:** Start assessment (unlocked, not attempted) / Retry (failed) / Review results (passed)

**States:** locked | unlocked | in_progress | passed | failed

---

## Object: Question

**Building block. Appears within Lesson (inline) or Assessment (scored).**

| Attribute | Display priority | Source |
|---|---|---|
| question_index | Sort | Schema |
| stem (question text) | Detail | Content |
| type | — | multiple_choice / multiple_select / true_false / scenario_judgment / ordering / matching / short_reflection / spot_the_issue |
| answer_options | Detail | Content array |
| correct_answer(s) | — | Content (hidden from learner pre-answer) |
| feedback_correct | Detail | Requirements §9.2 |
| feedback_incorrect_per_option | Detail | Requirements §9.2 |
| difficulty | — | early (identify/define) / mid (diagnose/apply) / late (evaluate/anticipate) |
| context_scenario | Detail | Which recurring scenario this uses (§9.4) |

**Key relationships:** Belongs to Lesson (inline) or Assessment (scored), has many Responses

**Primary CTA:** Select + Submit answer

---

## Object: Response

**Junction object. Records a learner's answer to a question.**

| Attribute | Display priority | Source |
|---|---|---|
| user_id | — | Schema |
| lesson_slug | — | Schema |
| question_index | — | Schema |
| selected_answer | — | Schema |
| correct | Card (feedback) | Schema |
| answered_at | — | Schema |
| attempt_number | — | Schema gap (currently not tracked) |

**Key relationships:** Belongs to Learner, references Question (by index within lesson_slug)

**Primary CTA:** None (Response is the result of Question interaction)

---

## Object: Learner

**Hub object. The person using the system.**

| Attribute | Display priority | Source |
|---|---|---|
| display_name | Card + dashboard | Schema |
| email | Account | auth.users |
| enrolled_at | Dashboard | Schema |
| avatar / initials | Card | Derived from display_name |
| modules_completed | Dashboard | Derived |
| lessons_completed | Dashboard | Derived |
| current_module | Dashboard | Derived (next incomplete) |
| certificate_earned | Dashboard | Boolean |
| assessment_average | Dashboard | Derived |

**Key relationships:** Has many Progress, has many Responses, has 0–1 Certificate

**Primary CTA:** Sign up (visitor) / View dashboard (learner)

**States:** visitor | enrolled | active_learner | completed | churned

---

## Object: Progress

**State record per learner × lesson.**

| Attribute | Display priority | Source |
|---|---|---|
| user_id | — | Schema |
| lesson_slug | — | Schema |
| reflection_text | Detail | Schema |
| completed_at | Card | Schema |
| updated_at | — | Schema |
| status (derived) | Card | not_started / in_progress / complete |
| time_spent (future) | Detail | Gap — not in schema |

**Key relationships:** Belongs to Learner, references Lesson

**Primary CTA:** Navigate to lesson (from dashboard progress view)

---

## Object: Certificate

**Credential issued upon course completion.**

| Attribute | Display priority | Source |
|---|---|---|
| learner_name | Card + detail | From Learner.display_name |
| course_name | Card | "Thoughtful Design" |
| issued_at | Detail | Timestamp |
| distinction | Card | Boolean (≥90% average) |
| certificate_id (unique) | Detail | UUID for verification |
| verification_url | Detail | Public URL for validation |

**Key relationships:** Belongs to Learner, references Course

**Primary CTA:** Download (PDF) | Share (LinkedIn URL)

---

## Object: Resource

**Downloadable template or framework.**

| Attribute | Display priority | Source |
|---|---|---|
| name | Card + list | Requirements §10 |
| description | Card | What the resource does |
| associated_module(s) | Card + filter | Which modules reference it |
| format | Card | PDF / printable HTML / interactive |
| download_url | — | File path |
| preview_image | Card | Thumbnail |
| download_count | — | Analytics |
| associated_loop_step | Detail | Thoughtful Design Loop connection |

**Key relationships:** Associated with Module(s) and Lesson(s), belongs to Course library

**Primary CTA:** Download

**12 resources specified in requirements:**
1. Thoughtful Design Loop
2. Object Map Template
3. System Consequence Map
4. Assumption Audit
5. Research Question Builder
6. Facilitation Planner
7. Design Rationale Template
8. Interaction Design Heuristic Checklist
9. Human Variation Audit
10. Ethical Risk Review
11. AI Judgment Checklist
12. Design Decision Record

---

## Object: Post (Blog Post)

**Editorial article. Discovery and authority-building.**

| Attribute | Display priority | Source |
|---|---|---|
| title | Card + list + detail | |
| slug | URL | |
| author | Card | |
| published_at | List | |
| topic_tags | Card + filter | |
| excerpt / summary | Card | |
| estimated_read_minutes | Card | |
| related_modules | Detail | Bridge to course |
| related_resources | Detail | Bridge to resource |
| hero_image | Card | |

**Key relationships:** Loosely associated with Modules + Resources (through tags); isolated in MVP (see NOM)

**Primary CTA:** Read post | Navigate to course

---

## Object: Tenet

**Core design principle. Platform identity.**

| Attribute | Display priority | Source |
|---|---|---|
| statement | Card | The principle itself (1–2 sentences) |
| elaboration | Detail | 2–3 sentence expansion |
| loop_connection | Detail | Which Thoughtful Design Loop step it relates to |
| order / priority | Sort | Display sequence |
| module_connection(s) | Detail | Which modules teach this tenet in depth |

**Key relationships:** Associated with Course, loosely connected to Modules

**Primary CTA:** Read manifesto (at collection level)

**Draft tenets (from requirements doc themes):**
1. "A screen is only the visible surface of a deeper system."
2. "Before you design what people do, understand what they are working with."
3. "Every design decision changes behavior somewhere in the system."
4. "Research is not just validation. It is how teams learn what reality is asking of them."
5. "Design judgment means choosing what matters most under real constraints."
6. "Good design respects human variation."
7. "Thoughtful designers consider what their work makes easier, harder, normal, hidden, rewarded, or risky."
8. "AI can accelerate design work, but thoughtful designers remain responsible for judgment."
9. "The next generation of UX requires stronger thinking, not just stronger tools."

---

## Meta-Attribute Notes

**Sorts:**
- Lessons: by `module` then `order`
- Modules: by `part_number` then `order`
- Posts: by `published_at` desc (most recent first)
- Resources: by `associated_module` order or alphabetical

**Filters:**
- Lessons: by `published`, by `module`, by completion status (learner view)
- Posts: by `topic_tags`
- Resources: by `associated_module`
- Assessments: by `type` (module / milestone / final)

**Search:**
- Lessons: full text on title + core_claim (future)
- Posts: full text on title + excerpt
- Resources: full text on name + description
