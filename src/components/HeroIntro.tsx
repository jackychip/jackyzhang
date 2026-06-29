"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { withBasePath } from "@/lib/base-path";

/**
 * HeroIntro — the NON-LCP hero group (HERO-01/02, D-02/D-03/D-06..D-08).
 *
 * Client-only Motion entrance for the kicker, the builder one-liner, and the
 * 3-CTA row ONLY. The gradient `<h1>` lives in the Server Component <Hero/> and
 * is never animated (HERO-03). The entrance is deliberately subtle: fade +
 * translate ≤ 8px, ≤ 400ms, slight stagger. The global
 * `<MotionConfig reducedMotion="user">` (01-02, root layout) auto-tones this
 * down under `prefers-reduced-motion` — no per-component `useReducedMotion`.
 */

// Slight stagger across the three blocks.
const group = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

// Fade + ≤ 8px translate, ≤ 400ms — the only motion the LCP path tolerates.
const block = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function HeroIntro() {
  return (
    <motion.div
      variants={group}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center gap-6"
    >
      {/*
        D-02 kicker — JetBrains Mono 14px/400 uppercase, tracking 0.08em, muted.
        MUST wrap cleanly at 360px (Pitfall 6 / LNCH-01): the line is NEVER forced
        onto a single line; `text-balance` evens out the two lines when it wraps.
      */}
      <motion.p
        variants={block}
        className="font-mono text-sm font-normal uppercase tracking-[0.08em] text-balance text-text-muted"
      >
        Founder &amp; Lead Engineer @ Revly · CompE @ UIUC
      </motion.p>

      {/*
        D-03 sub-headline — Inter 16px weight 600, SOLID #EDEDF2 (text token).
        NEVER gradient (gradient is reserved for the display h1 only).
      */}
      <motion.p
        variants={block}
        className="max-w-2xl font-sans text-base font-semibold text-text"
      >
        I build and ship real things — from a live automotive marketplace to
        robotics and games played 40,000+ times.
      </motion.p>

      {/* D-06 — the 3 CTAs, rendered as <a> via Button `as="a"`. */}
      <motion.div
        variants={block}
        className="flex flex-col items-center gap-3 sm:flex-row"
      >
        {/* D-09 — in-page anchor; degrades gracefully on the hero-only page. */}
        <Button as="a" href="#work" variant="primary">
          View Work
        </Button>

        {/* D-07 — basePath-aware static asset; `download` attribute. */}
        <Button
          as="a"
          href={withBasePath("/resume.pdf")}
          download
          variant="secondary"
        >
          Download Resume
        </Button>

        {/* D-08 — the intentional `.edu` recruiter address (NOT the gmail). */}
        <Button as="a" href="mailto:jackyz4@illinois.edu" variant="ghost">
          Get in Touch
        </Button>
      </motion.div>
    </motion.div>
  );
}
