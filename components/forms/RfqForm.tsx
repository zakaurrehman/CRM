"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENT_FORMATS,
  ATTACHMENT_LIMITS,
  MAX_LINES,
  attachmentProblem,
  emptyLine,
  formatBytes,
  formatRfqText,
  hasRfqErrors,
  isImageAttachment,
  rfqDirectionLabels,
  rfqDirections,
  rfqForms,
  rfqSubject,
  rfqUnits,
  validateRfq,
  type RfqDirection,
  type RfqFieldErrors,
  type RfqLine,
  type RfqPayload,
} from "@/lib/rfq";
import { useAlloyIndex, useCompare, useSaved, formatAmount } from "@/lib/alloy-client";
import { ButtonEl } from "@/components/ui/Button";
import { contact, routes } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useP } from "@/lib/i18n/phrases/client";

type Status = "idle" | "submitting" | "sent" | "error";

interface Attachment {
  id: string;
  file: File;
  /** Set when a photograph was reduced before sending. */
  reducedFrom?: number;
}

const inputBase =
  "h-12 w-full rounded border bg-white px-3.5 text-[0.9375rem] text-navy-900 transition-colors " +
  "placeholder:text-steel-500 hover:border-steel-400 focus:border-brand-700";

/** Photographs above this are reduced before sending; below it they go as taken. */
const IMAGE_PASS_BYTES = 600 * 1024;
const IMAGE_MAX_EDGE = 1600;

/**
 * Reduces a photograph in the browser: longest edge 1600px, JPEG. A phone
 * photograph of a lot is 3–6 MB as taken and about 300 KB like this, which
 * is what lets a set of them fit under the host's request limit. Anything
 * that cannot be decoded is returned as it is and judged on its size.
 */
async function reduceImage(file: File): Promise<File> {
  if (!isImageAttachment(file.type) || file.size <= IMAGE_PASS_BYTES) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, IMAGE_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

/**
 * Offer material / request supply.
 *
 * One form, two journeys (IMS, 14 September 2026). The direction comes first
 * — from the door the visitor came through, or the radio at the top — and
 * the fields follow it: a seller is asked for the available analysis, where
 * the material is, and to attach the COA and photographs; a buyer for the
 * required chemistry and the delivery point. Changing the direction updates
 * the address so the page header changes with it.
 *
 * The line items are the point. A buyer pricing four grades needs four
 * quantities against four specifications, and the usual "material" text box
 * forces that into prose which someone then has to unpick by hand. Lines
 * arrive pre-filled from three places — the ?grades= parameter the
 * comparison page links with, the comparison tray, and saved materials.
 */
export function RfqForm({ preset }: { preset?: RfqDirection } = {}) {
  const p = useP();
  const id = useId();
  const router = useRouter();
  const params = useSearchParams();
  const { index } = useAlloyIndex();
  const compare = useCompare();
  const saved = useSaved();

  const [direction, setDirection] = useState<RfqDirection | "">(preset ?? "");
  const [lines, setLines] = useState<RfqLine[]>([emptyLine()]);
  const [files, setFiles] = useState<Attachment[]>([]);
  const [fileNotices, setFileNotices] = useState<string[]>([]);
  const [errors, setErrors] = useState<RfqFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [fallbackHref, setFallbackHref] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const seeded = useRef(false);

  const selling = direction === "sell";
  const buying = direction === "buy";
  const field = (name: string) => `${id}-${name}`;

  /* The door the visitor came through wins, even after the form is open —
     a header link to the other journey should switch it. */
  useEffect(() => {
    if (preset) setDirection(preset);
  }, [preset]);

  const chooseDirection = (next: RfqDirection) => {
    setDirection(next);
    setErrors((e) => ({ ...e, direction: undefined }));
    const query = new URLSearchParams(params.toString());
    query.set("direction", next);
    router.replace(`${routes.rfq}?${query.toString()}`, { scroll: false });
  };

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

  const totalBytes = files.reduce((n, f) => n + f.file.size, 0);

  async function addFiles(chosen: FileList | null) {
    if (!chosen || chosen.length === 0) return;
    const notices: string[] = [];
    const next: Attachment[] = [...files];
    let total = totalBytes;
    for (const original of Array.from(chosen)) {
      if (next.length >= ATTACHMENT_LIMITS.maxFiles) {
        notices.push(p("{name}: not added — the limit is {n} files.", { name: original.name, n: ATTACHMENT_LIMITS.maxFiles }));
        continue;
      }
      const file = await reduceImage(original);
      const problem = attachmentProblem({ name: file.name, size: file.size, type: file.type });
      if (problem) {
        notices.push(`${original.name}: ${p(problem)}`);
        continue;
      }
      if (total + file.size > ATTACHMENT_LIMITS.maxTotalBytes) {
        notices.push(p("{name}: not added — together the files would exceed {size}. Send larger packs by email.", { name: original.name, size: formatBytes(ATTACHMENT_LIMITS.maxTotalBytes) }));
        continue;
      }
      total += file.size;
      next.push({
        id: `${Date.now()}-${next.length}-${file.name}`,
        file,
        reducedFrom: file.size < original.size ? original.size : undefined,
      });
    }
    setFiles(next);
    setFileNotices(notices);
    setErrors((e) => ({ ...e, attachments: undefined }));
    if (fileInput.current) fileInput.current.value = "";
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data: RfqPayload = {
      direction: direction as RfqDirection,
      name: String(form.get("name") ?? ""),
      company: String(form.get("company") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? "") || undefined,
      location: String(form.get("location") ?? "") || undefined,
      message: String(form.get("message") ?? "") || undefined,
      lines,
      attachments: files.map((f) => ({ name: f.file.name, size: f.file.size, type: f.file.type })),
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
      const body = new FormData();
      body.set("payload", JSON.stringify({ ...data, website: String(form.get("website") ?? "") }));
      for (const f of files) body.append("files", f.file, f.file.name);
      const response = await fetch("/api/rfq", { method: "POST", body });
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
      setFormError(result.error ?? p("Something went wrong. Please try again."));
      setFallbackHref(composeMailto(data));
      setStatus("error");
    } catch {
      setFormError(p("We could not reach the server. Please check your connection and try again."));
      setFallbackHref(composeMailto(data));
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border-t-2 border-success-500 bg-success-50 p-8">
        <h2 className="font-display text-2xl font-medium text-navy-900">
          {selling ? p("Material offer received") : p("Supply request received")}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-steel-700">
          {selling
            ? p("Thank you — your offer is with our team, with {n} line(s) and {f} file(s). We will assess the material and come back with the available route.", { n: lines.length, f: files.length })
            : p("Thank you — your request is with our team, with {n} line(s). We will review availability and come back with a quote.", { n: lines.length })}
        </p>
        <button
          type="button"
          onClick={() => {
            setLines([emptyLine()]);
            setFiles([]);
            setFileNotices([]);
            setErrors({});
            setStatus("idle");
            formRef.current?.reset();
          }}
          className="mt-6 inline-flex h-11 items-center rounded border border-steel-300 bg-white px-5 text-[0.9375rem] font-medium text-navy-900 transition-colors hover:border-brand-700 hover:text-brand-700"
        >
          {p("Start another request")}
        </button>
      </div>
    );
  }

  const importable = [
    { key: "comparison", label: `${p("comparison")} (${compare.ids.length})`, ids: compare.ids },
    { key: "saved", label: `${p("saved materials")} (${saved.ids.length})`, ids: saved.ids },
  ].filter((s) => s.ids.length > 0);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-8">
      {/* Honeypot. Hidden by clipping rather than by parking it at left:-9999px:
          a physical offset extends the scrollable area on whichever side is
          "behind" the reading direction, which gave every RTL page a 9999px
          horizontal scroll. */}
      <div aria-hidden className="sr-only">
        <label htmlFor={field("website")}>{p("Website")}</label>
        <input id={field("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div aria-live="assertive" className="sr-only">
        {formError ?? (hasRfqErrors(errors) ? p("The form has errors. Please review the fields.") : "")}
      </div>

      {formError ? (
        <div className="border-s-2 border-danger-500 bg-danger-50 p-5">
          <p className="text-[0.9375rem] text-navy-900">{formError}</p>
          <a
            href={fallbackHref ?? "mailto:" + contact.email}
            className="mt-2 inline-block text-[0.9375rem] font-medium text-brand-700 underline underline-offset-4"
          >
            {p("Send it by email instead — your details are already filled in")}
          </a>
          {files.length > 0 ? (
            <p className="mt-2 text-[0.8125rem] text-steel-600">{p("Attach the files to that email yourself; a mail link cannot carry them.")}</p>
          ) : null}
        </div>
      ) : null}

      {/* ---------- direction ---------- */}
      <fieldset>
        <legend className="label text-steel-500">{p("I want to:")}</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {rfqDirections.map((d) => {
            const active = direction === d;
            return (
              <label
                key={d}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border bg-white px-4 py-3.5 text-[0.9375rem] font-medium transition-colors",
                  active ? "border-brand-700 text-navy-900 ring-1 ring-brand-700" : "border-steel-300 text-navy-900 hover:border-steel-400",
                )}
              >
                <input
                  type="radio"
                  name="direction"
                  value={d}
                  checked={active}
                  onChange={() => chooseDirection(d)}
                  className="h-4 w-4 accent-brand-700"
                />
                {p(rfqDirectionLabels[d])}
              </label>
            );
          })}
        </div>
        {errors.direction ? (
          <p className="mt-2 text-[0.8125rem] text-danger-600">{p(errors.direction)}</p>
        ) : null}
      </fieldset>

      {/* ---------- line items ---------- */}
      <fieldset>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <legend className="label text-steel-500">
            {buying ? p("Material required") : p("Material offered")}
          </legend>
          {importable.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[0.8125rem] text-steel-500">{p("Add from")}</span>
              {importable.map((s) => (
                <button
                  key={s.key}
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
                  <span className="label text-steel-500">
                    {p("Line {n}", { n: i + 1 })}
                  </span>
                  {lines.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setLines((c) => c.filter((_, j) => j !== i))}
                      className="text-[0.8125rem] font-medium text-steel-600 transition-colors hover:text-danger-600"
                    >
                      {p("Remove")}
                    </button>
                  ) : null}
                </div>

                <div className="mt-3 grid gap-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor={field(`material-${i}`)} className="block text-[0.9375rem] font-medium text-navy-900">
                      {p("Material or grade")} <span className="text-danger-500">*</span>
                    </label>
                    <input
                      id={field(`material-${i}`)}
                      data-line-material
                      value={line.material}
                      onChange={(e) => setLine(i, { material: e.target.value, gradeId: undefined })}
                      placeholder={buying ? p("e.g. Inconel 718, or the specification") : p("e.g. Inconel 718 turnings, or describe the lot")}
                      aria-invalid={Boolean(lineError?.material)}
                      aria-describedby={lineError?.material ? field(`material-${i}`) + "-error" : undefined}
                      className={cn(inputBase, "mt-2", lineError?.material ? "border-danger-500" : "border-steel-300")}
                    />
                    {lineError?.material ? (
                      <p id={field(`material-${i}`) + "-error"} className="mt-2 text-[0.8125rem] text-danger-600">
                        {p(lineError.material)}
                      </p>
                    ) : null}
                    {grade ? (
                      <p className="mt-2 font-mono text-[0.75rem] text-steel-500">
                        {p("From the catalogue")} &middot;{" "}
                        {grade.composition.slice(0, 5).map((c) => `${c.element} ${formatAmount(c)}`).join("  ")}
                      </p>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={field(`form-${i}`)} className="block text-[0.9375rem] font-medium text-navy-900">
                      {p("Form")}
                    </label>
                    <select
                      id={field(`form-${i}`)}
                      value={line.form}
                      onChange={(e) => setLine(i, { form: e.target.value })}
                      className={cn(inputBase, "mt-2 border-steel-300")}
                    >
                      <option value="">{p("Select…")}</option>
                      {rfqForms.map((f) => (
                        <option key={f} value={f}>{p(f)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={field(`qty-${i}`)} className="block text-[0.9375rem] font-medium text-navy-900">
                      {p("Quantity")}
                    </label>
                    <input
                      id={field(`qty-${i}`)}
                      value={line.quantity}
                      onChange={(e) => setLine(i, { quantity: e.target.value })}
                      inputMode="decimal"
                      placeholder={p("e.g. 500")}
                      className={cn(inputBase, "mt-2 border-steel-300")}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={field(`unit-${i}`)} className="block text-[0.9375rem] font-medium text-navy-900">
                      {p("Unit")}
                    </label>
                    <select
                      id={field(`unit-${i}`)}
                      value={line.unit}
                      onChange={(e) => setLine(i, { unit: e.target.value })}
                      className={cn(inputBase, "mt-2 border-steel-300")}
                    >
                      {rfqUnits.map((u) => (
                        <option key={u} value={u}>{p(u)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor={field(`spec-${i}`)} className="block text-[0.9375rem] font-medium text-navy-900">
                      {buying ? p("Required chemistry or specification") : p("Available analysis")}{" "}
                      <span className="font-normal text-steel-500">({p("optional")})</span>
                    </label>
                    <input
                      id={field(`spec-${i}`)}
                      value={line.spec ?? ""}
                      onChange={(e) => setLine(i, { spec: e.target.value })}
                      placeholder={buying ? p("e.g. AMS 5662, or the limits that matter") : p("e.g. Ni 52, Cr 19, Nb 5 — or attach the analysis below")}
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
            {p("Add another material")}
          </ButtonEl>
        ) : (
          <p className="mt-4 text-[0.8125rem] text-steel-500">
            {p("That is the maximum of {n} lines. Put anything further in the notes below.", { n: MAX_LINES })}
          </p>
        )}
      </fieldset>

      {/* ---------- attachments ---------- */}
      <fieldset className="border-t border-steel-200 pt-8">
        <legend className="label text-steel-500">{p("Attachments")}</legend>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-600">
          {buying
            ? p("Specifications, drawings, standards and any inspection requirements.")
            : p("Laboratory analysis or COA, photographs of the material, packing lists, specifications, spreadsheets and inspection reports. An analysis and photographs are normally needed before an offer can be evaluated.")}
        </p>

        <div className="mt-4">
          <input
            ref={fileInput}
            id={field("files")}
            type="file"
            multiple
            accept={ATTACHMENT_ACCEPT}
            onChange={(e) => void addFiles(e.target.files)}
            className="sr-only"
          />
          <label
            htmlFor={field("files")}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded border border-steel-300 bg-white px-4 text-[0.9375rem] font-medium text-navy-900 transition-colors hover:border-brand-700 hover:text-brand-700 focus-within:ring-2 focus-within:ring-brand-700"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4">
              <path d="M8 2.5v9M4 7l4-4 4 4M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {p("Add files")}
          </label>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-steel-500">
            {p("{formats} · up to {n} files, {size} in total. Photographs are reduced in size before sending; larger packs can go by email.", {
              formats: ATTACHMENT_FORMATS,
              n: ATTACHMENT_LIMITS.maxFiles,
              size: formatBytes(ATTACHMENT_LIMITS.maxTotalBytes),
            })}
          </p>
        </div>

        {files.length > 0 ? (
          <ul className="mt-4 divide-y divide-steel-200 rounded-md border border-steel-200 bg-white">
            {files.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-[0.875rem]">
                <span className="min-w-0 truncate text-navy-900">{f.file.name}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-[0.75rem] text-steel-500 tabular-nums">
                    {formatBytes(f.file.size)}
                    {f.reducedFrom ? ` (${p("reduced from {size}", { size: formatBytes(f.reducedFrom) })})` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFiles((c) => c.filter((x) => x.id !== f.id))}
                    className="text-[0.8125rem] font-medium text-steel-600 transition-colors hover:text-danger-600"
                  >
                    {p("Remove")}
                  </button>
                </span>
              </li>
            ))}
            <li className="flex items-center justify-between px-4 py-2 text-[0.75rem] text-steel-500">
              <span>{p("{n} of {max} files", { n: files.length, max: ATTACHMENT_LIMITS.maxFiles })}</span>
              <span className="font-mono tabular-nums">{formatBytes(totalBytes)} / {formatBytes(ATTACHMENT_LIMITS.maxTotalBytes)}</span>
            </li>
          </ul>
        ) : null}

        {fileNotices.length > 0 ? (
          <ul className="mt-3 space-y-1 text-[0.8125rem] text-danger-600" role="alert">
            {fileNotices.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ) : null}
        {errors.attachments ? (
          <p className="mt-2 text-[0.8125rem] text-danger-600">{p(errors.attachments)}</p>
        ) : null}
      </fieldset>

      {/* ---------- requester ---------- */}
      <fieldset className="space-y-6 border-t border-steel-200 pt-8">
        <legend className="label text-steel-500">
          {p("Your details")}
        </legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id={field("name")} name="name" label={p("Name")} required error={errors.name} autoComplete="name" />
          <Field id={field("company")} name="company" label={p("Company")} required error={errors.company} autoComplete="organization" />
          <Field id={field("email")} name="email" label={p("Email")} type="email" required error={errors.email} autoComplete="email" />
          <Field id={field("phone")} name="phone" label={p("Phone")} type="tel" error={errors.phone} autoComplete="tel" hint={p("optional")} />
          <div className="sm:col-span-2 sm:max-w-md">
            <Field
              id={field("location")}
              name="location"
              label={buying ? p("Delivery location") : p("Material location")}
              error={errors.location}
              hint={p("optional")}
              placeholder={p("Country, or city and country")}
            />
          </div>
        </div>

        <div>
          <label htmlFor={field("message")} className="block text-[0.9375rem] font-medium text-navy-900">
            {p("Anything else")} <span className="font-normal text-steel-500">({p("optional")})</span>
          </label>
          <textarea
            id={field("message")}
            name="message"
            rows={4}
            placeholder={buying ? p("Packaging, delivery terms, certification requirements, recurring volumes") : p("Packaging, availability, how the lot was generated")}
            className={cn(
              "mt-2 w-full rounded border bg-white px-3.5 py-3 text-[0.9375rem] leading-relaxed text-navy-900 transition-colors placeholder:text-steel-500 hover:border-steel-400 focus:border-brand-700",
              errors.message ? "border-danger-500" : "border-steel-300",
            )}
          />
          {errors.message ? (
            <p className="mt-2 text-[0.8125rem] text-danger-600">{p(errors.message)}</p>
          ) : null}
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 border-t border-steel-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.8125rem] text-steel-500">
          <span className="text-danger-500">*</span> {p("Required. Your details and files are used only to assess and respond to this request.")}{" "}
          <Link href={routes.privacy} className="underline underline-offset-2 hover:text-brand-700">
            {p("Privacy policy")}
          </Link>
        </p>
        <ButtonEl type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? p("Sending…") : buying ? p("Request a quote") : selling ? p("Submit material") : p("Send")}
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
  placeholder,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  const p = useP();
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
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? id + "-error" : undefined}
        className={cn(inputBase, "mt-2", error ? "border-danger-500" : "border-steel-300")}
      />
      {error ? (
        <p id={id + "-error"} className="mt-2 text-[0.8125rem] text-danger-600">
          {p(error)}
        </p>
      ) : null}
    </div>
  );
}

/** Same fallback as the contact form: a failed send should cost a click, not the whole request. */
function composeMailto(payload: RfqPayload): string {
  return (
    "mailto:" + contact.email +
    "?subject=" + encodeURIComponent(rfqSubject(payload)) +
    "&body=" + encodeURIComponent(formatRfqText(payload))
  );
}
