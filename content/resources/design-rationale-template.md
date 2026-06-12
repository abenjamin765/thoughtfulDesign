---
name: "Design Rationale Template"
slug: "design-rationale-template"
description: "A one-page structure for explaining a design decision through user need, business goal, evidence, tradeoffs, risks, and next step."
module_id: "06-product-strategy"
module: "Product Strategy and Design Judgment"
format: "printable"
loop_step: "Align"
---

# Design Rationale Template

Use this to make a decision durable and reviewable. Keep it to one page.

## The rationale

| Section | Your notes |
| --- | --- |
| Recommendation (what we propose) | |
| User need (the human problem) | |
| Business goal (the company outcome) | |
| Evidence (and its strength) | |
| Tradeoffs (what we give up) | |
| Risks (what could make this wrong) | |
| Next step (and what would make us revisit) | |

## Strengthen it

- Name the strongest argument **against** your choice — and answer it.
- Label evidence by strength: observed beats reported beats stated.
- If the "evidence" or "tradeoffs" rows are empty, your reasoning is thin. Fix that before sharing.

## Quality check

- [ ] Fits on one page.
- [ ] Distinguishes user need from business goal.
- [ ] States at least one real tradeoff and one risk.
- [ ] Engages the best counterargument.
- [ ] Names what would trigger a rethink.

## Worked example close (enterprise dashboard alerts)

> **Recommendation:** Ship prioritized alerts with simple defaults; defer configuration.
> **Tradeoff:** We give up sales' request for high-volume visibility.
> **Risk:** If configuration requests spike in month one, we revisit.
> **Next step:** Instrument how often users want to tune thresholds.
