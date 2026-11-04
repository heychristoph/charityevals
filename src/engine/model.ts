import { parse, refs, evaluate, type Node, type Scope } from "./expr";
import { Model, Row, Assumptions, Facts, Charity, Owner, type ModelFile, type RowPatch, type Range } from "./schema";
import { evaluatorFigure, evaluatorFigureModels } from "./ranking";
import { byIso3 } from "./countries";

export type ResolvedRow = Row & {
  /** Id of the model this row was first defined in, when that isn't this model. */
  inheritedFrom?: string;
  /** Fields this model changed on an inherited row. */
  overridden?: string[];
  node?: Node;
  deps: string[];
  assumptionDeps: string[];
  factDeps: string[];
  /** Other models whose live result this row reads (`#model-id`). */
  modelDeps: string[];
};

export type ResolvedModel = Omit<ModelFile, "rows" | "charity" | "owner"> & {
  charity: string;
  owner: string;
  rows: ResolvedRow[];
  byId: Map<string, ResolvedRow>;
  /** Row ids in an order where every row comes after the rows its formula uses. */
  order: string[];
  /** This model's id, then its parent's, and so on. */
  chain: string[];
  /** Rows of this model that its output unit's conversion reads (a climate model's
   * `air_pollution_weight`, docs/normalization.md 2.5): they feed the headline alongside the output. */
  conversionRows: string[];
};

export type FactRow = Row & { key: string; group: string };

export type Library = {
  models: Map<string, ResolvedModel>;
  charities: Map<string, Charity>;
  owners: Map<string, Owner>;
  assumptions: Assumptions;
  facts: Map<string, FactRow>;
  errors: string[];
};

/** Model pages live at /<id>, so these ids are taken by the site's own pages. */
export const RESERVED_IDS = new Set(["assumptions", "method", "facts", "history", "index", "404", "api", "about", "privacy", "terms", "legal", "models", "suggest"]);

/** charityevals: our model, with the visitor's assumptions and accounting choices.
 * evaluator: the source evaluator's model as published (where we have one). */
export type View = "charityevals" | "evaluator";

export function buildLibrary(
  rawModels: unknown[],
  rawAssumptions: unknown,
  rawFacts: unknown[] = [],
  rawCharities: unknown[] = [],
  rawOwners: unknown[] = [],
  /** Models outside this build that formulas may reference by `#id` (a page rebuilding one bulk model
   * in the browser passes the site's library). */
  options: { models?: Map<string, ResolvedModel> } = {},
): Library {
  const errors: string[] = [];
  const parseAll = <T,>(raws: unknown[], schema: { safeParse: (x: unknown) => { success: boolean; data?: T; error?: { issues: { path: PropertyKey[]; message: string }[] } } }, what: string) => {
    const out = new Map<string, T>();
    for (const raw of raws) {
      const r = schema.safeParse(raw);
      const id = (raw as { id?: string })?.id ?? "?";
      if (!r.success) { errors.push(`${what} ${id}: ${r.error!.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`); continue; }
      if (out.has(id)) errors.push(`${what} ${id}: duplicate id`);
      out.set(id, r.data as T);
    }
    return out;
  };
  const charities = parseAll<Charity>(rawCharities, Charity, "charity");
  const owners = parseAll<Owner>(rawOwners, Owner, "owner");
  for (const c of charities.values()) if (RESERVED_IDS.has(c.id)) errors.push(`charity ${c.id}: id is taken by a site page`);
  const facts = new Map<string, FactRow>();
  for (const raw of rawFacts) {
    const parsed = Facts.safeParse(raw);
    if (!parsed.success) {
      errors.push(`facts ${(raw as { id?: string })?.id ?? "?"}: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
      continue;
    }
    for (const r of parsed.data.rows) {
      if (r.formula !== undefined) errors.push(`facts ${parsed.data.id}.${r.id}: facts are data, not formulas`);
      facts.set(`${parsed.data.id}.${r.id}`, { ...r, key: `${parsed.data.id}.${r.id}`, group: parsed.data.label });
    }
  }
  const assumptionsParsed = Assumptions.safeParse(rawAssumptions);
  if (!assumptionsParsed.success) {
    errors.push(`assumptions: ${assumptionsParsed.error.message}`);
    return { models: new Map(), charities, owners, assumptions: { groups: [], rows: [], units: {}, common: { unit: "", benchmark: "" } }, facts, errors };
  }
  const assumptions = assumptionsParsed.data;
  const assumptionIds = new Set(assumptions.rows.map((r) => r.id));
  for (const [id, u] of Object.entries(assumptions.units)) {
    if (!u.to_common) continue;
    try {
      const used = refs(parse(u.to_common));
      for (const a of used.assumptions)
        if (!assumptionIds.has(a)) errors.push(`assumptions: unit ${id} uses unknown $${a}`);

    } catch (e) {
      errors.push(`assumptions: unit ${id}: ${(e as Error).message}`);
    }
  }

  const files = new Map<string, ModelFile>();
  for (const raw of rawModels) {
    const parsed = Model.safeParse(raw);
    if (!parsed.success) {
      const id = (raw as { id?: string })?.id ?? "?";
      errors.push(`${id}: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
      continue;
    }
    if (files.has(parsed.data.id)) errors.push(`${parsed.data.id}: duplicate model id`);
    if (parsed.data.id === "history") errors.push(`${parsed.data.id}: id is taken by a site page`);
    for (const a of Object.keys(parsed.data.evaluator?.assumptions ?? {}))
      if (!assumptionIds.has(a)) errors.push(`${parsed.data.id}: evaluator pins unknown assumption $${a}`);
    files.set(parsed.data.id, parsed.data);
  }

  const models = new Map<string, ResolvedModel>();
  const resolving = new Set<string>();

  function resolve(id: string): ResolvedModel | undefined {
    if (models.has(id)) return models.get(id);
    const file = files.get(id);
    if (!file) return undefined;
    if (resolving.has(id)) { errors.push(`${id}: extends itself through a cycle`); return undefined; }
    resolving.add(id);

    let parent: ResolvedModel | undefined;
    if (file.extends) {
      parent = resolve(file.extends);
      if (!parent) errors.push(`${id}: extends unknown model ${file.extends}`);
    }

    const rows: (RowPatch & Partial<ResolvedRow>)[] = parent
      ? parent.rows.map(({ node: _n, deps: _d, assumptionDeps: _a, factDeps: _f, modelDeps: _m, expected: _e, range: _r, ...r }) => ({
          ...r,
          inheritedFrom: r.inheritedFrom ?? parent!.id,
          overridden: undefined,
        }))
      : [];
    for (const patch of file.rows) {
      const i = rows.findIndex((r) => r.id === patch.id);
      if (i === -1) { rows.push({ ...patch }); continue; }
      const merged: RowPatch & Partial<ResolvedRow> = { ...rows[i], ...patch };
      // Switching an inherited row between input and formula drops the other side.
      if (patch.value !== undefined) delete merged.formula;
      if (patch.formula !== undefined) { delete merged.value; delete merged.kind; if (patch.published === undefined) delete merged.published; }
      if (patch.value !== undefined) delete merged.range;
      merged.overridden = Object.keys(patch).filter((k) => k !== "id" && k !== "expected");
      rows[i] = merged;
    }

    const resolved: ResolvedRow[] = [];
    for (const r of rows) {
      const { inheritedFrom, overridden, ...plain } = r;
      const check = Row.safeParse(plain);
      if (!check.success) {
        errors.push(`${id}: ${check.error.issues.map((i) => i.message).join("; ")}`);
        continue;
      }
      const row: ResolvedRow = { ...check.data, inheritedFrom, overridden, deps: [], assumptionDeps: [], factDeps: [], modelDeps: [] };
      if (row.formula !== undefined) {
        try {
          row.node = parse(row.formula);
          const used = refs(row.node);
          row.deps = [...used.rows];
          row.assumptionDeps = [...used.assumptions];
          row.factDeps = [...used.facts];
          row.modelDeps = [...used.models];
        } catch (e) {
          errors.push(`${id}.${row.id}: ${(e as Error).message}`);
        }
      }
      resolved.push(row);
    }

    const byId = new Map(resolved.map((r) => [r.id, r]));
    for (const r of resolved) {
      for (const d of r.deps) if (!byId.has(d)) errors.push(`${id}.${r.id}: unknown row ${d}`);
      for (const a of r.assumptionDeps) if (!assumptionIds.has(a)) errors.push(`${id}.${r.id}: unknown assumption $${a}`);
      for (const f of r.factDeps) if (!facts.has(f)) errors.push(`${id}.${r.id}: unknown fact @${f}`);
    }

    const sectionIds = new Set<string>();
    const sections = [...(parent?.sections ?? []), ...file.sections].filter((s) =>
      sectionIds.has(s.id) ? false : (sectionIds.add(s.id), true),
    );
    for (const r of resolved) if (r.section && !sectionIds.has(r.section)) errors.push(`${id}.${r.id}: unknown section ${r.section}`);

    const output = file.output ?? parent?.output;
    if (output && !byId.has(output.row)) errors.push(`${id}: output row ${output.row} doesn't exist`);
    if (output && !assumptions.units[output.unit]) errors.push(`${id}: output unit ${output.unit} isn't defined in assumptions`);
    if (output?.native && !byId.has(output.native.row)) errors.push(`${id}: native row ${output.native.row} doesn't exist`);
    for (const sp of output?.species ?? []) if (!byId.has(`ced_${sp}`)) errors.push(`${id}: species ${sp} has no ced_${sp} row`);
    const conversionRows = output ? unitRows(assumptions.units[output.unit]?.to_common) : [];
    if (output && rawFacts.length)
      for (const f of unitFacts(assumptions.units[output.unit]?.to_common)) if (!facts.has(f)) errors.push(`${id}: unit ${output.unit} reads unknown fact @${f}`);
    for (const r of conversionRows) if (!byId.has(r)) errors.push(`${id}: unit ${output!.unit} reads row ${r}, which the model doesn't define (docs/normalization.md 2.5)`);

    const model: ResolvedModel = {
      ...file,
      summary: file.summary ?? parent?.summary,
      resources: [...(parent?.resources ?? []), ...file.resources].filter((r, i, all) => all.findIndex((x) => x.url === r.url) === i),
      source: file.source ?? parent?.source,
      estimate_basis: file.estimate_basis ?? parent?.estimate_basis,
      beneficiaries: file.beneficiaries ?? parent?.beneficiaries,
      beneficiaries_note: file.beneficiaries ? file.beneficiaries_note : parent?.beneficiaries_note,
      missing_data: file.missing_data ?? parent?.missing_data,
      charity: file.charity ?? parent?.charity ?? "",
      owner: file.owner ?? parent?.owner ?? "",
      sections,
      output,
      evaluator: file.evaluator ?? parent?.evaluator,
      rows: resolved,
      byId,
      order: topoOrder(id, resolved, byId, errors),
      chain: [id, ...(parent?.chain ?? [])],
      conversionRows,
    };
    // A date that isn't one can't be aged (scripts/check.ts also requires a date on every site model).
    if (model.source?.published && !Number.isFinite(dateInYears(model.source.published)))
      errors.push(`${id}: source.published ${model.source.published} isn't a date (YYYY, YYYY-MM or YYYY-MM-DD)`);
    if (rawCharities.length) {
      if (!model.charity) errors.push(`${id}: no charity`);
      else if (!charities.has(model.charity)) errors.push(`${id}: unknown charity ${model.charity}`);
      if (!model.owner) errors.push(`${id}: no owner`);
      else if (!owners.has(model.owner)) errors.push(`${id}: unknown owner ${model.owner}`);
    }
    resolving.delete(id);
    models.set(id, model);
    return model;
  }

  for (const id of files.keys()) resolve(id);

  // `#model-id`: another model's live result. It must exist (here or in `options.models`), report in a
  // unit that converts to the common one, and no chain of references may come back to the model.
  const known = (id: string) => models.get(id) ?? options.models?.get(id);
  // `#owner:charity`: a charity's figure from one evaluator, read through the models the rankings use.
  const all: Library = { models: new Map([...(options.models ?? []), ...models]), charities, owners, assumptions, facts, errors: [] };
  const targets = (d: string): string[] => (isCharityRef(d) ? evaluatorFigureModels(all, ...splitCharityRef(d)).map((t) => t.id) : [d]);
  for (const m of models.values())
    for (const r of m.rows)
      for (const d of r.modelDeps) {
        if (isCharityRef(d)) {
          const [owner, charity] = splitCharityRef(d);
          if (!owners.has(owner) || !charities.has(charity)) errors.push(`${m.id}.${r.id}: unknown evaluator or charity #${d}`);
          else if (!targets(d).length) errors.push(`${m.id}.${r.id}: ${owner} doesn't rank ${charity} (#${d})`);
          continue;
        }
        const t = known(d);
        if (!t) errors.push(`${m.id}.${r.id}: unknown model #${d}`);
        else if (!t.output || !assumptions.units[t.output.unit]?.to_common) errors.push(`${m.id}.${r.id}: model #${d} has no result in common units`);
      }
  const state = new Map<string, 1 | 2>();
  const visit = (id: string, path: string[]) => {
    if (state.get(id) === 2) return;
    if (state.get(id) === 1) { errors.push(`model reference cycle ${[...path, id].join(" → ")}`); return; }
    state.set(id, 1);
    for (const d of modelDepsOf(known(id)).flatMap(targets)) visit(d, [...path, id]);
    state.set(id, 2);
  };
  for (const id of models.keys()) visit(id, []);
  if (!models.has(assumptions.common.benchmark)) errors.push(`assumptions: benchmark model ${assumptions.common.benchmark} doesn't exist`);
  return { models, charities, owners, assumptions, facts, errors };
}

/** Models a model's formulas reference directly (`#id`). */
export function modelDepsOf(m: ResolvedModel | undefined): string[] {
  return m ? [...new Set(m.rows.flatMap((r) => r.modelDeps ?? []))] : [];
}

/** `#owner:charity`: a charity's figure from one evaluator (src/engine/ranking.ts evaluatorFigure). */
export const isCharityRef = (ref: string) => ref.includes(":");
export const splitCharityRef = (ref: string) => ref.split(":") as [owner: string, charity: string];

/** Every model a model's result depends on through `#id` references, directly or not (a charity
 * reference stands for the models its figure reads). */
export function referencedModels(lib: Library, m: ResolvedModel): ResolvedModel[] {
  const seen = new Map<string, ResolvedModel>();
  const expand = (d: string) => (isCharityRef(d) ? evaluatorFigureModels(lib, ...splitCharityRef(d)).map((t) => t.id) : [d]);
  const walk = (x: ResolvedModel) => {
    for (const d of modelDepsOf(x).flatMap(expand)) {
      const t = lib.models.get(d);
      if (!t || seen.has(d) || d === m.id) continue;
      seen.set(d, t);
      walk(t);
    }
  };
  walk(m);
  return [...seen.values()];
}

// A referenced model's result per dollar in common units, cached per assumption-values object (the
// sliders, a sensitivity swing): the same reference read by many rows, or by every input swing of a
// sensitivity run, is computed once.
const resultCache = new WeakMap<Record<string, number>, Map<string, number>>();
const computing = new Set<string>();

/** Another model's live result, as `#id` reads it: its bottom line per dollar in common units (units of
 * value), in our view, under `av` (the reader's values, never another model's evaluator pins), with no
 * edits. NaN for an unknown model or a cycle (buildLibrary reports both). */
export function modelResult(lib: Library, id: string, av: Record<string, number>): number {
  let cache = resultCache.get(av);
  if (!cache) resultCache.set(av, (cache = new Map()));
  const hit = cache.get(id);
  if (hit !== undefined) return hit;
  const m = isCharityRef(id) ? undefined : lib.models.get(id);
  if ((!m && !isCharityRef(id)) || computing.has(id)) return NaN;
  computing.add(id);
  try {
    const v = m ? bottomLine(lib, m, av).common : evaluatorFigure(lib, ...splitCharityRef(id), (t) => modelResult(lib, t.id, av));
    cache.set(id, v);
    return v;
  } finally {
    computing.delete(id);
  }
}

/** Rows a unit's conversion reads from the model it converts (bare names in `to_common`). */
function unitRows(toCommon: string | undefined): string[] {
  if (!toCommon) return [];
  try {
    return [...refs(parse(toCommon)).rows];
  } catch {
    return [];
  }
}

/** Shared facts a unit's conversion reads (`@file.row`). */
function unitFacts(toCommon: string | undefined): string[] {
  if (!toCommon) return [];
  try {
    return [...refs(parse(toCommon)).facts];
  } catch {
    return [];
  }
}

function topoOrder(id: string, rows: ResolvedRow[], byId: Map<string, ResolvedRow>, errors: string[]): string[] {
  const order: string[] = [];
  const state = new Map<string, 1 | 2>();
  const visit = (rid: string, path: string[]) => {
    if (state.get(rid) === 2 || !byId.has(rid)) return;
    if (state.get(rid) === 1) { errors.push(`${id}: formula cycle ${[...path, rid].join(" → ")}`); return; }
    state.set(rid, 1);
    for (const d of byId.get(rid)!.deps) visit(d, [...path, rid]);
    state.set(rid, 2);
    order.push(rid);
  };
  for (const r of rows) visit(r.id, []);
  return order;
}

export type Pick = "low" | "best" | "high";

export function pickValue(value: number | Range | undefined, pick: Pick = "best"): number {
  if (value === undefined) return NaN;
  if (typeof value === "number") return value;
  return value[pick] ?? value.best;
}

export function hasRange(value: number | Range | undefined): value is Range {
  return typeof value === "object" && (value.low ?? value.best) !== (value.high ?? value.best);
}

/** Default assumption values (best guesses) with the user's overrides on top. */
/** Every shared assumption's value: the reader's where they set one, else the default. A fixed rate
 * (taken from evidence, not offered as a slider) always has its default, whatever an old link says. */
export function assumptionValues(a: Assumptions, user: Record<string, number> = {}): Record<string, number> {
  // A saved setting outside a slider's current range (an old link or saved value from before a range
  // changed, e.g. a 0% discount rate once the floor became 0.1%) is moved to the nearest end.
  const clamp = (r: (typeof a.rows)[number], v: number | undefined) => {
    if (v === undefined || typeof r.value !== "object" || r.value.low === undefined || r.value.high === undefined) return v;
    return Math.min(r.value.high, Math.max(r.value.low, v));
  };
  return Object.fromEntries(a.rows.map((r) => [r.id, clamp(r, r.fixed ? undefined : user[r.id]) ?? pickValue(r.value)]));
}

/** The assumption values a view computes with: the evaluator view pins what the evaluator used. */
export function viewAssumptions(m: ResolvedModel, av: Record<string, number>, view: View): Record<string, number> {
  return view === "evaluator" && m.evaluator ? { ...av, ...m.evaluator.assumptions } : av;
}

/** An input row's value in a view: the evaluator view uses the published value where ours differs. */
export function inputValue(r: Row, view: View, pick: Pick = "best"): number {
  return pickValue(view === "evaluator" && r.published !== undefined ? r.published : r.value, pick);
}

/** Whether a row acts as an input in a view: an input row, or, in the evaluator view, a calculated row
 * that carries the evaluator's own number (`published`). */
export function actsAsInput(r: Row & { node?: Node }, view: View): boolean {
  return !r.node || (view === "evaluator" && r.published !== undefined);
}

export function inputRange(r: Row, view: View): number | Range | undefined {
  return view === "evaluator" && r.published !== undefined ? r.published : r.value;
}

/** Every row's value. `inputs` overrides this model's inputs by row id, shared facts by "@key" and
 * another model's live result by "#id". The result also holds each model read live, under "#id". */
export function compute(
  lib: Library,
  m: ResolvedModel,
  av: Record<string, number>,
  inputs: Record<string, number> = {},
  view: View = "charityevals",
): Record<string, number> {
  const a = viewAssumptions(m, av, view);
  const vals: Record<string, number> = {};
  // Another model's result is stored as "#id" beside the rows, so every later lookup over these values
  // (the tree, uncertainty) reads the same number. It is always our view at the reader's values: the
  // evaluator view of this model doesn't pin another model's rates, but it never discounts an estimate
  // for its age or weighs it by distance (readerValues). A model read as a stand-in for this one's own
  // work is read without its distance weight: this model's beneficiaries apply (refValues).
  const lookup = (scope: Scope, n: string) =>
    scope === "row" ? vals[n] ?? NaN
    : scope === "assumption" ? a[n] ?? NaN
    : scope === "model" ? (vals[`#${n}`] ??= inputs[`#${n}`] ?? modelResult(lib, n, refValues(m, av, view)))
    : inputs[`@${n}`] ?? pickValue(lib.facts.get(n)?.value);
  for (const id of m.order) {
    const r = m.byId.get(id)!;
    // The evaluator view takes a calculated row's published number over its formula: a row that reads
    // a shared fact in our view keeps the evaluator's own figure there.
    vals[id] = inputs[id] ?? (r.node && !(view === "evaluator" && r.published !== undefined) ? evaluate(r.node, lookup) : inputValue(r, view));
  }
  return vals;
}

/** Whether a model's result can be put on the common scale and ranked. */
export function comparable(lib: Library, m: ResolvedModel): boolean {
  return !!(m.output && lib.assumptions.units[m.output.unit]?.to_common);
}

/** What one unit is worth in common units. A unit's conversion reads shared assumptions and, for a
 * unit that declares one (climate's `air_pollution_weight`), a fixed row of the model it converts:
 * `rows` are that model's computed values. */
export function toCommon(lib: Library, unit: string, av: Record<string, number>, rows: Record<string, number> = {}, inputs: Record<string, number> = {}): number {
  const u = lib.assumptions.units[unit];
  return u?.to_common ? evaluate(parse(u.to_common), conversionLookup(lib, av, rows, inputs)) : NaN;
}

/** The lookup a unit's conversion evaluates with: assumptions, shared facts (a fixed figure such as
 * GiveWell's value of an adult's death, read from its one source; `inputs` overrides one by "@key", as
 * a sensitivity swing does), and the converted model's own rows. */
export function conversionLookup(lib: Library, av: Record<string, number>, rows: Record<string, number> = {}, inputs: Record<string, number> = {}) {
  return (scope: Scope, n: string) =>
    scope === "assumption" ? av[n] ?? NaN : scope === "row" ? rows[n] ?? NaN : scope === "model" ? NaN : inputs[`@${n}`] ?? pickValue(lib.facts.get(n)?.value);
}

/** The site's headline unit, years of healthy life (DALYs averted) per $1,000 donated, in common units
 * per dollar: results anywhere on the site are the common value divided by this. */
export function perHealthyYearPer1000(av: Record<string, number>): number {
  return av.uov_per_daly / 1000;
}

const UOV_PER_DALY: Node = { type: "ref", scope: "assumption", name: "uov_per_daly" };

/** The headline every page shows, as a formula over `result` (a model's own result per dollar): the
 * unit's conversion into the common unit, factor by factor, divided by a healthy year's value, per
 * $1,000. Where the conversion already multiplies by that value, the two cancel and neither appears,
 * so ranges and uncertainty never vary a number the headline doesn't depend on. */
export function headlineNode(result: Node, toCommon: string): Node {
  const factors: { node: Node; inv: boolean }[] = [];
  const split = (n: Node, inv: boolean) => {
    if (n.type === "bin" && (n.op === "*" || n.op === "/")) {
      split(n.left, inv);
      split(n.right, n.op === "/" ? !inv : inv);
    } else if (!(n.type === "num" && n.value === 1)) factors.push({ node: n, inv });
  };
  split(parse(toCommon), false);
  const i = factors.findIndex((f) => !f.inv && f.node.type === "ref" && f.node.scope === "assumption" && f.node.name === "uov_per_daly");
  if (i >= 0) factors.splice(i, 1);
  else factors.push({ node: UOV_PER_DALY, inv: true });
  factors.push({ node: { type: "num", value: 1000 }, inv: false });
  return factors.reduce<Node>((acc, f) => ({ type: "bin", op: f.inv ? "/" : "*", left: acc, right: f.node }), result);
}

const conversions = new Map<string, Node>();

/** What turns a model's result per dollar in `unit` into the headline: undefined for a unit with no
 * exchange rate. */
export function headlineConversion(lib: Library, unit: string): Node | undefined {
  const to = lib.assumptions.units[unit]?.to_common;
  if (!to) return undefined;
  let n = conversions.get(to);
  if (!n) conversions.set(to, (n = headlineNode({ type: "num", value: 1 }, to)));
  return n;
}

// --- An estimate's age (docs/normalization.md 2.11) -------------------------------------------------

/** The slider for how much less an estimate counts for each year since it was made. */
export const AGE_DISCOUNT = "estimate_age_discount";

/** A date as a year with a fraction: "2016-05-20" → 2016.38. A month or a year alone stands for its
 * middle (the 15th; 1 July), so an estimate dated only "2016" is counted from mid-2016. NaN for
 * anything else. */
export function dateInYears(date: string): number {
  const d = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(date);
  if (!d) return NaN;
  const y = Number(d[1]), mo = d[2] === undefined ? 7 : Number(d[2]), day = d[3] === undefined ? (d[2] === undefined ? 1 : 15) : Number(d[3]);
  const t = Date.UTC(y, mo - 1, day);
  // 2016-13-01 or 2016-02-30 would roll over into another date.
  if (new Date(t).getUTCMonth() !== mo - 1 || new Date(t).getUTCDate() !== day) return NaN;
  return y + (t - Date.UTC(y, 0, 1)) / (Date.UTC(y + 1, 0, 1) - Date.UTC(y, 0, 1));
}

/** How old a model's estimate is, in years: from its source.published to the date the site's data is
 * counted to (assumptions `common.estimate_age_as_of`), never the build's clock, so a result is the
 * same whenever it is computed. 0 for an estimate dated after that; undefined where either date is
 * missing (buildLibrary requires a date on every model with an output). */
export function estimateAge(lib: Library, m: ResolvedModel): number | undefined {
  const asOf = lib.assumptions.common.estimate_age_as_of;
  const made = m.source?.published;
  if (!asOf || !made) return undefined;
  const age = dateInYears(asOf) - dateInYears(made);
  return Number.isFinite(age) ? Math.max(0, age) : undefined;
}

const ageNodes = new WeakSet<Node>();
const ageYears = new WeakSet<Node>();
/** Whether a node is the divisor for an estimate's age, or the years in it, so the tree can name them. */
export const isAgeDivisor = (n: Node) => ageNodes.has(n);
export const isAgeYears = (n: Node) => ageYears.has(n);

/** What a result is divided by for its estimate's age, (1 + $estimate_age_discount) ^ age: the factor
 * is (1 + d) ^ −age, written like the time discount ($discount_rate). Undefined in the evaluator view
 * (it never applies there), in a library without the slider (an old commit's), and for an estimate
 * with no age. */
export function ageDivisorNode(lib: Library, m: ResolvedModel, view: View = "charityevals"): Node | undefined {
  if (view === "evaluator" || !lib.assumptions.rows.some((r) => r.id === AGE_DISCOUNT)) return undefined;
  const age = estimateAge(lib, m);
  if (!age) return undefined;
  const years: Node = { type: "num", value: age };
  const n: Node = {
    type: "bin", op: "^",
    left: { type: "bin", op: "+", left: { type: "num", value: 1 }, right: { type: "ref", scope: "assumption", name: AGE_DISCOUNT } },
    right: years,
  };
  ageNodes.add(n);
  ageYears.add(years);
  return n;
}

/** The factor for a model's age at assumption values `a` (the view's own): 1 where none applies. */
export function ageFactor(lib: Library, m: ResolvedModel, a: Record<string, number>, view: View = "charityevals"): number {
  const n = ageDivisorNode(lib, m, view);
  return n ? 1 / evaluate(n, (scope, name) => (scope === "assumption" ? a[name] ?? NaN : NaN)) : 1;
}

// --- Lives near and far (docs/normalization.md 2.13) ------------------------------------------------

/** Where the reader lives: an ISO 3166 numeric code (facts/countries.json), 0 for not set. */
export const HOME_COUNTRY = "home_country";
/** How much less a life counts for each step further from the reader: their country, the rest of
 * their world region, the rest of the world. */
export const DISTANCE_DISCOUNT = "distance_discount";

const factorLabels = new WeakMap<Node, string>();
/** A name for a node of the distance weight or the missing-data factor, so the tree can show it. */
export const distanceLabel = (n: Node) => factorLabels.get(n);
const distanceNodes = new WeakMap<ResolvedModel, Node | null>();

const num = (value: number): Node => ({ type: "num", value });
const assumption = (name: string): Node => ({ type: "ref", scope: "assumption", name });
const bin = (op: "+" | "-" | "*" | "=", left: Node, right: Node): Node => ({ type: "bin", op, left, right });
const sumOf = (parts: Node[]): Node => (parts.length === 0 ? num(0) : parts.length === 1 ? parts[0] : { type: "call", fn: "sum", args: parts });
const times = (share: number, n: Node): Node => (share === 1 ? n : bin("*", num(share), n));

/** The weight a model's result takes for where the lives it helps are, in our view: each country's
 * share of them times (1 − d)^steps, 0 steps for the reader's country, 1 for the rest of its world
 * region, 2 for the rest of the world. Written out,
 *   if($home_country = 0, 1, (1 − d)² + d × s + d × (1 − d) × S)
 * with s the share in the reader's country and S the share in their region (their country included),
 * so it is exactly 1 with no country set or at d = 0. Undefined in the evaluator view, in a library
 * without the sliders (an old commit's), for a model with no beneficiaries, and for a charity that moves
 * money ("destinations"): each destination it reads live brings its own weight (refValues). */
export function distanceNode(lib: Library, m: ResolvedModel, view: View = "charityevals"): Node | undefined {
  if (view === "evaluator" || !lib.assumptions.rows.some((r) => r.id === DISTANCE_DISCOUNT) || !lib.assumptions.rows.some((r) => r.id === HOME_COUNTRY)) return undefined;
  const cached = distanceNodes.get(m);
  if (cached !== undefined) return cached ?? undefined;
  const b = m.beneficiaries;
  let n: Node | undefined;
  if (b && b !== "destinations") {
    const home = assumption(HOME_COUNTRY), d = assumption(DISTANCE_DISCOUNT);
    // A "world" share is spread by population: its share in the reader's country is that country's
    // share of the world's people, in their region the region's.
    const shares: Record<string, number> = b === "world" ? { world: 1 } : b;
    const entries = Object.entries(shares).filter(([iso]) => byIso3.has(iso));
    const world = shares.world ?? 0;
    const regions = new Map<number, number>();
    for (const [iso, share] of entries) regions.set(byIso3.get(iso)!.region, (regions.get(byIso3.get(iso)!.region) ?? 0) + share);
    const call = (fn: string): Node => ({ type: "call", fn, args: [home] });
    const here = sumOf([
      ...entries.map(([iso, share]) => times(share, bin("=", home, num(byIso3.get(iso)!.m49)))),
      ...(world ? [times(world, call("population_share"))] : []),
    ]);
    const region = sumOf([
      ...[...regions].map(([code, share]) => times(Number(share.toPrecision(12)), bin("=", call("region_of"), num(code)))),
      ...(world ? [times(world, call("region_population_share"))] : []),
    ]);
    const oneMinus = bin("-", num(1), d);
    const weighed = bin("+", bin("+", { type: "bin", op: "^", left: oneMinus, right: num(2) }, bin("*", d, here)), bin("*", bin("*", d, oneMinus), region));
    n = { type: "call", fn: "if", args: [bin("=", home, num(0)), num(1), weighed] };
    factorLabels.set(n, "For where the lives it helps are");
    factorLabels.set(here, "Share of the lives it helps in your country");
    factorLabels.set(region, "Share in your world region (your country included)");
  }
  distanceNodes.set(m, n ?? null);
  return n;
}

/** The distance weight at assumption values `a` (the view's own): 1 where none applies. */
export function distanceFactor(lib: Library, m: ResolvedModel, a: Record<string, number>, view: View = "charityevals"): number {
  const n = distanceNode(lib, m, view);
  return n ? evaluate(n, (scope, name) => (scope === "assumption" ? a[name] ?? NaN : NaN)) : 1;
}

// --- Missing outcome data (docs/normalization.md 2.12) ---------------------------------------------

/** How much a result whose outcome isn't measured for the charity counts (accounting, default 50%). */
export const MISSING_DATA_DISCOUNT = "missing_data_discount";

const missingNodes = new WeakMap<ResolvedModel, Node | null>();

/** The factor an imported model's result takes for the share of it that isn't measured for this
 * charity (its `missing_data.thin_share`, s), in our view: 1 − s × (1 − $missing_data_discount), the
 * measured share in full and the thin share at the slider, written so it is exactly 1 at a slider of 1
 * and the slider itself for a wholly thin model. Undefined in the evaluator view, in a library without
 * the slider (an old commit's), for a measured model (s = 0) and for charityevals' own models (no
 * `missing_data`: their branches' missing_data_adj rows apply the slider, so it never counts twice). */
export function missingDataNode(lib: Library, m: ResolvedModel, view: View = "charityevals"): Node | undefined {
  if (view === "evaluator" || !lib.assumptions.rows.some((r) => r.id === MISSING_DATA_DISCOUNT)) return undefined;
  const cached = missingNodes.get(m);
  if (cached !== undefined) return cached ?? undefined;
  const s = m.missing_data?.thin_share ?? 0;
  let n: Node | undefined;
  if (s > 0) {
    const d = assumption(MISSING_DATA_DISCOUNT);
    if (s === 1) n = d;
    else {
      const share = num(s);
      n = bin("-", num(1), bin("*", share, bin("-", num(1), d)));
      factorLabels.set(n, "For the part of the result that isn't measured");
      factorLabels.set(share, "Share of the result not measured for this charity");
    }
  }
  missingNodes.set(m, n ?? null);
  return n;
}

/** The missing-data factor at assumption values `a` (the view's own): 1 where none applies. */
export function missingDataFactor(lib: Library, m: ResolvedModel, a: Record<string, number>, view: View = "charityevals"): number {
  const n = missingDataNode(lib, m, view);
  return n ? evaluate(n, (scope, name) => (scope === "assumption" ? a[name] ?? NaN : NaN)) : 1;
}

const modelConversions = new WeakMap<ResolvedModel, Partial<Record<View, Node | undefined>>>();

/** What turns a model's result per dollar into its headline in a view: the unit's conversion
 * (headlineConversion) and, in our view, the factor for the estimate's age, the distance weight and an
 * imported model's missing-data factor. The one place they apply: the headline, bottomLine's common result (so `#id` references, the rankings and a meta
 * charity's destinations), sensitivity, uncertainty and the tree all read it from here. Undefined for
 * a unit with no exchange rate. */
export function modelConversion(lib: Library, m: ResolvedModel, view: View = "charityevals"): Node | undefined {
  let byView = modelConversions.get(m);
  if (!byView) modelConversions.set(m, (byView = {}));
  if (view in byView) return byView[view];
  const conv = m.output ? headlineConversion(lib, m.output.unit) : undefined;
  return (byView[view] = conv && withReaderFactors(lib, m, conv, view));
}

/** A conversion (or a headline formula) divided by the age divisor and times the distance weight and
 * the missing-data factor, where they apply. */
function withReaderFactors(lib: Library, m: ResolvedModel, n: Node, view: View): Node {
  const age = ageDivisorNode(lib, m, view);
  const dist = distanceNode(lib, m, view);
  const missing = missingDataNode(lib, m, view);
  const aged: Node = age ? { type: "bin", op: "/", left: n, right: age } : n;
  const weighed: Node = dist ? { type: "bin", op: "*", left: aged, right: dist } : aged;
  return missing ? { type: "bin", op: "*", left: weighed, right: missing } : weighed;
}

/** The headline as a formula over `result` (a model's own result per dollar, e.g. its output row):
 * headlineNode's conversion and, in our view, the age factor, the distance weight and the missing-data factor. Undefined for a unit with no exchange
 * rate. */
export function headlineExprOf(lib: Library, m: ResolvedModel, result: Node, view: View = "charityevals"): Node | undefined {
  const to = m.output && lib.assumptions.units[m.output.unit]?.to_common;
  if (!to) return undefined;
  return withReaderFactors(lib, m, headlineNode(result, to), view);
}

const readers = new WeakMap<Record<string, number>, Record<string, number>>();
/** The values a view reads other models (`#id`) at: the reader's own in our view; in the evaluator
 * view the same with no discount for age or distance and missing data counted in full, so that view
 * never applies them, however deep. One object per `av`, so modelResult's cache still hits. */
export function readerValues(av: Record<string, number>, view: View): Record<string, number> {
  if (view !== "evaluator" || (!av[AGE_DISCOUNT] && !av[DISTANCE_DISCOUNT] && !(MISSING_DATA_DISCOUNT in av && av[MISSING_DATA_DISCOUNT] !== 1))) return av;
  let r = readers.get(av);
  if (!r) readers.set(av, (r = { ...av, [AGE_DISCOUNT]: 0, [DISTANCE_DISCOUNT]: 0, ...(MISSING_DATA_DISCOUNT in av ? { [MISSING_DATA_DISCOUNT]: 1 } : {}) }));
  return r;
}

const neutral = new WeakMap<Record<string, number>, Record<string, number>>();
/** The values a model reads another (`#id`) at. A charity that moves money ("destinations") reads each
 * destination with its distance weight and its missing-data step: the good is done where, and as well
 * as, the destination does it. Any other model reads a model as a stand-in for its own work (a
 * comparable programme's result per dollar), so without the stand-in's weight or missing-data step: its
 * own beneficiaries' weight and its own missing-data classification apply once, to the whole. */
export function refValues(m: ResolvedModel, av: Record<string, number>, view: View): Record<string, number> {
  const r = readerValues(av, view);
  const missingMoves = MISSING_DATA_DISCOUNT in r && r[MISSING_DATA_DISCOUNT] !== 1;
  if (m.beneficiaries === "destinations" || (!r[DISTANCE_DISCOUNT] && !missingMoves)) return r;
  let n = neutral.get(r);
  if (!n) neutral.set(r, (n = { ...r, [DISTANCE_DISCOUNT]: 0, ...(MISSING_DATA_DISCOUNT in r ? { [MISSING_DATA_DISCOUNT]: 1 } : {}) }));
  return n;
}

/** The model's bottom line per dollar, in its own unit and in the common unit. */
export function bottomLine(
  lib: Library,
  m: ResolvedModel,
  av: Record<string, number>,
  inputs: Record<string, number> = {},
  view: View = "charityevals",
) {
  if (!m.output) return { native: NaN, common: NaN };
  const vals = compute(lib, m, av, inputs, view);
  const native = vals[m.output.row];
  const a = viewAssumptions(m, av, view);
  return { native, common: native * toCommon(lib, m.output.unit, a, vals, inputs) * ageFactor(lib, m, a, view) * distanceFactor(lib, m, a, view) * missingDataFactor(lib, m, a, view) };
}

/** The model's result as the site shows it: years of healthy life per $1,000 where its unit converts,
 * else its own result per dollar. */
export function headline(
  lib: Library,
  m: ResolvedModel,
  av: Record<string, number>,
  inputs: Record<string, number> = {},
  view: View = "charityevals",
): number {
  if (!m.output) return NaN;
  const vals = compute(lib, m, av, inputs, view);
  const native = vals[m.output.row];
  const conv = modelConversion(lib, m, view);
  // The view's own rates: the evaluator view converts at the evaluator's pinned values (INV-8).
  const a = viewAssumptions(m, av, view);
  return conv ? native * evaluate(conv, conversionLookup(lib, a, vals, inputs)) : native;
}

/** Assumptions that can change this model's headline in a view. */
export function usedAssumptions(lib: Library, m: ResolvedModel, view: View = "charityevals"): string[] {
  const used = new Set<string>();
  for (const r of m.rows) r.assumptionDeps.forEach((a) => used.add(a));
  const conv = modelConversion(lib, m, view);
  if (conv) refs(conv).assumptions.forEach((a) => used.add(a));
  // A model read live (`#id`) moves with every assumption it reads, in our view.
  for (const t of referencedModels(lib, m)) usedAssumptions(lib, t).forEach((a) => used.add(a));
  // The evaluator view never discounts an estimate for its age, its own or a model's it reads, never
  // weighs it by distance and never discounts an imported model for missing data.
  if (view === "evaluator") [AGE_DISCOUNT, DISTANCE_DISCOUNT, HOME_COUNTRY].forEach((x) => used.delete(x));
  if (view === "evaluator" && !m.rows.some((r) => r.assumptionDeps.includes(MISSING_DATA_DISCOUNT))) used.delete(MISSING_DATA_DISCOUNT);
  // The evaluator view fixes its accounting choices; it never toggles them.
  if (view === "evaluator" && m.evaluator)
    for (const [id] of Object.entries(m.evaluator.assumptions))
      if (lib.assumptions.rows.find((r) => r.id === id)?.format === "toggle") used.delete(id);
  return [...used];
}

/** A charity's models: by owner (owners.json order); within an owner, hand-built models before bulk
 * imports, then newest first. The first model of each owner is that owner's current view. Which model
 * ranks, and the charity's main page (src/lib/data.ts primaryOf), go by date alone, hand-built or not
 * (src/engine/ranking.ts); scripts/check.ts and bulk-writeups.ts still key write-ups on this order. */
export function modelsOf(lib: Library, charity: string): ResolvedModel[] {
  const order = [...lib.owners.keys()];
  const date = (m: ResolvedModel) => m.source?.published ?? "";
  return [...lib.models.values()]
    .filter((m) => m.charity === charity && m.kind === "charity" && m.output)
    .sort((a, b) => order.indexOf(a.owner) - order.indexOf(b.owner) || Number(!!a.bulk) - Number(!!b.bulk) || date(b).localeCompare(date(a)));
}

/** Each owner's current model of a charity: the first of theirs in modelsOf order. */
export function currentModelsOf(lib: Library, charity: string): ResolvedModel[] {
  const seen = new Set<string>();
  return modelsOf(lib, charity).filter((m) => !seen.has(m.owner) && seen.add(m.owner));
}

/** Shared facts this model reads: in its rows, and, given the library, in its unit's conversion into
 * the headline (climate's `@climate.*`), which can move its headline just the same. */
export function usedFacts(m: ResolvedModel, lib?: Library): string[] {
  const used = new Set(m.rows.flatMap((r) => r.factDeps));
  const conv = lib && m.output && headlineConversion(lib, m.output.unit);
  if (conv) refs(conv).facts.forEach((f) => used.add(f));
  return [...used];
}

/** Fact key → ids of the models that read it, in id order: only facts more than one model reads. */
export function factUsage(lib: Library): Record<string, string[]> {
  const by: Record<string, string[]> = {};
  for (const m of [...lib.models.values()].sort((a, b) => a.id.localeCompare(b.id)))
    for (const k of usedFacts(m, lib)) (by[k] ??= []).push(m.id);
  return Object.fromEntries(Object.entries(by).filter(([, ids]) => ids.length > 1).sort(([a], [b]) => a.localeCompare(b)));
}
