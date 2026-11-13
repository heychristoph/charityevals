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
  it("on a page, an edited number is the reader's: fixed, not drawn", () => {
    const lib = buildLibrary([model("m", [input("a", { low: 1, best: 4, high: 16 }), input("b", { low: 1, best: 9, high: 81 }), { id: "out", label: "out", formula: "a * b" }])], assumptions);
    const m = lib.models.get("m")!;
    const d = simulate(lib, m, 4000, undefined, { a: 5 })!;
    expect(Math.log(d.q[18] / d.q[9])).toBeCloseTo(Math.log(9), 0);
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

  it("draws a single event's chance as happens or doesn't: a 1-in-4 long shot is 0 below 75% and 4× its best guess above", () => {
    const lib = buildLibrary([model("m", [input("v", { low: 50, best: 100, high: 200 }), input("p", 0.25, { format: "percent", single_event: true }), { id: "out", label: "out", formula: "v * p" }])], assumptions);
    const d = simulate(lib, lib.models.get("m")!, 4000)!;
    expect(d.middle).toBeCloseTo(1, 1);
    expect(d.q[9]).toBeLessThan(1e-6);
    expect(d.q[13]).toBeLessThan(1e-6);
    expect(d.q[16] / d.middle!).toBeGreaterThan(3);
    expect(d.mean).toBeCloseTo(1.08, 0);
    expect(d.zero).toBeCloseTo(0.75, 1);
  });
  it("events sharing a key happen together: with the charity at least whenever without it", () => {
    const ev = { format: "percent", single_event: { with: "law" } };
    const lib = buildLibrary([model("m", [input("with", 0.3, ev), input("without", 0.1, ev), { id: "out", label: "out", formula: "with - without" }])], assumptions);
    const d = simulate(lib, lib.models.get("m")!, 4000)!;
    expect(d.q[0]).toBeGreaterThan(-1e-6);
    expect(d.zero).toBeCloseTo(0.8, 1);
  });
  it("exactly one of a key's scenarios happens", () => {
    const sc = { format: "percent", single_event: { one_of: "s" } };
    const lib = buildLibrary([model("m", [input("a", 0.5, sc), input("b", 0.3, sc), input("c", 0.2, sc), { id: "out", label: "out", formula: "a + b + c" }])], assumptions);
    const d = simulate(lib, lib.models.get("m")!, 2000)!;
    expect(d.q[0]).toBeCloseTo(1, 5);
    expect(d.q[18]).toBeCloseTo(1, 5);
  });
});
