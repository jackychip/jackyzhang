import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Timeline — content-agnostic vertical list scaffold (DSYS-03). Shell only this
 * phase; populated in Phase 3 (EXP-01). Each `TimelineItem` renders a dot + a
 * connecting line + a `children` slot — NO data is hardcoded. Styled only from
 * @theme tokens (`border-border`, `bg-surface`). RSC-safe.
 */
export type TimelineProps = HTMLAttributes<HTMLOListElement>;

export function Timeline({ className, children, ...rest }: TimelineProps) {
  return (
    <ol className={cn("flex flex-col", className)} {...rest}>
      {children}
    </ol>
  );
}

export type TimelineItemProps = HTMLAttributes<HTMLLIElement> & {
  /** Hide the connecting line on the final item. */
  isLast?: boolean;
};

export function TimelineItem({
  isLast = false,
  className,
  children,
  ...rest
}: TimelineItemProps) {
  return (
    <li className={cn("relative flex gap-4 pb-8 last:pb-0", className)} {...rest}>
      <div className="flex flex-col items-center">
        <span
          className="mt-1.5 h-3 w-3 shrink-0 rounded-full border border-border bg-surface"
          aria-hidden="true"
        />
        {!isLast ? (
          <span className="w-px flex-1 bg-border" aria-hidden="true" />
        ) : null}
      </div>
      <div className="flex-1">{children}</div>
    </li>
  );
}
