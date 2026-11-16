// The checks scripts/preflight.ts adds to the existing ones (check.ts, lint, invariants, simulation-check)
// before a model goes to audit: units, how judgments are filed, and above all shared figures typed in by
// hand (docs/normalization.md 2.7-2.10). Each returns problems; `high` blocks the audit.
import { evaluate } from "./expr";
import { ALLOWED_LITERALS, comparisons, namesFor } from "./lint";
import { CONCEPTS, PREFLIGHT_CONCEPTS, likeness, measuredInOwnPopulation, words, type Waivers } from "./invariants";
import { assumptionValues, bottomLine, pickValue, type FactRow, type Library, type ResolvedModel, type ResolvedRow } from "./model";
import { rowsFeeding, sensitivity } from "./sensitivity";
import { unitIssues } from "./units";
import type { SimulationCheck } from "./simulation-check";

export type Severity = "high" | "medium" | "low";
export type Problem = { severity: Severity; check: string; where: string; message: string };

const fmt = (x: number) => (Number.isFinite(x) ? String(+x.toPrecision(6)) : String(x));
const textOf = (r: { id: string; label?: string }) => `${r.id.replace(/_/g, " ")} ${r.label ?? ""}`;

/** Rows this model wrote itself (a variant's inherited rows are its parent's). */
const ownRows = (m: ResolvedModel) => m.rows.filter((r) => !r.inheritedFrom || r.overridden?.length);

/** A number typed in: an input, or a formula of literals only ("0.07", "110000 * 0.6"). */
export function typedValue(r: ResolvedRow): number | undefined {
  if (r.formula === undefined) return r.value === undefined ? undefined : pickValue(r.value);
  if (r.deps.length || r.factDeps.length || r.assumptionDeps.length || r.modelDeps.length) return undefined;
  const n = r.node ? evaluate(r.node, () => NaN) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

/** Whether changing a row can move the model's result (a switched-off branch's placeholder can't). */
function moves(lib: Library, m: ResolvedModel, row: string, v: number, av: Record<string, number>): boolean {
  const base = bottomLine(lib, m, av).native;
  const moved = bottomLine(lib, m, av, { [row]: v === 0 ? 1 : v * 2 }).native;
  return !(Number.isFinite(base) && Number.isFinite(moved) && Math.abs(moved - base) <= 1e-12 * Math.max(1, Math.abs(base)));
}

// --- Units -----------------------------------------------------------------------------------------

/** Units (src/engine/units.ts) and percent-format inputs typed as percents. `exempt`: a family skeleton's
 * fixed rows, copied as they stand (their units are the skeleton's to fix). */
export function unitProblems(lib: Library, m: ResolvedModel, exempt: (r: ResolvedRow) => boolean = () => false): Problem[] {
  const out: Problem[] = [];
  for (const i of unitIssues(lib, m, exempt)) {
    const fix = i.kind === "money" ? "divide by the cost (per $) or multiply by it (a total), or correct the unit"
      : i.kind === "scale" ? "multiply or divide by the factor, or correct the unit"
      : i.kind === "time" ? "multiply by the years (a total) or divide by them (per year), or correct the unit"
      : "make the terms the same kind of quantity, or correct a unit";
    // Money and scale errors move the result by orders of magnitude; time units are often written loosely.
    out.push({ severity: i.kind === "money" || i.kind === "scale" ? "high" : "medium", check: "units", where: i.row, message: `${i.message}: ${fix}` });
  }
  for (const r of m.rows) {
    if (r.format !== "percent" || r.formula !== undefined || r.value === undefined) continue;
    const best = pickValue(r.value);
    if (Math.abs(best) > 1.5 && !/\b(multiple|times|ratio|×)\b/i.test(r.label))
      out.push({ severity: Math.abs(best) >= 5 ? "high" : "medium", check: "units", where: r.id, message: `a percent-format input of ${fmt(best)} reads as ${fmt(best * 100)}%: a percent row holds a fraction (0.45 for 45%); divide the value by 100 or, for a multiple, use format "multiple"` });
  }
  return out;
}

// --- Kinds and reference classes -------------------------------------------------------------------

/** Words that name what a judgment is anchored on (templates.md Convention 10): a reference class, other
 * evidence, a source, a comparison or a number from somewhere. */
export const ANCHOR = /\breference class\b|\banchor|\bbased on\b|\bbase rate|\bbenchmark|\bcross-?check|\bprecedent|\btrack record|\bhistor(y|ical)|\btypical|\bsimilar\b|\bcompar|\blike (other|the|its|a)\b|\bas in\b|\bas for\b|\bstud(y|ies)\b|\btrials?\b|\bmeta-?analys|\bliterature|\bresearch\b|\bevaluat|\bsurvey|\breport(s|ed)?\b|\bdata\b|\bestimate|\bevidence|\bsource|\bpublished|\baccording to|\bfinds?\b|\bfound\b|\bshows?\b|\bout of\b|#[a-z0-9]|@[a-z_]+\.|\d/i;
/** Words that mark a figure as someone's judgment, not a reading of data. */
const JUDGED = /\b(we|our)\s+(judge|judgment|guess|assume|assumption)|\bjudg(e)?ment call\b|\bguess(ed)?\b|\bplaceholder\b/i;

/** No `kind: "template"` copied in, no skeleton placeholder left in a source, every judgment anchored (its
 * reference class named where it drives the result), and data not filed as a judgment nor a judgment as data. */
export function kindProblems(lib: Library, m: ResolvedModel): Problem[] {
  const out: Problem[] = [];
  if (m.kind === "template" && (m.charity || m.owner === "charityevals"))
    out.push({ severity: "high", check: "kind", where: "kind", message: `kind "template" on a charity's model (copied from a skeleton): set "kind": "charity"` });
  const path = rowsFeeding(m);
  for (const r of ownRows(m)) {
    const s = r.source ?? {};
    const placeholder = [s.title, s.url, s.page, s.quote, s.note].some((x) => x && /\bTEMPLATE\b|\bREPLACE\b|example\.org/.test(x));
    if (placeholder) out.push({ severity: "high", check: "kind", where: r.id, message: "the skeleton's placeholder source (TEMPLATE / REPLACE / example.org) is still in the row: cite the real document, page and quote" });
  }
  if (m.owner !== "charityevals" || !m.output) return out;
  // The inputs that drive the result: the five widest swings, if they move it by half or more.
  const s = sensitivity(lib, m, assumptionValues(lib.assumptions));
  const drivers = new Set(s.swings.filter((w) => w.scope === "row" && Number.isFinite(w.logSwing) && w.logSwing >= Math.log(1.5)).slice(0, 5).map((w) => w.id));
  for (const r of ownRows(m)) {
    if (!path.has(r.id) || r.formula !== undefined || r.value === undefined || r.format === "toggle" || r.id === "donation") continue;
    const ex = r.explainer ?? "";
    if (r.kind === "judgment") {
      if (!ANCHOR.test(ex))
        out.push({ severity: drivers.has(r.id) ? "high" : "medium", check: "reference-class", where: r.id, message: `judgment${drivers.has(r.id) ? " that drives the result" : ""} with no anchor in its explainer: name its reference class (other programmes, studies or models of the same thing) and why this charity sits where it does in it (templates.md Convention 10)` });
      // A quote that holds the very number: data, not a judgment.
      const v = pickValue(r.value);
      if (s.swings && r.source?.url && r.source.quote && quoted(r.source.quote, v))
        out.push({ severity: "medium", check: "kind", where: r.id, message: `filed as a judgment, but its source's quote states ${fmt(v)}: kind "observed" (read from data) or "estimate" (someone's calculation)` });
    } else if ((r.kind === "observed" || r.kind === "estimate") && JUDGED.test(ex) && !r.source?.url)
      out.push({ severity: "medium", check: "kind", where: r.id, message: `filed as ${r.kind}, but its explainer calls it a judgment and it has no source: kind "judgment" with a range and its anchor` });
  }
  return out;
}

/** Whether a quote states a number (as written, as a percent, or in thousands or millions). */
function quoted(quote: string, v: number): boolean {
  if (!Number.isFinite(v) || ALLOWED_LITERALS.has(v)) return false;
  const nums = [...quote.replace(/(\d),(\d{3})/g, "$1$2").matchAll(/\d+(?:\.\d+)?/g)].map((x) => Number(x[0]));
  return nums.some((n) => [n, n / 100, n * 1e3, n * 1e6, n * 1e9].some((x) => Math.abs(x - v) <= 1e-9 * Math.max(1, Math.abs(v))));
}

// --- Shared figures typed by hand ------------------------------------------------------------------

/** Facts files about one place: a row copying one must be about that place. */
const PLACE_FILES = new Set(["kenya", "malawi", "uganda", "india", "chad", "mozambique", "rwanda", "burkina_faso", "nigeria", "drc", "bangladesh", "brazil", "ethiopia", "haiti", "jamaica", "lebanon", "moldova", "myanmar", "palestine", "south_sudan", "sudan", "ukraine", "united_kingdom", "united_states", "yemen"]);
/** Facts files of house constants grouped by identical labels: a copy has the same label. */
const SAME_LABEL_FILES = new Set(["givewell_common", "staff_pay"]);
/** Facts files that aren't figures to retype: currency rates, prices and countries are read by formula only. */
const LOOKUP_FILES = new Set(["fx", "cpi", "countries", "meta"]);

const placeOf = (file: string) => (file.startsWith("givewell_") ? file.slice(9) : file).replace(/_/g, " ");

/** `qualifier`: the setting a label names before its colon ("COVID-scale pandemic: …"), as word stems. */
type IndexedFact = { f: FactRow; file: string; scope: { charity?: string; place?: string }; values: number[]; best: number; text: string; words: number; qualifier: string[] };

/** Significant words cut to four letters, so "crises" and "crisis" meet. */
const stems = (s: string) => [...words(s)].map((w) => w.slice(0, 4));

/** Significant digits of a number as written (0.0025 → 2, 0.6638 → 4). */
function sigDigits(x: number): number {
  const s = Math.abs(x).toExponential().split("e")[0].replace(".", "").replace(/0+$/, "");
  return Math.max(1, s.length);
}

/** The facts a row could copy, indexed once per library: values, whose they are, their words. */
const indexes = new WeakMap<Library, { facts: IndexedFact[]; byRowId: Map<string, IndexedFact[]> }>();
function factIndex(lib: Library) {
  const hit = indexes.get(lib);
  if (hit) return hit;
  const scopes = new Map<string, { charity?: string; place?: string }>();
  // Which charities' models read each facts file.
  const readers = new Map<string, Set<string>>();
  for (const m of lib.models.values())
    for (const r of m.rows) for (const k of r.factDeps) {
      const file = k.split(".")[0];
      readers.set(file, (readers.get(file) ?? new Set()).add(m.charity));
    }
  const facts: IndexedFact[] = [];
  const byRowId = new Map<string, IndexedFact[]>();
  for (const f of lib.facts.values()) {
    const [file, id] = f.key.split(".");
    if (LOOKUP_FILES.has(file) || file === "next_dollar") continue;
    if (!scopes.has(file)) scopes.set(file, factScope(lib, file, readers));
    const fv = f.value;
    const values = typeof fv === "number" ? [fv] : fv ? [fv.best, fv.low, fv.high].filter((x): x is number => typeof x === "number") : [];
    // A parenthesis is a note on the figure ("(judgment, shared by the relief models)"), not what it is.
    const text = `${id} ${f.label.replace(/\([^)]*\)/g, " ")}`;
    const head = f.label.includes(":") ? f.label.slice(0, f.label.indexOf(":")) : "";
    const qualifier = head && head.split(/\s+/).length <= 6 ? stems(head) : [];
    const x: IndexedFact = { f, file, scope: scopes.get(file)!, values, best: pickValue(fv), text, words: words(text).size, qualifier };
    facts.push(x);
    byRowId.set(id, [...(byRowId.get(id) ?? []), x]);
  }
  const out = { facts, byRowId };
  indexes.set(lib, out);
  return out;
}

/** Whose a facts file is: a charity's own (the_bail_project, msf), a place's, or everyone's. */
function factScope(lib: Library, file: string, readers: Map<string, Set<string>>): { charity?: string; place?: string } {
  // A charity's own file: named after it (the_bail_project), or read by one charity's models only (kind, msf).
  const named = [...lib.charities.keys()].find((c) => c.replace(/-/g, "_") === file);
  const by = readers.get(file);
  const charity = named ?? (by?.size === 1 ? [...by][0] : undefined);
  if (charity) return { charity };
  if (PLACE_FILES.has(file) || /^givewell_/.test(file) && file !== "givewell_common" && file !== "givewell_shared") return { place: placeOf(file) };
  return {};
}

/** The key of a charity's next-dollar figure in facts/next_dollar.json, if it has one. */
export function nextDollarKey(lib: Library, charity: string): string | undefined {
  const direct = `next_dollar.${charity.replace(/-/g, "_")}`;
  if (lib.facts.has(direct)) return direct;
  const name = lib.charities.get(charity)?.name;
  if (!name) return undefined;
  return [...lib.facts.values()].find((f) => f.key.startsWith("next_dollar.") && f.label.toLowerCase().startsWith(`${name.toLowerCase()}:`))?.key;
}

const MARGINAL_TEXT = /\bnext dollar\b|\bpast average\b|\baverage dollar so far\b/i;

/** Waived pairs: INV-4's and the preflight's own `shared-fact` section's `row = @ref`, and INV-13's
 * `concept row`, for this model. */
function waived(waivers: Waivers, model: string) {
  const pairs = new Set<string>(), concepts = new Set<string>();
  for (const k of [...Object.keys(waivers["INV-4"] ?? {}), ...Object.keys(waivers[PREFLIGHT_WAIVERS.fact] ?? {})]) {
    const [mm, rest] = [k.slice(0, k.indexOf(" ")), k.slice(k.indexOf(" ") + 1)];
    if (mm === model) pairs.add(rest.replace(/\s+/g, " "));
  }
  for (const k of Object.keys(waivers["INV-13"] ?? {})) {
    const parts = k.split(" ");
    if (parts[0] === model) concepts.add(`${parts[1]} ${parts[2]}`);
  }
  return { pairs, concepts };
}

/** Every typed number on the model's path that a shared fact already holds: the concept's fact (INV-13's
 * table and its additions), a fact with the row's own id, or a fact of the same value (within 1%) whose
 * words the row's share; typed next-dollar figures; and a figure typed into another of our models too
 * (the second copy, where INV-14 waits for the fifth). The message names the `@file.key` to read. */
export function sharedFactProblems(lib: Library, m: ResolvedModel, waivers: Waivers = {}): Problem[] {
  const out: Problem[] = [];
  if (!m.output) return out;
  const av = assumptionValues(lib.assumptions);
  const path = rowsFeeding(m);
  const { pairs, concepts } = waived(waivers, m.id);
  const { facts, byRowId: factByRowId } = factIndex(lib);
  const modelText = `${m.id} ${m.name ?? ""}`.toLowerCase().replace(/[-_]/g, " ");
  const fits = (f: IndexedFact, text: string) => {
    const { charity, place } = f.scope;
    if (charity && charity !== m.charity) return false;
    if (place && !`${text} ${modelText}`.toLowerCase().includes(place)) return false;
    return true;
  };
  const allConcepts = [...CONCEPTS, ...PREFLIGHT_CONCEPTS];
  const ndKey = nextDollarKey(lib, m.charity);
  for (const r of ownRows(m)) {
    if (!path.has(r.id) || r.format === "toggle" || r.id === "donation") continue;
    const text = textOf(r);
    // Next dollar: a past average reads the charity's own figure.
    const typedNd = typedValue(r);
    const readsNd = r.factDeps.some((x) => x.startsWith("next_dollar."));
    if ((r.id === "marginal_vs_past_average" || MARGINAL_TEXT.test(r.label)) && typedNd !== undefined) {
      out.push({ severity: "high", check: "shared-fact", where: r.id, message: ndKey ? `next-dollar figure typed as ${fmt(typedNd)}: read @${ndKey} (facts/next_dollar.json, normalization.md 2.10)` : `next-dollar figure typed as ${fmt(typedNd)}: add the charity to facts/next_dollar.json (room × use × run, sourced; normalization.md 2.10) and read @next_dollar.<charity>; $marginal_vs_past_average until then` });
      continue;
    }
    if (ndKey && !readsNd && r.assumptionDeps.includes("marginal_vs_past_average"))
      out.push({ severity: "high", check: "shared-fact", where: r.id, message: `reads the next-dollar slider $marginal_vs_past_average, but the charity has its own figure: read @${ndKey} (normalization.md 2.10)` });
    const v = typedValue(r);
    // 0: the branch or effect doesn't apply here (said in the explainer), not a copy of anything.
    if (v === undefined || !Number.isFinite(v) || v === 0) continue;
    // The programme's own people, measured and sourced (the recipients' household size): its own figure.
    if (measuredInOwnPopulation(r)) continue;
    const hits = new Map<string, string>();
    // 1. The concept table (INV-13's and the preflight's additions): the concept's fact, whatever the value.
    for (const c of allConcepts) {
      if (!c.test.test(r.label) || c.not?.test(text) || concepts.has(`${c.id} ${r.id}`)) continue;
      const keys = [...lib.facts.keys()].filter((k) => c.facts.some((x) => x === k || (x.endsWith(".*") && k.startsWith(x.slice(0, -1)))));
      const ctx = c.context?.(`${text} ${m.name} ${m.id}`);
      const pick = keys.filter((k) => !ctx || lib.facts.get(k)!.label.toLowerCase().includes(ctx.toLowerCase()) || k.includes(ctx.toLowerCase().replace(/ /g, "_")));
      const ref = (pick.length ? pick : keys).slice(0, 3).map((k) => `@${k}`).join(" or ");
      if (ref) hits.set(ref, `states ${c.id}, which the site answers once`);
    }
    // 2. A fact with the row's own id: the same figure under the same name.
    // A branch's prefix (ai_, bio_) only where the model has the branch: three rows or more start with it.
    const prefix = /^([a-z]{1,6})_/.exec(r.id)?.[1];
    const branch = prefix && m.rows.filter((x) => x.id.startsWith(`${prefix}_`)).length >= 3 ? r.id.slice(prefix.length + 1) : undefined;
    // Our own builds only: an evaluator's sheet keeps its own figures (INV-4 and INV-13 check those).
    // The labels must also say the same thing: a family's generic row (years_exposed) can share a charity fact's id.
    const own = m.owner === "charityevals";
    const idHits = !own ? [] : [r.id, branch].flatMap((id) => (id && id.includes("_") && id.length >= 10 ? factByRowId.get(id) ?? [] : []))
      .filter((f) => fits(f, text) && likeness(r.label, f.f.label).ofSmaller >= 0.5 && likeness(r.label, f.f.label).shared >= 2);
    for (const x of idHits) if (!pairs.has(`${r.id} = @${x.f.key}`)) hits.set(`@${x.f.key}`, `has the id of @${x.f.key} (${fmt(x.best)}, "${x.f.label}")`);
    // 3. The same value (within 1%) as a fact whose words the row shares.
    // Our adjustments (`*_adj`) are each build's judgment of its charity: an equal round value elsewhere is
    // the same judgment reached, not a copy (as INV-14).
    // Nor are small whole numbers or calendar years (2023 is within 1% of 2024).
    const calendar = Number.isInteger(v) && v >= 1900 && v <= 2100;
    if (own && !r.id.endsWith("_adj") && !calendar && !ALLOWED_LITERALS.has(v) && (!Number.isInteger(v) || Math.abs(v) > 12)) {
      const context = stems(`${text} ${r.explainer ?? ""} ${modelText} ${m.template ?? ""}`);
      for (const x of facts) {
        const hit = x.values.find((y) => y !== 0 && Math.abs(y - v) <= 0.01 * Math.abs(y));
        if (hit === undefined) continue;
        const f = x.f;
        if (hits.has(`@${f.key}`) || pairs.has(`${r.id} = @${f.key}`) || !fits(x, text)) continue;
        if (SAME_LABEL_FILES.has(x.file) && likeness(r.label, f.label).ofLarger < 0.75) continue;
        const like = likeness(text, x.text);
        // Two significant words in common, half the smaller label's; unless the value is distinctive (three
        // significant digits or more), half the larger one's too, and a range end or a near value 60%.
        const exact = hit === x.best && Math.abs(hit - v) <= 1e-9 * Math.abs(hit);
        if (like.shared < 2 || like.ofSmaller < 0.5 || x.words < 2) continue;
        if (sigDigits(v) < 3 && (!exact || like.ofLarger < 0.5)) continue;
        if (!exact && like.ofLarger < 0.4) continue;
        // A fact for one setting ("COVID-scale pandemic: …", "Crises: …") only where the row or model is about it.
        if (!x.qualifier.every((q) => context.includes(q))) continue;
        hits.set(`@${f.key}`, `= ${fmt(v)}, ${exact ? "the value of" : `within 1% of ${hit === x.best ? "the value" : "a range end"} of`} @${f.key} (${fmt(hit)}, "${f.label}")`);
      }
    }
    if (!hits.size || !moves(lib, m, r.id, v, av)) continue;
    for (const [ref, why] of hits)
      out.push({ severity: "high", check: "shared-fact", where: r.id, message: `"${r.label}" ${why}: read ${ref} instead of typing ${fmt(v)} (the evaluator's or source's own figure, if it differs, in \`published\`; a different place or programme is a waiver with its reason: src/engine/normalization-waivers.json, "shared-fact": { "${m.id} ${r.id} = ${ref}": "<why>" })` });
  }
  return out;
}

/** Waiver sections (src/engine/normalization-waivers.json) for checks of the preflight's own:
 * `simulation`, keyed by model id: a wide spread that is honest (shared facts' ranges), with the reason;
 * `shared-fact-pair`, keyed by "<model> <row> = <model> <row>" (either order): two typed figures that are
 * different quantities, with the reason;
 * `shared-fact`, keyed by "<model> <row> = @<fact>": a typed figure that only happens to equal a fact
 * INV-4 doesn't flag, with the reason. */
export const PREFLIGHT_WAIVERS = { simulation: "simulation", pair: "shared-fact-pair", fact: "shared-fact" } as const;

/** A pair's waiver key, the two sides in order so either way round is the same entry. */
export const pairKey = (a: string, ar: string, b: string, br: string) => [`${a} ${ar}`, `${b} ${br}`].sort().join(" = ");

/** The same label and value typed into another of our models (the second copy; INV-14 fires at the fifth):
 * one figure, so a shared fact that both read. Our own adjustments (`*_adj`) are each build's judgment.
 * A pair waived as different quantities (`shared-fact-pair`) is left out; `used` collects those keys. */
export function copiedFigureProblems(lib: Library, m: ResolvedModel, templateRows: ReadonlySet<string> = new Set(), waivers: Waivers = {}, used?: Set<string>): Problem[] {
  const out: Problem[] = [];
  if (m.owner !== "charityevals" || !m.output) return out;
  const av = assumptionValues(lib.assumptions);
  const key = (label: string) => [...words(label)].sort().join(" ");
  const mine = new Map<string, ResolvedRow>();
  const path = rowsFeeding(m);
  for (const r of ownRows(m)) {
    const v = typedValue(r);
    // A skeleton's input (attribution_share, a branch's bio_years_until_effect) is each build's own judgment.
    const skeleton = templateRows.has(r.id) || templateRows.has(r.id.replace(/^[a-z]{1,8}_/, ""));
    if (v === undefined || skeleton || !path.has(r.id) || r.id.endsWith("_adj") || ALLOWED_LITERALS.has(v) || r.format === "toggle" || r.id === "donation" || words(r.label).size < 3) continue;
    if ([...r.label.matchAll(/(?<![\w.])(\d+(?:\.\d+)?)(?![\w.])/g)].some((x) => Number(x[1]) === v)) continue;
    // A calendar year (a counting period's first or last year) is a date, not a figure to share.
    if (/^year$/i.test(r.unit ?? "") || (Number.isInteger(v) && v >= 1990 && v <= 2100 && /\b(year|period|first|last|start|end|since|until|from)\b|_(year|period|first|last|start|end)\b/i.test(textOf(r)))) continue;
    mine.set(`${key(r.label)} = ${fmt(v)}`, r);
  }
  if (!mine.size) return out;
  const seen = new Set<string>();
  for (const o of lib.models.values()) {
    if (o.id === m.id || o.owner !== "charityevals" || !o.output || o.kind === "variant" || o.charity === m.charity) continue;
    const opath = rowsFeeding(o);
    for (const r of ownRows(o)) {
      const v = typedValue(r);
      if (v === undefined || !opath.has(r.id)) continue;
      const k = `${key(r.label)} = ${fmt(v)}`;
      const here = mine.get(k);
      if (!here || seen.has(here.id)) continue;
      const pk = pairKey(m.id, here.id, o.id, r.id);
      if (pk in (waivers[PREFLIGHT_WAIVERS.pair] ?? {})) { used?.add(pk); continue; }
      if (!moves(lib, m, here.id, v, av)) continue;
      seen.add(here.id);
      out.push({ severity: "medium", check: "shared-fact", where: here.id, message: `"${here.label}" = ${fmt(v)} is typed into ${o.id} too (${r.id}): one figure belongs in a shared fact (facts/*.json, with its source and range) that both read; if they are different quantities, a waiver in src/engine/normalization-waivers.json, "${PREFLIGHT_WAIVERS.pair}": { "${pk}": "<why they differ>" }` });
    }
  }
  return out;
}

// --- Simulation ----------------------------------------------------------------------------------

/** What scripts/simulation-check.ts found, as problems. An unstable result is high where the model's own
 * rows flip it, medium where only shared facts and assumptions do (their ranges are the site's, an
 * honest spread); a `simulation` waiver with its reason clears it, and the single inputs show as low. */
export function simulationProblems(id: string, sim: SimulationCheck, waivers: Waivers = {}): Problem[] {
  const out: Problem[] = [];
  const waiver = waivers[PREFLIGHT_WAIVERS.simulation]?.[id];
  const shared = sim.wild.length > 0 && sim.wild.every((w) => w.key.startsWith("@") || w.key.startsWith("$"));
  if (sim.unstable && !waiver)
    out.push({ severity: shared ? "medium" : "high", check: "simulation", where: "result", message: `the simulation is unstable (5% ${sim.shape?.q5.toPrecision(3)}, 95% ${sim.shape?.q95.toPrecision(3)} × the best guess): see the inputs that flip it, and normalization.md 2.18${shared ? `; only shared facts flip it: if the spread is honest, a waiver in src/engine/normalization-waivers.json, "${PREFLIGHT_WAIVERS.simulation}": { "${id}": "<why>" }` : ""}` });
  if (waiver && !sim.unstable)
    out.push({ severity: "low", check: "waiver", where: PREFLIGHT_WAIVERS.simulation, message: `the simulation is stable now: remove the "${id}" waiver from src/engine/normalization-waivers.json` });
  if (sim.brokenEvents) out.push({ severity: "high", check: "simulation", where: "single_event", message: "a single event never happens or always does, or the draws are broken: check the single_event tags" });
  for (const w of sim.wild.slice(0, 5)) out.push({ severity: sim.unstable && !waiver ? "medium" : "low", check: "simulation", where: w.key, message: `alone at ${w.low.toPrecision(3)}..${w.high.toPrecision(3)} it moves the result ×${w.atLow.toPrecision(3)} / ×${w.atHigh.toPrecision(3)}: a calendar year drawn, a remainder of large figures or a net near zero?` });
  return out;
}

// --- Other charities in the text -----------------------------------------------------------------

/** Names prose uses for a charity that its name doesn't give (initials, a short form). */
const NICKNAMES: Record<string, string[]> = {
  "american-red-cross": ["Red Cross"],
  "habitat-for-humanity": ["Habitat"],
  "center-for-ai-safety": ["CAIS"],
  "johns-hopkins-center-for-health-security": ["CHS"],
  "unlimit-health": ["SCI"],
  "rethink-priorities": ["Rethink"],
};
/** Initials that mean something else in the models' text (a cost-effectiveness analysis, a Medical Research
 * Council, the DR Congo, the World Health Organization as a source). */
const NOT_INITIALS = new Set(["CEA", "MRC", "BCJ", "CRU", "FAF", "DRC", "WHO"]);

/** A charity's names in prose: its name without "The" and parentheses, its short name and former name
 * ("(IRAP)", "(formerly SCI Foundation)"), the initials of a name of three capitalised words or more (with
 * "The": THL), the name without a trailing International / Intl / Education Fund, and NICKNAMES. */
export function charityAliases(c: { id: string; name?: string }): string[] {
  if (!c.name) return [];
  const out = new Set<string>(NICKNAMES[c.id] ?? []);
  const base = c.name.replace(/\s*\([^)]*\)/g, "").replace(/^The\s+/, "").trim();
  out.add(base);
  for (const [, inner] of c.name.matchAll(/\(([^)]+)\)/g)) out.add(inner.replace(/^formerly\s+/i, "").trim());
  const caps = base.split(/\s+/).filter((w) => /^\p{Lu}/u.test(w));
  if (caps.length >= 3) out.add(caps.map((w) => w[0]).join(""));
  if (/^The\s/.test(c.name) && caps.length >= 2) out.add(`T${caps.map((w) => w[0]).join("")}`);
  // A trailing qualifier dropped ("Brennan Center", "Habitat for Humanity", "Ploughshares"), leaving two
  // words or one long one.
  const short = base.replace(/\s+(?:International|Intl|Education Fund|for Justice|of America|Fund|Foundation)$/, "");
  if (short !== base && (short.split(/\s+/).length >= 2 || short.length >= 8)) out.add(short);
  return [...out].filter((n) => n.length >= 3 && !NOT_INITIALS.has(n));
}

/** Words for a model or its result after a charity's name ("the FairVote model", "our AMF relief build"). */
const MODEL_WORD = /^(?:models?|builds?|results?|headlines?|CEAs?|write-?ups?|rankings?|figures?|estimates?)$/;
/** Of these, the ones that are a source's own figure when the evaluator or the charity published it. */
const FIGURE_WORD = /^(?:figures?|estimates?|results?)$/;
/** "model" as an adjective ("the WHO model list", "a model law"). */
const MODEL_ADJ = /^\s+(?:life\s+tables?|list|laws?|legislation|bills?|ordinances?|villages?|farms?|schools?|clinics?|of\s+care|policy)\b/i;
/** Words between a name and its model word that end the phrase: verbs and function words ("AMF uses
 * nets whose results"), so only qualifiers ("relief", "US", "other", "and NRC") stand between. */
const BREAK_WORD = /^(?:is|are|was|were|be|been|has|have|had|does|do|did|uses?|used|reads?|gives?|puts?|takes?|finds?|found|says?|said|reports?|reported|which|that|whose|where|when|while|it|its|their|this|these|those|a|an|in|on|at|to|of|for|by|with|from|per|than|as|not|no|but|if|so|because|after|before|into|about|over|under|between)$/i;
/** Comparison words just before a name. Strong ones ("as in", "than", "unlike") compare by themselves;
 * weak ones ("like", "following") only with a model word or a possessive after the name. */
const COMPARE_STRONG = /(?:\bas\s+(?:in|for|with|does|did)|\bunlike|\bthan|\b(?:the\s+)?same\s+as|\bsimilar\s+to|\bin\s+line\s+with|\bon\s+a\s+par\s+with|\blevel\s+with|\bmirror(?:s|ed|ing)?|\bcompared?\s+(?:with|to)|\bversus|\bvs\.?|\bbelow|\babove|\bnear|\bclose\s+to)\s+$/i;
const COMPARE_WEAK = /(?:\blike|\bfollow(?:s|ed|ing)?|\bmatch(?:es|ed|ing)?|\bcopie[sd]\s+(?:from\s+)?|\bborrow(?:s|ed)?\s+(?:from\s+)?)\s+$/i;
/** Multiples and splits ("three times Clean Air Task Force's budget", "between NTI and …"): a comparison, except of a source's figures. */
const COMPARE_TIMES = /(?:\btimes|×|\btwice|\bthrice|\bhalf|\bbetween)\s+$/i;
/** A source just before a name: where a figure is from ("from GiveWell's AMF model", "per the 2024 estimate"). */
const SOURCE_BEFORE = /(?:\bfrom|\bper|\baccording\s+to|\bsee|\bsource:?|\bcited\s+(?:in|by)|\breported\s+(?:in|by)|\bpublished\s+(?:in|by)|\bin)\s+$/i;
/** What may stand between the comparison or source word and the name: "the", "our", an evaluator's. */
const LEAD = /(?:(?:[Tt]he|[Oo]ur|[Ii]ts|[Tt]heir|charityevals['’]|that\s+of|those\s+of|[\p{Lu}][\w.-]*['’]s?)\s+){0,2}$/u;

/** Peers, medians and averages in an explainer (lint's summary patterns misread explainers' arithmetic:
 * "× the median survey ratio", "more than savings groups cost"). */
const CAUSE_WORD = String.raw`(?:global[- ]health|animal[- ]welfare|climate|catastrophic[- ]risk|democracy|policy|advocacy|nuclear|biosecurity|AI)`;
const PEER_PATTERNS: RegExp[] = [
  // Placed against the site's or a cause's median or average (a value read from it, "valued at the
  // site's climate average", is method).
  new RegExp(String.raw`\b(?:above|below|than|near|close\s+to|times|×|twice|half)\s+(?:the\s+)?(?:(?:site['’]s|cause['’]s|peers['’])\s+(?:own\s+)?(?:${CAUSE_WORD}\s+)?|${CAUSE_WORD}\s+)(?:charities['’]?\s+|models['’]?\s+)?(?:median|average)\b(?!\s+(?:survey|ratio|rate|share|exchange|price|household|person|consumption|temperature|warming|emissions|draw))`, "i"),
  // Peers: the charity's ("our peers use", "the peers' 0.65", "the nuclear peers"); not people's ("their
  // peers'"), the Lords' ("the peers left the House"), "peer groups" or "peer-reviewed".
  new RegExp(String.raw`\b(?:its|our)\s+(?:${CAUSE_WORD}\s+|closest\s+)?peers\b|\bthe\s+(?:${CAUSE_WORD}\s+|closest\s+)?peers['’]|\bthe\s+${CAUSE_WORD}\s+peers\b|\bpeer\s+(?:charit|models?\b|organi[sz]ations?)`, "i"),
  // Placed among the site's other charities or models.
  /\b(?:sits?|lies|ranks?|comes?\s+out)\s+(?:far\s+|well\s+|a little\s+)?(?:above|below|near|among)\s+(?:the|its|our|other)\s+(?:[\w'’-]+\s+){0,3}(?:charities|models|peers|median|average)\b/i,
  /\b(?:like|unlike|as with|as in|as for)\s+(?:charityevals['’]|our|the site['’]s|its)\s+other\s+(?:[\w-]+\s+){0,3}(?:charities)\b/i,
];

type NameIndex = { re: RegExp; owner: Map<string, string>; ids: RegExp | undefined; modelCharity: Map<string, string> };
const nameIndexes = new WeakMap<Library, NameIndex>();
/** Every charity's names (evaluators left out: "GiveWell's estimate" is a source, not a peer), longest first,
 * as one case-sensitive pattern, and which charity each name is; the models' ids, for ids typed in prose. */
function nameIndex(lib: Library): NameIndex {
  const hit = nameIndexes.get(lib);
  if (hit) return hit;
  const evaluators = new Set([...lib.owners.values()].flatMap((o) => [o.id, o.name.toLowerCase()]));
  // A name two charities share is kept for the one whose own name it is ("J-PAL"), else dropped.
  const claims = new Map<string, { base: string[]; other: string[] }>();
  for (const c of lib.charities.values()) {
    if (evaluators.has(c.id) || evaluators.has((c.name ?? "").toLowerCase())) continue;
    const base = (c.name ?? "").replace(/\s*\([^)]*\)/g, "").replace(/^The\s+/, "").trim();
    for (const n of charityAliases(c)) {
      const x = claims.get(n) ?? { base: [], other: [] };
      (n === base ? x.base : x.other).push(c.id);
      claims.set(n, x);
    }
  }
  const owner = new Map<string, string>();
  for (const [n, { base, other }] of claims) {
    const ids = base.length ? base : other;
    if (ids.length === 1) owner.set(n, ids[0]);
  }
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const alt = [...owner.keys()].sort((a, b) => b.length - a.length).map(esc).join("|");
  const modelCharity = new Map([...lib.models.values()].map((x) => [x.id, x.charity]));
  const idAlt = [...modelCharity.keys()].filter((id) => id.includes("-") && id.length >= 8).sort((a, b) => b.length - a.length).map(esc).join("|");
  const out: NameIndex = {
    re: new RegExp(`(?<![\\w-])(?:${alt})(?![\\w-])`, "gu"),
    owner,
    ids: idAlt ? new RegExp(`(?<![\\w/.-])#?(?:${idAlt})(?![\\w-])`, "g") : undefined,
    modelCharity,
  };
  nameIndexes.set(lib, out);
  return out;
}

/** The text fields of a model that the site shows, by where they are; a variant's only where they differ
 * from its parent's. Links' targets are blanked (a link is fine; its text is checked). */
export function modelTexts(lib: Library, m: ResolvedModel, writeup?: string): { where: string; text: string }[] {
  const parent = m.extends ? lib.models.get(m.extends) : undefined;
  const out: { where: string; text: string }[] = [];
  const add = (where: string, text: string | undefined, inherited?: string) => { if (text && text !== inherited) out.push({ where, text }); };
  add("summary", m.summary, parent?.summary);
  add("output label", m.output?.label, parent?.output?.label);
  for (const s of m.sections ?? []) {
    const p = parent?.sections?.find((x) => x.id === s.id);
    add(`section ${s.id} title`, s.title, p?.title);
    add(`section ${s.id} explainer`, s.explainer, p?.explainer);
  }
  for (const r of ownRows(m)) {
    const p = parent?.byId.get(r.id);
    add(`${r.id} label`, r.label, p?.label);
    add(`${r.id} explainer`, r.explainer, p?.explainer);
    add(`${r.id} range note`, r.range?.note, p?.range?.note);
  }
  (m.resources ?? []).forEach((x, i) => add(`resources[${i}] note`, x.note, parent?.resources?.find((y) => y.url === x.url)?.note));
  add("theoretical reason", m.theoretical?.reason);
  add("write-up", writeup);
  // Blank link targets and bare URLs, keeping positions.
  return out.map(({ where, text }) => ({ where, text: text.replace(/\]\([^)\s]*\)/g, (x) => `]${" ".repeat(x.length - 1)}`).replace(/https?:\/\/\S+/g, (x) => " ".repeat(x.length)) }));
}

/** Mentions of another charity's model or results in a model's text and write-up (site text never compares
 * with other charities, their models or results, medians or peers): another charity's name (or short
 * name, initials, nickname) with a model word ("the FairVote model", "our AMF relief model", "charityevals'
 * NRC and Save the Children models"), after a comparison ("as in", "than", "below GovAI's 0.9", "like"), a
 * model id or `#id` typed in prose, "model of <charity>", and peers, medians and averages (PEER_PATTERNS)
 * in fields lint and check.ts don't cover. Allowed: the model's own charity; a charity whose model this
 * one reads live, or a publisher of facts it reads ("Rethink Priorities' cross-cause model"), named as
 * where a figure is from, not compared with; a published source ("from GiveWell's AMF model"); evaluators;
 * links. Medium: the fix is to say it in the model's own terms. Summary and write-up phrases lint or
 * check.ts already reports (high) aren't repeated. */
export function peerMentionProblems(lib: Library, m: ResolvedModel, writeup?: string): Problem[] {
  const out: Problem[] = [];
  const { re, owner, ids, modelCharity } = nameIndex(lib);
  const own = m.charity;
  // Charities whose models this one reads live (formulas, destinations): where its figures are from.
  const reads = new Set<string>();
  for (const r of m.rows) for (const d of r.modelDeps) { const c = modelCharity.get(d) ?? lib.models.get(d)?.charity; if (c) reads.add(c); }
  // Publishers of the facts it reads (a source's title, not our own judgment): "Rethink Priorities'
  // cross-cause model" is where a figure is from, "the Protect Democracy model" isn't.
  const publishes = new Set<string>();
  for (const r of m.rows) for (const k of r.factDeps) {
    const title = lib.facts.get(k)?.source?.title ?? "";
    if (/^charityevals\b/i.test(title)) continue;
    for (const n of title.match(re) ?? []) { const c = owner.get(n); if (c) publishes.add(c); }
  }
  const formulaRefs = new Set(m.rows.flatMap((r) => [...(r.formula ?? "").matchAll(/#([a-z0-9-]+(?::[a-z0-9-]+)?)/g)].map((x) => x[1])));
  for (const d of m.destination_reads ?? []) formulaRefs.add(d);
  const others = namesFor(lib, own);
  const say = (where: string, phrase: string, why: string) => out.push({ severity: "medium", check: "peer-mention", where, message: `${why} ("${phrase.replace(/\s+/g, " ").trim()}"): site text never compares with other charities, their models or results; say it in this model's own terms (the evidence, the rule or the shared figure it reads), and name another organisation only as the source of a figure` });
  for (const { where, text } of modelTexts(lib, m, writeup)) {
    const covered = where === "summary" || where === "write-up";
    const already = covered ? comparisons(text, others) : [];
    // Each phrase once a field: lint's "below FAS" and this check's "below FAS's" are one finding.
    const seen: string[] = [];
    const report = (phrase: string, why: string) => {
      const k = phrase.replace(/\s+/g, " ").trim();
      if ([...seen, ...already].some((h) => h.includes(k) || k.includes(h))) return;
      seen.push(k);
      say(where, k, why);
    };
    // Peers, medians and averages without a name, where lint and check.ts don't look (rows, sections,
    // notes); not in a sentence about what the model reads live (#cause:…).
    if (!covered) for (const re of PEER_PATTERNS) for (const h of text.matchAll(new RegExp(re.source, re.flags + "g"))) {
      const at = h.index!;
      const sentence = text.slice(text.lastIndexOf(". ", at) + 1, (text.indexOf(". ", at + h[0].length) + 1 || text.length + 1) - 1);
      if (!/(?<![\w&])#[a-z]/.test(sentence)) report(h[0], "compares with others");
    }
    for (const x of text.matchAll(re)) {
      const name = x[0], c = owner.get(name);
      if (!c || c === own) continue;
      const s = x.index!, e = s + name.length;
      const before = text.slice(Math.max(0, s - 80), s);
      const lead = LEAD.exec(before)!;
      const head = before.slice(0, before.length - lead[0].length);
      // After the name: a possessive, then up to three qualifiers, then a model word.
      const rest = text.slice(e, e + 120);
      const poss = /^['’]s?(?![\w])/.exec(rest);
      const tail = rest.slice(poss ? poss[0].length : 0);
      const stop = tail.search(/[.;:!?()[\]\n—–"“”]/);
      // Another name in a list is one qualifier ("NRC and Save the Children models").
      const clause = (stop < 0 ? tail : tail.slice(0, stop)).replace(re, (n) => "N".repeat(n.length));
      let word: string | undefined, end = 0;
      const toks = [...clause.matchAll(/[\p{L}\p{N}&'’-]+/gu)];
      for (const [i, t] of toks.entries()) {
        if (i > 3) break;
        if (MODEL_WORD.test(t[0].replace(/['’]s?$/, "")) && !MODEL_ADJ.test(clause.slice(t.index! + t[0].length))) { word = t[0]; end = t.index! + t[0].length; break; }
        if (BREAK_WORD.test(t[0])) break;
      }
      const after = text.slice(e, e + (poss ? poss[0].length : 0) + end);
      const phrase = `${lead[0]}${name}${word ? after : poss ? poss[0] : ""}`;
      const source = reads.has(c) || publishes.has(c);
      const strong = COMPARE_STRONG.exec(head), weak = COMPARE_WEAK.exec(head), times = COMPARE_TIMES.exec(head);
      const ofModel = /\bmodels?\s+(?:of|for)\s+$/i.test(head);
      // A figure word ("GiveDirectly's estimate") is a source's own figure unless a comparison or "our"
      // comes first.
      const ours = /\b(?:our|charityevals['’])\s+/i.test(lead[0]);
      const modelMention = !!word && (!FIGURE_WORD.test(word) || ours);
      // A multiple or split of a source's figure ("times Rethink Priorities' range") is arithmetic, unless
      // it is that charity's model's; "times GiveDirectly" is GiveWell's unit (multiples of cash transfers).
      const multiple = times && (!source || modelMention) && !(name === "GiveDirectly" && !poss && /times|×/i.test(times[0]));
      const cw = strong ?? (multiple ? times : null) ?? (weak && (word || poss) ? weak : null);
      if (cw) report(`${cw[0]}${phrase}`, `compares with ${lib.charities.get(c)?.name ?? c}`);
      else if (modelMention || ofModel) {
        // A publisher's own model or figure ("Rethink Priorities' cross-cause model"), named as such.
        if (publishes.has(c) && poss && !lead[0].trim()) continue;
        if (reads.has(c) && !ours) continue;
        // A published source ("from GiveWell's AMF model", an evaluator's "from its AMF and SMC models"):
        // someone's possessive leads, not "the" or "our".
        if (SOURCE_BEFORE.test(head) && /(?:[\p{Lu}][\w.-]*['’]s?|\bits|\btheir)\s+$/u.test(lead[0]) && !ours) continue;
        // A comparison earlier in the clause ("as for treatment in the Dogs Trust model").
        const earlier = /\b(?:as\s+(?:in|for|with)|unlike|(?:the\s+)?same\s+as|similar\s+to)\b[^.;:()]{1,40}$/i.exec(head);
        if (earlier) report(`${earlier[0]}${phrase}`, `compares with ${lib.charities.get(c)?.name ?? c}`);
        else report(ofModel ? `${/\bmodels?\s+(?:of|for)\s+$/i.exec(head)![0]}${phrase}` : phrase, `names ${lib.charities.get(c)?.name ?? c}'s model or result`);
      }
    }
    // `#id`, `#owner:charity` and model ids typed in prose, of another charity's model this one doesn't read.
    for (const x of text.matchAll(/(?<![\w&/])#([a-z0-9-]+)(?::([a-z0-9-]+))?(?![\w-])/g)) {
      const [ref, a, b] = x;
      if (a === "cause" || formulaRefs.has(b ? `${a}:${b}` : a)) continue;
      const c = b ?? modelCharity.get(a) ?? (lib.charities.has(a) ? a : undefined);
      if (c && c !== own && !reads.has(c)) report(ref, `names ${lib.charities.get(c)?.name ?? c}'s model`);
    }
    if (ids) for (const x of text.matchAll(ids)) {
      const id = x[0].replace(/^#/, ""), c = modelCharity.get(id);
      if (c && c !== own && !formulaRefs.has(id) && !reads.has(c) && !x[0].startsWith("#")) report(x[0], `names ${lib.charities.get(c)?.name ?? c}'s model`);
    }
  }
  return out;
}

// --- generated/ ------------------------------------------------------------------------------------

/** Relative equality for generated numbers (V8 versions differ in the last bits of Math.exp and **). */
export function sameJson(a: unknown, b: unknown, rel = 1e-9): boolean {
  if (typeof a === "number" && typeof b === "number") return a === b || Math.abs(a - b) <= rel * Math.max(Math.abs(a), Math.abs(b));
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => sameJson(x, b[i], rel));
  if (a && b && typeof a === "object" && typeof b === "object") {
    const ka = Object.keys(a).filter((k) => (a as Record<string, unknown>)[k] !== undefined), kb = Object.keys(b).filter((k) => (b as Record<string, unknown>)[k] !== undefined);
    return ka.length === kb.length && ka.every((k) => sameJson((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], rel));
  }
  return a === b;
}
