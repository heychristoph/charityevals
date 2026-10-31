// Purely theoretical models (owner decision 2026-10-31): Ambitious Impact's estimates of an idea, written
// before the charity existed, are shown only while the charity runs the modelled programme and no model of
// its actual work exists, and the site flags them wherever they appear.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assumptionValues, buildLibrary, modelsOf } from "./model";
import { flags, sensitivity, THEORETICAL_TEXT } from "./sensitivity";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const lib = buildLibrary(walk(join(root, "models")).map(read), read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
const aim = [...lib.models.values()].filter((m) => m.owner === "ambitious-impact");

describe("purely theoretical models", () => {
  it("every Ambitious Impact model is marked theoretical, with the evidence that the charity runs the programme", () => {
    expect(aim.length).toBeGreaterThan(0);
    for (const m of aim) {
      expect(m.theoretical, m.id).toBeDefined();
      expect(m.theoretical!.url, m.id).toMatch(/^https:\/\//);
      expect(m.theoretical!.runs.length, m.id).toBeGreaterThan(20);
    }
  });

  it("a theoretical model is shown only where no other model of the charity exists", () => {
    for (const m of [...lib.models.values()].filter((x) => x.theoretical))
      expect(modelsOf(lib, m.charity).filter((x) => !x.theoretical).map((x) => x.id), m.id).toEqual([]);
  });

  it("its first caveat says it is purely theoretical; other models don't carry it", () => {
    const av = assumptionValues(lib.assumptions);
    const m = aim[0];
    const f = flags(m, sensitivity(lib, m, av));
    expect(f[0]).toEqual({ level: "warn", short: "purely theoretical", text: THEORETICAL_TEXT });
    const other = lib.models.get(lib.assumptions.common.benchmark)!;
    expect(flags(other, sensitivity(lib, other, av)).some((x) => x.short === "purely theoretical")).toBe(false);
  });

  it("the inventory lists every Ambitious Impact entry as imported (and theoretical) or not shown, with a reason", () => {
    const inv = read(join(root, "inventory/ambitious-impact-models.json")) as { status: string; model_id?: string; theoretical?: string }[];
    for (const e of inv.filter((x) => x.model_id)) {
      if (lib.models.has(e.model_id!)) expect(e.status === "imported" && !!e.theoretical, e.model_id).toBe(true);
      else expect(e.status, e.model_id).toMatch(/^not shown: .{20,}/);
    }
  });
});
