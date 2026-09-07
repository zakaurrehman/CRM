import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "navy" | "outline" | "onDark";

const tones: Record<Tone, string> = {
  neutral: "bg-steel-100 text-steel-700",
  brand: "bg-brand-50 text-brand-800",
  navy: "bg-navy-900 text-white",
  outline: "border border-steel-300 text-steel-600",
  onDark: "border border-white/20 bg-white/5 text-steel-200",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.1em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
