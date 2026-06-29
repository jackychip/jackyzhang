# Phase 1: Live Foundation — Design System + Hero - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-29
**Phase:** 1-live-foundation-design-system-hero
**Areas discussed:** Hero copy & identity, Hero composition, CTAs & first-phase assets

---

## Area selection

| Option | Description | Selected |
|--------|-------------|----------|
| Hero copy & identity | Lock the draft headline, kicker, one-liner | ✓ |
| Hero composition | Typographic vs photo/terminal; layout | ✓ |
| Deploy URL & basePath | Project page vs user-site vs custom domain | |
| CTAs & first-phase assets | Resume PDF, contact email, nav links before sections exist | ✓ |

**Notes:** Deploy URL skipped — carried forward the UI-SPEC's locked assumption (project page `jackychip.github.io/jackyzhang`, basePath `/jackyzhang`).

---

## Hero copy & identity

### Headline (gradient LCP h1)

| Option | Description | Selected |
|--------|-------------|----------|
| Your name: "Jacky Zhang" | Recruiter-standard, name-as-h1, positioning carried by kicker + one-liner | ✓ |
| A builder statement | Punchy founder line as h1, name moved to nav/kicker | |
| Name + descriptor combo | Name + coupled gradient descriptor line | |

**User's choice:** "Jacky Zhang" (confirms UI-SPEC draft).

### Kicker (mono uppercase eyebrow)

| Option | Description | Selected |
|--------|-------------|----------|
| "Computer Engineering @ UIUC" | UI-SPEC draft; pure academic identity | |
| Add the founder signal | Front-load 'Founder & Lead Engineer @ Revly · CompE @ UIUC' | ✓ |
| Add the grad year | 'Computer Engineering @ UIUC · B.S. May 2029' | |

**User's choice:** Add the founder signal.
**Notes:** Overrides UI-SPEC's plain academic draft. Exact string owner-tunable; flagged 360px mono-wrap as an implementation concern.

### Builder one-liner (sub-headline)

| Option | Description | Selected |
|--------|-------------|----------|
| UI-SPEC draft (outcome-first) | 'I build and ship real things — from a live automotive marketplace to robotics and games played 40,000+ times.' | ✓ |
| Explicit arc framing | Name the games→robotics→marketplace progression literally | |
| Tighter / punchier | One crisp line, less narrative | |

**User's choice:** UI-SPEC draft (outcome-first), verbatim.

---

## Hero composition

### Visual treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Pure typographic | Text + locked ambient radial glow only; best LCP safety | ✓ |
| Add a portrait/headshot | Photo alongside text; adds LCP-risk image + asset to provide | |
| Add a code/terminal motif | Decorative code block; no photo but more layout complexity | |

**User's choice:** Pure typographic.

### Layout arrangement

| Option | Description | Selected |
|--------|-------------|----------|
| Centered, single column | Kicker → name → one-liner → CTA row, centered in min-h-[100svh] | ✓ |
| Left-aligned | Same stack, left-aligned editorial feel | |
| You decide | Defer to implementation | |

**User's choice:** Centered, single column.

---

## CTAs & first-phase assets

### Resume PDF readiness

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — I'll provide it | Real resume.pdf in /public; basePath-aware link works live | ✓ |
| Placeholder for now | Stub PDF, wiring correct, swap later | |
| Defer the button | Drop 'Download Resume' until Phase 3 | |

**User's choice:** Yes — owner will provide the real PDF.

### Contact mailto: email

| Option | Description | Selected |
|--------|-------------|----------|
| jackyz4@illinois.edu | UIUC address; signals current student/intern candidate | ✓ |
| jackychipersonal@gmail.com | Personal Gmail; persists after graduation | |

**User's choice:** jackyz4@illinois.edu.
**Notes:** Two addresses existed across project docs/account profile; the .edu was the intentional pick.

### 'View Work' CTA + Nav before sections exist

| Option | Description | Selected |
|--------|-------------|----------|
| Anchors to future sections | #work / #about / #contact; wired once, resolve in Phases 2–3, graceful now | ✓ |
| Minimal nav now | Brand + Resume only; 'View Work' → GitHub until Projects exists | |
| Hide 'View Work' for now | Render only Resume + Get in Touch this phase | |

**User's choice:** Anchors to future sections.

---

## Claude's Discretion

- GitHub Pages deploy mechanism (Actions vs branch-based).
- Skip-to-content link, scroll-cue affordance, 404 page (standard a11y/implementation details).
- Exact kicker separator/punctuation within the locked founder-forward intent.

## Deferred Ideas

- Custom domain (e.g. `jackyzhang.dev`) — future enhancement; Phase 1 ships on the project page with basePath `/jackyzhang`.
- Switching to a user-site repo (root URL, no basePath) — considered, not chosen.
