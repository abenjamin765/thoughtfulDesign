# Style Guide — Thoughtful Design course content

> Voice, structure, and accessibility rules every lesson must follow. Derived from requirements §12 (voice & tone), §3.1 (module structure), §9 (questions), and docs/typographic-pattern-spec.md. Run the checklist before considering any lesson done.

## Voice (requirements §12)

The voice is: clear, thoughtful, direct, grounded, warm, practical, precise, story-driven, intellectually serious without being academic.

Avoid: hype, unexplained jargon, absolute claims, shaming designers, corporate language, vague inspiration, tool-first thinking.

**Favor positive framing.** Reframe "don't" statements into "do" statements.

| Instead of | Write |
| --- | --- |
| Don't just design screens. | Start by understanding the system the screen belongs to. |
| AI will not replace designers. | AI increases the value of designers who can ask better questions. |
| Accessibility is not optional. | Accessibility is one way thoughtful design becomes real for more people. |

## Lesson structure (requirements §3.1)

Each lesson follows this order when patterns are present:

1. The Situation (narrative, primary content)
2. The Hidden Problem (with a contrast table where useful)
3. The Shift (the reframe couplet — max one per lesson)
4. Concept sections (2–4, short paragraphs)
5. Inline knowledge checks (scattered through, not clustered at the end)
6. Try It (a self-led exercise)
7. Common Trap (corrective, never shaming)
8. What Good Looks Like (model answer / rubric, in a Reveal)
9. Carry Forward (synthesis + link to next lesson by title)

Module-level elements (summary, resource link, "start the assessment" pointer) live in the module's last lesson.

## Content volume per module (requirements §10)

- 1 opening story, 1 core claim, 4–7 major lesson sections (across the module's lessons)
- 3–8 inline knowledge checks per lesson
- 1 guided self-led exercise, 1 common-traps section, 1 summary
- 1 scored module assessment
- 1 downloadable framework if applicable

## Question rules (requirements §9)

- Test application in realistic situations, not vocabulary recall.
- Every question includes feedback: why the correct answer is right, why tempting answers are incomplete, and what principle is tested.
- Difficulty rises across the course: early = identify/define/distinguish; middle = diagnose/choose/apply; later = evaluate/prioritize/justify/anticipate.
- Include at least one **Design Judgment Moment** per module (no single correct answer; rationale for each option).

## Recurring scenarios (requirements §9.4)

Use the five products from `scenario-bible.md`. Keep facts consistent across modules. The school-analytics platform is the spine.

## Accessibility & readability (typographic-pattern-spec)

- Body copy targets US grade 9–11; labels, buttons, and quiz feedback target grade 6–8.
- Define every domain term on first use (inline or in a `Reveal`); keep wording aligned to `glossary.md`.
- Meaning never carried by color alone — pair with text labels.
- Link text names its destination ("Continue to Module 3: Systems Thinking"), never "Next" alone.
- Contrast tables use real table markup with header cells, never layout grids.

## Loop integration (requirements §11)

Every module connects back to one or more steps of the Thoughtful Design Loop. Name the step(s) explicitly in the module's last lesson. Across the whole course, each of the seven steps should appear in at least two modules (verified in QA).

## Per-lesson done checklist

- [ ] Frontmatter complete (title, module, module_id, part, order, minutes, core_claim, loop_steps, scenario, public_preview)
- [ ] Opening situation grounds a real scenario from the bible
- [ ] Core claim stated once, memorably
- [ ] 3–8 inline checks, each with feedback, scattered through the body
- [ ] One Try It exercise with a "What good looks like" reveal
- [ ] One common-trap callout, framed correctively
- [ ] Carry-forward links to the next lesson by title
- [ ] Domain terms defined on first use; wording matches glossary
- [ ] Voice check: positive framing, no shaming, no unexplained jargon
- [ ] Reading level: body grade 9–11, labels/feedback grade 6–8
