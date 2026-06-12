# Wireframe Plan — thoughtfulDesigner.io
## Phase 6 artifact | Navigation Blueprint + Page Architecture

Last updated: 2026-06-11
Based on: Concept B — The Structured Program (selected in P5)

---

## Information Architecture Overview

**Concept B structural principles:**
- Landing page is a standalone marketing surface (no auth required)
- Course content is auth-gated (enrolled learners only)
- Blog and Resources are public discovery surfaces
- Tenets/Manifesto appear on the landing page as a section (not a separate page in MVP)
- Clear separation between marketing zone (/, /blog, /resources) and learning zone (/course, /lessons, /dashboard)

---

## Global Navigation

### Public navigation (unauthenticated)

```
[thoughtfulDesigner.io logo]   Course   Blog   Resources   [Log in]   [Enroll →]
```

- **Course** → points to landing page `#curriculum` anchor (shows module list teaser)
- **Blog** → `/blog`
- **Resources** → `/resources`
- **Log in** → `/login`
- **Enroll →** → `/signup` (primary CTA, button style)

### Authenticated navigation

```
[thoughtfulDesigner.io logo]   Course   Blog   Resources   [Dashboard]   [account avatar/initials]
```

- **Course** → `/course` (module index, auth-gated)
- **Dashboard** → `/dashboard`
- **Account** → dropdown: Profile, Sign out

---

## Page Blueprints

---

### Page 1: Landing Page (`/`)

**Template:** Marketing — distinct from course page templates.

**Purpose:** Convert a curious visitor into an enrolled learner. Earn trust before asking for commitment.

**Sections (top to bottom):**

#### 1.1 Hero
- **Content:** Course title "Thoughtful Design" + positioning tagline (1 sentence) + 2 CTAs: [Enroll now] [See the curriculum]
- **Edge state (empty):** N/A — hero is static
- **What good looks like:** Visitor understands in 5 seconds that this is a course for mid-career UX designers who want to design systems, not just screens

#### 1.2 Value Proposition
- **Content:** 3–4 short paragraphs answering: What will you learn? Why does it matter now? Who is this for? What makes this different from other UX courses?
- **Edge state:** N/A — static

#### 1.3 Curriculum Preview
- **Content:** 4 parts → 11 modules displayed as cards. Each card: module number, name, core claim (1 sentence), estimated minutes. Cards are NOT links (no auth required to see, but clicking a card shows a locked icon or "Enroll to access")
- **Edge state (loading):** Skeleton cards while lesson data fetches
- **Edge state (error):** "Curriculum preview unavailable — [view full outline]" fallback link to static syllabus

#### 1.4 How It Works (Learning Method)
- **Content:** 5-step visual showing the typographic storytelling structure: Story → Concept → Example → Question → Application. One concrete example per step.
- **Edge state:** N/A — static

#### 1.5 Tenets / Manifesto (inline section — MVP)
- **Content:** 3–5 selected tenets as large typographic pull quotes. No sub-page in MVP.
- **Edge state:** N/A — static

#### 1.6 What's Included
- **Content:** Module assessments, certificate, resources library, self-led format (no deadlines). Counter stats if available (learner count, course hours).
- **Edge state (loading):** Learner count shows skeleton/placeholder until loaded

#### 1.7 Instructor / Author Signal
- **Content:** Brief bio section establishing the platform author's credibility and POV. Photo or illustrated portrait.
- **Edge state:** N/A — static

#### 1.8 Enrollment CTA
- **Content:** Final conversion section. Price, what's included, primary CTA: [Enroll in Thoughtful Design].
- **Edge state:** If payment/billing not yet enabled — "Join the waitlist" variation

#### Footer
- Copyright, privacy policy, terms of service, contact

---

### Page 2: Dashboard (`/dashboard`)

**Template:** Application — auth-required.

**Purpose:** Learner's home base. Shows where they are, motivates forward progress, surfaces their certificate when earned.

**Sections:**

#### 2.1 Welcome + Resume block
- **Content:** "Welcome back, [name]" + **Resume CTA**: [Continue → Lesson X.X: [title]] — the most prominent element on the page. If not started: [Start Module 1 →]
- **Edge state (empty — new user):** "You're enrolled in Thoughtful Design. Ready to begin? [Start Module 1 →]"
- **Edge state (complete):** "You've completed the course. [Download your certificate]"
- **Edge state (loading):** Skeleton for Resume block

#### 2.2 Progress Overview
- **Content:** 11 module progress cards. Each card: module name, lesson completion count (e.g. "3/4 lessons"), status indicator (not started / in progress / complete), assessment status.
- **Edge state (all not started):** All cards show "not started" state — light/neutral color
- **Edge state (all complete):** All cards show "complete" — celebration indicator

#### 2.3 Module Assessment Status strip
- **Content:** Compact row showing which module assessments have been passed, failed, or not yet taken.
- **Edge state (loading):** Skeleton row

#### 2.4 Certificate block (conditional — show when earned)
- **Content:** Certificate preview card with [Download PDF] and [Share to LinkedIn] CTAs.
- **Edge state (not earned):** "Complete all modules and assessments to earn your certificate" — low-key, not a blocker.

---

### Page 3: Course Overview / Module Index (`/course`)

**Template:** Application — auth-required. Equivalent to current `/course/index.astro`.

**Purpose:** Browse the full module structure; navigate to any module.

**Sections:**

#### 3.1 Course header
- **Content:** "Thoughtful Design" title, your overall progress summary (X of 11 modules complete)

#### 3.2 Parts and Modules
- **Content:** 4 parts, each with 3 modules listed (Module 11 is in Part 4). Each module row shows: number, name, lesson count, estimated minutes, status badge.
- **Edge state (loading):** Skeleton list
- **Edge state (no lessons published):** "Coming soon" state for unpublished modules

---

### Page 4: Module Index (`/course/modules/[slug]`)

**Template:** Application.

**Purpose:** Show module context and lesson list; access the module assessment.

**Sections:**

#### 4.1 Module header
- **Content:** Part name, Module number + title, core claim (pull quote), learning objectives (collapsed by default), estimated time.

#### 4.2 Lesson list
- **Content:** Ordered list of lessons with: lesson number, title, estimated minutes, completion status (not started / complete). Each row is a link.
- **Edge state (loading):** Skeleton list
- **Edge state (no lessons published):** "Lessons coming soon" state

#### 4.3 Module Assessment block
- **Content:** Assessment card showing: pass threshold (80%), question count, your status (locked / available / passed / failed). CTA: [Start assessment] or [Retry] or [Review results].
- **Unlock condition:** Shown always; enabled when all module lessons are complete.
- **Edge state (locked):** Assessment card shows lock icon + "Complete all lessons to unlock"
- **Edge state (passed):** Card shows score + pass badge

---

### Page 5: Lesson (`/lessons/[slug]`)

**Template:** Application + Reading — existing template, needs enhancement.

**Purpose:** The core learning experience.

**Layout:** Single-column reading layout. Max-width for comfortable line length (~65ch). Left/right padding on mobile.

**Sections (in lesson content flow):**

#### 5.1 Lesson header
- **Content:** Module name (breadcrumb), lesson number + title, estimated minutes.

#### 5.2 Lesson body (MDX content)
Follows typographic storytelling structure:
- Opening scenario block (distinct callout style)
- Core claim (large typographic pull quote)
- Explanation sections (standard prose)
- Inline checks (Quiz component — embedded)
- Practice exercise (distinct callout)
- Common traps section
- Summary

#### 5.3 Reflection prompt
- **Content:** ReflectionPrompt component — text area with submit button.
- **Edge state (submitted):** Shows submitted text with edit option
- **Edge state (loading/saving):** Saving indicator
- **Edge state (error):** "Couldn't save reflection — [retry]"

#### 5.4 Lesson complete action
- **Content:** LessonComplete component — [Mark complete] button.
- **Edge state (already complete):** Shows completion indicator + "Continue to [next lesson]" CTA
- **Edge state (loading):** Button disabled while saving

#### 5.5 Navigation footer
- **Content:** Previous lesson ← | Next lesson → navigation; back to module link.

---

### Page 6: Assessment (`/course/modules/[slug]/assessment`)

**Template:** Application — focused view (no sidebar or distracting nav).

**Purpose:** Take the module assessment. Scored, with feedback.

**Layout considerations:** Each question on its own screen or paginated (not all at once — avoids cognitive overload).

**Sections:**

#### 6.1 Assessment header
- **Content:** Module name, "Module Assessment", question count, pass threshold.

#### 6.2 Question view (per question)
- **Content:** Question number/total (e.g. "Question 3 of 12"), question stem, answer options.
- **Edge state (not answered):** Options unselected; Next button disabled
- **Edge state (answered, not submitted):** One option selected; Next active
- **Edge state (feedback shown, correct):** Correct indicator + why-correct explanation
- **Edge state (feedback shown, incorrect):** Incorrect indicator + why this was wrong + what was correct

#### 6.3 Assessment results
- **Content:** Score (percentage), pass/fail status, [Review answers] CTA, [Retry assessment] (if failed), [Continue to Module N] (if passed).
- **Edge state (pass):** Celebration — clear pass, score displayed prominently
- **Edge state (fail):** Empathetic fail state — which areas to review; retry available
- **Edge state (error saving):** "Your answers weren't saved — [try again]"

---

### Page 7: Blog Index (`/blog`)

**Template:** Editorial.

**Purpose:** Browse editorial content. Discovery surface for organic traffic.

**Sections:**

#### 7.1 Blog header
- **Content:** "The Thoughtful Design Blog" + brief description (1–2 sentences) + [Back to course] for enrolled learners.

#### 7.2 Post grid
- **Content:** Post cards in grid: hero image (if available), title, topic tags, excerpt, date, estimated read time.
- **Edge state (loading):** Skeleton cards
- **Edge state (empty):** "No posts yet — check back soon" + [Be notified when we publish]

#### 7.3 Topic filter (future — MVP: show all)
- **Content:** Filter by topic tag.

---

### Page 8: Blog Post (`/blog/[slug]`)

**Template:** Editorial — long-form reading.

**Sections:**

#### 8.1 Post header
- **Content:** Title, topic tags, date, estimated read time, author.

#### 8.2 Post body
- **Content:** Long-form MDX content in single-column reading layout.

#### 8.3 Course CTA (inline, end of post)
- **Content:** "Ready to go deeper? [Enroll in Thoughtful Design →]" — conversion bridge from blog to course.
- **Edge state (already enrolled):** Show "Continue learning → [Resume course]" instead of enrollment CTA.

---

### Page 9: Resources Library (`/resources`)

**Template:** Editorial + utility.

**Purpose:** Browse and download framework templates.

**Sections:**

#### 9.1 Resources header
- **Content:** "Frameworks and Templates" + brief description. No auth required.

#### 9.2 Resource grid
- **Content:** Cards for each of the 12 resources. Each card: name, description (what it's for), associated module/topic, format (PDF/printable), [Download] button.
- **Edge state (loading):** Skeleton cards
- **Edge state (empty):** Should never be empty at launch — 12 resources specified in requirements
- **Edge state (download error):** "Download unavailable — [contact support]"

#### 9.3 Module filter
- **Content:** Filter resources by associated module (e.g. "Module 4: Research"). Chips or dropdown.

---

### Page 10: Certificate (`/certificate` or `/dashboard#certificate`)

**Template:** Application — celebration state.

**Purpose:** View, download, and share the completion certificate.

**Sections:**

#### 10.1 Certificate display
- **Content:** Formatted certificate with learner name, course name ("Thoughtful Design"), completion date, distinction badge if applicable.
- **Edge state (not yet earned):** Redirect to dashboard with message "Complete the course to earn your certificate"

#### 10.2 Actions
- **Content:** [Download PDF], [Share to LinkedIn], [Copy link]

---

## Navigation Flow Diagram (text)

```
PUBLIC ZONE (no auth required)
  / (Landing) ──────────────────────────────────────────────── /signup
    ├── #curriculum (anchored section)                          /login
    ├── #tenets (anchored section)                              
    └── /blog ──────────────────────────── /blog/[slug]
         └── [CTA] → /signup                   └── [CTA] → /signup (or /course)
    └── /resources ──────────────────────── /resources/[slug] (if individual pages)

LEARNING ZONE (auth required)
  /dashboard ──────────────────────────────────────────────────
    └── [Resume] → /lessons/[slug]
    └── [Module card] → /course/modules/[slug]
    └── [Certificate] → /certificate
  
  /course ─────────────────────────────────────────────────────
    └── [Module] → /course/modules/[slug]
                       └── [Lesson] → /lessons/[slug]
                                          └── [Next] → /lessons/[next-slug]
                                          └── [Mark complete] → updates progress
                       └── [Assessment] → /course/modules/[slug]/assessment
                                              └── [Results] → pass → /course/modules/[next-slug]
                                                            → fail → retry or /course/modules/[slug]
```

---

## Anti-Pattern Checks

### Isolated Objects (navigation dead ends)
- **Post → Course** bridge: Every blog post ends with enrollment CTA. ✓ Mitigation applied.
- **Tenet → Course** bridge: Tenets section on landing page has inline enrollment CTA. ✓ Mitigation applied.
- **Resource → Lesson** bridge: Resource card shows "Taught in Module X" with link to course. ✓ Mitigation applied.

### Masked Objects (different objects looking the same)
- Blog Post and Lesson use DIFFERENT templates. Blog post = editorial template. Lesson = reading + interactive template. Never the same visual treatment. ✓
- Assessment uses a FOCUSED template (no standard nav). Lesson uses standard nav. ✓
- Module Index and Course Overview are distinct pages with distinct visual hierarchy. ✓

### Broken Objects (objects you can see but can't act on)
- Locked assessment: shows locked state with clear unlock condition — not invisible, not broken.
- Lessons for unenrolled visitors: show a preview teaser (core claim + scenario opening) with auth gate at content depth, not at link click.

### Shapeshifters (same object looking different in different contexts)
- Lesson card on Module Index and on Dashboard must share the same visual identity (same attributes shown, same status indicator pattern).
- Module card on Landing Preview and on /course must use the same structure even if different visual weight.

---

## Edge States Master List

| Page | Edge state | Treatment |
|---|---|---|
| Landing — curriculum preview | Loading | Skeleton cards |
| Landing — curriculum preview | Error (fetch failed) | Static fallback: "View full curriculum" link to static HTML |
| Landing — learner count | Loading | Skeleton / hidden until loaded |
| Dashboard | New user (no progress) | Empty state with Start CTA |
| Dashboard | Completed course | Certificate celebration state |
| Dashboard | Loading | Skeleton for Resume block + progress cards |
| Module Index | No lessons published | "Coming soon" per module |
| Module Index | Loading | Skeleton list |
| Lesson — reflection | Error saving | Retry prompt |
| Lesson — mark complete | Loading | Button disabled |
| Assessment | Network error on submit | Error state with retry |
| Assessment results | Pass | Celebration + continue CTA |
| Assessment results | Fail | Empathetic + retry + review |
| Blog Index | No posts | Empty state with subscribe CTA |
| Resources | Download error | Error with contact link |
| Certificate | Not yet earned | Redirect to dashboard + message |

---

## Component Reuse Notes

**Shared components that need consistent spec:**
- `ModuleCard` — used on Landing (preview, no link), /course (full, linked), Dashboard (with progress state)
- `LessonRow` — used on Module Index and Dashboard progress section
- `ProgressBar` — used on Dashboard and potentially Module Index header
- `AssessmentStatusBadge` — used on Module Index and Dashboard
- `EnrollmentCTA` — used on Landing (hero), Landing (footer CTA), Blog Post (footer), Resources page
- `Quiz` — inline check variant (immediate feedback, low-stakes) and Assessment variant (scored, paginated)
