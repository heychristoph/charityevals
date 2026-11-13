// From the evaluator's figure to the one the site shows, as a chain of steps (a waterfall chart): each
// step is one difference between the evaluator view and our view at the reader's values, applied one
// at a time, so the steps' ratios multiply exactly to the figure shown. A step names where it lives
// (a model row, a shared assumption, a site-wide adjustment), for the chart to link to.
//
// The chain, in a fixed order (the order decides how an interaction between two steps is split, not
// the total):
//   1. the evaluator's figure: the evaluator view (their numbers, their pinned values);
//   2. our changes to their numbers: each row we changed for consistency, back to ours one at a time
//      (rows that change the result by under 1% are summed into one step);
//   3. the site's shared values in place of the evaluator's pinned ones, at their defaults;
//   4. the reader's own settings, one slider at a time;
//   5. the site-wide adjustments at the reader's settings: the estimate's age, distance, missing data.
// A model with no evaluator view (charityevals' own) starts at step 4, from the model at the defaults
// before the site-wide adjustments.
import {
  AGE_DISCOUNT,
  DISTANCE_DISCOUNT,
  HOME_COUNTRY,
  MISSING_DATA_DISCOUNT,
  RISK_QUANTILE,
  RISK_OFF,
  assumptionValues,
  bottomLine,
  compute,
  headline,
  pickValue,
  usedAssumptions,
  type Library,
  type ResolvedModel,
} from "./model";

export type StepTarget =
  | { type: "row"; id: string }
  | { type: "assumption"; id: string }
  | { type: "rows"; ids: string[] }
  | { type: "method"; anchor: string };

export type Step = {
  kind: "change" | "value" | "yours" | "site" | "other";
  label: string;
  /** The figure after this step, and before it. */
  from: number;
  to: number;
  target?: StepTarget;
};

export type Waterfall = {
  /** "evaluator": starts at the evaluator's figure; "defaults": at the model at the site's defaults
   * before the site-wide adjustments (a model with no evaluator view). */
  start: "evaluator" | "defaults";
  startValue: number;
  steps: Step[];
  /** The figure the page shows: our view at the reader's values. */
  end: number;
  /** Where the start comes from: the model's own result in its own unit (per dollar), before it is put
   * in years of healthy life per $1,000. */
  native: { value: number; unit: string };
  /** The evaluator's own final figure, in the unit they report (output.native: "animals spared",
   * "multiples of cash transfers"), from the evaluator view; absent when it is the same as `native`. */
  reported?: { value: number; unit: string; row: string };
};

/** The site-wide adjustments: their slider, the value that turns them off, and their label. */
const SITE: { id: string; off: number; label: string; anchor: string }[] = [
  { id: AGE_DISCOUNT, off: 0, label: "How old the estimate is", anchor: "estimate-age" },
  { id: DISTANCE_DISCOUNT, off: 0, label: "Where the lives it helps are, from where you live", anchor: "near-and-far" },
  { id: MISSING_DATA_DISCOUNT, off: 1, label: "The part of the result that isn't measured", anchor: "missing-data" },
  { id: RISK_QUANTILE, off: RISK_OFF, label: "The risk you accept that the impact is lower", anchor: "risk" },
];
const SITE_IDS = new Set([...SITE.map((s) => s.id), HOME_COUNTRY]);
/** Under this change (|ratio − 1|) a changed row joins the "other changes" step. */
const SMALL = 0.01;

/** The waterfall for one model at the reader's values `av` (their overrides already applied). */
export function waterfall(lib: Library, m: ResolvedModel, av: Record<string, number>): Waterfall | undefined {
  if (!m.output) return undefined;
  const defaults = assumptionValues(lib.assumptions);
  const used = new Set(usedAssumptions(lib, m));
  const off = Object.fromEntries(SITE.map((s) => [s.id, s.off]));
  const end = headline(lib, m, av);
  const steps: Step[] = [];
  let value: number;
  let start: Waterfall["start"];
  let startValue: number;
  // The assumptions every stage before the reader's settings starts from: the defaults, adjustments off.
  let base: Record<string, number> = { ...defaults, ...off };

  const changed = m.rows.filter((r) => r.published !== undefined);
  if (m.evaluator) {
    start = "evaluator";
    value = startValue = headline(lib, m, base, {}, "evaluator");
    // Our view with every changed row held at the evaluator's number and their pinned values: the same
    // figure as the evaluator view, so the chain starts where the evaluator does.
    const pinned = { ...base, ...m.evaluator.assumptions };
    const held: Record<string, number> = Object.fromEntries(changed.map((r) => [r.id, pickValue(r.published!)]));
    const atStart = headline(lib, m, pinned, held);
    // A model that reads others live (destinations, stand-ins) reads them in our view in both views; the
    // evaluator view differs from ours here only by those reads and the evaluator's own conversions.
    if (Number.isFinite(atStart) && rel(atStart, value) > 1e-9) steps.push({ kind: "other", label: "The models it reads, and its conversion, in our view", from: value, to: atStart });
    value = atStart;
    // 2. Each changed row back to ours, the largest first; small ones together.
    const effect = (id: string) => {
      const { [id]: _, ...rest } = held;
      return headline(lib, m, pinned, rest) / atStart;
    };
    const order = changed.map((r) => ({ r, e: effect(r.id) })).sort((a, b) => Math.abs(Math.log(b.e)) - Math.abs(Math.log(a.e)));
    const small: string[] = [];
    for (const { r, e } of order) {
      if (!(Math.abs(e - 1) >= SMALL)) { small.push(r.id); continue; }
      delete held[r.id];
      const to = headline(lib, m, pinned, held);
      steps.push({ kind: "change", label: r.label, from: value, to, target: { type: "row", id: r.id } });
      value = to;
    }
    if (small.length) {
      for (const id of small) delete held[id];
      const to = headline(lib, m, pinned, held);
      if (rel(to, value) > 1e-9) steps.push({ kind: "change", label: `${small.length} smaller ${small.length === 1 ? "change" : "changes"} to the evaluator's numbers`, from: value, to, target: { type: "rows", ids: small } });
      value = to;
    }
    // 3. The site's shared values in place of the evaluator's pinned ones.
    let a = pinned;
    for (const id of Object.keys(m.evaluator.assumptions)) {
      if (SITE_IDS.has(id) || a[id] === base[id]) continue;
      a = { ...a, [id]: base[id] };
      const to = headline(lib, m, a);
      if (rel(to, value) > 1e-9) steps.push({ kind: "value", label: labelOf(lib, id), from: value, to, target: { type: "assumption", id } });
      value = to;
    }
  } else {
    start = "defaults";
    value = startValue = headline(lib, m, base);
  }

  // 4. The reader's own settings, one slider at a time (the site-wide ones come last).
  for (const r of lib.assumptions.rows) {
    const id = r.id;
    if (SITE_IDS.has(id) || !used.has(id) || av[id] === base[id]) continue;
    base = { ...base, [id]: av[id] };
    const to = headline(lib, m, base);
    if (rel(to, value) > 1e-9) steps.push({ kind: "yours", label: labelOf(lib, id), from: value, to, target: { type: "assumption", id } });
    value = to;
  }
  // 5. The site-wide adjustments at the reader's settings (distance with the reader's home country).
  base = { ...base, [HOME_COUNTRY]: av[HOME_COUNTRY] ?? base[HOME_COUNTRY] };
  for (const s of SITE) {
    if (!(s.id in av)) continue;
    base = { ...base, [s.id]: av[s.id] };
    const to = headline(lib, m, base);
    if (rel(to, value) > 1e-9) steps.push({ kind: "site", label: s.label, from: value, to, target: { type: "method", anchor: s.anchor } });
    value = to;
  }
  // Whatever is left (none, as every value is now the reader's): kept so the chain always ends at the figure.
  if (rel(end, value) > 1e-9) steps.push({ kind: "other", label: "Everything else", from: value, to: end });
  const native = { value: bottomLine(lib, m, { ...defaults, ...off }, {}, start === "evaluator" ? "evaluator" : "charityevals").native, unit: m.output.unit };
  const n = m.output.native;
  const reported = n && n.row !== m.output.row
    ? { value: compute(lib, m, { ...defaults, ...off }, {}, start === "evaluator" ? "evaluator" : "charityevals")[n.row], unit: n.unit, row: n.row }
    : undefined;
  return { start, startValue, steps, end, native, ...(reported && Number.isFinite(reported.value) ? { reported } : {}) };
}

const rel = (a: number, b: number) => (Number.isFinite(a) && Number.isFinite(b) ? Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300) : Infinity);
const labelOf = (lib: Library, id: string) => lib.assumptions.rows.find((r) => r.id === id)?.label ?? id;
