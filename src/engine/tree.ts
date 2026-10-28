// The model as a tree: the bottom line at the top, each number opening into the parts it is made of.
// A formula splits into parts by how it combines them (added up, multiplied and divided, a function's
// arguments), each part carrying its operator ("× 0.82", "÷ cost") and its leverage on the result.
// Works one formula at a time, so it costs the same on a 20-row model as on an 8,000-row one: only
// the nodes the reader has opened are ever looked at.
import { evaluate, type Lookup, type Node } from "./expr";
import { pickValue, viewAssumptions, type Library, type ResolvedModel, type View } from "./model";

/** One part of a formula and how it joins the others: "+", "−", "×", "÷", "^", or a function's role. */
export type Part = { op?: string; node: Node };

/** How a formula is made from its parts. `how` names what the operators alone can't say ("larger of"). */
export type Shape = { how?: string; parts: Part[] };

const FN: Record<string, string> = {
  avg: "the average", min: "the smaller part", max: "the larger part", median: "the median", ln: "natural log",
  log10: "log₁₀", exp: "exponential", abs: "absolute value", sqrt: "square root", round: "rounded",
  roundup: "rounded up", rounddown: "rounded down", pv: "present value", pv_annuity_due: "present value over the years",
  and: "1 if all hold", or: "1 if any holds", not: "the opposite",
};
const CMP: Record<string, string> = { "=": "=", "<>": "≠", "<": "<", ">": ">", "<=": "≤", ">=": "≥" };

function terms(n: Node, sign: 1 | -1 = 1): { node: Node; sign: 1 | -1 }[] {
  if (n.type === "bin" && (n.op === "+" || n.op === "-"))
    return [...terms(n.left, sign), ...terms(n.right, n.op === "-" ? ((-sign) as 1 | -1) : sign)];
  if (n.type === "call" && n.fn === "sum") return n.args.flatMap((a) => terms(a, sign));
  return [{ node: n, sign }];
}

function factors(n: Node, inv = false): { node: Node; inv: boolean }[] {
  if (n.type === "bin" && n.op === "*") return [...factors(n.left, inv), ...factors(n.right, inv)];
  if (n.type === "bin" && n.op === "/") return [...factors(n.left, inv), ...factors(n.right, !inv)];
  if (n.type === "call" && n.fn === "product") return n.args.flatMap((a) => factors(a, inv));
  return [{ node: n, inv }];
}

/** A formula split into the parts a reader would name: a − b + c is three terms, a × b ÷ c three
 * factors; anything else (functions, powers, comparisons) its operands. */
export function shapeOf(n: Node): Shape {
  if ((n.type === "bin" && (n.op === "+" || n.op === "-")) || (n.type === "call" && n.fn === "sum")) {
    return { parts: terms(n).map((t, i) => ({ op: t.sign < 0 ? "−" : i ? "+" : undefined, node: t.node })) };
  }
  if ((n.type === "bin" && (n.op === "*" || n.op === "/")) || (n.type === "call" && n.fn === "product")) {
    return { parts: factors(n).map((f, i) => ({ op: f.inv ? "÷" : i ? "×" : undefined, node: f.node })) };
  }
  switch (n.type) {
    case "neg": return { parts: [{ op: "−", node: n.arg }] };
    case "bin":
      if (n.op === "^") return { how: "raised to a power", parts: [{ node: n.left }, { op: "^", node: n.right }] };
      return { how: "1 if true, else 0", parts: [{ node: n.left }, { op: CMP[n.op], node: n.right }] };
    case "call":
      if (n.fn === "if") return { how: "depends on a condition", parts: n.args.map((a, i) => ({ op: ["if", "then", "else"][i], node: a })) };
      if (n.fn === "iferror") return { how: "with a fallback", parts: n.args.map((a, i) => ({ op: i ? "if invalid" : undefined, node: a })) };
      return { how: FN[n.fn] ?? n.fn, parts: n.args.map((a) => ({ node: a })) };
    default: return { parts: [] };
  }
}

/** Looks up rows (from computed values), assumptions (as this view sees them) and facts. */
export function lookupFor(lib: Library, m: ResolvedModel, values: Record<string, number>, av: Record<string, number>, view: View): Lookup {
  const a = viewAssumptions(m, av, view);
  return (scope, name) => (scope === "row" ? values[name] ?? NaN : scope === "assumption" ? a[name] ?? NaN : pickValue(lib.facts.get(name)?.value));
}

function replace(n: Node, target: Node, by: Node): Node {
  if (n === target) return by;
  switch (n.type) {
    case "neg": return { ...n, arg: replace(n.arg, target, by) };
    case "bin": return { ...n, left: replace(n.left, target, by), right: replace(n.right, target, by) };
    case "call": return { ...n, args: n.args.map((a) => replace(a, target, by)) };
    default: return n;
  }
}

const safe = (n: Node, look: Lookup) => {
  try {
    return evaluate(n, look);
  } catch {
    return NaN;
  }
};

/** Elasticity of a formula's value to one of its parts: the % change in the formula for a 1% change
 * in that part, holding the rest. Undefined when either is zero or not a number. */
export function partElasticity(expr: Node, part: Node, look: Lookup): number | undefined {
  const base = safe(expr, look), v = safe(part, look);
  if (!base || !v || !Number.isFinite(base) || !Number.isFinite(v)) return undefined;
  const h = 0.01;
  const after = safe(replace(expr, part, { type: "num", value: v * (1 + h) }), look);
  const e = (after - base) / base / h;
  return Number.isFinite(e) ? Math.round(e * 1000) / 1000 : undefined;
}

/** Derivative of a formula with respect to one of its parts, holding the rest: a 1% nudge, or a tiny
 * absolute one when the part is zero. Undefined when either isn't a number. */
export function partDerivative(expr: Node, part: Node, look: Lookup): number | undefined {
  const base = safe(expr, look), v = safe(part, look);
  if (!Number.isFinite(base) || !Number.isFinite(v)) return undefined;
  const step = v !== 0 ? Math.abs(v) * 0.01 : 1e-6;
  const d = (safe(replace(expr, part, { type: "num", value: v + step }), look) - base) / step;
  return Number.isFinite(d) ? d : undefined;
}

export const valueOfNode = safe;

/** What a reference ends at once rows that only pass another number along are skipped: a row whose
 * formula is just another row, or one row in a wrapper that is the identity by construction
 * (iferror(x, ...), round(x) on a whole number, x * 1, x + 0, max(x)). Equal values alone never count:
 * 1 - x equals x at 0.5 and still reverses it. `via` lists the rows skipped. */
export type Target =
  | { scope: "row"; id: string; via: string[] }
  | { scope: "assumption" | "fact"; id: string; via: string[] };

export function passThrough(m: ResolvedModel, rowId: string, look: Lookup): Target {
  const via: string[] = [];
  let id = rowId;
  for (let i = 0; i < 50; i++) {
    const n = m.byId.get(id)?.node;
    if (!n) break;
    if (n.type === "ref") {
      if (n.scope !== "row") return { scope: n.scope, id: n.name, via: [...via, id] };
      if (!m.byId.has(n.name)) break;
      via.push(id);
      id = n.name;
      continue;
    }
    const inner = identityOf(n);
    if (!inner || !m.byId.has(inner)) break;
    // The wrappers that can change a value (iferror's fallback, rounding) must not have, here.
    const a = look("row", id), b = look("row", inner);
    if (!(a === b || Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a)))) break;
    via.push(id);
    id = inner;
  }
  return { scope: "row", id, via };
}

const isNum = (n: Node, v: number) => n.type === "num" && n.value === v;

/** The row a formula returns unchanged, when its shape guarantees it (or, for iferror and rounding,
 * when its value confirms it). */
export function identityOf(n: Node): string | undefined {
  switch (n.type) {
    case "ref": return n.scope === "row" ? n.name : undefined;
    case "call":
      if (n.fn === "iferror" || n.fn === "round" || n.fn === "roundup" || n.fn === "rounddown") return identityOf(n.args[0]);
      if (["sum", "product", "avg", "min", "max", "median"].includes(n.fn) && n.args.length === 1) return identityOf(n.args[0]);
      return undefined;
    case "bin":
      if ((n.op === "*" || n.op === "/") && isNum(n.right, 1)) return identityOf(n.left);
      if (n.op === "*" && isNum(n.left, 1)) return identityOf(n.right);
      if ((n.op === "+" || n.op === "-") && isNum(n.right, 0)) return identityOf(n.left);
      if (n.op === "+" && isNum(n.left, 0)) return identityOf(n.right);
      return undefined;
    default: return undefined;
  }
}

/** A node of the tree. Keys are paths of part indices from the root ("r.0.2"), stable for a formula. */
export type TreeNode = {
  key: string;
  /** How this joins its parent: "×", "÷", "+", "−"… */
  op?: string;
  type: "row" | "input" | "assumption" | "fact" | "const" | "expr";
  /** The row it shows (row and input), the first row named in the parent's formula, and rows skipped. */
  rowId?: string;
  named?: string;
  via: string[];
  /** Assumption or fact id. */
  refId?: string;
  /** The formula this node's value comes from, when it has parts. */
  expr?: Node;
  value: number;
  /** % change in the bottom line for a 1% change in this number, through this branch. */
  e?: number;
  /** Change in the bottom line per unit change in this number, through this branch. Unlike `e`, it
   * exists when this number or its formula is zero. */
  g?: number;
};

/** The root: the model's output row. */
export function rootOf(m: ResolvedModel, look: Lookup): TreeNode {
  return nodeFor(m, { type: "ref", scope: "row", name: m.output!.row }, "r", undefined, look, 1, 1);
}

function nodeFor(m: ResolvedModel, n: Node, key: string, op: string | undefined, look: Lookup, e: number | undefined, g?: number): TreeNode {
  const value = safe(n, look);
  if (n.type === "num") return { key, op, type: "const", via: [], value, e, g };
  if (n.type === "ref" && n.scope !== "row") return { key, op, type: n.scope, refId: n.name, via: [], value, e, g };
  if (n.type === "ref") {
    const t = passThrough(m, n.name, look);
    if (t.scope !== "row") return { key, op, type: t.scope, refId: t.id, named: n.name, via: t.via, value, e, g };
    const node = m.byId.get(t.id)?.node;
    return { key, op, type: node ? "row" : "input", rowId: t.id, named: n.name, via: t.via, expr: node, value, e, g };
  }
  return { key, op, type: "expr", expr: n, via: [], value, e, g };
}

/** A node's parts, each with its leverage on the bottom line through this branch (chain rule). */
export function childrenOf(m: ResolvedModel, node: TreeNode, look: Lookup): TreeNode[] {
  if (!node.expr) return [];
  const expr = node.expr;
  return shapeOf(expr).parts.map((p, i) => {
    const local = node.e === undefined ? undefined : partElasticity(expr, p.node, look);
    const d = node.g === undefined ? undefined : partDerivative(expr, p.node, look);
    return nodeFor(m, p.node, `${node.key}.${i}`, p.op, look, local === undefined || node.e === undefined ? undefined : node.e * local, d === undefined || node.g === undefined ? undefined : node.g * d);
  });
}

/** The keys from the root down to the first node showing a row (or having skipped it on the way),
 * breadth first, so the shortest route. Undefined when the bottom line doesn't use the row. */
export function pathTo(m: ResolvedModel, rowId: string, look: Lookup): string[] | undefined {
  const root = rootOf(m, look);
  const parent = new Map<string, string>();
  const seen = new Set<string>();
  const queue: TreeNode[] = [root];
  const hit = (n: TreeNode) => n.rowId === rowId || n.named === rowId || n.via.includes(rowId);
  for (let i = 0; i < queue.length; i++) {
    const n = queue[i];
    if (hit(n)) {
      const keys = [n.key];
      while (parent.has(keys[0])) keys.unshift(parent.get(keys[0])!);
      return keys;
    }
    if (n.rowId) {
      if (seen.has(n.rowId)) continue;
      seen.add(n.rowId);
    }
    for (const c of n.expr ? childrenOfStructure(m, n, look) : []) {
      parent.set(c.key, n.key);
      queue.push(c);
    }
  }
  return undefined;
}

/** Children without leverage: for searching, where only the structure matters. */
function childrenOfStructure(m: ResolvedModel, node: TreeNode, look: Lookup): TreeNode[] {
  return shapeOf(node.expr!).parts.map((p, i) => nodeFor(m, p.node, `${node.key}.${i}`, p.op, look, undefined));
}
