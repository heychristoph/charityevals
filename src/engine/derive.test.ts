// The derivation shows formulas with its own grouping; it must never change what a formula means.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { evaluate, parse } from "./expr";
import { formulaText } from "./derive";

const root = join(import.meta.dirname, "../..");
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});

describe("derivation grouping", () => {
  it("keeps a product in a denominator together", () => {
    expect(formulaText(parse("expenses / (patients * (1 - cost_adjustment))"))).toBe("expenses / (patients * (1 - cost_adjustment))");
    expect(formulaText(parse("a / b * c"))).toBe("a / b * c");
    expect(formulaText(parse("a - (b - c)"))).toBe("a - (b - c)");
    expect(formulaText(parse("(a * b) ^ c"))).toBe("(a * b) ^ c");
  });

  it("reads back to the same value for every formula in every model", () => {
    // Give each name a distinct value so a misplaced parenthesis changes the result.
    const val = (name: string) => 1.5 + ([...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 997, 7) / 97);
    const lookup = (_: string, name: string) => val(name);
    const bad: string[] = [];
    for (const f of walk(join(root, "models"))) {
      for (const r of JSON.parse(readFileSync(f, "utf8")).rows as { id: string; formula?: string }[]) {
        if (!r.formula) continue;
        const n = parse(r.formula), back = parse(formulaText(n));
        const a = evaluate(n, lookup), b = evaluate(back, lookup);
        if (!(a === b || Math.abs(a - b) <= 1e-9 * Math.abs(a) || (Number.isNaN(a) && Number.isNaN(b)))) bad.push(`${f}:${r.id}`);
      }
    }
    expect(bad).toEqual([]);
  }, 120_000);
});
