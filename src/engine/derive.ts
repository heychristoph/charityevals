// The derivation of a bottom line: each calculated row unfolds into the formula that makes it, and
// every number in that formula carries its leverage on the result. Powers the "How the number is
// built" view; works on any model, from a 20-row BOTEC to an 8,000-row spreadsheet, because it only
// ever looks one formula deep at a time.
import { evaluate, type Node } from "./expr";
import { bottomLine, pickValue, viewAssumptions, type Library, type ResolvedModel, type View } from "./model";

/** What a reference in a formula points at. */
export type Ref = { scope: "row" | "assumption" | "fact"; id: string };

/** How a row is made: an input, a sum whose parts can be shown as shares, or any other formula. */
export type Step =
  | { type: "input" }
  | { type: "sum"; terms: { node: Node; sign: 1 | -1 }[] }
  | { type: "formula"; node: Node };

export function stepOf(m: ResolvedModel, rowId: string): Step {
  const r = m.byId.get(rowId);
  if (!r?.node) return { type: "input" };
  const terms = sumTerms(r.node);
  return terms.length >= 2 ? { type: "sum", terms } : { type: "formula", node: r.node };
}

/** a + b − c and sum(a, b, c) read as a list of signed parts. */
function sumTerms(n: Node, sign: 1 | -1 = 1): { node: Node; sign: 1 | -1 }[] {
  if (n.type === "bin" && (n.op === "+" || n.op === "-"))
    return [...sumTerms(n.left, sign), ...sumTerms(n.right, n.op === "-" ? ((-sign) as 1 | -1) : sign)];
  if (n.type === "call" && n.fn === "sum") return n.args.flatMap((a) => sumTerms(a, sign));
  return [{ node: n, sign }];
}

/** A row whose formula is just another row (or a fact): the reader wants the thing it points at. */
export function aliasOf(m: ResolvedModel, rowId: string): Ref | undefined {
  const n = m.byId.get(rowId)?.node;
  return n?.type === "ref" ? { scope: n.scope, id: n.name } : undefined;
}

/** Follow aliases to the row that does the work, collecting the labels passed on the way. */
export function resolveAlias(m: ResolvedModel, rowId: string): { id: string; via: string[] } {
  const via: string[] = [];
  let id = rowId;
  for (let i = 0; i < 20; i++) {
    const a = aliasOf(m, id);
    if (!a || a.scope !== "row" || !m.byId.has(a.id)) break;
    via.push(id);
    id = a.id;
  }
  return { id, via };
}

const PREC: Record<string, number> = { "=": 0, "<>": 0, "<": 0, ">": 0, "<=": 0, ">=": 0, "+": 1, "-": 1, "*": 2, "/": 2, "^": 4 };

/** Whether an operand needs parentheses to keep its meaning, by its parent's operator and its side:
 * a ÷ (b × c) and a − (b + c) need them, a × b × c doesn't, and neither does b × c on the left of ÷;
 * the left side of a power does, (a × b)^c. */
export function needsParens(n: Node, parent: string | undefined, right: boolean): boolean {
  if (n.type !== "bin" || !parent) return false;
  const p = PREC[n.op], q = PREC[parent];
  return p < q || (p === q && (right ? parent === "-" || parent === "/" : parent === "^"));
}

/** A formula as text with the same grouping the derivation shows; parses back to the same formula. */
export function formulaText(n: Node, parent?: string, right = false): string {
  switch (n.type) {
    case "num": return String(n.value);
    case "ref": return n.scope === "assumption" ? `$${n.name}` : n.scope === "fact" ? `@${n.name}` : n.name;
    case "neg": return `-${formulaText(n.arg, "*", true)}`;
    case "call": return `${n.fn}(${n.args.map((a) => formulaText(a)).join(", ")})`;
    case "bin": {
      const s = `${formulaText(n.left, n.op)} ${n.op} ${formulaText(n.right, n.op, true)}`;
      return needsParens(n, parent, right) ? `(${s})` : s;
    }
  }
}

export function refsIn(n: Node, out: Ref[] = []): Ref[] {
  if (n.type === "ref") out.push({ scope: n.scope, id: n.name });
  else if (n.type === "neg") refsIn(n.arg, out);
  else if (n.type === "bin") { refsIn(n.left, out); refsIn(n.right, out); }
  else if (n.type === "call") n.args.forEach((a) => refsIn(a, out));
  return out;
}

/** Elasticity of the bottom line to one number: the % change in the result for a 1% change in it.
 * Measured by nudging the number and recomputing, so it holds for any formula. Undefined at zero. */
export function leverage(
  lib: Library, m: ResolvedModel, av: Record<string, number>, view: View, ref: Ref, value: number, base: number,
): number | undefined {
  if (!value || !Number.isFinite(value) || !base || !Number.isFinite(base)) return undefined;
  const h = 0.01;
  let after: number;
  // In the evaluator view the evaluator's own assumption values win, so nudge the effective value.
  if (ref.scope === "assumption") after = bottomLine(lib, view === "evaluator" && m.evaluator?.assumptions[ref.id] !== undefined
    ? { ...m, evaluator: { ...m.evaluator, assumptions: { ...m.evaluator.assumptions, [ref.id]: value * (1 + h) } } }
    : m, { ...av, [ref.id]: value * (1 + h) }, {}, view).native;
  else after = bottomLine(lib, m, av, { [ref.scope === "fact" ? `@${ref.id}` : ref.id]: value * (1 + h) }, view).native;
  const e = (after - base) / base / h;
  return Number.isFinite(e) ? Math.round(e * 1000) / 1000 : undefined;
}

/** A term's value, from the computed rows, the assumptions as this view sees them, and the facts. */
export function valueOf(
  lib: Library, m: ResolvedModel, values: Record<string, number>, av: Record<string, number>, view: View, n: Node,
): number {
  const a = viewAssumptions(m, av, view);
  return evaluate(n, (scope, name) => (scope === "row" ? values[name] : scope === "assumption" ? a[name] : pickValue(lib.facts.get(name)?.value)));
}
