// What kind of number an input is (schema `domain`): the simulation draws it by its kind, so no draw is
// a number it can't be (docs/normalization.md 2.18). Every input row and shared fact states it (INV-27).
import type { Node } from "./expr";
import type { ResolvedModel } from "./model";

export type Domain = "share" | "percent" | "ratio" | "positive" | "signed";

/** Whether a value (or a range's ends) can be a number of this kind. */
export function fits(domain: Domain, ...xs: number[]): boolean {
  const ok = (x: number) =>
    domain === "share" ? x >= 0 && x <= 1
    : domain === "percent" ? x >= 0 && x <= 100
    : domain === "ratio" ? x > 0
    : domain === "positive" ? x >= 0
    : true;
  return xs.every((x) => !Number.isFinite(x) || ok(x));
}

/** The inputs a model's formulas take 1 minus: `1 - x` (a share; rows by id, facts by "@key") and
 * `1 - x / 100` (a percentage written 0 to 100). */
export function complementUses(m: ResolvedModel): { share: Set<string>; percent: Set<string> } {
  const share = new Set<string>(), percent = new Set<string>();
  const name = (x: Node) => (x.type === "ref" && (x.scope === "row" || x.scope === "fact") ? (x.scope === "fact" ? `@${x.name}` : x.name) : undefined);
  const walk = (n: Node | undefined): void => {
    if (!n) return;
    if (n.type === "bin") {
      if (n.op === "-" && n.left.type === "num" && n.left.value === 1) {
        const x = n.right, a = name(x);
        if (a) share.add(a);
        else if (x.type === "bin" && x.op === "/" && x.right.type === "num" && x.right.value === 100) {
          const b = name(x.left);
          if (b) percent.add(b);
        }
      }
      walk(n.left);
      walk(n.right);
    } else if (n.type === "neg") walk(n.arg);
    else if (n.type === "call") n.args.forEach(walk);
  };
  for (const r of m.rows) walk(r.node);
  return { share, percent };
}

/** The inputs a model's formulas use as a ratio whose effect is its distance from 1: `a * x - a` (a rate
 * times a relative risk, less the rate) or `x - 1` (rows by id, facts by "@key"). */
export function ratioUses(m: ResolvedModel): Set<string> {
  const out = new Set<string>();
  const name = (x: Node) => (x.type === "ref" && (x.scope === "row" || x.scope === "fact") ? (x.scope === "fact" ? `@${x.name}` : x.name) : undefined);
  const same = (a: Node, b: Node) => JSON.stringify(a) === JSON.stringify(b);
  const walk = (n: Node | undefined): void => {
    if (!n) return;
    if (n.type === "bin") {
      if (n.op === "-") {
        const { left: l, right: r } = n;
        if (r.type === "num" && r.value === 1 && name(l)) out.add(name(l)!);
        if (l.type === "bin" && l.op === "*") {
          if (same(l.left, r) && name(l.right)) out.add(name(l.right)!);
          if (same(l.right, r) && name(l.left)) out.add(name(l.left)!);
        }
      }
      walk(n.left);
      walk(n.right);
    } else if (n.type === "neg") walk(n.arg);
    else if (n.type === "call") n.args.forEach(walk);
  };
  for (const r of m.rows) walk(r.node);
  return out;
}
