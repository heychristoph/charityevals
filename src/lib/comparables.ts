// Familiar comparisons for numbers people find hard to picture: exchange rates between units, moral
// weights, discount rates and small probabilities, restated in things people can imagine (a doubled
// income, hours of healthy life, "1 in 30"). They're computed from the visitor's current settings.
// Each stays in its slider's own terms, or in healthy years, the unit results are shown in.


const round = (x: number) => (x >= 100 ? Math.round(x).toLocaleString("en-US") : x >= 10 ? x.toFixed(0) : x >= 1 ? x.toFixed(1).replace(/\.0$/, "") : x.toPrecision(2));
const plural = (n: string, one: string, many: string) => (n === "1" ? one : many);

/** One doubled income-year in units of value: ln(2) times the value of raising ln(consumption) by 1. */
const doubling = (av: Record<string, number>) => Math.LN2 * (av.uov_per_ln_consumption ?? Math.LOG2E);



/** A plain-language reading of a shared assumption at value `v`, given the other current values. */
export function assumptionComparable(id: string, v: number, av: Record<string, number>): string | undefined {
  const d = doubling({ ...av, [id]: v });
  // One clause each, in the slider's own terms: a comparable translates a hard-to-picture number and
  // never brings in a second unit. Sliders whose value already reads plainly get none.
  switch (id) {
    case "uov_per_ln_consumption": {
      const months = round((12 * d) / (av.uov_per_daly ?? 2));
      return `A doubled-income year counts as ${months} healthy ${plural(months, "month", "months")}.`;
    }
    case "discount_rate":
      return v <= 0 ? "Good done in 10 years counts in full." : `Good done in 10 years counts ${Math.round(100 / (1 + v) ** 10)}%.`;
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
