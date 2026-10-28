import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { assumptionComparable, oneIn } from "./comparables";
import { Assumptions } from "../engine/schema";
import { pickValue } from "../engine/model";

const assumptions = Assumptions.parse(JSON.parse(readFileSync(join(import.meta.dirname, "../../assumptions/default.json"), "utf8")));
const defaults = Object.fromEntries(assumptions.rows.map((r) => [r.id, pickValue(r.value)]));
const at = (id: string, v = defaults[id], over: Record<string, number> = {}) => assumptionComparable(id, v, { ...defaults, ...over, [id]: v });
/** The numbers in a sentence, in order. */
const nums = (s: string | undefined) => [...(s ?? "").matchAll(/\d[\d,]*(?:\.\d+)?/g)].map((m) => Number(m[0].replace(/,/g, "")));

/** Value of doubling one person's income for a year, in GiveWell units. */
const doubling = (av: Record<string, number>) => Math.LN2 * av.uov_per_ln_consumption;

describe("assumption comparables", () => {
  it("at GiveWell's default weight, doubling an income for a year is exactly one unit", () => {
    expect(doubling(defaults)).toBeCloseTo(1, 9);
  });

  it("a year of healthy life reads as that many income doublings", () => {
    expect(at("uov_per_daly")).toBe("A year of healthy life counts as much as doubling 2 people's incomes for a year.");
    expect(nums(at("uov_per_daly", 3.5))[0]).toBeCloseTo(3.5 / doubling(defaults), 1);
    // When income gains count for more, a healthy year is worth fewer doublings.
    expect(nums(at("uov_per_daly", 2, { uov_per_ln_consumption: 2 * Math.LOG2E }))[0]).toBe(1);
  });

  it("doubling an income reads as months of healthy life", () => {
    expect(at("uov_per_ln_consumption")).toBe("Doubling one person's income for a year counts as much as 6 months of healthy life.");
    expect(nums(at("uov_per_ln_consumption", 1.803368801))[0]).toBeCloseTo((12 * Math.LN2 * 1.803368801) / defaults.uov_per_daly, 1);
  });

  it("a day of disabling pain reads as healthy hours lost and, via the animal conversion, as income doublings", () => {
    const s = at("daly_per_sad")!;
    expect(s).toMatch(/^A day of disabling pain counts like losing 9\.6 hours of healthy life\. /);
    const [hours, days] = nums(s);
    expect(hours).toBeCloseTo(defaults.daly_per_sad * 365 * 24, 1);
    // The unit conversion the rankings use for suffering-adjusted days.
    const sadToUov = defaults.daly_per_sad * defaults.uov_per_daly * defaults.animal_moral_weight;
    expect(assumptions.units.sad.to_common).toBe("$daly_per_sad * $uov_per_daly * $animal_moral_weight");
    expect(days * sadToUov).toBeCloseTo(doubling(defaults), 2);
    expect(s).toContain(`${days} days of a person's disabling pain counts as much as doubling one person's income for a year.`);
  });

  it("switches to minutes for a very light day of pain, and follows the animal weight", () => {
    expect(at("daly_per_sad", 0.0001)).toMatch(/losing 53 minutes of healthy life/);
    const full = nums(at("daly_per_sad"))[1];
    const discounted = nums(at("daly_per_sad", defaults.daly_per_sad, { animal_moral_weight: 0.1 }))[1];
    expect(discounted / full).toBeCloseTo(10, 1);
  });

  it("a point of life satisfaction reads as years of doubled income", () => {
    expect(at("uov_per_wellby")).toBe("Raising someone's life satisfaction by one point out of ten for a year counts as much as doubling their income for 1.1 years.");
    expect(nums(at("uov_per_wellby", 3))[0]).toBeCloseTo(3 / doubling(defaults), 1);
  });

  it("saving a child's life reads as income doublings", () => {
    expect(at("life_value_multiplier")).toBe("Saving a young child's life counts as much as doubling 116 people's incomes for a year.");
    expect(nums(at("life_value_multiplier", 0.6))[0]).toBe(70);
  });

  it("animal weight reads as a fraction", () => {
    expect(at("animal_moral_weight")).toMatch(/^Animal suffering counts in full/);
    expect(at("animal_moral_weight", 0.05)).toBe("Animal suffering counts for about 1/20 of what each species' capacity to suffer implies.");
  });

  it("discount rate reads as the share good done in ten years keeps", () => {
    expect(at("discount_rate")).toBe("Good done 10 years from now counts for 68% of the same good done today; its weight halves every 18 years.");
    expect(at("discount_rate", 0)).toBe("Good done in 10 years counts the same as good done today.");
  });

  it("gives no comparable for toggles", () => {
    expect(at("full_credit")).toBeUndefined();
  });
});

describe("assumption labels", () => {
  const JARGON = /units? of value|\bDALY|WELLBY|\bSADs?\b|ln\(|consumption|welfare range|discount rate/i;
  for (const r of assumptions.rows) {
    it(`${r.id} is in plain words, with the jargon kept to its technical name`, () => {
      expect(r.label).not.toMatch(JARGON);
      expect(r.technical).toBeTruthy();
    });
  }
});

describe("oneIn", () => {
  it("restates small probabilities", () => {
    expect(oneIn("Probability of death", 1 / 32)).toBe("about 1 in 32");
    expect(oneIn("Cost per person", 0.01)).toBeUndefined();
  });
});
