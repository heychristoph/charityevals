// The lives a result adds (docs/normalization.md 2.25, src/engine/population.ts): a death averted, a
// stillbirth averted, a year of contraception and a year of doubled income are read with the people who
// follow or never start and the animals they eat, by the income group of the model's beneficiaries; the
// evaluator view reads the figures as they are.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { simulate } from "./montecarlo";
import { assumptionValues, buildLibrary, compute, headline, pickValue, usedAssumptions, usedFacts } from "./model";
import { sensitivity } from "./sensitivity";
import { uncertainty } from "./uncertainty";
import { groupShares, withLivesAdded } from "./population";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const assumptions = read(join(root, "assumptions/default.json"));
const facts = walk(join(root, "facts")).map(read);
const fact = (key: string): number => {
  const [file, id] = key.split(".");
  return pickValue(facts.find((f) => f.id === file).rows.find((r: { id: string }) => r.id === id).value);
};
const input = (id: string, value: number) => ({ id, label: id, value, kind: "judgment", explainer: "Test input." });
const toy = (id: string, beneficiaries: unknown, rows: object[], extra: object = {}) => ({
  id, name: id, kind: "charity", cause: "global-health", beneficiaries, rows, output: { row: "out", unit: "uov", label: "UoV per $" }, evaluator: { name: "E", assumptions: {} }, ...extra,
});
const death = (factId: string, extra: object = {}) => [input("deaths", 0.001), { id: "value", label: "value", formula: `@moral_weights.${factId} * $life_value_multiplier`, ...extra }, { id: "out", label: "out", formula: "deaths * value" }];
const models = [
  toy("child-poor", { COD: 1 }, death("uov_per_death_under5")),
  toy("child-rich", { USA: 1 }, death("uov_per_death_under5")),
  toy("old-poor", { COD: 1 }, death("uov_per_death_age_50_74")),
  toy("old-rich", { USA: 1 }, death("uov_per_death_age_50_74")),
  toy("child-poor-future", { COD: 1 }, death("uov_per_death_under5", { descendants: false })),
  toy("stillbirth", { COD: 1 }, [input("n", 0.001), { id: "out", label: "out", formula: "n * @givewell_shared.uov_per_stillbirth * $life_value_multiplier" }]),
  toy("contraception", { SLE: 1 }, [input("years", 0.01), { id: "out", label: "out", formula: "years * @givewell_shared.uov_per_cyp_sierra_leone" }]),
  toy("income", { COD: 1 }, [input("doublings", 0.01), { id: "out", label: "out", formula: "doublings * ln(2) * $uov_per_ln_consumption" }]),
];
const lib = buildLibrary(models, { ...assumptions, common: { ...assumptions.common, benchmark: "child-poor" } }, facts);
const av: Record<string, number> = assumptionValues(lib.assumptions);
const off = { ...av, lives_added: 0 };
const h = (id: string, a: Record<string, number> = av, view: "charityevals" | "evaluator" = "charityevals") => headline(lib, lib.models.get(id)!, a, {}, view);

describe("where a model's beneficiaries live", () => {
  it("is the World Bank's income groups, the world's figures where it has none", () => {
    expect(groupShares({ COD: 1 })).toEqual({ low_income: 1 });
    expect(groupShares({ NGA: 0.5, USA: 0.25, world: 0.25 })).toEqual({ lower_middle_income: 0.5, high_income: 0.25, world: 0.25 });
    expect(groupShares({ COD: 0.2, ETH: 0.2 })).toEqual({ low_income: 1 });
    for (const b of [undefined, "world", "destinations"] as const) expect(groupShares(b)).toEqual({ world: 1 });
  });
});

describe("the lives a result adds", () => {
  it("builds", () => {
    expect(lib.errors).toEqual([]);
  });

  it("leave a formula that names none of the shared figures as it is, and a library without the pieces too", () => {
    expect(withLivesAdded(lib.assumptions, "a * $uov_per_daly + @cash.x", { world: 1 })).toBe("a * $uov_per_daly + @cash.x");
    const bare = buildLibrary([models[0]], { ...assumptions, common: { ...assumptions.common, benchmark: "child-poor" } }, facts.filter((f) => f.id !== "lives"));
    expect(bare.errors.filter((e) => !/lives\./.test(e))).toEqual([]);
    expect(withLivesAdded(bare.assumptions, "@moral_weights.uov_per_death_under5", { world: 1 })).toBe("@moral_weights.uov_per_death_under5");
  });

  it("barely move a result at the defaults: animals count for little next to people", () => {
    for (const m of models) expect(Math.abs(h(m.id) / h(m.id, off) - 1), m.id).toBeLessThan(0.005);
  });

  it("are a young child's descendants less the births parents forgo, in healthy years, where lives that never start count", () => {
    // Worked by hand from the facts, for a death under five averted in a low-income country.
    const r = av.discount_rate, g = "low_income";
    const d = (1 + r) ** -fact("lives.generation_years");
    const [n1, n2, n3] = [2050, 2075, 2100].map((y) => fact(`lives.reproduction_${y}_${g}`));
    const descendants = n1 * d + n1 * n2 * d ** 2 + (n1 * n2 * Math.min(1, n3) * d ** 3) / (1 - Math.min(1, n3) * d);
    const lifeYears = (1 - (1 + r) ** -fact(`lives.life_expectancy_${g}`)) / Math.log(1 + r);
    const healthyYears = (lifeYears * fact(`lives.healthy_life_expectancy_${g}`)) / fact(`lives.life_expectancy_${g}`);
    const added = descendants - fact(`lives.births_averted_per_child_death_${g}`) * (1 + descendants);
    const people = 0.001 * added * healthyYears * 1000;
    // Animals held out of it: at a chicken weight of 0 only the people are left.
    const noAnimals = { ...av, chicken_vs_person: 0 };
    expect(h("child-poor", { ...noAnimals, never_started_weight: 1 }) - h("child-poor", noAnimals)).toBeCloseTo(people, 6);
    expect(h("child-poor", { ...noAnimals, never_started_weight: 0.5 }) - h("child-poor", noAnimals)).toBeCloseTo(people / 2, 6);
    // Fewer people, not more: parents forgo more births than the child has descendants at this rate.
    expect(added).toBeLessThan(0);
  });

  it("add no people after an old death, and none where the model counts the future itself", () => {
    const noAnimals = { ...av, chicken_vs_person: 0 };
    for (const id of ["old-poor", "child-poor-future"]) expect(h(id, { ...noAnimals, never_started_weight: 1 }), id).toBeCloseTo(h(id, noAnimals), 9);
  });

  it("count the animals a survivor eats whatever lives that never start count, more where people eat more", () => {
    const heavy = { ...av, chicken_vs_person: 0.332 };
    const cost = (id: string) => 1 - h(id, heavy) / h(id, { ...heavy, lives_added: 0 });
    expect(cost("child-poor")).toBeGreaterThan(0);
    expect(cost("old-poor")).toBeGreaterThan(0);
    expect(cost("old-rich")).toBeGreaterThan(cost("old-poor"));
    expect(cost("income")).toBeGreaterThan(0);
    // Where parents forgo a birth for each child saved, a child saved adds almost no one to feed.
    expect(Math.abs(cost("child-rich"))).toBeLessThan(cost("old-rich") / 10);
  });

  it("scale with the side-effects slider, to nothing at 0", () => {
    const heavy = { ...av, chicken_vs_person: 0.332, never_started_weight: 1 };
    for (const m of models) {
      expect(h(m.id, { ...heavy, side_effect_weight: 0 }), m.id).not.toBeCloseTo(h(m.id, heavy), 6);
      if (m.id !== "stillbirth" && m.id !== "contraception") expect(h(m.id, { ...heavy, side_effect_weight: 0 }), m.id).toBeCloseTo(h(m.id, { ...heavy, lives_added: 0 }), 9);
    }
  });

  it("make a stillbirth averted a newborn's life at 100%, and a birth averted a loss", () => {
    const quiet = { ...av, chicken_vs_person: 0, side_effect_weight: 0 };
    const newborn = (0.001 * fact("moral_weights.givewell_neonatal") * 1000) / av.uov_per_daly;
    expect(h("stillbirth", { ...quiet, never_started_weight: 1 })).toBeCloseTo(newborn, 6);
    expect(h("stillbirth", quiet)).toBeCloseTo((0.001 * fact("givewell_shared.uov_per_stillbirth") * 1000) / av.uov_per_daly, 6);
    expect(h("contraception", { ...quiet, never_started_weight: 1 })).toBeLessThan(0);
    expect(h("contraception", quiet)).toBeCloseTo((0.01 * fact("givewell_shared.uov_per_cyp_sierra_leone") * 1000) / av.uov_per_daly, 6);
  });

  it("take the good days of the animals a replaced meal spares off the meal's figure, at the reader's two settings", () => {
    const meal = toy("meal", { USA: 1 }, [input("meals", 2), { id: "out", label: "out", formula: "meals * @sad_factors.sads_per_meal_replaced" }]);
    const l = buildLibrary([meal], { ...assumptions, common: { ...assumptions.common, benchmark: "meal" } }, facts);
    expect(l.errors).toEqual([]);
    const m = l.models.get("meal")!;
    const at = (o: Record<string, number>, view: "charityevals" | "evaluator" = "charityevals") => headline(l, m, { ...av, ...o }, {}, view) / 1000 * av.uov_per_daly;
    const sads = fact("sad_factors.sads_per_meal_replaced");
    expect(at({})).toBeCloseTo(2 * sads, 9);
    expect(at({ never_started_weight: 1 })).toBeCloseTo(2 * sads, 9);
    expect(at({ pain_free_time_good: 1 })).toBeCloseTo(2 * sads, 9);
    // By hand: the farmed birds and pigs among the animals of the world's average diet, their days alive
    // less their days of pain, a day at 1/365 of a healthy year, in the meal's own suffering days.
    const chicken = fact("aim_sads.chicken_2024"), pig = fact("aim_sads.pig_2024"), fish = fact("aim_sads.fish_2024");
    const birdDays = (fact("lives.lifespan_days_broiler") - fact("lives.sads_per_broiler") / chicken + fact("lives.lifespan_days_laying_hen") - fact("lives.sads_per_laying_hen") / chicken) / 2;
    const pigDays = (fact("lives.lifespan_days_pig") - fact("lives.sads_per_piglet") / pig) * fact("welfare_ranges.pig_vs_chicken");
    const goodDays = (fact("lives.farmed_birds_per_person_year") * birdDays + fact("lives.farmed_mammals_per_person_year") * pigDays) / fact("lives.animals_per_person_year");
    const cedPerSad = (fact("sad_factors.meal_sads_share_fish") / fish) * fact("welfare_ranges.fish_vs_chicken") + fact("sad_factors.meal_sads_share_chicken") / chicken + (fact("sad_factors.meal_sads_share_pig") / pig) * fact("welfare_ranges.pig_vs_chicken");
    const good = (fact("sad_factors.animals_spared_per_meal_replaced") * goodDays) / (365 * av.daly_per_sad) / cedPerSad;
    expect(at({ never_started_weight: 1, pain_free_time_good: 1 })).toBeCloseTo(2 * (sads - good), 6);
    expect(at({ never_started_weight: 0.5, pain_free_time_good: 0.2 })).toBeCloseTo(2 * (sads - 0.1 * good), 6);
    // Counted in full, a spared animal's good days outweigh its pain: sparing it is then a loss.
    expect(good).toBeGreaterThan(sads);
    expect(at({ never_started_weight: 1, pain_free_time_good: 1 }, "evaluator")).toBeCloseTo(2 * sads, 9);
  });

  it("never reach the evaluator view, nor what a row itself is said to read", () => {
    const all = { ...av, never_started_weight: 1, pain_free_time_good: 1, chicken_vs_person: 0.332 };
    for (const m of models) {
      expect(h(m.id, all, "evaluator"), m.id).toBe(h(m.id, off, "evaluator"));
      expect(usedAssumptions(lib, lib.models.get(m.id)!, "evaluator"), m.id).not.toContain("never_started_weight");
    }
    const m = lib.models.get("child-poor")!;
    expect(m.byId.get("value")!.assumptionDeps.sort()).toEqual(["daly_per_child_death", "life_value_multiplier", "uov_per_daly"]);
    expect(m.byId.get("value")!.livesAdded).toEqual(expect.arrayContaining(["never_started_weight", "chicken_vs_person", "side_effect_weight", "discount_rate"]));
    expect(usedAssumptions(lib, m)).toEqual(expect.arrayContaining(["never_started_weight", "chicken_vs_person"]));
    // A sheet pinned to a 0% discount rate still computes.
    expect(Number.isFinite(compute(lib, m, { ...av, discount_rate: 0, lives_added: 0 }).out)).toBe(true);
  });

  it("carry the ranges of the facts they are read from into the swings, the drivers and the simulated range", () => {
    const births = "lives.births_averted_per_child_death_low_income";
    const m = lib.models.get("child-poor")!;
    const all = { ...av, never_started_weight: 1 };
    expect(m.byId.get("value")!.factDeps).toEqual(["moral_weights.uov_per_death_under5"]);
    expect(m.byId.get("value")!.livesFacts).toContain(births);
    expect(usedFacts(m, lib)).toContain(births);
    expect(usedFacts(m, lib, "evaluator")).not.toContain(births);
    // More births forgone, fewer lives added: the result falls from the low end of the range to the high.
    const swing = sensitivity(lib, m, all).swings.find((x) => x.id === `@${births}`)!;
    expect(swing.atLow).toBeGreaterThan(swing.atHigh * 1.2);
    expect(sensitivity(lib, m, all, "evaluator").swings.some((x) => x.id === `@${births}`)).toBe(false);
    const drivers = (view: "charityevals" | "evaluator") => uncertainty(lib, m, compute(lib, m, all), all, view).drivers.map((d) => `${d.scope}:${d.id}`);
    expect(drivers("charityevals")).toContain(`fact:${births}`);
    expect(drivers("evaluator")).not.toContain(`fact:${births}`);
    // The simulation draws it: with every other number fixed, the range is the fact's alone.
    const width = (d: { q: number[] }) => d.q[d.q.length - 1] - d.q[0];
    expect(width(simulate(lib, m, 1000, all)!)).toBeGreaterThan(width(simulate(lib, m, 1000, all, { [`@${births}`]: fact(births) })!));
  });
});
