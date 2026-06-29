import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Card — content-agnostic surface shell (DSYS-03). Styled only from @theme
 * tokens: `bg-surface` (#14141F), `rounded-[var(--radius-lg)]` (16px), hairline
 * `border-border`, `lg` padding (24px). Shell only this phase — project content
 * lands Phase 2 via `children`. RSC-safe (no interactivity).
 */
export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-surface p-6",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
