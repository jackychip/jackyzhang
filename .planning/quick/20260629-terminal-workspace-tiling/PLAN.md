---
type: quick
slug: terminal-workspace-tiling
created: 2026-06-29
status: prototype
files_modified:
  - src/lib/sections.tsx
  - src/components/terminal/PaneFrame.tsx
  - src/components/terminal/Workspace.tsx
  - src/app/page.tsx
supersedes: 01-04 Nav + Hero scrolling composition (page-level)
direction_change: true
---

# Quick Task: Tiling-terminal workspace (PROTOTYPE)

Owner direction: turn the site into a tiling terminal. The hero is a pinned
pane at the left (with margin); clicking a launcher "opens" a section as its own
terminal pane appended on the RIGHT. Opening shifts the row LEFT (animated) so
the newest pane is flush-right and older panes slide off-screen left; closing
shifts the row back RIGHT. No scrollbar — a transform shift. Multiple panes open
at once, like tmux splits.

## What shipped (prototype)

- **src/lib/sections.tsx** — registry of openable sections (about / experience /
  projects / contact) with faux-command-output content (DRAFT copy from public
  CLAUDE.md facts).
- **src/components/terminal/PaneFrame.tsx** — terminal window chrome (monochrome
  dots + path title + optional close), scrollable mono body.
- **src/components/terminal/Workspace.tsx** — `"use client"` state owner: open-
  panes array, launcher top bar, pinned hero pane, and the right-pinned slide
  (motion `x` from a measured `scrollWidth - clientWidth` overflow; spring).
  Re-opening moves a section to the end (slides back into view). Narrow screens
  stack vertically (no shift). Reduced-motion handled by the global MotionConfig.
- **src/app/page.tsx** — renders `<Workspace/>` (replaces Nav + Hero at page
  level). Nav.tsx / Hero.tsx / HeroIntro.tsx retained, unused, for reference.

## Constraints honored

- LCP: client component, but App Router SSG server-renders the hero `<h1>`
  (static, solid, no `opacity:0`) → still the immediate LCP element (HERO-03).
- Monochrome — no gradients; cyan only for terminal accents.
- Tokens only; focus rings on every interactive control (DSYS-04).

## Verify

- `tsc --noEmit` clean; `NEXT_PUBLIC_BASE_PATH=/jackyzhang npm run build` exits 0.
- `out/index.html` contains the hero `<h1>` "Jacky Zhang" (no `opacity:0`).
- Section pane content is NOT in initial HTML (renders on open).

## Open / needs owner reaction (run `npm run dev`)

- Open method: launcher buttons only (typed-command CLI = possible follow-up).
- Pane width / count behavior on very wide vs mid screens; off-left affordance.
- Mobile model (currently vertical stack vs single-pane swap).
- This supersedes the planned scrolling portfolio — ROADMAP Phases 2–4 need
  replanning once the interaction is signed off. NOT yet reflected in ROADMAP.
