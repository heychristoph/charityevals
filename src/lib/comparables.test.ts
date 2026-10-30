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

  it("doubling an income reads as months of healthy life", () => {
    expect(at("uov_per_ln_consumption")).toBe("A doubled-income year counts as 6 healthy months.");
    expect(nums(at("uov_per_ln_consumption", 1.803368801))[0]).toBeCloseTo((12 * Math.LN2 * 1.803368801) / defaults.uov_per_daly, 1);
  });

  it("never brings a second unit into a slider whose value already reads plainly", () => {
    for (const id of ["uov_per_daly", "uov_per_wellby", "life_value_multiplier", "daly_per_sad", "chicken_vs_person"]) expect(at(id)).toBeUndefined();
  });

  it("discount rate reads as the share good done in ten years keeps", () => {
    expect(at("discount_rate")).toBe("Good done in 10 years counts 68%.");
    expect(at("discount_rate", 0)).toBe("Good done in 10 years counts in full.");
  });

  it("gives no comparable for toggles", () => {
    expect(at("resource_shares")).toBeUndefined();
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
