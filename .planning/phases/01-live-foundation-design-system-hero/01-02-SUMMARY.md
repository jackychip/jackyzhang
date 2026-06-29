---
phase: 01-live-foundation-design-system-hero
plan: 02
subsystem: ui
tags: [tailwind-v4, next-font, motion, design-tokens, static-export, reduced-motion]

# Dependency graph
requires:
  - phase: 01-01
    provides: Next 16 App Router scaffold, static-export config (output:export, basePath /jackyzhang), Tailwind v4 PostCSS pipeline, src/lib/cn.ts + base-path.ts
provides:
  - Single design-token source of truth — one @theme inline block in globals.css (dark palette, violet→blue→cyan gradient stops, radius scale, font vars)
  - Three self-hosted fonts via next/font (Clash Display 600 local + Inter + JetBrains Mono google), wired as --font-display/--font-sans/--font-mono CSS variables on <html>
  - Global reduced-motion gate — src/components/providers.tsx with <MotionConfig reducedMotion="user"> + CSS prefers-reduced-motion guard for the hero ambient glow
affects: [01-03-primitives, 01-04-hero, design-system, motion]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "@theme inline (NOT bare @theme) so next/font-injected font vars resolve into utilities (Pitfall 4)"
    - "Client MotionConfig provider imported into RSC layout — keeps root layout a Server Component while gating all Motion under prefers-reduced-motion"
    - "next/font paths are basePath-aware automatically — never routed through withBasePath()"

key-files:
  created:
    - src/components/providers.tsx
  modified:
    - src/app/layout.tsx
    - src/app/globals.css
    - public/fonts/ClashDisplay-Semibold.woff2

key-decisions:
  - "Load Clash Display weight 600 only this phase (Bold 700 reserved — UI-SPEC Typography)"
  - "Token color hex written lowercase in @theme inline; verified identical to UI-SPEC values"
  - "DSYS-04 split: reduced-motion half delivered here; visible keyboard focus-state half lands in 01-03 (primitives) — requirement kept Pending until both halves ship"

patterns-established:
  - "Single @theme inline token block is the only source of design hex/radii/font vars — no hardcoded design hex elsewhere (DSYS-01)"
  - "Global MotionConfig reducedMotion=user gate; do NOT hand-roll per-component useReducedMotion (DSYS-04)"

requirements-completed: [DSYS-01, DSYS-02]

# Metrics
duration: 3min
completed: 2026-06-29
---

# Phase 01 Plan 02: Design System Foundation Summary

**Single `@theme inline` token source (dark palette + violet→blue→cyan stops + radius scale), three self-hosted fonts via next/font (Clash Display 600 + Inter + JetBrains Mono), and a global `MotionConfig reducedMotion="user"` gate — all compiling into the static export.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-06-29T19:44:17Z
- **Completed:** 2026-06-29T19:47:06Z
- **Tasks:** 2 (leading font checkpoint pre-satisfied by owner)
- **Files modified:** 4 (1 created, 2 modified, 1 asset committed)

## Accomplishments
- DSYS-01: replaced scaffold tokens with one `@theme inline` block carrying the full UI-SPEC dark palette (`bg #0a0a0f`, `surface #14141f`, `border #262633`, `text #ededf2`, `text-muted #a1a1b5`), gradient stops (`violet #7c3aed` / `blue #3b82f6` / `cyan #22d3ee`), radius scale (sm/md/lg/pill), and the three font vars. Verified the palette inlines into the exported CSS (`.bg-bg{background-color:#0a0a0f}`, `.text-text{color:#ededf2}`).
- DSYS-02: self-hosted Clash Display (local, weight 600), Inter, and JetBrains Mono via `next/font`; `.variable` classes applied to `<html>`; woff2 emitted under `out/_next/static/media`; exported HTML makes **zero third-party font requests** (no googleapis/gstatic/fontshare).
- DSYS-04 (reduced-motion half): `src/components/providers.tsx` wraps children in `<MotionConfig reducedMotion="user">` (imported into the RSC layout); CSS `@media (prefers-reduced-motion: reduce){ .ambient-glow{ animation:none } }` guard compiled into the exported CSS for the hero's CSS-keyframe glow (built in 01-04).
- Build exits 0; `var(--font-display)` confirmed resolved in the exported CSS, proving the `inline` keyword fixed Pitfall 4 (no silent font fallback).

## Task Commits

1. **Task 1: Self-host three fonts + global reduced-motion provider** — `1a87720` (feat)
2. **Task 2: Single design-token source in globals.css (@theme inline)** — `8ef5033` (feat)

_Leading `checkpoint:human-action` (Clash Display font download) was pre-satisfied by the owner — `public/fonts/ClashDisplay-Semibold.woff2` validated as real woff2 (wOF2 signature) before wiring._

## Files Created/Modified
- `src/components/providers.tsx` (created) — `"use client"` MotionConfig `reducedMotion="user"` wrapper; the single global motion gate (DSYS-04).
- `src/app/layout.tsx` (modified) — `localFont` Clash Display 600 + `Inter`/`JetBrains_Mono` from `next/font/google`, all `display:"swap"` with `--font-*` variables; three `.variable` classes on `<html>`; `bg-bg text-text font-sans` on `<body>`; baseline metadata (no `next/og`); `<Providers>` wraps `{children}`.
- `src/app/globals.css` (modified) — one `@theme inline` token block (DSYS-01) + `color-scheme: dark` + body defaults + reduced-motion ambient-glow guard.
- `public/fonts/ClashDisplay-Semibold.woff2` (committed) — owner-provided self-hosted display font.

## TDD Gate Compliance

Task 2 was marked `tdd="true"`. The project has no JS test framework (a static portfolio; adding one for a single CSS-token file is out of scope), so the RED/GREEN cycle was expressed against the **build output**, which is the task's actual `<behavior>` ("build emits utility classes for token-named colors"):
- **RED:** confirmed `#0a0a0f` and `.bg-bg` absent from the exported CSS before the change.
- **GREEN:** after writing the `@theme inline` block, the exported CSS contains `.bg-bg{background-color:#0a0a0f}`, `.text-text{color:#ededf2}`, `var(--font-display)`, and `prefers-reduced-motion:reduce){.ambient-glow{animation:none}`.
- No separate `test(...)` commit exists because there is no test file to author; the behavioral assertion is the build-output grep. The single `feat(...)` commit is the GREEN gate.

## Decisions Made
- Clash Display weight 600 only (Bold 700 reserved — UI-SPEC).
- DSYS-04 is a two-part requirement (reduced-motion + visible keyboard focus states). This plan delivers the reduced-motion half; the focus-state half lands with the primitives in 01-03. DSYS-04 is therefore kept **Pending** in REQUIREMENTS.md rather than marked complete — only DSYS-01 and DSYS-02 are fully satisfied here.

## Deviations from Plan

### Adjusted Verification (not a code change)

**1. [Rule 3 - Blocking verify path] Exported-CSS glob corrected for Next 16**
- **Found during:** Task 2 verification
- **Issue:** The plan's `<verify>` checked `out/_next/static/css/*.css`, but Next 16 emits the compiled CSS under `out/_next/static/chunks/*.css` — the literal path matched nothing.
- **Fix:** Located the actual exported CSS (`out/_next/static/chunks/1mnkm8pjmtp8i.css`) and asserted the substantive requirement against it (palette inlined, font var resolved, reduced-motion guard present). No source code changed — only the verification command path.
- **Files modified:** none (verification-only adjustment)
- **Verification:** `.bg-bg{background-color:#0a0a0f}`, `.text-text{color:#ededf2}`, `var(--font-display)`, and the `prefers-reduced-motion` glow guard all confirmed present in the exported CSS.
- **Committed in:** n/a (no code impact)

---

**Total deviations:** 1 (verification path only — no code/behavior change)
**Impact on plan:** None. All plan success criteria met; the only adjustment was matching the exported-CSS path to Next 16's output layout.

## Issues Encountered
None — both tasks executed cleanly; build exits 0.

## User Setup Required
None additional for this plan. The owner-provided `public/fonts/ClashDisplay-Semibold.woff2` was already in place and validated. (The broader phase-level owner actions — GitHub Pages source toggle, `resume.pdf`, live-URL verification — remain tracked from 01-01 and 01-04.)

## Next Phase Readiness
- Design tokens and fonts are live: 01-03 primitives (Button/Card/TechPill/Section/Timeline) can now style against `bg-bg`/`text-text`/`border-border`/`from-violet via-blue to-cyan`/`rounded-[var(--radius-*)]` and the font vars.
- The global `MotionConfig` gate is in place; 01-04 hero entrance animations inherit reduced-motion handling automatically.
- DSYS-04 completes once 01-03 adds the visible keyboard focus ring (`focus-visible:outline-2 outline-offset-2 outline-blue`) to interactive primitives.

## Self-Check: PASSED

All claimed files exist on disk (providers.tsx, layout.tsx, globals.css, ClashDisplay-Semibold.woff2, 01-02-SUMMARY.md) and both task commits (`1a87720`, `8ef5033`) are present in git history.

---
*Phase: 01-live-foundation-design-system-hero*
*Completed: 2026-06-29*
