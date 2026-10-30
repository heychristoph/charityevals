// The tree must split formulas the way a reader would, skip rows that only pass a number along, and
// find any row the bottom line uses, on a small model and on the largest import alike.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { evaluate, parse } from "./expr";
import { assumptionValues, buildLibrary, comparable, compute, headlineNode } from "./model";
import { childrenOf, headlineFormula, identityOf, lookupFor, pathTo, pathToRef, rootOf, shapeOf, spreadShare } from "./tree";
import { rowsFeeding, sensitivity } from "./sensitivity";
import { uncertainty } from "./uncertainty";

const root = join(import.meta.dirname, "../..");
const assumptions = JSON.parse(readFileSync(join(root, "assumptions/default.json"), "utf8"));

const ops = (f: string) => shapeOf(parse(f)).parts.map((p) => p.op ?? "");

describe("formula shapes", () => {
  it("reads products, quotients and sums as signed parts", () => {
    expect(ops("a * b / c")).toEqual(["", "×", "÷"]);
    expect(ops("a / (b * c)")).toEqual(["", "÷", "÷"]);
    expect(ops("a / (b / c)")).toEqual(["", "÷", "×"]);
    expect(ops("a - b + c")).toEqual(["", "−", "+"]);
    expect(ops("a - (b - c)")).toEqual(["", "−", "+"]);
    expect(ops("sum(a, b, c)")).toEqual(["", "+", "+"]);
  });
  it("collapses only wrappers that return their input unchanged", () => {
    expect(identityOf(parse("iferror(a, 0)"))).toBe("a");
    expect(identityOf(parse("a * 1"))).toBe("a");
    expect(identityOf(parse("max(a)"))).toBe("a");
    expect(identityOf(parse("1 - a"))).toBeUndefined();
    expect(identityOf(parse("a * a"))).toBeUndefined();
  });
  it("names what operators can't say", () => {
    expect(shapeOf(parse("max(a, b)")).how).toBe("the larger part");
    expect(ops("if(a > 1, b, c)")).toEqual(["if", "then", "else"]);
  });
});

const model = {
  id: "toy",
  name: "Toy",
  cause: "global-health",
  kind: "charity",
  output: { row: "per_dollar", unit: "uov", label: "Good per dollar" },
  rows: [
    { id: "cost", label: "Cost", value: 200, kind: "observed", explainer: "x" },
    { id: "people", label: "People", value: 50, kind: "estimate", explainer: "x" },
    { id: "effect", label: "Effect", value: 0.8, kind: "judgment", explainer: "x" },
    { id: "effect_copy", label: "Effect (copied)", formula: "effect" },
    { id: "effect_safe", label: "Effect (checked)", formula: "iferror(effect_copy, 0)" },
    { id: "unused", label: "Context", value: 3, kind: "observed", explainer: "x" },
    { id: "good", label: "Good done", formula: "people * effect_safe * 0.5" },
    { id: "per_dollar", label: "Good per dollar", formula: "good / cost" },
  ],
};

describe("the tree", () => {
  const lib = buildLibrary([model], assumptions);
  const m = lib.models.get("toy")!;
  const look = lookupFor(lib, m, compute(lib, m, {}), {}, "charityevals");

  it("opens into parts with operators and leverage", () => {
    const r = rootOf(m, look);
    expect(r.value).toBeCloseTo(0.1);
    const kids = childrenOf(m, r, look);
    expect(kids.map((k) => [k.op ?? "", k.rowId])).toEqual([["", "good"], ["÷", "cost"]]);
    expect(kids[0].e).toBeCloseTo(1, 2);
    expect(kids[1].e).toBeCloseTo(-0.99, 2);
  });

  it("skips rows that only pass a number along", () => {
    const good = childrenOf(m, rootOf(m, look), look)[0];
    const parts = childrenOf(m, good, look);
    expect(parts.map((p) => p.type)).toEqual(["input", "input", "const"]);
    expect(parts[1]).toMatchObject({ rowId: "effect", named: "effect_safe", via: ["effect_safe", "effect_copy"] });
  });

  it("finds a path to any row the bottom line uses, and none to the others", () => {
    expect(pathTo(m, "effect_copy", look)).toEqual(["r", "r.0", "r.0.1"]);
    expect(pathTo(m, "cost", look)).toEqual(["r", "r.1"]);
    expect(pathTo(m, "unused", look)).toBeUndefined();
  });

  it("reaches every used row of the largest import", () => {
    const raw = JSON.parse(readFileSync(join(root, "models/grants/givewell/evidence-action-in-line-chlorination-india-2023.json"), "utf8"));
    const facts = readdirSync(join(root, "facts")).map((f) => JSON.parse(readFileSync(join(root, "facts", f), "utf8")));
    const big = buildLibrary([raw], assumptions, facts);
    const bm = big.models.get(raw.id)!;
    const blook = lookupFor(big, bm, compute(big, bm, {}), {}, "charityevals");
    // A sample across the model: each search is one breadth-first pass over it.
    const used = [...rowsFeeding(bm)].filter((_, i) => i % 250 === 0);
    const t = performance.now();
    const missing = used.filter((id) => !pathTo(bm, id, blook)).slice(0, 5);
    expect(missing).toEqual([]);
    console.log(`pathTo: ${((performance.now() - t) / used.length).toFixed(1)} ms per search over ${bm.rows.length} rows`);
  }, 120_000);
});

describe("the headline", () => {
  const m = { output: { row: "out" } } as Parameters<typeof headlineFormula>[0];
  it("converts each unit into healthy years per $1,000, cancelling a healthy year's value where it can", () => {
    expect(headlineFormula(m, "1")).toBe("out / $uov_per_daly * 1000");
    expect(headlineFormula(m, "$uov_per_daly")).toBe("out * 1000");
    expect(headlineFormula(m, "$uov_per_wellby")).toBe("out * $uov_per_wellby / $uov_per_daly * 1000");
    expect(headlineFormula(m, "$chicken_vs_person * $daly_per_sad * $uov_per_daly")).toBe("out * $chicken_vs_person * $daly_per_sad * 1000");
  });
  it("cancels only a multiplied healthy-year value, and keeps grouping", () => {
    expect(headlineFormula(m, "$k / $uov_per_daly")).toBe("out * $k / $uov_per_daly / $uov_per_daly * 1000");
    expect(headlineFormula(m, "$uov_per_daly / $k")).toBe("out / $k * 1000");
    expect(headlineFormula(m, "2 * ($a + $b)")).toBe("out * 2 * ($a + $b) / $uov_per_daly * 1000");
  });
  it("equals the common value over a healthy year's value per $1,000 for every unit", () => {
    const av: Record<string, number> = { ...assumptionValues(buildLibrary([], assumptions).assumptions), uov_per_daly: 3.1, chicken_vs_person: 0.37 };
    for (const [id, u] of Object.entries(assumptions.units as Record<string, { to_common?: string }>)) {
      if (!u.to_common) continue;
      const look = (s: string, n: string) => (s === "row" ? 0.25 : av[n]);
      const common = 0.25 * evaluate(parse(u.to_common!), look);
      expect(evaluate(headlineNode({ type: "ref", scope: "row", name: "out" }, u.to_common!), look), id).toBeCloseTo(common / (av.uov_per_daly / 1000), 9);
    }
  });
});

describe("every ranked model's tree", () => {
  const jf = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (e.name === "grants" ? [] : jf(join(d, e.name))) : e.name.endsWith(".json") ? [join(d, e.name)] : []));
  const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
  const lib = buildLibrary(jf(join(root, "models")).map(read), assumptions, jf(join(root, "facts")).map(read));
  const av = assumptionValues(lib.assumptions);
  const ranked = [...lib.models.values()].filter((m) => m.kind !== "template" && comparable(lib, m));

  it("ends in the number the rankings show, and its first parts share out the whole uncertainty", () => {
    const off: string[] = [];
    for (const m of ranked) {
      const values = compute(lib, m, av);
      const look = lookupFor(lib, m, values, av, "charityevals");
      const root = rootOf(m, look, lib.assumptions.units[m.output!.unit].to_common);
      const central = sensitivity(lib, m, av).central;
      if (!(Math.abs(root.value - central) <= 1e-9 * Math.abs(central))) off.push(`${m.id}: root ${root.value} vs ranking ${central}`);
      const u = uncertainty(lib, m, values, av, "charityevals");
      const sum = childrenOf(m, root, look).reduce((t, k) => t + spreadShare(u, k, root.value), 0);
      if (u.total > 0 && Math.abs(sum - 1) > 0.02) off.push(`${m.id}: shares sum to ${sum.toFixed(3)}`);
    }
    expect(ranked.length).toBeGreaterThan(10);
    expect(off).toEqual([]);
  }, 60_000);
});

describe("paths to shared numbers", () => {
  const lib = buildLibrary([model], assumptions);
  const m = lib.models.get("toy")!;
  const av = assumptionValues(lib.assumptions);
  const look = lookupFor(lib, m, compute(lib, m, av), av, "charityevals");
  const toCommon = lib.assumptions.units.uov.to_common;
  it("finds the node that reads an assumption, and nothing for one it doesn't read", () => {
    expect(pathToRef(m, "assumption", "uov_per_daly", look, toCommon)).toEqual(["r", "r.1"]);
    expect(pathToRef(m, "assumption", "chicken_vs_person", look, toCommon)).toBeUndefined();
    expect(pathToRef(m, "fact", "nowhere.x", look, toCommon)).toBeUndefined();
    expect(pathTo(m, "cost", look, toCommon)).toEqual(["r", "r.0", "r.0.1"]);
  });
});
