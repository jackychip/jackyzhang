---
phase: 01-live-foundation-design-system-hero
plan: 03
subsystem: ui
tags: [design-system, primitives, button, focus-ring, tailwind-v4, rsc, static-export, lucide]

# Dependency graph
requires:
  - phase: 01-02
    provides: Single @theme inline token block (dark palette, violet→blue→cyan stops, radius scale, --font-* vars) + global MotionConfig reducedMotion=user; src/lib/cn.ts class composer
provides:
  - Content-agnostic design-system primitive library under src/components/ui/ — Button, Card, TechPill, Section, Timeline (+ TimelineItem)
  - Button with primary/secondary/ghost variants, md/sm sizes, polymorphic as="a" link rendering (href/download/target/rel pass-through), optional lucide icon slot, 44px hit area, and the DSYS-04 blue focus-visible ring
  - The visible-keyboard-focus half of DSYS-04 — completes DSYS-04 (reduced-motion shipped in 01-02)
affects: [01-04-hero, 01-04-nav, phase-2-projects, phase-3-experience-timeline, design-system]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Polymorphic primitive: discriminated-union props (as?: 'button' | as: 'a') with a permissive internal cast so DOM attributes spread onto either element with zero leftover bindings"
    - "Every primitive styles ONLY from @theme tokens via cn() — no hardcoded design hex, no string-concatenated classNames"
    - "min-h-11 (44px hit area) lives in the shared base so size='sm' never shrinks the touch target (LNCH-01)"
    - "focus-visible:outline-blue (2px/2px offset) is the single DSYS-04 keyboard focus convention on interactive primitives"
    - "Shells stay RSC (no 'use client') — only interactive/Motion components opt in"

key-files:
  created:
    - src/components/ui/Button.tsx
    - src/components/ui/Card.tsx
    - src/components/ui/TechPill.tsx
    - src/components/ui/Section.tsx
    - src/components/ui/Timeline.tsx
  modified: []

key-decisions:
  - "Button is a Server Component — pure class + polymorphic element, no interactive handlers of its own; consumers add onClick at the call site"
  - "Timeline.tsx exports both Timeline (ol wrapper) and TimelineItem (dot + connecting line + children slot); isLast hides the trailing connector"
  - "TechPill uses text-text-muted for chip subtlety; Section defaults to max-w-5xl with a wide (max-w-6xl) option and responsive py-8 → md:py-16 vertical rhythm"
  - "DSYS-04 marked Complete (both halves shipped); DSYS-03 kept Partial because the Nav primitive lands in 01-04"

patterns-established:
  - "Design-system primitives live in src/components/ui/, import cn from @/lib/cn, are content-agnostic (content via children/props), and never use dangerouslySetInnerHTML (T-01-05)"
  - "Polymorphic Button as='a' forwards rel='noopener noreferrer' for external links (T-01-06)"

requirements-completed: [DSYS-04]

# Metrics
duration: 8min
completed: 2026-06-29
---

# Phase 01 Plan 03: UI Design-System Primitives Summary

**A content-agnostic primitive library — Button (primary/secondary/ghost variants, md/sm, polymorphic `as="a"` link rendering, lucide icon slot, 44px hit area, blue focus-visible ring) plus Card, TechPill, Section, and Timeline shells — all styled only from `@theme` tokens via `cn()`, all RSC-safe, compiling into the static export. Completes DSYS-04.**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-06-29T19:47:30Z
- **Completed:** 2026-06-29T19:55:13Z
- **Tasks:** 2
- **Files modified:** 5 (all created)

## Accomplishments
- **Button (DSYS-03/04):** `variant` primary (violet→blue→cyan gradient fill) / secondary (outline) / ghost (text), `size` md (default) / sm, and a polymorphic `as="a"` mechanism so the 01-04 CTAs render as `<a>` (Download Resume → `withBasePath("/resume.pdf")` + `download`; Get in Touch → `mailto:`; View Work → `#work`) with `href`/`download`/`target`/`rel` forwarded. Optional leading/trailing `lucide-react` icon via `icon` + `iconPosition`. `min-h-11` (44px hit area) sits in the shared base so `sm` never shrinks the touch target; the `focus-visible:outline-2 outline-offset-2 outline-blue` ring (#3B82F6) is on all variants — the DSYS-04 visible keyboard focus state.
- **Card / TechPill / Section / Timeline shells (DSYS-03):** four content-agnostic primitives built from the UI-SPEC Component Inventory rows (no copy-from snippet existed). Card = `bg-surface` + `rounded-[var(--radius-lg)]` (16px) + hairline border + `p-6`. TechPill = mono 14px/400 uppercase tracked, `rounded-full`, surface bg, hairline border, sm/md padding. Section = centered max-width container (5xl default / 6xl wide) with responsive `py-8 → md:py-16` vertical rhythm, forwards `id` for anchors. Timeline = `Timeline`/`TimelineItem` dot+line+slot scaffold, no data (populated Phase 3 / EXP-01).
- **DSYS-04 complete:** with the focus ring on the interactive primitive, the requirement's visible-keyboard-focus half (the reduced-motion half shipped in 01-02) is now satisfied.
- `npx tsc --noEmit` passes, ESLint is clean (zero warnings on all five files), and `next build` exits 0 producing the static export (`○ / ` + `○ /_not-found` prerendered).

## Task Commits

Each task was committed atomically:

1. **Task 1: Button primitive (variants, link rendering, focus ring, hit area)** — `114a2a8` (feat)
2. **Task 2: Card, TechPill, Section, Timeline shells** — `cfec1f3` (feat)

## Files Created/Modified
- `src/components/ui/Button.tsx` (created) — polymorphic variant/size button, RSC, focus ring + 44px hit area, lucide icon slot, `as="a"` link rendering with DOM-attr pass-through.
- `src/components/ui/Card.tsx` (created) — surface card shell (radius-lg, hairline border, lg padding), spreads `HTMLAttributes<HTMLDivElement>`.
- `src/components/ui/TechPill.tsx` (created) — mono uppercase pill (radius-pill, surface bg, hairline border), sm/md sizes.
- `src/components/ui/Section.tsx` (created) — semantic `<section>` max-width container with responsive vertical rhythm; forwards `id`.
- `src/components/ui/Timeline.tsx` (created) — content-agnostic `Timeline` + `TimelineItem` (dot + connecting line + children slot), no data.

## TDD Gate Compliance

Task 1 was marked `tdd="true"`. The repository has no JS test runner (a static portfolio; `package.json` has no `test` script and the plan's `files_modified` lists only the five component files — adding a test framework + config would exceed the plan's declared scope). The MVP/TDD runtime gate flags (`MVP_MODE`/`TDD_MODE`) were not passed to this executor, so the runtime gate did not apply.

Consistent with 01-02's precedent, the RED/GREEN cycle was expressed against the task's actual `<behavior>` (the primitive emits specific token-styled classes and type-checks), verified through the plan's own grep + `tsc --noEmit` `<verify>` block:
- **RED:** `src/components/ui/Button.tsx` did not exist — the grep assertions (`from-violet`, `min-h-11`, `focus-visible:outline`, `as`) and `tsc` all failed/were absent.
- **GREEN:** after authoring Button, every grep assertion passes and `tsc --noEmit` is clean (`BUTTON_OK`).

No separate `test(...)` commit exists because there is no test file to author; the behavioral assertion is the grep/type-check gate. The single `feat(...)` commit per task is the GREEN gate.

## Decisions Made
- **DSYS-03 stays Partial:** this plan ships 5 of the 6 inventory primitives; the **Nav** primitive is composed in 01-04, so DSYS-03 is not marked fully Complete (mirrors 01-02's discipline of not over-claiming a multi-part requirement).
- **DSYS-04 → Complete:** reduced-motion (01-02) + visible keyboard focus (this plan) — both halves shipped.
- **Button kept as a Server Component:** it carries no interactive handlers itself; consumers attach `onClick`/`href` at the call site. This keeps the primitive RSC-safe per the client/server boundary convention.

## Deviations from Plan
None — both tasks executed exactly as written. The plan listed `requirements: [DSYS-03, DSYS-04]`; only DSYS-04 is marked Complete in REQUIREMENTS.md because DSYS-03's Nav piece is explicitly deferred to 01-04 (per the plan's own `<success_criteria>`: "Nav composed in 01-04"). DSYS-03 is advanced to Partial. This is a tracking-accuracy refinement, not a code deviation.

## Threat Surface
No new trust boundaries. Both threat-register mitigations were honored: no `dangerouslySetInnerHTML` anywhere (all content flows through React children/props — T-01-05), and Button's `as="a"` path forwards `rel` so external links can pass `rel="noopener noreferrer"` (T-01-06).

## Known Stubs
None that block the plan's goal. Card and Timeline are intentionally content-agnostic shells (no data) per the plan — project content lands in Phase 2 (Card) and the experience timeline is populated in Phase 3 / EXP-01 (Timeline). These are the contracted deliverable for this phase, not unfinished work.

## Issues Encountered
None — both tasks executed cleanly; `tsc` clean, ESLint clean, `next build` exits 0.

## User Setup Required
None for this plan. Phase-level owner actions (GitHub Pages source toggle, `resume.pdf`, live-`/jackyzhang`-URL verification) remain tracked from 01-01 / 01-04.

## Next Phase Readiness
- 01-04 can compose the Hero CTA row directly from `Button` (`as="a"` for the resume/mailto/#work links) and build `Nav` from `Button` + TechPill-style type — completing DSYS-03.
- Phase 2 project cards reuse `Card`; Phase 3 experience timeline populates `Timeline`/`TimelineItem`.
- The focus-ring convention (`focus-visible:outline-blue`) is now established for every future interactive element (DSYS-04).

## Self-Check: PASSED

All five claimed files exist on disk and both task commits (`114a2a8`, `cfec1f3`) are present in git history (verified below).

---
*Phase: 01-live-foundation-design-system-hero*
*Completed: 2026-06-29*
