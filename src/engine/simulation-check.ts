// A model's Monte Carlo checked before it is published (docs/normalization.md 2.18), importable: the
// simulated shape (5%, 50%, 95% as multiples of the best guess), whether it is unstable, for a model with
// single-event chances the share of misses and the average beside the smooth one, and the inputs that,
// alone at an end of their range, flip the result's sign or move it more than tenfold (the usual causes of
// an unstable simulation: a calendar year drawn, a remainder of large figures, a net near zero in a
// denominator). scripts/simulation-check.ts prints it; scripts/preflight.ts gates on it.
import { assumptionValues, compute, headline, RISK_OFF, RISK_QUANTILE, type Library, type ResolvedModel } from "./model";
import { simulate } from "./montecarlo";
import { uncertainty } from "./uncertainty";

export type SimulationCheck = {
  /** No simulation: no comparable result or no uncertain input. */
  none?: boolean;
  shape?: { q5: number; q50: number; q95: number };
  unstable: boolean;
  /** Single events that never happen, or draws that are broken. */
  brokenEvents: boolean;
  events?: { count: number; misses: number; mean: number; smooth?: number };
  /** Inputs that alone flip the result or move it tenfold: `@fact` or row id, its range, the ratios. */
  wild: { key: string; low: number; high: number; atLow: number; atHigh: number }[];
};

export function simulationCheck(lib: Library, m: ResolvedModel, draws = 2000): SimulationCheck {
  const d = simulate(lib, m, draws);
  if (!d) return { none: true, unstable: false, brokenEvents: false, wild: [] };
  const mid = d.middle ?? d.q[9];
  const out: SimulationCheck = { shape: { q5: d.q[0] / mid, q50: d.q[9] / mid, q95: d.q[18] / mid }, unstable: !!d.unstable, brokenEvents: false, wild: [] };
  const events = m.rows.filter((r) => r.single_event);
  if (events.length) {
    const saved = events.map((r) => r.single_event);
    events.forEach((r) => ((r as { single_event?: unknown }).single_event = undefined));
    const s = simulate(lib, m, draws);
    events.forEach((r, i) => ((r as { single_event?: unknown }).single_event = saved[i]));
    // A net harm (negative best guess, q stored with the largest multiple first) counts every draw at
    // zero or below in `zero`, misses and harms alike, so `zero` is 1 whether or not the events happen:
    // its misses are the draws at about nothing, read from the quantiles.
    const harm = d.q[0] > d.q[d.q.length - 1];
    const misses = harm ? d.q.filter((x) => Math.abs(x) <= 1e-6).length / d.q.length : d.zero;
    out.events = { count: events.length, misses, mean: d.mean, smooth: s?.mean };
    out.brokenEvents = harm ? misses >= 0.999 : d.zero >= 0.999 || (d.zero === 0 && d.q[0] / mid < 1e-3);
  }
  // One input at a time at each end of its range.
  const av = { ...assumptionValues(lib.assumptions), [RISK_QUANTILE]: RISK_OFF };
  const c = headline(lib, m, av);
  const values = compute(lib, m, av);
  const u = uncertainty(lib, m, values, av, "charityevals");
  for (const x of u.drivers) {
    if (x.source === "assumption") continue;
    const key = x.scope === "fact" ? `@${x.id}` : x.id;
    const lo = headline(lib, m, av, { [key]: x.low }) / c, hi = headline(lib, m, av, { [key]: x.high }) / c;
    if ([lo, hi].some((r) => !(r > 0.1 && r < 10))) out.wild.push({ key, low: x.low, high: x.high, atLow: lo, atHigh: hi });
  }
  return out;
}
