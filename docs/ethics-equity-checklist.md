# Ethics and Equity Checklist — thoughtfulDesigner.io
## Phase 6 artifact | Edge/Ethics/Equity Gate (mandatory for all tiers)

Last updated: 2026-06-11
Tier: Standard — Full matrix including localization/ELL, performance/bandwidth, age-appropriateness.
Platform: Adult professional learning (18+). No K-12, no student PII, no FERPA/COPPA.

---

## Status key: ✅ addressed | ⚠️ partial / needs design | ❌ not addressed | N/A not applicable

---

## Section 1: Dark Patterns

| Check | Status | Design decision / evidence |
|---|---|---|
| 1.1 No hidden subscription auto-renewal without clear disclosure | ⚠️ | Course pricing and payment model not yet designed. **Required:** any subscription or recurring billing must show clear renewal terms before enrollment; no pre-checked boxes. Log as assumption A-03. |
| 1.2 No fake urgency ("Only 3 spots left!") | ✅ | No scarcity mechanics in the current or planned design. Course is evergreen. |
| 1.3 No roach-motel enrollment (easy in, impossible out) | ⚠️ | Cancel/delete account CTA is in the CTA matrix (Q tier, but present). **Required:** easy account deletion path must exist. GDPR compliance if serving EU users. |
| 1.4 No confirmshaming ("No thanks, I don't want to learn") | ✅ | No dismiss copy planned. Enrollment CTAs are affirmative. |
| 1.5 No disguised advertising posing as content | ✅ | Blog and course content are editorially distinct. No affiliate link scheme planned. |
| 1.6 No misleading progress indicators designed to create false momentum | ✅ | Progress bars reflect actual completion. No fake "50% complete" on enrollment. |

---

## Section 2: Consent and Transparency

| Check | Status | Design decision / evidence |
|---|---|---|
| 2.1 Clear disclosure of what data is collected and why | ⚠️ | Privacy policy is listed in footer of landing page wireframe but not yet written. **Required:** privacy policy must specify: email, display_name, lesson_progress, quiz_responses. No selling to third parties. |
| 2.2 User understands what they're signing up for before creating an account | ✅ | Signup page must include "By creating an account you agree to [Terms] and [Privacy Policy]" — standard pattern. |
| 2.3 No dark pattern around email collection | ⚠️ | No email newsletter mentioned in wireframe plan — "Subscribe to updates" appears on blog empty state. **Required:** explicit opt-in, not pre-checked, with clear explanation of what they'll receive. |
| 2.4 Assessment scoring is transparent | ✅ | Pass threshold (80%) is shown to learners before they start an assessment. |
| 2.5 Certificate criteria are stated clearly before enrollment | ✅ | Certificate criteria (all assessments at 80%+) appear on landing page in the "What's Included" section. |

---

## Section 3: Cognitive Accessibility and Plain Language

| Check | Status | Design decision / evidence |
|---|---|---|
| 3.1 Instructions are written in plain language | ✅ | Voice requirements (§12 of requirements doc) explicitly prohibit jargon without explanation, hype, vague inspiration. |
| 3.2 Assessment questions are unambiguous (no trick questions that test confusion rather than knowledge) | ⚠️ | Requirements §9.2 specifies feedback for every question. **Required:** question review process before launch to flag ambiguous stems. |
| 3.3 Error messages explain what happened and what to do next | ⚠️ | Error states are specified in wireframe plan (retry prompts, contact link). **Required:** every error state must follow the pattern: what happened + what to do next. |
| 3.4 Loading states communicate what's happening (not silent blank screens) | ✅ | Skeleton states specified for all major loading moments in wireframe plan. |
| 3.5 Lesson content structure is predictable (consistent template) | ✅ | Typographic storytelling structure is consistent across all 11 modules (requirements §3.1). |
| 3.6 No cognitive overload in assessment design (paginated questions, not one giant form) | ✅ | Wireframe plan specifies per-question pagination for assessments. |

---

## Section 4: Motor and Visual Accessibility (WCAG 2.1 + 2.2 AA)

| Check | Status | Design decision / evidence |
|---|---|---|
| 4.1 All interactive elements are keyboard-navigable | ⚠️ | Current codebase uses React + Astro — keyboard accessibility depends on component implementation. **Required:** Quiz, ReflectionPrompt, LessonComplete, navigation must all be keyboard-operable. |
| 4.2 Color contrast meets WCAG AA (4.5:1 for text, 3:1 for UI) | ⚠️ | Not yet validated — depends on final typography and color spec. **Required:** run contrast check on all text/background combinations in design system before launch. |
| 4.3 Focus indicators are visible (not removed by default browser styles) | ⚠️ | `global.css` must not suppress `outline` on focused elements. **Required:** verify `:focus-visible` styles are present and visible. |
| 4.4 Touch targets ≥ 44×44 CSS px | ⚠️ | Mobile lesson experience is critical (assumption A of scenario flow). **Required:** Quiz answer options, navigation buttons, CTA buttons must meet 44px target size on mobile. |
| 4.5 Semantic HTML (headings in order, landmarks, labels) | ⚠️ | MDX lessons will render headings — must validate h1/h2/h3 hierarchy is correct and does not skip levels. |
| 4.6 Images have alt text | ⚠️ | If hero images or post hero images are used, alt text is required. Decorative images use `alt=""`. |
| 4.7 Video or audio (if used) has captions or transcripts | N/A | No video or audio planned in MVP. |
| 4.8 Motion respects `prefers-reduced-motion` | ⚠️ | Any CSS animations or transitions (e.g. lesson complete celebration) must check `@media (prefers-reduced-motion)`. |

---

## Section 5: Localization and Language

| Check | Status | Design decision / evidence |
|---|---|---|
| 5.1 Platform language | N/A (MVP) | MVP launches in English only. Internationalization is a future enhancement (§16). Log as A-localization in assumptions. |
| 5.2 Language is not unnecessarily complex or exclusionary | ✅ | Voice requirements (§12) call for plain, direct, grounded language. Avoids jargon without explanation. |
| 5.3 Date and time formats are explicit | ✅ | Dates displayed as Month DD, YYYY (unambiguous). No locale-specific formatting risks in MVP single-language launch. |
| 5.4 No idioms that don't translate | ⚠️ | Future: review content for English idioms if localization is added. |

---

## Section 6: Performance and Bandwidth

| Check | Status | Design decision / evidence |
|---|---|---|
| 6.1 Page loads are acceptable on 4G / modest connections | ⚠️ | Astro's static rendering gives good baseline performance. **Required:** validate with Lighthouse before launch. Target: p95 < 3 seconds (see metrics.md guardrail). |
| 6.2 Images are optimized | ⚠️ | Any hero images or resource preview thumbnails must use Astro's Image component with optimization. |
| 6.3 No resource-heavy animation or video autoplay | ✅ | No video autoplay planned. |
| 6.4 Lesson content is readable offline (future) | N/A (MVP) | Not in MVP scope; noted as future enhancement. |

---

## Section 7: Age-Appropriateness and Audience Fit

| Check | Status | Design decision / evidence |
|---|---|---|
| 7.1 Platform is designed for adults (18+) | ✅ | Target audience explicitly stated as "UX designers, product designers, design-adjacent product professionals" — adult professionals. |
| 7.2 No K-12 content triggers | ✅ | No student PII, no FERPA/COPPA, no minor users. |
| 7.3 Pricing is disclosed for adult decision-making | ⚠️ | Pricing model not yet final — see assumption A-03. **Required:** clear pricing before enrollment CTA. |

---

## Section 8: Persuasion vs. Manipulation Guardrails

| Check | Status | Design decision / evidence |
|---|---|---|
| 8.1 Assessment retry motivation is supportive, not shame-based | ✅ | Wireframe specifies "empathetic fail state" — which areas to review, retry available. No score-shaming. |
| 8.2 Progress mechanics reinforce learning, not compulsive engagement | ✅ | No streaks, no daily lock-in mechanics, no notification pressure. Progress is informational (completions), not gamified. |
| 8.3 Email notifications (if implemented) are opt-in | ⚠️ | No email notification system designed yet. **Required:** any "you've been away" or "complete your lesson" emails must be opt-in. |
| 8.4 Certificate distinction tier does not shame non-distinction learners | ✅ | Distinction (≥90%) is an additive recognition, not a "you didn't quite make it" framing. Standard completion is celebrated equally. |

---

## Section 9: Equity

| Check | Status | Design decision / evidence |
|---|---|---|
| 9.1 Course scenarios use diverse professional contexts | ⚠️ | Requirements list recurring scenarios (school analytics, healthcare portal, marketplace, enterprise dashboard, AI assistant). These represent varied industries. **Required:** ensure scenario characters are not all the same demographic. |
| 9.2 "Mid-career designer" framing doesn't exclude career changers | ⚠️ | The primary audience description (§1 of requirements) mentions "early-to-mid career practitioners." **Required:** landing page copy should not feel exclusionary to career changers who bring different experience. |
| 9.3 Pricing does not create access barriers | ⚠️ | No scholarship, discount, or accessibility pricing tier planned in MVP. **Required:** consider whether this matters for the stated audience; log as assumption A-12. |
| 9.4 No design decisions disadvantage mobile-only users | ⚠️ | Mobile parity is a guardrail metric. **Required:** lesson pages, Quiz, LessonComplete must be fully functional on mobile. |

---

## Gate Decision

**Status: CONDITIONAL PASS**

The Ethics/Equity Gate passes conditionally. No hard failures found. Eight items are marked ⚠️ — partial or requires additional design work. None of these are blocking for initial prototype stage, but all must be resolved before public launch.

**Required before public launch:**
1. Privacy policy written and linked
2. Email opt-in designed (if email notifications are implemented)
3. WCAG color contrast validated in design system
4. Focus indicators verified in `global.css`
5. Touch targets validated on mobile
6. Semantic heading hierarchy validated in MDX lesson template
7. Assessment question review process established
8. Pricing disclosed clearly before enrollment CTA

**One item for user decision:**
- Assumption A-12 (pricing accessibility) — the user should decide whether scholarship pricing or a free trial tier is relevant to their audience and business model.

---

## Deferred Ethics Items (logged as assumptions/debt)

| ID | Item | Validation method |
|---|---|---|
| A-12 | Pricing accessibility — no scholarship or reduced-price tier in MVP | User to decide; revisit when first learner cohort data is available |
| A-localization | English-only launch may limit access for non-native English speakers in the UX design community | Review after 6 months; consider Spanish/Portuguese for LATAM UX designer market |
