import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * PaneFrame — a single terminal "window": title bar (monochrome traffic-light
 * dots + path title + optional close) over a scrollable mono body. Content-
 * agnostic shell styled only from @theme tokens (monochrome — no gradient).
 * The hero pane omits `onClose` (pinned); section panes pass it.
 */
export function PaneFrame({
  title,
  onClose,
  className,
  children,
}: {
  title: string;
  onClose?: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface/80 shadow-xl backdrop-blur-sm",
        className,
      )}
    >
      <header className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full border border-border" />
          <span className="h-3 w-3 rounded-full border border-border" />
          <span className="h-3 w-3 rounded-full border border-border" />
        </span>
        <span className="ml-1 truncate font-mono text-xs text-text-muted">
          {title}
        </span>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="ml-auto rounded-[var(--radius-sm)] p-1 text-text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </header>
      <div className="flex-1 overflow-auto px-5 py-4 font-mono text-sm leading-relaxed text-text">
        {children}
      </div>
    </section>
  );
}
