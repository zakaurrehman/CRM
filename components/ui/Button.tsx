import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "onDark" | "onDarkGhost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded font-medium transition-all duration-200 ease-swift " +
  "disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white shadow-subtle hover:bg-brand-800 hover:shadow-card active:bg-brand-900 " +
    "motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0",
  secondary:
    "border border-steel-300 bg-white text-navy-900 hover:border-brand-700 hover:text-brand-700 hover:shadow-subtle " +
    "motion-safe:hover:-translate-y-px",
  ghost: "text-navy-900 hover:bg-steel-100",
  onDark: "bg-white text-navy-900 hover:bg-brand-50 active:bg-brand-100 motion-safe:hover:-translate-y-px",
  onDarkGhost: "border border-white/25 text-white hover:border-white/60 hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}

export function ButtonEl({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

/** Text link with a sliding arrow, used to close cards and editorial blocks. */
export function ArrowLink({
  href,
  children,
  className,
  tone = "brand",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  tone?: "brand" | "light";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/al inline-flex items-center gap-2 text-[0.9375rem] font-medium transition-colors",
        tone === "brand" ? "text-brand-700 hover:text-brand-900" : "text-white/90 hover:text-white",
        className,
      )}
    >
      {children}
      <span aria-hidden className="transition-transform duration-200 ease-swift group-hover/al:translate-x-1">
        &rarr;
      </span>
    </Link>
  );
}
