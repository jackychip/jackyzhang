---
type: quick
slug: remove-gradient-monochrome
created: 2026-06-29
files_modified:
  - src/components/ui/Button.tsx
  - src/app/not-found.tsx
  - src/components/Hero.tsx
  - src/app/globals.css
reverses_decision: D-01 (gradient discipline → monochrome)
---

# Quick Task: Remove gradient color (monochrome direction)

Owner: "get rid of the gradient color." Remove every remaining gradient
*fill/wash* site-wide. Decisions (via AskUserQuestion): primary buttons +
display headings go **monochrome near-white** (no chromatic accent); the violet
hero ambient glow is **removed** entirely. Cyan terminal prompt/cursor stay
(they're solid accents, not gradients).

## Changes

- **Button.tsx** — `primary` variant: `bg-gradient-to-r from-violet via-blue
  to-cyan text-white` → `bg-text text-bg hover:bg-text-muted` (solid near-white
  fill, dark text).
- **not-found.tsx** — 404 `<h1>`: drop gradient classes → solid `text-text`.
- **Hero.tsx** — remove the decorative violet ambient-glow `<div>`
  (`radial-gradient(...)`); flat dark background.
- **globals.css** — remove the now-dead `.ambient-glow` reduced-motion rule;
  retag the `--color-violet/blue/cyan` comments (no longer "gradient stops");
  scrub the class-name tokens from the `@theme` doc comment.

## Verify

- `NEXT_PUBLIC_BASE_PATH=/jackyzhang npm run build` exits 0; `tsc --noEmit` clean.
- `out/index.html` + `out/404.html` contain zero `gradient` occurrences.
- No gradient classes remain in `src/` render code.
- (Known/cosmetic) an unused `.bg-gradient-to-r` utility may persist in the
  exported CSS — generated from class-name tokens in `.planning/` docs that
  Tailwind v4 auto-scans; not applied to any element, zero visual effect.
