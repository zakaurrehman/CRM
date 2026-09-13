import { getP } from "@/lib/i18n/server";
import { Button } from "@/components/ui/Button";
import { contact } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The one commercial door (IMS, 14 September 2026): a Contact IMS button
 * that opens an email to the general address, and under it the sentence
 * that says the address for anyone who would rather copy it. Wherever a
 * page used to offer the two forms — Offer material, Request supply — it
 * offers this instead. The forms stay reachable from the header menu and
 * the footer.
 */
export async function ContactIms({
  tone = "light",
  align = "start",
  size = "md",
  className,
}: {
  /** Colours for the sentence: on a dark band, or on a light ground. */
  tone?: "light" | "dark";
  align?: "start" | "center";
  size?: "md" | "lg";
  className?: string;
}) {
  const p = await getP();
  const mailto = "mailto:" + contact.email;
  const dark = tone === "dark";

  return (
    <div className={cn(align === "center" && "flex flex-col items-center text-center", className)}>
      <Button
        href={mailto}
        variant={dark ? "onDark" : "primary"}
        size={size}
        className={cn(align === "start" && "w-full sm:w-auto lg:w-full")}
      >
        {p("Contact IMS")}
      </Button>
      <p className={cn("mt-4 max-w-md text-sm leading-relaxed", dark ? "text-steel-300" : "text-steel-500")}>
        {p("For buying, selling and other material enquiries, contact us at")}{" "}
        <a
          href={mailto}
          className={cn(
            "rounded-sm underline underline-offset-4",
            dark
              ? "text-white decoration-brand-500/60 hover:decoration-brand-300"
              : "text-navy-900 decoration-steel-300 hover:decoration-brand-700",
          )}
        >
          {contact.email}
        </a>
        .
      </p>
    </div>
  );
}
