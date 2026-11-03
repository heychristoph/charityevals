// Consistency invariants from docs/normalization.md (section 3 and "Decided 2026-10-30"), checked
// mechanically against today's models. Today's schema has none of the metadata the design adds
// (output.native, output.species, section kinds, the `ced` unit), so each check derives what it can
// from what exists, and says where it can't. Used by src/engine/normalization.test.ts (with an
// allowlist that only shrinks) and scripts/normalization-audit.ts (the full report).
import { evaluate, refs, type Node } from "./expr";
import { ALLOWED_LITERALS, literals } from "./lint";
import {
  AGE_DISCOUNT, assumptionValues, bottomLine, compute, conversionLookup, estimateAge, headline, headlineConversion, inputValue, modelDepsOf, perHealthyYearPer1000,
  pickValue, referencedModels, usedAssumptions, viewAssumptions,
  type Library, type ResolvedModel, type ResolvedRow,
} from "./model";
import { CAREER_CHANGE_FORMULA, MARGINAL_ASSUMPTION, MOVED_DOLLAR_FORMULAS, MOVED_MONEY_ROWS, SUCCESS_FACT, sameFormula } from "./moved-money";
import { isSideSheet, rankingPlan } from "./ranking";
import { rowsFeeding } from "./sensitivity";

export type Violation = {
  /** Invariant id, e.g. "INV-2b". */
  inv: string;
  model: string;
  /** Stable locator inside the model (row id, assumption, "model"): with `model`, the allowlist key. */
  where: string;
  detail: string;
};

export type Status = "checked" | "partial" | "not checked";

export type InvariantReport = {
  id: string;
  title: string;
  status: Status;
  /** How the check works today, and what it can't see. */
  how: string;
  /** Models the check looked at. */
  checked: number;
  violations: Violation[];
  /** Matches the check dropped as likely false positives, with why (counts only). */
  suppressed?: Record<string, number>;
  /** Flags settled by hand as not violations (normalization-waivers.json). */
  waived?: number;
};

export const keyOf = (v: Pick<Violation, "model" | "where">) => `${v.model} ${v.where}`;

/** Units the design ranks in: tco2e is climate's, converted through the deaths a tonne causes. */
export const RANKED_UNITS = ["uov", "daly", "wellby", "ced", "tco2e"];
/** Rates that convert between causes: they belong in a unit's conversion, never in a model row. */
export const CROSS_CAUSE = ["daly_per_sad", "daly_per_wellby", "sads_per_animal_spared", "chicken_vs_person", "daly_per_disabling_day", "deaths_per_tco2e", "climate_heat_share", "climate_heat_death_delay"];
const ANIMAL_ASSUMPTIONS = ["chicken_vs_person", "daly_per_sad"];

/** WELLBY models value deaths the site's way, in units of value, and put them into WELLBYs in one
 * fixed row that the unit's conversion cancels (docs/normalization.md 2.3, INV-17): the only row a
 * model may read the WELLBY rate in. */
export const WELLBY_FROM_UOV = { row: "wellbys_from_uov", input: "uov_valued_outside_wellbys", formula: "uov_valued_outside_wellbys / ($daly_per_wellby * $uov_per_daly)" };
const isWellbyFromUov = (m: ResolvedModel, r: ResolvedRow) =>
  m.output?.unit === "wellby" && r.id === WELLBY_FROM_UOV.row && r.formula !== undefined && r.formula.replace(/\s+/g, "") === WELLBY_FROM_UOV.formula.replace(/\s+/g, "");

/** Bridges (docs/normalization.md 2.6): a model whose work has outcomes in several units (a social
 * service's WELLBYs, income and health; a conservation programme's tonnes and illness) counts each
 * in its own unit, sums it in a row `<input>`, and puts it into the output unit in one row whose
 * formula is exactly `<input> * (<to_common of its unit>) / (<to_common of the output unit>)`, in an
 * ours section. The output unit's conversion multiplies it back, so each outcome reaches the headline
 * through its own unit's shared conversion, and moves with its own sliders only. wellbys_from_uov is
 * the bridge from uov into WELLBYs. */
export function bridgeFormula(input: string, from: string, to: string, units: Record<string, { to_common?: string }>): string {
  const tf = units[from]?.to_common, tt = units[to]?.to_common;
  return `${input}${tf === "1" ? "" : ` * (${tf})`}${tt === "1" ? "" : ` / (${tt})`}`;
}
export type Bridge = { row: string; input: string; from: string };
/** The bridges a model has: rows of one of its ours sections whose formula is a bridge into its output unit. */
export function bridgesOf(lib: Library, m: ResolvedModel): Bridge[] {
  const to = m.output?.unit;
  if (!to || !lib.assumptions.units[to]?.to_common) return [];
  const out: Bridge[] = [];
  for (const r of m.rows) {
    const input = r.formula && /^\s*([A-Za-z_][A-Za-z0-9_]*)/.exec(r.formula)?.[1];
    if (!input || !m.byId.has(input)) continue;
    for (const from of RANKED_UNITS)
      if (from !== to && lib.assumptions.units[from]?.to_common && squash(r.formula!) === squash(bridgeFormula(input, from, to, lib.assumptions.units))) { out.push({ row: r.id, input, from }); break; }
  }
  return out;
}
/** Rows a bridge's formula reads besides its input (a tco2e bridge: air_pollution_weight, extra_deaths_per_tco2e). */
const bridgeRows = (m: ResolvedModel, b: Bridge) => (m.byId.get(b.row)?.deps ?? []).filter((d) => d !== b.input);

const close = (a: number, b: number, rel = 1e-9) => a === b || Math.abs(a - b) <= rel * Math.max(Math.abs(a), Math.abs(b));
const fmt = (x: number) => (Number.isFinite(x) ? String(+x.toPrecision(6)) : String(x));

/** Rows this model wrote itself: not inherited unchanged from the model it extends. A variant's
 * inherited rows are checked once, on the parent. */
const ownRows = (m: ResolvedModel) => m.rows.filter((r) => !r.inheritedFrom || r.overridden?.length);

/** Models a ranking could pick: charities with an output, not side sheets. */
export function rankable(m: ResolvedModel): boolean {
  return m.kind === "charity" && !!m.output && !isSideSheet(m);
}

// ---------------------------------------------------------------------------------------------
// Words: crude matching of a row's label to a fact's or assumption's.

const STOP = new Set(["the", "and", "for", "per", "from", "with", "that", "this", "into", "are", "was", "its", "one", "all", "via", "each", "who", "has", "not", "under", "over", "than", "ace", "givewell", "hli", "aim", "value", "number", "share", "estimate", "average", "result"]);
export function words(s: string): Set<string> {
  return new Set(
    s.toLowerCase().replace(/[_\-]/g, " ").split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 3 && !STOP.has(w) && !/^\d+$/.test(w))
      .map((w) => w.replace(/(ies)$/, "y").replace(/(?<=[a-z]{3})s$/, "")),
  );
}
/** How alike two labels read: significant words shared, over the smaller and the larger set. */
export function likeness(a: string, b: string): { shared: number; ofSmaller: number; ofLarger: number } {
  const A = words(a), B = words(b);
  const shared = [...A].filter((w) => B.has(w)).length;
  return { shared, ofSmaller: shared / Math.max(1, Math.min(A.size, B.size)), ofLarger: shared / Math.max(1, A.size, B.size) };
}
/** At least two shared significant words, half the smaller label's. */
export function resembles(a: string, b: string): boolean {
  const l = likeness(a, b);
  return l.shared >= 2 && l.ofSmaller >= 0.5;
}

/** Significant digits of a number as written (0.0011 → 2, 116.25262 → 8). */
function sigDigits(x: number): number {
  const s = Math.abs(x).toExponential().split("e")[0].replace(".", "").replace(/0+$/, "");
  return Math.max(1, s.length);
}

// ---------------------------------------------------------------------------------------------

/** INV-1: every model a ranking could pick reports in a ranked unit. */
export function inv1(lib: Library): InvariantReport {
  const models = [...lib.models.values()].filter(rankable);
  const violations = models.filter((m) => !RANKED_UNITS.includes(m.output!.unit)).map((m) => ({
    inv: "INV-1", model: m.id, where: "output.unit",
    detail: `reports in ${m.output!.unit} (${lib.assumptions.units[m.output!.unit]?.to_common ?? "no conversion"}); ranked units are ${RANKED_UNITS.join(", ")}`,
  }));
  return {
    id: "INV-1", title: "Every ranked model reports in a ranked unit", status: "checked", checked: models.length, violations,
    how: `Models of kind charity with an output that aren't side sheets (what rankingPlan can pick) must have output.unit in {${RANKED_UNITS.join(", ")}}.`,
  };
}

/** INV-2a: the headline is the native result times the unit's conversion times the factor for the
 * estimate's age (charityevals view). */
export function inv2a(lib: Library, av = assumptionValues(lib.assumptions)): InvariantReport {
  const models = [...lib.models.values()].filter((m) => m.output && headlineConversion(lib, m.output.unit));
  const violations: Violation[] = [];
  for (const m of models) {
    const vals = compute(lib, m, av);
    const native = vals[m.output!.row];
    const age = estimateAge(lib, m) ?? 0;
    const factor = AGE_DISCOUNT in av ? (1 + av[AGE_DISCOUNT]) ** -age : 1;
    const want = native * evaluate(headlineConversion(lib, m.output!.unit)!, conversionLookup(lib, av, vals)) * factor;
    const got = headline(lib, m, av);
    if (!(close(got, want) || (Number.isNaN(got) && Number.isNaN(want))))
      violations.push({ inv: "INV-2a", model: m.id, where: "headline", detail: `headline ${fmt(got)} ≠ native ${fmt(native)} × conversion × age factor ${fmt(factor)} = ${fmt(want)}` });
    // The common result `#id` references and the rankings read is the same number in units of value.
    const common = bottomLine(lib, m, av).common;
    if (!(close(common, got * perHealthyYearPer1000(av)) || (Number.isNaN(got) && Number.isNaN(common))))
      violations.push({ inv: "INV-2a", model: m.id, where: "bottomLine.common", detail: `common result ${fmt(common)} ≠ headline ${fmt(got)} × a healthy year's value / 1000` });
  }
  return {
    id: "INV-2a", title: "Headline = native result × the unit's conversion × the estimate's age factor (our view)", status: "checked", checked: models.length, violations,
    how: "headline(m) in the charityevals view against compute(m)[output] × evaluate(headlineConversion(unit)) × (1 + $estimate_age_discount)^−age, age from source.published to common.estimate_age_as_of (2.11); and bottomLine(m).common, what `#id` and the rankings read, against the headline × $uov_per_daly / 1000. The evaluator view is INV-8 (no age factor). Whether each unit's conversion is the standard recipe is INV-1 (sad and animals_spared have no standard recipe).",
  };
}

/** INV-2b: no row reads a cross-cause rate; $uov_per_daly only where the evaluator view pins it. */
export function inv2b(lib: Library): InvariantReport {
  const violations: Violation[] = [];
  const models = [...lib.models.values()];
  for (const m of models) {
    const pinned = m.evaluator?.assumptions ?? {};
    const oursSections = new Set(m.sections.filter((x) => x.kind === "ours").map((x) => x.id));
    const bridges = bridgesOf(lib, m);
    const bridgeIds = new Set(bridges.map((b) => b.row));
    for (const r of ownRows(m)) {
      if (bridgeIds.has(r.id) && !isWellbyFromUov(m, r)) {
        // A bridge into the output unit (2.6): in one of our sections; what it bridges is in its own
        // unit, so (like every other row) it reads no cross-cause rate, which the general rule checks.
        if (!(r.section && oursSections.has(r.section))) violations.push({ inv: "INV-2b", model: m.id, where: `${r.id} section`, detail: `${r.id} bridges ${bridges.find((b) => b.row === r.id)!.from} into ${m.output!.unit} but sits outside an ours section` });
        continue;
      }
      if (isWellbyFromUov(m, r)) {
        // The sanctioned WELLBY row: in one of our sections, and what it converts reads no WELLBY rate.
        if (!(r.section && oursSections.has(r.section))) violations.push({ inv: "INV-2b", model: m.id, where: `${r.id} section`, detail: `${r.id} puts units of value into WELLBYs but sits outside an ours section` });
        if ([...upstream(m, WELLBY_FROM_UOV.input)].some((id) => m.byId.get(id)?.assumptionDeps.includes("daly_per_wellby")))
          violations.push({ inv: "INV-2b", model: m.id, where: `${WELLBY_FROM_UOV.input} $daly_per_wellby`, detail: `${WELLBY_FROM_UOV.input} must be in units of value, reading no WELLBY rate` });
        continue;
      }
      for (const a of r.assumptionDeps) {
        if (CROSS_CAUSE.includes(a))
          violations.push({ inv: "INV-2b", model: m.id, where: `${r.id} $${a}`, detail: `row reads cross-cause rate $${a}: ${r.formula}` });
        else if (a === "uov_per_daly" && !(a in pinned))
          violations.push({ inv: "INV-2b", model: m.id, where: `${r.id} $${a}`, detail: `row reads $uov_per_daly but the evaluator view doesn't pin it${m.evaluator ? "" : " (no evaluator view)"}` });
      }
    }
    // A row the unit's conversion reads (climate's air_pollution_weight) is ours and reads no shared
    // assumption: the model supplies how much of the rate applies, the rate stays shared.
    const ours = new Set(m.sections.filter((x) => x.kind === "ours").map((x) => x.id));
    const feedsConv = new Set<string>();
    const walk = (id: string) => { if (feedsConv.has(id)) return; feedsConv.add(id); m.byId.get(id)?.deps.forEach(walk); };
    // Rows a bridge's formula reads besides its input (a tco2e bridge's air_pollution_weight) follow the same rule.
    const convRows = [...m.conversionRows, ...bridges.flatMap((b) => bridgeRows(m, b))];
    convRows.forEach(walk);
    for (const id of convRows) {
      const r = m.byId.get(id);
      if (r && !(r.section && ours.has(r.section)))
        violations.push({ inv: "INV-2b", model: m.id, where: `${id} section`, detail: `row ${id} is read by the ${m.output!.unit} conversion but sits outside an ours section` });
    }
    for (const id of feedsConv) for (const a of m.byId.get(id)?.assumptionDeps ?? [])
      violations.push({ inv: "INV-2b", model: m.id, where: `${id} $${a}`, detail: `row ${id} feeds the ${m.output!.unit} conversion and reads $${a}` });
  }
  return {
    id: "INV-2b", title: "No model row reads a cross-cause rate", status: "checked", checked: models.length, violations,
    how: `Every row a model wrote itself (variants: only rows they override): assumptionDeps ∩ {${CROSS_CAUSE.map((a) => "$" + a).join(", ")}} must be empty, and $uov_per_daly only where evaluator.assumptions pins it. Bridges are exempt (docs/normalization.md 2.6): a row in an ours section whose formula is exactly <input> * (<to_common of a ranked unit>) / (<to_common of the output unit>), which the output unit's conversion cancels, so the outcome in <input> reaches the headline through its own unit's shared conversion; WELLBY models' ${WELLBY_FROM_UOV.row} = ${WELLBY_FROM_UOV.formula} is the bridge from uov (INV-17), and what it converts reads no WELLBY rate. Rows a bridge reads besides its input (a tco2e bridge's air_pollution_weight) are held to the conversion-row rule below. The one sanctioned way a model shapes its conversion is a row the unit's to_common names by a fixed id (tco2e: air_pollution_weight, docs/normalization.md 2.5): it must sit in an ours section, and neither it nor any row feeding it may read a shared assumption.`,
  };
}

// --- INV-2c: one consistent way (owner, 2026-10-31) -------------------------------------------------

/** Kinds of conversion an evaluator may make inside its own model that charityevals makes one shared
 * way: each is matched on an input row's id and label. */
const UNIT = String.raw`(wellbys?|dalys?|qalys?|units? of value|uov|ln ?\(?(?:income|consumption)\)?|doubl\w+|(?:child[- ])?life[- ]equivalents?|healthy years?)`;
export const CONVERSION_KINDS: [string, RegExp][] = [
  // An exchange rate between two outcomes: WELLBYs per DALY, ln(income) equivalent to a DALY.
  ["exchange rate between outcomes", new RegExp(String.raw`\b${UNIT}\b[^.;]{0,30}\b(per|equivalent to|in)\b[^.;$]{0,20}?\b${UNIT}\b|\b(daly|wellby|qaly)[- ]equivalents? per (death|daly|doubl)`, "i")],
  // A value put on a death or a life saved.
  ["value of a death", /\b(value|worth|wellbys?|dalys?|qalys?|units? of value|uov)\b[^.;]{0,40}\b(per|of|averting|for|equivalent to)\b[^.;]{0,25}\b(deaths?|lives? saved|saving an? (child|person|life))\b/i],
  // Depression measured on a scale, counted as a health loss.
  ["depression scale to health", /\bphq\b[^.;]{0,40}\b(daly|weight|rather|healthy)\b|\b(daly|disability) weight(ing)? per\b|depression[^.;]{0,30}counts as|rather experience nothing/i],
  // A cash benchmark: what a dollar given as cash is worth, the denominator of "multiples of cash".
  ["cash benchmark", /\b(units? of value|uov|value generated)\b[^.;]{0,50}\b(givedirectly|give ?directly'?s?|cash transfers?)\b(?![^.;]*relative to)|\b(givedirectly|give directly)\b[^.;]{0,20}\b(units? of value|uov)\b|\bbenchmark\b[^.;]{0,30}\b(units? of value|uov|per dollar)\b|\b(units? of value|uov)\b[^.;]{0,30}\bbenchmark\b|\bcash benchmark\b|\bcost per[^.;]{0,30}life equivalent[^.;]{0,20}givedirectly/i],
  // A currency rate between pounds or euros and dollars (local currencies in GiveWell sheets stay theirs).
  ["exchange rate between currencies", /\b(gbp|eur|usd)[ _:]?(to|per|\/|:)[ _]?(usd|gbp|eur)\b|\b(dollars?|usd|\$) per (pound|euro|£|€)|\b(pounds?|euros?|£|€) per (dollar|usd|\$)|\bexchange rate\b[^.;]{0,30}\b(pound|euro|gbp|eur|sterling)/i],
  // A time-preference discount rate typed in rather than read from $discount_rate.
  ["discount rate", /^(?![^]*\b(fad\w*|decay\w*|persist\w*|uncertain\w*|forecast\w*|funders?|replic\w*|table|get worse|opportunit\w*)\b)[^]*\b(time )?discount rate\b/i],
];
/** Facts holding an evaluator's own conversion (not a shared one): our view may read one only where
 * it cancels, or where it undoes the evaluator's own conversion to recover what it measured. */
export const EVALUATOR_CONVERSION_FACTS = ["founders_pledge.wellbys_per_daly", "founders_pledge.wellbys_per_doubling", "founders_pledge.gd_cost_per_wellby"];

/** INV-2c: in our view, no evaluator's own conversion between outcomes, value of a death, depression
 * weight, cash benchmark, currency rate or time discount moves the headline: each reads the shared
 * version, the evaluator's figure kept in `published`. Found by perturbation: the input (or fact) is
 * moved ×1.25 in our view and the headline must not move, so a rate the model applies and undoes,
 * or one on a side calculation, passes. */
export function inv2c(lib: Library, av = assumptionValues(lib.assumptions)): InvariantReport {
  const violations: Violation[] = [];
  const models = [...lib.models.values()].filter((m) => m.output && headlineConversion(lib, m.output.unit));
  const moves = (m: ResolvedModel, h0: number, inputs: Record<string, number>) => {
    const h = headline(lib, m, av, inputs);
    return !(close(h, h0, 1e-9) || (Number.isNaN(h) && Number.isNaN(h0)));
  };
  for (const m of models) {
    const h0 = headline(lib, m, av);
    if (!Number.isFinite(h0) || h0 === 0) continue;
    const path = rowsFeeding(m);
    const vals = compute(lib, m, av);
    for (const r of ownRows(m)) {
      if (!path.has(r.id) || r.formula !== undefined) continue;
      const kind = CONVERSION_KINDS.find(([k, re]) => re.test(r.label) || (k !== "discount rate" && re.test(r.id.replace(/_/g, " "))));
      if (!kind || !Number.isFinite(vals[r.id]) || vals[r.id] === 0) continue;
      if (moves(m, h0, { [r.id]: vals[r.id] * 1.25 }))
        violations.push({ inv: "INV-2c", model: m.id, where: r.id, detail: `${kind[0]}: input "${r.label}" = ${fmt(vals[r.id])} is the evaluator's own and moves our headline; read the shared fact or assumption, keep the evaluator's number in \`published\`` });
    }
    const facts = new Set(m.rows.filter((r) => path.has(r.id)).flatMap((r) => r.factDeps).filter((f) => EVALUATOR_CONVERSION_FACTS.includes(f)));
    for (const f of facts) {
      const v = pickValue(lib.facts.get(f)?.value);
      if (moves(m, h0, { [`@${f}`]: v * 1.25 }))
        violations.push({ inv: "INV-2c", model: m.id, where: `@${f}`, detail: `our headline moves with the evaluator's own conversion @${f} (${fmt(v)}): use the shared rate, or apply it only to undo the evaluator's own conversion of a figure it published` });
    }
  }
  return {
    id: "INV-2c", title: "No evaluator's own conversion in our view", status: "partial", checked: models.length, violations,
    how: `Every input row on the path to the output (variants: their overrides) whose id and label name one of ${CONVERSION_KINDS.length} kinds of conversion (${CONVERSION_KINDS.map(([k]) => k).join("; ")}), and every read of a fact holding an evaluator's own conversion (${EVALUATOR_CONVERSION_FACTS.map((f) => "@" + f).join(", ")}), is moved ×1.25 in our view: the headline must not move. A literal that matters is the evaluator's own conversion: the row must read the shared fact or assumption, with the evaluator's figure in \`published\` (rows reading a shared value are formulas, so they aren't candidates). Heuristic on labels: a conversion under other words isn't seen, and a flagged row that isn't a conversion gets a waiver with its reason.`,
  };
}

// --- INV-3: species ---------------------------------------------------------------------------

const SPECIES: [string, RegExp][] = [
  ["chicken", /\b(hens?|chickens?|broilers?|layers?|laying|poultry|cage[- ]free|caged|eggs?|bcc|ecc)\b/i],
  ["pig", /\b(pigs?|sows?|gestation|pork|swine)\b/i],
  ["shrimp", /\bshrimps?\b/i],
  ["fish", /\b(fish|fishes|salmon|carp|aquatic)\b/i],
  ["cattle", /\b(cows?|cattle|beef|dairy)\b/i],
  ["wild animals", /\b(wild|insects?)\b/i],
  ["mixed (meals or animals spared)", /\b(meals?|animals spared|vegan|vegetarian|plant[- ]based|leaflets?|pledge)\b/i],
];

export function speciesOf(m: ResolvedModel): string[] {
  const path = rowsFeeding(m);
  const text = m.rows.filter((r) => path.has(r.id)).map((r) => `${r.id.replace(/_/g, " ")} ${r.label}`).join("\n");
  return SPECIES.filter(([, re]) => re.test(text)).map(([s]) => s);
}

/** The species step's formula for each source: AIM SADs (weight out, ours in) or raw days of pain.
 * AIM's weights changed between SAD versions, so the AIM template names the version `v` whose weight
 * is built into the figure divided (`@aim_sads.<s>_<v>`). The evaluator branch divides every version
 * by the 2024 hen, the weight the evaluator views pin `$chicken_vs_person` to, so ACE's SADs reproduce
 * as SADs whatever their version. A model with figures of two versions for one species adds a second
 * row `ced_<s>_<v>` reading `sads_<s>_<v>`. */
export const AIM_VERSIONS = ["2024", "2025"];
export const CED_TEMPLATES = {
  aim: (s: string, v: string, row = s) => `sads_${row} / @aim_sads.${s}_${v} * if($rp_species_weights, @welfare_ranges.${s}_vs_chicken, @aim_sads.${s}_${v} / @aim_sads.chicken_2024)`,
  raw: (s: string) => `pain_days_${s} * @welfare_ranges.${s}_vs_chicken`,
};
const squash = (f: string) => f.replace(/\s+/g, "");
const SPECIES_FACT = (f: string) => f.startsWith("welfare_ranges.") || f.startsWith("aim_sads.");

export function inv3(lib: Library): InvariantReport {
  const models = [...lib.models.values()].filter((m) => m.cause === "animal-welfare" && m.output);
  const violations: Violation[] = [];
  for (const m of models) {
    const out = m.output!;
    const path = rowsFeeding(m);
    const species = out.species ?? [];
    if (out.unit !== "ced" || !species.length) {
      const guessed = speciesOf(m);
      violations.push({
        inv: "INV-3", model: m.id, where: "model",
        detail: `reports in ${out.unit}${species.length ? "" : " and declares no output.species"}; species guessed from labels: ${guessed.join(", ") || "not derivable"}`,
      });
      continue;
    }
    const isTemplate = (s: string, f: string | undefined, versions = AIM_VERSIONS, row?: string) =>
      f !== undefined && [...versions.map((v) => CED_TEMPLATES.aim(s, v, row ?? s)), ...(row ? [] : [CED_TEMPLATES.raw(s)])].some((t) => squash(t) === squash(f));
    for (const s of species) {
      const r = m.byId.get(`ced_${s}`);
      const ok = isTemplate(s, r?.formula);
      if (!r || !ok || !path.has(r.id) || !r.factDeps.includes(`welfare_ranges.${s}_vs_chicken`))
        violations.push({
          inv: "INV-3", model: m.id, where: `ced_${s}`,
          detail: !r ? `declares species ${s} but has no ced_${s} row` : !ok ? `ced_${s} isn't the standard template: ${r.formula}` : !path.has(r.id) ? `ced_${s} doesn't feed the output` : `ced_${s} doesn't read @welfare_ranges.${s}_vs_chicken`,
        });
      // A second SAD version for the same species: ced_<s>_<v>, same template on sads_<s>_<v>.
      for (const v of AIM_VERSIONS) {
        const r2 = m.byId.get(`ced_${s}_${v}`);
        if (!r2) continue;
        if (!isTemplate(s, r2.formula, [v], `${s}_${v}`) || !path.has(r2.id))
          violations.push({ inv: "INV-3", model: m.id, where: r2.id, detail: !path.has(r2.id) ? `${r2.id} doesn't feed the output` : `${r2.id} isn't the standard template for version ${v}: ${r2.formula}` });
      }
    }
    for (const r of m.rows)
      if (!/^ced_/.test(r.id) && r.factDeps.some(SPECIES_FACT))
        violations.push({ inv: "INV-3", model: m.id, where: `${r.id} species weight`, detail: `only ced_* rows may read species weights: ${r.formula}` });
  }
  return {
    id: "INV-3", title: "Every animal model passes through the species step, once per species, from the shared table", status: "checked", checked: models.length, violations,
    how: "Animal models must report in ced and declare output.species. For each species s there is a row ced_<s> whose formula equals the standard template (AIM SADs: sads_<s> / @aim_sads.<s>_<v> * if($rp_species_weights, @welfare_ranges.<s>_vs_chicken, @aim_sads.<s>_<v> / @aim_sads.chicken_2024), v the SAD version, 2024 or 2025, whose weight is built into the figure; a second version for the same species goes in ced_<s>_<v> on sads_<s>_<v>; raw days: pain_days_<s> * @welfare_ranges.<s>_vs_chicken) up to whitespace, reads @welfare_ranges.<s>_vs_chicken and feeds the output. No other row reads @welfare_ranges.* or @aim_sads.*. Not checked: that every path from a SAD or pain-day row to the output passes through a ced_* row (rows carry no unit to tell).",
  };
}

// --- INV-4: literals standing in for shared numbers ---------------------------------------------

type Shared = { ref: string; label: string; values: number[]; best: number; place?: string; sameLabelOnly?: boolean };

/** Facts made by grouping identical labels (INV-14's house constants): a copy of one has the same label,
 * so only a row with that label (places dropped) is matched to it, on its best value; labels merely
 * alike, or a range end, are other figures that happen to share a round number. */
const SAME_LABEL_FILES = new Set(["givewell_common", "staff_pay"]);

/** Facts files about one country (givewell_kenya, malawi): a row copying one must be about that country. */
const PLACES = ["kenya", "malawi", "uganda", "india", "chad", "mozambique", "rwanda", "burkina_faso", "nigeria", "drc"];

function sharedNumbers(lib: Library): Shared[] {
  const out: Shared[] = [];
  for (const f of lib.facts.values()) {
    const v = f.value;
    if (v === undefined) continue;
    const values = typeof v === "number" ? [v] : [v.low, v.best, v.high].filter((x): x is number => typeof x === "number");
    const file = f.key.split(".")[0];
    const same = SAME_LABEL_FILES.has(file);
    // A house constant's plain label is ours; copies in the sheets carry the sheet's own wording, kept in source.quote.
    out.push({ ref: `@${f.key}`, label: same ? f.source?.quote ?? f.label : f.label, values: same ? [pickValue(v)] : [...new Set(values)], best: pickValue(v), place: file === "household_size" ? f.key.split(".")[1].replace(/_(rural|high_coverage_districts)$/, "").replace(/_/g, " ") : PLACES.find((p) => file === p || file.endsWith(`_${p}`))?.replace("_", " "), sameLabelOnly: same || undefined });
  }
  for (const a of lib.assumptions.rows) {
    if (a.format === "toggle") continue;
    out.push({ ref: `$${a.id}`, label: a.label, values: [pickValue(a.value)], best: pickValue(a.value) });
  }
  return out;
}

/** Words for a shared number that a row's label may use instead of the shared label's: a row whose id
 * or label matches the first pattern resembles the shared values the second names. */
export const INV4_SYNONYMS: [RegExp, RegExp][] = [
  // ln(consumption) by one unit, a doubled income, a doubling of consumption: $uov_per_ln_consumption.
  [/\bln\s*\(?\s*(consumption|income)\b|\bdoubl\w*\b[^.;]{0,20}\b(income|consumption)\b|\b(income|consumption)\b[^.;]{0,20}\bdoubl/i, /^\$uov_per_ln_consumption$/],
  // A DALY weight, a disability weight, "(DW)": the GBD weights.
  [/\b(daly|disability) weights?\b|\(dw\)|\bdw\b/i, /^@(gbd_disability_weights|depression\.dw_)/],
  // GiveDirectly's (previous) cost-effectiveness, a cash benchmark, units of value per dollar of cash: @cash.
  [/\bgivedirectly\b[^.;]{0,40}\b(cost[- ]effectiveness|units? of value|estimate)\b|\bcash benchmark\b|\bunits? of value per (dollar|\$)[^.;]{0,30}\bcash\b/i, /^@cash\./],
];
/** Input values this close to a shared value count as copies (GiveWell's 0.003355 for @cash's 0.00335). */
const INV4_TOLERANCE = 2e-3;

export function inv4(lib: Library): InvariantReport {
  const shared = sharedNumbers(lib);
  const violations: Violation[] = [];
  const suppressed: Record<string, number> = {};
  const drop = (why: string) => { suppressed[why] = (suppressed[why] ?? 0) + 1; };
  const models = [...lib.models.values()];
  for (const m of models) {
    for (const r of ownRows(m)) {
      const text = `${r.id.replace(/_/g, " ")} ${r.label}`;
      const placeOk = (s: Shared) => !s.place || text.toLowerCase().includes(s.place);
      if (r.formula === undefined && r.value !== undefined) {
        // An input whose value equals a fact's or assumption's low/best/high, and whose label reads like it.
        const x = pickValue(r.value);
        for (const s of shared) {
          const hit = s.values.find((sv) => close(x, sv, INV4_TOLERANCE));
          if (hit === undefined) continue;
          if (s.sameLabelOnly && labelKey(r.label) !== labelKey(s.label.replace(/\((GiveWell)\)\s*$/, ""))) { drop("input equals a house-constant fact but under another label"); continue; }
          const synonym = INV4_SYNONYMS.some(([row, ref]) => row.test(text) && ref.test(s.ref));
          if (!synonym && !resembles(text, s.label)) { drop("input equals a shared value but its label doesn't resemble the shared one's"); continue; }
          const like = likeness(text, s.label);
          if (!synonym && !s.values.some((sv) => close(x, sv)) && like.ofLarger < 0.5) { drop("input within 0.2% of a shared value (not equal) and labels only loosely alike"); continue; }
          if (!placeOk(s)) { drop("input equals a country fact but is about another place"); continue; }
          if (!synonym && words(s.label).size < 3 && like.ofLarger < 0.75) { drop("shared label too generic (under three significant words) for a loose match"); continue; }
          if (!synonym && sigDigits(hit) <= 1 && like.ofLarger < 0.6) { drop("round value (one significant digit) and labels only loosely alike"); continue; }
          violations.push({ inv: "INV-4", model: m.id, where: `${r.id} = ${s.ref}`, detail: `input "${r.label}" = ${fmt(x)} is a literal copy of ${s.ref} (${fmt(hit)}, "${s.label}")` });
        }
      } else if (r.node) {
        // A constant inside a formula equal to a shared value's best guess.
        // Exponents (a variance's `^ 2`) are arithmetic, not figures.
        const exps = new Set<number>();
        const walkExp = (n: Node): void => { if (n.type === "bin") { if (n.op === "^" && n.right.type === "num") exps.add(n.right.value); walkExp(n.left); walkExp(n.right); } else if (n.type === "neg") walkExp(n.arg); else if (n.type === "call") n.args.forEach(walkExp); };
        walkExp(r.node as Node);
        for (const c of new Set(literals(r.node as Node).filter((v) => !ALLOWED_LITERALS.has(v) && !exps.has(v)))) {
          for (const s of shared) {
            if (!close(c, s.best, 1e-9) || s.sameLabelOnly) continue;
            const distinctive = sigDigits(c) >= 5 && !Number.isInteger(c);
            if (!distinctive && !resembles(text, s.label) && !INV4_SYNONYMS.some(([row, ref]) => row.test(text) && ref.test(s.ref))) { drop("formula constant equals a shared value but is short (< 5 significant digits, or an integer) and the row label doesn't resemble it"); continue; }
            // A short constant in one of a sheet's own calculations (a variance weight of 2, a 1.1 multiplier) only
            // stands in for a shared figure when the labels are close, not merely alike.
            if (!distinctive && sigDigits(c) <= 2 && likeness(text, s.label).ofLarger < 0.75) { drop("formula constant is short (one or two significant digits) and the row label only loosely resembles the shared one"); continue; }
            if (!placeOk(s)) { drop("formula constant equals a country fact but the row is about another place"); continue; }
            violations.push({ inv: "INV-4", model: m.id, where: `${r.id} ${fmt(c)} = ${s.ref}`, detail: `formula constant ${fmt(c)} equals ${s.ref} ("${s.label}"): ${r.formula!.slice(0, 160)}` });
          }
        }
      }
    }
  }
  return {
    id: "INV-4", title: "No literal stands in for a shared fact or assumption", status: "partial", checked: models.length, violations, suppressed,
    how: "Facts have no `match` pattern yet, so (a) an input row is flagged when its value equals a fact's or assumption's low/best/high (within 0.2%) AND its id+label shares at least two significant words (half the smaller label) with the fact's label, or uses one of the synonyms for it (ln(consumption) or a doubled income for $uov_per_ln_consumption; a DALY or disability weight or (DW) for the GBD weights; GiveDirectly's cost-effectiveness or a cash benchmark for @cash); near-equal (not equal) values without a synonym, one-significant-digit values (0.5, 1000) and facts with generic labels (\"Average household size\") need closer labels (50%, 60%, 75% of the larger word set); a country fact (givewell_kenya…) only matches rows naming that country; (b) a formula constant outside lint's ALLOWED_LITERALS is flagged when it equals a fact's or assumption's best value exactly and either has 5+ significant digits and isn't an integer (116.25262, 73.1914) or the row label resembles the shared label. Rows a model wrote itself only (variants: overrides). The evaluator's own number is still a violation: it belongs in `published` on a row that reads the fact. Heuristic by nature (values and words, not meaning); it can't see a copy whose label uses other words (\"CFR\" for case fatality rate), a copy rounded beyond 0.1% or rescaled (a percent written as 12, a rate per 1,000), a short formula constant under an unlike label, a shared number that isn't in facts/ or assumptions yet, or a country fact for a place outside its list; and a matching label can still be a coincidence (normalization-waivers.json).",
  };
}

// --- INV-5 / INV-6 / INV-8: the evaluator view --------------------------------------------------

/** Rows feeding a row (itself included): the evaluator's layer, when the row is output.native. */
function upstream(m: ResolvedModel, id: string): Set<string> {
  const seen = new Set<string>();
  const walk = (x: string) => { if (seen.has(x)) return; seen.add(x); m.byId.get(x)?.deps.forEach(walk); };
  walk(id);
  return seen;
}

/** Models whose evaluator layer the invariants check: an evaluator's model with an output. */
const evaluatorModels = (lib: Library) => [...lib.models.values()].filter((m) => m.evaluator && m.output && m.owner !== "charityevals");
const noNative = (inv: string, m: ResolvedModel): Violation => ({
  inv, model: m.id, where: "output.native", detail: "declares no output.native, so nothing says where the evaluator's model ends",
});

/** INV-5: moving any assumption the evaluator's layer reads, in our view only, leaves the evaluator
 * view's numbers where they were. */
export function inv5(lib: Library, av = assumptionValues(lib.assumptions)): InvariantReport {
  const toggles = new Set(lib.assumptions.rows.filter((a) => a.format === "toggle").map((a) => a.id));
  const models = evaluatorModels(lib);
  const violations: Violation[] = [];
  for (const m of models) {
    const native = m.output!.native?.row;
    if (!native) { violations.push(noNative("INV-5", m)); continue; }
    const pins = m.evaluator!.assumptions;
    // The evaluator's layer: the bottom line and everything feeding it, plus every row in an
    // evaluator section (side figures a bridge may read).
    const ours = new Set(m.sections.filter((x) => x.kind === "ours").map((x) => x.id));
    const layer = upstream(m, native);
    for (const r of m.rows) if (!(r.section && ours.has(r.section))) layer.add(r.id);
    const read = new Set(m.rows.filter((r) => layer.has(r.id)).flatMap((r) => r.assumptionDeps));
    // Rows that must stay put: the whole layer, which includes every row reproducing one of the
    // evaluator's figures (`expected`) and the native row.
    const watched = [...layer];
    const base = compute(lib, m, av, {}, "evaluator");
    for (const a of [...read].sort()) {
      const users = m.rows.filter((r) => layer.has(r.id) && r.assumptionDeps.includes(a)).map((r) => r.id).slice(0, 3).join(", ");
      if (toggles.has(a)) {
        // A switch inside the evaluator's rows (GiveWell's leverage and funging adjustments) is fine
        // as long as the evaluator view sets it to the evaluator's position.
        if (!(a in pins)) violations.push({ inv: "INV-5", model: m.id, where: `$${a}`, detail: `the evaluator's rows (${users}) switch on toggle $${a}, but the evaluator view doesn't pin it` });
        continue;
      }
      const moved = new Set<string>();
      for (const k of [0.5, 1.5]) {
        const vals = compute(lib, m, { ...av, [a]: av[a] === 0 ? k - 0.5 : av[a] * k }, {}, "evaluator");
        for (const id of watched) if (!(close(vals[id], base[id], 1e-9) || (Number.isNaN(vals[id]) && Number.isNaN(base[id])))) moved.add(id);
      }
      if (moved.size)
        violations.push({ inv: "INV-5", model: m.id, where: `$${a}`, detail: `the evaluator's rows (${users}) read $${a}; moved ±50% in our view, the evaluator view moves too (${[...moved].slice(0, 3).join(", ")}${moved.size > 3 ? ", …" : ""}): pin it in evaluator.assumptions` });
    }
  }
  return {
    id: "INV-5", title: "The evaluator view uses the evaluator's own rates", status: "checked", checked: models.length, violations,
    how: "Every evaluator model with an output (variants too, with their own inputs) must declare output.native; its evaluator layer is the native row, every row feeding it and every other row outside sections of kind \"ours\". Each non-toggle assumption a row in that layer reads is moved to ×0.5 and ×1.5 in our view (0 → 0.5 and 1): no row of the layer may move in the evaluator view, so every `expected` still reproduces and the bottom line stays the evaluator's. A pin in evaluator.assumptions passes by construction; an unpinned assumption passes only if no evaluator row's value depends on it. Each toggle the layer reads (GiveWell's leverage and funging switches on $resource_shares) must be pinned, so the evaluator view sees the evaluator's position.",
  };
}

/** INV-6: the native row, or one of its direct inputs, carries the evaluator's figure (`expected`). */
export function inv6(lib: Library): InvariantReport {
  const models = evaluatorModels(lib).filter((m) => m.kind !== "variant");
  const violations: Violation[] = [];
  for (const m of models) {
    const native = m.output!.native?.row;
    if (!native) { violations.push(noNative("INV-6", m)); continue; }
    const r = m.byId.get(native)!;
    if (r.expected === undefined && !r.deps.some((d) => m.byId.get(d)?.expected !== undefined))
      violations.push({ inv: "INV-6", model: m.id, where: "model", detail: `neither the native row ${native} nor its direct inputs (${r.deps.slice(0, 4).join(", ") || "none: it is an input"}) carry \`expected\`: nothing shows the evaluator's bottom line reproduces` });
  }
  return {
    id: "INV-6", title: "The evaluator's bottom line reproduces", status: "checked", checked: models.length, violations,
    how: "Every evaluator model with an output (not variants: they inherit output.native and don't inherit `expected`) declares output.native, and that row or one of its direct inputs carries `expected`; scripts/check.ts checks those values reproduce in the evaluator view.",
  };
}

/** INV-8: the evaluator view's headline converts at the evaluator's pinned rates. */
export function inv8(lib: Library, av = assumptionValues(lib.assumptions)): InvariantReport {
  const models = [...lib.models.values()].filter((m) => m.evaluator && m.output && headlineConversion(lib, m.output.unit));
  const violations: Violation[] = [];
  for (const m of models) {
    const va = viewAssumptions(m, av, "evaluator");
    const vals = compute(lib, m, av, {}, "evaluator");
    const native = vals[m.output!.row];
    const want = native * evaluate(headlineConversion(lib, m.output!.unit)!, conversionLookup(lib, va, vals));
    const got = headline(lib, m, av, {}, "evaluator");
    if (!(close(got, want, 1e-9) || (Number.isNaN(got) && Number.isNaN(want)))) {
      const pins = Object.entries(m.evaluator!.assumptions).filter(([a, v]) => v !== av[a]).map(([a, v]) => `$${a}=${v}`).join(", ");
      violations.push({ inv: "INV-8", model: m.id, where: "headline(evaluator)", detail: `evaluator headline ${fmt(got)} converts at our rates; at the evaluator's pinned rates (${pins}) it is ${fmt(want)} (${fmt((got / want - 1) * 100)}%)` });
    }
  }
  return {
    id: "INV-8", title: "One view, one set of numbers", status: "checked", checked: models.length, violations,
    how: `headline(m, av, {}, "evaluator") against compute(evaluator view)[output] × the unit's conversion evaluated with viewAssumptions(m, av, "evaluator"). Fails wherever a pin changes a rate in the conversion ($uov_per_daly for uov models).`,
  };
}

// --- INV-9: shared levers reach the models that need them -----------------------------------------

const MORTALITY = /\b(deaths?|mortality|lives saved|life saved|lives? lost|under[- ]?(5|five) deaths?)\b/i;
/** Deaths of plants and trees (One Acre Fund's seedlings) aren't people's. */
const NOT_PEOPLE = /\b(seedlings?|trees?|plants?|crops?|livestock)\b/i;
const MULTI_YEAR = /\b(discount(ing|ed)?[ _]?(rate|factor)|discounted|present value|\bnpv\b|years? of (benefits?|impact|effects?)|duration of (the )?(benefit|effect|impact)|(benefit|effect) duration|annuity|decay)\b/i;
/** "Absorption discount factor" (iron fortification) is about bioavailability, not time. */
const NOT_TIME = /absorption|bioavailab/i;

function readsOnPath(m: ResolvedModel, path: Set<string>, a: string, lib?: Library) {
  // The unit's conversion counts as on the path: climate's applies $life_value_multiplier itself.
  const conv = lib && m.output ? headlineConversion(lib, m.output.unit) : undefined;
  return (!!conv && refs(conv).assumptions.has(a)) || m.rows.some((r) => path.has(r.id) && r.assumptionDeps.includes(a));
}

export function inv9(lib: Library): InvariantReport {
  const models = [...lib.models.values()].filter((m) => m.output && m.kind !== "variant");
  const violations: Violation[] = [];
  // Labels, not ids: imported ids are truncated mid-word ("..._with_die" for "with dietary").
  const text = (r: ResolvedRow) => r.label;
  for (const m of models) {
    const path = rowsFeeding(m);
    const onPath = m.rows.filter((r) => path.has(r.id));
    const deaths = onPath.filter((r) => MORTALITY.test(text(r)) && !NOT_PEOPLE.test(text(r)));
    if (deaths.length && !readsOnPath(m, path, "life_value_multiplier", lib))
      violations.push({ inv: "INV-9", model: m.id, where: "$life_value_multiplier", detail: `${deaths.length} rows on the path about deaths (e.g. ${deaths.slice(0, 3).map((r) => r.id).join(", ")}) but nothing on the path reads $life_value_multiplier` });
    const years = onPath.filter((r) => MULTI_YEAR.test(text(r)) && !NOT_TIME.test(text(r)));
    if (years.length && !readsOnPath(m, path, "discount_rate")) {
      const literal = years.filter((r) => r.formula === undefined && /discount/i.test(text(r)));
      violations.push({ inv: "INV-9", model: m.id, where: "$discount_rate", detail: `${years.length} rows on the path about discounting or years of benefit (e.g. ${years.slice(0, 3).map((r) => r.id).join(", ")})${literal.length ? `, literal discount inputs ${literal.map((r) => `${r.id}=${fmt(inputValue(r, "charityevals"))}`).slice(0, 3).join(", ")}` : ""}, but nothing on the path reads $discount_rate` });
    }
  }
  return {
    id: "INV-9", title: "Shared levers reach every model they apply to", status: "partial", checked: models.length, violations,
    how: "Models don't declare mortality/multi_year yet, so keywords in the labels of rows on the path to the output stand in: deaths/mortality/lives saved (not seedlings, trees, crops) → some row on the path must read $life_value_multiplier; discount rate/factor, present value, years or duration of benefit/effect, decay (not iron absorption discount factors) → some row on the path must read $discount_rate. Variants are checked through their parent. Heuristic by nature (keywords, not declarations); it can't see deaths valued under another name (DALYs or years of life lost, \"lives\" without \"saved\"), benefits spread over years without the keywords, or a lever read on one branch of the path while another branch values deaths or years with literals; and it flags sheets where the words are context only (normalization-waivers.json).",
  };
}

/** An input that counts how many years a benefit, change or flow of money lasts. */
const YEARS_OF = /\b(years? of (the )?(change|impact|benefits?|effects?|production|funding|coverage|higher coverage|government funds|reallocation|policy|polic(y|ies)|reform|treatment costs)|number of (future )?years|for how many (future )?years|years? (that|for which|over which)[^.;]{0,40}\b(utili[sz]ed|last|lasts|persist\w*|counted|funded?)|duration of (the )?(benefits?|effects?|impact|change)|(benefit|effect|impact)s? (duration|last(s|ing)? for)|years the (wellbeing )?(benefit|effect|change)s? last)\b/i;

/** INV-9b: a benefit counted over several years is discounted. Per input row, not per model (INV-9
 * passes a model that reads $discount_rate on one branch while another sums years at face value):
 * each input row on the path whose label counts the years a benefit lasts is moved ×1.25 in our
 * view at the default rate and at 0; if the headline moves by the same factor both times, those
 * years are added up undiscounted. */
export function inv9b(lib: Library, av = assumptionValues(lib.assumptions)): InvariantReport {
  const models = [...lib.models.values()].filter((m) => m.output && headlineConversion(lib, m.output.unit));
  const violations: Violation[] = [];
  const r0 = av.discount_rate;
  const hi = { ...av, discount_rate: Math.max(0.08, r0 * 2) };
  const zero = { ...av, discount_rate: 0 };
  for (const m of models) {
    const path = rowsFeeding(m);
    const vals = compute(lib, m, av);
    for (const r of ownRows(m)) {
      if (!path.has(r.id) || r.formula !== undefined || !YEARS_OF.test(r.label) || NOT_TIME.test(r.label)) continue;
      const v = vals[r.id];
      if (!Number.isFinite(v) || v <= 1) continue;
      const gain = (a: Record<string, number>) => {
        const h0 = headline(lib, m, a), h1 = headline(lib, m, a, { [r.id]: v * 1.25 });
        return Number.isFinite(h0) && h0 !== 0 ? h1 / h0 : NaN;
      };
      const g0 = gain(zero), g1 = gain(hi);
      // Moves the headline, and by the same factor whatever the rate: summed at face value.
      if (Number.isFinite(g0) && g0 > 1 + 1e-9 && close(g0, g1, 1e-9))
        violations.push({ inv: "INV-9b", model: m.id, where: r.id, detail: `"${r.label}" = ${fmt(v)} years: moving it ×1.25 moves our headline ×${fmt(g0)} at a 0% and at a ${fmt(hi.discount_rate * 100)}% discount rate alike, so the years are added up undiscounted; discount them at $discount_rate (pinned to the evaluator's rate, 0 if none, in the evaluator view)` });
    }
  }
  return {
    id: "INV-9b", title: "Benefits over several years are discounted", status: "partial", checked: models.length, violations,
    how: "Every input row on the path to the output (variants: their overrides) whose label counts how long a benefit, change, coverage or flow of money lasts (years of change/impact/benefit/production/funding, number of years, duration of the effect) and is above 1 is moved ×1.25 in our view, once at a 0% discount rate and once at max(8%, twice the default): if the headline rises, and by the same factor at both rates, those years are added up at face value and must be discounted at $discount_rate. Heuristic on labels: years counted under other words aren't seen, and a frozen present value (a cached PV typed in as a number) isn't either.",
  };
}

/** INV-5b: every evaluator pin is read. A pin in evaluator.assumptions that no row (and not the
 * unit's conversion) reads does nothing: either the model has the concept and some row must read the
 * shared lever (a death valued without $life_value_multiplier), or the pin should go. */
export function inv5b(lib: Library): InvariantReport {
  const models = [...lib.models.values()].filter((m) => m.evaluator && Object.keys(m.evaluator.assumptions).length);
  const violations: Violation[] = [];
  for (const m of models) {
    const conv = m.output ? headlineConversion(lib, m.output.unit) : undefined;
    const read = new Set([...m.rows.flatMap((r) => r.assumptionDeps), ...(conv ? refs(conv).assumptions : [])]);
    for (const a of Object.keys(m.evaluator!.assumptions))
      if (!read.has(a)) violations.push({ inv: "INV-5b", model: m.id, where: `evaluator.assumptions.${a}`, detail: `the evaluator view pins $${a} = ${m.evaluator!.assumptions[a]}, but no row and not the ${m.output?.unit ?? "(no output)"} conversion reads it: read the shared lever where the model has the concept, or drop the pin` });
  }
  return {
    id: "INV-5b", title: "Every evaluator pin is read", status: "checked", checked: models.length, violations,
    how: "For every model with evaluator.assumptions, each pinned assumption must be read by some row of the model (inherited rows count) or by its output unit's conversion. An unread pin is either a lever the model should read (a death valued without $life_value_multiplier, years without $discount_rate) or dead weight to drop.",
  };
}

// --- INV-10: each slider moves exactly the models it should ---------------------------------------

type Shape = "linear" | "independent";
function expectations(unit: string, animal: boolean): [string, Shape][] {
  if (animal)
    return [["chicken_vs_person", "linear"], ["daly_per_sad", "linear"], ["uov_per_daly", "independent"], ["daly_per_wellby", "independent"], ["uov_per_ln_consumption", "independent"], ["deaths_per_tco2e", "independent"]];
  const base: [string, Shape][] = ANIMAL_ASSUMPTIONS.map((a) => [a, "independent"]);
  // Climate: a tonne is worth the deaths it causes, each valued like an adult's death.
  if (unit === "tco2e") return [...base, ["deaths_per_tco2e", "linear"], ["life_value_multiplier", "linear"], ["daly_per_wellby", "independent"], ["uov_per_ln_consumption", "independent"]];
  base.push(["deaths_per_tco2e", "independent"], ["climate_heat_death_delay", "independent"]);
  // WELLBYs (without the deaths valued outside them, INV-17) convert in healthy years: proportional to
  // the WELLBY rate, independent of the healthy-year rate, like DALYs.
  if (unit === "wellby") return [...base, ["daly_per_wellby", "linear"], ["uov_per_daly", "independent"], ["uov_per_ln_consumption", "independent"]];
  if (unit === "daly") return [...base, ["daly_per_wellby", "independent"]];
  return [...base, ["daly_per_wellby", "independent"]];
}

export function inv10(lib: Library, av = assumptionValues(lib.assumptions)): InvariantReport {
  const models = [...lib.models.values()].filter((m) => m.output && headlineConversion(lib, m.output.unit));
  const violations: Violation[] = [];
  for (const m of models) {
    // What a bridge brings in from another unit (a WELLBY model's deaths in units of value; 2.6) is
    // held at 0 for the output unit's expectations and checked against its own unit's below.
    const bridges = bridgesOf(lib, m);
    const held: Record<string, number> = Object.fromEntries(bridges.map((b) => [b.input, 0]));
    // A model that reads others live (`#id`, a meta charity's destinations) moves with every slider
    // they move: no independence is expected for those.
    const inherited = new Set(referencedModels(lib, m).flatMap((t) => usedAssumptions(lib, t)));
    const check = (part: (a: Record<string, number>) => number, unit: string, animal: boolean, where: string) => {
      const h0 = part(av);
      if (!Number.isFinite(h0) || h0 === 0) return;
      for (const [a, shape] of expectations(unit, animal)) {
        if (shape === "independent" && inherited.has(a)) continue;
        const at = (k: number) => part({ ...av, [a]: av[a] * k });
        const h2 = at(1.5);
        const ok = shape === "linear" ? close(h2, 1.5 * h0, 1e-9) && close(at(0.5), 0.5 * h0, 1e-9) : close(h2, h0, 1e-9);
        if (!ok)
          violations.push({ inv: "INV-10", model: m.id, where: `${where}$${a} ${shape}`, detail: `${where ? `the part bridged from ${unit} ` : "headline "}should be ${shape === "linear" ? "proportional to" : "independent of"} $${a}: ${fmt(h0)} at default, ${fmt(h2)} at ×1.5 (${fmt((h2 / h0 - 1) * 100)}%)` });
      }
    };
    check((a) => headline(lib, m, a, held), m.output!.unit, m.cause === "animal-welfare", "");
    // WELLBY models' deaths are INV-17's; every other bridged part moves like a model of its own unit.
    for (const b of bridges) if (!isWellbyFromUov(m, m.byId.get(b.row)!))
      check((a) => headline(lib, m, a) - headline(lib, m, a, { [b.input]: 0 }), b.from, b.from === "ced", `${b.row} `);
  }
  return {
    id: "INV-10", title: "Each slider moves exactly the models it should", status: "checked", checked: models.length, violations,
    how: "At the defaults, each headline is recomputed with one assumption ×1.5 (and ×0.5 for linearity). Animal models: proportional to $chicken_vs_person and $daly_per_sad (the design's $daly_per_disabling_day), independent of $uov_per_daly, $daly_per_wellby, $uov_per_ln_consumption. Climate (tco2e) models: proportional to $deaths_per_tco2e and $life_value_multiplier, independent of the animal assumptions, $daly_per_wellby and $uov_per_ln_consumption. Others: independent of the animal assumptions, $deaths_per_tco2e, $climate_heat_death_delay and $daly_per_wellby, except WELLBY models, which are proportional to $daly_per_wellby and independent of $uov_per_daly and $uov_per_ln_consumption (with the deaths they value outside their WELLBYs, uov_valued_outside_wellbys, held at 0: INV-17 checks those). Every bridge's input (docs/normalization.md 2.6) is held at 0 for the output unit's expectations, and the part it brings in (headline − headline with the input at 0) must move as a model of its own unit would (a uov part independent of the animal, WELLBY and climate rates; a ced part proportional to the animal ones). Models with a zero or non-finite headline are skipped. A model that reads other models live (`#id`) is not expected to be independent of an assumption those models read.",
  };
}

// --- Same physical change, same SADs figure (decision 3) --------------------------------------------

type Transition = { id: string; label: string; fact?: string; test: (text: string) => boolean };
export const TRANSITIONS: Transition[] = [
  {
    id: "hen-battery-to-cage-free", label: "Hen moved from a battery cage to cage-free, SADs per hen(-year)", fact: "sad_factors.sads_per_hen_year_cage_to_aviary",
    test: (t) => /\bsads?\b/i.test(t) && /\b(hens?|layers?|laying)\b/i.test(t) && /(cage[- ]free|aviary|cage to|battery|per hen per year|hen-year)/i.test(t) && !(/enriched|furnished/i.test(t) && !/battery/i.test(t)),
  },
  {
    id: "hen-enriched-to-cage-free", label: "Hen moved from an enriched cage to cage-free, SADs per hen(-year)", fact: "sad_factors.sads_per_hen_year_enriched_to_aviary",
    test: (t) => /\bsads?\b/i.test(t) && /\b(hens?|layers?|laying|chicken)\b/i.test(t) && /enriched|furnished/i.test(t) && !/battery/i.test(t),
  },
  {
    id: "broiler-bcc", label: "Broiler raised under BCC/ECC standards, SADs per bird", fact: "sad_factors.sads_per_broiler_bcc",
    test: (t) => /\bsads?\b/i.test(t) && /\b(broilers?|chickens?)\b/i.test(t) && /\b(bcc|ecc|better chicken|european chicken)\b/i.test(t),
  },
  {
    id: "meal-replaced", label: "Animal-product meal replaced, SADs per meal", fact: "sad_factors.sads_per_meal_replaced",
    test: (t) => /\bsads?\b/i.test(t) && /\bper meal\b/i.test(t),
  },
  {
    id: "shrimp-stunned", label: "Shrimp stunned before slaughter, SADs per shrimp (ALI's generic \"SADs per shrimp\" counted here: its program is stunning)",
    test: (t) => /\bsads?\b/i.test(t) && /\bper shrimp\b/i.test(t) && !/sludge|stocking|not farmed/i.test(t),
  },
];

export type TransitionRow = { transition: string; model: string; row: string; label: string; value: number; reads: string[] };

/** Input or formula rows in animal models that state SADs for one of the standard transitions, with
 * their value in our view at the defaults. Rows whose id ends in _shared (ACE's shared-cell copies)
 * and totals (no "per") are left out. */
export function transitionRows(lib: Library, av = assumptionValues(lib.assumptions)): TransitionRow[] {
  const out: TransitionRow[] = [];
  for (const m of lib.models.values()) {
    if (m.cause !== "animal-welfare") continue;
    let vals: Record<string, number> | undefined;
    for (const r of ownRows(m)) {
      if (!/\bper\b|-year/i.test(r.label)) continue;
      // Per dollar, not per animal or meal: the species step's split (sads_<s>, "SADs per dollar you give:
      // chickens") and shares of SADs by species or SAD version are results, not a transition's figure.
      if (/\bper (donor )?(dollar|\$|usd)\b|\$\s*\/|you give|\bshare of\b/i.test(r.label) || /^(sads|ced)_[a-z]+(_\d{4})?$/.test(r.id)) continue;
      let tr = TRANSITIONS.find((x) => x.test(r.label));
      if (!tr) continue;
      // The label often says only "to cage-free"; the explainer says which cage the hen leaves.
      const t = `${r.label} ${r.explainer ?? ""}`;
      if (tr.id === "hen-battery-to-cage-free" && /enriched|furnished/i.test(t) && !/battery/i.test(t)) tr = TRANSITIONS.find((x) => x.id === "hen-enriched-to-cage-free")!;
      vals ??= compute(lib, m, av);
      out.push({ transition: tr.id, model: m.id, row: r.id, label: r.label, value: vals[r.id], reads: r.factDeps.map((f) => `@${f}`) });
    }
  }
  return out;
}

export function sameChange(lib: Library, av = assumptionValues(lib.assumptions)): InvariantReport {
  const rows = transitionRows(lib, av);
  const violations: Violation[] = [];
  for (const tr of TRANSITIONS) {
    const mine = rows.filter((r) => r.transition === tr.id);
    if (!mine.length) continue;
    const shared = tr.fact ? pickValue(lib.facts.get(tr.fact)?.value) : undefined;
    const distinct = [...new Set(mine.map((r) => fmt(r.value)))];
    for (const r of mine) {
      const readsFact = tr.fact && r.reads.includes(`@${tr.fact}`);
      if (readsFact || (shared === undefined && distinct.length === 1)) continue;
      const across = `values across models: ${distinct.join(", ")}`;
      let detail: string;
      if (shared === undefined) detail = `${fmt(r.value)} SADs ("${r.label}"); no shared fact for this change and the models disagree; ${across}`;
      else if (close(r.value, shared, 1e-3)) detail = `${fmt(r.value)} SADs ("${r.label}") equals @${tr.fact} = ${fmt(shared)} but restates it instead of reading the fact; ${across}`;
      else detail = `${fmt(r.value)} SADs ("${r.label}") differs from @${tr.fact} = ${fmt(shared)} (×${fmt(r.value / shared)}); ${across}`;
      violations.push({ inv: "SAME-CHANGE", model: r.model, where: `${tr.id} ${r.row}`, detail });
    }
  }
  return {
    id: "SAME-CHANGE", title: "Same physical change, same SADs figure", status: "partial", checked: new Set(rows.map((r) => r.model)).size, violations,
    how: `Rows in animal models whose label states SADs per unit for one of ${TRANSITIONS.length} transitions (${TRANSITIONS.map((t) => t.id).join(", ")}), matched by label keywords (the explainer only tells battery from enriched cages). Each must read its shared fact in facts/sad_factors.json; shrimp stunning has no fact yet, so every shrimp-stunned row fails while the models disagree. Not matched: "animals spared → SADs" and "years of farmed life → SADs" ratios (Good Food Fund's $sads_per_animal_spared, ACE 2016's caged-hen 28.9 per year), which are spread over formulas and are a different quantity from a transition; per-dollar rows (the species step's sads_<s> split, "SADs per dollar you give: chickens") and shares of SADs by species or SAD version, which are results, not a transition's figure.`,
  };
}

// ---------------------------------------------------------------------------------------------

/** INV-7: between the evaluator's bottom line (output.native) and ours, every row is in one of our
 * own sections and reproduces nothing; above it, every row is the evaluator's. "Between" is every row
 * computed from the evaluator's layer that isn't part of it, so a species split of the bottom line's
 * inputs counts too. */
export function inv7(lib: Library): InvariantReport {
  const models = evaluatorModels(lib).filter((m) => m.kind !== "variant");
  const violations: Violation[] = [];
  for (const m of models) {
    if (!m.output!.native) { violations.push(noNative("INV-7", m)); continue; }
    const native = m.output!.native.row;
    const out = m.output!.row;
    const ours = new Set(m.sections.filter((x) => x.kind === "ours").map((x) => x.id));
    const feedsOut = rowsFeeding(m);
    const feedsNative = upstream(m, native);
    // Rows computed from the bottom line, or (a result split by species before it is summed) from
    // its direct inputs, directly or not: ours. Evaluator rows beside the bottom line that our steps
    // read (ACE 2016's hen-years) aren't in between.
    const nativeDeps = m.byId.get(native)!.deps;
    const seeds = new Set([native, ...nativeDeps]);
    const below = new Set<string>();
    for (const id of m.order) if (!feedsNative.has(id) && m.byId.get(id)!.deps.some((d) => seeds.has(d) || below.has(d))) below.add(id);
    // The output uses the bottom line, or every one of its direct inputs.
    const usesNative = out === native || upstream(m, out).has(native) || (nativeDeps.length > 0 && nativeDeps.every((d) => feedsOut.has(d)));
    if (!usesNative) violations.push({ inv: "INV-7", model: m.id, where: out, detail: `the output uses neither the evaluator's bottom line (${native}) nor all of its inputs` });
    for (const id of below) {
      if (!feedsOut.has(id)) continue;
      const r = m.byId.get(id)!;
      if (!r.section || !ours.has(r.section)) violations.push({ inv: "INV-7", model: m.id, where: id, detail: `between the evaluator's bottom line (${native}) and ours, but in section ${r.section ?? "none"}, not one of ours` });
      else if (r.expected !== undefined) violations.push({ inv: "INV-7", model: m.id, where: id, detail: "one of our rows carries an `expected` value" });
    }
    for (const id of feedsNative) {
      const r = m.byId.get(id);
      if (r?.section && ours.has(r.section)) violations.push({ inv: "INV-7", model: m.id, where: id, detail: `feeds the evaluator's bottom line (${native}) but sits in one of our sections` });
    }
  }
  return {
    id: "INV-7", title: "Our rows are visibly ours", status: "checked", checked: models.length, violations,
    how: "Every evaluator model with an output (not variants: rows and sections are the parent's) declares output.native, and the output uses it. The output uses the native row (or, for a result split by species, every direct input of it). Every row that feeds the output and is computed, directly or not, from the native row or one of its direct inputs (without feeding the native row itself) is in a section of kind \"ours\" and has no `expected`; no row in the layer is in one of ours (rows switched by a toggle inside the evaluator's layer stay the evaluator's: INV-5 checks the toggle is pinned). Not checked: inputs of our steps that aren't computed from the bottom line (GiveWell's value of cash, staff-pay judgments; ours by section), and evaluator rows beside the bottom line that a bridge reads (ACE 2016's hen-years; INV-5 still holds them to the evaluator's rates).",
  };
}

// --- INV-11: no evaluator-internal exchange rate where the site has a shared one --------------------

/** Conversions the site holds one shared version of (owner decision 2026-10-31, "one consistent way"):
 * a row on a model's path that states one of these must read ours in our view, with the evaluator's
 * number as `published` or pinned in the evaluator view, so every slider moves every model. */
export const SHARED_RATES: { id: string; what: string; test: (label: string) => boolean; reads: (r: ResolvedRow) => boolean; want: string }[] = [
  {
    id: "income-to-daly", what: "an income-to-health exchange rate (years of doubled consumption to DALYs)",
    test: (t) => /\bdoubl\w*\b.*\b(consumption|income)\b.*\b(to|in)\b.*\bdalys?\b|\bdalys?\b.*\bper\b.*\bdoubl/i.test(t),
    reads: (r) => r.assumptionDeps.includes("uov_per_ln_consumption"), want: "$uov_per_ln_consumption (and $uov_per_daly)",
  },
  {
    id: "death-value", what: "a value of a death averted, in DALYs or years of life",
    test: (t) => /\b(dalys?|daly equivalents?|years of life|life years)\b.*\bper\b.*\b(deaths?|lives? saved)\b|\blife saved equiv\w* dalys?\b/i.test(t) && !/still ?births?/i.test(t),
    reads: (r) => r.factDeps.some((f) => f.startsWith("moral_weights.")), want: "@moral_weights.* * $life_value_multiplier",
  },
  {
    id: "stillbirth-value", what: "a value of a stillbirth averted",
    test: (t) => /\b(dalys?|daly equivalents?|years of life|life years|units? of value)\b.*\bper\b.*\bstill ?births?\b/i.test(t),
    reads: (r) => r.factDeps.includes("givewell_shared.uov_per_stillbirth"), want: "@givewell_shared.uov_per_stillbirth * $life_value_multiplier / $uov_per_daly",
  },
  {
    id: "fx", what: "a pound or euro exchange rate",
    test: (t) => /\b(exchange|conversion|fx)\b/i.test(t) && /\b(gbp|eur|pounds?|euros?|£|€)\b/i.test(t),
    reads: (r) => r.factDeps.some((f) => f.startsWith("fx.")), want: "@fx.*",
  },
];

/** INV-11: an evaluator's own exchange rate doesn't survive in our view where a shared one exists. */
export function inv11(lib: Library): InvariantReport {
  // Every model, charityevals' own included: one consistent way holds for ours too.
  const models = [...lib.models.values()].filter((m) => m.output);
  const violations: Violation[] = [];
  for (const m of models) {
    const path = rowsFeeding(m);
    for (const r of ownRows(m)) {
      if (!path.has(r.id)) continue;
      for (const s of SHARED_RATES) {
        // Ours if the row, or a row it is computed from, reads the shared version.
        if (!s.test(r.label) || [...upstream(m, r.id)].some((id) => s.reads(m.byId.get(id)!))) continue;
        violations.push({ inv: "INV-11", model: m.id, where: `${r.id} ${s.id}`, detail: `"${r.label}" is ${s.what} but reads ${r.formula ?? fmt(inputValue(r, "charityevals"))}, not the shared ${s.want}: read ours, with the evaluator's number in \`published\` or pinned` });
      }
    }
  }
  return {
    id: "INV-11", title: "No evaluator-internal exchange rate where a shared one exists", status: "partial", checked: models.length, violations,
    how: `Every model, charityevals' own included (since 2026-11-03; every evaluator's since 2026-11-02, before that Ambitious Impact's only): every row on the path to the output whose label states ${SHARED_RATES.map((s) => s.what).join("; ")} must read the shared version (${SHARED_RATES.map((s) => s.want).join("; ")}). Labels stand in for meaning, so a rate under another name isn't seen.`,
  };
}

// --- INV-12: one way to value money moved (docs/normalization.md 2.8) -------------------------------

/** Rows (and native units) that say a model values money moved or raised: a meta charity's bottom line. */
export const MOVED_MONEY = /\b(money|dollars?|donations?|funds?)\b[^.;]{0,40}\b(moved|raised|influenced|affected|shifted|leveraged)\b|\bmoney moved\b|\bleverage ratio\b|\bgross multiplier\b|\bEA[- ]donations?\b/i;
/** A not-yet-proven organisation's chance of success, in our view the shared one. */
const ORG_SUCCESS = /\bprobability of success\b|\bchance (that )?(the )?(new )?(organi[sz]ation|charity|evaluator) succeeds\b/i;
const CAREER = /\bcareer (change|plan|switch|shift)s?\b/i;

/** INV-12: every model that values money moved, raised or influenced, or career changes, goes through
 * the site's one method: the shared rows of src/engine/moved-money.ts, word for word, on the path. */
export function inv12(lib: Library): InvariantReport {
  const models = [...lib.models.values()].filter((m) => m.output && m.kind !== "variant");
  const violations: Violation[] = [];
  let checked = 0;
  for (const m of models) {
    const path = rowsFeeding(m);
    const onPath = m.rows.filter((r) => path.has(r.id));
    const moved = onPath.filter((r) => MOVED_MONEY.test(r.label));
    if (MOVED_MONEY.test(m.output!.native?.unit ?? "") || moved.length) {
      checked++;
      const v = m.byId.get("moved_dollar_value");
      if (!v || !path.has(v.id)) {
        violations.push({ inv: "INV-12", model: m.id, where: "moved_dollar_value", detail: `values money moved (${moved.slice(0, 2).map((r) => `"${r.label}"`).join(", ") || m.output!.native?.unit}) but its result doesn't go through the shared moved_dollar_value: write the shared rows (python3 scripts/moved-money.py) and read them` });
      } else if (!MOVED_DOLLAR_FORMULAS.some((f) => sameFormula(v.formula, f))) {
        violations.push({ inv: "INV-12", model: m.id, where: "moved_dollar_value formula", detail: `moved_dollar_value is ${v.formula ?? "an input"}, not the shared formula` });
      }
      for (const [id, t] of Object.entries(MOVED_MONEY_ROWS)) {
        const r = m.byId.get(id);
        if (!r || id === "moved_dollar_value") continue;
        if (!sameFormula(r.formula, t.formula)) violations.push({ inv: "INV-12", model: m.id, where: `${id} formula`, detail: `shared row ${id} is ${r.formula ?? "an input"}, not ${t.formula}` });
      }
      for (const r of onPath)
        if (ORG_SUCCESS.test(r.label) && !r.factDeps.includes(SUCCESS_FACT))
          violations.push({ inv: "INV-12", model: m.id, where: `${r.id} success`, detail: `"${r.label}" is a meta organisation's chance of success but reads ${r.formula ?? fmt(inputValue(r, "charityevals"))}, not @${SUCCESS_FACT} (evaluator's figure in \`published\`)` });
    }
    const careers = onPath.filter((r) => CAREER.test(r.label));
    if (careers.length) {
      checked++;
      const c = m.byId.get("career_change_value");
      if (!c || !path.has(c.id) || !sameFormula(c.formula, CAREER_CHANGE_FORMULA))
        violations.push({ inv: "INV-12", model: m.id, where: "career_change_value", detail: `values career changes ("${careers[0].label}") but not through the shared career_change_value = ${CAREER_CHANGE_FORMULA}` });
    }
  }
  return {
    id: "INV-12", title: "Money moved and career changes are valued one way", status: "partial", checked, violations,
    how: `Every model (not variants) whose native unit or a row on the path to the output names money moved, raised, influenced, affected or shifted, a leverage ratio, a gross multiplier or EA donations must reach its output through the shared row moved_dollar_value, with the shared formula (destinations across causes, or global health only); every shared row it has (${Object.keys(MOVED_MONEY_ROWS).join(", ")}) must have the shared formula word for word; and every row on its path stating an organisation's chance of success must read @${SUCCESS_FACT}. A row on the path about career changes needs the shared career_change_value = ${CAREER_CHANGE_FORMULA}. Labels stand in for meaning, so money moved under other words isn't seen, and a charity's own fundraising or a funder's value-of-information sheet is waived with its reason.`,
  };
}

// --- INV-2d: no literal times a lever ---------------------------------------------------------------

/** The factors of a product or quotient (a * b / c → a, b, c), looking through unary minus. */
function factors(n: Node): Node[] {
  if (n.type === "bin" && (n.op === "*" || n.op === "/")) return [...factors(n.left), ...factors(n.right)];
  if (n.type === "neg") return factors(n.arg);
  return [n];
}
/** Every product or quotient chain in a formula, and every call's argument list. */
function chains(n: Node, out: Node[][] = []): Node[][] {
  if (n.type === "bin" && (n.op === "*" || n.op === "/")) {
    const fs = factors(n);
    out.push(fs);
    fs.forEach((f) => chains(f, out));
  } else if (n.type === "bin") { chains(n.left, out); chains(n.right, out); }
  else if (n.type === "neg") chains(n.arg, out);
  else if (n.type === "call") { out.push(n.args); n.args.forEach((a) => chains(a, out)); }
  return out;
}

/** INV-2d: a constant multiplied or divided by a shared assumption inside a formula (`8 *
 * $life_value_multiplier`, `0.005 * $discount_rate / 0.04`, `pv_annuity_due(1, $discount_rate, 5)`) is a
 * number standing in for a shared value or an evaluator's input hidden from the other checks: read the
 * shared fact (the evaluator's figure in `published`), or make the constant its own labelled input row. */
export function inv2d(lib: Library): InvariantReport {
  const toggles = new Set(lib.assumptions.rows.filter((a) => a.format === "toggle").map((a) => a.id));
  const models = [...lib.models.values()].filter((m) => m.output);
  const violations: Violation[] = [];
  for (const m of models) {
    const path = rowsFeeding(m);
    for (const r of ownRows(m)) {
      if (!path.has(r.id) || !r.node) continue;
      const found = new Set<string>();
      for (const fs of chains(r.node as Node)) {
        const levers = fs.filter((f) => f.type === "ref" && f.scope === "assumption" && !toggles.has(f.name)).map((f) => (f as { name: string }).name);
        const consts = fs.filter((f) => f.type === "num" && !ALLOWED_LITERALS.has(f.value)).map((f) => (f as { value: number }).value);
        for (const c of consts) for (const a of levers) found.add(`${fmt(c)} $${a}`);
      }
      for (const k of found) violations.push({ inv: "INV-2d", model: m.id, where: `${r.id} ${k}`, detail: `formula ${r.formula} puts the constant ${k.split(" ")[0]} next to ${k.split(" ")[1]}: read the shared fact with the evaluator's figure in \`published\`, or make the constant its own input row` });
    }
  }
  return {
    id: "INV-2d", title: "No literal times a lever", status: "checked", checked: models.length, violations,
    how: `Every formula row on the path to the output (variants: their overrides) is split into its product and quotient chains and its function calls' argument lists; a chain or argument list holding both a non-toggle shared assumption ($life_value_multiplier, $discount_rate, …) and a constant outside lint's ALLOWED_LITERALS (${[...ALLOWED_LITERALS].join(", ")}) is flagged. Such a constant is a value the lever is meant to replace (8 for a death next to $life_value_multiplier) or an evaluator's input that INV-2c, INV-4 and INV-13 can't see inside a formula: it must read the shared fact, with the evaluator's figure in \`published\`, or become its own labelled input row. ln(2) and other constants inside a function of their own (not beside the assumption) pass.`,
  };
}

// --- INV-13: same concept, same value ---------------------------------------------------------------

/** Concepts several evaluators' models state, each with its shared version. A literal row naming the
 * concept must agree with the shared version for its context, or read it; context (a place, a
 * programme) is the only reason to differ, and the shared version then has one fact per context. */
/** facts/household_size.json: one household size per place, and the words that name the place. */
const HOUSEHOLD_PLACES: [string, RegExp][] = [
  ["Northwest Nigeria", /northwest|north west|kano|katsina|sokoto|zamfara|kebbi|jigawa|kaduna|new incentives/i], ["Nigeria", /nigeria/i], ["Kenya", /kenya/i], ["Malawi", /malawi/i],
  ["Mozambique", /mozambique/i], ["Rwanda", /rwanda/i], ["Uganda", /uganda/i], ["Zimbabwe", /zimbabwe/i], ["Bangladesh", /bangladesh/i],
  ["DRC", /\bdrc\b|congo/i], ["India", /india|bihar|bengal|pradesh|punjab/i], ["Pakistan", /pakistan|sindh/i],
];
const HOUSEHOLD_SIZE_FACTS = ["household_size.*"];

export const CONCEPTS: { id: string; test: RegExp; not?: RegExp; facts: string[]; context?: (text: string) => string | undefined }[] = [
  { id: "resource-sharing", test: /\bresource sharing\b|\bhousehold sharing\b/i, facts: ["givewell_shared.resource_sharing_multiplier"] },
  { id: "treatment-costs-averted", test: /\btreatment costs averted\b/i, not: /malnutrition|sam\b|wasting/i, facts: ["givewell_shared.treatment_costs_averted"] },
  { id: "investment-of-income", test: /\binvestment of income increases\b/i, facts: ["givewell_shared.investment_of_income_increases", "givewell_shared.investment_of_income_increases_nets", "givewell_shared.investment_of_income_increases_vas", "givewell_shared.investment_of_income_increases_deworming"] },
  { id: "long-term-benefit-years", test: /\b(years|duration)\b[^.;]{0,30}\b(long[- ]term|income|earnings?)\b[^.;]{0,20}\b(benefits?|gains?|increases?|effects?)\b[^.;]{0,20}\b(last|persist|counted)|\bduration of (long[- ]term )?(income|earnings) (benefits?|gains?|effects?)\b/i, not: /until|before|start|delay/i, facts: ["givewell_shared.long_term_benefit_years", "founders_pledge_2023.income_gain_years"] },
  { id: "wage-gain-per-iq-point", test: /\b(wages?|income|consumption|earnings)\b[^.;]{0,40}\b(iq|1 point)\b/i, facts: ["givewell_shared.wage_gain_per_iq_point"] },
  { id: "cf-value-government", test: /\bcounterfactual value\b[^.;]{0,40}\b(government|domestic)\b/i, facts: ["givewell_shared.cf_value_government"], context: (t) => (/india/i.test(t) ? "India" : undefined) },
  // Per dollar, not "as percentage of value of AMF spending" (a ratio, another quantity).
  { id: "cf-value-global-fund", test: /\bcounterfactual value\b[^.;]{0,40}\b(global fund|pmi)\b/i, not: /percent|% of|as a share/i, facts: ["givewell_shared.cf_value_global_fund"] },
  { id: "cf-value-gavi", test: /\bcounterfactual value\b[^.;]{0,40}\bgavi\b/i, facts: ["givewell_shared.cf_value_gavi"] },
  { id: "income-to-mortality-ratio", test: /\bratio of value generated from income increases to value generated from mortalit/i, facts: ["givewell_shared.income_to_mortality_value_ratio"] },
  { id: "value-of-cyp", test: /\b(value|moral weight|units? of value)\b[^.;]{0,40}\b(cyp|year of (modern )?contracepti\w*|couple[- ]years? of protection)\b/i, not: /death/i, facts: ["givewell_shared.uov_per_cyp_low_income", "givewell_shared.uov_per_cyp_nigeria", "givewell_shared.uov_per_cyp_sierra_leone"], context: (t) => (/nigeria|kano|lagos|kaduna/i.test(t) ? "Nigeria" : /sierra leone/i.test(t) ? "Sierra Leone" : undefined) },
  { id: "value-of-stillbirth", test: /\b(value|moral weight|units? of value)\b[^.;]{0,40}\bstill ?births?\b/i, facts: ["givewell_shared.uov_per_stillbirth"] },
  // GiveWell's indirect malaria deaths per direct one: one fact per sheet vintage; the site's ranked malaria models read `_2` (0.75).
  { id: "indirect-deaths-malaria", test: /\bindirect (malaria )?deaths?\b[^.;]{0,40}\b(per|for every)\b[^.;]{0,30}\bmalaria\b|\bdeaths? malaria causes indirectly\b/i, facts: ["givewell.indirect_malaria_deaths_per_direct_malaria_death", "givewell.indirect_malaria_deaths_per_direct_malaria_death_2", "givewell.indirect_malaria_deaths_per_direct_malaria_death_3", "givewell.ratio_of_indirect_malaria_deaths_per_direct_malaria_death"] },
  // Non-fatal malaria as a share of the mortality and income value (GiveWell's supplemental +9%); not case counts or incidence.
  { id: "malaria-morbidity", test: /\bmalaria (illness|morbidity)\b|\bmorbidity\b[^.;]{0,30}\bmalaria\b/i, not: /\bcases?\b|\bincidence\b|\bepisodes?\b/i, facts: ["givewell_common.malaria_morbidity"] },
  { id: "indirect-deaths-diarrhea", test: /\bindirect deaths?\b[^.;]{0,40}\b(per|for every)\b[^.;]{0,30}\b(diarrh\w*|ors|zinc)\b/i, facts: ["givewell_shared.indirect_deaths_per_direct_diarrhea_death"] },
  { id: "household-spillover-therapy", test: /\b(spillover|household)\b[^.;]{0,40}\b(psychotherapy|therapy|recipient'?s? (own )?effect|per (household )?member)\b/i, facts: ["wellby_factors.household_spillover_ratio_psychotherapy"] },
  // One household size per place (facts/household_size.json, the latest DHS survey): a row naming a household's size reads its place's fact.
  { id: "household-size", test: /\bhousehold size\b|\b(people|persons) per household\b|\bnumber of household members\b|\bother household members\b|\bpeople in the client's household\b/i, not: /\bprofit\b|extrapolation|\bnpv\b/i, facts: HOUSEHOLD_SIZE_FACTS, context: (t) => HOUSEHOLD_PLACES.find(([, re]) => re.test(t))?.[0] },
  { id: "commitment-fulfilment", test: /\b(fulfil\w*|compliance|kept|keep)\b[^.;]{0,40}\b(commitments?|(?<!founders )pledges?)\b|\bcommitments?\b[^.;]{0,30}\b(fulfil\w*|compliance)\b/i, not: /\bpigs?\b|gestation|sows?|shrimp|fish/i, facts: ["sad_factors.commitment_fulfilment_cage_free", "sad_factors.commitment_fulfilment_broiler"] },
  { id: "prior-weight-education", test: /\bweight on (the |fp'?s? |founders pledge'?s? )?prior\b/i, facts: ["founders_pledge_2023.prior_weight"] },
  { id: "depression-per-phq9-point", test: /\bphq[- ]?9?\b[^.;]{0,40}\b(daly|healthy|disability)\b|\bdalys? per (phq|point)\b/i, facts: ["depression.dalys_per_phq9_point_year", "depression.phq9_sd"] },
];

/** A concept's facts: "file.*" stands for every fact in that file (one per place). */
const conceptReads = (facts: string[], f: string) => facts.some((x) => x === f || (x.endsWith(".*") && f.startsWith(x.slice(0, -1))));
const conceptFacts = (lib: Library, facts: string[]) => [...lib.facts.keys()].filter((f) => conceptReads(facts, f));

/** Rows a model wrote that state a concept as a literal, with their context (a place, a programme). */
export function conceptRows(lib: Library) {
  const out: { concept: string; model: string; row: string; label: string; value: number; context: string; readsShared: boolean }[] = [];
  for (const m of lib.models.values()) {
    if (!m.output || m.kind === "variant") continue;
    const path = rowsFeeding(m);
    for (const r of ownRows(m)) {
      if (!path.has(r.id)) continue;
      for (const c of CONCEPTS) {
        const text = `${r.id.replace(/_/g, " ")} ${r.label}`;
        if (!c.test.test(r.label) || c.not?.test(text)) continue;
        const readsShared = [...upstream(m, r.id)].some((id) => m.byId.get(id)?.factDeps.some((f) => conceptReads(c.facts, f)));
        if (r.formula !== undefined && !readsShared) continue;
        const ctx = c.context?.(`${text} ${m.name} ${m.id}`) ?? "";
        out.push({ concept: c.id, model: m.id, row: r.id, label: r.label, value: r.formula === undefined ? pickValue(r.value) : NaN, context: ctx, readsShared });
      }
    }
  }
  return out;
}

/** INV-13: one concept, one value. A row (on the path, not in a variant) that states one of CONCEPTS as
 * a literal must read its shared fact: where it equals the shared value that is INV-4's copy, where it
 * differs it is the same question answered two ways. A context the concept knows (a country's
 * contraception value) picks its fact; any other reason to differ is a waiver with the reason. */
export function inv13(lib: Library): InvariantReport {
  const rows = conceptRows(lib);
  const violations: Violation[] = [];
  for (const r of rows) {
    if (r.readsShared) continue;
    const c = CONCEPTS.find((x) => x.id === r.concept)!;
    const shared = conceptFacts(lib, c.facts).map((f) => ({ f, v: pickValue(lib.facts.get(f)?.value) })).filter((x) => Number.isFinite(x.v));
    const same = shared.find((x) => close(r.value, x.v, INV4_TOLERANCE));
    const others = [...new Set(rows.filter((o) => o.concept === r.concept && o.model !== r.model).map((o) => o.readsShared ? "shared" : fmt(o.value)))];
    violations.push({
      inv: "INV-13", model: r.model, where: `${r.concept} ${r.row}`,
      detail: same
        ? `"${r.label}" = ${fmt(r.value)} restates @${same.f}: read it (evaluator's figure in \`published\`)`
        : `"${r.label}" = ${fmt(r.value)}${r.context ? ` (${r.context})` : ""} answers a question the site answers once (${shared.map((x) => `@${x.f} = ${fmt(x.v)}`).join(", ") || "no shared fact yet"}); other models: ${others.join(", ") || "none"}. Read the shared fact with the evaluator's figure in \`published\`, or record the reason (place, year) in a waiver`,
    });
  }
  return {
    id: "INV-13", title: "Same concept, same value across models", status: "partial", checked: new Set(rows.map((r) => r.model)).size, violations,
    how: `Rows on the path to the output (not variants) whose label names one of ${CONCEPTS.length} concepts several evaluators state (${CONCEPTS.map((c) => c.id).join(", ")}) must read the concept's shared fact (or be computed from a row that does), with the evaluator's own figure in \`published\`. A literal equal to the shared value is a copy; a literal that differs is the same question answered another way. A place or year the shared facts don't cover is the only reason to keep a different literal, recorded as a waiver with the reason. Labels stand in for meaning: a concept under other words isn't seen.`,
  };
}

// --- INV-14: house constants behind a shared fact ----------------------------------------------------

/** Places stripped from a label before grouping: the same figure under "(Kenya)" and "(Uganda)" is one figure. */
const PLACE_WORDS = /\b(overall|kenya|uganda|malawi|nigeria|chad|niger|india|mozambique|rwanda|burkina faso|togo|cameroon|guinea|drc|democratic republic of the congo|mali|ethiopia|zambia|madagascar|pakistan|bangladesh|ghana|benin|south sudan|sierra leone|liberia|tanzania|bihar|uttar pradesh|kano|lagos|katsina|bauchi|borno|ondo|anambra|sindh|punjab)\b/gi;
/** A label reduced to its significant words, sorted, places dropped: "Internal validity adjustment (overall)". */
const labelKey = (label: string) => [...words(label.replace(PLACE_WORDS, " "))].sort().join(" ");
/** Who a figure is copied from: SoGive's 2022 deworming sheets are copies of GiveWell's. */
const originOf = (m: ResolvedModel) => (m.owner === "sogive" ? "givewell" : m.owner ?? "");
/** A number that defines the row rather than estimating anything: a hypothetical donation's size, or a
 * scenario whose label states its own value ("Cost-effectiveness of counterfactual opportunity (10x bar)" = 10). */
const definitional = (label: string, v: number) =>
  /\b(arbitrary|hypothetical)\b/i.test(label) || [...label.matchAll(/(?<![\w.])(\d+(?:\.\d+)?)(?:x\b|(?![\w.]))/g)].some((x) => Number(x[1]) === v);

/** INV-14: the same literal under the same label in five or more models, none reading a fact, is an
 * evaluator's house constant (or one of ours) copied by hand: it belongs in a shared fact, read by every
 * copy, so a correction reaches all of them. */
export function inv14(lib: Library): InvariantReport {
  const groups = new Map<string, { model: string; row: string; label: string; value: number }[]>();
  for (const m of lib.models.values()) {
    if (!m.output || m.kind === "variant") continue;
    const path = rowsFeeding(m);
    for (const r of ownRows(m)) {
      if (!path.has(r.id) || r.formula !== undefined || r.value === undefined) continue;
      const v = pickValue(r.value);
      if (!Number.isFinite(v) || ALLOWED_LITERALS.has(v) || definitional(r.label, v)) continue;
      if (!labelKey(r.label)) continue;
      const key = `${originOf(m)}: ${labelKey(r.label)} = ${fmt(v)}`;
      groups.set(key, [...(groups.get(key) ?? []), { model: m.id, row: r.id, label: r.label, value: v }]);
    }
  }
  const violations: Violation[] = [];
  let checked = 0;
  for (const [key, rows] of groups) {
    const models = new Set(rows.map((r) => r.model));
    checked++;
    if (models.size < 5) continue;
    for (const r of rows)
      violations.push({ inv: "INV-14", model: r.model, where: `${r.row} = ${fmt(r.value)}`, detail: `"${r.label}" = ${fmt(r.value)} is typed into ${models.size} models (${[...models].slice(0, 4).join(", ")}${models.size > 4 ? ", …" : ""}) with no shared fact behind it (${key})` });
  }
  return {
    id: "INV-14", title: "No house constant without a shared fact", status: "partial", checked, violations,
    how: `Input rows on the path to the output (not variants) are grouped by whose figure it is (an evaluator, or charityevals; SoGive's copies of GiveWell's sheets count as GiveWell's), by label (significant words, place names and "overall" dropped) and by value: a group spanning five or more models is a constant copied by hand. It becomes a shared fact (facts/*.json) that every copy reads (GiveWell's: facts/givewell_common.json; our staff-pay defaults: facts/staff_pay.json). Round structural numbers lint allows in formulas (${[...ALLOWED_LITERALS].join(", ")}: no adjustment, a hypothetical $1,000, months in a year) aren't house constants, nor is a number that defines its row (an arbitrary or hypothetical donation's size; a scenario whose label states its value, "10x bar" = 10). Rows reading a fact are formulas and never counted; the same number under different labels, or from different evaluators, is a coincidence, not a copy.`,
  };
}

// --- INV-15: an outlier says why ----------------------------------------------------------------------

/** The phrase a summary uses to say why a ranked model is far above its peers. */
export const OUTLIER_REASON = /more than (ten|\d+) times (its|the) peers\b[^.]*\bbecause\b/i;

/** INV-15: a ranked model more than ten times the median of its peers (the other models the rankings use
 * in the same cause) says why in its summary. Best guesses stay; the reader is told why one stands out. */
export function inv15(lib: Library, av = assumptionValues(lib.assumptions)): InvariantReport {
  const ranked = new Map<string, ResolvedModel>();
  for (const c of lib.charities.keys()) for (const p of rankingPlan(lib, c)) for (const part of p.parts) ranked.set(part.model.id, part.model);
  const h = new Map([...ranked.values()].map((m) => [m.id, headline(lib, m, av)]));
  const violations: Violation[] = [];
  for (const m of ranked.values()) {
    const peers = [...ranked.values()].filter((o) => o.id !== m.id && o.cause === m.cause).map((o) => h.get(o.id)!).filter((x) => Number.isFinite(x) && x > 0).sort((a, b) => a - b);
    if (peers.length < 3) continue;
    const median = peers.length % 2 ? peers[peers.length >> 1] : (peers[peers.length / 2 - 1] + peers[peers.length / 2]) / 2;
    const x = h.get(m.id)!;
    if (x > 10 * median && !OUTLIER_REASON.test(m.summary ?? ""))
      violations.push({ inv: "INV-15", model: m.id, where: "summary", detail: `${fmt(x)} healthy years per $1,000 is ${fmt(x / median)}× the median of its ${peers.length} ranked peers in ${m.cause} (${fmt(median)}); its summary must say why ("more than ten times its peers because …")` });
  }
  return {
    id: "INV-15", title: "A ranked model far above its peers says why", status: "checked", checked: ranked.size, violations,
    how: "For every model the rankings use (rankingPlan), at the defaults in our view: if its headline is more than 10× the median of the other ranked models of the same cause (at least three), its summary must state the reason in the words \"more than ten times its peers because …\". The best guess stays; the outlier is explained where readers meet it.",
  };
}

// --- INV-16: side sheets never rank; the ranked column is the grant's -------------------------------

/** Rows of a value-of-information or decision sheet that the title-and-template test can miss. Money a
 * government or partner reallocates because of the programme (technical assistance, Rice Institute's
 * scale-up) is the programme's own effect, not a sign of one. */
const VOI_CONTENT = /\bfuture (funding )?(bar|opportunit\w*)\b|\b(ce|cost-effectiveness) of (this|the) reallocated funding\b|\bvalue of (the )?information\b|\bprobability (that )?(the |we |givewell )?(\w+ ){0,3}(decision|changes? (our|the) (mind|decision))|\bp\(\s*[^)]*\bx cash\b|\bcounterfactual (use|value) of (the )?(research|information)\b|\binformation value\b/i;
const COUNTRIES = ["Chad", "Nigeria", "Democratic Republic of the Congo", "DRC", "Uganda", "Kenya", "Malawi", "Mozambique", "Burkina Faso", "Togo", "Cameroon", "Niger", "Guinea", "Zambia", "Rwanda", "Tanzania", "Ethiopia", "Ghana", "Madagascar", "Mali", "South Sudan", "Benin", "Côte d'Ivoire", "India", "Pakistan", "Bangladesh", "Laos", "Sierra Leone", "Liberia", "Somalia", "Sudan", "Angola", "Zimbabwe"];
const countriesIn = (t: string) => COUNTRIES.filter((c) => new RegExp(`\\b${c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(t)).map((c) => (c === "DRC" ? "Democratic Republic of the Congo" : c));

/** INV-16: no ranked model is a value-of-information or other side sheet (by its rows, not only its title),
 * and a ranked sheet's bottom line is for the place its title or grant names. */
export function inv16(lib: Library): InvariantReport {
  const ranked = new Map<string, ResolvedModel>();
  for (const c of lib.charities.keys()) for (const p of rankingPlan(lib, c)) for (const part of p.parts) ranked.set(part.model.id, part.model);
  const violations: Violation[] = [];
  for (const m of ranked.values()) {
    const path = rowsFeeding(m);
    const voi = m.rows.filter((r) => path.has(r.id) && VOI_CONTENT.test(r.label));
    if (voi.length >= 2)
      violations.push({ inv: "INV-16", model: m.id, where: "side sheet", detail: `ranked, but ${voi.length} rows on its path read like a value-of-information or decision sheet (${voi.slice(0, 3).map((r) => `"${r.label}"`).join(", ")}): it values what a grant lets the funder learn, not the programme` });
    const native = m.output?.native ? m.byId.get(m.output.native.row) : undefined;
    const at = native ? countriesIn(native.label.match(/\(([^)]*)\)\s*$/)?.[1] ?? "") : [];
    const named = countriesIn(`${m.name} ${m.source?.title ?? ""} ${m.id.replace(/-/g, " ")}`);
    if (at.length && named.length && !at.some((c) => named.includes(c)))
      violations.push({ inv: "INV-16", model: m.id, where: "location", detail: `its bottom line "${native!.label}" is for ${at.join(", ")}, but the sheet is about ${named.join(", ")}: take the grant's own column` });
  }
  return {
    id: "INV-16", title: "Side sheets never rank; the ranked column is the grant's", status: "partial", checked: ranked.size, violations,
    how: "For every model the rankings use: at most one row on its path may read like a value-of-information or decision sheet (future funding bar, reallocated funding, value of information, the probability a decision changes, P(… x cash)); two or more and the sheet values what a grant lets the funder learn, so it must be a side sheet (src/engine/ranking.ts SIDE_SHEET or VOI_ROW). And where the native row's label ends in a place in parentheses (GiveWell's \"Final cost-effectiveness estimate (Chad)\"), the model's name, id or source title must name that place too when it names any: otherwise the importer took another location's column.",
  };
}

// --- INV-17: deaths in WELLBY models are valued the site's way --------------------------------------

/** INV-17: a WELLBY model that counts deaths values them like every other model (@moral_weights ×
 * $life_value_multiplier, in units of value) and they don't move with the WELLBY rate: they enter the
 * WELLBYs only through uov_valued_outside_wellbys → wellbys_from_uov, which the unit's conversion cancels. */
export function inv17(lib: Library, av = assumptionValues(lib.assumptions)): InvariantReport {
  const models = [...lib.models.values()].filter((m) => m.output?.unit === "wellby" && m.kind !== "variant");
  const violations: Violation[] = [];
  for (const m of models) {
    const path = rowsFeeding(m);
    const deaths = m.rows.filter((r) => path.has(r.id) && (r.factDeps.some((f) => f.startsWith("moral_weights.")) || r.assumptionDeps.includes("life_value_multiplier")));
    const bridge = m.byId.get(WELLBY_FROM_UOV.row);
    const h0 = headline(lib, m, av);
    if (!Number.isFinite(h0)) continue;
    if (!bridge) {
      if (deaths.length) violations.push({ inv: "INV-17", model: m.id, where: "deaths", detail: `values deaths (${deaths.slice(0, 2).map((r) => r.id).join(", ")}) inside its WELLBYs: value them in units of value in ${WELLBY_FROM_UOV.input} and convert them only in ${WELLBY_FROM_UOV.row} = ${WELLBY_FROM_UOV.formula}` });
      continue;
    }
    if (!isWellbyFromUov(m, bridge) || !path.has(bridge.id)) { violations.push({ inv: "INV-17", model: m.id, where: WELLBY_FROM_UOV.row, detail: `${WELLBY_FROM_UOV.row} must be ${WELLBY_FROM_UOV.formula} and feed the output` }); continue; }
    const into = upstream(m, WELLBY_FROM_UOV.input);
    for (const r of deaths) if (!into.has(r.id) && r.id !== WELLBY_FROM_UOV.row)
      violations.push({ inv: "INV-17", model: m.id, where: `${r.id} deaths`, detail: `${r.id} values deaths but reaches the output other than through ${WELLBY_FROM_UOV.input}` });
    const part = (a: Record<string, number>) => headline(lib, m, a) - headline(lib, m, a, { [WELLBY_FROM_UOV.input]: 0 });
    const d0 = part(av), d1 = part({ ...av, daly_per_wellby: av.daly_per_wellby * 1.5 });
    if (!close(d0, d1, 1e-9))
      violations.push({ inv: "INV-17", model: m.id, where: "$daly_per_wellby", detail: `the deaths' part of the headline moves with the WELLBY rate: ${fmt(d0)} → ${fmt(d1)} at ×1.5` });
    const held = Object.fromEntries(bridgesOf(lib, m).map((b) => [b.input, 0]));
    const l0 = headline(lib, m, av, held), l1 = headline(lib, m, { ...av, life_value_multiplier: av.life_value_multiplier * 1.5 }, held);
    if (!close(l0, l1, 1e-9))
      violations.push({ inv: "INV-17", model: m.id, where: "$life_value_multiplier", detail: `the WELLBYs without the deaths still move with the value of a life (${fmt(l0)} → ${fmt(l1)}): a death is valued inside the WELLBYs` });
  }
  // Every other model that bridges units of value into its own unit (2.6): a death is valued in units
  // of value and reaches the output only through that bridge, so it moves with nothing but the value of a life.
  const others = [...lib.models.values()].filter((m) => m.output && m.output.unit !== "wellby" && m.kind !== "variant" && bridgesOf(lib, m).some((b) => b.from === "uov"));
  for (const m of others) {
    const path = rowsFeeding(m);
    // Bridges themselves are exempt: a tco2e bridge values the deaths a tonne causes through its unit's conversion.
    const into = new Set([...bridgesOf(lib, m).filter((b) => b.from === "uov").flatMap((b) => [...upstream(m, b.input)]), ...bridgesOf(lib, m).map((b) => b.row)]);
    for (const r of m.rows) if (path.has(r.id) && !into.has(r.id) && (r.factDeps.some((f) => f.startsWith("moral_weights.")) || r.assumptionDeps.includes("life_value_multiplier")))
      violations.push({ inv: "INV-17", model: m.id, where: `${r.id} deaths`, detail: `${r.id} values deaths but reaches the ${m.output!.unit} output other than through its bridge from units of value` });
  }
  return {
    id: "INV-17", title: "Deaths in WELLBY models don't move with the WELLBY rate", status: "checked", checked: models.length + others.length, violations,
    how: `WELLBY models (not variants) that value a death (a row on the path reads @moral_weights.* or $life_value_multiplier) must value it in units of value in ${WELLBY_FROM_UOV.input} and put it into WELLBYs only in ${WELLBY_FROM_UOV.row} = ${WELLBY_FROM_UOV.formula} (in an ours section; INV-2b), which the unit's conversion ($daly_per_wellby * $uov_per_daly) cancels. Checked by computation: the deaths' part of the headline (headline − headline with ${WELLBY_FROM_UOV.input} = 0) doesn't move when $daly_per_wellby is ×1.5, and the rest (every bridge's input at 0) doesn't move with $life_value_multiplier. Any other model with a bridge from uov (docs/normalization.md 2.6) values its deaths only upstream of that bridge.`,
  };
}

/** INV-18 (docs/normalization.md 2.10): every model states what its dollar is (`estimate_basis`); every
 * past average reads the "next dollar vs average dollar" slider on the path to its output, in our view only;
 * no marginal or unit-cost estimate reads it, which would count diminishing returns twice. A model that
 * reads another model live (`#id`) moves with that model's slider through it, which is not a read. */
export function inv18(lib: Library, av = assumptionValues(lib.assumptions)): InvariantReport {
  const A = MARGINAL_ASSUMPTION;
  const models = [...lib.models.values()].filter((m) => m.output && m.kind !== "template");
  const violations: Violation[] = [];
  for (const m of models) {
    const basis = m.estimate_basis;
    if (!basis) {
      violations.push({ inv: "INV-18", model: m.id, where: "estimate_basis", detail: "no estimate_basis: say whether the result is a past_average, marginal or unit_cost estimate" });
      continue;
    }
    const readers = m.rows.filter((r) => r.assumptionDeps.includes(A));
    if (basis !== "past_average") {
      for (const r of readers)
        violations.push({ inv: "INV-18", model: m.id, where: `${r.id} $${A}`, detail: `reads $${A}, but its estimate is ${basis}: already about the next dollar, so the slider would count diminishing returns twice` });
      // Nor through anything else, unless through another model it reads live.
      if (!readers.length && !referencedModels(lib, m).some((t) => usedAssumptions(lib, t).includes(A))) {
        const h0 = headline(lib, m, av), h1 = headline(lib, m, { ...av, [A]: av[A] * 0.5 });
        if (Number.isFinite(h0) && !close(h0, h1, 1e-9))
          violations.push({ inv: "INV-18", model: m.id, where: `$${A} moves`, detail: `a ${basis} estimate whose headline moves with $${A} (${fmt(h0)} → ${fmt(h1)})` });
      }
      continue;
    }
    const path = rowsFeeding(m);
    if (!readers.some((r) => path.has(r.id))) {
      violations.push({ inv: "INV-18", model: m.id, where: `$${A}`, detail: `a past average, but no row on the path to the output reads $${A}` });
      continue;
    }
    const half = { ...av, [A]: av[A] * 0.5 };
    const h0 = headline(lib, m, av), h1 = headline(lib, m, half);
    if (!(Number.isFinite(h0) && h1 < h0))
      violations.push({ inv: "INV-18", model: m.id, where: `$${A} moves`, detail: `halving $${A} doesn't lower our headline (${fmt(h0)} → ${fmt(h1)})` });
    // The evaluator publishes the average: its view keeps 1. (Destinations read live through `#id` move in
    // both views, so this is checked on the rows, not the headline.)
    for (const r of readers) if (r.published === undefined && m.evaluator?.assumptions[A] === undefined)
      violations.push({ inv: "INV-18", model: m.id, where: `${r.id} evaluator view`, detail: `reads $${A} with no \`published\` value: the evaluator view must keep the evaluator's 1` });
  }
  return {
    id: "INV-18", title: "Past averages, and only past averages, read the next-dollar slider", status: "checked", checked: models.length, violations,
    how: `Every model with an output (variants inherit the field) declares estimate_basis. past_average: a row on the path to the output reads $${A}, halving it lowers our headline, and every row reading it has the evaluator's value in \`published\` (or the evaluator pins it), so the evaluator view keeps the average. marginal and unit_cost: no row reads $${A}.`,
  };
}

/** INV-19 (docs/normalization.md 2.11): an estimate counts less by its age, in our view only. Every
 * model with a result in common units has a date; with the destinations it reads live (`#id`) held, its
 * headline at the slider's default and high end is its headline at 0 times exactly (1 + d)^−age; its
 * evaluator view doesn't move with the slider at all, destinations included. */
export function inv19(lib: Library, av = assumptionValues(lib.assumptions)): InvariantReport {
  const A = AGE_DISCOUNT;
  const models = [...lib.models.values()].filter((m) => m.output && m.kind !== "template" && headlineConversion(lib, m.output.unit));
  const violations: Violation[] = [];
  if (!(A in av)) return { id: "INV-19", title: "An estimate counts less by its age, in our view only", status: "not checked", checked: 0, violations, how: `No $${A} in the assumptions.` };
  const row = lib.assumptions.rows.find((r) => r.id === A)!;
  const zero = { ...av, [A]: 0 };
  const settings = [...new Set([av[A], pickValue(row.value, "high"), 0.1])].filter((d) => d > 0);
  for (const m of models) {
    const age = estimateAge(lib, m);
    if (age === undefined) {
      violations.push({ inv: "INV-19", model: m.id, where: "source.published", detail: "no date the estimate was made, so its age can't be discounted" });
      continue;
    }
    // Destinations read live hold their values at 0: what moves is this model's own estimate.
    const held = Object.fromEntries(modelDepsOf(m).map((d) => [`#${d}`, compute(lib, m, zero)[`#${d}`]]));
    const h0 = headline(lib, m, zero, held);
    const e0 = headline(lib, m, zero, {}, "evaluator");
    if (!Number.isFinite(h0) || h0 === 0) continue;
    for (const d of settings) {
      const a = { ...av, [A]: d };
      const want = h0 * (1 + d) ** -age;
      const got = headline(lib, m, a, held);
      if (!close(got, want, 1e-9))
        violations.push({ inv: "INV-19", model: m.id, where: `our view at ${fmt(d)}`, detail: `estimate ${fmt(age)} years old: headline ${fmt(got)} at $${A} = ${fmt(d)}, want ${fmt(h0)} × ${fmt((1 + d) ** -age)} = ${fmt(want)}` });
      const e = headline(lib, m, a, {}, "evaluator");
      if (!(close(e, e0, 1e-12) || (Number.isNaN(e) && Number.isNaN(e0))))
        violations.push({ inv: "INV-19", model: m.id, where: `evaluator view at ${fmt(d)}`, detail: `the evaluator view moves with $${A}: ${fmt(e0)} at 0, ${fmt(e)} at ${fmt(d)}` });
    }
  }
  return {
    id: "INV-19", title: "An estimate counts less by its age, in our view only", status: "checked", checked: models.length, violations,
    how: `Every model with a result in common units (not templates) has source.published. With every model it reads live (\`#id\`) held at its value at $${A} = 0, its headline at the slider's default, at 10% and at its high end equals its headline at 0 times (1 + d)^−age exactly (age from source.published to common.estimate_age_as_of); the evaluator view's headline, destinations included, is the same at every setting.`,
  };
}

/** Every invariant against every model, in the design's order. */
export function checkAll(lib: Library): InvariantReport[] {
  const av = assumptionValues(lib.assumptions);
  return [inv1(lib), inv2a(lib, av), inv2b(lib), inv2c(lib, av), inv2d(lib), inv3(lib), inv4(lib), inv5(lib, av), inv6(lib), inv7(lib), inv8(lib, av), inv9(lib), inv9b(lib, av), inv5b(lib), inv10(lib, av), sameChange(lib, av), inv11(lib), inv12(lib), inv13(lib), inv14(lib), inv15(lib, av), inv16(lib), inv17(lib, av), inv18(lib, av), inv19(lib, av)];
}

/** Allowlist file shape: invariant id → sorted "model where" keys. */
export type Allowlist = Record<string, string[]>;

export function toAllowlist(reports: InvariantReport[]): Allowlist {
  return Object.fromEntries(reports.filter((r) => r.violations.length).map((r) => [r.id, [...new Set(r.violations.map(keyOf))].sort()]));
}

/** Waivers: flags checked by hand and found not to be violations (a coincidence of values, a word
 * that means something else), each with its reason. Unlike the allowlist, which is debt to fix, a
 * waiver is settled; a waiver that no longer matches anything is stale and must go. */
export type Waivers = Record<string, Record<string, string>>;

/** Reports without the waived violations, and the waivers that matched nothing. */
export function applyWaivers(reports: InvariantReport[], waivers: Waivers): { reports: InvariantReport[]; stale: string[] } {
  const used = new Set<string>();
  const out = reports.map((r) => {
    const w = waivers[r.id] ?? {};
    const violations = r.violations.filter((v) => {
      const k = keyOf(v);
      if (!(k in w)) return true;
      used.add(`${r.id} ${k}`);
      return false;
    });
    return { ...r, violations, waived: r.violations.length - violations.length };
  });
  const stale = Object.entries(waivers).flatMap(([id, w]) => Object.keys(w).map((k) => `${id} ${k}`)).filter((k) => !used.has(k));
  return { reports: out, stale };
}

