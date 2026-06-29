---
type: quick
slug: hero-terminal-restyle
created: 2026-06-29
files_modified:
  - src/components/Hero.tsx
  - src/app/globals.css
requirements: [HERO-01, HERO-03]
reverses_decision: D-01
---

# Quick Task: Hero terminal restyle

Replace the gradient LCP headline with a terminal "prompt + whoami output"
aesthetic, per owner request (owner dislikes the gradient).

## What changes

- **src/components/Hero.tsx** — swap the gradient `<h1>` for a terminal block:
  - A decorative monospace prompt line `visitor@jackyzhang:~$ whoami`
    (`aria-hidden`; cyan prompt accents via `--color-cyan` token).
  - The static `<h1>` "Jacky Zhang" rendered as the command output in
    JetBrains Mono, solid near-white (`--color-text`, NOT gradient), followed
    by a blinking cyan cursor block (`▮`, `aria-hidden`).
- **src/app/globals.css** — add `@keyframes terminal-blink` + `.terminal-cursor`
  animation, and extend the existing `prefers-reduced-motion: reduce` guard so
  the cursor stops blinking (stays solid) under reduced motion.

## Hard constraints (carried from Phase 1)

- HERO-03 / LCP: `Hero.tsx` stays a Server Component, imports nothing from the
  animation lib, and the `<h1>` renders statically at full opacity — no
  `opacity:0`, no Motion wrapper. (Now even safer: the name is solid-colored,
  not `text-transparent`.)
- Tokens only — `--color-cyan` / `--color-text`, no hardcoded hex.
- Reduced-motion: cursor blink gated by the existing media query (DSYS-04).

## Decision change

Reverses locked **D-01** (gradient on the display h1). Gradient is no longer
used on the hero name; it remains available for other large display headings
per the design system. Logged in STATE/SUMMARY.

## Verify

- `NEXT_PUBLIC_BASE_PATH=/jackyzhang npm run build` exits 0.
- `out/index.html` contains "Jacky Zhang" inside a static `<h1>` with no
  `opacity:0` / no `style` attribute on the h1.
- Hero.tsx imports nothing matching `motion|framer`.
- No gradient classes (`from-violet`, `bg-clip-text`, `text-transparent`) on the h1.
