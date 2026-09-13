/** Minimal class-name joiner. Avoids pulling in clsx/tailwind-merge for a handful of call sites. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatDate(iso: string, tag = "en-GB"): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(tag, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Normalises a string for accent- and case-insensitive substring search.
 * NFD splits accented characters into base + combining mark, the mark is
 * dropped, and anything that is not alphanumeric collapses to a single space.
 */
export function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    /* Letters and digits in any script, not only a-z: a Russian or Hebrew
       search otherwise normalised to an empty string and matched nothing.
       Every grade designation is Latin, so grade ids and anchors, which key
       the compare tray, saved list and RFQ lines, come out unchanged. */
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}
