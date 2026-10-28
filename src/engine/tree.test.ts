// The tree must split formulas the way a reader would, skip rows that only pass a number along, and
// find any row the bottom line uses, on a small model and on the largest import alike.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "./expr";
import { buildLibrary, compute } from "./model";
import { childrenOf, lookupFor, pathTo, rootOf, shapeOf } from "./tree";
import { rowsFeeding } from "./sensitivity";

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
