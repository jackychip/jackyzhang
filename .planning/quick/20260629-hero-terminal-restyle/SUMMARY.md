---
type: quick
slug: hero-terminal-restyle
status: complete
created: 2026-06-29
completed: 2026-06-29
commit: 01eed28
files_modified:
  - src/components/Hero.tsx
  - src/app/globals.css
reverses_decision: D-01
---

# Quick Task Complete: Hero terminal restyle

Replaced the gradient LCP hero name with a terminal "prompt + whoami output"
aesthetic, per owner request (owner disliked the gradient).

## What shipped

- **src/components/Hero.tsx** — gradient `<h1>` replaced by a terminal block:
  - Decorative monospace prompt line `visitor@jackyzhang:~$ whoami`
    (`aria-hidden`, cyan accents via `--color-cyan`).
  - Static `<h1>` "Jacky Zhang" in JetBrains Mono, solid near-white
    (`--color-text`), followed by a blinking cyan cursor block (`▮`,
    `aria-hidden`).
- **src/app/globals.css** — added `@keyframes terminal-blink` + `.terminal-cursor`;
  extended the `prefers-reduced-motion: reduce` guard so the cursor stays solid
  (no blink) under reduced motion.

## Verification (all passed)

- `NEXT_PUBLIC_BASE_PATH=/jackyzhang npm run build` → exit 0.
- `out/index.html`: "Jacky Zhang" inside a static `<h1>` — no gradient classes
  (`bg-clip-text` / `text-transparent` / `from-violet`), no `opacity:0`, no
  `style` attr (LCP-safe, HERO-03).
- `Hero.tsx` imports nothing matching `motion|framer` (still a Server Component).
- `terminal-blink` keyframe present in exported CSS; prompt line ("whoami")
  present in `out/index.html`.

## Decision change

Reverses locked **D-01** (gradient on the display h1). The hero name no longer
uses the violet→blue→cyan gradient; gradient remains available for other large
display headings per the design system. Owner-approved.

## Notes

- `gsd-tools` CLI not installed in this environment; STATE.md updated directly
  (matching existing format), consistent with the Phase-1 executors' approach.
- Not yet deployed live — folds into the pending Phase-1 live deploy /
  LNCH-05 verification (push `main` → verify the live URL).
