// Figures the way the site makes them (src/lib/use-results.ts, which is tied to the pages' React state):
// a model's headline and plausible range, and a charity's figure as the rankings show it: each
// evaluator's programmes over their locations, by funding, and the charity's primary evaluator's
// figure as its number.
import { headline, plausibleRange, ranks, unstableFlag, type Library, type ResolvedModel } from "../../src/engine/model";
import { combine, combineLocations, coverageFlag, declaredLocations, locationsOf, locationWeights, nextDollarFlag, primaryModel, rankingPlan, type Basis, type EvaluatorPlan } from "../../src/engine/ranking";
import { sensitivity, THEORETICAL_TEXT } from "../../src/engine/sensitivity";
import type { Charity } from "../../src/engine/schema";

export type Figure = { central: number; low: number; high: number };

/** A model's headline (years of healthy life per $1,000, or its own unit per dollar where that doesn't
 * convert) and plausible range: the simulated 5% to 95% where the model has a simulation, else every
 * ranged input at its end together, as the site does. */
export function modelFigure(lib: Library, m: ResolvedModel, av: Record<string, number>): Figure {
  const central = headline(lib, m, av);
  const range = plausibleRange(lib, m, central, av);
  if (range) return { central, ...range };
  const s = sensitivity(lib, m, av);
  return { central, low: Math.min(s.jointLow, s.jointHigh), high: Math.max(s.jointLow, s.jointHigh) };
}

/** The short caveats the rankings show beside a model, those that need no sensitivity run. */
export function cheapFlags(lib: Library, m: ResolvedModel): string[] {
  return [
    m.theoretical ? THEORETICAL_TEXT : undefined,
    coverageFlag(lib, m)?.text,
    unstableFlag(lib, m)?.text,
    nextDollarFlag(lib, m)?.text,
  ].filter((x): x is string => !!x);
}

export type ProgrammeFigure = Figure & { programme: string; model: ResolvedModel; weight?: number; locations: number };
export type EvaluatorFigure = Figure & { owner: string; basis: Basis; programmes: ProgrammeFigure[] };
export type CharityFigure = Figure & {
  charity: Charity;
  /** The evaluator whose figure is the charity's number (the one its page leads with). */
  primary: string;
  evaluators: EvaluatorFigure[];
};

const plans = new WeakMap<Library, Map<string, EvaluatorPlan[]>>();
function plansOf(lib: Library, charity: string): EvaluatorPlan[] {
  let cache = plans.get(lib);
  if (!cache) plans.set(lib, (cache = new Map()));
  if (!cache.has(charity)) cache.set(charity, rankingPlan(lib, charity));
  return cache.get(charity)!;
}

function programmeFigure(lib: Library, c: Charity, programme: string, m: ResolvedModel, weight: number | undefined, fig: (m: ResolvedModel) => Figure): ProgrammeFigure {
  const family = locationsOf(lib, m);
  const declared = declaredLocations(c, family);
  if (declared) return { ...combineLocations(declared, fig), programme, model: m, weight, locations: family.length };
  const weights = locationWeights(lib, family);
  if (!weights) return { ...fig(m), programme, model: m, weight, locations: family.length };
  return { ...combine(family.map((x, i) => ({ ...fig(x), weight: weights[i] }))), programme, model: m, weight, locations: family.length };
}

function evaluatorFigure(owner: string, programmes: ProgrammeFigure[]): EvaluatorFigure {
  const { central, low, high, basis } = combine(programmes);
  return { owner, central, low, high, basis, programmes };
}

/** A charity's figure at values `av`. `rankings`: as the rankings count it, old estimates left out where
 * the reader leaves them out (`$ignore_old_estimates`); otherwise as its own page shows it, every
 * programme counted. Undefined for a charity off the rankings (or with nothing left at these values). */
export function charityFigure(lib: Library, charity: string, av: Record<string, number>, rankings = true): CharityFigure | undefined {
  const c = lib.charities.get(charity);
  if (!c) return undefined;
  const memo = new Map<ResolvedModel, Figure>();
  const fig = (m: ResolvedModel) => memo.get(m) ?? memo.set(m, modelFigure(lib, m, av)).get(m)!;
  const evaluators = plansOf(lib, charity).flatMap(({ owner, parts }) => {
    const kept = rankings ? parts.filter((p) => ranks(lib, p.model, av)) : parts;
    return kept.length ? [evaluatorFigure(owner, kept.map((p) => programmeFigure(lib, c, p.program, p.model, p.weight, fig)))] : [];
  });
  if (!evaluators.length) return undefined;
  const lead = evaluators.find((e) => e.owner === primaryModel(lib, charity)?.owner) ?? evaluators[0];
  // The primary evaluator's figure, with the range across every evaluator kept, as the rankings show it
  // (computeResults in src/lib/use-results.ts).
  return {
    charity: c, primary: lead.owner, central: lead.central,
    low: Math.min(...evaluators.map((e) => e.low)), high: Math.max(...evaluators.map((e) => e.high)), evaluators,
  };
}

/** Every charity on the rankings at values `av`, best first (the homepage's order). */
export function rankings(lib: Library, av: Record<string, number>): CharityFigure[] {
  return [...lib.charities.keys()]
    .flatMap((id) => { const f = charityFigure(lib, id, av); return f && Number.isFinite(f.central) ? [f] : []; })
    .sort((a, b) => b.central - a.central);
}

