// Uncertainty shares must follow leverage times spread, use published ranges before defaults, sort
// inputs into the right sources, and stay fast on the largest import.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assumptionValues, buildLibrary, compute } from "./model";
import { DEFAULT_FACTOR, sourceOf, uncertainty } from "./uncertainty";

const root = join(import.meta.dirname, "../..");
const assumptions = JSON.parse(readFileSync(join(root, "assumptions/default.json"), "utf8"));

const model = {
  id: "toy",
  name: "Toy",
  cause: "global-health",
  kind: "charity",
  output: { row: "per_dollar", unit: "daly", label: "Years of healthy life per dollar" },
  rows: [
    { id: "cost", label: "Cost per person", value: 200, kind: "observed", explainer: "x" },
    { id: "people", label: "People", value: 50, kind: "estimate", explainer: "x" },
    { id: "effect", label: "Effect", value: { low: 0.4, best: 0.8, high: 1.6 }, kind: "estimate", explainer: "x" },
    { id: "validity", label: "Adjustment for external validity", value: 0.5, kind: "estimate", explainer: "x" },
    { id: "unused", label: "Context", value: 3, kind: "observed", explainer: "x" },
    { id: "reach", label: "Share reached", value: 0.5, kind: "estimate", explainer: "x" },
    { id: "coverage", label: "Coverage", formula: "reach * 2", range: { low: 0.5, high: 2 } },
    { id: "good", label: "Good done", formula: "people * effect * validity * coverage" },
    { id: "per_dollar", label: "Good per dollar", formula: "good / cost" },
  ],
};

describe("uncertainty", () => {
  const lib = buildLibrary([model], assumptions);
  const m = lib.models.get("toy")!;
  const av = assumptionValues(lib.assumptions);
  const u = uncertainty(lib, m, compute(lib, m, av), av, "charityevals");
  const by = (id: string) => u.drivers.find((d) => d.id === id)!;

  it("sorts inputs by type, reading labels when the type says only 'estimate'", () => {
    expect(sourceOf({ kind: "estimate", label: "Adjustment for external validity" })).toBe("judgment");
    expect(sourceOf({ kind: "estimate", label: "Cost per net distributed" })).toBe("data");
    expect(sourceOf({ kind: "estimate", label: "Reduction in mortality" })).toBe("estimate");
    expect(sourceOf({ kind: "observed", label: "Anything" })).toBe("data");
  });

  it("uses the published range where there is one, and the default by type otherwise", () => {
    expect(by("effect").published).toBe(true);
    expect(by("effect").spread).toBeCloseTo(Math.log(4) / 2);
    expect(by("validity").published).toBe(false);
    expect(by("validity").source).toBe("judgment");
    expect(by("validity").spread).toBeCloseTo(Math.log(DEFAULT_FACTOR.judgment));
    expect(by("cost").spread).toBeCloseTo(Math.log(DEFAULT_FACTOR.data));
  });

  it("weights each input's spread by its leverage, and leaves out what the result doesn't use", () => {
    expect(by("people").elasticity).toBeCloseTo(1, 2);
    expect(by("cost").elasticity).toBeCloseTo(-0.99, 2);
    expect(u.drivers.find((d) => d.id === "unused")).toBeUndefined();
    // The published fourfold range on the effect outweighs a default ±50% judgment call.
    expect(u.drivers[0].id).toBe("effect");
    const total = u.drivers.reduce((t, d) => t + d.share, 0);
    expect(total).toBeCloseTo(1);
    expect(u.bySource.estimate + u.bySource.judgment + u.bySource.data + u.bySource.assumption).toBeCloseTo(1);
  });

  it("counts the shared assumptions that convert the result into the common unit", () => {
    const conv = u.drivers.filter((d) => d.source === "assumption");
    expect(conv.length).toBeGreaterThan(0);
  });

  it("takes a calculated row's published range at its word, without its inputs on top", () => {
    expect(by("coverage")).toMatchObject({ published: true, scope: "row" });
    expect(by("coverage").spread).toBeCloseTo(Math.log(4) / 2);
    expect(u.drivers.find((d) => d.id === "reach")).toBeUndefined();
    expect(u.ranged.has("coverage")).toBe(true);
    expect(u.rowVar("coverage")).toBeCloseTo(by("coverage").spread ** 2);
  });

  it("gives the tree a variance for every row", () => {
    expect(u.rowVar("good")).toBeCloseTo(by("people").spread ** 2 + by("effect").spread ** 2 + by("validity").spread ** 2 + by("coverage").spread ** 2, 2);
    expect(u.rootVar).toBeGreaterThan(u.rowVar("good"));
  });

  it("runs on the largest import in well under a second", () => {
    const raw = JSON.parse(readFileSync(join(root, "models/grants/givewell/evidence-action-in-line-chlorination-india-2023.json"), "utf8"));
    const facts = readdirSync(join(root, "facts")).map((f) => JSON.parse(readFileSync(join(root, "facts", f), "utf8")));
    const big = buildLibrary([raw], assumptions, facts);
    const bm = big.models.get(raw.id)!;
    const bav = assumptionValues(big.assumptions);
    const values = compute(big, bm, bav);
    const t = performance.now();
    const bu = uncertainty(big, bm, values, bav, "charityevals");
    const ms = performance.now() - t;
    console.log(`uncertainty: ${ms.toFixed(0)} ms over ${bm.rows.length} rows, ${bu.drivers.length} drivers`);
    expect(bu.drivers.length).toBeGreaterThan(10);
    expect(ms).toBeLessThan(1000);
  }, 60_000);
});
