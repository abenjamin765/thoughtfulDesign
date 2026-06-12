# CTA Matrix — thoughtfulDesigner.io
## Phase 2–3 artifact | ORCA Step 03: CTA Matrix Builder

Last updated: 2026-06-11
Priority notation: P = Primary | S = Secondary | T = Tertiary | Q = Quaternary

---

## Purpose

The CTA Matrix inventories every action a user can perform on every object in the system. CRUD (Create, Read, Update, Delete) provides the baseline; domain-specific and cross-object actions fill the rest. Priority tiers (P/S/T/Q) determine button prominence and placement in the UI.

---

## Object: Course

| CTA | Actor | Priority | Notes |
|---|---|---|---|
| Enroll / Start Course | Learner | P | The primary conversion action from landing/overview page |
| Browse course overview | Visitor / Learner | S | Marketing-to-learning bridge; must be accessible pre-login |
| View course syllabus / module list | Learner | S | From within the course |
| Resume where I left off | Learner | P | Returning learner's most important CTA — takes them to their next incomplete lesson |
| View certificate criteria | Learner | T | Motivation + goal-setting |

---

## Object: Module

| CTA | Actor | Priority | Notes |
|---|---|---|---|
| Start module | Learner | P | First lesson CTA from module index |
| Continue module | Learner | P | Returns learner to their next incomplete lesson (same as Resume, at module scope) |
| View module lessons | Learner | S | Browse lesson list for the module |
| View module assessment | Learner | S | Visible after all lessons are completed (or always visible as preview) |
| See module learning objectives | Learner | T | Reference / orientation |

---

## Object: Lesson

| CTA | Actor | Priority | Notes |
|---|---|---|---|
| Start lesson | Learner | P | From module index or dashboard |
| Mark lesson complete | Learner | P | The primary action at the end of a lesson (triggers Progress update) |
| Continue to next lesson | Learner | P | Post-completion forward navigation |
| Submit reflection | Learner | S | Inline reflection prompt submission |
| Answer inline check | Learner | S | Responding to a quiz question embedded in the lesson |
| Download lesson resource | Learner | T | If lesson has an associated framework template |
| Re-read lesson | Learner | T | Return to a completed lesson for review |
| Bookmark lesson | Learner | Q | Save for later (future feature) |

---

## Object: Assessment

| CTA | Actor | Priority | Notes |
|---|---|---|---|
| Start assessment | Learner | P | From module completion page or module index |
| Submit assessment | Learner | P | After answering all questions |
| Review assessment results | Learner | S | Post-submission score + feedback view |
| Retry assessment | Learner | S | After failing; must review feedback before retrying (assumed UX) |
| View correct answers / feedback | Learner | S | Post-submission detailed feedback |
| Skip to assessment (preview) | Learner | T | Allow viewing of assessment before completing all lessons (motivation) |

---

## Object: Question

| CTA | Actor | Priority | Notes |
|---|---|---|---|
| Select answer | Learner | P | Core interaction — choose an option |
| Submit answer (inline check) | Learner | P | Confirm selection and get immediate feedback |
| View feedback | Learner | S | Why the answer is correct / incorrect |
| Change answer (before submit) | Learner | S | Edit selection before confirming |
| Flag question as confusing | Learner | Q | Future: quality feedback loop |

---

## Object: Learner (self)

| CTA | Actor | Priority | Notes |
|---|---|---|---|
| Sign up / Create account | Visitor | P | Enrollment conversion |
| Log in | Returning learner | P | Re-entry |
| View dashboard | Learner | S | Access progress overview |
| Edit display name | Learner | T | Profile management |
| Log out | Learner | T | Session management |
| Delete account | Learner | Q | GDPR/privacy compliance |

---

## Object: Progress

| CTA | Actor | Priority | Notes |
|---|---|---|---|
| View progress dashboard | Learner | P | See all modules / lessons with completion state |
| Navigate to next incomplete lesson | Learner | P | "Resume" — the most important cross-object CTA |
| View assessment history | Learner | S | Review past scores |
| View completion summary | Learner | S | After completing a module |

---

## Object: Certificate

| CTA | Actor | Priority | Notes |
|---|---|---|---|
| View certificate | Learner | P | Upon course completion |
| Download certificate (PDF) | Learner | P | Primary value — shareable credential |
| Share certificate (LinkedIn / URL) | Learner | S | Social proof and referral |

---

## Object: Resource

| CTA | Actor | Priority | Notes |
|---|---|---|---|
| Browse resources library | Visitor / Learner | P | Discovery from nav or landing page |
| Download resource | Learner | P | The defining action for this object |
| Filter by module / topic | Learner | S | Finding the right resource |
| View resource description | Visitor / Learner | S | Before downloading |
| Preview resource (inline) | Learner | T | Quick-look without download |

---

## Object: Post (Blog Post)

| CTA | Actor | Priority | Notes |
|---|---|---|---|
| Read post | Visitor | P | The core action |
| Browse blog / all posts | Visitor | P | Discovery |
| Filter by topic / tag | Visitor | S | Finding relevant content |
| Share post | Visitor | T | Social / referral |
| Navigate to related lesson or resource | Visitor | S | The conversion bridge — blog → course |
| Subscribe to updates | Visitor | S | Retention / re-engagement (newsletter or RSS) |

---

## Object: Tenet

| CTA | Actor | Priority | Notes |
|---|---|---|---|
| Read tenets / manifesto | Visitor | P | Core value-communication page |
| Share manifesto | Visitor | T | Social signal / community |
| Navigate to related course content | Visitor | S | Tenets → course enrollment bridge |

---

## Cross-Object CTAs (actions that span multiple objects)

| CTA | Actors | Objects involved | Priority |
|---|---|---|---|
| Resume course | Learner | Course + Progress + Lesson | P |
| Enroll from landing page | Visitor | Course + Learner | P |
| Navigate from blog post to course | Visitor | Post + Course | S |
| Navigate from resource to associated lesson | Learner | Resource + Lesson | S |
| View module assessment after all lessons complete | Learner | Module + Assessment + Progress | S |
| Access certificate after final assessment passes | Learner | Certificate + Assessment + Learner | P (trigger) |

---

## Admin CTAs (Course Author / Platform Owner)

These are out of scope for the learner-facing MVP UI but named for completeness:

| CTA | Object | Notes |
|---|---|---|
| Create / publish lesson | Lesson | Via MDX content + git |
| Update lesson content | Lesson | Via git/CMS |
| Publish / unpublish lesson | Lesson | `published` frontmatter flag |
| View aggregate progress data | Progress | Admin analytics dashboard (future) |
| View assessment pass rates | Assessment | Quality monitoring |
| Issue / revoke certificate | Certificate | Override workflow (future) |
| Publish / edit blog post | Post | Content management |
| Add / remove resource | Resource | Resource library management |
| Edit tenets | Tenet | Manifesto content management |

---

## Priority Summary by Object

| Object | Primary CTA | Why |
|---|---|---|
| Course | Enroll / Resume | Conversion + re-engagement |
| Module | Start / Continue module | Forward progress |
| Lesson | Mark complete / Continue next | Completion momentum |
| Assessment | Start assessment | Learning milestone |
| Question | Select + Submit answer | Core learning interaction |
| Learner | Sign up | Platform entry |
| Progress | View dashboard / Navigate to next lesson | Self-direction |
| Certificate | Download certificate | Credential value |
| Resource | Download resource | Utility value |
| Post | Read post | Discovery + authority |
| Tenet | Read manifesto | Platform identity |
