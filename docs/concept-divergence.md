# Concept Divergence — thoughtfulDesigner.io
## Phase 5 artifact | P5 Divergence + Selection Gate

Last updated: 2026-06-11
Selection Gate: Standard tier — required. Concepts scored on user success criteria + business metric.

---

## Divergence Brief

**Problem statement (locked from P3):** Mid-career UX designers lack a rigorous, opinionated systems-level course delivered through a platform that earns trust, communicates intellectual depth, and supports self-directed completion without synchronous facilitation.

**In-scope objects:** Course, Module, Lesson, Assessment, Progress, Certificate, Resource, Post, Tenet

**Primary user:** Mid-career UX/product designer (2–8 years), self-directed, intellectually discerning.

**Success criteria for concept scoring:**
1. **Comprehension rate:** A visitor to the landing page can correctly articulate what the course teaches and who it's for within 60 seconds.
2. **Enrollment momentum:** The flow from landing → signup has a clear, motivated path with no friction surprises.
3. **Lesson completion rate:** The in-course experience motivates forward progress through all 11 modules.
4. **Business metric:** Organic discovery → paid enrollment conversion (landing page drives 5%+ visitor-to-enrollment rate from non-paid traffic).

---

## Concept A: The Intellectual Journal

**Hub object:** Lesson (lessons as primary navigation anchor)
**Flow spine:** Browse → Read a lesson → Get hooked → Enroll → Continue reading
**Primary action:** Read

### Description

The platform presents itself like a serious intellectual publication — Stripe Press meets UX education. The landing page features the Tenets and a curated selection of public lessons (2–3 per module made freely accessible as samples). The information architecture centers on the course content itself as the marketing. Blog and course lessons share a similar template, creating seamless continuity between "reading for free" and "learning as a member."

Navigation: `Read (free samples) → Course → Resources → Blog`

The course content is the product page. Learners discover a lesson, read it, get value, and the enrollment CTA appears naturally at the end of every public lesson.

**Structural distinctives:**
- Lesson-first architecture (lessons appear before "what is this course?")
- 2–3 lessons per module made publicly accessible (no login required)
- Blog and lesson share a near-identical template
- Landing page foregrounds sample content, not a traditional hero with CTA

### User success criteria scoring

| Criterion | Score (1–5) | Reasoning |
|---|---|---|
| Comprehension (60-sec clarity) | 3 | Visitors who land mid-lesson may not understand the full course scope; requires scrolling to find the course structure |
| Enrollment momentum | 3 | Content-first approach is slower to convert; works well for discerning buyers but introduces friction for casual browsers |
| Lesson completion rate | 5 | If you're already reading, the transition from "free sample" to enrolled learner is smooth; in-course momentum is high |
| Business metric (organic conversion) | 3 | Content-first is SEO-friendly and earns authority; but conversion rate may be below 5% without a clearer enrollment moment |
| **Total** | **14/20** | |

### Business metric score: 3/5
Content-as-product works for building a loyal audience. Conversion rate will be moderate. Long-term SEO benefit is high. Year-1 paid conversion from organic may land around 2–4%.

### Weaknesses (adversarial review)
- A designer browsing a lesson doesn't know if the platform is a blog or a course — mission dilution.
- The free/paid boundary is blurry; some users will read freely and never enroll.
- "Content paywall" fatigue is real: designers who hit the auth wall mid-lesson may bounce.

---

## Concept B: The Structured Program

**Hub object:** Course / Module (the program structure as primary navigation anchor)
**Flow spine:** Landing → Curriculum overview → Philosophy/tenets → Enroll → Dashboard → Module 1
**Primary action:** Enroll → Complete

### Description

The platform presents itself as a rigorous professional program. The landing page is a standalone marketing surface — persuasive, opinionated, clear about who this is for, and explicit about what the learner will gain. The curriculum is shown in full (all 11 modules with titles, descriptions, estimated time) but the content is gated behind enrollment. The tenets/manifesto is a prominent section of the landing page, not a separate page. Blog and resources are secondary discovery surfaces, linked from the landing page but not the structural center.

Navigation: `Landing (marketing) → Course (program) → Dashboard (progress) | Blog | Resources`

The learning experience is deliberately "program-like" — sequential modules with assessments, a completion ceremony, a certificate. The platform earns authority through the quality of the curriculum structure, not free content samples.

**Structural distinctives:**
- Landing page is its own distinct template from course content
- Curriculum is fully previewed but access-gated
- Module structure is the primary navigational frame
- Blog/resources are SEO-secondary; not structurally central
- Assessment pass gates are visible and prominent (communicates rigor)

### User success criteria scoring

| Criterion | Score (1–5) | Reasoning |
|---|---|---|
| Comprehension (60-sec clarity) | 5 | Clear hero statement + module list immediately answers "what is this and who is it for" |
| Enrollment momentum | 5 | Landing → Signup is a clear, motivated path; no content ambiguity |
| Lesson completion rate | 3 | Once enrolled, learners need strong in-lesson motivation mechanics; "program" framing creates commitment |
| Business metric (organic conversion) | 4 | Clear value prop improves landing page conversion; lower organic SEO surface (no free content) |
| **Total** | **17/20** | |

### Business metric score: 4/5
Higher landing-page conversion likely (5–8%) but lower organic discovery than Concept A. Works well if paid acquisition or referral is a channel. Lower long-term SEO footprint.

### Weaknesses (adversarial review)
- "Program" framing may feel like a commitment that intimidates casual browsers who aren't ready to commit.
- No free sample content means lower organic SEO surface and no "free trial" trust-building.
- Module-locked content could feel bureaucratic for designers who want to jump to specific topics.

---

## Concept C: The Practice Hub

**Hub object:** Resource + Tenet (platform identity as primary anchor; course is one offering within a broader practice space)
**Flow spine:** Discover (blog/resources/tenets) → Understand POV → Trust the platform → Enroll as part of a practice
**Primary action:** Explore → Belong → Learn

### Description

The platform is a practice hub for thoughtful designers — a place to return to regularly, not just to take a course. The landing page is a manifesto: "This is what it means to design thoughtfully." The course, resources, and blog are all first-class offerings within the hub. Enrollment is positioned as joining a practice, not buying a product. The Tenets are the structural anchor — they organize the content on the landing page, connect to module topics, and appear throughout the course.

Navigation: `Home (manifesto + hub) → Course | Resources | Blog | Tenets`

**Structural distinctives:**
- Tenets are the navigational/identity spine, not a secondary marketing page
- Landing page is a manifesto with embedded discovery paths to course, resources, blog
- "Joining the course" is framed as joining a community of practice (even without community features in MVP)
- Resources and blog are co-equal discovery paths, not secondary
- Future: community, cohort, and peer features would be natural extensions

### User success criteria scoring

| Criterion | Score (1–5) | Reasoning |
|---|---|---|
| Comprehension (60-sec clarity) | 3 | Platform identity is clear but "what is the course?" takes more scrolling to answer |
| Enrollment momentum | 2 | Joining a practice is a higher-trust, longer commitment; friction before enrollment |
| Lesson completion rate | 4 | "Practice" identity creates ongoing motivation — this is a place learners return to, not just check off |
| Business metric (organic conversion) | 3 | Strong brand building; weaker direct conversion. SEO benefit from resources + blog is high. |
| **Total** | **12/20** | |

### Business metric score: 3/5
Excellent long-term brand and SEO play. Year-1 conversion will be lower. This concept becomes more powerful when community features (future enhancement §16) are added.

### Weaknesses (adversarial review)
- "Practice hub" is harder to explain to a new visitor than "this is a course."
- Without community features, the hub identity overpromises belonging and underdelivers.
- Decision paralysis risk: four co-equal entry points (course, resources, blog, tenets) may leave visitors unsure where to start.

---

## Selection Gate

### Concept comparison summary

| Concept | Total (user) | Business metric | Structurally distinct? | Selected? |
|---|---|---|---|---|
| A — Intellectual Journal | 14/20 | 3/5 | Yes (lesson-first spine) | Runner-up |
| B — Structured Program | 17/20 | 4/5 | Yes (program spine) | **Selected** |
| C — Practice Hub | 12/20 | 3/5 | Yes (manifesto/tenet spine) | Not selected |

**Selected concept: B — The Structured Program**

### Selection rationale

Concept B scores highest on user success criteria and the business metric. Its structural distinctives — a standalone marketing landing page, clear curriculum preview, auth-gated content, and program-like completion arc — are the best match for the primary user goal (make an informed enrollment decision quickly) and the business goal (convert visitors to paying learners).

Concept A's content-first approach is intellectually appealing and has strong long-term SEO value, but its Year-1 conversion story is weaker. For a platform building an audience from scratch, clarity of offer matters more than breadth of free content in the early phase.

Concept C is the right vision for a mature platform (v2 or v3) when community features exist. Without belonging mechanics, the "practice hub" framing overpromises.

**Hybrid moves from runner-up concepts:**
- From Concept A: Publish 1 lesson per module as a public preview (not full content, but the core claim + one example) to support SEO and trust-building without blurring the course/blog boundary.
- From Concept C: Tenets/manifesto section appears on the landing page prominently (not a separate page in MVP), consistent with Concept B's "enroll from landing" structure.

### Runner-up preservation

Concept A's lesson-preview model should be revisited when the platform has 3+ months of learner data. If organic conversion remains below 3%, shift to a hybrid B/A model.

Concept C's hub architecture is the v2 vision — explicitly preserved for future planning.
