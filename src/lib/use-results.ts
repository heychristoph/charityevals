import { useEffect, useMemo, useReducer, useState, useSyncExternalStore } from "react";
import { lib, rankedCharities } from "./data";
import { assumptionValues, headline, type ResolvedModel } from "../engine/model";
import type { Charity } from "../engine/schema";
import { sensitivity, type Sensitivity, type Flag } from "../engine/sensitivity";
import { barLow, charityFigure, judgmentShare, modelFigure, modelFlags, modelRange, type CharityFigure, type EvaluatorFigure, type ModelFigure, type ProgrammeFigure } from "../engine/figures";
import { getOverrides, subscribeOverrides, useOverrides } from "./assumption-state";

/** A model as the site shows it (src/engine/figures.ts modelFigure): headline, range and caveats, in years
 * of healthy life per $1,000 (a model in a unit that doesn't convert: its own unit per dollar). On a model's
 * own page also its one-at-a-time sensitivity. */
export type Result = ModelFigure & { s?: Sensitivity };

/** One program's figure within an evaluator's: its model, or the model's locations combined. */
export type ProgramResult = ProgrammeFigure<Result>;

/** One evaluator's dot on a charity's line (src/engine/ranking.ts says which models count). */
export type EvaluatorResult = EvaluatorFigure<Result> & {
  flags: Flag[];
  /** Every program's model is purely theoretical (an idea's estimate from before the charity existed). */
  theoretical: boolean;
};

/** A charity on the rankings: one figure per evaluator, and where the row sits. */
export type CharityResult = Omit<CharityFigure<Result>, "evaluators"> & { evaluators: EvaluatorResult[] };

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

/** A model as the rankings show it: cheap enough to work out for every model at every change (the
 * one-at-a-time sensitivity, seconds for the whole rankings, is left to a model's own page). */
const ranked = new Map<ResolvedModel, { av: Record<string, number>; r: Result }>();
function rankedOf(m: ResolvedModel, av: Record<string, number>): Result {
  const hit = ranked.get(m);
  if (hit?.av === av) return hit.r;
  const r = modelFigure(lib, m, av);
  ranked.set(m, { av, r });
  return r;
}

/** A model's full result, sensitivity included: for its own page. The same range as the rankings; the
 * caveats' judgment share and point inputs at the reader's values. */
const full = new Map<ResolvedModel, { av: Record<string, number>; r: Result }>();
function fullOf(m: ResolvedModel, av: Record<string, number>): Result {
  const hit = full.get(m);
  if (hit?.av === av) return hit.r;
  const s = sensitivity(lib, m, av);
  const range = modelRange(lib, m, s.central, av, { low: s.jointLow, high: s.jointHigh });
  const r: Result = { model: m, central: s.central, ...range, barLow: barLow(lib, m, range), s, flags: modelFlags(lib, m, range, { judgment: judgmentShare(lib, m, av), points: s.pointInputs.length }) };
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
  // The reader's own values are on screen: what waited for them shows (Base.astro, html.awaiting-values).
  // After the islands' re-render and effects (Headline writes into the page), not before.
  if (typeof document !== "undefined" && av === valuesOf(getOverrides())) setTimeout(() => document.documentElement.classList.remove("awaiting-values"), 50);
}

function schedule(av: Record<string, number>) {
  if (running?.av === av) return;
  if (shown?.av === av) {
    // Back to the values on screen before a run for others finished: that run is abandoned.
    if (running) {
      run++;
      running = undefined;
      busy(false);
    }
    return;
  }
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

type ResultFn = (m: ResolvedModel, av: Record<string, number>) => Result;

/** An evaluator's figure with the caveats of its programmes' models. */
function withFlags(e: EvaluatorFigure<Result>): EvaluatorResult {
  const flags = [...new Map(e.programs.flatMap((p) => p.result.flags).map((f) => [f.short, f])).values()];
  return { ...e, flags, theoretical: e.programs.every((p) => !!p.result.model.theoretical) };
}

/** The rankings and pages' figures at values `av`, worked out at once: what the islands show once a run
 * finishes (for tests that compare the site with the other surfaces). */
export const rankingsAt = (av: Record<string, number>) => computeResults(av, rankedOf);

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

/** A charity's row on the rankings (src/engine/figures.ts charityFigure), and its pages' figures, every
 * programme counted (the rankings may leave some out, `$ignore_old_estimates`). */
function charityResult(c: Charity, av: Record<string, number>, resultOf: ResultFn, pages: Map<string, EvaluatorResult[]>): CharityResult[] {
  const result = (m: ResolvedModel) => resultOf(m, av);
  pages.set(c.id, (charityFigure(lib, c.id, av, result, false)?.evaluators ?? []).map(withFlags));
  const row = charityFigure(lib, c.id, av, result, true);
  return row ? [{ ...row, evaluators: row.evaluators.map(withFlags) }] : [];
}

/** One evaluator's figure for a charity as its own pages show it: every programme, old estimates
 * included (the rankings may leave some out, `$ignore_old_estimates`). */
export function pageEvaluator(pages: Map<string, EvaluatorResult[]>, charity: string, owner: string) {
  return pages.get(charity)?.find((e) => e.owner === owner);
}
