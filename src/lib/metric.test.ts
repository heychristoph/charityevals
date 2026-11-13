// The measures figures can be shown in: one factor per measure, the same for every charity, read from
// the shared sliders and facts.
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { assumptionValues, buildLibrary } from "../engine/model";
import { METRICS, REFERENCE_INCOME, figureIn } from "./metric";

const read = (f: string) => JSON.parse(readFileSync(f, "utf8"));
const lib = buildLibrary([], read("assumptions/default.json"), readdirSync("facts").map((f) => read(`facts/${f}`)));
const av = assumptionValues(lib.assumptions);
const factor = (id: string, a = av) => METRICS.find((m) => m.id === id)!.factor(lib, a);

describe("measures", () => {
  it("healthy years are the figures themselves", () => {
    expect(factor("daly")).toBe(1);
  });
  it("dollars of good: a healthy year per $1, in dollars to someone at the reference income", () => {
    // 2 units of value per healthy year; $1 at $50,000 is 1.4427 / 50,000 units of value.
    expect(factor("dollars")).toBeCloseTo((2 / 1000) / (1.4426950408889634 / REFERENCE_INCOME), 6);
    expect(factor("dollars", { ...av, uov_per_daly: 4 })).toBeCloseTo(2 * factor("dollars"), 9);
  });
  it("WELLBYs follow the WELLBY rate, multiples of cash the cash benchmark", () => {
    expect(factor("wellby")).toBeCloseTo(1 / av.daly_per_wellby, 12);
    expect(factor("cash")).toBeCloseTo((2 / 1000) / 0.00335, 9);
  });
  it("formats with the measure's sign", () => {
    expect(figureIn(METRICS.find((m) => m.id === "dollars")!, 100).format(28)).toBe("$2,800");
    expect(figureIn(METRICS.find((m) => m.id === "cash")!, 0.5).format(40)).toBe("20×");
  });
});
