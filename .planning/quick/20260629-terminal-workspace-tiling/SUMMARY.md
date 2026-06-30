---
type: quick
slug: terminal-workspace-tiling
status: prototype
created: 2026-06-29
completed: 2026-06-29
commits:
  - 3bc5802  # workspace prototype
  - <css-fix> # exclude .planning from Tailwind scan
files_modified:
  - src/lib/sections.tsx
  - src/components/terminal/PaneFrame.tsx
  - src/components/terminal/Workspace.tsx
  - src/app/page.tsx
  - src/app/globals.css
supersedes: 01-04 Nav + Hero scrolling composition (page-level)
direction_change: true
---

# Quick Task: Tiling-terminal workspace (PROTOTYPE)

A working prototype of the tiling-terminal portfolio. Pinned hero pane at the
left; clicking a launcher opens a section as a terminal pane on the right, and
the row slides left (animated `x`) so the newest pane is flush-right and older
panes slide off-screen left. Closing slides the row back right. Narrow screens
stack vertically. tmux-style.

## Shipped

- **sections.tsx** — about / experience / projects / contact registry (faux
  command-output content; DRAFT copy from public CLAUDE.md facts).
- **terminal/PaneFrame.tsx** — monochrome terminal-window chrome + close.
- **terminal/Workspace.tsx** — client state owner; launcher top bar; pinned hero
  pane; right-pinned slide via measured `scrollWidth - clientWidth` overflow
  (spring); re-open moves a section to the end; narrow = vertical stack.
- **page.tsx** — renders `<Workspace/>`; Nav/Hero/HeroIntro retained unused.
- **globals.css** — `@source not "../../.planning"` (see fix below).

## Verification

- `tsc --noEmit` clean; `NEXT_PUBLIC_BASE_PATH=/jackyzhang npm run build` exits 0,
  now warning-free.
- Dev server (`npm run dev`) serves HTTP 200; hero + 4 launchers render.
- `out/index.html` has the static hero `<h1>` "Jacky Zhang" (no `opacity:0`) →
  LCP preserved (SSG server-renders the client component's initial HTML).
- Section pane content renders only on open (not in initial HTML).

## Fix folded in

Tailwind v4 auto-scanned `.planning/` docs and emitted class-name-like text as
utilities — invalid CSS (`var(--radius-sm|md|lg|pill)`) that hard-failed the dev
PostCSS parse (HTTP 500) and left dead rules (incl. the stray `.bg-gradient-to-r`)
in prod. Scoped detection with `@source not "../../.planning"`. Dev now 200,
prod warning-free. (This was the cosmetic warning first noted in 01-01.)

## Open — owner reaction needed (run `npm run dev`, open localhost:3000)

- Open method: launcher buttons only for now (typed-command CLI = follow-up).
- Pane sizing / behavior across wide vs mid screens; off-left affordance/peek.
- Mobile model: vertical stack (current) vs single-pane swap.
- Pane management: re-order, focus, allow duplicates?
- Copy is placeholder — real Revly metrics + About narrative still pending.

## Roadmap impact

This supersedes the planned scrolling portfolio. ROADMAP Phases 2–4 (content
sections) need replanning around the pane model once the interaction is signed
off. NOT yet reflected in ROADMAP.md — deferred pending owner approval.
