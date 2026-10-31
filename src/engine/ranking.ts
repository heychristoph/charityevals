// Which models put a charity on the rankings, and how they make one figure per evaluator.
//   - Sheets that don't estimate a program's cost-effectiveness (skeletons, value-of-information,
//     breakeven, threshold and optionality analyses, sensitivity copies) never count, nor do an
//     evaluator's stated upper bounds (a best case it calls unlikely, never a central estimate).
//   - Within an evaluator, each program counts once: its newest model by source.published, hand-built
//     or bulk import alike, hand-built first on the same date (newestFirst). A charity's `programs`
//     say which models are which program; without them, all of an evaluator's models are one program.
//     A model that matches no program, or a program at weight 0 (no money in the window, or not a
//     program at all, e.g. an organisational grant), doesn't count.
//   - A program's model with location variants counts as the funding-weighted mean of its locations:
//     by the charity's declared funding per location (charities/*.json `locations`), else by the
//     sheet's own grant or spending size per location where those differ; otherwise as the model
//     itself (for GiveWell's multi-location models, the median location).
//   - Several programs: funding-weighted mean where every program has a weight, else their median.
import { assumptionValues, comparable, compute, modelsOf, type Library, type ResolvedModel } from "./model";
import type { Charity } from "./schema";

/** Matched against a model's id, name and source title. */
export const SIDE_SHEET =
  /skeleton|\bvoi\b|value[- ]of[- ](information|incubation|the grant)|value[- ]information|break-?even|optionality|option[- ]value|threshold|upper[- ]bound|\[(low|high) [^\]]*copy\]|assumptions copy\]/i;

/** A row of GiveWell's value-of-information template: what research or a pilot is worth through the money it
 * moves later ("Best guess on CE of this reallocated funding", "Cost to generate information to reallocate",
 * "Total units of value from value of information", "Probability that the change is in the decision"). */
export const VOI_ROW =
  /(ce|cost-effectiveness) of (this|the) reallocated funding|generate information|value of information|change is in the decision/i;

/** A sheet that values a grant through what it lets GiveWell learn, whatever its title says: its bottom line
 * rests on a value-of-information row (Raising the Village's RCT follow-up, IDinsight). An option value from
 * scaling a program the grant runs anyway (Rice Institute's optionality) is not this template. */
export function isValueOfInformation(m: ResolvedModel): boolean {
  if (!m.output) return false;
  if (m.value_of_information) return true;
  const seen = new Set<string>();
  const walk = (id: string): boolean => {
    if (seen.has(id)) return false;
    seen.add(id);
    const r = m.byId.get(id);
    if (!r) return false;
    return VOI_ROW.test(r.label ?? "") || [...(r.deps ?? [])].some(walk);
  };
  return walk(m.output.row);
}

export function isSideSheet(m: ResolvedModel): boolean {
  return SIDE_SHEET.test(`${m.id} ${m.name} ${m.source?.title ?? ""}`) || isValueOfInformation(m);
}

/** The program a model belongs to: "" for a charity without programs, undefined when it matches none. */
export function programOf(c: Charity, m: ResolvedModel): string | undefined {
  if (!c.programs) return "";
  return c.programs.find((p) => new RegExp(p.models).test(m.id))?.id;
}

const published = (m: ResolvedModel) => m.source?.published ?? "";

/** Models by owner as given, each owner's newest first by source.published, hand-built or bulk import
 * alike; on the same date hand-built first, then the given order (docs/review-backlog.md C5). */
export function newestFirst(models: ResolvedModel[]): ResolvedModel[] {
  const owners = [...new Set(models.map((m) => m.owner))];
  return [...models].sort((a, b) => owners.indexOf(a.owner) - owners.indexOf(b.owner)
    || published(b).localeCompare(published(a)) || Number(!!a.bulk) - Number(!!b.bulk));
}

export type PlanPart = { program: string; model: ResolvedModel; weight?: number };
export type EvaluatorPlan = { owner: string; parts: PlanPart[] };

/** Per evaluator (owners.json order), the models that rank the charity: one per program. */
export function rankingPlan(lib: Library, charity: string): EvaluatorPlan[] {
  const c = lib.charities.get(charity);
  if (!c) return [];
  const byOwner = new Map<string, Map<string, ResolvedModel>>();
  for (const m of newestFirst(modelsOf(lib, charity))) {
    if (!comparable(lib, m) || isSideSheet(m)) continue;
    const program = programOf(c, m);
    if (program === undefined || c.programs?.find((p) => p.id === program)?.weight === 0) continue;
    const programs = byOwner.get(m.owner) ?? new Map<string, ResolvedModel>();
    byOwner.set(m.owner, programs);
    if (!programs.has(program)) programs.set(program, m);
  }
  return [...byOwner].map(([owner, programs]) => ({
    owner,
    parts: [...programs].map(([program, model]) => ({ program, model, weight: c.programs?.find((p) => p.id === program)?.weight })),
  }));
}

/** A model and its location variants. */
export function locationsOf(lib: Library, m: ResolvedModel): ResolvedModel[] {
  return [m, ...[...lib.models.values()].filter((v) => v.kind === "variant" && v.extends === m.id && v.output)];
}

/** Rows that size a location's grant in GiveWell's sheets. */
const WEIGHT_ROWS = ["grant_size", "grant_size_2", "total_spending_contributed_by_grantee"];
/** Below this a "grant size" is a placeholder (e.g. 0.01), not money. */
const MIN_WEIGHT = 1000;
const weightCache = new Map<string, number[] | undefined>();

/** Each location's grant or spending size, where the sheet gives locations different real sizes;
 * undefined where all share one hypothetical grant (GiveWell's usual $1M) or a placeholder. Read at
 * the default assumptions: a grant's size doesn't move with the visitor's values. */
export function locationWeights(lib: Library, family: ResolvedModel[]): number[] | undefined {
  if (family.length < 2) return undefined;
  const key = family.map((m) => m.id).join();
  if (weightCache.has(key)) return weightCache.get(key);
  const av = assumptionValues(lib.assumptions);
  let found: number[] | undefined;
  for (const row of WEIGHT_ROWS) {
    if (!family.every((m) => m.byId.has(row))) continue;
    const ws = family.map((m) => compute(lib, m, av)[row]);
    // Equal up to rounding (a $1M grant divided and multiplied back) is one hypothetical size.
    if (ws.every((w) => Number.isFinite(w) && w >= MIN_WEIGHT) && Math.max(...ws) > 1.01 * Math.min(...ws)) { found = ws; break; }
  }
  weightCache.set(key, found);
  return found;
}

/** A family's locations as the charity declares them: each entry's money and the locations it went to. */
export type LocationPart = { label: string; weight: number; models: ResolvedModel[] };

/** The charity's declared funding per location for a model's family (`locations` whose `family` is
 * the family's own model), or undefined when it declares none, an entry matches no location, or no
 * entry has money. A location no entry matches doesn't count; the charity file lists unfunded
 * locations at weight 0 to say so (ranking.test.ts checks every location is listed). */
export function declaredLocations(c: Charity | undefined, family: ResolvedModel[]): LocationPart[] | undefined {
  const entries = c?.locations?.filter((l) => l.family === family[0]?.id);
  if (!entries?.length) return undefined;
  const parts = entries.map((l) => ({ label: l.label, weight: l.weight, models: family.filter((m) => new RegExp(l.models).test(m.id)) }));
  if (parts.some((p) => !p.models.length) || !parts.some((p) => p.weight > 0)) return undefined;
  return parts;
}

/** A family's figure from declared funding: the dollar-weighted arithmetic mean of the entries' value
 * per dollar. A donor whose dollars are split the way the money went buys sum(w_i * v_i) / sum(w_i):
 * each location's value per dollar times its share of the dollars, the same rule as for programs.
 * (A mean of cost per outcome, or a geometric mean, would answer a different question.) An entry
 * covering several locations whose split isn't published (e.g. "Nigeria, 6 states") counts as their
 * median, the same fallback as for a family without weights. */
export function combineLocations(parts: LocationPart[], figure: (m: ResolvedModel) => Figure): Figure & { basis: Basis } {
  return combine(parts.map((p) => {
    const { central, low, high } = combine(p.models.map(figure));
    return { central, low, high, weight: p.weight };
  }));
}

export type Figure = { central: number; low: number; high: number };
/** single: one figure; weighted: funding-weighted mean; median: no weights for all of them. */
export type Basis = "single" | "weighted" | "median";

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const k = s.length >> 1;
  return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2;
};

/** Several figures as one: weighted by funding where every one has a weight and some weight is above
 * zero (value per dollar over the whole portfolio; weight 0 drops a figure), else the median. Ranges
 * combine the same way. */
export function combine(xs: (Figure & { weight?: number })[]): Figure & { basis: Basis } {
  const ordered = xs.map((x) => ({ ...x, low: Math.min(x.low, x.high), high: Math.max(x.low, x.high) }));
  if (ordered.length === 1) {
    const [x] = ordered;
    return { central: x.central, low: x.low, high: x.high, basis: "single" };
  }
  const total = ordered.reduce((s, x) => s + (x.weight ?? 0), 0);
  if (ordered.every((x) => x.weight !== undefined && x.weight >= 0) && total > 0) {
    const mean = (f: (x: Figure) => number) => ordered.reduce((s, x) => s + x.weight! * f(x), 0) / total;
    return { central: mean((x) => x.central), low: mean((x) => x.low), high: mean((x) => x.high), basis: "weighted" };
  }
  return {
    central: median(ordered.map((x) => x.central)),
    low: median(ordered.map((x) => x.low)),
    high: median(ordered.map((x) => x.high)),
    basis: "median",
  };
}

// Which models rank a charity doesn't depend on the reader's values: one plan per library.
const plans = new WeakMap<Library, Map<string, EvaluatorPlan | undefined>>();
function planOf(lib: Library, owner: string, charity: string): EvaluatorPlan | undefined {
  let cache = plans.get(lib);
  if (!cache) plans.set(lib, (cache = new Map()));
  const key = `${owner}:${charity}`;
  if (!cache.has(key)) cache.set(key, rankingPlan(lib, charity).find((p) => p.owner === owner));
  return cache.get(key);
}

/** A charity's figure from one evaluator, the way the rankings make it (src/lib/use-results.ts): each
 * program's model over its locations (declared funding, else the sheet's own grant sizes, else the model
 * itself), the programs weighted by funding. `figure` is one model's value per dollar; the weights don't
 * depend on it, so any linear measure (units of value, healthy years) combines the same way. NaN when the
 * evaluator doesn't rank the charity. Formulas read it as `#owner:charity` (expr.ts). */
export function evaluatorFigure(lib: Library, owner: string, charity: string, figure: (m: ResolvedModel) => number): number {
  const c = lib.charities.get(charity);
  const plan = planOf(lib, owner, charity);
  if (!c || !plan) return NaN;
  const one = (m: ResolvedModel): Figure => { const v = figure(m); return { central: v, low: v, high: v }; };
  return combine(plan.parts.map((p) => {
    const family = locationsOf(lib, p.model);
    const declared = declaredLocations(c, family);
    if (declared) return { ...combineLocations(declared, one), weight: p.weight };
    const weights = locationWeights(lib, family);
    if (!weights) return { ...one(p.model), weight: p.weight };
    return { ...combine(family.map((x, i) => ({ ...one(x), weight: weights[i] }))), weight: p.weight };
  })).central;
}

/** Every model `evaluatorFigure` reads for a charity and evaluator (programs and their locations). */
export function evaluatorFigureModels(lib: Library, owner: string, charity: string): ResolvedModel[] {
  const plan = planOf(lib, owner, charity);
  return plan ? plan.parts.flatMap((p) => locationsOf(lib, p.model)) : [];
}

/** The model a charity's main page shows: its first evaluator's first model that counts on the
 * rankings, so the page's model is the one behind its headline and homepage row. A charity off the
 * rankings: its first model in modelsOf order. */
export function primaryModel(lib: Library, charity: string): ResolvedModel | undefined {
  return rankingPlan(lib, charity)[0]?.parts[0]?.model ?? modelsOf(lib, charity)[0];
}
