// Numbers in prose that come from the model (docs/prose-numbers.md). A write-up or a model's text
// (summary, section and row explainers, a range's note) writes `{{result}}`, `{{row:cost_per_net}}` and
// so on where it states one of the model's own figures; the site renders it from the computed model at
// the default assumptions, formatted as the page formats it, so the prose can't go stale when the model
// changes. A placeholder renders with the values of the model whose file holds the text. Browser-safe:
// the pages render model text from here (src/lib/data.ts); write-ups go through src/lib/remark-prose.ts.
import { assumptionValues, comparable, compute, hasRange, headline, inputRange, pickValue, plausibleRange, type Library, type ResolvedModel, type View } from "./model";
import { formatValue, formatYears } from "../lib/format";

/** `{{…}}`: one placeholder. */
export const PLACEHOLDER = /\{\{([^{}]*)\}\}/g;

export type Placeholder =
  /** The headline in years of healthy life per $1,000: this model's, or another's (`model`). */
  | { kind: "result"; model?: string; view: View }
  /** A row's value. */
  | { kind: "row"; row: string; view: View }
  /** The ends of a row's range, or (no row) of the headline's plausible range. */
  | { kind: "low" | "high" | "range"; row?: string; view: View };

/** A placeholder's body (between the braces) as what it names, or why it names nothing. */
export function parsePlaceholder(body: string): Placeholder | string {
  const parts = body.trim().split(":").map((p) => p.trim());
  const view: View = parts.at(-1) === "evaluator" ? (parts.pop(), "evaluator") : "charityevals";
  const [kind, arg, ...rest] = parts;
  if (rest.length) return "too many parts";
  if (kind === "result") {
    if (arg !== undefined && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(arg)) return `"${arg}" isn't a model id`;
    return { kind, model: arg, view };
  }
  if (kind === "row" || kind === "low" || kind === "high" || kind === "range") {
    if (kind === "row" && arg === undefined) return "row needs a row id: {{row:<row_id>}}";
    if (arg !== undefined && !/^[a-z][a-z0-9_]*$/.test(arg)) return `"${arg}" isn't a row id`;
    if (arg === undefined && view === "evaluator") return "the plausible range is our view's only";
    return kind === "row" ? { kind, row: arg!, view } : { kind, row: arg, view };
  }
  return `unknown placeholder "${kind}" (result, row, low, high or range)`;
}

const defaults = new WeakMap<Library, Record<string, number>>();
const values = new WeakMap<ResolvedModel, Partial<Record<View, Record<string, number>>>>();
const av = (lib: Library) => {
  let a = defaults.get(lib);
  if (!a) defaults.set(lib, (a = assumptionValues(lib.assumptions)));
  return a;
};
function rowValues(lib: Library, m: ResolvedModel, view: View): Record<string, number> {
  let byView = values.get(m);
  if (!byView) values.set(m, (byView = {}));
  return (byView[view] ??= compute(lib, m, av(lib), {}, view));
}

/** The headline as the page shows it at the default assumptions. */
export function resultText(lib: Library, m: ResolvedModel, view: View = "charityevals"): string {
  return formatYears(headline(lib, m, av(lib), {}, view));
}

/** One placeholder's text. `html`: a write-up, where our view's headline is the span the page keeps in
 * step with the reader's values (src/components/Headline.tsx). Throws on a placeholder that names nothing. */
export function renderPlaceholder(lib: Library, m: ResolvedModel, p: Placeholder, html = false): string {
  if (p.kind === "result") {
    const t = p.model ? lib.models.get(p.model) : m;
    if (!t) throw new Error(`no model ${p.model}`);
    if (!t.output) throw new Error(`${t.id} has no result`);
    const text = resultText(lib, t, p.view);
    return html && p.view === "charityevals" && comparable(lib, t) ? `<span data-figure="headline" data-model="${t.id}">${text}</span>` : text;
  }
  if (p.row === undefined) {
    const r = plausibleRange(lib, m, headline(lib, m, av(lib)), av(lib));
    if (!r) throw new Error(`${m.id} has no plausible range`);
    return p.kind === "low" ? formatYears(r.low) : p.kind === "high" ? formatYears(r.high) : `${formatYears(r.low)} – ${formatYears(r.high)}`;
  }
  const r = m.byId.get(p.row);
  if (!r) throw new Error(`${m.id} has no row ${p.row}`);
  if (p.kind === "row") return formatValue(rowValues(lib, m, p.view)[r.id], r.format);
  // A calculated row's published range; an input's low and high (the evaluator's where it differs).
  const given = r.node && !(p.view === "evaluator" && r.published !== undefined) ? r.range : inputRange(r, p.view);
  const ends = given && typeof given === "object" && ("best" in given ? hasRange(given) : true) ? [pickValue({ best: NaN, ...given }, "low"), pickValue({ best: NaN, ...given }, "high")] : undefined;
  if (!ends) throw new Error(`row ${r.id} has no range`);
  const low = formatValue(ends[0], r.format), high = formatValue(ends[1], r.format);
  return p.kind === "low" ? low : p.kind === "high" ? high : `${low} – ${high}`;
}

/** A text with its placeholders rendered. Throws, naming the placeholder, on one that names nothing. */
export function renderText(lib: Library, m: ResolvedModel, text: string, html = false): string {
  if (!text.includes("{{")) return text;
  return text.replace(PLACEHOLDER, (all, body: string) => {
    const p = parsePlaceholder(body);
    if (typeof p === "string") throw new Error(`${all}: ${p}`);
    try {
      return renderPlaceholder(lib, m, p, html);
    } catch (e) {
      throw new Error(`${all}: ${(e as Error).message}`);
    }
  });
}

/** Every placeholder in a text that names nothing, with why. */
export function placeholderErrors(lib: Library, m: ResolvedModel | undefined, text: string): string[] {
  const out: string[] = [];
  for (const [all, body] of text.matchAll(PLACEHOLDER)) {
    const p = parsePlaceholder(body);
    if (typeof p === "string") out.push(`${all}: ${p}`);
    else if (!m) out.push(`${all}: no model to read it from`);
    else try { renderPlaceholder(lib, m, p); } catch (e) { out.push(`${all}: ${(e as Error).message}`); }
  }
  return out;
}

/** A model's text fields, by a key naming each (the keys checks and reports use). */
export type TextField = { key: string; get: () => string | undefined; set: (s: string) => void };
type RawRow = { id: string; explainer?: string; range?: { note?: string } };
type RawText = { summary?: string; sections?: { id: string; explainer?: string }[]; rows?: RawRow[] };

/** The text fields of a model (resolved or as written): summary, section explainers, row explainers and range notes. */
export function textFields(m: RawText): TextField[] {
  const out: TextField[] = [{ key: "summary", get: () => m.summary, set: (s) => (m.summary = s) }];
  for (const s of m.sections ?? []) out.push({ key: `section ${s.id}`, get: () => s.explainer, set: (x) => (s.explainer = x) });
  for (const r of m.rows ?? []) {
    out.push({ key: `${r.id}.explainer`, get: () => r.explainer, set: (x) => (r.explainer = x) });
    if (r.range) out.push({ key: `${r.id}.range.note`, get: () => r.range!.note, set: (x) => (r.range!.note = x) });
  }
  return out;
}

/** Renders the placeholders in every model's text, in place. Text a model inherits renders with its
 * parent's values: a variant's page reads the parent's sentence as the parent wrote it. Returns the
 * placeholders that name nothing (the build fails on them). */
export function renderLibraryProse(lib: Library): string[] {
  const errors: string[] = [];
  // Per model, each field's text as written and as rendered.
  const done = new Map<string, Map<string, { written: string; rendered: string }>>();
  const visit = (m: ResolvedModel) => {
    if (done.has(m.id)) return;
    const mine = new Map<string, { written: string; rendered: string }>();
    done.set(m.id, mine);
    const parent = m.extends ? lib.models.get(m.extends) : undefined;
    if (parent) visit(parent);
    for (const f of textFields(m)) {
      const written = f.get();
      if (!written?.includes("{{")) continue;
      const theirs = parent && done.get(parent.id)?.get(f.key);
      let rendered: string;
      if (theirs?.written === written) rendered = theirs.rendered;
      else try { rendered = renderText(lib, m, written); } catch (e) { errors.push(`${m.id} ${f.key}: ${(e as Error).message}`); continue; }
      mine.set(f.key, { written, rendered });
      f.set(rendered);
    }
  };
  for (const m of lib.models.values()) visit(m);
  return errors;
}

/** A model file with its own text rendered (a bulk model's full file, which the browser rebuilds). */
export function renderRaw<T>(lib: Library, raw: T): T {
  const m = lib.models.get((raw as { id: string }).id);
  const copy = structuredClone(raw) as T & RawText;
  if (!m) return copy;
  for (const f of textFields(copy)) {
    const s = f.get();
    if (s?.includes("{{")) f.set(renderText(lib, m, s));
  }
  return copy;
}
