import { useMemo } from "react";
import { lib, ranked } from "./data";
import { assumptionValues, bottomLine, comparable, type ResolvedModel, type View } from "../engine/model";
import { sensitivity, flags, rankFlips, type Sensitivity, type Flag } from "../engine/sensitivity";
import { useOverrides, useView } from "./assumption-state";

export type Result = {
  model: ResolvedModel;
  native: number;
  /** Everything below is a multiple of the benchmark's central value under the same assumptions. */
  central: number;
  low: number;
  high: number;
  s: Sensitivity;
  flags: Flag[];
  /** The view this result was computed in: a model without an evaluator falls back to ours. */
  view: View;
};

export function useAssumptionValues() {
  const overrides = useOverrides();
  return useMemo(() => assumptionValues(lib.assumptions, overrides), [overrides]);
}

/** Results for any set of models, e.g. a charity's variants. */
export function useResultsFor(models: ResolvedModel[]) {
  const av = useAssumptionValues();
  const view = useView();
  return useMemo(() => {
    const benchModel = lib.models.get(lib.assumptions.common.benchmark)!;
    const viewOf = (m: ResolvedModel): View => (view === "evaluator" && m.evaluator ? "evaluator" : "charityevals");
    const bench = bottomLine(lib, benchModel, av, {}, viewOf(benchModel)).common;
    return models.map((m) => ({ model: m, central: bottomLine(lib, m, av, {}, viewOf(m)).common / bench })).sort((a, b) => b.central - a.central);
  }, [av, view, models]);
}

function resultOf(m: ResolvedModel, av: Record<string, number>, view: View): Result {
  const benchModel = lib.models.get(lib.assumptions.common.benchmark)!;
  const viewOf = (x: ResolvedModel): View => (view === "evaluator" && x.evaluator ? "evaluator" : "charityevals");
  // Unconvertible units stay in their own unit: no division by the benchmark.
  const bench = comparable(lib, m) ? bottomLine(lib, benchModel, av, {}, viewOf(benchModel)).common : 1;
  const v = viewOf(m);
  const s = sensitivity(lib, m, av, v);
  return { model: m, view: v, native: bottomLine(lib, m, av, {}, v).native, central: s.central / bench, low: s.jointLow / bench, high: s.jointHigh / bench, s, flags: flags(m, s) };
}

/** The full result for one model, including variants that aren't on the rankings. */
export function useResultFor(m: ResolvedModel): Result {
  const av = useAssumptionValues();
  const view = useView();
  return useMemo(() => resultOf(m, av, view), [m, av, view]);
}

export function useResults() {
  const av = useAssumptionValues();
  const view = useView();
  return useMemo(() => {
    const benchModel = lib.models.get(lib.assumptions.common.benchmark)!;
    const viewOf = (m: ResolvedModel): View => (view === "evaluator" && m.evaluator ? "evaluator" : "charityevals");
    const bench = bottomLine(lib, benchModel, av, {}, viewOf(benchModel)).common;
    const results: Result[] = ranked.map((m) => {
      const v = viewOf(m);
      const s = sensitivity(lib, m, av, v);
      return {
        model: m,
        view: v,
        native: bottomLine(lib, m, av, {}, v).native,
        central: s.central / bench,
        low: s.jointLow / bench,
        high: s.jointHigh / bench,
        s,
        flags: flags(m, s),
      };
    });
    results.sort((a, b) => b.central - a.central);
    const flips = view === "evaluator" ? [] : rankFlips(lib, ranked.map((m) => m.id), av);
    return { av, bench, results, flips, view };
  }, [av, view]);
}
