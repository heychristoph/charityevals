// Consistency invariants from docs/normalization.md (section 3 and "Decided 2026-10-30"), checked
// mechanically against today's models. Today's schema has none of the metadata the design adds
// (output.native, output.species, section kinds, the `ced` unit), so each check derives what it can
// from what exists, and says where it can't. Used by src/engine/normalization.test.ts (with an
// allowlist that only shrinks) and scripts/normalization-audit.ts (the full report).
import { evaluate, refs, type Node } from "./expr";
import { ALLOWED_LITERALS, literals } from "./lint";
import {
  assumptionValues, compute, conversionLookup, headline, headlineConversion, inputValue, pickValue, viewAssumptions,
  type Library, type ResolvedModel, type ResolvedRow,
} from "./model";
import { isSideSheet } from "./ranking";
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
export const CROSS_CAUSE = ["daly_per_sad", "uov_per_wellby", "sads_per_animal_spared", "chicken_vs_person", "daly_per_disabling_day", "deaths_per_tco2e", "climate_heat_share", "climate_heat_death_delay"];
const ANIMAL_ASSUMPTIONS = ["chicken_vs_person", "daly_per_sad"];

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

/** INV-2a: the headline is the native result times the unit's conversion (charityevals view). */
export function inv2a(lib: Library, av = assumptionValues(lib.assumptions)): InvariantReport {
  const models = [...lib.models.values()].filter((m) => m.output && headlineConversion(lib, m.output.unit));
  const violations: Violation[] = [];
  for (const m of models) {
    const vals = compute(lib, m, av);
    const native = vals[m.output!.row];
    const want = native * evaluate(headlineConversion(lib, m.output!.unit)!, conversionLookup(lib, av, vals));
    const got = headline(lib, m, av);
    if (!(close(got, want) || (Number.isNaN(got) && Number.isNaN(want))))
      violations.push({ inv: "INV-2a", model: m.id, where: "headline", detail: `headline ${fmt(got)} ≠ native ${fmt(native)} × conversion = ${fmt(want)}` });
  }
  return {
    id: "INV-2a", title: "Headline = native result × the unit's conversion (our view)", status: "checked", checked: models.length, violations,
    how: "headline(m) in the charityevals view against compute(m)[output] × evaluate(headlineConversion(unit)). The evaluator view is INV-8. Whether each unit's conversion is the standard recipe is INV-1 (sad and animals_spared have no standard recipe).",
  };
}

/** INV-2b: no row reads a cross-cause rate; $uov_per_daly only where the evaluator view pins it. */
export function inv2b(lib: Library): InvariantReport {
  const violations: Violation[] = [];
  const models = [...lib.models.values()];
  for (const m of models) {
    const pinned = m.evaluator?.assumptions ?? {};
    for (const r of ownRows(m)) {
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
    m.conversionRows.forEach(walk);
    for (const id of m.conversionRows) {
      const r = m.byId.get(id);
      if (r && !(r.section && ours.has(r.section)))
        violations.push({ inv: "INV-2b", model: m.id, where: `${id} section`, detail: `row ${id} is read by the ${m.output!.unit} conversion but sits outside an ours section` });
    }
    for (const id of feedsConv) for (const a of m.byId.get(id)?.assumptionDeps ?? [])
      violations.push({ inv: "INV-2b", model: m.id, where: `${id} $${a}`, detail: `row ${id} feeds the ${m.output!.unit} conversion and reads $${a}` });
  }
  return {
    id: "INV-2b", title: "No model row reads a cross-cause rate", status: "checked", checked: models.length, violations,
    how: `Every row a model wrote itself (variants: only rows they override): assumptionDeps ∩ {${CROSS_CAUSE.map((a) => "$" + a).join(", ")}} must be empty, and $uov_per_daly only where evaluator.assumptions pins it. The one sanctioned way a model shapes its conversion is a row the unit's to_common names by a fixed id (tco2e: air_pollution_weight, docs/normalization.md 2.5): it must sit in an ours section, and neither it nor any row feeding it may read a shared assumption.`,
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

type Shared = { ref: string; label: string; values: number[]; best: number; place?: string };

/** Facts files about one country (givewell_kenya, malawi): a row copying one must be about that country. */
const PLACES = ["kenya", "malawi", "uganda", "india", "chad", "mozambique", "rwanda", "burkina_faso", "nigeria", "drc"];

function sharedNumbers(lib: Library): Shared[] {
  const out: Shared[] = [];
  for (const f of lib.facts.values()) {
    const v = f.value;
    if (v === undefined) continue;
    const values = typeof v === "number" ? [v] : [v.low, v.best, v.high].filter((x): x is number => typeof x === "number");
    const file = f.key.split(".")[0];
    out.push({ ref: `@${f.key}`, label: f.label, values: [...new Set(values)], best: pickValue(v), place: PLACES.find((p) => file === p || file.endsWith(`_${p}`))?.replace("_", " ") });
  }
  for (const a of lib.assumptions.rows) {
    if (a.format === "toggle") continue;
    out.push({ ref: `$${a.id}`, label: a.label, values: [pickValue(a.value)], best: pickValue(a.value) });
  }
  return out;
}

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
          const hit = s.values.find((sv) => close(x, sv, 1e-3));
          if (hit === undefined) continue;
          if (!resembles(text, s.label)) { drop("input equals a shared value but its label doesn't resemble the shared one's"); continue; }
          const like = likeness(text, s.label);
          if (!s.values.some((sv) => close(x, sv)) && like.ofLarger < 0.5) { drop("input within 0.1% of a shared value (not equal) and labels only loosely alike"); continue; }
          if (!placeOk(s)) { drop("input equals a country fact but is about another place"); continue; }
          if (words(s.label).size < 3 && like.ofLarger < 0.75) { drop("shared label too generic (under three significant words) for a loose match"); continue; }
          if (sigDigits(hit) <= 1 && like.ofLarger < 0.6) { drop("round value (one significant digit) and labels only loosely alike"); continue; }
          violations.push({ inv: "INV-4", model: m.id, where: `${r.id} = ${s.ref}`, detail: `input "${r.label}" = ${fmt(x)} is a literal copy of ${s.ref} (${fmt(hit)}, "${s.label}")` });
        }
      } else if (r.node) {
        // A constant inside a formula equal to a shared value's best guess.
        for (const c of new Set(literals(r.node as Node).filter((v) => !ALLOWED_LITERALS.has(v)))) {
          for (const s of shared) {
            if (!close(c, s.best, 1e-9)) continue;
            const distinctive = sigDigits(c) >= 5 && !Number.isInteger(c);
            if (!distinctive && !resembles(text, s.label)) { drop("formula constant equals a shared value but is short (< 5 significant digits, or an integer) and the row label doesn't resemble it"); continue; }
            if (!placeOk(s)) { drop("formula constant equals a country fact but the row is about another place"); continue; }
            violations.push({ inv: "INV-4", model: m.id, where: `${r.id} ${fmt(c)} = ${s.ref}`, detail: `formula constant ${fmt(c)} equals ${s.ref} ("${s.label}"): ${r.formula!.slice(0, 160)}` });
          }
        }
      }
    }
  }
  return {
    id: "INV-4", title: "No literal stands in for a shared fact or assumption", status: "partial", checked: models.length, violations, suppressed,
    how: "Facts have no `match` pattern yet, so (a) an input row is flagged when its value equals a fact's or assumption's low/best/high (within 0.1%) AND its id+label shares at least two significant words (half the smaller label) with the fact's label; near-equal (not equal) values, one-significant-digit values (0.5, 1000) and facts with generic labels (\"Average household size\") need closer labels (50%, 60%, 75% of the larger word set); a country fact (givewell_kenya…) only matches rows naming that country; (b) a formula constant outside lint's ALLOWED_LITERALS is flagged when it equals a fact's or assumption's best value exactly and either has 5+ significant digits and isn't an integer (116.25262, 73.1914) or the row label resembles the shared label. Rows a model wrote itself only (variants: overrides). The evaluator's own number is still a violation: it belongs in `published` on a row that reads the fact. Heuristic by nature (values and words, not meaning); it can't see a copy whose label uses other words (\"CFR\" for case fatality rate), a copy rounded beyond 0.1% or rescaled (a percent written as 12, a rate per 1,000), a short formula constant under an unlike label, a shared number that isn't in facts/ or assumptions yet, or a country fact for a place outside its list; and a matching label can still be a coincidence (normalization-waivers.json).",
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
function expectations(m: ResolvedModel): [string, Shape][] {
  const unit = m.output!.unit;
  if (m.cause === "animal-welfare")
    return [["chicken_vs_person", "linear"], ["daly_per_sad", "linear"], ["uov_per_daly", "independent"], ["uov_per_wellby", "independent"], ["uov_per_ln_consumption", "independent"], ["deaths_per_tco2e", "independent"]];
  const base: [string, Shape][] = ANIMAL_ASSUMPTIONS.map((a) => [a, "independent"]);
  // Climate: a tonne is worth the deaths it causes, each valued like an adult's death.
  if (unit === "tco2e") return [...base, ["deaths_per_tco2e", "linear"], ["life_value_multiplier", "linear"], ["uov_per_wellby", "independent"], ["uov_per_ln_consumption", "independent"]];
  base.push(["deaths_per_tco2e", "independent"], ["climate_heat_death_delay", "independent"]);
  if (unit === "wellby") return [...base, ["uov_per_wellby", "linear"], ["uov_per_ln_consumption", "independent"]];
  if (unit === "daly") return [...base, ["uov_per_wellby", "independent"]];
  return [...base, ["uov_per_wellby", "independent"]];
}

export function inv10(lib: Library, av = assumptionValues(lib.assumptions)): InvariantReport {
  const models = [...lib.models.values()].filter((m) => m.output && headlineConversion(lib, m.output.unit));
  const violations: Violation[] = [];
  for (const m of models) {
    const h0 = headline(lib, m, av);
    if (!Number.isFinite(h0) || h0 === 0) continue;
    for (const [a, shape] of expectations(m)) {
      const at = (k: number) => headline(lib, m, { ...av, [a]: av[a] * k });
      const h2 = at(1.5);
      const ok = shape === "linear" ? close(h2, 1.5 * h0, 1e-9) && close(at(0.5), 0.5 * h0, 1e-9) : close(h2, h0, 1e-9);
      if (!ok)
        violations.push({ inv: "INV-10", model: m.id, where: `$${a} ${shape}`, detail: `headline should be ${shape === "linear" ? "proportional to" : "independent of"} $${a}: ${fmt(h0)} at default, ${fmt(h2)} at ×1.5 (${fmt((h2 / h0 - 1) * 100)}%)` });
    }
  }
  return {
    id: "INV-10", title: "Each slider moves exactly the models it should", status: "checked", checked: models.length, violations,
    how: "At the defaults, each headline is recomputed with one assumption ×1.5 (and ×0.5 for linearity). Animal models: proportional to $chicken_vs_person and $daly_per_sad (the design's $daly_per_disabling_day), independent of $uov_per_daly, $uov_per_wellby, $uov_per_ln_consumption. Climate (tco2e) models: proportional to $deaths_per_tco2e and $life_value_multiplier, independent of the animal assumptions, $uov_per_wellby and $uov_per_ln_consumption. Others: independent of the animal assumptions, $deaths_per_tco2e, $climate_heat_death_delay and $uov_per_wellby, except WELLBY models, which are proportional to $uov_per_wellby and independent of $uov_per_ln_consumption. Models with a zero or non-finite headline are skipped.",
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
    how: `Rows in animal models whose label states SADs per unit for one of ${TRANSITIONS.length} transitions (${TRANSITIONS.map((t) => t.id).join(", ")}), matched by label keywords (the explainer only tells battery from enriched cages). Each must read its shared fact in facts/sad_factors.json; shrimp stunning has no fact yet, so every shrimp-stunned row fails while the models disagree. Not matched: "animals spared → SADs" and "years of farmed life → SADs" ratios (Good Food Fund's $sads_per_animal_spared, ACE 2016's caged-hen 28.9 per year), which are spread over formulas and are a different quantity from a transition.`,
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
    id: "fx", what: "a pound or euro exchange rate",
    test: (t) => /\b(exchange|conversion|fx)\b/i.test(t) && /\b(gbp|eur|pounds?|euros?|£|€)\b/i.test(t),
    reads: (r) => r.factDeps.some((f) => f.startsWith("fx.")), want: "@fx.*",
  },
];

/** INV-11: an evaluator's own exchange rate doesn't survive in our view where a shared one exists. */
export function inv11(lib: Library): InvariantReport {
  const models = [...lib.models.values()].filter((m) => m.output && m.owner === "ambitious-impact");
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
    how: `Ambitious Impact's models (the rule is general; other evaluators' models are being brought under it separately): every row on the path to the output whose label states ${SHARED_RATES.map((s) => s.what).join("; ")} must read the shared version (${SHARED_RATES.map((s) => s.want).join("; ")}). Labels stand in for meaning, so a rate under another name isn't seen; stillbirths, which have no shared value, are left out.`,
  };
}

/** Every invariant against every model, in the design's order. */
export function checkAll(lib: Library): InvariantReport[] {
  const av = assumptionValues(lib.assumptions);
  return [inv1(lib), inv2a(lib, av), inv2b(lib), inv2c(lib, av), inv3(lib), inv4(lib), inv5(lib, av), inv6(lib), inv7(lib), inv8(lib, av), inv9(lib), inv9b(lib, av), inv5b(lib), inv10(lib, av), sameChange(lib, av), inv11(lib)];
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

