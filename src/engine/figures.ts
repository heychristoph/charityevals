// Every figure the site shows, made in one place: a model's range and caveats, a charity's figure and
// the rankings. The pages (src/lib/use-results.ts), the MCP server, the data files, llms.txt, search
// snippets and the audit tools all call these, so no two of them can disagree.
import { assumptionValues, comparable, compute, headline, plausibleRange, ranks, referencedModels, unstableFlag, type Distribution, type JointEnds, type Library, type ResolvedModel } from "./model";
import { simulate } from "./montecarlo";
import { combine, coverageFlag, nextDollarFlag, primaryModel, programmeFigure, rankingPlan, type Basis, type EvaluatorPlan, type Figure, type LocationShare } from "./ranking";
import { flags, sensitivity, type Flag } from "./sensitivity";
import { uncertainty, type Uncertainty } from "./uncertainty";
import type { Charity } from "./schema";

export type { Figure };

// --- One model -----------------------------------------------------------------------------------

/** A model's simulation as the build stores it (generated/distributions.json, scripts/summaries.ts) and the
 * audit tool reads it: the Monte Carlo at the defaults, with the caveats' judgment share and point inputs,
 * and for an unstable one which end each input takes in its joint range. Undefined where nothing converts
 * or nothing is uncertain. */
export function storedDistribution(lib: Library, m: ResolvedModel): Distribution | undefined {
  if (!comparable(lib, m)) return undefined;
  const d = simulate(lib, m);
  if (!d) return undefined;
  const defaults = assumptionValues(lib.assumptions, {});
  const s = sensitivity(lib, m, defaults);
  const ends = (wantHigh: boolean) => {
    const e: JointEnds = { inputs: {}, assumptions: {} };
    for (const w of s.swings) (w.scope === "assumption" ? e.assumptions : e.inputs)[w.id] = (w.atHigh >= w.atLow) === wantHigh ? w.high : w.low;
    return e;
  };
  const judgment = Math.round(judgmentShare(lib, m, defaults) * 100) / 100;
  return { ...d, judgment, points: s.pointInputs.length, ...(d.unstable ? { joint: { low: ends(false), high: ends(true) } } : {}) };
}

type Range = { low: number; high: number };
const joints = new WeakMap<Library, WeakMap<ResolvedModel, { av: Record<string, number>; range: Range }>>();

/** Every input at its worst end and at its best together: the range of a model whose simulation can't
 * be relied on, or that has none. Exact at the reader's values for a model that computes only itself;
 * one that reads other models live (seconds to work out) uses the ends stored at build time, which end
 * each input takes (generated/distributions.json `joint`). */
export function jointRange(lib: Library, m: ResolvedModel, av: Record<string, number>): Range {
  let cache = joints.get(lib);
  if (!cache) joints.set(lib, (cache = new WeakMap()));
  const hit = cache.get(m);
  if (hit?.av === av) return hit.range;
  const j = lib.distributions?.[m.id]?.joint;
  let ends: number[];
  if (!referencedModels(lib, m).length || !j) {
    const s = sensitivity(lib, m, av);
    ends = [s.jointLow, s.jointHigh];
  } else {
    const at = (e: { inputs: Record<string, number>; assumptions: Record<string, number> }) => headline(lib, m, { ...av, ...e.assumptions }, e.inputs);
    ends = [at(j.low), at(j.high)];
  }
  const range = { low: Math.min(...ends), high: Math.max(...ends) };
  cache.set(m, { av, range });
  return range;
}

/** A model's range around its headline `central`: the simulated 5% to 95% (src/engine/montecarlo.ts),
 * else every input at its ends together. `joint`: those ends already worked out, with the reader's edits
 * (a model page's sensitivity), used instead of the stored ones. */
export function modelRange(lib: Library, m: ResolvedModel, central: number, av: Record<string, number>, joint?: Range): Range {
  return plausibleRange(lib, m, central, av) ?? (joint ? { low: Math.min(joint.low, joint.high), high: Math.max(joint.low, joint.high) } : jointRange(lib, m, av));
}

/** Where a range's bar starts on the rankings' log scale: its low end, or for a range reaching zero or
 * harm the lowest of the simulation's 5% steps above zero (the rest sits in the ≤0 zone). The stored steps
 * are multiples of the best guess: the range's ends are k × the first and the last step, so every step is
 * put in the range's units by the same k. Where that can't be read (an unstable simulation, a range not
 * from the steps) the bar runs to the axis start. */
export function barLow(lib: Library, m: ResolvedModel, range: Range): number | undefined {
  const low = Math.min(range.low, range.high), high = Math.max(range.low, range.high);
  if (low > 0) return low;
  if (!(high > 0)) return undefined;
  const d = lib.distributions?.[m.id];
  if (d?.additive && !d.unstable) {
    // Stored in the result's units: every step maps the way the range's ends do (scaled and moved).
    const q0 = d.q[0], q1 = d.q[d.q.length - 1];
    const k = q1 !== q0 ? (Math.max(range.low, range.high) - Math.min(range.low, range.high)) / (q1 - q0) : 1;
    const positive = d.q.map((x) => Math.min(range.low, range.high) + (x - q0) * k).filter((v) => v > 0);
    return positive.length ? Math.min(...positive) : Number.MIN_VALUE;
  }
  const q = d?.q;
  const first = q?.[0], last = q?.[q.length - 1];
  const k = q && last ? range.high / last : NaN;
  if (!q || d?.unstable || !(Math.abs(range.low - k * first!) <= 1e-9 * Math.max(1, Math.abs(range.low)))) return Number.MIN_VALUE;
  const positive = q.map((x) => k * x).filter((v) => v > 0);
  return positive.length ? Math.min(...positive) : Number.MIN_VALUE;
}

/** The share of a model's uncertainty from judgment calls and shared assumptions, as its page's
 * breakdown counts it. */
export function judgmentShare(lib: Library, m: ResolvedModel, av: Record<string, number>, edits: Record<string, number> = {}, values = compute(lib, m, av, edits)): number {
  return judgmentOf(uncertainty(lib, m, values, av, "charityevals", edits));
}

/** The same share from a breakdown already worked out (a model page's). */
export const judgmentOf = (u: Uncertainty) => u.bySource.judgment + u.bySource.assumption;

/** A model's caveats for the range shown. `live`: the judgment share and point inputs at the reader's
 * values and edits (a model's own page); without it, the ones stored at the defaults
 * (generated/distributions.json), as the rankings and the MCP server read them. */
export function modelFlags(lib: Library, m: ResolvedModel, range: Range, live?: { judgment: number; points: number }): Flag[] {
  const d = lib.distributions?.[m.id];
  const f = live ?? { judgment: d?.judgment ?? 0, points: d?.points ?? 0 };
  return [...flags(lib, m, { ...range, ...f }), coverageFlag(lib, m), unstableFlag(lib, m), nextDollarFlag(lib, m)].filter((x): x is Flag => !!x);
}

export type ModelFigure = Figure & { model: ResolvedModel; barLow?: number; flags: Flag[] };

/** A model's figure as the rankings show it: its headline, range and caveats at values `av`. */
export function modelFigure(lib: Library, m: ResolvedModel, av: Record<string, number>): ModelFigure {
  const central = headline(lib, m, av);
  const range = modelRange(lib, m, central, av);
  return { model: m, central, ...range, barLow: barLow(lib, m, range), flags: modelFlags(lib, m, range) };
}

// --- One charity ---------------------------------------------------------------------------------

export type ProgrammeFigure<R extends Figure> = Figure & { program: string; result: R; weight?: number; locations: number; locationBasis: Basis; parts?: LocationShare[] };
export type EvaluatorFigure<R extends Figure> = Figure & { owner: string; basis: Basis; programs: ProgrammeFigure<R>[] };
export type CharityFigure<R extends Figure> = Figure & {
  charity: Charity;
  /** The evaluator whose figure is the charity's number: the one its page leads with. */
  primary: string;
  evaluators: EvaluatorFigure<R>[];
  /** Where the bar starts on the log scale (barLow), across every evaluator. */
  barLow?: number;
};

const plans = new WeakMap<Library, Map<string, EvaluatorPlan[]>>();
function plansOf(lib: Library, charity: string): EvaluatorPlan[] {
  let cache = plans.get(lib);
  if (!cache) plans.set(lib, (cache = new Map()));
  if (!cache.has(charity)) cache.set(charity, rankingPlan(lib, charity));
  return cache.get(charity)!;
}

/** One evaluator's figure from its programmes, each over its locations, weighted by funding. */
export function evaluatorFigure<R extends Figure>(lib: Library, c: Charity, owner: string, parts: EvaluatorPlan["parts"], result: (m: ResolvedModel) => R): EvaluatorFigure<R> {
  const programs = parts.map((p) => {
    const r = result(p.model);
    const fig = programmeFigure(lib, c, p.model, (x) => (x === p.model ? r : result(x)));
    return { program: p.program, result: r, weight: p.weight, central: fig.central, low: fig.low, high: fig.high, locations: fig.locations, locationBasis: fig.locationBasis, parts: fig.parts };
  });
  const { central, low, high, basis } = combine(programs);
  return { owner, central, low, high, basis, programs };
}

/** A charity's figure at values `av`, from each model's `result` (default: modelFigure). `rankings`: as
 * the rankings count it, estimates the reader leaves out (`$ignore_old_estimates`) dropped; otherwise as
 * its own pages show it, every programme counted. Undefined for a charity with nothing to show. */
export function charityFigure<R extends Figure & { barLow?: number }>(
  lib: Library,
  charity: string,
  av: Record<string, number>,
  result: (m: ResolvedModel) => R,
  rankings = true,
): CharityFigure<R> | undefined {
  const c = lib.charities.get(charity);
  if (!c) return undefined;
  const evaluators = plansOf(lib, charity).flatMap(({ owner, parts }) => {
    const kept = rankings ? parts.filter((p) => ranks(lib, p.model, av)) : parts;
    return kept.length ? [evaluatorFigure(lib, c, owner, kept, result)] : [];
  });
  if (!evaluators.length) return undefined;
  const lead = evaluators.find((e) => e.owner === primaryModel(lib, charity)?.owner) ?? evaluators[0];
  const low = Math.min(...evaluators.map((e) => e.low));
  const starts = evaluators.flatMap((e) => e.programs.map((p) => p.result.barLow)).filter((x): x is number => x !== undefined && x > 0);
  return {
    charity: c,
    primary: lead.owner,
    central: lead.central,
    low,
    high: Math.max(...evaluators.map((e) => e.high)),
    evaluators,
    barLow: low > 0 ? low : starts.length ? Math.min(...starts) : undefined,
  };
}

/** Charities that can rank: those with a model that counts (src/engine/ranking.ts). */
export function rankableCharities(lib: Library): Charity[] {
  return [...lib.charities.values()].filter((c) => plansOf(lib, c.id).length > 0);
}

/** Every charity on the rankings at values `av`, best first: the homepage's list. */
export function rankings<R extends Figure & { barLow?: number }>(lib: Library, av: Record<string, number>, result: (m: ResolvedModel) => R): CharityFigure<R>[] {
  return rankableCharities(lib)
    .flatMap((c) => { const f = charityFigure(lib, c.id, av, result); return f && Number.isFinite(f.central) ? [f] : []; })
    .sort((a, b) => b.central - a.central);
}

/** The charity's figure as its page leads with it, at values `av` (every programme counted). */
export function charityHeadline(lib: Library, charity: string, av: Record<string, number>): number | undefined {
  const point = (m: ResolvedModel): Figure & { barLow?: number } => { const v = headline(lib, m, av); return { central: v, low: v, high: v }; };
  return charityFigure(lib, charity, av, point, false)?.central;
}

// --- Audits --------------------------------------------------------------------------------------

/** The median headline of a cause's ranked models, `except` one (an audit's model): for audits only,
 * never site text. NaN with fewer than three. */
export function causeMedian(lib: Library, cause: string, av: Record<string, number>, except?: string): number {
  const models = new Map<string, ResolvedModel>();
  for (const c of rankableCharities(lib)) for (const p of plansOf(lib, c.id)) for (const part of p.parts) if (part.model.cause === cause && part.model.id !== except) models.set(part.model.id, part.model);
  const xs = [...models.values()].map((m) => headline(lib, m, av)).filter((x) => Number.isFinite(x) && x > 0).sort((a, b) => a - b);
  if (xs.length < 3) return NaN;
  return xs.length % 2 ? xs[xs.length >> 1] : (xs[xs.length / 2 - 1] + xs[xs.length / 2]) / 2;
}
