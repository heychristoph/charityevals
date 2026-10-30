// Mechanical checks for charityevals' own models (the build-cea / audit-cea skills). They enforce
// the house rules that can be checked without judgment: the model follows its template family,
// every number on the path to the result is a sourced fact, a shared assumption, or a labelled
// judgment with a range and a reason, formulas carry no unexplained constants, and the canonical
// rows sit inside plausible bounds. `npm run check` fails on any high-severity finding.
import type { Node } from "./expr";
import { assumptionValues, compute, hasRange, type Library, type ResolvedModel } from "./model";
import { rowsFeeding } from "./sensitivity";
import { TEMPLATES, allowedUnits, perDollarIds, type Family } from "./templates";

export type Severity = "high" | "medium" | "low";
export type Finding = { severity: Severity; code: string; row?: string; message: string; fix: string };

/** Constants a formula may contain without a row of their own: identities, halves (triangle areas),
 * percent/thousand/million scaling, and calendar conversions. Everything else is a magic number. */
export const ALLOWED_LITERALS = new Set([0, 1, 0.5, 100, 1000, 1e6, 12, 52, 365, 365.25, 1e-6]);

const MIN_EXPLAINER = 60;
const STALE_MONTHS = 18;

/** Every numeric constant in a formula, in order (shared with src/engine/invariants.ts INV-4). */
export function literals(n: Node | undefined, out: number[] = []): number[] {
  if (!n) return out;
  if (n.type === "num") out.push(n.value);
  else if (n.type === "neg") literals(n.arg, out);
  else if (n.type === "bin") { literals(n.left, out); literals(n.right, out); }
  else if (n.type === "call") n.args.forEach((a) => literals(a, out));
  return out;
}

/** Every row the given row reads, directly or through other rows. */
function upstream(m: ResolvedModel, id: string): Set<string> {
  const seen = new Set<string>();
  const walk = (r: string) => {
    if (seen.has(r)) return;
    seen.add(r);
    m.byId.get(r)?.deps.forEach(walk);
  };
  walk(id);
  return seen;
}

function monthsSince(date: string, today: Date): number | undefined {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return undefined;
  return (today.getFullYear() - d.getFullYear()) * 12 + today.getMonth() - d.getMonth();
}

export function lintModel(lib: Library, m: ResolvedModel, today = new Date()): Finding[] {
  const out: Finding[] = [];
  const add = (severity: Severity, code: string, message: string, fix: string, row?: string) => out.push({ severity, code, row, message, fix });

  if (m.owner !== "charityevals") {
    add("high", "owner", `owner is ${m.owner || "missing"}; build-cea models are owned by charityevals`, `Set "owner": "charityevals".`);
  }
  const family = m.template as Family | undefined;
  if (!family || !TEMPLATES[family]) {
    add("high", "template", "no template family", `Set "template" to one of ${Object.keys(TEMPLATES).join(", ")}.`);
    return out;
  }
  const spec = TEMPLATES[family];
  if (!m.summary || m.summary.length < 120)
    add("medium", "summary", "summary missing or shorter than two sentences", "Write a plain-language summary: what the charity does, the bottom line, the biggest uncertainty.");
  if (m.evaluator) add("low", "evaluator", "charityevals models have no evaluator view", "Remove the evaluator block.");

  // Output and unit.
  const unit = m.output?.unit ?? "";
  const ids = perDollarIds(family, unit);
  if (!m.output) add("high", "output", "no output row", `Add "output": { "row": "${ids.output}", ... }.`);
  else {
    if (!allowedUnits(family).includes(unit))
      add("high", "unit", `output unit ${unit} is not allowed for ${family} (allowed: ${allowedUnits(family).join(", ")})`, "Report in the family's unit so the model is ranked on the common scale.");
    if (!lib.assumptions.units[unit]?.to_common)
      add("high", "unit", `unit ${unit} has no exchange rate to the common unit`, "Use a ranked unit (uov, sad, wellby, daly).");
    if (m.output.row !== ids.output) add("high", "output", `output row is ${m.output.row}, template says ${ids.output}`, `Point output.row at ${ids.output}.`);
  }

  // Sections.
  const sectionIds = m.sections.map((s) => s.id);
  const missingSections = spec.sections.filter((s) => !sectionIds.includes(s));
  if (missingSections.length) add("medium", "sections", `missing sections: ${missingSections.join(", ")}`, `Use the template's sections in order: ${spec.sections.join(" → ")}.`);
  else {
    const order = sectionIds.filter((s) => spec.sections.includes(s));
    if (order.join() !== spec.sections.join()) add("low", "sections", `sections out of order: ${order.join(" → ")}`, `Order them ${spec.sections.join(" → ")}.`);
  }

  // Required canonical rows.
  const required = [...spec.required.filter((r) => r !== spec.perDollar && r !== spec.output), ids.perDollar, ids.output];
  for (const r of required) if (!m.byId.has(r)) add("high", "required-row", `missing canonical row ${r}`, `Add ${r} as in the ${family} template, or (for an outcome branch that doesn't apply) a row with value 0 and an explainer saying why.`, r);

  const path = rowsFeeding(m);
  const output = m.output?.row;
  if (output && m.byId.has(output)) {
    // The adjustments and the cost must actually reach the bottom line.
    for (const r of ["cost_total", "evidence_adj", "counterfactual_adj", "attribution_share", "total_adj", "donor_cost_share", ...(m.byId.has("implementation_adj") ? ["implementation_adj"] : []), ...(m.byId.has("leverage_funging_adj") ? ["leverage_funging_adj"] : []), ...(m.byId.has("unmodelled_benefits_adj") ? ["unmodelled_benefits_adj"] : [])])
      if (m.byId.has(r) && !path.has(r)) {
        // Multi-branch models (templates.md convention 4) apply branch-level adjustments
        // (`<branch>_counterfactual_adj`) and keep the canonical row as a weighted average for
        // reading only. That is fine as long as every branch's own adjustment reaches the result.
        const branches = m.rows.filter((x) => x.id.endsWith(`_${r}`) && x.id !== r);
        if (r !== "cost_total" && r !== "donor_cost_share" && branches.length && branches.every((b) => path.has(b.id)))
          add("low", "diagnostic", `${r} is a summary of the branch adjustments (${branches.map((b) => b.id).join(", ")}), not applied itself`, "Say in its explainer that it is the outcome-weighted average of the branches.", r);
        else add("high", "unapplied", `${r} is computed but never reaches the bottom line`, `Use ${r} in the chain that leads to ${output}, or (multi-branch models) apply a <branch>_${r} row in every branch.`, r);
      }
    const perDollar = m.byId.get(ids.perDollar);
    if (perDollar && !upstream(m, ids.perDollar).has("cost_total")) add("high", "per-dollar", `${ids.perDollar} doesn't divide by cost_total`, `${ids.perDollar} = outcome_total / cost_total.`, ids.perDollar);
    const out = m.byId.get(output);
    if (out && !(out.deps.includes(ids.perDollar) && out.deps.includes("donor_cost_share")))
      add("high", "donor", `${output} should be ${ids.perDollar} * donor_cost_share`, `Set ${output} = ${ids.perDollar} * donor_cost_share.`, output);
  }
  const attr = m.byId.get("attribution_share");
  const dcs = m.byId.get("donor_cost_share");
  if (dcs && !dcs.assumptionDeps.includes("resource_shares"))
    add("medium", "salary-sacrifice", "donor_cost_share ignores $resource_shares", "donor_cost_share = cost_total / (cost_total + if($resource_shares, salary_sacrifice, 0)).", "donor_cost_share");

  // Rows: sourcing, ranges, magic numbers, placeholders.
  for (const r of m.rows) {
    const onPath = path.has(r.id);
    if ((r.explainer ?? "").includes("TEMPLATE")) add("high", "placeholder", "template placeholder text left in the explainer", "Replace it with what this number is, where it comes from and why it is that size.", r.id);
    if (r.node) {
      const bad = [...new Set(literals(r.node).filter((v) => !ALLOWED_LITERALS.has(v)))];
      if (bad.length) add("medium", "magic-number", `formula contains the constant(s) ${bad.join(", ")}`, "Move each constant into an input row with a source (or a judgment with a range and a reason), and reference the row.", r.id);
      continue;
    }
    if (r.value === undefined) continue;
    const src = r.source ?? {};
    if (r.kind === "observed" || r.kind === "estimate") {
      if (!src.url) add(onPath ? "high" : "medium", "source", `${r.kind} input has no source URL`, "Cite the document the number comes from (url), or relabel it as a judgment with a range and a reason.", r.id);
      if (!src.retrieved) add("medium", "retrieved", "source has no retrieval date", 'Add "retrieved": "YYYY-MM-DD".', r.id);
      else {
        const months = monthsSince(src.retrieved, today);
        if (months === undefined) add("medium", "retrieved", `retrieval date ${src.retrieved} isn't a date`, "Use YYYY-MM-DD.", r.id);
      }
      if (!src.quote && !src.page && !src.cell) add("medium", "locator", "source says where but not which passage", "Add a short verbatim quote, or the page/table/cell the number is on.", r.id);
    }
    if (r.kind === "judgment") {
      if ((r.explainer ?? "").length < MIN_EXPLAINER) add(onPath ? "high" : "medium", "rationale", "judgment without a stated rationale", "Say in the explainer why this value, and what the low and high ends represent.", r.id);
      if (onPath && !hasRange(r.value) && r.format !== "toggle" && r.id !== "donation")
        add("medium", "range", "judgment with no low/high range", "Give the judgment a low/best/high range so it shows up in the sensitivity analysis.", r.id);
    } else if (onPath && (r.kind === "estimate") && !hasRange(r.value)) {
      add("low", "range", "estimate with no range", "If the source gives a confidence interval or the estimate is uncertain, give it as low/high.", r.id);
    }
    if (!onPath && r.id !== "donation") add("low", "unused", "input doesn't feed the bottom line", "Delete it, or mark it as context in the explainer.", r.id);
  }

  // Facts used: they need sources too.
  for (const key of new Set(m.rows.flatMap((r) => r.factDeps))) {
    const f = lib.facts.get(key);
    if (f && !f.source?.url) add("medium", "fact-source", `fact @${key} has no source URL`, "Add the source to the facts file.", `@${key}`);
    const months = f?.source?.retrieved ? monthsSince(f.source.retrieved, today) : undefined;
    if (months !== undefined && months > STALE_MONTHS) add("low", "stale", `fact @${key} was retrieved ${months} months ago`, "Check it is still current.", `@${key}`);
  }

  // Values: finite, inside the template's bounds.
  const vals = compute(lib, m, assumptionValues(lib.assumptions));
  for (const id of path) {
    const v = vals[id];
    if (!Number.isFinite(v)) add("high", "non-finite", `${id} evaluates to ${v}`, "Fix the formula or its inputs.", id);
  }
  for (const [id, [lo, hi]] of Object.entries(spec.bounds)) {
    if (!m.byId.has(id)) continue;
    const v = vals[id];
    if (Number.isFinite(v) && (v < lo || v > hi)) add("high", "bounds", `${id} = ${+v.toPrecision(4)} is outside the plausible range [${lo}, ${hi}] for ${family}`, "Check the unit and the source; if the value is right, argue for it in the explainer (the auditor decides).", id);
  }
  if (output && Number.isFinite(vals[output]) && vals[output] <= 0) add("high", "non-positive", `bottom line is ${vals[output]}`, "Check signs and the outcome chain.", output);
  return out;
}

export const SEVERITY_ORDER: Record<Severity, number> = { high: 0, medium: 1, low: 2 };
