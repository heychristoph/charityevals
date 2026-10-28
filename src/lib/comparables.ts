// Familiar comparisons for numbers people find hard to picture: exchange rates between units, moral
// weights, discount rates and small probabilities, restated in things people can imagine (a doubled
// income, hours of healthy life, "1 in 30"). They're computed from the visitor's current settings.
// The common yardstick is GiveWell's: doubling one person's income for a year.

/** GiveWell's value of averting the death of a child under five from malaria, in units of value. */
const CHILD_LIFE_UOV = 116.25;

const round = (x: number) => (x >= 100 ? Math.round(x).toLocaleString("en-US") : x >= 10 ? x.toFixed(0) : x >= 1 ? x.toFixed(1).replace(/\.0$/, "") : x.toPrecision(2));
const plural = (n: string, one: string, many: string) => (n === "1" ? one : many);

/** One doubled income-year in units of value: ln(2) times the value of raising ln(consumption) by 1. */
const doubling = (av: Record<string, number>) => Math.LN2 * (av.uov_per_ln_consumption ?? Math.LOG2E);

/** One day of an animal's pain (as bad as a day of a person's disabling pain), in units of value:
 * the conversion the rankings use for suffering-adjusted days. */
const painDay = (av: Record<string, number>) => (av.daly_per_sad ?? 0) * (av.uov_per_daly ?? 2) * (av.animal_moral_weight ?? 1);

/** How many of something worth `each` units of value add up to one doubled income-year, rounded. */
const perDoubling = (d: number, each: number) => (each > 0 ? round(d / each) : undefined);

/** A plain-language reading of a shared assumption at value `v`, given the other current values. */
export function assumptionComparable(id: string, v: number, av: Record<string, number>): string | undefined {
  const d = doubling({ ...av, [id]: v });
  switch (id) {
    case "uov_per_ln_consumption": {
      const months = round((12 * d) / (av.uov_per_daly ?? 2));
      return `Doubling one person's income for a year counts as much as ${months} ${plural(months, "month", "months")} of healthy life.`;
    }
    case "life_value_multiplier": {
      const n = round((CHILD_LIFE_UOV * v) / d);
      return `Saving a young child's life counts as much as doubling ${n} ${plural(n, "person's income", "people's incomes")} for a year.`;
    }
    case "uov_per_daly": {
      const n = round(v / d);
      return `A year of healthy life counts as much as doubling ${n} ${plural(n, "person's income", "people's incomes")} for a year.`;
    }
    case "daly_per_sad": {
      // v is the share of a healthy year lost to one day of disabling pain. Animal suffering is
      // counted in days that are, after species and intensity weights, as bad as such a day.
      const hours = v * 365 * 24;
      const lost = hours >= 1 ? `${round(hours)} ${plural(round(hours), "hour", "hours")}` : `${round(hours * 60)} ${plural(round(hours * 60), "minute", "minutes")}`;
      const perDay = v * (av.uov_per_daly ?? 2) * (av.animal_moral_weight ?? 1);
      const days = perDay > 0 ? round(d / perDay) : undefined;
      return (
        `A day of disabling pain counts like losing ${lost} of healthy life.` +
        (days ? ` So sparing animals suffering as bad as ${days} ${plural(days, "day", "days")} of a person's disabling pain counts as much as doubling one person's income for a year.` : "")
      );
    }
    case "sads_per_animal_spared": {
      const n = perDoubling(d, v * painDay(av));
      return `Each farmed animal spared counts like sparing ${round(v)} ${plural(round(v), "day", "days")} of a person's disabling pain` +
        (n ? `, so sparing ${n} ${plural(n, "animal counts", "animals count")} as much as doubling one person's income for a year.` : ".");
    }
    case "animals_spared_per_person_reached": {
      const each = v >= 1 ? `Each person reached spares ${round(v)} farmed ${plural(round(v), "animal", "animals")}` : `One in ${round(1 / v)} people reached spares a farmed animal`;
      const n = perDoubling(d, v * (av.sads_per_animal_spared ?? 0) * painDay(av));
      return each + (n ? `, so reaching ${n} ${plural(n, "person counts", "people count")} as much as doubling one person's income for a year.` : ".");
    }
    case "sads_per_paper": {
      const n = round((v * painDay(av)) / d);
      return `One paper counts like sparing ${round(v)} days of a person's disabling pain, as much as doubling ${n} ${plural(n, "person's income", "people's incomes")} for a year.`;
    }
    case "uov_per_wellby": {
      const n = round(v / d);
      return `Raising someone's life satisfaction by one point out of ten for a year counts as much as doubling their income for ${n} ${plural(n, "year", "years")}.`;
    }
    case "animal_moral_weight":
      return v >= 0.995
        ? "Animal suffering counts in full, scaled only by how much each species can suffer compared with a person."
        : `Animal suffering counts for about 1/${round(1 / v)} of what each species' capacity to suffer implies.`;
    case "discount_rate": {
      if (v <= 0) return "Good done in 10 years counts the same as good done today.";
      const share = 100 / (1 + v) ** 10;
      return `Good done 10 years from now counts for ${Math.round(share)}% of the same good done today; its weight halves every ${round(Math.LN2 / Math.log(1 + v))} years.`;
    }
  }
  return undefined;
}

const PROBABILITY = /probab|chance|risk|likelihood|mortality|death rate|\bodds\b/i;

/** "about 1 in 32" for a small probability, when the row's label says it is one. */
export function oneIn(label: string, x: number): string | undefined {
  if (!PROBABILITY.test(label) || !(x > 0) || x >= 0.2) return undefined;
  const n = 1 / x;
  const shown = n >= 1000 ? Number(n.toPrecision(2)).toLocaleString("en-US") : n >= 100 ? (Math.round(n / 10) * 10).toString() : Math.round(n).toString();
  return `about 1 in ${shown}`;
}
