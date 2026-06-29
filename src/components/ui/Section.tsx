import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Section — site-wide layout wrapper (DSYS-03). Centered max-width container
 * with a consistent horizontal gutter and responsive vertical padding
 * (`xl`/32px mobile → `3xl`/64px desktop) to establish vertical rhythm. Renders
 * a semantic <section> and forwards `id` for in-page anchors (#work/#about/
 * #contact). Content-agnostic via `children`. RSC-safe.
 *
 * `width`: default (`max-w-5xl`) | wide (`max-w-6xl`).
 */
type Width = "default" | "wide";

const widths: Record<Width, string> = {
  default: "max-w-5xl",
  wide: "max-w-6xl",
};

export type SectionProps = HTMLAttributes<HTMLElement> & {
  width?: Width;
};

export function Section({
  width = "default",
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn(
        "mx-auto w-full px-6 py-8 md:py-16",
        widths[width],
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
