import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * TechPill — reusable mono stack/tag chip (DSYS-03). Styled only from @theme
 * tokens: JetBrains Mono 14px/400 uppercase tracked, `rounded-full`
 * (radius-pill), `bg-surface`, hairline `border-border`. Content-agnostic —
 * the label is passed via `children`. RSC-safe.
 *
 * `size`: sm (compact) | md (default) — only the padding changes.
 */
type Size = "sm" | "md";

const sizes: Record<Size, string> = {
  sm: "px-2 py-1",
  md: "px-3 py-1.5",
};

export type TechPillProps = HTMLAttributes<HTMLSpanElement> & {
  size?: Size;
};

export function TechPill({
  size = "md",
  className,
  children,
  ...rest
}: TechPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface font-mono text-sm font-normal uppercase tracking-[0.08em] text-text-muted",
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
