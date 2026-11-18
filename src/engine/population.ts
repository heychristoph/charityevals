// The people and animals a result adds (docs/normalization.md 2.25). A death averted is more than the
// survivor's own years: parents have fewer later births (the fertility response), the survivor has
// children, and everyone who lives eats animals. The same goes for a stillbirth averted, a birth averted by
// contraception and an income raised. These are second-order changes in the number of lives, so they are
// read into every model at the one place it values such an outcome, a shared figure:
//   a death averted        @moral_weights.<age>            (DEATH_FACTS: the age the death is averted at)
//   a stillbirth averted   @givewell_shared.uov_per_stillbirth
//   a year of contraception @givewell_shared.uov_per_cyp_<place>
//   a year of doubled income $uov_per_ln_consumption
//   a meal replaced          @sad_factors.sads_per_meal_replaced (the good days of the animals never bred)
// `withLivesAdded` rewrites a formula as written, before derived assumptions are expanded: each such
// reference becomes the figure plus the term below, by the income groups of the model's beneficiaries.
// The term is times $lives_added (1 in our view, 0 in the evaluator view, so a sheet still reproduces) and
// $side_effect_weight; the good of people who never start counts times $never_started_weight; the animals'
// suffering always counts. The pieces per income group are derived assumptions (assumptions/default.json):
// $descendants_<g>, $newborn_healthy_years_<g>, $newborn_life_years_<g>, $animal_dalys_per_person_year_<g>.
import type { Assumptions } from "./schema";
import { byIso3 } from "./countries";

export const LIVES_ADDED = "lives_added";
export const GROUPS = ["low_income", "lower_middle_income", "upper_middle_income", "high_income", "world"] as const;
export type Group = (typeof GROUPS)[number];
const BY_INCOME: Record<string, Group> = { L: "low_income", LM: "lower_middle_income", UM: "upper_middle_income", H: "high_income" };

/** Where a model's beneficiaries live, by World Bank income group: a country with no group, a "world"
 * share, a model with no beneficiaries and one that moves money all count at the world's figures. */
export function groupShares(b: Record<string, number> | "world" | "destinations" | undefined): Partial<Record<Group, number>> {
  if (!b || typeof b === "string") return { world: 1 };
  const out: Partial<Record<Group, number>> = {};
  let total = 0;
  for (const [iso, share] of Object.entries(b)) {
    const g = BY_INCOME[byIso3.get(iso)?.income ?? ""] ?? "world";
    out[g] = (out[g] ?? 0) + share;
    total += share;
  }
  if (!(total > 0)) return { world: 1 };
  for (const g of Object.keys(out) as Group[]) out[g] = Number((out[g]! / total).toPrecision(6));
  return out;
}
export const sharesKey = (s: Partial<Record<Group, number>>) => GROUPS.filter((g) => s[g]).map((g) => `${g}:${s[g]}`).join(",");

/** The age a death is averted at, by the shared figure that values it (years; GiveWell's bands at their middles). */
export const DEATH_FACTS: Record<string, number> = {
  "moral_weights.uov_per_death_under5": 2,
  "moral_weights.uov_per_death_over5": 30,
  "moral_weights.uov_per_death_age_5_14": 10,
  "moral_weights.uov_per_death_age_15_49": 32,
  "moral_weights.uov_per_death_age_50_74": 62,
  "moral_weights.givewell_neonatal": 0,
  "moral_weights.givewell_age_early_neonatal": 0,
  "moral_weights.givewell_age_late_neonatal": 0,
  "moral_weights.givewell_age_post_neonatal": 0.5,
  "moral_weights.givewell_age_1_4": 3,
  "moral_weights.givewell_age_5_9": 7.5,
  "moral_weights.givewell_age_10_14": 12.5,
  "moral_weights.givewell_age_15_19": 17.5,
  "moral_weights.givewell_age_20_24": 22.5,
  "moral_weights.givewell_age_25_29": 27.5,
  "moral_weights.givewell_age_30_34": 32.5,
  "moral_weights.givewell_age_35_39": 37.5,
  "moral_weights.givewell_age_40_44": 42.5,
  "moral_weights.givewell_age_45_49": 47.5,
  "moral_weights.givewell_age_50_54": 52.5,
  "moral_weights.givewell_age_55_59": 57.5,
  "moral_weights.givewell_age_60_64": 62.5,
  "moral_weights.givewell_age_65_69": 67.5,
  "moral_weights.givewell_age_70_74": 72.5,
  "moral_weights.givewell_age_75_79": 77.5,
  "moral_weights.givewell_age_80_84": 82.5,
  "moral_weights.givewell_age_85_plus": 87.5,
};
export const STILLBIRTH_FACT = "givewell_shared.uov_per_stillbirth";
/** A year of contraception's value, with the part of it from deaths averted and those deaths' share under five
 * (GiveWell's "Valuing contraception": infant and child deaths over those plus maternal deaths). */
export const CONTRACEPTION_FACTS: Record<string, { deaths: string; childShare: number }> = {
  "givewell_shared.uov_per_cyp_low_income": { deaths: "givewell_shared.uov_per_cyp_deaths_low_income", childShare: 0.6 },
  "givewell_shared.uov_per_cyp_nigeria": { deaths: "givewell_shared.uov_per_cyp_deaths_nigeria", childShare: 0.53 },
  "givewell_shared.uov_per_cyp_sierra_leone": { deaths: "givewell_shared.uov_per_cyp_deaths_sierra_leone", childShare: 0.6 },
};
export const INCOME_VALUE = "uov_per_ln_consumption";
/** A meal with animal products replaced: the suffering-adjusted days it spares. The animals it spares are
 * never bred, so the figure is read less their good days (pain-free days, at the reader's two settings), put
 * into suffering-adjusted days so the species step every meal model takes turns them back. */
export const MEAL_FACT = "sad_factors.sads_per_meal_replaced";
const MEAL_ANIMALS = "@sad_factors.animals_spared_per_meal_replaced";
const GOOD_DAYS = "good_days_per_animal_spared";

const num = (x: number) => String(Number(x.toPrecision(10)));
/** Years of 1 a year for `years` years, discounted at the shared rate. */
const annuity = (years: string) => `iferror((1 - (1 + $discount_rate) ^ -(${years})) / ln(1 + $discount_rate), ${years})`;

/** Remaining life expectancy at an age: a straight line from life expectancy at birth to that at 60, then
 * falling to nothing at 95. */
function remaining(age: number, g: Group): string {
  if (age <= 60) return `(@lives.life_expectancy_${g} - ${num(age)} + ${num(age / 60)} * (@lives.life_expectancy_at_60_${g} - @lives.life_expectancy_${g} + 60))`;
  return `(@lives.life_expectancy_at_60_${g} * ${num(Math.max(0.05, 1 - (age - 60) / 35))})`;
}
/** The share of a person's children still to come at an age: all before 15, none from 50. */
const childrenAhead = (age: number) => (age < 15 ? 1 : age >= 50 ? 0 : (50 - age) / 35);

/** Lives a death averted at an age adds besides the survivor: the survivor's descendants, less the births
 * parents forgo when a young child lives (the fertility response), each with its own descendants. */
function livesAdded(age: number, g: Group, descendants: boolean): string | undefined {
  if (!descendants) return undefined;
  const ahead = childrenAhead(age), child = age < 5;
  if (!ahead && !child) return undefined;
  const parts = [
    ...(ahead ? [`${num(ahead)} * $descendants_${g}`] : []),
    ...(child ? [`- @lives.births_averted_per_child_death_${g} * (1 + $descendants_${g})`] : []),
  ];
  return `(${parts.join(" ")})`;
}

/** Units of value a death averted at an age adds through the lives it adds, in one income group, before
 * $lives_added and $side_effect_weight: the good of the people who never start otherwise (times their
 * weight), less the suffering of the animals the survivor and those people eat. */
function deathTerm(age: number, g: Group, descendants: boolean): string {
  const n = livesAdded(age, g, descendants);
  const survivorYears = annuity(remaining(age, g));
  const good = n ? weighed(`${n} * $newborn_healthy_years_${g}`) : "0";
  const personYears = n ? `(${survivorYears} + ${n} * $newborn_life_years_${g})` : survivorYears;
  return `$uov_per_daly * (${good} - ${personYears} * $animal_dalys_per_person_year_${g})`;
}

const overGroups = (shares: Partial<Record<Group, number>>, f: (g: Group) => string) =>
  `(${GROUPS.filter((g) => shares[g]).map((g) => (shares[g] === 1 ? f(g) : `${num(shares[g]!)} * (${f(g)})`)).join(" + ")})`;
// `if`, not a product: the evaluator view switches it off, and a sheet pinned to a 0% discount rate would
// otherwise carry 0 × (0 / 0) into its own figures.
const second = (term: string) => `if($${LIVES_ADDED}, $side_effect_weight * ${term}, 0)`;
const weighed = (term: string) => `if($never_started_weight, $never_started_weight * ${term}, 0)`;

/** Whether a library carries the pieces the term reads: the switch among its assumptions and the figures
 * among its facts (an old commit's library, or a test's small one, doesn't). Set once when a library is built. */
const enabled = new WeakSet<Assumptions>();
const mealsEnabled = new WeakSet<Assumptions>();
export function enableLivesAdded(a: Assumptions, hasFact: (key: string) => boolean): void {
  if (!a.rows.some((r) => r.id === LIVES_ADDED) || !hasFact("lives.generation_years")) return;
  enabled.add(a);
  if (a.rows.some((r) => r.id === GOOD_DAYS) && hasFact(MEAL_FACT) && hasFact(MEAL_ANIMALS.slice(1))) mealsEnabled.add(a);
}
export const hasLivesAdded = (a: Assumptions): boolean => enabled.has(a);

const REF = /@([a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*)|\$([a-z_][a-z0-9_]*)/gi;

/** A formula as written, with every shared figure for a death, a stillbirth, a year of contraception or a
 * year of doubled income read with the lives it adds (see the top of this file). `descendants: false`: the
 * model counts the people who would follow in a row of its own (catastrophic risk), so only the survivors'
 * own years are added here. */
export function withLivesAdded(a: Assumptions, formula: string, shares: Partial<Record<Group, number>>, descendants = true): string {
  if (!hasLivesAdded(a) || !/@moral_weights\.|@givewell_shared\.uov_per_(stillbirth|cyp)|\$uov_per_ln_consumption|@sad_factors\.sads_per_meal_replaced/.test(formula)) return formula;
  const meals = mealsEnabled.has(a);
  return formula.replace(REF, (ref, fact: string | undefined, assumption: string | undefined) => {
    if (assumption !== undefined) {
      if (assumption !== INCOME_VALUE) return ref;
      // A year of doubled income: more animal products eaten, by the income elasticity of demand for them.
      return `(${ref} - ${second(`$uov_per_daly * ${overGroups(shares, (g) => `@lives.animal_food_income_elasticity_${g} * $animal_dalys_per_person_year_${g}`)}`)})`;
    }
    const key = fact!;
    if (key === MEAL_FACT)
      return meals ? `(${ref} - ${weighed(`$pain_free_time_good * ${MEAL_ANIMALS} * $${GOOD_DAYS} / (365 * $daly_per_sad) / $meal_ced_per_sad`)})` : ref;
    if (key in DEATH_FACTS) return `(${ref} + ${second(overGroups(shares, (g) => deathTerm(DEATH_FACTS[key], g, descendants)))} / $life_value_multiplier)`;
    if (key === STILLBIRTH_FACT)
      // A stillbirth averted is a life that starts: the rest of a newborn's value counts with the weight on
      // such lives, and the child adds what any newborn saved adds.
      return `(${ref} + ${weighed(`(@moral_weights.givewell_neonatal - ${ref})`)} + ${second(overGroups(shares, (g) => deathTerm(0, g, descendants)))} / $life_value_multiplier)`;
    const cyp = CONTRACEPTION_FACTS[key];
    if (cyp) {
      // A year of contraception: the unwanted births it averts are lives that never start (their good, with
      // their descendants', is lost at the weight; the animals they would eat are spared), and the deaths it
      // averts add lives like any others.
      const births = (per: string) => `@lives.unwanted_births_averted_per_cyp * $uov_per_daly * ${overGroups(shares, (g) => `(1 + $descendants_${g}) * ${per.replaceAll("<g>", g)}`)}`;
      const deaths = `@${cyp.deaths} * (${num(cyp.childShare)} * ${overGroups(shares, (g) => deathTerm(2, g, true))} / @moral_weights.uov_per_death_under5 + ${num(1 - cyp.childShare)} * ${overGroups(shares, (g) => deathTerm(32, g, true))} / @moral_weights.uov_per_death_age_15_49)`;
      return `(${ref} - ${weighed(births("$newborn_healthy_years_<g>"))} + ${second(`(${births("$newborn_life_years_<g> * $animal_dalys_per_person_year_<g>")} + ${deaths})`)})`;
    }
    return ref;
  });
}
