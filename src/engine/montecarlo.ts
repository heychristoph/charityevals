// A model's result as a distribution, by Monte Carlo at the site's defaults: every uncertain input (the
// uncertainty engine's drivers, the reader's own value judgments left out) drawn from its range as its
// source states it (`interval`, `shape`; a 90% log-normal by default), the model computed for each
// draw. Run at build time (scripts/summaries.ts → generated/distributions.json); the browser only scales
// the stored shape with the reader's values, so the risk slider and the ranges cost nothing to move.
import { normInv, type Node } from "./expr";
import type { Domain } from "./domains";
import { QUANTILES, RISK_OFF, RISK_QUANTILE, assumptionValues, compute, headline, headlineAndRows, pickValue, type Distribution, type Library, type ResolvedModel } from "./model";
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

/** `group`: rows drawn together (`drawn_with`) share one z. */
type Spec = { key: string; draw: (z: number) => number; group?: string };

/** How to draw one input from a standard normal z, by its kind (`domain`, docs/normalization.md 2.18):
 * split at the best guess, so the best guess is the median and an asymmetric range stays asymmetric, and
 * no draw is a number of that kind can't be. `adjustment`: a percentage added to 1 (format percent, below
 * zero), which never takes away more than everything. */
function spec(d: Driver, best: number, interval: number | undefined, shape: string | undefined, domain: Domain, adjustment: boolean): Spec | undefined {
  if (!Number.isFinite(best)) return undefined;
  const z = interval ? normInv((1 + interval) / 2) : Z90;
  const clip = (x: number) =>
    domain === "share" ? Math.min(1, Math.max(0, x))
    : domain === "percent" ? Math.min(100, Math.max(0, x))
    : domain === "signed" ? x
    : Math.max(0, x);
  const odds = (p: number) => Math.log(p / (1 - p));
  const logistic = (x: number) => 1 / (1 + Math.exp(-x));
  if (!d.published) {
    // A default spread says how far a number may be off, by its kind.
    const sd = d.spread / Z90;
    // A share on its odds, so it never reaches 0% or 100%; one stated as certain stays so.
    if (domain === "share") return best > 0 && best < 1 ? { key: d.key, draw: (g) => logistic(odds(best) + g * sd) } : undefined;
    if (domain === "percent") return best > 0 && best < 100 ? { key: d.key, draw: (g) => 100 * logistic(odds(best / 100) + g * sd) } : undefined;
    // A ratio's effect is its distance from 1 (a relative risk of 1.11, of 0.8): spread on that distance,
    // a rise log-normal, a fall on its odds, so the effect keeps its sign.
    if (domain === "ratio") {
      if (best > 1) return { key: d.key, draw: (g) => 1 + (best - 1) * Math.exp(g * sd) };
      if (best > 0 && best < 1) return { key: d.key, draw: (g) => 1 - logistic(odds(1 - best) + g * sd) };
      return undefined;
    }
    // A negative adjustment (−2.5% a year, −40%) scales by its own size and never takes away more than all.
    if (domain === "signed" && adjustment && best > -1 && best < 0) return { key: d.key, draw: (g) => Math.max(-1, best * Math.exp(g * sd)) };
    // Anything else scales by its own size, keeping its sign.
    return { key: d.key, draw: (g) => best * Math.exp(g * sd) };
  }
  const { low, high } = d;
  // A share added to 1 (an adjustment of −42%, its range −72% to −19%) can't take away more than all of
  // it: drawn as the factor 1 + x, log-normal, so the factor stays positive.
  if (adjustment && shape !== "normal" && low > -1 && high < 1 && low < 0 && low <= best && best <= high) {
    const lo = Math.log((1 + best) / (1 + low)) / z, hi = Math.log((1 + high) / (1 + best)) / z;
    return { key: d.key, draw: (g) => (1 + best) * Math.exp(g * (g < 0 ? lo : hi)) - 1 };
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
type Plan = { lib: Library; m: ResolvedModel; av: Record<string, number>; edits: Record<string, number>; central: number; specs: Spec[]; bounds: string[]; events: { id: string; p: number; key: string; one_of: boolean }[]; groups: Set<string>; gauss: () => number; random: () => number };

const sig = (x: number) => Number(x.toPrecision(9));
const keyOf = (d: Driver) => (d.scope === "fact" ? `@${d.id}` : d.id);

/** A simulation's plan at assumption values `av` (default: the site's) with the reader's edits fixed:
 * an edited number is the reader's, so it isn't drawn. Undefined for a model with no comparable result or
 * no uncertain input. */
function plan(lib: Library, m: ResolvedModel, avIn?: Record<string, number>, edits: Record<string, number> = {}): Plan | undefined {
  if (!m.output) return undefined;
  // The reader's risk is applied to the result, never inside the draws.
  const av = { ...(avIn ?? assumptionValues(lib.assumptions)), [RISK_QUANTILE]: RISK_OFF };
  const central = headline(lib, m, av, edits);
  if (!Number.isFinite(central) || central === 0) return undefined;
  const values = compute(lib, m, av, edits);
  const u = uncertainty(lib, m, values, av, "charityevals", edits);
  // The inputs that carry 99.9% of the variance, value judgments and the reader's edits left out.
  const drivers = u.drivers
    .filter((d) => d.source !== "assumption" && !(keyOf(d) in edits))
    // Largest first; contributions equal to 9 digits by key, so a last-digit difference between machines
    // never swaps two inputs' places in the draw order (each takes the next normal draw).
    .sort((a, b) => sig(b.contribution) - sig(a.contribution) || keyOf(a).localeCompare(keyOf(b)));
  const total = drivers.reduce((s, d) => s + d.contribution, 0);
  const kept: Driver[] = [];
  let acc = 0;
  for (const d of drivers) {
    if (total > 0 && acc >= total * 0.999) break;
    kept.push(d);
    acc += d.contribution;
  }
  // Inputs with a published range (rows by id, shared facts by "@key"): what they can do, they may.
  const published = new Set(kept.filter((d) => d.published).map((d) => (d.scope === "fact" ? `@${d.id}` : d.id)));
  const feeds = new Map<string, Set<string>>();
  const inputsOf = (id: string): Set<string> => {
    let out = feeds.get(id);
    if (out) return out;
    feeds.set(id, (out = new Set()));
    const row = m.byId.get(id);
    if (!row) return out;
    if (!row.node) out.add(id);
    for (const f of row.factDeps) out.add(`@${f}`);
    for (const dep of row.deps) inputsOf(dep).forEach((x) => out!.add(x));
    return out;
  };
  const defaultOnly = (id: string) => ![...inputsOf(id)].some((x) => published.has(x));
  // A calculated share (a row stated `domain: share`, as `1 - efficacy` is) stays between 0 and 1 where
  // only default spreads feed it: a draw that pushes it outside (an efficacy times an adjustment above
  // 100%) is drawn again. A published range keeps its tails: 1 minus a relative risk whose interval runs
  // past 1 is possible harm, not an impossible share.
  const bounds = m.rows.filter((r) => r.node && r.domain === "share" && values[r.id] >= 0 && values[r.id] <= 1 && defaultOnly(r.id)).map((r) => r.id);
  // Two figures of one series (labels the same but for a year) that a formula divides or subtracts, a trend
  // or a change: drawn together, as `drawn_with` does, so the trend isn't made of two independent errors.
  const yearless = (id: string) => m.byId.get(id)?.label?.replace(/\b(19|20)\d\d\b/g, "Y");
  const series: [string, string][] = [];
  const pairs = (n: Node | undefined): void => {
    if (!n) return;
    if (n.type === "bin") {
      if ((n.op === "/" || n.op === "-") && n.left.type === "ref" && n.right.type === "ref" && n.left.scope === "row" && n.right.scope === "row" && n.left.name !== n.right.name) {
        const a = yearless(n.left.name), b = yearless(n.right.name);
        if (a && a === b && a !== m.byId.get(n.left.name)?.label) series.push([n.left.name, n.right.name]);
      }
      pairs(n.left); pairs(n.right);
    } else if (n.type === "neg") pairs(n.arg);
    else if (n.type === "call") n.args.forEach(pairs);
  };
  for (const r of m.rows) pairs(r.node);
  // Overlapping pairs (2007 / 2023 and 2020 / 2023) are one series: one draw for all of it.
  const seriesParent = new Map<string, string>();
  const seriesRoot = (x: string): string => { const p = seriesParent.get(x) ?? x; if (p === x) return x; const r = seriesRoot(p); seriesParent.set(x, r); return r; };
  const join = (a: string, b: string) => { const ra = seriesRoot(a), rb = seriesRoot(b); if (ra !== rb) seriesParent.set(rb, ra); };
  // A series from default spreads only (a published range is the source's own); a row `drawn_with` another
  // joins that row's draw, so a series and an explicit link to it are one draw.
  const isPublished = (id: string) => published.has(id);
  const linked = new Set<string>();
  for (const [a, b] of series) if (!isPublished(a) && !isPublished(b)) (join(a, b), linked.add(a), linked.add(b));
  for (const r of m.rows) if (r.drawn_with) (join(r.id, r.drawn_with), linked.add(r.id), linked.add(r.drawn_with));
  // Each input drawn by its kind; one that doesn't state it (INV-27 fails the build) as a positive number.
  const specs: Spec[] = [];
  for (const d of kept) {
    if (d.scope === "row") {
      const r = m.byId.get(d.id);
      const best = values[d.id];
      const s = spec(d, best, r?.interval, r?.shape, r?.domain ?? "positive", r?.format === "percent");
      const group = linked.has(d.id) ? `draw:${seriesRoot(d.id)}` : undefined;
      if (s) specs.push({ ...s, key: d.id, ...(group ? { group } : {}) });
    } else if (d.scope === "fact") {
      const f = lib.facts.get(d.id);
      const s = f && spec(d, pickValue(f.value), f.interval, f.shape, f.domain ?? "positive", f.format === "percent");
      if (s) specs.push({ ...s, key: `@${d.id}` });
    }
  }
  // Single-event chances: drawn as happens or doesn't, at their (drawn) value; an edited one too.
  const events = m.rows.flatMap((r) => {
    const s = r.single_event, p = values[r.id];
    if (!s || !(p >= 0 && p <= 1)) return [];
    return [{ id: r.id, p, key: s === true ? `.${r.id}` : "with" in s ? s.with : s.one_of, one_of: s !== true && "one_of" in s }];
  });
  if (!specs.length && !events.length) return undefined;
  const random = rng(hash(m.id));
  const gauss = () => {
    let a = 0, b = 0;
    while (a === 0) a = random();
    while (b === 0) b = random();
    return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * b);
  };
  const groups = new Set(specs.flatMap((s) => (s.group ? [s.group] : [])));
  return { lib, m, av, edits, central, specs, bounds, events, groups, gauss, random };
}

/** A miss is drawn as a vanishing chance rather than 0, a hit as all but certain: a model that divides by
 * the chance (a cost per success, 1/p) or by its complement (scenarios given no failure, 1/(1 − p))
 * then reads either as next to no result or the full one, never as no number. */
const MISS = 1e-9;

/** `n` draws into `xs`; with single-event chances also into `smooth`, the same draws with each chance at
 * its value (what the risk factor is anchored on). */
/** Draws of a bounded share outside 0–1 are drawn again, at most this many times per draw. */
const REDRAWS = 100;
const inBounds = (p: Plan, rows: Record<string, number>) =>
  p.bounds.every((id) => !(rows[id] < -1e-9 || rows[id] > 1 + 1e-9));

/** For diagnostics (audits, scripts): `n` draws of a model at the defaults, each with its drawn inputs and
 * its result as a multiple of the best guess. */
export function sampleDraws(lib: Library, m: ResolvedModel, n = 1000): { inputs: Record<string, number>; x: number }[] {
  const p: Plan | undefined = plan(lib, m);
  if (!p) return [];
  const specs: Spec[] = p.specs, groups: Set<string> = p.groups, gauss: () => number = p.gauss;
  const out: { inputs: Record<string, number>; x: number }[] = [];
  for (let i = 0; i < n; i++) {
    const inputs: Record<string, number> = {};
    const zs: Record<string, number> = {};
    for (let k = 0; k < specs.length; k++) {
      const one: Spec = specs[k];
      const g: string | undefined = one.group ?? (groups.has(one.key) ? one.key : undefined);
      const z: number = g ? (zs[g] ??= gauss()) : gauss();
      inputs[one.key] = one.draw(z);
    }
    const x: number = headline(p.lib, p.m, p.av, inputs) / p.central;
    out.push({ inputs, x });
  }
  return out;
}

/** What turns the model's own result into its headline at the plan's values. */
const convOf = (p: Plan) => p.central / compute(p.lib, p.m, p.av, p.edits)[p.m.output!.row];

/** `n` draws into `xs` (and `smooth`); returns how many draws had to be drawn again. */
function drawInto(p: Plan, n: number, xs: number[], smooth: number[]): number {
  let redrawn = 0;
  for (let i = 0; i < n; i++) {
    let inputs: Record<string, number> = {};
    let y = NaN;
    for (let k = 0; k < REDRAWS; k++) {
      inputs = { ...p.edits };
      // Rows drawn together take one z per group (the group's own row included).
      const zs: Record<string, number> = {};
      const grouped = p.groups;
      for (const s of p.specs) {
        const g = s.group ?? (grouped.has(s.key) ? s.key : undefined);
        inputs[s.key] = s.draw(g ? (zs[g] ??= p.gauss()) : p.gauss());
      }
      const h = headlineAndRows(p.lib, p.m, p.av, inputs, "charityevals", p.bounds);
      y = h.value / p.central;
      if (inBounds(p, h.rows)) break;
      redrawn++;
      y = NaN;
    }
    if (!Number.isFinite(y)) continue;
    if (p.events.length) {
      // One uniform draw per key: events sharing it happen together as far as their chances allow; a key's
      // scenarios (one_of) split it, so exactly one happens.
      const u: Record<string, number> = {}, below: Record<string, number> = {};
      for (const e of p.events) {
        const x = (u[e.key] ??= p.random()), q = inputs[e.id] ?? e.p;
        if (e.one_of) {
          const from = below[e.key] ?? 0;
          below[e.key] = from + q;
          inputs[e.id] = x >= from && x < from + q ? 1 - MISS : MISS;
        } else inputs[e.id] = x < q ? 1 - MISS : MISS;
      }
      const x = headline(p.lib, p.m, p.av, inputs) / p.central;
      if (Number.isFinite(x) && Number.isFinite(y)) (xs.push(x), smooth.push(y));
    } else xs.push(y);
  }
  return redrawn;
}

/** Where more than this share of everything drawn is impossible (three in four), the default spreads don't
 * fit the model's bounds: the simulation is marked unstable and the joint range used instead. */
const MAX_IMPOSSIBLE = 0.75;

// A miss drawn as a vanishing chance stores as 0.
// `scale`: what 1 is in (the best guess, for steps stored in the result's own units), so the cutoff is a
// miss, never a small result.
const round = (x: number, scale = 1) => (Math.abs(x) < 1e-6 * Math.abs(scale) ? 0 : Number(x.toPrecision(4)));
function quantiles(xs: number[], scale = 1) {
  xs.sort((a, b) => a - b);
  const at = (p: number) => {
    const k = p * (xs.length - 1), i = Math.floor(k), f = k - i;
    return i + 1 < xs.length ? xs[i] * (1 - f) + xs[i + 1] * f : xs[i];
  };
  return QUANTILES.map((p) => round(at(p), scale));
}

function summarise(xs: number[], smooth: number[], draws: number, central: number, redrawn = 0, conv?: number): Distribution | undefined {
  const negative = central < 0;
  if (xs.length < draws / 2) return undefined;
  // Multiples of the best guess, in ascending order: the result's order unless the best guess is below
  // zero (net harm, docs/normalization.md 2.21), where the largest multiple is the most harm. Stored in the
  // result's order either way, so q[0] is always the lowest result.
  const up = quantiles(xs);
  const q = negative ? [...up].reverse() : up;
  // Reliability is judged on the smooth draws: a long shot's yes/no is meant to swing.
  const s = smooth.length ? quantiles(smooth) : up;
  const mid = s[9], lo = s[0], hi = s[s.length - 1];
  // Broken: most of what the default spreads would draw is impossible. Wide is not broken (the wide-range
  // caveat says so), and a middle far from the best guess is a result near zero (a net of large opposite
  // effects): its range is stored in the result's own units, the reader's values moving it by the change in
  // the best guess, since multiples of a best guess near zero mean nothing.
  const unstable = redrawn / (redrawn + draws) > MAX_IMPOSSIBLE;
  void lo; void hi;
  if (!(mid > 1 / 3 && mid < 3)) {
    const abs = quantiles(xs.map((x) => x * central), central);
    return {
      q: abs,
      mean: round(xs.reduce((s, x) => s + x, 0) / xs.length),
      zero: round(xs.filter((x) => (negative ? x >= -1e-6 : x <= 1e-6)).length / xs.length),
      additive: true,
      at: Number(central.toPrecision(6)),
      ...(conv !== undefined && Number.isFinite(conv) ? { conv: Number(conv.toPrecision(6)) } : {}),
      ...(unstable ? { unstable: true } : {}),
    };
  }
  return {
    q,
    mean: round(xs.reduce((s, x) => s + x, 0) / xs.length),
    // Draws whose result is at zero or below: multiples at or below zero, or for a negative best guess at or above.
    zero: round(xs.filter((x) => (negative ? x >= -1e-6 : x <= 1e-6)).length / xs.length),
    ...(unstable ? { unstable: true } : {}),
    ...(smooth.length ? { middle: mid } : {}),
  };
}

/** The model's result as a distribution, in our view: at the site's defaults (the build's), or at the
 * reader's values `av` with their `edits` fixed. Seeded by model id, so the same values give the same
 * shape. Undefined for a model with no comparable result or no uncertain input. */
export function simulate(lib: Library, m: ResolvedModel, draws = 1000, av?: Record<string, number>, edits: Record<string, number> = {}): Distribution | undefined {
  const p = plan(lib, m, av, edits);
  if (!p) return undefined;
  const xs: number[] = [], smooth: number[] = [];
  const redrawn = drawInto(p, draws, xs, smooth);
  return summarise(xs, smooth, draws, p.central, redrawn, convOf(p));
}

/** The same, in batches that give the page back between them (a model page re-simulating after the
 * reader's edits): resolves undefined once `cancelled()` turns true. */
export async function simulateInSteps(lib: Library, m: ResolvedModel, av: Record<string, number>, edits: Record<string, number>, cancelled: () => boolean, draws = 1000): Promise<Distribution | undefined> {
  const p = plan(lib, m, av, edits);
  if (!p) return undefined;
  const xs: number[] = [], smooth: number[] = [];
  let redrawn = 0;
  const batch = 50;
  for (let done = 0; done < draws; done += batch) {
    if (cancelled()) return undefined;
    redrawn += drawInto(p, Math.min(batch, draws - done), xs, smooth);
    await new Promise((r) => setTimeout(r, 0));
  }
  return cancelled() ? undefined : summarise(xs, smooth, draws, p.central, redrawn, convOf(p));
}
