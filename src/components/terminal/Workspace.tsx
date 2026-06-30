"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { withBasePath } from "@/lib/base-path";
import { SECTIONS, type SectionId } from "@/lib/sections";
import { PaneFrame } from "./PaneFrame";

/**
 * Workspace — the tiling-terminal portfolio.
 *
 * The hero pane is pinned at the left (with a margin). Clicking a launcher
 * "opens" a section as its own terminal pane appended on the RIGHT; the whole
 * row then slides LEFT (animated `x`) so the newest pane stays flush to the
 * right edge and older panes slide off-screen to the left. Closing a pane
 * slides the row back to the right. No scrollbar — a transform shift.
 *
 * Re-opening an already-open section moves it to the end (slides it back into
 * view). On narrow screens the panes stack vertically (no shift) and the page
 * scrolls normally.
 *
 * LCP note: this is a client component, but App Router SSG still server-renders
 * its initial HTML — the hero name <h1> is static (no entrance animation), so
 * it remains the immediate, full-opacity LCP element (HERO-03). Only the row
 * shift + pane entrance animate, and the global MotionConfig reducedMotion
 * snaps those under prefers-reduced-motion.
 */
export function Workspace() {
  const [open, setOpen] = useState<SectionId[]>([]);
  const [shift, setShift] = useState(0);
  const [isNarrow, setIsNarrow] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const openPane = useCallback((id: SectionId) => {
    // Move-to-end if already open (slides it back into view), else append.
    setOpen((prev) => [...prev.filter((x) => x !== id), id]);
  }, []);

  const closePane = useCallback((id: SectionId) => {
    setOpen((prev) => prev.filter((x) => x !== id));
  }, []);

  const measure = useCallback(() => {
    const c = containerRef.current;
    const r = rowRef.current;
    if (!c || !r) return;
    const overflow = r.scrollWidth - c.clientWidth;
    setShift(Math.max(0, overflow));
  }, []);

  // Re-measure after the pane set or breakpoint changes.
  useLayoutEffect(() => {
    measure();
  }, [open, isNarrow, measure]);

  // Track the narrow breakpoint (matches Tailwind's `md`).
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Re-measure on container resize.
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(c);
    return () => ro.disconnect();
  }, [measure]);

  const openDefs = open
    .map((id) => SECTIONS.find((s) => s.id === id))
    .filter((s): s is (typeof SECTIONS)[number] => Boolean(s));

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      {/* Top bar — brand + section launchers + resume. */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        <span className="mr-2 font-mono text-sm font-semibold text-text">
          jacky@portfolio
        </span>
        <span className="font-mono text-sm text-text-muted">:~$ open</span>
        <div className="flex flex-wrap items-center gap-2">
          {SECTIONS.map((s) => {
            const active = open.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => openPane(s.id)}
                aria-pressed={active}
                className={cn(
                  "rounded-[var(--radius-sm)] border px-2.5 py-1 font-mono text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan",
                  active
                    ? "border-cyan/60 text-cyan"
                    : "border-border text-text-muted hover:border-text-muted hover:text-text",
                )}
              >
                {s.command}
              </button>
            );
          })}
        </div>
        <Button
          as="a"
          href={withBasePath("/resume.pdf")}
          download
          variant="secondary"
          size="sm"
          className="ml-auto"
        >
          Download Resume
        </Button>
      </div>

      {/* Pane viewport — clips the off-screen-left panes on desktop. */}
      <div ref={containerRef} className="md:overflow-hidden">
        <motion.div
          ref={rowRef}
          className="flex flex-col gap-4 md:flex-row md:items-stretch"
          animate={{ x: isNarrow ? 0 : -shift }}
          transition={{ type: "spring", stiffness: 260, damping: 32 }}
        >
          {/* Hero pane — pinned, not closable. */}
          <PaneFrame
            title="~ — visitor@jackyzhang"
            className="w-full md:h-[min(68vh,42rem)] md:w-[34rem] md:shrink-0"
          >
            <div className="space-y-4">
              <p className="text-text-muted">
                <span className="text-cyan">visitor@jackyzhang</span>
                <span className="text-cyan">:~$</span> whoami
              </p>
              <h1 className="text-3xl font-semibold tracking-[-0.02em] text-text sm:text-4xl">
                Jacky Zhang
                <span aria-hidden="true" className="terminal-cursor ml-1 text-cyan">
                  ▮
                </span>
              </h1>
              <p className="text-sm uppercase tracking-[0.08em] text-text-muted">
                Founder &amp; Lead Engineer @ Revly · CompE @ UIUC
              </p>
              <p className="max-w-md text-text-muted">
                I build and ship real things — from a live automotive marketplace
                to robotics and games played 40,000+ times.
              </p>
              <p className="pt-2 text-text-muted">
                <span className="text-cyan">visitor@jackyzhang</span>
                <span className="text-cyan">:~$</span> open{" "}
                <span className="text-text">
                  about · experience · projects · contact
                </span>
              </p>
              <p className="text-xs text-text-muted/70">
                ↑ run a command above — each opens a new pane to the right.
              </p>
            </div>
          </PaneFrame>

          {/* Section panes — appended on the right, newest stays in view. */}
          {openDefs.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full md:h-[min(68vh,42rem)] md:w-[34rem] md:shrink-0"
            >
              <PaneFrame
                title={s.title}
                onClose={() => closePane(s.id)}
                className="h-full"
              >
                {s.content}
              </PaneFrame>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
