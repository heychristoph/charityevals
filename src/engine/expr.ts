// A small, safe formula language for CEA rows. No eval, no property access.
//
//   numbers    1, 0.04, 1e6, 45%   (a trailing % divides by 100)
//   refs       transfer_per_household   another row in the same model
//              $discount_rate           a shared assumption (the visitor can change it)
//              @kenya.ppp_factor_2017   a shared fact (data used by several models)
//              #against-malaria-foundation   another model's live result per dollar, in common units
//                                            (units of value), our view, under the current assumptions.
//                                            Model ids contain hyphens: write a space before a minus
//                                            that follows one (#givedirectly - x).
//              #givewell:evidence-action   a charity's figure from one evaluator, live, as the rankings
//                                            make it: its programmes' models, each over its locations,
//                                            weighted by funding (src/engine/ranking.ts evaluatorFigure).
//   operators  + - * / ^ (right-assoc), unary -, parentheses
//   compare    = <> < > <= >=   (1 when true, 0 when false; lowest precedence)
//   functions  see FUNCTIONS below

import { populationShare, regionOf, regionPopulationShare } from "./countries";

export type Scope = "row" | "assumption" | "fact" | "model";
type BinOp = "+" | "-" | "*" | "/" | "^" | "=" | "<>" | "<" | ">" | "<=" | ">=";

export type Node =
  | { type: "num"; value: number }
  | { type: "ref"; name: string; scope: Scope }
  | { type: "neg"; arg: Node }
  | { type: "bin"; op: BinOp; left: Node; right: Node }
  | { type: "call"; fn: string; args: Node[] };

/** Present value of `amount` received now and then yearly for `years` years in total
 * (fractional years allowed), discounted at `rate`. Matches ACE's cage-free sheet:
 * B + NPV(r, B × (years−1)) + B × frac(years) / (1+r)^years. */
function pvAnnuityDue(amount: number, rate: number, years: number): number {
  // Under a year: that fraction of the first payment, undiscounted (it falls in year one). Without
  // this, 0.5 years counted the whole first year plus a discounted half (1.49 at 4%).
  if (years < 1) return amount * Math.max(0, years);
  const whole = Math.max(0, Math.trunc(years - 1));
  let pv = amount;
  for (let t = 1; t <= whole; t++) pv += amount / (1 + rate) ** t;
  pv += (amount * (years - Math.trunc(years))) / (1 + rate) ** years;
  return pv;
}

function median(...a: number[]): number {
  const s = [...a].sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function roundAway(x: number, digits: number, f: (v: number) => number): number {
  const k = 10 ** digits;
  return Math.sign(x) * f(Number((Math.abs(x) * k).toPrecision(15))) / k;
}

/** Spreadsheet PV: the present value of `periods` payments of `payment` (plus `future` at the end),
 * negated, as Excel and Google Sheets return it. `type` 1 means payments at the start of a period. */
function pv(rate: number, periods: number, payment: number, future = 0, type = 0): number {
  if (rate === 0) return -(payment * periods + future);
  const g = (1 + rate) ** periods;
  return -(payment * (1 + rate * type) * (g - 1) / rate + future) / g;
}

/** Spreadsheet NPV: the first value one period from now, each later one a period later. */
function npv(rate: number, ...values: number[]): number {
  return values.reduce((s, x, i) => s + x / (1 + rate) ** (i + 1), 0);
}

export const FUNCTIONS: Record<string, { arity: [number, number]; fn: (...a: number[]) => number; doc: string }> = {
  ln: { arity: [1, 1], fn: Math.log, doc: "natural log" },
  log10: { arity: [1, 1], fn: Math.log10, doc: "base-10 log" },
  exp: { arity: [1, 1], fn: Math.exp, doc: "e^x" },
  abs: { arity: [1, 1], fn: Math.abs, doc: "absolute value" },
  min: { arity: [1, 99], fn: Math.min, doc: "smallest argument" },
  max: { arity: [1, 99], fn: Math.max, doc: "largest argument" },
  sum: { arity: [1, 99], fn: (...a) => a.reduce((s, x) => s + x, 0), doc: "sum of arguments" },
  avg: { arity: [1, 99], fn: (...a) => a.reduce((s, x) => s + x, 0) / a.length, doc: "mean of arguments" },
  pv_annuity_due: { arity: [3, 3], fn: pvAnnuityDue, doc: "pv_annuity_due(amount, rate, years)" },
  if: { arity: [3, 3], fn: (c, a, b) => (c ? a : b), doc: "if(condition, then, else): condition is true when not 0" },
  iferror: { arity: [2, 2], fn: (a, b) => (Number.isFinite(a) ? a : b), doc: "iferror(x, fallback): fallback when x is not a finite number" },
  and: { arity: [1, 99], fn: (...a) => (a.every(Boolean) ? 1 : 0), doc: "1 when every argument is non-zero" },
  or: { arity: [1, 99], fn: (...a) => (a.some(Boolean) ? 1 : 0), doc: "1 when any argument is non-zero" },
  not: { arity: [1, 1], fn: (a) => (a ? 0 : 1), doc: "1 when the argument is 0" },
  product: { arity: [1, 99], fn: (...a) => a.reduce((s, x) => s * x, 1), doc: "product of arguments" },
  median: { arity: [1, 99], fn: median, doc: "median of arguments" },
  sqrt: { arity: [1, 1], fn: Math.sqrt, doc: "square root" },
  round: { arity: [1, 2], fn: (x, n = 0) => roundAway(x, n, Math.round), doc: "round(x, digits), halves away from zero" },
  roundup: { arity: [1, 2], fn: (x, n = 0) => roundAway(x, n, Math.ceil), doc: "round away from zero" },
  rounddown: { arity: [1, 2], fn: (x, n = 0) => roundAway(x, n, Math.trunc), doc: "round towards zero" },
  pv: { arity: [3, 5], fn: pv, doc: "pv(rate, periods, payment, future, type): spreadsheet PV, payments as negatives" },
  npv: { arity: [2, 200], fn: npv, doc: "npv(rate, x1, x2, ...): spreadsheet NPV, x_i discounted by (1+rate)^i" },
  // Countries by ISO 3166 numeric code (facts/countries.json), for the distance weight (model.ts distanceNode).
  region_of: { arity: [1, 1], fn: regionOf, doc: "region_of(country): the UN M49 code of the country's world region, 0 for none" },
  population_share: { arity: [1, 1], fn: populationShare, doc: "population_share(country): the country's share of the world's population" },
  region_population_share: { arity: [1, 1], fn: regionPopulationShare, doc: "region_population_share(country): the share of the world's population in the country's region" },
};

export class ExprError extends Error {}

type Tok = { t: "num"; v: number } | { t: "id"; v: string; scope: Scope } | { t: "op"; v: string };

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    const num = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?(%)?/i.exec(src.slice(i));
    if (num) {
      const v = Number(num[1] + (num[2] ?? ""));
      out.push({ t: "num", v: num[3] ? v / 100 : v });
      i += num[0].length;
      continue;
    }
    const fact = /^@[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*/i.exec(src.slice(i));
    if (fact) {
      out.push({ t: "id", v: fact[0].slice(1), scope: "fact" });
      i += fact[0].length;
      continue;
    }
    const model = /^#[a-z0-9]+(?:-[a-z0-9]+)*(?::[a-z0-9]+(?:-[a-z0-9]+)*)?/.exec(src.slice(i));
    if (model) {
      out.push({ t: "id", v: model[0].slice(1), scope: "model" });
      i += model[0].length;
      continue;
    }
    const id = /^\$?[a-z_][a-z0-9_]*/i.exec(src.slice(i));
    if (id) {
      const a = id[0].startsWith("$");
      out.push({ t: "id", v: a ? id[0].slice(1) : id[0], scope: a ? "assumption" : "row" });
      i += id[0].length;
      continue;
    }
    const cmp = /^(<=|>=|<>|<|>|=)/.exec(src.slice(i));
    if (cmp) { out.push({ t: "op", v: cmp[1] }); i += cmp[1].length; continue; }
    if ("+-*/^(),".includes(c)) { out.push({ t: "op", v: c }); i++; continue; }
    throw new ExprError(`Unexpected "${c}" at ${i} in: ${src}`);
  }
  return out;
}

const PREC: Record<string, number> = { "=": 0, "<>": 0, "<": 0, ">": 0, "<=": 0, ">=": 0, "+": 1, "-": 1, "*": 2, "/": 2, "^": 4 };

export function parse(src: string): Node {
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const expectOp = (v: string) => {
    const t = toks[p++];
    if (!t || t.t !== "op" || t.v !== v) throw new ExprError(`Expected "${v}" in: ${src}`);
  };

  function primary(): Node {
    const t = toks[p++];
    if (!t) throw new ExprError(`Unexpected end of formula: ${src}`);
    if (t.t === "num") return { type: "num", value: t.v };
    if (t.t === "op" && t.v === "(") { const e = expr(0); expectOp(")"); return e; }
    if (t.t === "op" && t.v === "-") return { type: "neg", arg: expr(3) };
    if (t.t === "id") {
      const next = peek();
      if (next?.t === "op" && next.v === "(" && t.scope === "row") {
        p++;
        const def = FUNCTIONS[t.v];
        if (!def) throw new ExprError(`Unknown function ${t.v}() in: ${src}`);
        const args: Node[] = [];
        if (!(peek()?.t === "op" && (peek() as { v: string }).v === ")")) {
          for (;;) {
            args.push(expr(0));
            const sep = peek();
            if (sep?.t === "op" && sep.v === ",") { p++; continue; }
            break;
          }
        }
        expectOp(")");
        if (args.length < def.arity[0] || args.length > def.arity[1])
          throw new ExprError(`${t.v}() takes ${def.arity.join("–")} arguments in: ${src}`);
        return { type: "call", fn: t.v, args };
      }
      return { type: "ref", name: t.v, scope: t.scope };
    }
    throw new ExprError(`Unexpected "${(t as { v: string }).v}" in: ${src}`);
  }

  function expr(minPrec: number): Node {
    let left = primary();
    for (;;) {
      const t = peek();
      if (!t || t.t !== "op" || !(t.v in PREC)) break;
      const prec = PREC[t.v];
      if (prec < minPrec) break;
      p++;
      const right = expr(t.v === "^" ? prec : prec + 1);
      left = { type: "bin", op: t.v as BinOp, left, right };
    }
    return left;
  }

  const node = expr(0);
  if (p < toks.length) throw new ExprError(`Unexpected trailing input in: ${src}`);
  return node;
}

export function refs(node: Node, out = { rows: new Set<string>(), assumptions: new Set<string>(), facts: new Set<string>(), models: new Set<string>() }) {
  switch (node.type) {
    case "ref": (node.scope === "assumption" ? out.assumptions : node.scope === "fact" ? out.facts : node.scope === "model" ? out.models : out.rows).add(node.name); break;
    case "neg": refs(node.arg, out); break;
    case "bin": refs(node.left, out); refs(node.right, out); break;
    case "call": node.args.forEach((a) => refs(a, out)); break;
  }
  return out;
}

export type Lookup = (scope: Scope, name: string) => number;

/** What a compiled formula reads: rows by position (`v`), assumptions by name, and facts or other
 * models through `other`. */
export type Env = { v: number[]; a: Record<string, number>; other: (scope: Scope, name: string) => number };
export type Compiled = (e: Env) => number;

/** A formula as nested closures, rows read by position (`rowAt` gives it, -1 for none): the same
 * operations in the same order as `evaluate`, so the same numbers, without walking the tree or
 * looking names up on every evaluation. */
export function compile(node: Node, rowAt: (name: string) => number): Compiled {
  switch (node.type) {
    case "num": { const x = node.value; return () => x; }
    case "ref": {
      const name = node.name;
      if (node.scope === "row") { const j = rowAt(name); return j < 0 ? () => NaN : (e) => e.v[j]; }
      if (node.scope === "assumption") return (e) => e.a[name] ?? NaN;
      const scope = node.scope;
      return (e) => e.other(scope, name);
    }
    case "neg": { const f = compile(node.arg, rowAt); return (e) => -f(e); }
    case "call": {
      const fn = FUNCTIONS[node.fn].fn;
      const args = node.args.map((a) => compile(a, rowAt));
      if (args.length === 1) { const [x] = args; return (e) => fn(x(e)); }
      if (args.length === 2) { const [x, y] = args; return (e) => fn(x(e), y(e)); }
      if (args.length === 3) { const [x, y, z] = args; return (e) => fn(x(e), y(e), z(e)); }
      return (e) => fn(...args.map((f) => f(e)));
    }
    case "bin": {
      const l = compile(node.left, rowAt), r = compile(node.right, rowAt);
      switch (node.op) {
        case "+": return (e) => l(e) + r(e);
        case "-": return (e) => l(e) - r(e);
        case "*": return (e) => l(e) * r(e);
        case "/": return (e) => l(e) / r(e);
        case "^": return (e) => l(e) ** r(e);
        case "=": return (e) => (l(e) === r(e) ? 1 : 0);
        case "<>": return (e) => (l(e) !== r(e) ? 1 : 0);
        case "<": return (e) => (l(e) < r(e) ? 1 : 0);
        case ">": return (e) => (l(e) > r(e) ? 1 : 0);
        case "<=": return (e) => (l(e) <= r(e) ? 1 : 0);
        case ">=": return (e) => (l(e) >= r(e) ? 1 : 0);
      }
    }
  }
}

export function evaluate(node: Node, lookup: Lookup): number {
  switch (node.type) {
    case "num": return node.value;
    case "ref": return lookup(node.scope, node.name);
    case "neg": return -evaluate(node.arg, lookup);
    case "call": return FUNCTIONS[node.fn].fn(...node.args.map((a) => evaluate(a, lookup)));
    case "bin": {
      const l = evaluate(node.left, lookup);
      const r = evaluate(node.right, lookup);
      switch (node.op) {
        case "+": return l + r;
        case "-": return l - r;
        case "*": return l * r;
        case "/": return l / r;
        case "^": return l ** r;
        case "=": return l === r ? 1 : 0;
        case "<>": return l !== r ? 1 : 0;
        case "<": return l < r ? 1 : 0;
        case ">": return l > r ? 1 : 0;
        case "<=": return l <= r ? 1 : 0;
        case ">=": return l >= r ? 1 : 0;
      }
    }
  }
}
