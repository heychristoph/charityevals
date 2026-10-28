// Where a result's uncertainty comes from. Every input gets a spread: its published low/high where the
// evaluator gives one, otherwise a default by type (a judgment call is less certain than a measured
// cost). Each input's share is its spread times its leverage on the result, squared (first-order
// variance of the result's logarithm), so a loosely known input the result barely depends on ranks
// below a well-known one it depends on heavily.
//
// Leverage comes from one backward pass over the model: each formula's elasticity to each number it
// uses, chained from the bottom line down. That costs one evaluation of each formula per reference,
// so it runs on 8,000-row models in the browser. Default spreads only feed this view; the joint low and
// high on the rankings use published ranges alone.

import { evaluate, parse, refs, type Node, type Scope } from "./expr";
import { hasRange, inputRange, pickValue, viewAssumptions, type Library, type ResolvedModel, type ResolvedRow, type View } from "./model";
import { rowsFeeding } from "./sensitivity";

/** Where a number comes from, for grouping: your shared assumptions, the evaluator's judgment calls,
 * their estimates, and measured data (costs, counts, shared facts). */
export type Source = "assumption" | "judgment" | "estimate" | "data";

/** Default spread when none is published: the input could plausibly be this many times lower or higher. */
export const DEFAULT_FACTOR: Record<Exclude<Source, "assumption">, number> = { judgment: 1.5, estimate: 1.3, data: 1.1 };

// Most bulk-imported GiveWell inputs are typed "estimate" wholesale, so the label decides. These are
// the words GiveWell, ACE and HLI use for subjective adjustments and for measured quantities.
const JUDGMENT = /adjust|validity|replicab|counterfactual|leverage|fung|crowd|discount|moral weight|guess|subjective|plausib|probability|likelihood|chance|attribution|persist|decay|spillover|bias|we (think|assume|estimate)|our (estimate|guess)|assum/i;
const DATA = /\bcosts?\b|spent|spending|expenditure|budget|price|population|number of|enrol|census|exchange rate|inflation|\bgdp\b|salar|wage/i;
// Fixed conversions carry no uncertainty of their own.
const CONSTANT = /days (in|per) (a )?year|weeks (in|per) (a )?year|months (in|per) (a )?year|hours (in|per) (a )?day|unit conversion/i;

export function sourceOf(r: Pick<ResolvedRow, "kind" | "label">): Exclude<Source, "assumption"> {
  if (r.kind === "judgment") return "judgment";
  if (r.kind === "observed") return "data";
  if (JUDGMENT.test(r.label)) return "judgment";
  if (DATA.test(r.label)) return "data";
  return "estimate";
}

export type Driver = {
  /** "row:id", "assumption:id" or "fact:key". */
  key: string;
  scope: Scope;
  id: string;
  label: string;
  source: Source;
  /** True when the spread is the evaluator's (or the assumption's) own range, false for a default. */
  published: boolean;
  /** Half the log-width of the range: ln(high / low) / 2. For a number whose central value is zero
   * (a 0% discount rate), half the range's absolute width, with `absolute` set. */
  spread: number;
  absolute?: boolean;
  low: number;
  high: number;
  /** % change in the result for a 1% change in this number, over every path. */
  elasticity: number;
  /** (elasticity × spread)²: this input's part of the variance of ln(result). */
  contribution: number;
  share: number;
};

export type Uncertainty = {
  drivers: Driver[];
  /** Share of the total from each source. */
  bySource: Record<Source, number>;
  /** Variance of ln(row): its sensitivity to every source, summed over every path, times the source's
   * spread, squared and added up, so a source shared by two branches is counted once. */
  rowVar: (id: string) => number;
  leafVar: (scope: Scope, name: string) => number;
  /** Variance of ln(value) for any sub-formula, for the tree's parts that aren't whole rows. */
  exprVar: (expr: Node) => number;
  /** Variance of ln(result in the common unit), every source together: the 100% of both the
   * breakdown and the tree. */
  total: number;
  /** Share of it from converting the model's own unit into the common one (shared exchange rates),
   * which the tree, built on the model's own result, doesn't show. */
  conversionShare: number;
  /** Calculated rows with a published range: each counts as one source, standing in for the
   * inputs it's calculated from, which add nothing more through it. */
  ranged: Set<string>;
};

const H = 0.01;

/** A range's log half-width, and the range, for a value with an optional published range. */
function spreadOf(v: number, published: { low: number; high: number } | undefined, factor: number): { spread: number; low: number; high: number; absolute?: boolean } | undefined {
  if (!Number.isFinite(v)) return undefined;
  if (published) {
    const { low, high } = published;
    // Zero has no relative scale: measure the range in its own units instead.
    if (v === 0) return high > low ? { spread: (high - low) / 2, low, high, absolute: true } : undefined;
    if (low > 0 && high > 0 && v > 0) return { spread: Math.log(high / low) / 2, low, high };
    // A range through zero or below it: its width relative to the value.
    return { spread: Math.abs(high - low) / 2 / Math.abs(v), low, high };
  }
  if (v === 0) return undefined;
  // Proportions stay at or under 1.
  const low = v / factor, high = v > 0 && v <= 1 ? Math.min(1, v * factor) : v * factor;
  return { spread: Math.abs(Math.log(high / low)) / 2, low: Math.min(low, high), high: Math.max(low, high) };
}

export function uncertainty(lib: Library, m: ResolvedModel, values: Record<string, number>, av: Record<string, number>, view: View): Uncertainty {
  const a = viewAssumptions(m, av, view);
  const feeding = rowsFeeding(m);
  const leafVals = (scope: Scope, name: string) =>
    scope === "row" ? values[name] ?? NaN : scope === "assumption" ? a[name] ?? NaN : pickValue(lib.facts.get(name)?.value);

  // Spreads of every number the result can depend on. A calculated row with a published range (an
  // evaluator's interval on, say, a mortality reduction) is taken at its word, as a source in its own
  // right; its upstream inputs then count only through other paths, so nothing is counted twice.
  const leaves = new Map<string, Omit<Driver, "elasticity" | "contribution" | "share">>();
  const ranged = new Set<string>();
  for (const id of feeding) {
    const r = m.byId.get(id);
    if (!r?.node || !r.range) continue;
    const s = spreadOf(values[id], { low: r.range.low, high: r.range.high }, 1);
    if (!s || !(s.spread > 0)) continue;
    ranged.add(id);
    leaves.set(`row:${id}`, { key: `row:${id}`, scope: "row", id, label: r.label || id, source: sourceOf(r), published: true, ...s });
  }
  for (const id of feeding) {
    const r = m.byId.get(id);
    if (!r || r.node || r.format === "toggle" || CONSTANT.test(r.label)) continue;
    const range = inputRange(r, view);
    const source = sourceOf(r);
    const v = values[id];
    const s = spreadOf(v, hasRange(range) ? { low: pickValue(range, "low"), high: pickValue(range, "high") } : undefined, DEFAULT_FACTOR[source]);
    if (s && s.spread > 0) leaves.set(`row:${id}`, { key: `row:${id}`, scope: "row", id, label: r.label || id, source, published: hasRange(range), ...s });
  }
  const assumptionIds = new Set<string>();
  const factIds = new Set<string>();
  for (const id of feeding) {
    const r = m.byId.get(id);
    r?.assumptionDeps.forEach((x) => assumptionIds.add(x));
    r?.factDeps.forEach((x) => factIds.add(x));
  }
  const conv = m.output ? lib.assumptions.units[m.output.unit]?.to_common : undefined;
  const convNode = conv ? parse(conv) : undefined;
  if (convNode) refs(convNode).assumptions.forEach((x) => assumptionIds.add(x));
  for (const id of assumptionIds) {
    const row = lib.assumptions.rows.find((r) => r.id === id);
    if (!row || row.format === "toggle" || !hasRange(row.value)) continue;
    // The range is the slider's, widened to include a value set outside it.
    const v = a[id];
    const s = spreadOf(v, { low: Math.min(pickValue(row.value, "low"), v), high: Math.max(pickValue(row.value, "high"), v) }, 1);
    if (s && s.spread > 0) leaves.set(`assumption:${id}`, { key: `assumption:${id}`, scope: "assumption", id, label: row.label, source: "assumption", published: true, ...s });
  }
  for (const key of factIds) {
    const f = lib.facts.get(key);
    if (!f) continue;
    const s = spreadOf(pickValue(f.value), hasRange(f.value) ? { low: pickValue(f.value, "low"), high: pickValue(f.value, "high") } : undefined, DEFAULT_FACTOR.data);
    if (s && s.spread > 0) leaves.set(`fact:${key}`, { key: `fact:${key}`, scope: "fact", id: key, label: `${f.label} (${f.group})`, source: "data", published: hasRange(f.value), ...s });
  }
  const leafVar = (scope: Scope, name: string) => (leaves.get(`${scope}:${name}`)?.spread ?? 0) ** 2;

  // Each formula's elasticity to each number it names, by nudging that number 1%. A number at zero is
  // nudged by 1% of its range instead, giving the change in ln(formula) per unit of it.
  const local = (expr: Node, base: number): { scope: Scope; name: string; e: number }[] => {
    if (!base || !Number.isFinite(base)) return [];
    const r = refs(expr);
    const out: { scope: Scope; name: string; e: number }[] = [];
    const each = (scope: Scope, names: Set<string>) => {
      for (const name of names) {
        const v = leafVals(scope, name);
        if (!Number.isFinite(v)) continue;
        const leaf = v === 0 ? leaves.get(`${scope}:${name}`) : undefined;
        if (v === 0 && !leaf?.absolute) continue;
        const step = leaf?.absolute ? (leaf.high - leaf.low) * H : v * H;
        let after: number;
        try {
          after = evaluate(expr, (s, n) => (s === scope && n === name ? v + step : leafVals(s, n)));
        } catch {
          continue;
        }
        const e = (after - base) / base / (leaf?.absolute ? step : H);
        if (Number.isFinite(e) && e !== 0) out.push({ scope, name, e });
      }
    };
    each("row", r.rows);
    each("assumption", r.assumptions);
    each("fact", r.facts);
    return out;
  };

  const edges = new Map<string, { scope: Scope; name: string; e: number }[]>();
  for (const id of m.order) {
    const r = m.byId.get(id);
    if (r?.node && feeding.has(id) && !ranged.has(id)) edges.set(id, local(r.node, values[id]));
  }

  /** Sensitivity of ln(seed) to every source, summed over every path: one backward pass over the
   * stored elasticities, with no formulas evaluated. A ranged row has no edges, so it ends a path. */
  const backward = (seed: Map<string, number>) => {
    const E = new Map<string, number>(seed);
    for (let i = m.order.length - 1; i >= 0; i--) {
      const id = m.order[i];
      const here = E.get(`row:${id}`);
      const es = edges.get(id);
      if (!here || !es) continue;
      for (const x of es) E.set(`${x.scope}:${x.name}`, (E.get(`${x.scope}:${x.name}`) ?? 0) + here * x.e);
    }
    return E;
  };
  const varFrom = (E: Map<string, number>) => {
    let v = 0;
    for (const [key, e] of E) {
      const leaf = leaves.get(key);
      if (leaf) v += (e * leaf.spread) ** 2;
    }
    return v;
  };
  const rowVars = new Map<string, number>();
  const rowVar = (id: string) => {
    if (!edges.has(id)) return leafVar("row", id);
    let v = rowVars.get(id);
    if (v === undefined) rowVars.set(id, (v = varFrom(backward(new Map([[`row:${id}`, 1]])))));
    return v;
  };

  // Backward: the bottom line's elasticity to every number, summed over every path to it.
  const E = m.output ? backward(new Map([[`row:${m.output.row}`, 1]])) : new Map<string, number>();
  const nativeVar = varFrom(E);
  // The common unit is the native result times a conversion built from shared assumptions.
  if (convNode) {
    const base = evaluate(convNode, (s, n) => (s === "assumption" ? av[n] ?? NaN : NaN));
    for (const x of local(convNode, base)) E.set(`assumption:${x.name}`, (E.get(`assumption:${x.name}`) ?? 0) + x.e);
  }

  const drivers: Driver[] = [];
  for (const leaf of leaves.values()) {
    const elasticity = E.get(leaf.key) ?? 0;
    const contribution = (elasticity * leaf.spread) ** 2;
    if (contribution > 0) drivers.push({ ...leaf, elasticity, contribution, share: 0 });
  }
  const total = drivers.reduce((t, d) => t + d.contribution, 0);
  const bySource: Record<Source, number> = { assumption: 0, judgment: 0, estimate: 0, data: 0 };
  for (const d of drivers) {
    d.share = total > 0 ? d.contribution / total : 0;
    bySource[d.source] += d.share;
  }
  drivers.sort((x, y) => y.contribution - x.contribution);

  const exprVar = (expr: Node) => {
    let base: number;
    try {
      base = evaluate(expr, leafVals);
    } catch {
      return 0;
    }
    return varFrom(backward(new Map(local(expr, base).map((x) => [`${x.scope}:${x.name}`, x.e]))));
  };

  return {
    drivers,
    bySource,
    rowVar,
    leafVar,
    exprVar,
    total,
    conversionShare: total > 0 ? Math.max(0, 1 - nativeVar / total) : 0,
    ranged,
  };
}
