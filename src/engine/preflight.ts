// The checks scripts/preflight.ts adds to the existing ones (check.ts, lint, invariants, simulation-check)
// before a model goes to audit: units, how judgments are filed, and above all shared figures typed in by
// hand (docs/normalization.md 2.7-2.10). Each returns problems; `high` blocks the audit.
import { evaluate } from "./expr";
import { ALLOWED_LITERALS } from "./lint";
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

/** Waived pairs: INV-4's `row = @ref` and INV-13's `concept row`, for this model. */
function waived(waivers: Waivers, model: string) {
  const pairs = new Set<string>(), concepts = new Set<string>();
  for (const k of Object.keys(waivers["INV-4"] ?? {})) {
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
      out.push({ severity: "high", check: "shared-fact", where: r.id, message: `"${r.label}" ${why}: read ${ref} instead of typing ${fmt(v)} (the evaluator's or source's own figure, if it differs, in \`published\`; a different place or programme is a waiver with its reason)` });
  }
  return out;
}

/** Waiver sections (src/engine/normalization-waivers.json) for checks of the preflight's own:
 * `simulation`, keyed by model id: a wide spread that is honest (shared facts' ranges), with the reason;
 * `shared-fact-pair`, keyed by "<model> <row> = <model> <row>" (either order): two typed figures that are
 * different quantities, with the reason. */
export const PREFLIGHT_WAIVERS = { simulation: "simulation", pair: "shared-fact-pair" } as const;

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
