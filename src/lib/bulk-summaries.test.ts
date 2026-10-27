// The browser ranks bulk models from generated/bulk-summaries.json. These must give exactly the full
// models' results, whatever the visitor's assumptions, or the rankings would drift from the pages.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildLibrary, assumptionValues, bottomLine } from "../engine/model";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const base = walk(join(root, "models")).filter((p) => !p.includes("/models/grants/")).map(read);
const library = (bulk: unknown[]) => buildLibrary([...base, ...bulk], read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")));

describe("bulk summaries", () => {
  const full = library(walk(join(root, "models/grants")).map(read));
  const stub = library(read(join(root, "generated/bulk-summaries.json")));

  it("are valid models", () => expect(stub.errors).toEqual([]));

  it("match the full models under other assumptions, in both views", () => {
    const over = { life_value_multiplier: 1.4, discount_rate: 0.08, uov_per_daly: 4, uov_per_ln_consumption: 1.8 };
    const avF = assumptionValues(full.assumptions, over), avS = assumptionValues(stub.assumptions, over);
    const diffs: string[] = [];
    for (const m of full.models.values()) {
      if (!m.bulk) continue;
      for (const view of ["charityevals", "evaluator"] as const) {
        const a = bottomLine(full, m, avF, {}, view).native, b = bottomLine(stub, stub.models.get(m.id)!, avS, {}, view).native;
        if (Math.abs(a - b) > 1e-9 * Math.max(1, Math.abs(a))) diffs.push(`${m.id} (${view}): ${a} vs ${b}`);
      }
    }
    expect(diffs).toEqual([]);
  });
}, 120_000);
