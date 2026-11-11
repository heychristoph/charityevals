// A model's theory of change, read off its formulas: the bottom line flattened into the factors it is
// the product of (reach, effect, the adjustments, the conversion), each named by the step of the chain
// it is, and split into programmes where the result adds several up. Nothing is written beside the
// model: the formulas are the chain, so it can't drift from the numbers.
import type { Node } from "./expr";
import { Step } from "./schema";
import { compute, assumptionValues, missingDataFactor, SIDE_EFFECT_WEIGHT, type Library, type ResolvedModel } from "./model";
import { passThrough, lookupFor, valueOfNode } from "./tree";

/** The steps of a chain, in the order a reader follows them. */
export const STEPS = Step.options;
export type StepName = (typeof STEPS)[number] | "other";

/** Steps every programme's chain needs a row for (a value of 1 is a row too): what it reaches, what that
 * does, how sure the evidence is, what would have happened anyway, and the charity's share of it. */
export const EXPECTED_STEPS: StepName[] = ["reach", "effect", "evidence", "anyway", "credit"];

export const STEP_LABELS: Record<StepName, string> = {
  cost: "Cost", reach: "Reach", take_up: "Take-up", effect: "Effect", evidence: "Evidence", anyway: "Would happen anyway",
  credit: "Credit", lasts: "How long it lasts", value: "Value", side_effect: "Side effects", next_dollar: "Next dollar", other: "Other",
};

export type Factor = {
  step: StepName;
  /** The row (or $assumption, @fact, #model) the factor is. */
  ref: string;
  label: string;
  value: number;
  /** Divides the result (a cost). */
  inv?: boolean;
};
export type Programme = { label: string; share: number; factors: Factor[]; branches?: Programme[] };
export type Chain = { factors: Factor[]; programmes: Programme[]; missing: StepName[] };

// First match wins: ids and labels, read together.
const RULES: [StepName, RegExp][] = [
  ["take_up", /grantee[- _]level|confidence in funds|wastage|fraud|misappropriat/i],
  ["next_dollar", /marginal_vs_past|next dollar|marginal (dollar|funding)|room for more/i],
  ["credit", /attribution|leverage|fung|credit|crowd|salary|donor_cost_share|resource_shares|share of (the )?(resources|credit)|coalition|contribution/i],
  ["anyway", /counterfactual|would (have|happen)|anyway|without the (program|charity)|business as usual/i],
  ["evidence", /evidence|validity|replicab|bias|missing[_ ]data|isn't measured|publication|generaliz|external|internal/i],
  ["side_effect", /spillover|supplemental intervention|unmodelled|additional (program )?benefits|excluded effects/i],
  ["take_up", /adherence|complian|coverage|take[-_ ]?up|uptake|usage|fulfil|implementation|delivered|attendance|completion/i],
  ["lasts", /persist|duration|years? of (impact|benefit)|discount|annuity|npv|\bpv\b|lifetime|decay|wait|timing|years_until/i],
  // A welfare change per animal or person is the effect, even in the outcome's unit.
  ["effect", /averted per (hen|animal|broiler|chicken|fish|shrimp|person)|per hen-year moved|welfare change/i],
  ["value", /uov|units? of value|daly|wellby|moral|value (of|assigned)|ln[_ ]|log |consumption|income|\bsads?\b|species|welfare range|per person value|exchange|conversion|life_value/i],
  ["effect", /effect|reduc|efficacy|risk|mortality|incidence|avert|prevalen|impact|deaths?|cases?|improv|outcome|benefit/i],
  ["reach", /people|reached|recipient|beneficiar|treated|number|animals|hens|chickens|population|distribut|nets|households|children|patients|students|pledges|commitments|tonnes|hectares|acres/i],
  ["cost", /cost|spend|budget|grant|expenditure|price|revenue|dollar|funding/i],
];

export function stepOf(id: string, label = "", sideEffect = false, tagged?: StepName): StepName {
  if (tagged) return tagged;
  if (sideEffect) return "side_effect";
  const text = `${id.replace(/_/g, " ")} ${label}`;
  return RULES.find(([, re]) => re.test(text))?.[0] ?? "other";
}

type Ctx = { lib: Library; m: ResolvedModel; look: ReturnType<typeof lookupFor>; depth: number; budget: { n: number } };

const MAX_DEPTH = 8;

/** What a divided-by number is: a cost where it reads as one (or as nothing), else its own step. */
const divStep = (inv: boolean, step: StepName): StepName => (inv && (step === "other" || step === "reach") ? "cost" : step);

function leaf(ctx: Ctx, n: Node, inv: boolean): Factor {
  const value = valueOfNode(n, ctx.look);
  if (n.type === "ref" && n.scope === "row") {
    const r = ctx.m.byId.get(n.name);
    return { step: divStep(inv, stepOf(n.name, r?.label, !!r?.side_effect, r?.step)), ref: n.name, label: r?.label ?? n.name, value, ...(inv ? { inv } : {}) };
  }
  if (n.type === "ref") {
    const ref = `${n.scope === "assumption" ? "$" : n.scope === "fact" ? "@" : "#"}${n.name}`;
    const label = n.scope === "assumption" ? ctx.lib.assumptions.rows.find((r) => r.id === n.name)?.label ?? n.name
      : n.scope === "fact" ? ctx.lib.facts.get(n.name)?.label ?? n.name : n.name;
    const step: StepName = n.scope === "model" ? "effect" : n.name === SIDE_EFFECT_WEIGHT ? "side_effect" : stepOf(n.name, label);
    return { step: divStep(inv, step), ref, label, value, ...(inv ? { inv } : {}) };
  }
  // A formula that is no row of its own (a present value, a nested sum): named by the first row it
  // reads, a step by its function.
  const first = firstRef(n);
  const r = first ? ctx.m.byId.get(first) : undefined;
  const fnStep: StepName | undefined = n.type === "call" && /^(pv|npv|pv_annuity_due|fv)$/.test(n.fn) ? "lasts" : undefined;
  return { step: divStep(inv, fnStep ?? (first ? stepOf(first, r?.label, !!r?.side_effect, r?.step) : "other")), ref: first ?? "", label: r?.label ?? first ?? "", value, ...(inv ? { inv } : {}) };
}

function firstRef(n: Node): string | undefined {
  if (n.type === "ref") return n.scope === "row" ? n.name : undefined;
  if (n.type === "neg") return firstRef(n.arg);
  if (n.type === "bin") return firstRef(n.left) ?? firstRef(n.right);
  if (n.type === "call") for (const a of n.args) { const f = firstRef(a); if (f) return f; }
  return undefined;
}

/** A × b ÷ c into its factors, opening rows that are themselves products. */
function flatten(ctx: Ctx, n: Node, inv: boolean, out: { factors: Factor[]; sums: { node: Node; inv: boolean }[] }) {
  if (n.type === "bin" && (n.op === "*" || n.op === "/")) {
    flatten(ctx, n.left, inv, out);
    flatten(ctx, n.right, n.op === "/" ? !inv : inv, out);
    return;
  }
  if (n.type === "call" && n.fn === "product") { n.args.forEach((a) => flatten(ctx, a, inv, out)); return; }
  // A switch follows the branch the defaults take ($resource_shares picks the view).
  if (n.type === "call" && n.fn === "if" && n.args.length === 3) { flatten(ctx, valueOfNode(n.args[0], ctx.look) ? n.args[1] : n.args[2], inv, out); return; }
  // Unit scaling (÷ 1,000, × 100) is no step of the chain.
  if (n.type === "num") return;
  // A sum where one part carries everything (a species step with one version in use) is that part.
  const only = soleTerm(ctx, n);
  if (only) { flatten(ctx, only, inv, out); return; }
  if (n.type === "ref" && n.scope === "row") {
    const t = passThrough(ctx.m, n.name, ctx.look);
    if (t.scope !== "row") { flatten(ctx, { type: "ref", scope: t.scope, name: t.id }, inv, out); return; }
    const r = ctx.m.byId.get(t.id);
    const step = stepOf(t.id, r?.label, !!r?.side_effect, r?.step);
    // A canonical adjustment or a tagged side effect is a step of its own: not opened.
    const canonical = /(^|_)(evidence_adj|counterfactual_adj|attribution_share|implementation_adj|leverage_funging_adj|unmodelled_benefits_adj|missing_data_adj|wait_discount|marginal_vs_past_average)$/.test(t.id);
    if (r?.node && !canonical && !r.side_effect && !r.step && ctx.depth < MAX_DEPTH && ctx.budget.n-- > 0) {
      const node = r.node;
      const isProduct = (node.type === "bin" && (node.op === "*" || node.op === "/")) || (node.type === "call" && node.fn === "product");
      if (isProduct || soleTerm(ctx, node) || (node.type === "call" && node.fn === "if")) { flatten({ ...ctx, depth: ctx.depth + 1 }, node, inv, out); return; }
      if (!inv && isBranching(ctx, node)) { out.sums.push({ node, inv }); return; }
    }
    out.factors.push({ ...leaf(ctx, { type: "ref", scope: "row", name: t.id }, inv), step: divStep(inv, step) });
    return;
  }
  if (!inv && isBranching(ctx, n)) { out.sums.push({ node: n, inv }); return; }
  out.factors.push(leaf(ctx, n, inv));
}

function soleTerm(ctx: Ctx, n: Node): Node | undefined {
  const ts = termsOf(n);
  if (ts.length < 2) return undefined;
  const vals = ts.map((t) => valueOfNode(t, ctx.look));
  const total = vals.reduce((s, v) => s + v, 0);
  if (!Number.isFinite(total) || !total) return undefined;
  // One part with 99% of the value: the chain is that part's (the rest is too small to show).
  const big = vals.findIndex((v) => v / total >= 0.99);
  return big >= 0 && vals.every((v, i) => i === big || v >= 0) ? ts[big] : undefined;
}

/** The same number multiplied and divided (a donation scaled up and back, a total over its parts) is
 * no step; nor is a factor of 1. */
function cancel(fs: Factor[]): Factor[] {
  const same = (a: number, b: number) => a === b || Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b));
  // A row at 1 stays: it says the step was considered (an explicit ×1).
  const out = fs.filter((f) => !(same(f.value, 1) && !f.ref));
  for (let i = 0; i < out.length; i++) {
    const j = out.findIndex((g, k) => k !== i && !!g.inv !== !!out[i].inv && same(g.value, out[i].value));
    if (j >= 0) { out.splice(Math.max(i, j), 1); out.splice(Math.min(i, j), 1); i = -1; }
  }
  return out;
}

function termsOf(n: Node): Node[] {
  if (n.type === "bin" && n.op === "+") return [...termsOf(n.left), ...termsOf(n.right)];
  if (n.type === "call" && n.fn === "sum") return n.args.flatMap(termsOf);
  return [n];
}

/** A sum of two or more parts that each carry value (not 1 + a share, not a blend of weights). */
function isBranching(ctx: Ctx, n: Node): boolean {
  const ts = termsOf(n);
  if (ts.length < 2) return false;
  if (ts.some((t) => t.type === "num")) return false;
  const vals = ts.map((t) => valueOfNode(t, ctx.look));
  const total = vals.reduce((s, v) => s + v, 0);
  return Number.isFinite(total) && total > 0 && vals.filter((v) => v / total > 0.005).length >= 2;
}

function programme(ctx: Ctx, n: Node, label: string, share: number): Programme {
  const out = { factors: [] as Factor[], sums: [] as { node: Node; inv: boolean }[] };
  flatten(ctx, n, false, out);
  const p: Programme = { label, share, factors: cancel(out.factors) };
  if (out.sums.length && ctx.depth < MAX_DEPTH) {
    // The largest sum splits the chain into branches; any others stay one factor each.
    // Outcomes branch the chain; a sum of costs (a programme's spending lines) is one factor.
    const isCost = (n: Node) => { const f = firstRef(n); return !!f && stepOf(f, ctx.m.byId.get(f)?.label) === "cost"; };
    const [main, ...rest] = out.sums.sort((a, b) => Number(isCost(a.node)) - Number(isCost(b.node)) || valueOfNode(b.node, ctx.look) - valueOfNode(a.node, ctx.look));
    for (const s of rest) p.factors.push(leaf(ctx, s.node, false));
    const ts = termsOf(main.node);
    const vals = ts.map((t) => valueOfNode(t, ctx.look));
    const total = vals.reduce((s, v) => s + v, 0);
    p.branches = ts.map((t, i) => programme({ ...ctx, depth: ctx.depth + 1 }, t, branchLabel(ctx, t), vals[i] / total))
      .filter((b) => b.share > 0.005)
      .sort((a, b) => b.share - a.share);
  }
  return p;
}

function branchLabel(ctx: Ctx, n: Node): string {
  const id = firstRef(n);
  const label = id ? ctx.m.byId.get(id)?.label ?? id : "";
  return label.split(":")[0].replace(/\s*\((USD|before[^)]*)\)/gi, "").trim();
}

const chains = new WeakMap<ResolvedModel, Chain>();

/** A model's chain at the default values, in our view. */
export function chainOf(lib: Library, m: ResolvedModel): Chain | undefined {
  if (!m.output) return undefined;
  const hit = chains.get(m);
  if (hit) return hit;
  const av = assumptionValues(lib.assumptions);
  const values = compute(lib, m, av);
  const look = lookupFor(lib, m, values, av, "charityevals");
  const top = programme({ lib, m, look, depth: 0, budget: { n: 400 } }, { type: "ref", scope: "row", name: m.output.row }, m.name, 1);
  // An imported model's missing-data step sits in the headline, not its rows (docs/normalization.md
  // 2.12): measured, it counts in full; thin, at the slider.
  if (m.missing_data) top.factors.push({ step: "evidence", ref: "$missing_data_discount", label: "For the part of the result that isn't measured", value: missingDataFactor(lib, m, av) });
  const programmes = top.branches?.length ? top.branches : [{ ...top, factors: [] }];
  // A step is there when any part of the result has it (a side effect's own branch needs no chain).
  const every = (p: Programme): Factor[] => [...p.factors, ...(p.branches ?? []).flatMap(every)];
  const has = new Set([...top.factors, ...programmes.flatMap(every)].map((f) => f.step));
  const missing = EXPECTED_STEPS.filter((s) => !has.has(s));
  const chain: Chain = { factors: top.factors, programmes, missing };
  chains.set(m, chain);
  return chain;
}
