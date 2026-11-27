// How the model's numbers are named on a page: a row's or a formula part's label in plain words, a
// value's label with its blank filled, and a number in its own format (Working.tsx, ModelLayers.tsx).
import { formatValue, formatAssumption, formatShown, formatYears } from "./format";
import { lib } from "./data";
import type { ResolvedModel } from "../engine/model";
import type { Node } from "../engine/expr";
import type { Row } from "../engine/schema";
import { shapeOf, type TreeNode } from "../engine/tree";

const fmtNum = (x: number) => formatValue(x, Math.abs(x) > 0 && Math.abs(x) < 0.001 ? "small" : "number");

const assumptionRow = (id: string) => lib.assumptions.rows.find((r) => r.id === id);
/** A model read live by another (`#id`): its name, as a result. */
const liveLabel = (name: string) => `${name}: result per dollar, live`;
const modelLabel = (id: string) => {
  if (!id.includes(":")) return liveLabel(lib.models.get(id)?.name ?? id);
  if (id.startsWith("cause:")) {
    const name = id.slice("cause:".length).replace(/-/g, " ");
    return `${name === "ai" ? "AI" : name[0].toUpperCase() + name.slice(1)} charities on the rankings, equal weights, live`;
  }
  // `#owner:charity`: one evaluator's figure for a charity, weighted over its programmes as the rankings make it.
  const [owner, charity] = id.split(":");
  return `${lib.charities.get(charity)?.name ?? charity} (${lib.owners.get(owner)?.name ?? owner}), programme-weighted, live`;
};
const rowLabel = (m: ResolvedModel, id: string) => m.byId.get(id)?.label || id.replace(/_/g, " ");

/** A sub-formula read in words: "Cost per net + Delivery cost". */
function exprWords(m: ResolvedModel, n: Node, depth = 0): string {
  switch (n.type) {
    case "num": return fmtNum(n.value);
    case "ref": return n.scope === "row" ? rowLabel(m, n.name) : n.scope === "assumption" ? assumptionRow(n.name)?.label ?? n.name : n.scope === "model" ? modelLabel(n.name) : lib.facts.get(n.name)?.label ?? n.name;
    case "neg": return `−${exprWords(m, n.arg, depth + 1)}`;
    default: {
      // Deeper than one level of brackets, a formula stops reading as words: name the part instead.
      if (depth >= 2) return "…";
      const sh = shapeOf(n);
      const inner = sh.parts.map((p, i) => `${p.op ? `${p.op} ` : i ? ", " : ""}${exprWords(m, p.node, depth + 1)}`).join(" ").replace(/ ,/g, ",");
      const body = sh.how && n.type === "call" ? `${sh.how} (${inner})` : inner;
      return depth ? `(${body})` : body;
    }
  }
}

/** An unnamed sub-formula's label: its parts in words where that reads whole (short, nothing elided, no
 * value left blank), else what it does to the parts listed under it. */
function exprLabel(m: ResolvedModel, n: Node): string {
  const words = exprWords(m, n);
  if (words.length <= 70 && !words.includes("…")) return words;
  const sh = shapeOf(n);
  const k = sh.parts.length;
  const ops = new Set(sh.parts.map((p) => p.op).filter(Boolean));
  if (sh.how) return sh.how[0].toUpperCase() + sh.how.slice(1);
  if (ops.has("if")) return "Depends on a condition";
  if (ops.has("÷")) return `The ${k} parts below, multiplied and divided`;
  if (ops.has("×")) return `The ${k} parts below, multiplied`;
  if (ops.has("−") && k > 1) return `The ${k} parts below, added and subtracted`;
  if (ops.has("+")) return `The ${k} parts below, added up`;
  return words;
}

/** A value's label with its blank filled: "Lives that never start count … %" reads "… count 0%". */
export function filledLabel(row: Row, v: number): string {
  if (!row.label.includes("…") || !Number.isFinite(v)) return row.label;
  const shown = formatShown(row, v);
  if (shown === "doesn't count") return row.label;
  if (shown === "average") return "Each charity counted at its average";
  return row.label.replace(/…\s*%/, shown.endsWith("%") ? shown : `${shown}%`).replace("…", shown);
}

/** Evaluators' jargon in row labels, in plain words: "funging" and "leverage" are other funders'
 * money pushed elsewhere or pulled in. */
export function plain(label: string): string {
  return label
    .replace(/\s*\((?:funging|leverage)\)/gi, "")
    .replace(/\bleverage and funging\b/gi, (w) => (w[0] === "L" ? "Other funders" : "other funders"))
    .replace(/\bfunging\b/gi, "displaced funding");
}

export function labelOf(m: ResolvedModel, n: TreeNode): string {
  return plain(rawLabelOf(m, n));
}

function rawLabelOf(m: ResolvedModel, n: TreeNode): string {
  if (n.label) return n.label;
  if (n.named) return rowLabel(m, n.named);
  if (n.type === "assumption") {
    const a = assumptionRow(n.refId!);
    return a ? filledLabel(a, n.value) : n.refId!;
  }
  if (n.type === "fact") return lib.facts.get(n.refId!)?.label ?? n.refId!;
  if (n.type === "model") return modelLabel(n.refId!);
  // The headline's "× 1000" turns a value per dollar into one per $1,000.
  if (n.type === "const" && n.value === 1000 && /^r\.\d+$/.test(n.key)) return "Per $1,000 instead of per dollar";
  if (n.type === "const") return "Fixed number in the formula";
  if (n.type === "expr") return exprLabel(m, n.expr!);
  return rowLabel(m, n.rowId!);
}

export function show(m: ResolvedModel, n: TreeNode, years = false): string {
  // The top row is the number under the page title, rounded the same way.
  if (years) return formatYears(n.value);
  // The row named in the formula speaks first (it carries the label shown), then the rows it passed
  // through, then the number it ends at.
  const own = [n.named, ...n.via].map((id) => (id ? m.byId.get(id)?.format : undefined)).find(Boolean);
  if (!own && n.type === "assumption" && assumptionRow(n.refId!)) return formatAssumption(assumptionRow(n.refId!)!, n.value);
  const f = own ?? (n.rowId ? m.byId.get(n.rowId)?.format : n.type === "assumption" ? assumptionRow(n.refId!)?.format : n.type === "fact" ? lib.facts.get(n.refId!)?.format : undefined);
  return f && f !== "number" && f !== "small" && f !== "toggle" ? formatValue(n.value, f) : fmtNum(n.value);
}
