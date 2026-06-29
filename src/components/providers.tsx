"use client";

import { MotionConfig } from "motion/react";

/**
 * Global motion provider. `reducedMotion="user"` makes every Motion
 * animation auto-disable under `prefers-reduced-motion` (DSYS-04) — the single
 * global gate. Do NOT hand-roll per-component `useReducedMotion`.
 *
 * Client-only (MotionConfig is client-only); imported into the RSC layout so
 * the root layout itself stays a Server Component.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
