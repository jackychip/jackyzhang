import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Button — the only interactive design-system primitive (DSYS-03/DSYS-04).
 *
 * - `variant`: primary (solid near-white fill, dark text) | secondary (outline) |
 *   ghost (text-only). Monochrome, no gradient — all variants styled ONLY from
 *   @theme tokens.
 * - `size`: md (default) | sm — `sm` shrinks the visual padding/text but NEVER
 *   the 44px hit area (`min-h-11` lives in `base`, so it applies to both — the
 *   LNCH-01 / UI-SPEC touch-target rule, achieved via min-height not glyph size).
 * - `as="a"`: renders an <a> so the 01-04 CTAs can use `withBasePath("/resume.pdf")`
 *   + `download`, a `mailto:` link, or a `#work` anchor — `href`/`download`/
 *   `target`/`rel` forward through. External links pass `rel="noopener noreferrer"`
 *   (T-01-06) — the prop pass-through supports it.
 * - Optional leading/trailing `lucide-react` icon via `icon` + `iconPosition`.
 *
 * The `focus-visible:outline-blue` (#3B82F6, 2px / 2px offset) ring in `base` is
 * the DSYS-04 keyboard focus state — never strip `outline` without an equivalent.
 *
 * Pure class + polymorphic element → no interactive handlers of its own, so this
 * stays a Server Component (no `"use client"`).
 */

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

const variants: Record<Variant, string> = {
  primary: "bg-text text-bg hover:bg-text-muted",
  secondary: "border border-border text-text hover:bg-surface",
  ghost: "text-text hover:bg-surface",
};

const sizes: Record<Size, string> = {
  md: "px-4 text-base",
  sm: "px-3 text-sm",
};

// `min-h-11` (44px) is the hit-area rule and lives here so BOTH sizes keep it.
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] font-sans font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:pointer-events-none disabled:opacity-50";

type SharedProps = {
  variant?: Variant;
  size?: Size;
  /** Optional lucide-react icon component (e.g. `ArrowRight`). */
  icon?: LucideIcon;
  iconPosition?: "leading" | "trailing";
  className?: string;
  children?: ReactNode;
};

type ButtonAsButton = SharedProps & { as?: "button" } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof SharedProps | "as"
  >;

type ButtonAsAnchor = SharedProps & { as: "a" } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof SharedProps | "as"
  >;

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

// Permissive internal shape: lets us pull the custom props off and spread the
// remaining DOM attributes onto either element without leftover unused bindings.
type InternalProps = SharedProps & { as?: "button" | "a" } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement> &
      ButtonHTMLAttributes<HTMLButtonElement>,
    keyof SharedProps | "as"
  >;

export function Button(props: ButtonProps) {
  const {
    as = "button",
    variant = "primary",
    size = "md",
    icon: Icon,
    iconPosition = "leading",
    className,
    children,
    ...rest
  } = props as InternalProps;

  const classes = cn(base, variants[variant], sizes[size], className);

  const iconEl = Icon ? (
    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
  ) : null;

  const content = (
    <>
      {iconPosition === "leading" ? iconEl : null}
      {children}
      {iconPosition === "trailing" ? iconEl : null}
    </>
  );

  if (as === "a") {
    return (
      <a
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
