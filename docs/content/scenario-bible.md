# Scenario Bible — Thoughtful Design

> The five recurring product scenarios (requirements §9.4). Writers reuse these exact products across modules so learners see how each lens reveals a different layer of the same problem. **Do not invent new flagship products mid-course.** A lesson may reference a one-off example for variety, but the recurring spine must come from this file.

## How to use this file

- Each scenario has a fixed cast, fixed objects, and fixed pain points. Keep names and facts consistent.
- The "Module lens" column says which modules use this scenario as their primary context.
- The school analytics platform is the **course spine** — it appears in the most modules and anchors the final exam.

| Scenario | Primary modules | Role in course |
|---|---|---|
| School analytics platform | M2, M3, Milestones 1, Final | Spine — object modeling + systems thinking + capstone |
| Healthcare appointment portal | M4, M8 | Research + accessibility |
| Marketplace onboarding flow | M7, M9 | Interaction craft + ethics |
| Internal enterprise dashboard | M1, M5, M6 | Systems intro + facilitation + strategy |
| AI writing / recommendation assistant | M10, M11, Final §8 | AI judgment + practice synthesis |

---

## 1. School analytics platform (`school-analytics`)

**One-liner:** A web platform where K–12 teachers and administrators view student performance data and decide what to do next.

**Cast / roles:**
- **Teacher** — wants to know which students need help and why; time-poor.
- **Administrator (principal / district)** — wants school- and grade-level trends; cares about accountability.
- **Student** — the subject of the data; rarely a direct user in MVP.
- **Data team** — owns the pipelines feeding the dashboards.

**Core objects (for OOUX work in M2):** Student, Class, Assessment, Score, Standard, Teacher, School, Report.

**Known pain points:**
- No one agrees what the dashboard is *for* — monitoring, intervention, or reporting.
- "Proficiency" is defined differently by different stakeholders.
- Teachers distrust the numbers because data freshness is uneven.
- A single "engagement" metric hides very different student situations.

**Module lens:**
- **M2 (OOUX):** model Student / Class / Assessment / Score and their relationships; the dashboard confusion traces back to an unclear object model.
- **M3 (Systems):** raising one metric (e.g. "logins") creates second-order effects (teachers gaming the number, students over-surveilled).
- **Milestone 1 & Final:** the capstone scenario (district adds an AI recommendation feature) builds on this product.

---

## 2. Healthcare appointment portal (`healthcare`)

**One-liner:** A patient-facing web/mobile portal for booking, rescheduling, and preparing for medical appointments.

**Cast / roles:**
- **Patient** — wide variation in age, health literacy, language, stress, and device.
- **Caregiver** — books on behalf of a parent, child, or partner.
- **Clinic staff** — manage the schedule on the other side.

**Core objects:** Patient, Appointment, Provider, Clinic, Insurance, Reminder.

**Known pain points:**
- Patients are often stressed, in pain, or distracted when they use the portal.
- Medical and insurance terms are jargon-heavy.
- A missed appointment has real cost (health and money).
- Booking flows assume a calm, fluent, single-tasking user.

**Module lens:**
- **M4 (Research):** the team assumes patients "just want fewer clicks" but has not learned the riskiest assumption; assumption audit on booking abandonment.
- **M8 (Accessibility):** the stressed, low-literacy, low-bandwidth patient is the human-variation case; permanent/temporary/situational needs.

---

## 3. Marketplace onboarding flow (`marketplace`)

**One-liner:** The signup-to-first-purchase (and signup-to-first-listing) flow for a two-sided consumer marketplace.

**Cast / roles:**
- **Buyer** — wants to evaluate trust and get to value fast.
- **Seller** — wants to list quickly and get paid.
- **Growth PM** — owns conversion and activation metrics.

**Core objects:** Account, Listing, Order, Profile, Review, Payout.

**Known pain points:**
- Conversion pressure pushes toward aggressive nudges.
- Onboarding asks for too much, too early.
- States (empty, error, loading) are afterthoughts.
- Some "growth wins" quietly erode trust.

**Module lens:**
- **M7 (Interaction craft):** the onboarding technically works but feels effortful; flows, states, feedback, cognitive load.
- **M9 (Ethics):** a conversion win (pre-checked add-ons, hidden costs) that is defensible to the business but costs user trust; persuasion vs. manipulation.

---

## 4. Internal enterprise dashboard (`enterprise`)

**One-liner:** An internal analytics/admin dashboard used by operations staff inside a large company.

**Cast / roles:**
- **Ops analyst** — power user, lives in the tool daily.
- **Manager** — wants summaries and exceptions.
- **Stakeholders** — sales, support, finance all want "their" view added.

**Core objects:** Account, Metric, Report, Alert, Segment, View.

**Known pain points:**
- Every team wants a widget; the dashboard has become a junk drawer.
- "Make it easier to use" means different things to each stakeholder.
- Design reviews produce conflicting feedback and no decision.
- Tradeoffs between competing goals are never made explicit.

**Module lens:**
- **M1 (Screens to systems):** the "make the dashboard easier" request hides a system problem.
- **M5 (Facilitation):** the design review that goes nowhere; framing the decision.
- **M6 (Strategy):** three reasonable directions, each serving a different goal; design rationale.

---

## 5. AI writing / recommendation assistant (`ai-assistant`)

**One-liner:** An AI feature embedded in a product that drafts content and/or recommends next actions to users.

**Cast / roles:**
- **End user** — relies on the suggestions, may over-trust them.
- **Designer** — uses AI in their own workflow *and* designs the AI feature.
- **PM / engineer** — own the model integration and guardrails.

**Core objects:** Prompt, Suggestion, Source, Confidence, Feedback, Draft.

**Known pain points:**
- Output is fluent but sometimes wrong, generic, or biased.
- Users cannot tell how confident the system is or where an answer came from.
- No clear path to recover from a bad suggestion.
- Human review gets quietly dropped to "move faster."

**Module lens:**
- **M10 (AI):** the polished-but-wrong answer; AI as tool/material/actor; human-in-the-loop design.
- **M11 (Practice):** synthesizing judgment across the whole loop, using this product as the running example.
- **Final §8:** AI design judgment section of the capstone (the district school-analytics platform adds this assistant).

---

## Cross-scenario continuity note

The **final assessment** scenario deliberately fuses two spine scenarios: *a school district analytics platform adds an AI-powered recommendation feature for teachers and administrators* (requirements §8). Writers of M2, M3, and M10 should keep their school-analytics and ai-assistant details compatible so the capstone feels like a culmination, not a new product.
