// The theory of change read off a model's formulas (src/engine/chain.ts).
import { describe, expect, it } from "vitest";
import { buildLibrary } from "./model";
import { chainOf, stepOf } from "./chain";

const assumptions = {
  groups: [{ id: "g", title: "G" }],
  rows: [{ id: "uov_per_daly", section: "g", label: "healthy year", value: 1, kind: "judgment", explainer: "x" }],
  units: { u: { label: "u", short: "u", to_common: "1" } },
  common: { unit: "u", benchmark: "m" },
};
const input = (id: string, label: string, value: number, extra: object = {}) => ({ id, label, value, kind: "judgment", explainer: "Test input.", ...extra });
const m = {
  id: "m", name: "m", kind: "charity", cause: "global-health", output: { row: "out", unit: "u", label: "per $" },
  rows: [
    input("program_spend", "Programme spending", 1000),
    input("people_reached", "People reached", 500),
    input("effect_per_person", "Deaths averted per person treated", 0.01),
    input("evidence_adj", "Evidence adjustment", 0.8),
    input("odd_name", "Row whose label says nothing", 0.6, { step: "anyway" }),
    { id: "out", label: "out", formula: "people_reached * effect_per_person * evidence_adj * odd_name / program_spend" },
  ],
};
const lib = buildLibrary([m], assumptions);

describe("chain", () => {
  it("names each factor of the bottom line by its step", () => {
    expect(lib.errors).toEqual([]);
    const c = chainOf(lib, lib.models.get("m")!)!;
    const steps = Object.fromEntries([...c.factors, ...c.programmes.flatMap((p) => p.factors)].map((f) => [f.ref, f.step]));
    expect(steps).toMatchObject({ people_reached: "reach", effect_per_person: "effect", evidence_adj: "evidence", odd_name: "anyway", program_spend: "cost" });
    expect(c.missing).toEqual(["credit"]);
  });
  it("takes a row's own step over its name", () => {
    expect(stepOf("people_reached", "", false, "credit")).toBe("credit");
    expect(stepOf("x", "Spillovers to neighbours")).toBe("side_effect");
  });
});
