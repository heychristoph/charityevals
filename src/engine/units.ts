// A light dimension check of formulas against the units rows declare (scripts/preflight.ts). Units are
// free text, so only three things are tracked, each unknown unless every input states it:
//   money   the power of money ($, a currency): a total is $^1, a figure per dollar $^-1;
//   time    the power of time: a yearly flow is yr^-1, a total over years yr^0; years of healthy life
//           (DALYs, WELLBYs, life-years) and days (SADs, pain days) count as time, so deaths × years lost
//           is DALYs and a yearly flow × years is a total;
//   scale   what one of the number is worth: $1,000 is 1,000 dollars, a month a twelfth of a year,
//           "per 100,000" a hundred-thousandth, a percent-format row a fraction (1 = 100%).
// A literal in a product is a conversion (× 1000 turns thousands into ones), so it divides the scale.
// A row is flagged when its formula gives another power of money or time than its unit says (per dollar
// against a total, per year against a total), or a scale off by a conversion factor (per $ against per
// $1,000, a percent against a fraction, a month against a year). Rows whose units can't be read are
// skipped: the check aims at no false alarms, not at every error.
import type { Node } from "./expr";
import type { Library, ResolvedModel, ResolvedRow } from "./model";

/** undefined: not known. */
export type Dim = { money?: number; time?: number; scale?: number };

const DIMLESS: Dim = { money: 0, time: 0, scale: 1 };
const UNKNOWN: Dim = {};

const CURRENCIES = new Set(["$", "us$", "usd", "dollar", "dollars", "gbp", "£", "eur", "€", "euro", "euros", "chf", "nok", "dkk", "sek", "inr", "kes", "ugx", "mwk", "ngn", "etb", "bdt", "pkr", "cad", "aud", "nzd", "jpy", "cny", "zar", "brl", "mxn", "ghs", "tzs", "rwf", "xof", "xaf", "php", "idr", "usd$"]);
const SCALE_WORDS: Record<string, number> = { thousand: 1e3, thousands: 1e3, million: 1e6, millions: 1e6, mn: 1e6, billion: 1e9, billions: 1e9, bn: 1e9 };
/** Time units, in years. */
const TIME: Record<string, number> = { year: 1, years: 1, yr: 1, yrs: 1, annum: 1, month: 1 / 12, months: 1 / 12, week: 1 / 52, weeks: 1 / 52, day: 1 / 365, days: 1 / 365, hour: 1 / 8760, hours: 1 / 8760 };
/** Years of healthy life and days of suffering: time, so deaths × years lost per death is DALYs. */
const HEALTHY_YEARS = /^(dalys?|qalys?|wellbys?|ylls?|ylds?)$/;
const SUFFERING_DAYS = /^(sads?|ceds?)$/;
/** Physical quantities whose prefixes the check doesn't know (tonnes and kilograms, MWh and TWh,
 * hectares and acres): their scale is unknown, so no scale finding rests on them. */
const PHYSICAL = /^(k|m|g|t)?w(h)?$|^(t|kg|g|lb|lbs|pounds?|tonnes?|tons?|ha|hectares?|acres?|km|km2|m2|m3|litres?|liters?|kwh|mwh|gwh|twh|gj|mj)$/;

const DESCRIPTOR = /^(shares?|ratio|probability|chance|index|multiple|×|x|fraction|proportion|rate|disability weight|share of [a-z ]+|[a-z]+ share)$/i;

/** The dimension a unit string declares; undefined when it can't be read (a calendar year, a percent sign). */
export function parseUnit(unit: string): Dim | undefined {
  const u = unit.trim();
  if (!u) return undefined;
  // A calendar year (2025) is a date, not a duration.
  if (/^(calendar )?year$/i.test(u) || /%/.test(u) || /percentage points?/i.test(u)) return undefined;
  // "deaths / year per short ton / day": which part divides which is ambiguous.
  if (/\bper\b/i.test(u) && u.includes("/")) return undefined;
  // A share, ratio or index: a fraction of something, often of a year's worth ("a share per year" is
  // written "share" as often as not), so its time is left unknown.
  if (DESCRIPTOR.test(u)) return { money: 0, scale: 1 };
  const lower = u.toLowerCase().replace(/\bper\b/g, "/").replace(/[()]/g, " ");
  const parts = lower.split("/");
  const out = { money: 0, time: 0, scale: 1 as number | undefined, timed: false, currencies: [0, 0], other: 0 };
  parts.forEach((part, i) => {
    const sign = i === 0 ? 1 : -1;
    // "$1,000", "$1k", "$1M": money with a scale; "person-year": a person and a year.
    const tokens = part.replace(/(\$|£|€)\s*(?=\d)/g, "$1").split(/[\s·*×-]+/).filter(Boolean);
    for (let t of tokens) {
      t = t.replace(/[.,;:]+$/, "");
      const money = /^(us\$|\$|£|€)([\d,.]+)?(k|m|bn|b)?$/.exec(t);
      if (money) {
        out.money += sign;
        out.currencies[i === 0 ? 0 : 1]++;
        const n = money[2] ? Number(money[2].replace(/,/g, "")) : 1;
        const mult = money[3] === "k" ? 1e3 : money[3] === "m" ? 1e6 : money[3] === "bn" || money[3] === "b" ? 1e9 : 1;
        if (out.scale !== undefined) out.scale *= (n * mult) ** sign;
        continue;
      }
      if (CURRENCIES.has(t)) { out.money += sign; out.currencies[i === 0 ? 0 : 1]++; continue; }
      if (t in SCALE_WORDS) { if (out.scale !== undefined) out.scale *= SCALE_WORDS[t] ** sign; continue; }
      if (t in TIME) { out.time += sign; out.timed = true; if (out.scale !== undefined) out.scale *= TIME[t] ** sign; continue; }
      if (HEALTHY_YEARS.test(t)) { out.time += sign; out.timed = true; continue; }
      if (SUFFERING_DAYS.test(t)) { out.time += sign; out.timed = true; if (out.scale !== undefined) out.scale *= (1 / 365) ** sign; continue; }
      // A year in a label ("2021 PPP $") is a vintage, not a number.
      if (/^(19|20)\d\d$/.test(t)) continue;
      if (/^\d{1,3}(,\d{3})+$|^\d+(\.\d+)?$/.test(t)) { if (out.scale !== undefined) out.scale *= Number(t.replace(/,/g, "")) ** sign; continue; }
      if (PHYSICAL.test(t)) { out.scale = undefined; out.other++; continue; }
      // Anything else (deaths, people, hens, units of value, t CO₂e) is a count the check doesn't follow.
      out.other++;
    }
  });
  // An exchange rate (USD / GBP) converts a currency the check can't see on a typed amount.
  if (out.currencies[0] && out.currencies[1]) return { scale: out.other ? undefined : 1 };
  // A sum of money alone ("usd", "GBP") is as often a year's spending as a total: its time isn't known.
  // Its scale is known (dollars, not thousands): a month against a year is checked only where both sides
  // state their time.
  if (out.money && !out.timed && !out.other) return { money: out.money, scale: out.scale };
  // No time in the unit ("deaths", "people", "units of value") says nothing about time: such units are
  // written for a year's flow as often as for a total, so only a unit naming its time is held to it.
  // Its scale still holds (thousands are thousands); a month against a year needs both times stated.
  return { money: out.money, time: out.timed ? out.time : undefined, scale: out.scale };
}

/** What a row says it is: its unit, else what its format implies (a percent is a fraction of nothing in
 * particular; a dollar figure is money, over some time). */
export function declaredDim(r: { unit?: string; format?: string }): Dim {
  if (r.unit) {
    const d = parseUnit(r.unit);
    if (d) return d;
    return UNKNOWN;
  }
  if (r.format === "percent") return { money: 0, scale: 1 };
  // Dollars over some time: ones, not thousands.
  if (r.format === "usd") return { money: 1, scale: 1 };
  if (r.format === "toggle") return DIMLESS;
  return UNKNOWN;
}

const close = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b), 1e-300);
const both = (a?: number, b?: number) => a !== undefined && b !== undefined;
const add = (a?: number, b?: number) => (both(a, b) ? a! + b! : undefined);
const mul = (a?: number, b?: number) => (both(a, b) ? a! * b! : undefined);
const same = (a?: number, b?: number) => (both(a, b) && close(a!, b!) ? a : undefined);

export type UnitIssue = { row: string; kind: "money" | "time" | "scale" | "sum"; message: string };

/** A row's id or label saying it is per dollar (per $1 million) where its unit doesn't. */
const PER_DOLLAR = /\$1(?:,000)? ?million\b|\$1m\b|\bper_million$/i;

/** What a row declares: its unit, read as its label where the unit leaves out the dollar its label names
 * ("deaths a year by a typical $1 million of work" in "deaths / year"). */
function rowDeclared(r: { id: string; label?: string; unit?: string; format?: string }): Dim {
  const dim = declaredDim(r);
  if (r.unit && dim.money === 0 && dim.time !== undefined && (PER_DOLLAR.test(r.label ?? "") || PER_DOLLAR.test(r.id))) return { ...dim, money: -1, scale: undefined };
  return dim;
}

/** The conversion factors a scale finding names: per $ against per $1,000, a percent against a
 * fraction, thousands and millions, months, weeks and days against years. */
const FACTORS: [number, string][] = [[1e3, "1,000 (per $ against per $1,000, or ones against thousands)"], [1e6, "a million"], [1e5, "100,000"], [100, "100 (a percent against a fraction)"], [12, "12 (a month against a year)"], [52, "52 (a week against a year)"], [365, "365 (a day against a year)"]];


/** Dimension checks of one model's formula rows against their units, in computing order. A row is read by
 * its declared unit where it has one, else by what its formula gives; a row found inconsistent is read as
 * unknown on that axis, so one wrong unit is one finding, not one per row downstream. `exempt(row)`: rows
 * whose findings belong to someone else (a family skeleton's fixed row, copied as it stands). */
export function unitIssues(lib: Library, m: ResolvedModel, exempt: (r: ResolvedRow) => boolean = () => false): UnitIssue[] {
  const issues: UnitIssue[] = [];
  const dims = new Map<string, Dim>();
  const factDim = (key: string): Dim => { const f = lib.facts.get(key); return f ? rowDeclared(f) : UNKNOWN; };
  const assumptions = new Map(lib.assumptions.rows.map((a) => [a.id, a]));
  const assumptionDim = (id: string): Dim => { const a = assumptions.get(id); return a ? declaredDim(a) : UNKNOWN; };
  type D = Dim & { literal?: number };
  // `sums`: where a sum's terms disagree, the axes and what each side is.
  const dimOf = (n: Node, sums: string[]): D => {
    switch (n.type) {
      case "num": return { money: 0, time: 0, scale: 1, literal: Math.abs(n.value) };
      case "ref":
        if (n.scope === "row") return dims.get(n.name) ?? UNKNOWN;
        if (n.scope === "fact") return factDim(n.name);
        if (n.scope === "assumption") return assumptionDim(n.name);
        // Another model's result: per dollar, in its units.
        return { money: -1, time: 0, scale: 1 };
      case "neg": return dimOf(n.arg, sums);
      case "bin": {
        const a = dimOf(n.left, sums), b = dimOf(n.right, sums);
        if (a.literal !== undefined && b.literal !== undefined && n.op !== "^") return { ...DIMLESS, literal: 1 };
        if (n.op === "*" || n.op === "/") {
          const s = n.op === "*" ? 1 : -1;
          // A literal is a conversion: × 1000 turns thousands into ones, so it takes the scale down.
          const sa = a.literal !== undefined ? (a.literal ? 1 / a.literal : undefined) : a.scale;
          const sb = b.literal !== undefined ? (b.literal ? 1 / b.literal : undefined) : b.scale;
          return { money: add(a.money, mul(s, b.money)), time: add(a.time, mul(s, b.time)), scale: sa !== undefined && sb ? sa * sb ** s : undefined };
        }
        if (n.op === "+" || n.op === "-") {
          // A literal takes the other side's unit ("years + 1").
          if (a.literal !== undefined) return { ...b, literal: undefined };
          if (b.literal !== undefined) return { ...a, literal: undefined };
          for (const axis of ["money", "time"] as const)
            if (both(a[axis], b[axis]) && a[axis] !== b[axis]) sums.push(`adds ${describe(axis, a[axis]!)} to ${describe(axis, b[axis]!)}`);
          return { money: same(a.money, b.money), time: same(a.time, b.time), scale: same(a.scale, b.scale) };
        }
        if (n.op === "^") {
          // (1 + rate) ^ years: a growth or discount factor, dimensionless.
          const growth = n.left.type === "bin" && (n.left.op === "+" || n.left.op === "-") && (n.left.left.type === "num" || n.left.right.type === "num");
          if (growth) return DIMLESS;
          if (b.literal !== undefined) {
            const e = (n.right.type === "neg" ? -1 : 1) * b.literal;
            return { money: mul(a.money, e), time: mul(a.time, e), scale: a.literal !== undefined ? 1 : a.scale !== undefined ? a.scale ** e : undefined };
          }
          // A growth or discount factor: dimensionless when its base is.
          return { money: a.money === 0 ? 0 : undefined, time: a.time === 0 ? 0 : undefined, scale: a.scale === 1 || a.literal !== undefined ? 1 : undefined };
        }
        return DIMLESS; // comparisons
      }
      case "call": {
        const args = n.args.map((x) => dimOf(x, sums));
        const fold = (xs: D[]): Dim => {
          const real = xs.filter((x) => x.literal === undefined);
          if (!real.length) return DIMLESS;
          return real.reduce<Dim>((p, x) => ({ money: same(p.money, x.money), time: same(p.time, x.time), scale: same(p.scale, x.scale) }), real[0]);
        };
        switch (n.fn) {
          case "min": case "max": case "sum": case "avg": case "median": case "iferror": return fold(args);
          case "if": return fold(args.slice(1));
          case "abs": case "round": case "roundup": case "rounddown": return { ...args[0], literal: undefined };
          case "and": case "or": case "not": return DIMLESS;
          default: return UNKNOWN;
        }
      }
    }
  };
  for (const id of m.order) {
    const r = m.byId.get(id);
    if (!r) continue;
    const dec = rowDeclared(r);
    if (!r.node) { dims.set(id, dec); continue; }
    const sums: string[] = [];
    const got = dimOf(r.node, sums);
    // A number on its own (a branch at 0) is whatever the row says it is.
    if (got.literal !== undefined) { dims.set(id, dec); continue; }
    const found: UnitIssue[] = [];
    const bad = new Set<keyof Dim>();
    const unit = r.unit ? `unit "${r.unit}"` : `format ${r.format}`;
    for (const s of new Set(sums)) found.push({ row: id, kind: "sum", message: `its formula ${s}` });
    if (both(dec.money, got.money) && dec.money !== got.money) { bad.add("money"); found.push({ row: id, kind: "money", message: `${unit} is ${describe("money", dec.money!)}, but its formula gives ${describe("money", got.money!)}` }); }
    if (both(dec.time, got.time) && dec.time !== got.time) { bad.add("time"); found.push({ row: id, kind: "time", message: `${unit} is ${describe("time", dec.time!)}, but its formula gives ${describe("time", got.time!)}` }); }
    if (both(dec.scale, got.scale) && dec.scale! > 0 && got.scale! > 0 && !bad.size && dec.money === got.money) {
      const ratio = got.scale! / dec.scale!;
      // A month, week or day against a year only where both sides state their time.
      const timed = both(dec.time, got.time);
      const f = FACTORS.find(([x]) => (timed || (x !== 12 && x !== 52 && x !== 365)) && (Math.abs(ratio / x - 1) < 0.01 || Math.abs(ratio * x - 1) < 0.01));
      if (f) { bad.add("scale"); found.push({ row: id, kind: "scale", message: `${unit} and its formula differ by a factor of ${f[1]}: the formula gives ${ratio > 1 ? `${fmtRatio(ratio)}× the unit` : `1/${fmtRatio(1 / ratio)} of the unit`}` }); }
    }
    if (!exempt(r)) issues.push(...found);
    // Readers see the declared unit where it holds, the formula's where none is declared, unknown where they disagree.
    // A scale is read only from a declared unit: a formula's own conversions (doses / 365 for patient-years)
    // often convert a count the check doesn't follow.
    const pick = (axis: "money" | "time") => (bad.has(axis) ? undefined : dec[axis] ?? got[axis]);
    dims.set(id, { money: pick("money"), time: pick("time"), scale: bad.has("scale") ? undefined : dec.scale });
  }
  return issues;
}

const fmtRatio = (x: number) => String(+x.toPrecision(4));

function describe(axis: "money" | "time", p: number): string {
  if (axis === "money") return p === 0 ? "no money (a count, not per dollar)" : p === 1 ? "an amount of money" : p === -1 ? "per dollar" : `money^${p}`;
  return p === 0 ? "a total (no time)" : p === -1 ? "per year" : p === 1 ? "years (a duration, or years of healthy life)" : `time^${p}`;
}
