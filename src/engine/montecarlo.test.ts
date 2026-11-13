// The Monte Carlo of a model's result (src/engine/montecarlo.ts): inputs drawn as their sources state
// their ranges, the result's shape stored relative to the best guess.
import { describe, expect, it } from "vitest";
import { normInv } from "./expr";
import { buildLibrary } from "./model";
import { simulate } from "./montecarlo";

const assumptions = {
  groups: [{ id: "g", title: "G" }],
  rows: [{ id: "uov_per_daly", section: "g", label: "healthy year", value: 1, kind: "judgment", explainer: "x" }],
  units: { u: { label: "u", short: "u", to_common: "1" } },
  common: { unit: "u", benchmark: "m" },
};
const input = (id: string, value: object | number, extra: object = {}) => ({ id, label: id, value, kind: "observed", explainer: "Test input.", ...extra });
const model = (id: string, rows: object[]) => ({ id, name: id, kind: "charity", cause: "global-health", rows, output: { row: "out", unit: "u", label: "per $" } });

describe("monte carlo", () => {
  it("a product of two log-normal 90% ranges spreads as the root of their squares", () => {
    // ln(4)/1.645 and ln(9)/1.645 log-sds: the product's 5-95% half log-width is sqrt(ln4² + ln9²).
    const lib = buildLibrary([model("m", [input("a", { low: 1, best: 4, high: 16 }), input("b", { low: 1, best: 9, high: 81 }), { id: "out", label: "out", formula: "a * b" }])], assumptions);
    const d = simulate(lib, lib.models.get("m")!, 4000)!;
    const s = Math.hypot(Math.log(4), Math.log(9));
    expect(d.q[9]).toBeCloseTo(1, 1);
    expect(Math.log(d.q[18] / d.q[9])).toBeCloseTo(s, 0);
    expect(Math.log(d.q[9] / d.q[0])).toBeCloseTo(s, 0);
    expect(d.zero).toBe(0);
  });
  it("reads a 25th-75th percentile range as such: wider at 5-95%", () => {
    const at = (interval?: number) => {
      const lib = buildLibrary([model("m", [input("a", { low: 2, best: 4, high: 8 }, interval ? { interval } : {}), { id: "out", label: "out", formula: "a" }])], assumptions);
      const d = simulate(lib, lib.models.get("m")!, 4000)!;
      return Math.log(d.q[18] / d.q[9]);
    };
    expect(at(0.5) / at()).toBeCloseTo(1.6448536 / normInv(0.75), 0);
  });
  it("never lets a negative share take away more than everything", () => {
    const lib = buildLibrary([model("m", [input("adj", { low: -0.9, best: -0.5, high: -0.1 }, { interval: 0.5 }), { id: "out", label: "out", formula: "10 * (1 + adj)" }])], assumptions);
    expect(simulate(lib, lib.models.get("m")!, 4000)!.zero).toBe(0);
  });
});
