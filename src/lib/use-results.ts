import { useMemo } from "react";
import { lib, primaryOf, rankedCharities } from "./data";
import { assumptionValues, bottomLine, headline, tooOld, type ResolvedModel } from "../engine/model";
import { combine, combineLocations, declaredLocations, locationsOf, locationWeights, rankingPlan, type Basis } from "../engine/ranking";
import type { Charity } from "../engine/schema";
import { sensitivity, flags, type Sensitivity, type Flag } from "../engine/sensitivity";
import { useOverrides } from "./assumption-state";

export type Result = {
  model: ResolvedModel;
  native: number;
  /** Everything below is in years of healthy life per $1,000 (a model in a unit that doesn't convert:
   * its own unit per dollar), under the same assumptions. */
  central: number;
  low: number;
  high: number;
  s: Sensitivity;
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
};

export function useAssumptionValues() {
  const overrides = useOverrides();
  return useMemo(() => assumptionValues(lib.assumptions, overrides), [overrides]);
}

/** Results for any set of models, e.g. a charity's variants. */
export function useResultsFor(models: ResolvedModel[]) {
  const av = useAssumptionValues();
  return useMemo(
    () => models.map((m) => ({ model: m, central: headline(lib, m, av) })).sort((a, b) => b.central - a.central),
    [av, models],
  );
}

function resultOf(m: ResolvedModel, av: Record<string, number>): Result {
  const s = sensitivity(lib, m, av);
  return { model: m, native: bottomLine(lib, m, av).native, central: s.central, low: s.jointLow, high: s.jointHigh, s, flags: flags(m, s) };
}

/** The full result for one model, including variants that aren't on the rankings. */
export function useResultFor(m: ResolvedModel): Result {
  const av = useAssumptionValues();
  return useMemo(() => resultOf(m, av), [m, av]);
}

// Every island on a page (the rankings, the side panel's mini ranking, a model page's rank) asks for
// the same rankings. They are a pure function of the shared overrides, so the last one computed is
// kept here and reused: one computation per change instead of one per island.
let shared: { overrides: object; value: ReturnType<typeof computeResults> } | undefined;

export function useResults() {
  const overrides = useOverrides();
  const av = useAssumptionValues();
  return useMemo(() => {
    if (shared?.overrides === overrides) return shared.value;
    const value = computeResults(av);
    shared = { overrides, value };
    return value;
  }, [overrides, av]);
}

const plans = new Map(rankedCharities.map((c) => [c.id, rankingPlan(lib, c.id)]));

/** A charity's plan at values `av`: with old estimates left out (`$ignore_old_estimates`), each
 * evaluator keeps only its recent programs' models, and an evaluator with none left drops out. */
function planAt(charity: string, av: Record<string, number>) {
  return (plans.get(charity) ?? [])
    .map((e) => ({ ...e, parts: e.parts.filter((p) => !tooOld(lib, p.model, av)) }))
    .filter((e) => e.parts.length > 0);
}

/** A charity's figure for one evaluator at any values, by the same plan and combination as the rankings
 * (programs by weight, locations by funding), from each model's headline only: for the notes under a
 * page's headline, which compare the figure with one slider at its neutral setting. */
export function figureOf(charity: string, owner: string, av: Record<string, number>): number {
  const c = lib.charities.get(charity);
  const plan = planAt(charity, av).find((e) => e.owner === owner);
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

function programResult(c: Charity, program: string, m: ResolvedModel, weight: number | undefined, av: Record<string, number>): ProgramResult {
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

function computeResults(av: Record<string, number>) {
  const results: CharityResult[] = rankedCharities.flatMap((c) => {
    const plan = planAt(c.id, av);
    if (!plan.length) return [];
    const evaluators = plan.map(({ owner, parts }): EvaluatorResult => {
      const programs = parts.map((p) => programResult(c, p.program, p.model, p.weight, av));
      const flags = [...new Map(programs.flatMap((p) => p.result.flags).map((f) => [f.short, f])).values()];
      return { owner, ...combine(programs), programs, flags, theoretical: programs.every((p) => !!p.result.model.theoretical) };
    });
    const lead = evaluators.find((e) => e.owner === primaryOf(lib, c.id)?.owner) ?? evaluators[0];
    return [{
      charity: c,
      evaluators,
      primary: lead.owner,
      central: lead.central,
      low: Math.min(...evaluators.map((r) => r.low)),
      high: Math.max(...evaluators.map((r) => r.high)),
    }];
  });
  results.sort((a, b) => b.central - a.central);
  return { av, results };
}
