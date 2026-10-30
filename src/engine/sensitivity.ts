// One-at-a-time sensitivity and joint bounds. No Monte Carlo: every input has low / best / high,
// and we report the central case, a joint low and joint high (each input at whichever end hurts
// or helps the result), and how far each input alone moves it.

import type { Kind } from "./schema";
import {
  hasRange,
  headline,
  inputRange,
  pickValue,
  usedAssumptions,
  usedFacts,
  viewAssumptions,
  type Library,
  type ResolvedModel,
  type View,
} from "./model";

export type Swing = {
  id: string;
  label: string;
  scope: "row" | "assumption" | "fact";
  kind: Kind | undefined;
  low: number;
  high: number;
  /** The headline (years of healthy life per $1,000, or the model's own unit where that doesn't
   * convert) with this input at its low and high end, all else central. */
  atLow: number;
  atHigh: number;
  /** |ln(atHigh / atLow)|: how many e-folds this input alone moves the result. */
  logSwing: number;
};

/** Everything in the headline's terms, so a factor that cancels out of it (a healthy year's value, for a
 * model counted in healthy years) never widens a range. */
export type Sensitivity = {
  central: number;
  jointLow: number;
  jointHigh: number;
  swings: Swing[];
  /** Share of total log swing that comes from judgment inputs and assumptions. */
  judgmentShare: number;
  /** Inputs on the result's path that have only a point value. */
  pointInputs: string[];
};

/** `edits`: the reader's own numbers (inputs by row id, facts by "@key"), held where they put them. */
export function sensitivity(lib: Library, m: ResolvedModel, av: Record<string, number>, view: View = "charityevals", edits: Record<string, number> = {}): Sensitivity {
  const line = (a: Record<string, number>, inputs: Record<string, number> = {}) => headline(lib, m, a, { ...edits, ...inputs }, view);
  const central = line(av);
  const swings: Swing[] = [];
  // Central values of assumptions in this view (the evaluator view pins some).
  const pinned = viewAssumptions(m, av, view);

  const relevant = rowsFeeding(m);
  const pointInputs: string[] = [];
  for (const r of m.rows) {
    if (!relevant.has(r.id) || r.id in edits) continue;
    // In the evaluator view a calculated row carrying the evaluator's own number is an input.
    if (r.node && !(view === "evaluator" && r.published !== undefined)) {
      // A calculated row with a published range is varied as a whole.
      if (r.range) {
        swings.push(swing(r.id, r.label, "row", "estimate", r.range.low, r.range.high,
          line(av, { [r.id]: r.range.low }), line(av, { [r.id]: r.range.high })));
      }
      continue;
    }
    const range = inputRange(r, view);
    if (!hasRange(range)) { pointInputs.push(r.id); continue; }
    const low = pickValue(range, "low");
    const high = pickValue(range, "high");
    swings.push(swing(r.id, r.label, "row", r.kind, low, high, line(av, { [r.id]: low }), line(av, { [r.id]: high })));
  }
  for (const key of usedFacts(m)) {
    const f = lib.facts.get(key);
    if (!f || !hasRange(f.value) || `@${key}` in edits) continue;
    const low = pickValue(f.value, "low");
    const high = pickValue(f.value, "high");
    swings.push(swing(`@${key}`, `${f.label} (${f.group})`, "fact", f.kind, low, high, line(av, { [`@${key}`]: low }), line(av, { [`@${key}`]: high })));
  }
  for (const id of usedAssumptions(lib, m, view)) {
    const a = lib.assumptions.rows.find((x) => x.id === id);
    if (!a || !hasRange(a.value)) continue;
    // A value outside the default range widens it rather than being ignored. In the evaluator
    // view a pinned assumption swings over the same range; the pin only moves its centre.
    const low = Math.min(pickValue(a.value, "low"), pinned[id]);
    const high = Math.max(pickValue(a.value, "high"), pinned[id]);
    const at = (v: number) => (view === "evaluator" && m.evaluator?.assumptions[id] !== undefined
      ? headline(lib, { ...m, evaluator: { ...m.evaluator, assumptions: { ...m.evaluator.assumptions, [id]: v } } }, av, edits, view)
      : line({ ...av, [id]: v }));
    swings.push(swing(id, a.label, "assumption", a.kind, low, high, at(low), at(high)));
  }
  swings.sort((a, b) => b.logSwing - a.logSwing);

  const joint = (wantHigh: boolean) => {
    const inputs: Record<string, number> = { ...edits };
    const a = { ...av };
    const pins = { ...(m.evaluator?.assumptions ?? {}) };
    for (const s of swings) {
      const v = (s.atHigh >= s.atLow) === wantHigh ? s.high : s.low;
      if (s.scope === "assumption") {
        if (view === "evaluator" && pins[s.id] !== undefined) pins[s.id] = v;
        else a[s.id] = v;
      } else inputs[s.id] = v;
    }
    const mm = view === "evaluator" && m.evaluator ? { ...m, evaluator: { ...m.evaluator, assumptions: pins } } : m;
    return headline(lib, mm, a, inputs, view);
  };

  const total = swings.reduce((t, s) => t + s.logSwing, 0);
  const judgment = swings
    .filter((s) => s.kind === "judgment" || s.scope === "assumption")
    .reduce((t, s) => t + s.logSwing, 0);

  return {
    central,
    jointLow: joint(false),
    jointHigh: joint(true),
    swings: swings.filter((s) => s.logSwing > 1e-9),
    judgmentShare: total > 0 ? judgment / total : 0,
    pointInputs,
  };
}

function swing(id: string, label: string, scope: Swing["scope"], kind: Kind | undefined, low: number, high: number, atLow: number, atHigh: number): Swing {
  const logSwing = atLow > 0 && atHigh > 0 ? Math.abs(Math.log(atHigh / atLow)) : Math.abs(atHigh - atLow) > 0 ? Infinity : 0;
  return { id, label, scope, kind, low, high, atLow, atHigh, logSwing };
}

/** Rows the bottom line actually depends on. */
export function rowsFeeding(m: ResolvedModel): Set<string> {
  const seen = new Set<string>();
  const walk = (id: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    m.byId.get(id)?.deps.forEach(walk);
  };
  if (m.output) walk(m.output.row);
  return seen;
}

export type Flag = { level: "warn" | "info"; short: string; text: string };

const STALE_MONTHS = 18;

/** One significant figure: a caveat states a size, not a measurement. */
const roughly = (x: number) => Number(x.toPrecision(1)).toLocaleString("en-US");

export function flags(m: ResolvedModel, s: Sensitivity, today = new Date()): Flag[] {
  const out: Flag[] = [];
  const spread = s.jointHigh / s.jointLow;
  if (spread > 100) out.push({ level: "warn", short: "wide range", text: `The plausible range spans about ${roughly(spread)}×` });
  if (s.judgmentShare > 0.5) out.push({ level: "warn", short: "mostly judgment", text: `About ${Math.round(s.judgmentShare * 10) * 10}% of the uncertainty comes from judgment calls and shared assumptions` });
  if (s.pointInputs.length) out.push({ level: "info", short: "point inputs", text: `${s.pointInputs.length} inputs on the result's path have no published range, so this range leaves them out` });
  const published = m.source?.published ? new Date(m.source.published) : undefined;
  if (published) {
    const months = (today.getFullYear() - published.getFullYear()) * 12 + today.getMonth() - published.getMonth();
    const age = months < 36 ? `about ${Math.round(months / 12 * 2) / 2} years` : `about ${Math.round(months / 12)} years`;
    if (months > STALE_MONTHS) out.push({ level: "warn", short: "stale source", text: `The source analysis is ${age} old` });
  }
  return out;
}
