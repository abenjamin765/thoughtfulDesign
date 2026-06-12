# Nested-Object Matrix (NOM) — thoughtfulDesigner.io
## Phase 2–3 artifact | ORCA Step 02: NOM Builder

Last updated: 2026-06-11

---

## What the NOM shows

The NOM maps which objects appear *nested inside* other objects — i.e., as lists, summaries, or collections displayed on a parent object's page. It identifies hub objects (appear as parents in many relationships), leaf objects (only appear nested), and isolated objects (appear in neither role — a red flag).

Relationship direction: **Parent → [nested children]**

---

## NOM Table

| Parent Object | Nested Objects (appears within parent's page/context) | Notes |
|---|---|---|
| **Course** | Modules (ordered list), Resources (associated collection), Tenets (associated collection) | The Course overview page shows the module sequence and links to the platform's resources and tenets |
| **Module** | Lessons (ordered list), Assessment (1 per module), Resources (associated templates) | Module index page lists all lessons in order + the module assessment + linked frameworks |
| **Lesson** | Questions (inline checks, embedded), Exercise (1 guided practice block), Resource (linked template, if applicable) | Lesson page renders questions inline; exercise is a section within the lesson |
| **Assessment** | Questions (many, scored) | Assessment page/section renders its question set; Assessment is nested inside Module (appears on Module page) |
| **Learner** | Progress (per-lesson + per-course), Responses (history of answers), Certificate (0 or 1) | Learner's dashboard shows their progress state, answer history, and certificate status |
| **Progress** | (no nested children) | Progress is a leaf — it summarizes state, does not contain other objects |
| **Post** | (no nested children in MVP) | Blog posts are standalone; future: could nest Resources or related Lessons |
| **Tenet** | (no nested children) | Tenets render as a collection within the Manifesto page |
| **Resource** | (no nested children) | Resources are leaf objects — they have metadata and a download, nothing nested |
| **Certificate** | (no nested children) | Certificates are leaf objects |

---

## Parent-Child Relationship Map

```
Course
 └── Module (ordered, many)
      └── Lesson (ordered, many)
           └── Question (inline check, many)
           └── Exercise (1 per lesson)
           └── Resource (0–1 linked)
      └── Assessment (1 per module)
           └── Question (scored, many)
      └── Resource (0–many linked frameworks)
 └── Resource (course-wide library)
 └── Tenet (collection, ~5–10)

Learner
 └── Progress (many — 1 per Lesson)
 └── Response (many — 1 per Question answered)
 └── Certificate (0 or 1)

Post (standalone, no children in MVP)
```

---

## Hub Objects

Hub objects appear as parents in multiple relationships. They are the organizing centers of the system.

| Object | Why it's a hub |
|---|---|
| **Course** | Parent of Modules, Resources, Tenets — the entire learning product |
| **Module** | Parent of Lessons, Assessments, Resources — the curriculum unit |
| **Lesson** | Parent of Questions, Exercises, linked Resources — the learning experience unit |
| **Assessment** | Parent of Questions — the evaluation unit |
| **Learner** | Parent of Progress, Responses, Certificate — the user's relationship to the system |

---

## Leaf Objects

Leaf objects appear only as children, never as parents in this model.

| Object | Nested under |
|---|---|
| Progress | Learner |
| Response | Learner (and cross-references Question) |
| Certificate | Learner |
| Exercise | Lesson |
| Resource | Course, Module, Lesson |
| Tenet | Course (manifesto section) |
| Post | None (isolated — see below) |

---

## Isolated Objects

Objects that appear in neither parent nor child role — a navigation risk (Isolated Objects anti-pattern).

| Object | Status | Mitigation |
|---|---|---|
| **Post** | Currently isolated — blog content has no defined relationship to Lessons, Resources, or Course | Mitigate: add "Related Lessons" or "Related Resources" metadata to Post; link from landing/blog to Course enrollment |
| **Tenet** | Semi-isolated — appears in Course manifesto but no direct navigation from Lesson to Tenet | Mitigate: "This lesson applies tenet: [X]" annotation on lesson pages |

---

## Relationship Cardinality Notes

| Relationship | Cardinality | Notes |
|---|---|---|
| Course → Module | 1:many | Ordered sequence |
| Module → Lesson | 1:many | Ordered sequence |
| Module → Assessment | 1:1 | One assessment per module (plus milestones and final at course level) |
| Lesson → Question | 1:many | Inline checks (3–8 per lesson per requirements §5.1) |
| Assessment → Question | 1:many | 8–15 per module assessment |
| Course → Assessment (milestones) | 1:3 + 1:1 (final) | 3 milestone assessments + 1 final |
| Learner → Progress | 1:many | One per lesson |
| Learner → Response | 1:many | One per question answered |
| Learner → Certificate | 1:0–1 | Zero until completion criteria met |
| Lesson → Resource | many:many | A resource can be associated with multiple lessons |
| Module → Resource | many:many | Framework templates associated with module topics |

---

## MCSFD Quick Notes (for key relationships)

**Module → Lesson**
- Mechanics: learner navigates lesson-by-lesson in order; previous lesson completion unlocks next (assumed — not enforced in current codebase)
- Cardinality: 1:many (Module has many Lessons)
- Sort: by `order` field ascending
- Filter: by `published` = true
- Dependency: Lesson completion required before Assessment is unlocked (assumption A-04)

**Learner → Progress**
- Mechanics: Progress row created when learner first visits lesson; updated when `LessonComplete` fires
- Cardinality: 1:many
- Sort: by module + lesson order
- Filter: by `completed_at` (completed vs. in-progress vs. not-started)
- Dependency: None — learners can view any lesson regardless of progress state (current behavior)
