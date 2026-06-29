import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { withBasePath } from "@/lib/base-path";

/**
 * Nav — sticky top bar composed FROM the design-system primitives (DSYS-03,
 * UI-SPEC Nav row, D-09). Brand mark + the future-section anchors
 * (#work / #about / #contact) + a Resume CTA reusing <Button> with the
 * basePath-aware /resume.pdf href.
 *
 * D-09: anchors degrade gracefully on the hero-only page — they are real
 * in-page anchors (no bare-hash placeholders, no console errors); until the
 * Projects/About/Contact sections exist (Phases 2–3) clicking is a harmless
 * no-op. The single-hue blue accent underline is the active/hover indicator
 * (NOT the gradient — gradient is reserved for the hero h1).
 *
 * Convention established here for every external link rendered later
 * (T-01-07 / reverse-tabnabbing): `target="_blank"` MUST carry
 * `rel="noopener noreferrer"`. No external links exist yet, so none are emitted.
 *
 * Every interactive element shows the DSYS-04 focus ring
 * (`focus-visible:outline-blue`, 2px / 2px offset). Pure markup → Server
 * Component (no `"use client"`).
 */

const sectionLinks = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-surface/70 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3">
        {/* Brand mark — returns to the top of the page (the hero region). */}
        <a
          href="#main"
          className="rounded-[var(--radius-sm)] font-display text-lg font-semibold tracking-[-0.01em] text-text transition-colors duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          Jacky Zhang
        </a>

        {/* Section anchors — single-hue accent underline on hover/focus. */}
        <ul className="hidden items-center gap-1 sm:flex">
          {sectionLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "relative rounded-[var(--radius-sm)] px-3 py-2 font-mono text-sm uppercase tracking-[0.08em] text-text-muted transition-colors duration-150 hover:text-text",
                  "after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-blue after:transition-transform after:duration-150 hover:after:scale-x-100 focus-visible:after:scale-x-100",
                  "focus-visible:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Resume CTA — reuses Button; basePath-aware static asset (D-07). */}
        <Button
          as="a"
          href={withBasePath("/resume.pdf")}
          download
          variant="secondary"
          size="sm"
        >
          Resume
        </Button>
      </nav>
    </header>
  );
}
