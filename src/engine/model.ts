import { parse, refs, evaluate, type Node, type Scope } from "./expr";
import { Model, Row, Assumptions, Facts, Charity, Owner, type ModelFile, type RowPatch, type Range } from "./schema";

export type ResolvedRow = Row & {
  /** Id of the model this row was first defined in, when that isn't this model. */
  inheritedFrom?: string;
  /** Fields this model changed on an inherited row. */
  overridden?: string[];
  node?: Node;
  deps: string[];
  assumptionDeps: string[];
  factDeps: string[];
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
    return { models: new Map(), charities, owners, assumptions: { groups: [], rows: [], units: {}, common: { unit: "", benchmark: "", benchmark_label: "" } }, facts, errors };
  }
  const assumptions = assumptionsParsed.data;
  const assumptionIds = new Set(assumptions.rows.map((r) => r.id));
  for (const [id, u] of Object.entries(assumptions.units)) {
    if (!u.to_common) continue;
    try {
      for (const a of refs(parse(u.to_common)).assumptions)
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
      ? parent.rows.map(({ node: _n, deps: _d, assumptionDeps: _a, factDeps: _f, expected: _e, range: _r, ...r }) => ({
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
      if (patch.formula !== undefined) { delete merged.value; delete merged.kind; delete merged.published; }
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
      const row: ResolvedRow = { ...check.data, inheritedFrom, overridden, deps: [], assumptionDeps: [], factDeps: [] };
      if (row.formula !== undefined) {
        try {
          row.node = parse(row.formula);
          const used = refs(row.node);
          row.deps = [...used.rows];
          row.assumptionDeps = [...used.assumptions];
          row.factDeps = [...used.facts];
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

    const model: ResolvedModel = {
      ...file,
      summary: file.summary ?? parent?.summary,
      resources: [...(parent?.resources ?? []), ...file.resources].filter((r, i, all) => all.findIndex((x) => x.url === r.url) === i),
      source: file.source ?? parent?.source,
      charity: file.charity ?? parent?.charity ?? "",
      owner: file.owner ?? parent?.owner ?? "",
      sections,
      output,
      evaluator: file.evaluator ?? parent?.evaluator,
      rows: resolved,
      byId,
      order: topoOrder(id, resolved, byId, errors),
      chain: [id, ...(parent?.chain ?? [])],
    };
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
  if (!models.has(assumptions.common.benchmark)) errors.push(`assumptions: benchmark model ${assumptions.common.benchmark} doesn't exist`);
  return { models, charities, owners, assumptions, facts, errors };
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
export function assumptionValues(a: Assumptions, user: Record<string, number> = {}): Record<string, number> {
  return Object.fromEntries(a.rows.map((r) => [r.id, user[r.id] ?? pickValue(r.value)]));
}

/** The assumption values a view computes with: the evaluator view pins what the evaluator used. */
export function viewAssumptions(m: ResolvedModel, av: Record<string, number>, view: View): Record<string, number> {
  return view === "evaluator" && m.evaluator ? { ...av, ...m.evaluator.assumptions } : av;
}

/** An input row's value in a view: the evaluator view uses the published value where ours differs. */
export function inputValue(r: Row, view: View, pick: Pick = "best"): number {
  return pickValue(view === "evaluator" && r.published !== undefined ? r.published : r.value, pick);
}

export function inputRange(r: Row, view: View): number | Range | undefined {
  return view === "evaluator" && r.published !== undefined ? r.published : r.value;
}

/** Every row's value. `inputs` overrides this model's inputs by row id, and shared facts by "@key". */
export function compute(
  lib: Library,
  m: ResolvedModel,
  av: Record<string, number>,
  inputs: Record<string, number> = {},
  view: View = "charityevals",
): Record<string, number> {
  const a = viewAssumptions(m, av, view);
  const vals: Record<string, number> = {};
  const lookup = (scope: Scope, n: string) =>
    scope === "row" ? vals[n] ?? NaN
    : scope === "assumption" ? a[n] ?? NaN
    : inputs[`@${n}`] ?? pickValue(lib.facts.get(n)?.value);
  for (const id of m.order) {
    const r = m.byId.get(id)!;
    vals[id] = inputs[id] ?? (r.node ? evaluate(r.node, lookup) : inputValue(r, view));
  }
  return vals;
}

/** Whether a model's result can be put on the common scale and ranked. */
export function comparable(lib: Library, m: ResolvedModel): boolean {
  return !!(m.output && lib.assumptions.units[m.output.unit]?.to_common);
}

export function toCommon(lib: Library, unit: string, av: Record<string, number>): number {
  const u = lib.assumptions.units[unit];
  return u?.to_common ? evaluate(parse(u.to_common), (scope, n) => (scope === "assumption" ? av[n] ?? NaN : NaN)) : NaN;
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
  const native = compute(lib, m, av, inputs, view)[m.output.row];
  return { native, common: native * toCommon(lib, m.output.unit, av) };
}

/** Assumptions that can change this model's common-unit result in a view. */
export function usedAssumptions(lib: Library, m: ResolvedModel, view: View = "charityevals"): string[] {
  const used = new Set<string>();
  for (const r of m.rows) r.assumptionDeps.forEach((a) => used.add(a));
  if (m.output) {
    const u = lib.assumptions.units[m.output.unit];
    if (u?.to_common) refs(parse(u.to_common)).assumptions.forEach((a) => used.add(a));
  }
  // The evaluator view fixes its accounting choices; it never toggles them.
  if (view === "evaluator" && m.evaluator)
    for (const [id] of Object.entries(m.evaluator.assumptions))
      if (lib.assumptions.rows.find((r) => r.id === id)?.format === "toggle") used.delete(id);
  return [...used];
}

/** A charity's models: by owner (owners.json order); within an owner, hand-built models before bulk
 * imports, then newest first. The first model of each owner is that owner's current view. */
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

/** Shared facts this model reads. */
export function usedFacts(m: ResolvedModel): string[] {
  return [...new Set(m.rows.flatMap((r) => r.factDeps))];
}
