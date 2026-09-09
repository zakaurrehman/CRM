"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  MAX_LINES,
  emptyLine,
  formatRfqText,
  hasRfqErrors,
  rfqConditions,
  rfqDirections,
  rfqTimescales,
  rfqUnits,
  validateRfq,
  type RfqFieldErrors,
  type RfqLine,
  type RfqPayload,
} from "@/lib/rfq";
import { useAlloyIndex, useCompare, useSaved, formatAmount } from "@/lib/alloy-client";
import { ButtonEl } from "@/components/ui/Button";
import { contact } from "@/lib/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "sent" | "error";

const inputBase =
  "h-12 w-full rounded border bg-white px-3.5 text-[0.9375rem] text-navy-900 transition-colors " +
  "placeholder:text-steel-500 hover:border-steel-400 focus:border-brand-700";

/**
 * Quotation request.
 *
 * The line items are the point. A buyer pricing four grades needs four
 * quantities against four conditions, and the usual "material" text box forces
 * that into prose which someone then has to unpick by hand.
 *
 * Lines arrive pre-filled from three places — the ?grades= parameter the
 * comparison page links with, the comparison tray, and saved materials — so the
 * path from "these four look right" to "quote me these four" is one click and
 * no retyping.
 */
export function RfqForm() {
  const id = useId();
  const params = useSearchParams();
  const { index } = useAlloyIndex();
  const compare = useCompare();
  const saved = useSaved();

  const [lines, setLines] = useState<RfqLine[]>([emptyLine()]);
  const [errors, setErrors] = useState<RfqFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [fallbackHref, setFallbackHref] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const seeded = useRef(false);

  const field = (name: string) => `${id}-${name}`;

  /* Seed once, from the URL, as soon as the catalogue is available. Guarded so
     that editing a seeded line is never undone by a re-render. */
  useEffect(() => {
    if (seeded.current || !index) return;
    const requested = (params.get("grades") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    if (requested.length === 0) return;
    const seededLines = requested
      .slice(0, MAX_LINES)
      .map((gradeId) => index.gradeById.get(gradeId))
      .filter((g) => g !== undefined)
      .map((g) => ({ ...emptyLine(), gradeId: g.id, material: `${g.name} (${g.categoryName})` }));
    if (seededLines.length) {
      seeded.current = true;
      setLines(seededLines);
    }
  }, [index, params]);

  const addGrades = (ids: string[]) => {
    if (!index) return;
    setLines((current) => {
      const taken = new Set(current.map((l) => l.gradeId).filter(Boolean));
      const additions = ids
        .filter((gid) => !taken.has(gid))
        .map((gid) => index.gradeById.get(gid))
        .filter((g) => g !== undefined)
        .map((g) => ({ ...emptyLine(), gradeId: g.id, material: `${g.name} (${g.categoryName})` }));
      // Drop a single untouched blank line rather than leaving it above the additions.
      const base = current.length === 1 && !current[0].material.trim() ? [] : current;
      return [...base, ...additions].slice(0, MAX_LINES);
    });
  };

  const setLine = (i: number, patch: Partial<RfqLine>) =>
    setLines((current) => current.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data: RfqPayload = {
      name: String(form.get("name") ?? ""),
      company: String(form.get("company") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? "") || undefined,
      country: String(form.get("country") ?? "") || undefined,
      direction: String(form.get("direction") ?? ""),
      timescale: String(form.get("timescale") ?? "") || undefined,
      message: String(form.get("message") ?? "") || undefined,
      lines,
    };

    const clientErrors = validateRfq(data);
    setErrors(clientErrors);
    if (hasRfqErrors(clientErrors)) {
      const firstKey = Object.keys(clientErrors).find((k) => k !== "lines");
      const target = firstKey
        ? formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)
        : formRef.current?.querySelector<HTMLElement>("[data-line-material]");
      target?.focus();
      return;
    }

    setStatus("submitting");
    setFormError(null);

    try {
      const response = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: String(form.get("website") ?? "") }),
      });
      const result = (await response.json()) as { ok: boolean; errors?: RfqFieldErrors; error?: string };

      if (result.ok) {
        setStatus("sent");
        return;
      }
      if (result.errors) {
        setErrors(result.errors);
        setStatus("idle");
        return;
      }
      setFormError(result.error ?? "Something went wrong. Please try again.");
      setFallbackHref(composeMailto(data));
      setStatus("error");
    } catch {
      setFormError("We could not reach the server. Please check your connection and try again.");
      setFallbackHref(composeMailto(data));
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border-t-2 border-success-500 bg-success-50 p-8">
        <h2 className="font-display text-2xl font-semibold text-navy-900">Quotation request received</h2>
        <p className="mt-3 content-en text-[1.0625rem] leading-relaxed text-steel-700">
          Thank you &mdash; your request is with our team, with all {lines.length}{" "}
          {lines.length === 1 ? "line" : "lines"} attached. We will come back to you with pricing and availability.
        </p>
        <button
          type="button"
          onClick={() => {
            setLines([emptyLine()]);
            setErrors({});
            setStatus("idle");
            formRef.current?.reset();
          }}
          className="mt-6 inline-flex h-11 items-center rounded border border-steel-300 bg-white px-5 text-[0.9375rem] font-medium text-navy-900 transition-colors hover:border-brand-700 hover:text-brand-700"
        >
          Start another request
        </button>
      </div>
    );
  }

  const importable = [
    { label: `comparison (${compare.ids.length})`, ids: compare.ids },
    { label: `saved materials (${saved.ids.length})`, ids: saved.ids },
  ].filter((s) => s.ids.length > 0);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-8">
      {/* Honeypot. Hidden by clipping rather than by parking it at left:-9999px:
          a physical offset extends the scrollable area on whichever side is
          "behind" the reading direction, which gave every RTL page a 9999px
          horizontal scroll. */}
      <div aria-hidden className="sr-only">
        <label htmlFor={field("website")}>Website</label>
        <input id={field("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div aria-live="assertive" className="sr-only">
        {formError ?? (hasRfqErrors(errors) ? "The form has errors. Please review the fields." : "")}
      </div>

      {formError ? (
        <div className="border-s-2 border-danger-500 bg-danger-50 p-5">
          <p className="text-[0.9375rem] text-navy-900">{formError}</p>
          <a
            href={fallbackHref ?? "mailto:" + contact.email}
            className="mt-2 inline-block text-[0.9375rem] font-medium text-brand-700 underline underline-offset-4"
          >
            Send it by email instead &mdash; your details are already filled in
          </a>
        </div>
      ) : null}

      {/* ---------- line items ---------- */}
      <fieldset>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <legend className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
            Materials to quote
          </legend>
          {importable.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[0.8125rem] text-steel-500">Add from</span>
              {importable.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => addGrades(s.ids)}
                  className="rounded-sm border border-steel-300 bg-white px-2.5 py-1 text-[0.8125rem] font-medium text-brand-700 transition-colors hover:border-brand-700"
                >
                  {s.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <ul className="mt-4 space-y-4">
          {lines.map((line, i) => {
            const lineError = errors.lines?.[i];
            const grade = line.gradeId ? index?.gradeById.get(line.gradeId) : undefined;
            return (
              <li key={i} className="rounded-md border border-steel-200 bg-white p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-500">
                    Line {i + 1}
                  </span>
                  {lines.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setLines((c) => c.filter((_, j) => j !== i))}
                      className="text-[0.8125rem] font-medium text-steel-600 transition-colors hover:text-danger-600"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                <div className="mt-3 grid gap-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor={field(`material-${i}`)} className="block text-[0.9375rem] font-medium text-navy-900">
                      Material or grade <span className="text-danger-500">*</span>
                    </label>
                    <input
                      id={field(`material-${i}`)}
                      data-line-material
                      value={line.material}
                      onChange={(e) => setLine(i, { material: e.target.value, gradeId: undefined })}
                      placeholder="e.g. Inconel 718, or describe the stream"
                      aria-invalid={Boolean(lineError?.material)}
                      aria-describedby={lineError?.material ? field(`material-${i}`) + "-error" : undefined}
                      className={cn(inputBase, "mt-2", lineError?.material ? "border-danger-500" : "border-steel-300")}
                    />
                    {lineError?.material ? (
                      <p id={field(`material-${i}`) + "-error"} className="mt-2 text-[0.8125rem] text-danger-600">
                        {lineError.material}
                      </p>
                    ) : null}
                    {grade ? (
                      <p className="mt-2 font-mono text-[0.75rem] text-steel-500">
                        From the catalogue &middot;{" "}
                        {grade.composition.slice(0, 5).map((c) => `${c.element} ${formatAmount(c)}`).join("  ")}
                      </p>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={field(`qty-${i}`)} className="block text-[0.9375rem] font-medium text-navy-900">
                      Quantity
                    </label>
                    <input
                      id={field(`qty-${i}`)}
                      value={line.quantity}
                      onChange={(e) => setLine(i, { quantity: e.target.value })}
                      inputMode="decimal"
                      placeholder="e.g. 500"
                      className={cn(inputBase, "mt-2 border-steel-300")}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={field(`unit-${i}`)} className="block text-[0.9375rem] font-medium text-navy-900">
                      Unit
                    </label>
                    <select
                      id={field(`unit-${i}`)}
                      value={line.unit}
                      onChange={(e) => setLine(i, { unit: e.target.value })}
                      className={cn(inputBase, "mt-2 border-steel-300")}
                    >
                      {rfqUnits.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={field(`cond-${i}`)} className="block text-[0.9375rem] font-medium text-navy-900">
                      Condition
                    </label>
                    <select
                      id={field(`cond-${i}`)}
                      value={line.condition}
                      onChange={(e) => setLine(i, { condition: e.target.value })}
                      className={cn(inputBase, "mt-2 border-steel-300")}
                    >
                      {rfqConditions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor={field(`note-${i}`)} className="block text-[0.9375rem] font-medium text-navy-900">
                      Specification notes <span className="font-normal text-steel-500">(optional)</span>
                    </label>
                    <input
                      id={field(`note-${i}`)}
                      value={line.note ?? ""}
                      onChange={(e) => setLine(i, { note: e.target.value })}
                      placeholder="Form, size, certification, delivery point"
                      className={cn(inputBase, "mt-2 border-steel-300")}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {lines.length < MAX_LINES ? (
          <ButtonEl
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => setLines((c) => [...c, emptyLine()])}
          >
            Add another material
          </ButtonEl>
        ) : (
          <p className="mt-4 text-[0.8125rem] text-steel-500">
            That is the maximum of {MAX_LINES} lines. Put anything further in the notes below.
          </p>
        )}
      </fieldset>

      {/* ---------- requester ---------- */}
      <fieldset className="space-y-6 border-t border-steel-200 pt-8">
        <legend className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
          Your details
        </legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id={field("name")} name="name" label="Name" required error={errors.name} autoComplete="name" />
          <Field id={field("company")} name="company" label="Company" required error={errors.company} autoComplete="organization" />
          <Field id={field("email")} name="email" label="Email" type="email" required error={errors.email} autoComplete="email" />
          <Field id={field("phone")} name="phone" label="Phone" type="tel" error={errors.phone} autoComplete="tel" hint="optional" />
          <Field id={field("country")} name="country" label="Country" error={errors.country} autoComplete="country-name" hint="optional" />

          <div>
            <label htmlFor={field("timescale")} className="block text-[0.9375rem] font-medium text-navy-900">
              Timescale <span className="font-normal text-steel-500">(optional)</span>
            </label>
            <select id={field("timescale")} name="timescale" className={cn(inputBase, "mt-2 border-steel-300")}>
              <option value="">Select&hellip;</option>
              {rfqTimescales.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor={field("direction")} className="block text-[0.9375rem] font-medium text-navy-900">
            Which way round is this? <span className="text-danger-500">*</span>
          </label>
          <select
            id={field("direction")}
            name="direction"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.direction)}
            aria-describedby={errors.direction ? field("direction") + "-error" : undefined}
            className={cn(inputBase, "mt-2", errors.direction ? "border-danger-500" : "border-steel-300")}
          >
            <option value="" disabled>Select&hellip;</option>
            {rfqDirections.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.direction ? (
            <p id={field("direction") + "-error"} className="mt-2 text-[0.8125rem] text-danger-600">
              {errors.direction}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={field("message")} className="block text-[0.9375rem] font-medium text-navy-900">
            Anything else <span className="font-normal text-steel-500">(optional)</span>
          </label>
          <textarea
            id={field("message")}
            name="message"
            rows={4}
            placeholder="Packaging, delivery terms, certification requirements, recurring volumes"
            className={cn(
              "mt-2 w-full rounded border bg-white px-3.5 py-3 text-[0.9375rem] leading-relaxed text-navy-900 transition-colors placeholder:text-steel-500 hover:border-steel-400 focus:border-brand-700",
              errors.message ? "border-danger-500" : "border-steel-300",
            )}
          />
          {errors.message ? (
            <p className="mt-2 text-[0.8125rem] text-danger-600">{errors.message}</p>
          ) : null}
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 border-t border-steel-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.8125rem] text-steel-500">
          <span className="text-danger-500">*</span> Required. We use your details only to respond to this request.
        </p>
        <ButtonEl type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : `Request quotation for ${lines.length}`}
        </ButtonEl>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required = false,
  error,
  hint,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.9375rem] font-medium text-navy-900">
        {label}{" "}
        {required ? (
          <span className="text-danger-500">*</span>
        ) : hint ? (
          <span className="font-normal text-steel-500">({hint})</span>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? id + "-error" : undefined}
        className={cn(inputBase, "mt-2", error ? "border-danger-500" : "border-steel-300")}
      />
      {error ? (
        <p id={id + "-error"} className="mt-2 text-[0.8125rem] text-danger-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Same fallback as the inquiry form: a failed send should cost a click, not the whole request. */
function composeMailto(payload: RfqPayload): string {
  const subject = `RFQ: ${payload.lines.length} material${payload.lines.length === 1 ? "" : "s"} — ${payload.company}`;
  return (
    "mailto:" + contact.email +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(formatRfqText(payload))
  );
}
