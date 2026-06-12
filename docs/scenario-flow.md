# Scenario Flow Map — thoughtfulDesigner.io
## Phase 4 artifact | Synthesis + Reconciliation Gate

Last updated: 2026-06-11
Reconciliation Gate: Standard tier — user mental model vs. ROFL system model divergences logged.

---

## User Role in Focus

**Primary:** Learner — mid-career UX/product designer, 2–8 years experience, self-directed, likely paying individually (not enterprise).

**Secondary (named, not designed for in this sprint):** Admin / Course Author.

---

## Mental Models

### Learner's Mental Model

What a mid-career designer expects based on prior experience with courses, learning platforms, and professional development:

| Expectation | Tag |
|---|---|
| "I should be able to browse what the course covers before I pay" | assumed |
| "I want to see the full module list with topic names so I can assess relevance" | assumed |
| "I expect to start a lesson and pick up where I left off next time" | borrowed (industry norm: Coursera, LinkedIn Learning) |
| "I want to know roughly how long each lesson takes before I start it" | assumed |
| "I expect inline quizzes to give me instant feedback, not store points" | assumed (low-stakes mindset) |
| "I want to feel like I'm progressing — checkboxes or completion indicators" | assumed |
| "A certificate means something if it's from a credible source and I earned it" | assumed |
| "I'm suspicious of courses that are just slide decks — I want something intellectually engaging" | assumed (target audience sophistication) |
| "I'll probably access this on my laptop, sometimes on my phone" | assumed |
| "I want to be able to share good content from here — a blog article, a template" | assumed |

### ROFL System Model (current code reality)

What the system actually does based on codebase review:

| System behavior | Tag |
|---|---|
| Auth-gated course content (login required to browse lessons) | observed |
| Lesson content in MDX files, published via frontmatter flag | observed |
| `lesson_progress` tracks completion + reflection text | observed |
| `quiz_responses` stores per-question answers | observed |
| No progress visualization on dashboard yet (component exists but minimal) | observed |
| No sequential lesson unlock — learners can jump to any lesson | observed |
| No blog, resources library, or tenets page | observed |
| No landing page beyond basic hero/module list | observed |
| No certificate system | observed |

### Divergences (Reconciliation Gate)

| # | User mental model | System model | Direction |
|---|---|---|---|
| D-01 | "I can browse before I commit" | Course content requires login | **Adapt UI:** Landing page must show curriculum preview without auth; course overview accessible to visitors |
| D-02 | "I'll pick up where I left off" | No explicit resume mechanism | **Adapt UI:** Dashboard must feature Resume CTA prominently; requires "last_visited_lesson" logic |
| D-03 | "Quizzes are low-stakes and immediate" | `quiz_responses` stores all answers with `correct` boolean | **Adapt UI:** Inline checks should feel conversational, not high-stakes; no visible running score |
| D-04 | "I'm making progress" | No progress bar or visual indicator in current UI | **Adapt UI:** Progress visualization is required, not optional |
| D-05 | "There's something here beyond the course" | No blog, resources, or manifesto | **Build:** Landing, blog, resources, tenets all need design and build |
| D-06 | "Sequential or open?" | No unlock logic — fully open | **Decide:** For MVP, open access is correct (no frustrating gates); surface completion state without blocking |

**ROFL-change proposals:** 0. All divergences resolved by adapting UI language or adding missing surfaces, not by changing the underlying data model.

**Note on D-06:** No `assumed` user-model element is driving an irreversible decision. The open-access model is a reversible choice that can be locked down without data migration.

---

## Scenarios

### Scenario 1: Discovery → Enrollment (Visitor flow)

**User:** A mid-career product designer searching for systems-level UX education. Finds thoughtfulDesigner.io via a blog post, LinkedIn share, or organic search.

**Goal:** Decide whether to enroll.

**Flow steps:**

1. Lands on the blog post (or directly on landing page)
2. Reads enough to feel the platform's POV is credible and distinctive
3. Navigates to landing page (or is already there)
4. Reads the value proposition: what the course teaches and why it matters
5. Sees the curriculum overview: 11 modules, 4 parts, estimated time
6. Reads about the instructor / platform voice / Thoughtful Design philosophy
7. Finds the tenets / manifesto — confirms this is a serious, opinionated course
8. Sees pricing and certificate information
9. Clicks "Enroll" → creates account → lands on dashboard or first lesson

**Pages touched:** Landing → Blog Post (optional) → Tenets/Manifesto → Enroll/Signup → Dashboard

**Divergences addressed:** D-01 (no auth wall before enrollment), D-05 (blog + tenets must exist)

---

### Scenario 2: First Session (New learner, first lesson)

**User:** Just enrolled. Wants to get started and understand what they signed up for.

**Goal:** Complete at least the first lesson and feel oriented.

**Flow steps:**

1. Lands on dashboard post-enrollment
2. Dashboard shows Course overview + Module 1 as starting point
3. Clicks "Start Module 1" → Module 1 index page
4. Reads module context (core claim, what they'll learn)
5. Clicks first lesson → Lesson page
6. Reads through narrative structure (Story → Concept → Example)
7. Encounters first inline check → answers → gets immediate feedback
8. Completes lesson content
9. Submits reflection prompt (optional but prompted)
10. Clicks "Mark complete" → next lesson appears
11. Returns to dashboard — sees progress updated

**Pages touched:** Dashboard → Module 1 Index → Lesson 1.1 → Lesson 1.2 (or back to Dashboard)

**Divergences addressed:** D-03 (immediate inline feedback), D-04 (progress update after completion)

---

### Scenario 3: Returning Learner (Mid-course re-entry)

**User:** Learner who completed 3 lessons two weeks ago. Returning after a break.

**Goal:** Remember where they were and get back into the flow quickly.

**Flow steps:**

1. Logs in → lands on dashboard
2. Dashboard prominently shows "Resume" → their next incomplete lesson
3. Optionally scans module progress summary to reorient
4. Clicks Resume → taken directly to Lesson 1.4 (their next lesson)
5. Completes lesson → advances
6. Dashboard updates to reflect new completion

**Pages touched:** Login → Dashboard → Lesson 1.4 (next incomplete)

**Key requirement from D-02:** The Resume CTA must be the most prominent action on the dashboard.

---

### Scenario 4: Assessment Taking

**User:** Learner who has completed all lessons in Module 1. Ready for the module assessment.

**Goal:** Pass the Module 1 assessment on first attempt.

**Flow steps:**

1. Module 1 Index page shows assessment as available (all lessons complete)
2. Clicks "Take assessment"
3. Assessment renders: 8–15 questions, scenario-based
4. Answers questions in order; no time limit
5. Submits assessment
6. Sees score + pass/fail + detailed feedback per question
7. If pass (≥80%): sees module completion celebration + "Start Module 2"
8. If fail: sees retry option + which concepts to review

**Pages touched:** Module 1 Index → Assessment → Assessment Results → Module 2 (or retry)

**Divergences addressed:** D-05 is irrelevant here (already enrolled). This flow is clean in the current model.

---

### Scenario 5: Certificate and Completion

**User:** Learner who has completed all 11 modules and the final assessment.

**Goal:** Get their certificate and share it.

**Flow steps:**

1. Dashboard shows course complete
2. Final Assessment passed at ≥80%
3. Certificate generated automatically
4. Dashboard shows certificate card with "Download" and "Share to LinkedIn" CTAs
5. Learner downloads PDF
6. Learner copies LinkedIn share URL

**Pages touched:** Dashboard → Certificate View

---

### Scenario 6: Resource Browsing (Learner or Visitor)

**User:** A designer who found the Resources Library via search, blog, or course recommendation.

**Goal:** Download a relevant framework template.

**Flow steps:**

1. Lands on Resources Library page
2. Sees grid of 12 framework templates with names, descriptions, associated modules
3. Filters by topic or module (optional)
4. Reads description of "Object Map Template"
5. Clicks "Download" (PDF or printable HTML)
6. Gets the resource
7. Sees "This template is taught in Module 2: Object-Oriented UX" → link to course

**Pages touched:** Resources Library → (optional) Course enrollment bridge

---

## Derived Page List

From the scenarios above, these pages are required:

| Page | URL pattern | Object(s) served | Authenticated? |
|---|---|---|---|
| Landing Page | `/` | Course, Tenets (teaser) | No |
| Signup | `/signup` | Learner | No |
| Login | `/login` | Learner | No |
| Dashboard | `/dashboard` | Learner, Progress, Certificate | Yes |
| Course Overview | `/course` | Course, Module list | Yes (or semi-public) |
| Module Index | `/course/modules/[slug]` | Module, Lesson list, Assessment | Yes |
| Lesson | `/lessons/[slug]` | Lesson, Questions (inline), Exercise | Yes |
| Assessment | `/course/modules/[slug]/assessment` (or within module page) | Assessment, Questions | Yes |
| Assessment Results | Same page, post-submit state | Assessment, Responses | Yes |
| Certificate | `/certificate` or `/dashboard#certificate` | Certificate | Yes |
| Resources Library | `/resources` | Resource collection | No (semi-public) |
| Resource Detail | `/resources/[slug]` | Resource | No |
| Blog Index | `/blog` | Post collection | No |
| Blog Post | `/blog/[slug]` | Post | No |
| Tenets / Manifesto | `/about` or `/tenets` | Tenet collection | No |

---

## Goal-Page Map

| User goal | Entry page | Exit page | Key CTA |
|---|---|---|---|
| Decide to enroll | Landing | Signup | Enroll |
| Get oriented after enrolling | Dashboard | Lesson 1.1 | Start / Resume |
| Complete a lesson | Lesson | Dashboard | Mark complete |
| Take a module assessment | Module Index | Assessment Results | Start assessment |
| Get certificate | Dashboard | Certificate | Download |
| Find a framework template | Resources Library | Resource download | Download |
| Explore course ideas | Blog | Landing or Course | Read + Enroll |
| Understand what the platform stands for | Tenets | Landing or Course | Navigate to course |

---

## Constraint Design Moves

| Constraint | Design move |
|---|---|
| No sequential lesson unlock (open access) | Use visual completion state (checkmark, progress bar) to guide without gating |
| Auth required to access course content | Landing page must preview curriculum without requiring login; teaser module cards show module names + lesson count |
| No CMS — content managed in MDX | No admin UI needed in MVP; content changes are code deployments |
| Assessment retry unlimited | UI should surface feedback prominently between retries to prevent mechanical clicking |
| Certificate has no real verification system yet | Show certificate_id and issue date; note "verification coming soon" or build simple public verification URL |
| Mobile learners likely | Lesson reading must be clean single-column on mobile; inline checks must use large touch targets |
