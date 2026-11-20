import { useEffect, useMemo, useReducer, useState, useSyncExternalStore } from "react";
import { lib, primaryOf, rankedCharities } from "./data";
import { assumptionValues, headline, plausibleRange, ranks, unstableFlag, type ResolvedModel } from "../engine/model";
import { combine, combineLocations, coverageFlag, nextDollarFlag, declaredLocations, locationsOf, locationWeights, rankingPlan, type Basis } from "../engine/ranking";
import type { Charity } from "../engine/schema";
import { sensitivity, flags, type Sensitivity, type Flag } from "../engine/sensitivity";
import { getOverrides, subscribeOverrides, useOverrides } from "./assumption-state";

export type Result = {
  model: ResolvedModel;
  /** Everything below is in years of healthy life per $1,000 (a model in a unit that doesn't convert:
   * its own unit per dollar), under the same assumptions. */
  central: number;
  low: number;
  high: number;
  /** Where the range's bar starts on the chart's log scale: the low end, or for a range reaching zero or
   * harm the lowest of the simulation's 5% steps above zero (the rest sits in the chart's ≤0 zone);
   * undefined when none is above zero. */
  barLow?: number;
  /** The one-at-a-time sensitivity: on a model's own result (useResultFor), not on the rankings'. */
  s?: Sensitivity;
  flags: Flag[];
};

/** One program's figure within an evaluator's: its model, or the model's locations combined. */
export type ProgramResult = {
  program: string;
  /** The program's model (for a model with locations, the one its page shows). */
  result: Result;
  central: number;
  low: number;
  high: number;
  weight?: number;
  /** How many locations, and how they combine: "weighted" by funding (the charity's declared money per
   * location, else the sheet's own grant sizes), or "single" (the model's own figure; for GiveWell's
   * multi-location models, the median location). */
  locations: number;
  locationBasis: Basis;
};

/** One evaluator's dot on a charity's line (src/engine/ranking.ts says which models count). */
export type EvaluatorResult = {
  owner: string;
  central: number;
  low: number;
  high: number;
  /** How the programs combine: one program, funding-weighted, or their median. */
  basis: Basis;
  programs: ProgramResult[];
  flags: Flag[];
  /** Every program's model is purely theoretical (an idea's estimate from before the charity existed). */
  theoretical: boolean;
};

/** A charity on the rankings: one figure per evaluator, and where the row sits. */
export type CharityResult = {
  charity: Charity;
  evaluators: EvaluatorResult[];
  /** The primary evaluator: the one whose model the charity's page leads with. */
  primary: string;
  /** The primary evaluator's figure: the row's number and position, the same as the charity page's
   * headline. The other evaluators show as their own dots. */
  central: number;
  /** Lowest joint low and highest joint high across evaluators. */
  low: number;
  high: number;
  /** Where the bar starts on the log scale (Result.barLow): the low end, or for a range reaching zero
   * or harm the lowest such start among its programmes. */
  barLow?: number;
};

// One values object per overrides object, shared by every island, so results cache and settle by
// identity: islands that hydrate at different times (each first seeing the empty server snapshot,
// then the stored overrides) get the same object for the same overrides.
const values = new WeakMap<object, Record<string, number>>();

const EMPTY = {};

function valuesOf(overrides: object): Record<string, number> {
  // No overrides is one object, so the default values are worked out, and their rankings kept, once.
  if (!Object.keys(overrides).length) overrides = EMPTY;
  let av = values.get(overrides);
  if (!av) values.set(overrides, (av = assumptionValues(lib.assumptions, overrides as Record<string, number>)));
  return av;
}

export function useAssumptionValues() {
  const overrides = useOverrides();
  return useMemo(() => valuesOf(overrides), [overrides]);
}

/** Results for any set of models, e.g. a charity's variants. */
export function useResultsFor(models: ResolvedModel[]) {
  const av = useAssumptionValues();
  return useMemo(
    () => models.map((m) => ({ model: m, central: headline(lib, m, av) })).sort((a, b) => b.central - a.central),
    [av, models],
  );
}

/** Result.barLow for a model's range, from its stored simulation (scaled as its high end is). */
function barLowOf(m: ResolvedModel, range: { low: number; high: number }): number | undefined {
  if (range.low > 0) return range.low;
  const q = lib.distributions?.[m.id]?.q;
  const top = q?.[q.length - 1];
  const first = q?.find((x) => x > 0);
  return q && top! > 0 && first !== undefined && range.high > 0 ? (range.high * first) / top! : undefined;
}

const extraFlags = (m: ResolvedModel) => [coverageFlag(lib, m), unstableFlag(lib, m), nextDollarFlag(lib, m)].filter((f) => !!f);

/** A model as the rankings show it: its headline, the simulated 5% to 95% stored at build time
 * (generated/distributions.json) scaled to it, and the flags from the figures stored beside it. Cheap
 * enough to work out for every model at every change: the one-at-a-time sensitivity, which costs seconds
 * for the whole rankings (most in models that read others live), is left to a model's own page. */
const ranked = new Map<ResolvedModel, { av: Record<string, number>; r: Result }>();
function rankedOf(m: ResolvedModel, av: Record<string, number>): Result {
  const hit = ranked.get(m);
  if (hit?.av === av) return hit.r;
  const central = headline(lib, m, av);
  const d = lib.distributions?.[m.id];
  // An unstable simulation's range is every input at its worst and best end, stored at build time.
  const joint = d?.joint ? [central * d.joint[0], central * d.joint[1]] : [central, central];
  const range = plausibleRange(lib, m, central, av) ?? { low: Math.min(...joint), high: Math.max(...joint) };
  const stored = { central, jointLow: range.low, jointHigh: range.high, judgmentShare: d?.judgment ?? 0, pointInputs: Array.from({ length: d?.points ?? 0 }, () => "") } as Sensitivity;
  const r: Result = { model: m, central, low: range.low, high: range.high, barLow: barLowOf(m, range), flags: [...flags(m, stored), ...extraFlags(m)] };
  ranked.set(m, { av, r });
  return r;
}

/** A model's full result, sensitivity included: for its own page. */
const full = new Map<ResolvedModel, { av: Record<string, number>; r: Result }>();
function fullOf(m: ResolvedModel, av: Record<string, number>): Result {
  const hit = full.get(m);
  if (hit?.av === av) return hit.r;
  const s = sensitivity(lib, m, av);
  // The plausible range is the model's simulated 5% to 95% (src/engine/montecarlo.ts), where it has one;
  // otherwise every ranged input at its end together.
  const range = plausibleRange(lib, m, s.central, av) ?? { low: s.jointLow, high: s.jointHigh };
  const r: Result = { model: m, central: s.central, low: range.low, high: range.high, barLow: barLowOf(m, range), s, flags: [...flags(m, { ...s, jointLow: range.low, jointHigh: range.high }), ...extraFlags(m)] };
  full.set(m, { av, r });
  return r;
}

/** The full result for one model, including variants that aren't on the rankings. While a slider moves
 * it is the rankings' quick result; the sensitivity follows once the values settle (SETTLE ms), in its
 * own task, so the slider never waits for it. */
const SETTLE = 250;
export function useResultFor(m: ResolvedModel): Result {
  const av = useAssumptionValues();
  const settled = useSettled(av);
  const [r, setR] = useState(() => fullOf(m, av));
  useEffect(() => {
    const t = setTimeout(() => setR(settled ? fullOf(m, av) : rankedOf(m, av)));
    return () => clearTimeout(t);
  }, [m, av, settled]);
  // Another model in the same island: its own result at once, not the last model's.
  return r.model === m ? r : fullOf(m, av);
}

/** Whether the values have stopped changing for SETTLE ms: one timer for the page, every island re-rendered. */
let settledAv: Record<string, number> | undefined;
let timer: ReturnType<typeof setTimeout> | undefined;
const settleListeners = new Set<() => void>();
function useSettled(av: Record<string, number>): boolean {
  const [, tick] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    settleListeners.add(tick);
    return () => void settleListeners.delete(tick);
  }, []);
  useEffect(() => {
    if (settledAv === av) return;
    clearTimeout(timer);
    timer = setTimeout(() => { settledAv = av; settleListeners.forEach((l) => l()); }, SETTLE);
  }, [av]);
  // The first values on a page are settled: they are the ones it loaded with.
  if (settledAv === undefined) settledAv = av;
  return settledAv === av;
}

// Every island on a page (the rankings, a charity page's headline) asks for the same rankings: one
// shared computation per change. It runs in slices of a few milliseconds between frames, so a slider
// moves at once and the rankings follow; a newer value abandons an older run (the per-model cache keeps
// what it finished). Islands show the last finished rankings meanwhile.
type Rankings = ReturnType<typeof computeResults>;
let shown: { av: object; value: Rankings } | undefined;
let running: { av: object } | undefined;
let run = 0;
const rankingListeners = new Set<() => void>();
const SLICE = 8;

/** The next task, without setTimeout's 4 ms floor. */
const nextTask = (() => {
  if (typeof MessageChannel === "undefined") return (f: () => void) => setTimeout(f);
  const queue: (() => void)[] = [];
  const ch = new MessageChannel();
  ch.port1.onmessage = () => queue.shift()?.();
  return (f: () => void) => { queue.push(f); ch.port2.postMessage(0); };
})();

/** While a run is on, <html data-updating>: global.css draws a thin line along the top of the screen. */
function busy(on: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.toggleAttribute("data-updating", on);
}

function publish(av: object, value: Rankings) {
  shown = { av, value };
  running = undefined;
  busy(false);
  rankingListeners.forEach((l) => l());
}

function schedule(av: Record<string, number>) {
  if (shown?.av === av || running?.av === av) return;
  const id = ++run;
  if (initial && av === valuesOf(EMPTY)) return publish(av, initial);
  running = { av };
  busy(true);
  const steps = computeSteps(av, rankedOf);
  const slice = () => {
    if (id !== run) return;
    const start = performance.now();
    for (let next = steps.next(); ; next = steps.next()) {
      if (next.done) return publish(av, next.value);
      if (performance.now() - start > SLICE) return nextTask(slice);
    }
  };
  nextTask(slice);
}

// The server renders, and the page hydrates, at the default values; the stored values follow from a run.
let initial: Rankings | undefined;
const atDefaults = () => (initial ??= computeResults(valuesOf(EMPTY), rankedOf));

/** Runs follow the values from outside React, one per change; islands re-render only when a run
 * finishes, never on the slider tick itself. */
let watching = false;
function watch() {
  if (watching || typeof window === "undefined") return;
  watching = true;
  const changed = () => schedule(valuesOf(getOverrides()));
  subscribeOverrides(changed);
  changed();
}

const subscribeRankings = (l: () => void) => {
  rankingListeners.add(l);
  return () => void rankingListeners.delete(l);
};

export function useResults(): Rankings {
  useEffect(watch, []);
  return useSyncExternalStore(subscribeRankings, () => shown?.value ?? atDefaults(), atDefaults);
}

const plans = new Map(rankedCharities.map((c) => [c.id, rankingPlan(lib, c.id)]));

/** A charity's figure for one evaluator at any values, by the same plan and combination as the rankings
 * (programs by weight, locations by funding; old estimates included, as on its pages), from each model's
 * headline only: for the notes under a page's headline, which compare the figure with one slider at its
 * neutral setting. */
export function figureOf(charity: string, owner: string, av: Record<string, number>): number {
  const c = lib.charities.get(charity);
  const plan = plans.get(charity)?.find((e) => e.owner === owner);
  if (!c || !plan) return NaN;
  const point = (m: ResolvedModel) => { const v = headline(lib, m, av); return { central: v, low: v, high: v }; };
  return combine(plan.parts.map((p) => {
    const family = locationsOf(lib, p.model);
    const declared = declaredLocations(c, family);
    if (declared) return { ...combineLocations(declared, point), weight: p.weight };
    const weights = locationWeights(lib, family);
    if (!weights) return { ...point(p.model), weight: p.weight };
    return { ...combine(family.map((x, i) => ({ ...point(x), weight: weights[i] }))), weight: p.weight };
  })).central;
}

type ResultFn = (m: ResolvedModel, av: Record<string, number>) => Result;

function programResult(c: Charity, program: string, m: ResolvedModel, weight: number | undefined, av: Record<string, number>, resultOf: ResultFn): ProgramResult {
  const result = resultOf(m, av);
  const family = locationsOf(lib, m);
  const declared = declaredLocations(c, family);
  if (declared) {
    const { central, low, high } = combineLocations(declared, (x) => (x === m ? result : resultOf(x, av)));
    return { program, result, central, low, high, weight, locations: family.length, locationBasis: "weighted" };
  }
  const weights = locationWeights(lib, family);
  if (!weights) return { program, result, central: result.central, low: result.low, high: result.high, weight, locations: family.length, locationBasis: "single" };
  const { central, low, high } = combine(family.map((x, i) => ({ ...(i ? resultOf(x, av) : result), weight: weights[i] })));
  return { program, result, central, low, high, weight, locations: family.length, locationBasis: "weighted" };
}

function evaluatorResult(owner: string, programs: ProgramResult[]): EvaluatorResult {
  const flags = [...new Map(programs.flatMap((p) => p.result.flags).map((f) => [f.short, f])).values()];
  return { owner, ...combine(programs), programs, flags, theoretical: programs.every((p) => !!p.result.model.theoretical) };
}

function computeResults(av: Record<string, number>, resultOf: ResultFn) {
  const steps = computeSteps(av, resultOf);
  for (;;) {
    const next = steps.next();
    if (next.done) return next.value;
  }
}

/** The rankings one charity at a time: a step per charity, so the work can pause between them. */
function* computeSteps(av: Record<string, number>, resultOf: ResultFn) {
  // A charity's own pages show every programme, old estimates included; only the rankings leave them out.
  const pages = new Map<string, EvaluatorResult[]>();
  const results: CharityResult[] = [];
  for (const row of rankedCharities.map((c) => () => charityResult(c, av, resultOf, pages))) {
    results.push(...row());
    yield;
  }
  results.sort((a, b) => b.central - a.central);
  return { av, results, pages };
}

function charityResult(c: Charity, av: Record<string, number>, resultOf: ResultFn, pages: Map<string, EvaluatorResult[]>): CharityResult[] {
  {
    const all = (plans.get(c.id) ?? []).map(({ owner, parts }) =>
      evaluatorResult(owner, parts.map((p) => programResult(c, p.program, p.model, p.weight, av, resultOf))));
    pages.set(c.id, all);
    const evaluators = all.flatMap((e) => {
      const programs = e.programs.filter((p) => ranks(lib, p.result.model, av));
      if (!programs.length) return [];
      return [programs.length === e.programs.length ? e : evaluatorResult(e.owner, programs)];
    });
    if (!evaluators.length) return [];
    const lead = evaluators.find((e) => e.owner === primaryOf(lib, c.id)?.owner) ?? evaluators[0];
    return [{
      charity: c,
      evaluators,
      primary: lead.owner,
      central: lead.central,
      low: Math.min(...evaluators.map((r) => r.low)),
      high: Math.max(...evaluators.map((r) => r.high)),
      barLow: (() => {
        const low = Math.min(...evaluators.map((r) => r.low));
        if (low > 0) return low;
        const starts = evaluators.flatMap((e) => e.programs.map((p) => p.result.barLow)).filter((x): x is number => x !== undefined && x > 0);
        return starts.length ? Math.min(...starts) : undefined;
      })(),
    }];
  }
}

/** One evaluator's figure for a charity as its own pages show it: every programme, old estimates
 * included (the rankings may leave some out, `$ignore_old_estimates`). */
export function pageEvaluator(pages: Map<string, EvaluatorResult[]>, charity: string, owner: string) {
  return pages.get(charity)?.find((e) => e.owner === owner);
}
