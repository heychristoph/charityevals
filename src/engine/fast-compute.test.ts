// compute() runs compiled formulas, and from a cached base recomputes only the rows a changed input
// reaches; the browser's trusted library skips the schema checks. All three must give the numbers the
// tree-walking evaluation gives.
import { describe, expect, it } from "vitest";
import { evaluate } from "./expr";
import { assumptionValues, buildLibrary, compute, headline, inputValue, pickValue } from "./model";

const assumptions = {
  groups: [{ id: "g", title: "G" }],
  rows: [
    { id: "uov_per_daly", section: "g", label: "healthy year", value: 2, kind: "judgment", explainer: "x" },
    { id: "k", section: "g", label: "k", value: { low: 1, best: 2, high: 3 }, kind: "judgment", explainer: "x" },
  ],
  units: { u: { label: "u", short: "u", to_common: "1" } },
  common: { unit: "u", benchmark: "m" },
};
const facts = [{ id: "f", label: "F", rows: [{ id: "x", label: "x", value: { low: 1, best: 4, high: 9 }, kind: "observed", explainer: "x" }] }];
const input = (id: string, value: number) => ({ id, label: id, value, kind: "judgment", explainer: "Test input." });
const m = {
  id: "m", name: "m", kind: "charity", cause: "global-health", output: { row: "out", unit: "u", label: "per $" },
  rows: [
    input("a", 3), input("b", 5), input("c", 0.5),
    { id: "d", label: "d", formula: "a * $k + @f.x" },
    { id: "e", label: "e", formula: "if(c > 0.4, b ^ 2, ln(b)) - max(a, c)" },
    { id: "out", label: "out", formula: "sum(d, e) / pv_annuity_due(1, 0.03, 4)" },
  ],
};
const reference = (inputs: Record<string, number>) => {
  const lib = buildLibrary([m], assumptions, facts);
  const mm = lib.models.get("m")!;
  const av = assumptionValues(lib.assumptions);
  const vals: Record<string, number> = {};
  for (const id of mm.order) {
    const r = mm.byId.get(id)!;
    vals[id] = inputs[id] ?? (r.node ? evaluate(r.node, (s, n) => (s === "row" ? vals[n] : s === "assumption" ? av[n] : inputs[`@${n}`] ?? pickValue(lib.facts.get(n)?.value))) : inputValue(r, "charityevals"));
  }
  return vals;
};

describe("fast compute", () => {
  const lib = buildLibrary([m], assumptions, facts);
  const mm = lib.models.get("m")!;
  const av = assumptionValues(lib.assumptions);
  it("gives the tree-walking evaluation's numbers, from scratch and from a base", () => {
    expect(lib.errors).toEqual([]);
    for (const inputs of [{}, { a: 7 }, { c: 0.1 }, { "@f.x": 9 }, { d: 1, b: 2 }, {}] as Record<string, number>[]) expect(compute(lib, mm, av, inputs)).toEqual(reference(inputs));
  });
  it("builds the same library trusted", () => {
    const t = buildLibrary([m], assumptions, facts, [], [], { trusted: true });
    expect(t.errors).toEqual([]);
    const tm = t.models.get("m")!;
    expect(headline(t, tm, assumptionValues(t.assumptions))).toBe(headline(lib, mm, av));
    expect(tm.resources).toEqual([]);
  });
});
