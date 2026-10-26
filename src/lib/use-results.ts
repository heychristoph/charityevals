import { useMemo } from "react";
import { lib, rankable } from "./data";
import { assumptionValues, bottomLine, type ResolvedModel, type View } from "../engine/model";
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

export function useResults() {
  const av = useAssumptionValues();
  const view = useView();
  return useMemo(() => {
    const benchModel = lib.models.get(lib.assumptions.common.benchmark)!;
    const viewOf = (m: ResolvedModel): View => (view === "evaluator" && m.evaluator ? "evaluator" : "charityevals");
    const bench = bottomLine(lib, benchModel, av, {}, viewOf(benchModel)).common;
    const results: Result[] = rankable.map((m) => {
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
    const flips = view === "evaluator" ? [] : rankFlips(lib, rankable.map((m) => m.id), av);
    return { av, bench, results, flips, view };
  }, [av, view]);
}
