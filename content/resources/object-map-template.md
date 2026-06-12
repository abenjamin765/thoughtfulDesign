---
name: "Object Map Template"
slug: "object-map-template"
description: "A low-fidelity template for mapping a product's objects, attributes, relationships, actions, and states before designing screens."
module_id: "02-object-oriented-ux"
module: "Object-Oriented UX"
format: "printable"
loop_step: "Model"
---

# Object Map Template

Use this template to model a domain before designing pages. Fill one block per object. Keep it low-fidelity — the goal is shared understanding, not visual design.

## How to use it

1. List candidate objects (the nouns users repeat).
2. Run each through the **SIP test** — Structure, Identity, Purpose. Keep only true objects.
3. For each object, fill the block below.
4. Check the whole map against the Four Ancient Truths.

## Object block (copy one per object)

**Object name:** ____________________

| Field | Your notes |
| --- | --- |
| Definition (one sentence) | |
| Key attributes (3–7) | |
| Relationships (to which objects?) | |
| Main actions / CTAs | |
| States it can be in | |

## Whole-map checks

- [ ] Every object passed the SIP test (Structure, Identity, Purpose).
- [ ] No object is isolated — each has at least one relationship.
- [ ] No pages, features, or buttons snuck in as "objects."
- [ ] Attributes are things a *user* would recognize, not database columns.
- [ ] The map resolved at least one real team disagreement.

## Worked example (school analytics platform)

| Object | Definition | Key attributes | Relationships | Actions | States |
| --- | --- | --- | --- | --- | --- |
| Student | A learner enrolled in classes | name, grade level, enrollment date | belongs to Classes; has Scores | view, message | active, inactive |
| Assessment | A graded task tied to a standard | title, standard, due date | belongs to Class; produces Scores | assign, grade | draft, assigned, graded |
| Score | A result for one student on one assessment | value, date | belongs to Student and Assessment | view | provisional, final |
