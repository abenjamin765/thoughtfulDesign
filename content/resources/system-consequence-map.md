---
name: "System Consequence Map"
slug: "system-consequence-map"
description: "A structured worksheet for anticipating the second-order effects of a design change across users, support, data, metrics, trust, and time."
module_id: "03-systems-thinking"
module: "Systems Thinking for UX"
format: "printable"
loop_step: "Account"
---

# System Consequence Map

Use this before shipping any change that alters an incentive, automates a human judgment, or touches sensitive data. The goal is to choose consequences deliberately instead of discovering them later.

## Step 1 — Name the change

**Proposed change:** ____________________

**Intended first-order effect:** ____________________

## Step 2 — Trace effects across the system

| Dimension | What might change here? | Likely effect |
| --- | --- | --- |
| Users (behavior) | | |
| Support (load) | | |
| Data (accuracy/meaning) | | |
| Business metrics | | |
| Trust (who trusts it less?) | | |
| Long-term behavior (what becomes normal?) | | |

## Step 3 — Spot the loops

- Does this change create or strengthen a **feedback loop**? Describe it: ____________________
- Does it change an **incentive**? What will people do to make the number look good? ____________________

## Step 4 — Decide a design move

A consequence map only matters if it changes a decision. Write at least one move that keeps the benefit while reducing a harm you found.

**Design move:** ____________________

## Quality check

- [ ] I found at least one non-obvious effect no one raised at kickoff.
- [ ] I connected it to a feedback loop or incentive.
- [ ] I ended with a concrete, buildable design change.
- [ ] I widened the system boundary beyond my own feature.

## Worked example (auto-email parents when a student is flagged)

| Dimension | Likely effect |
| --- | --- |
| Users | Teachers may under-flag to avoid triggering emails |
| Support | Parents reply with questions; staff must respond |
| Data | Under-flagging makes at-risk data less accurate |
| Metrics | "Parent engagement" rises while real flags fall |
| Trust | Teachers feel surveilled; parents may panic without context |
| Long-term | Flagging becomes high-stakes instead of a quiet signal |

**Design move:** Decouple flagging from notifications, and let teachers add context before any parent email is sent.
