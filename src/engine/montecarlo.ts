// A model's result as a distribution, by Monte Carlo at the site's defaults: every uncertain input (the
// uncertainty engine's drivers, the reader's own value judgments left out) drawn from its range as its
// source states it (`interval`, `shape`; a 90% log-normal by default), the model computed for each
// draw. Run at build time (scripts/summaries.ts → generated/distributions.json); the browser only scales
// the stored shape with the reader's values, so the risk slider and the ranges cost nothing to move.
import { normInv } from "./expr";
import { QUANTILES, RISK_QUANTILE, assumptionValues, compute, headline, pickValue, type Distribution, type Library, type ResolvedModel } from "./model";
import { uncertainty, type Driver } from "./uncertainty";

const Z90 = 1.6448536269514722;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 2166136261);

type Spec = { key: string; draw: (z: number) => number };

/** How to draw one input from a standard normal z: split at the best guess, so the best guess is the
 * median and an asymmetric range stays asymmetric. */
function spec(d: Driver, best: number, interval: number | undefined, shape: string | undefined, share: boolean): Spec | undefined {
  if (!Number.isFinite(best)) return undefined;
  const z = interval ? normInv((1 + interval) / 2) : Z90;
  const clip = (x: number) => (share ? Math.min(1, Math.max(0, x)) : x);
  if (!d.published) {
    // A default spread: symmetric in log space around the best guess; a negative share (an adjustment
    // added to 1) on the factor 1 + x, so it never takes away more than everything.
    const sd = (d.spread / Z90);
    if (best > -1 && best < 0) return { key: d.key, draw: (g) => (1 + best) * Math.exp(g * sd) - 1 };
    // A share strictly between 0 and 1 spreads on its odds, so it never reaches 0% or 100%.
    if (best > 0 && best < 1 && d.high <= 1) {
      const logit = Math.log(best / (1 - best));
      return { key: d.key, draw: (g) => 1 / (1 + Math.exp(-(logit + g * sd))) };
    }
    return { key: d.key, draw: (g) => clip(best * Math.exp(g * sd)) };
  }
  const { low, high } = d;
  // A share added to 1 (an adjustment of −42%, its range −72% to −19%) can't take away more than all of
  // it: drawn as the factor 1 + x, log-normal, so the factor stays positive.
  if (shape !== "normal" && low > -1 && high < 1 && low < 0 && low <= best && best <= high) {
    const lo = Math.log((1 + best) / (1 + low)) / z, hi = Math.log((1 + high) / (1 + best)) / z;
    return { key: d.key, draw: (g) => clip((1 + best) * Math.exp(g * (g < 0 ? lo : hi)) - 1) };
  }
  const normal = shape === "normal" || shape === "beta" || d.absolute || !(low > 0 && high > 0 && best > 0);
  if (normal) {
    const lo = Math.max(0, best - low) / z, hi = Math.max(0, high - best) / z;
    return { key: d.key, draw: (g) => clip(best + g * (g < 0 ? lo : hi)) };
  }
  const lo = Math.log(best / low) / z, hi = Math.log(high / best) / z;
  return { key: d.key, draw: (g) => clip(best * Math.exp(g * (g < 0 ? lo : hi))) };
}

/** What a simulation needs: the inputs to draw and the result to compare with. */
type Plan = { lib: Library; m: ResolvedModel; av: Record<string, number>; edits: Record<string, number>; central: number; specs: Spec[]; gauss: () => number };

/** A simulation's plan at assumption values `av` (default: the site's) with the reader's edits fixed:
 * an edited number is the reader's, so it isn't drawn. Undefined for a model with no comparable result or
 * no uncertain input. */
function plan(lib: Library, m: ResolvedModel, avIn?: Record<string, number>, edits: Record<string, number> = {}): Plan | undefined {
  if (!m.output) return undefined;
  // The reader's risk is applied to the result, never inside the draws.
  const av = { ...(avIn ?? assumptionValues(lib.assumptions)), [RISK_QUANTILE]: 0.5 };
  const central = headline(lib, m, av, edits);
  if (!Number.isFinite(central) || central === 0) return undefined;
  const values = compute(lib, m, av, edits);
  const u = uncertainty(lib, m, values, av, "charityevals", edits);
  // The inputs that carry 99.9% of the variance, value judgments and the reader's edits left out.
  const drivers = u.drivers
    .filter((d) => d.source !== "assumption" && !((d.scope === "fact" ? `@${d.id}` : d.id) in edits))
    .sort((a, b) => b.contribution - a.contribution);
  const total = drivers.reduce((s, d) => s + d.contribution, 0);
  const kept: Driver[] = [];
  let acc = 0;
  for (const d of drivers) {
    if (total > 0 && acc >= total * 0.999) break;
    kept.push(d);
    acc += d.contribution;
  }
  const specs: Spec[] = [];
  for (const d of kept) {
    if (d.scope === "row") {
      const r = m.byId.get(d.id);
      const best = values[d.id];
      const share = r?.format === "percent" && best >= 0 && best <= 1 && (typeof r.value !== "object" || (r.value.high ?? 1) <= 1);
      const s = spec(d, best, r?.interval, r?.shape, !!share);
      if (s) specs.push({ ...s, key: d.id });
    } else if (d.scope === "fact") {
      const f = lib.facts.get(d.id);
      const s = f && spec(d, pickValue(f.value), f.interval, f.shape, false);
      if (s) specs.push({ ...s, key: `@${d.id}` });
    }
  }
  if (!specs.length) return undefined;
  const random = rng(hash(m.id));
  const gauss = () => {
    let a = 0, b = 0;
    while (a === 0) a = random();
    while (b === 0) b = random();
    return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * b);
  };
  return { lib, m, av, edits, central, specs, gauss };
}

function drawInto(p: Plan, n: number, xs: number[]) {
  for (let i = 0; i < n; i++) {
    const inputs: Record<string, number> = { ...p.edits };
    for (const s of p.specs) inputs[s.key] = s.draw(p.gauss());
    const x = headline(p.lib, p.m, p.av, inputs) / p.central;
    if (Number.isFinite(x)) xs.push(x);
  }
}

function summarise(xs: number[], draws: number): Distribution | undefined {
  if (xs.length < draws / 2) return undefined;
  xs.sort((a, b) => a - b);
  const at = (p: number) => {
    const k = p * (xs.length - 1), i = Math.floor(k), f = k - i;
    return i + 1 < xs.length ? xs[i] * (1 - f) + xs[i + 1] * f : xs[i];
  };
  const round = (x: number) => Number(x.toPrecision(4));
  const q = QUANTILES.map((p) => round(at(p)));
  const mid = q[9], lo = q[0], hi = q[q.length - 1];
  const unstable = !(mid > 1 / 3 && mid < 3) || hi / mid > 50 || (lo > 0 ? mid / lo > 50 : lo < -mid);
  return {
    q,
    mean: round(xs.reduce((s, x) => s + x, 0) / xs.length),
    zero: round(xs.filter((x) => x <= 0).length / xs.length),
    ...(unstable ? { unstable: true } : {}),
  };
}

/** The model's result as a distribution, in our view: at the site's defaults (the build's), or at the
 * reader's values `av` with their `edits` fixed. Seeded by model id, so the same values give the same
 * shape. Undefined for a model with no comparable result or no uncertain input. */
export function simulate(lib: Library, m: ResolvedModel, draws = 1000, av?: Record<string, number>, edits: Record<string, number> = {}): Distribution | undefined {
  const p = plan(lib, m, av, edits);
  if (!p) return undefined;
  const xs: number[] = [];
  drawInto(p, draws, xs);
  return summarise(xs, draws);
}

/** The same, in batches that give the page back between them (a model page re-simulating after the
 * reader's edits): resolves undefined once `cancelled()` turns true. */
export async function simulateInSteps(lib: Library, m: ResolvedModel, av: Record<string, number>, edits: Record<string, number>, cancelled: () => boolean, draws = 1000): Promise<Distribution | undefined> {
  const p = plan(lib, m, av, edits);
  if (!p) return undefined;
  const xs: number[] = [];
  const batch = 50;
  for (let done = 0; done < draws; done += batch) {
    if (cancelled()) return undefined;
    drawInto(p, Math.min(batch, draws - done), xs);
    await new Promise((r) => setTimeout(r, 0));
  }
  return cancelled() ? undefined : summarise(xs, draws);
}
