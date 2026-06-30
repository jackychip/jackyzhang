---
type: quick
slug: remove-gradient-monochrome
status: complete
created: 2026-06-29
completed: 2026-06-29
commit: 187bd33
files_modified:
  - src/components/ui/Button.tsx
  - src/app/not-found.tsx
  - src/components/Hero.tsx
  - src/app/globals.css
reverses_decision: D-01 (gradient discipline → monochrome)
---

# Quick Task Complete: Remove gradient color (monochrome)

Removed every gradient fill/wash site-wide per owner request. Owner choices
(AskUserQuestion): monochrome near-white buttons/headings (no chromatic accent);
violet hero glow removed. Cyan terminal prompt/cursor retained (solid accents).

## What shipped

- **Button.tsx** — `primary` now `bg-text text-bg hover:bg-text-muted` (solid
  near-white, dark text) instead of the violet→blue→cyan gradient.
- **not-found.tsx** — 404 `<h1>` solid `text-text` (gradient classes removed).
- **Hero.tsx** — removed the violet ambient-glow `<div>` (radial-gradient);
  flat dark background.
- **globals.css** — removed the dead `.ambient-glow` reduced-motion rule;
  retagged `--color-violet/blue/cyan` comments; scrubbed gradient class tokens
  from the `@theme` doc comment.

## Verification (all passed)

- `NEXT_PUBLIC_BASE_PATH=/jackyzhang npm run build` → exit 0; `tsc --noEmit` clean.
- `out/index.html` + `out/404.html` → **0** `gradient` occurrences (rendered
  output fully gradient-free).
- No gradient classes remain in `src/` render code.

## Known cosmetic note

An unused `.bg-gradient-to-r` utility may persist in the exported CSS — Tailwind
v4 auto-scans `.planning/` markdown (which discusses these class names) and emits
the utility as a candidate. It is applied to no element → zero visual effect.
Same class of doc-scan artifact flagged in 01-01.

## Not yet deployed

Folds into the pending live deploy. Unpushed terminal-hero + de-gradient commits
must be pushed by the owner (sandbox has no GitHub auth) to go live.
