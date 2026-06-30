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
import { Echo, NODES, TOP_LEVEL, type NodeId } from "@/lib/sections";
import { PaneFrame } from "./PaneFrame";

/**
 * Workspace — the tiling-terminal portfolio (Miller-column navigation).
 *
 * Open panes form a PATH from the pinned hero (root): `path[0]` is column 1,
 * `path[1]` column 2, etc. Panes = [hero, ...path].
 *
 *   - A TOP_LEVEL launcher (or the hero's `ls`) sets column 1 — `setPath([id])`
 *     — so ./about then ./experience REPLACES the child pane (siblings don't
 *     stack).
 *   - A node's child entry appends the next column (experience → revly).
 *   - Closing a pane truncates the path from that column rightward.
 *
 * Desktop: the hero sits LEFT when alone; once a section is open the row slides
 * so the NEWEST pane is CENTERED in the viewport (older panes slide left, hero
 * peeks off the left edge). Mobile: panes stack vertically and the view
 * auto-scrolls to the newest pane. The persistent name lives in the sticky bar.
 *
 * LCP: client component, but App Router SSG server-renders the static hero <h1>
 * (no entrance animation) → it stays the immediate, full-opacity LCP element.
 */

const linkClass =
  "text-text underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const entryClass =
  "rounded-[var(--radius-sm)] text-left text-text transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** Pane body: a node's static content + its clickable `ls` children. */
function NodeBody({
  id,
  onOpenChild,
}: {
  id: NodeId;
  onOpenChild: (childId: NodeId) => void;
}) {
  const node = NODES[id];
  return (
    <div className="space-y-4">
      {node.body}
      {node.children?.length ? (
        <div className="space-y-2">
          <Echo>ls</Echo>
          <ul className="space-y-1">
            {node.children.map((childId) => (
              <li key={childId}>
                <button
                  type="button"
                  onClick={() => onOpenChild(childId)}
                  className={entryClass}
                >
                  {NODES[childId].label}
                </button>
              </li>
            ))}
          </ul>
          <p className="text-xs text-text-muted/70">
            ↳ click an entry to open it in a new pane →
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function Workspace() {
  const [path, setPath] = useState<NodeId[]>([]);
  const [x, setX] = useState(0);
  const [isNarrow, setIsNarrow] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const lastPaneRef = useRef<HTMLDivElement>(null);

  const openTop = useCallback((id: NodeId) => setPath([id]), []);

  const openChildAt = useCallback(
    (pathIndex: number, childId: NodeId) =>
      setPath((prev) => [...prev.slice(0, pathIndex + 1), childId]),
    [],
  );

  const closeAt = useCallback(
    (pathIndex: number) => setPath((prev) => prev.slice(0, pathIndex)),
    [],
  );

  // Desktop: translate the row so the NEWEST pane is centered; hero stays left
  // when nothing else is open. Mobile: no transform (panes stack + scroll).
  const measure = useCallback(() => {
    const c = containerRef.current;
    const r = rowRef.current;
    if (!c || !r) return;
    if (isNarrow || path.length === 0) {
      setX(0);
      return;
    }
    const panes = r.children;
    const last = panes[panes.length - 1] as HTMLElement | undefined;
    if (!last) {
      setX(0);
      return;
    }
    const paneCenter = last.offsetLeft + last.offsetWidth / 2;
    setX(c.clientWidth / 2 - paneCenter);
  }, [isNarrow, path.length]);

  useLayoutEffect(() => {
    measure();
  }, [path, isNarrow, measure]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(c);
    return () => ro.disconnect();
  }, [measure]);

  // Mobile: scroll the newest pane into view when the path grows/changes.
  useEffect(() => {
    if (isNarrow && path.length > 0 && lastPaneRef.current) {
      lastPaneRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [path, isNarrow]);

  const titleAt = (pathIndex: number) =>
    "~/" +
    path
      .slice(0, pathIndex + 1)
      .map((id) => NODES[id].name)
      .join("/");

  const paneSize =
    "w-full scroll-mt-24 md:h-[min(68vh,42rem)] md:w-[34rem] md:shrink-0";

  return (
    <div className="flex flex-1 flex-col">
      {/* Sticky bar — the name is visible at all times here. */}
      <div className="sticky top-0 z-50 flex flex-wrap items-center gap-x-2 gap-y-3 border-b border-border bg-bg/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <span className="mr-1 font-mono text-sm font-semibold text-text">
          Jacky Zhang
        </span>
        <span className="font-mono text-sm text-text-muted">~ $ open</span>
        <div className="flex flex-wrap items-center gap-2">
          {TOP_LEVEL.map((id) => {
            const active = path[0] === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => openTop(id)}
                aria-pressed={active}
                className={cn(
                  "rounded-[var(--radius-sm)] border px-2.5 py-1 font-mono text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  active
                    ? "border-accent/60 text-accent"
                    : "border-border text-text-muted hover:border-text-muted hover:text-text",
                )}
              >
                {NODES[id].label}
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

      {/* Pane viewport. */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div ref={containerRef} className="md:overflow-hidden">
          <motion.div
            ref={rowRef}
            className="relative flex flex-col gap-4 md:flex-row md:items-stretch"
            animate={{ x: isNarrow ? 0 : x }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            {/* Hero pane — pinned; its `ls` opens top-level panes. */}
            <PaneFrame title="~ — visitor@jackyzhang" className={paneSize}>
              <div className="space-y-4">
                <p className="text-text-muted">
                  <span className="text-accent">visitor@jackyzhang</span>
                  <span className="text-accent">:~$</span> whoami
                </p>
                <h1 className="text-3xl font-semibold tracking-[-0.02em] text-text sm:text-4xl">
                  Jacky Zhang
                  <span
                    aria-hidden="true"
                    className="terminal-cursor ml-1 text-accent"
                  >
                    ▮
                  </span>
                </h1>
                <p className="text-sm uppercase tracking-[0.08em] text-text-muted">
                  Founder &amp; Lead Engineer @ Revly · CompE @ UIUC
                </p>
                <p className="max-w-md text-text-muted">
                  I build and ship real things — from a live automotive
                  marketplace to robotics and games played 40,000+ times.
                </p>
                <p className="text-text-muted">
                  <span className="text-accent">email</span>{" "}
                  <a className={linkClass} href="mailto:jackyz4@illinois.edu">
                    jackyz4@illinois.edu
                  </a>
                </p>
                <div className="space-y-2 pt-1">
                  <Echo>ls</Echo>
                  <ul className="space-y-1">
                    {TOP_LEVEL.map((id) => (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => openTop(id)}
                          className={entryClass}
                        >
                          {NODES[id].label}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-text-muted/70">
                    ↳ open a section — it appears as a pane on the right →
                  </p>
                </div>
              </div>
            </PaneFrame>

            {/* Path panes — Miller columns; newest is centered (desktop). */}
            {path.map((id, i) => (
              <motion.div
                key={`${i}-${id}`}
                ref={i === path.length - 1 ? lastPaneRef : undefined}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={paneSize}
              >
                <PaneFrame
                  title={titleAt(i)}
                  onClose={() => closeAt(i)}
                  className="h-full"
                >
                  <NodeBody
                    id={id}
                    onOpenChild={(childId) => openChildAt(i, childId)}
                  />
                </PaneFrame>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
