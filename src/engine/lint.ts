// Mechanical checks for charityevals' own models (the build-cea / audit-cea skills). They enforce
// the house rules that can be checked without judgment: the model follows its template family,
// every number on the path to the result is a sourced fact, a shared assumption, or a labelled
// judgment with a range and a reason, formulas carry no unexplained constants, and the canonical
// rows sit inside plausible bounds. `npm run check` fails on any high-severity finding.
import type { Node } from "./expr";
import { assumptionValues, compute, hasRange, type Library, type ResolvedModel } from "./model";
import { rowsFeeding } from "./sensitivity";
import { bridgesOf } from "./bridges";
import { CLIMATE_REQUIRED, SAD_FACT_VERSION, TEMPLATES, allowedUnits, perDollarIds, type Family } from "./templates";

/** Does a row read `ref` ($assumption, or @fact; a trailing `.` or `_` is a prefix), itself or
 * through the rows it is computed from? */
function readsRef(m: ResolvedModel, row: string, ref: string): boolean {
  const name = ref.slice(1);
  const prefix = /[._]$/.test(name);
  const hit = (xs: string[]) => xs.some((x) => (prefix ? x.startsWith(name) : x === name));
  return [...upstream(m, row)].some((id) => {
    const r = m.byId.get(id);
    return !!r && (ref.startsWith("$") ? hit(r.assumptionDeps) : hit(r.factDeps));
  });
}

const MARGINAL = "marginal_vs_past_average";
const MISSING = "missing_data_discount";
/** Models built before the missing-data rule of docs/normalization.md 2.12 (published before this date)
 * keep their proxy rows until rebuilt: their missing-data findings are medium, not high. */
export const MISSING_DATA_RULE_DATE = "2026-11-04";
const squash = (f: string) => f.replace(/\s+/g, "");

export type Severity = "high" | "medium" | "low";
export type Finding = { severity: Severity; code: string; row?: string; message: string; fix: string };

/** Constants a formula may contain without a row of their own: identities, halves (triangle areas),
 * percent/thousand/hundred-thousand (rates per 100,000)/million scaling, and calendar conversions.
 * Everything else is a magic number. */
export const ALLOWED_LITERALS = new Set([0, 1, 0.5, 100, 1000, 1e5, 1e6, 12, 52, 365, 365.25, 1e-6]);

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
      add("high", "unit", `unit ${unit} has no exchange rate to the common unit`, "Use a ranked unit (uov, daly, wellby, ced, tco2e).");
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
  const required = [...new Set([...spec.required.filter((r) => r !== spec.perDollar && r !== spec.donor && r !== spec.output), ids.perDollar, ids.donor, ids.output])];
  const legacy = (m.source?.published ?? "") < MISSING_DATA_RULE_DATE;
  for (const r of required) if (!m.byId.has(r)) add(r === "missing_data_adj" && legacy ? "medium" : "high", "required-row", `missing canonical row ${r}`, `Add ${r} as in the ${family} template, or (for an outcome branch that doesn't apply) a row with value 0 and an explainer saying why.`, r);

  const path = rowsFeeding(m);
  const output = m.output?.row;
  if (output && m.byId.has(output)) {
    // The adjustments and the cost must actually reach the bottom line.
    for (const r of ["cost_total", "evidence_adj", "counterfactual_adj", "attribution_share", "total_adj", "donor_cost_share", "missing_data_adj", ...(m.byId.has("implementation_adj") ? ["implementation_adj"] : []), ...(m.byId.has("leverage_funging_adj") ? ["leverage_funging_adj"] : []), ...(m.byId.has("unmodelled_benefits_adj") ? ["unmodelled_benefits_adj"] : [])])
      if (m.byId.has(r) && !path.has(r)) {
        // Multi-branch models (templates.md convention 4) apply branch-level adjustments
        // (`<branch>_counterfactual_adj`) and keep the canonical row as a weighted average for
        // reading only. That is fine as long as every branch's own adjustment reaches the result.
        const branches = m.rows.filter((x) => x.id.endsWith(`_${r}`) && x.id !== r);
        if (r !== "cost_total" && r !== "donor_cost_share" && branches.length && branches.every((b) => path.has(b.id))) {
          // Said in its explainer already: nothing to fix.
          if (!/\b(average|summary|weighted)\b[^.]*\bbranch/i.test(`${m.byId.get(r)?.label ?? ""}. ${m.byId.get(r)?.explainer ?? ""}`))
            add("low", "diagnostic", `${r} is a summary of the branch adjustments (${branches.map((b) => b.id).join(", ")}), not applied itself`, "Say in its explainer that it is the outcome-weighted average of the branches, for reading only.", r);
        }
        else add("high", "unapplied", `${r} is computed but never reaches the bottom line`, `Use ${r} in the chain that leads to ${output}, or (multi-branch models) apply a <branch>_${r} row in every branch.`, r);
      }
    const perDollar = m.byId.get(ids.perDollar);
    if (perDollar && !upstream(m, ids.perDollar).has("cost_total")) add("high", "per-dollar", `${ids.perDollar} doesn't divide by cost_total`, `${ids.perDollar} = outcome_total / cost_total.`, ids.perDollar);
    const donorRow = m.byId.get(ids.donor);
    if (donorRow && !(donorRow.deps.includes(ids.perDollar) && donorRow.deps.includes("donor_cost_share")))
      add("high", "donor", `${ids.donor} should be ${ids.perDollar} * donor_cost_share`, `Set ${ids.donor} = ${ids.perDollar} * donor_cost_share.`, ids.donor);
    // Animal models: the output sums the species step's ced_<species> rows, each from the donor row.
    if (donorRow && ids.donor !== output && !upstream(m, output).has(ids.donor))
      add("high", "species", `${output} doesn't build on ${ids.donor}`, `Split ${ids.donor} by species (sads_<species>), convert each with the ced_<species> template, and sum them into ${output}.`, output);
  }
  const attr = m.byId.get("attribution_share");
  const dcs = m.byId.get("donor_cost_share");
  if (dcs && !dcs.assumptionDeps.includes("resource_shares"))
    add("medium", "salary-sacrifice", "donor_cost_share ignores $resource_shares", "donor_cost_share = cost_total / (cost_total + if($resource_shares, salary_sacrifice, 0)).", "donor_cost_share");

  // Bridges (docs/normalization.md 2.6): a row named as one is the exact bridge formula, so each outcome
  // reaches the headline through its own unit's shared conversion.
  const bridges = new Set(bridgesOf(lib, m).map((b) => b.row));
  for (const r of m.rows)
    if (/^(uov|dalys|wellbys|ced|tco2e)_from_(uov|daly|wellby|ced|tco2e)$/.test(r.id) && r.id !== "wellbys_from_uov" && !bridges.has(r.id))
      add("high", "bridge", `${r.id} is named as a bridge but isn't one`, "Write it as <input> * (<to_common of the input's unit>) / (<to_common of the output unit>), the template's row word for word, in an ours section.", r.id);

  // Missing data (2.12): no programme is valued at other models' result; every branch carries the
  // marker missing_data_adj / <branch>_missing_data_adj, the shared slider or 1 with its reason; a branch
  // whose reach or effect inputs are all judgments reads the slider.
  const ruleSev: Severity = legacy ? "medium" : "high";
  const literature = "Build the programme's chain from the research on its kind of work (meta-analyses and trials: effect per person or per dollar, persistence), with its own spending and reach, wide ranges, and <branch>_missing_data_adj = $missing_data_discount (templates.md Convention 12); other models only as a cross-check named in the explainer.";
  for (const r of m.rows) {
    if (/^proxy_/.test(r.id)) add(ruleSev, "proxy", `${r.id}: the proxy rows are retired (a programme is no longer valued at other models' result)`, literature, r.id);
    else if (r.formula && /median\([^)]*#/.test(r.formula) && path.has(r.id))
      add(ruleSev, "borrowed", `${r.id} takes its value from other models' results (median of #…)`, literature, r.id);
  }
  const down = new Map<string, string[]>();
  for (const r of m.rows) for (const d of r.deps) down.set(d, [...(down.get(d) ?? []), r.id]);
  const isInput = (id: string) => { const r = m.byId.get(id); return !!r && r.formula === undefined && r.value !== undefined; };
  for (const mk of m.rows.filter((r) => /(^|_)missing_data_adj$/.test(r.id))) {
    const f = squash(mk.formula ?? "");
    const branchAverage = mk.id === "missing_data_adj" && mk.deps.some((d) => d.endsWith("_missing_data_adj"));
    if (f !== `$${MISSING}` && f !== "1" && !branchAverage) {
      add("high", "missing-data", `${mk.id} is ${mk.formula ?? "a typed number"}, not $${MISSING} or 1`, `Set ${mk.id} = $${MISSING} where the outcome isn't measured for this charity, or 1 where it is (say why): missing data is discounted one way, by the shared slider.`, mk.id);
      continue;
    }
    if (f !== "1") continue;
    if ((mk.explainer ?? "").length < MIN_EXPLAINER)
      add("high", "missing-data", `${mk.id} is 1 without a reason`, "Say in the explainer what this charity measured: its own count of who got the intervention, and the effect's counterfactual (its own controlled evaluation, or trials of the same intervention delivered the same way).", mk.id);
    // The branch: the row downstream of the marker that reads the fewest reach and effect rows (its outcome).
    const seen = new Set<string>();
    const queue = [...(down.get(mk.id) ?? [])];
    let best: string[] | undefined;
    while (queue.length) {
      const id = queue.shift()!;
      if (seen.has(id)) continue;
      seen.add(id);
      queue.push(...(down.get(id) ?? []));
      const xs = [...upstream(m, id)].filter((x) => ["reach", "effect"].includes(m.byId.get(x)?.section ?? ""));
      if (xs.some(isInput) && (!best || xs.length < best.length)) best = xs;
    }
    if (!best) continue;
    // Evidence in a section: an input that isn't a judgment, or a shared fact that isn't one (another
    // model's result read live is no evidence about this charity).
    for (const sec of ["reach", "effect"]) {
      const xs = best.filter((x) => m.byId.get(x)!.section === sec);
      const judged = xs.filter((x) => isInput(x) && m.byId.get(x)!.kind === "judgment");
      const evidence = xs.some((x) => {
        const r = m.byId.get(x)!;
        return (isInput(x) && r.kind !== "judgment") || r.factDeps.some((k) => lib.facts.get(k)?.kind !== "judgment");
      });
      if (judged.length && !evidence)
        add(ruleSev, "missing-data", `${mk.id} is 1 but its branch's ${sec} rests on judgment only (${judged.join(", ")})`, `Set ${mk.id} = $${MISSING}: an outcome resting on judgment, not on this charity's own data, is counted less by the shared slider (docs/normalization.md 2.12).`, mk.id);
    }
  }

  // When the estimate was made: the estimate-age slider counts from it (docs/normalization.md 2.11).
  const s = m.source;
  if (!s?.published || Number.isNaN(new Date(s.published).getTime()))
    add("high", "published", "no source.published date", 'Set "source": { "publisher": "charityevals", "title": …, "url": "https://charityevals.org/<id>", "published": "<the date the model was built, YYYY-MM-DD>", "retrieved": … }: the estimate-age discount counts from it.');
  else if (s.publisher !== "charityevals") add("medium", "published", `source.publisher is ${s.publisher}`, 'A charityevals model is published by "charityevals".');
  if (m.theoretical) add("high", "theoretical", "a charityevals model is flagged theoretical", "build-cea models are built from the charity's own work; remove the flag (an idea-stage model is an import, docs/normalization.md decision 2026-10-31 #1).");

  // What the model's dollar is (INV-18): past averages, and only past averages, read the next-dollar slider.
  const basis = m.estimate_basis;
  const marginalReaders = m.rows.filter((r) => r.assumptionDeps.includes(MARGINAL));
  if (!basis) add("high", "estimate-basis", "no estimate_basis", `Set "estimate_basis": past_average (past spending over past wins: campaigns, policy, research, money moved), marginal (a forecast of planned work) or unit_cost (a price per item delivered). The ${family} template's is ${spec.basis}.`);
  else {
    if (basis === "past_average" && !marginalReaders.some((r) => path.has(r.id)))
      add("high", "estimate-basis", "a past average whose result doesn't read $marginal_vs_past_average", 'Add the row marginal_vs_past_average = $marginal_vs_past_average (`published` 1) in the donor section and multiply the per-donor-dollar row by it.');
    if (basis !== "past_average")
      for (const r of marginalReaders) add("high", "estimate-basis", `reads $${MARGINAL} but estimate_basis is ${basis}`, "Only a past average takes the next-dollar slider: remove the row, or set estimate_basis to past_average if the cost is past spending over past wins.", r.id);
    if (basis !== spec.basis && !spec.altBasis?.includes(basis))
      add("low", "estimate-basis", `estimate_basis ${basis}; ${family} models are usually ${spec.basis}`, "Say in the summary or the cost explainer why this charity's dollar is different.");
  }

  // The site's one way for each shared concept the family needs (docs/normalization.md 2.7-2.10).
  for (const rd of spec.reads)
    if (m.byId.has(rd.row) && !readsRef(m, rd.row, rd.ref))
      add(rd.severity ?? "high", "shared", `${rd.row} doesn't read ${rd.ref}`, `Read ${rd.ref}…: ${rd.why}.`, rd.row);
  if (unit === "tco2e")
    for (const r of CLIMATE_REQUIRED) if (!m.byId.has(r) || (r === "years_until_avoided" && !path.has(r)))
      add("high", "required-row", `a climate model needs ${r} on its path`, "Start from the policy-research-meta-climate template (docs/normalization.md 2.5).", r);

  // Deaths by age band, never the all-ages figure where the ages are known; depression stays in WELLBYs.
  for (const r of m.rows) {
    if (r.factDeps.includes("moral_weights.uov_per_death_over5"))
      add("medium", "age-band", "values deaths at the all-ages over-five figure", "Use the band of the deaths' ages (@moral_weights.uov_per_death_age_5_14, _15_49, _50_74), or say in the explainer that the ages are unknown.", r.id);
    if (unit === "wellby" && r.factDeps.includes("depression.dalys_per_phq9_point_year"))
      add("high", "exchange-rate", "a WELLBY model converts depression into DALYs", "Stay in WELLBYs (@wellby_factors.wellbys_per_sd_year; PHQ-9 points ÷ @depression.phq9_sd for SDs): the WELLBY unit's conversion is calibrated on depression.", r.id);
    // A currency rate is the site's (@fx), never typed in.
    if (r.formula === undefined && r.value !== undefined && (/^fx_/.test(r.id) || /\b[Ee]xchange rate\b|\b[Cc]urrency (rate|conversion)\b|\b[A-Z]{3} per (US ?)?(\$|USD|dollar)\b|\b(US ?)?(\$|USD|dollars?) per [A-Z]{3}\b/.test(r.label)))
      add("high", "fx", "a currency rate typed in", "Multiply the local-currency row by @fx.usd_per_<cur>_<year> (the IRS yearly average, else the World Bank's; scripts/link-fx.py adds a missing one).", r.id);
  }

  // The species step: the ced row's SAD version is the version of the shared figure it divides.
  for (const r of m.rows) {
    const mm = /^ced_([a-z]+?)(?:_(2024|2025))?$/.exec(r.id);
    if (!mm || !r.formula) continue;
    const v = new RegExp(`@aim_sads\\.${mm[1]}_(\\d{4})`).exec(r.formula)?.[1];
    const versions = new Set([...upstream(m, r.id)].flatMap((id) => m.byId.get(id)?.factDeps ?? []).map((f) => SAD_FACT_VERSION[f]).filter(Boolean));
    if (v && versions.size && !versions.has(v))
      add("high", "sad-version", `${r.id} divides by Ambitious Impact's ${v} weight, but the SADs figure it converts is ${[...versions].join(" and ")} SADs`, `Use @aim_sads.${mm[1]}_${[...versions][0]} in ${r.id} (and, with figures of both versions, a second pair sads_${mm[1]}_<v> / ced_${mm[1]}_<v>).`, r.id);
  }

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
    if (f && !f.source?.url && f.kind !== "judgment") add("medium", "fact-source", `fact @${key} has no source URL`, "Add the source to the facts file.", `@${key}`);
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
