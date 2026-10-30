// Which models rank a charity (C1, C1b, C2 in docs/review-backlog.md): one figure per evaluator, from
// each program's newest real estimate, never a skeleton, VOI or breakeven sheet.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildLibrary, modelsOf } from "./model";
import { combine, combineLocations, declaredLocations, isSideSheet, locationsOf, locationWeights, newestFirst, programOf, rankingPlan } from "./ranking";
import type { ResolvedModel } from "./model";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const lib = buildLibrary(walk(join(root, "models")).map(read), read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
const ids = (charity: string) => rankingPlan(lib, charity).flatMap((e) => e.parts.map((p) => p.model.id));

describe("ranking plan", () => {
  it("never ranks a skeleton, VOI, breakeven, threshold or optionality sheet", () => {
    for (const id of ["centre-for-pesticide-suicide-prevention-cpsp-skeleton", "vital-strategies-botec-breakeven",
      "clinton-health-access-initiative-chai-msupply-voi-2025", "dimagi-optionality-mother-baby-wellness",
      "path-threshold-accelerator-malaria-vaccines", "fika-bridges-to-prosperity-value-information"])
      expect(isSideSheet(lib.models.get(id)!)).toBe(true);
    for (const id of ["against-malaria-foundation", "vital-strategies-model", "evidence-action-deworm-world-2024-renewal"])
      expect(isSideSheet(lib.models.get(id)!)).toBe(false);
    expect(ids("vital-strategies")).toEqual(["vital-strategies-model"]);
    expect(rankingPlan(lib, "centre-for-pesticide-suicide-prevention")).toEqual([]);
  });

  it("gives each evaluator one entry, and each program its newest model", () => {
    expect(rankingPlan(lib, "against-malaria-foundation").map((e) => e.owner)).toEqual(["givewell", "hli"]);
    expect(ids("evidence-action").sort()).toEqual([
      "evidence-action-deworm-world-2024-renewal",
      "evidence-action-ifa-in-bihar-uttar-pradesh-july-2024",
      "evidence-action-in-line-chlorination-india-2023",
      "evidence-action-syphilis-screening-treatment-in",
    ]);
    expect(ids("new-incentives")).toEqual(["new-incentives"]);
  });

  it("counts each program's newest model, hand-built or bulk import (C5)", () => {
    // GiveWell's Jan 2025 Cash for Poverty Relief sheet is newer than the hand-built Nov 2024 model; the
    // Nov 2025 pilot sheets (>6x BOTECs, optionality) cover pilot variations, not the program.
    expect(ids("givedirectly")).toEqual(["givedirectly-cash-poverty-relief-2024", "givedirectly-hli"]);
    expect(newestFirst(modelsOf(lib, "givedirectly"))[0].id).toBe("givedirectly-pilots-optionality-2025");
    expect(modelsOf(lib, "givedirectly")[0].id).toBe("givedirectly");
    // The hand-built Sep 2026 SMC model is newer than every bulk SMC sheet.
    expect(ids("malaria-consortium")[0]).toBe("malaria-consortium-smc");
  });

  it("files programs as the money went (C6, C7)", () => {
    const plan = (charity: string) => rankingPlan(lib, charity).flatMap((e) => e.parts.map((p) => `${p.program}:${p.model.id}`));
    // CHAI's PPM grant is organisational (program performance management): weight 0, off the ranking.
    expect(plan("clinton-health-access-initiative").some((x) => x.includes("chai-ppm"))).toBe(false);
    expect(plan("malaria-consortium")).toContain("vas:malaria-consortium-smc-vas-co-delivery-by-october-2023");
    expect(plan("alima").sort()).toEqual([
      "malnutrition-chad:alima-malnutrition-treatment-chad-2024-renewal",
      "malnutrition-niger-nigeria:alima-malnutrition-treatment-combined",
      "primary-care-cameroon:alima-primary-healthcare-malnutrition",
    ]);
    const ea = lib.charities.get("evidence-action")!;
    expect(programOf(ea, lib.models.get("evidence-action-quick-nls-calcs")!)).toBe("no-lean-season");
    expect(programOf(ea, lib.models.get("evidence-action-india")!)).toBe("iron-folic-acid");
  });

  it("every declared program matches at least one model", () => {
    for (const c of lib.charities.values())
      for (const p of c.programs ?? [])
        expect([...lib.models.values()].some((m) => m.charity === c.id && m.kind === "charity" && programOf(c, m) === p.id), `${c.id}: ${p.id}`).toBe(true);
  });

  it("weights locations only by real, differing grant sizes", () => {
    // GiveWell's multi-location sheets size every location at one hypothetical $1M grant.
    for (const id of ["against-malaria-foundation", "helen-keller-vas", "new-incentives", "malaria-consortium-smc"])
      expect(locationWeights(lib, locationsOf(lib, lib.models.get(id)!))).toBeUndefined();
  });
});

describe("funding weights (C2, C4)", () => {
  it("weights every program of a charity, each with a source, or none", () => {
    for (const c of lib.charities.values()) {
      const ps = c.programs ?? [];
      const weighted = ps.filter((p) => p.weight !== undefined);
      if (!weighted.length) continue;
      expect(weighted.length, c.id).toBe(ps.length);
      for (const p of ps) expect(p.weight_source, `${c.id}: ${p.id}`).toMatch(/https:\/\//);
    }
  });

  it("lists every location of a declared family exactly once, from a source", () => {
    for (const c of lib.charities.values()) {
      for (const familyId of new Set((c.locations ?? []).map((l) => l.family))) {
        const parent = lib.models.get(familyId);
        expect(parent?.charity, `${c.id}: ${familyId}`).toBe(c.id);
        const family = locationsOf(lib, parent!);
        const parts = declaredLocations(c, family);
        expect(parts, `${c.id}: ${familyId}`).toBeDefined();
        for (const l of c.locations!.filter((x) => x.family === familyId)) expect(l.weight_source, l.label).toMatch(/https:\/\//);
        // A location in a funded entry and in the zero entry would be double-booked.
        const zero = new Set(parts!.filter((p) => p.weight === 0).flatMap((p) => p.models));
        const funded = new Set(parts!.filter((p) => p.weight > 0).flatMap((p) => p.models));
        for (const m of family) expect(zero.has(m) !== funded.has(m), `${familyId}: ${m.id} listed ${zero.has(m) ? "twice" : "nowhere"}`).toBe(true);
      }
    }
  });

  it("ranks GiveWell's multi-location families by where the money went", () => {
    for (const [charity, family] of [["against-malaria-foundation", "against-malaria-foundation"], ["malaria-consortium", "malaria-consortium-smc"],
      ["helen-keller-intl", "helen-keller-vas"], ["new-incentives", "new-incentives"]])
      expect(declaredLocations(lib.charities.get(charity), locationsOf(lib, lib.models.get(family)!)), family).toBeDefined();
  });
});

describe("combineLocations", () => {
  const m = (id: string) => ({ id }) as ResolvedModel;
  const figures: Record<string, number> = { a: 10, b: 20, c: 40, d: 1000 };
  const figure = (x: ResolvedModel) => ({ central: figures[x.id], low: figures[x.id] / 2, high: figures[x.id] * 2 });

  it("takes the dollar-weighted mean of value per dollar, a shared entry counting as its locations' median", () => {
    const c = combineLocations([
      { label: "one", weight: 3, models: [m("a")] },
      { label: "group", weight: 1, models: [m("b"), m("c"), m("a")] },
      { label: "unfunded", weight: 0, models: [m("d")] },
    ], figure);
    // (3 * 10 + 1 * median(20, 40, 10)) / 4
    expect(c.central).toBe(12.5);
    expect(c.low).toBe(6.25);
    expect(c.basis).toBe("weighted");
  });

  it("is undefined without declared funding, so the family keeps the median", () => {
    const amf = locationsOf(lib, lib.models.get("against-malaria-foundation")!);
    expect(declaredLocations(undefined, amf)).toBeUndefined();
    expect(declaredLocations({ ...lib.charities.get("against-malaria-foundation")!, locations: [{ family: "against-malaria-foundation", label: "x", models: "chad", weight: 0, weight_source: "" }] }, amf)).toBeUndefined();
    expect(declaredLocations({ ...lib.charities.get("against-malaria-foundation")!, locations: [{ family: "against-malaria-foundation", label: "x", models: "nowhere", weight: 1, weight_source: "" }] }, amf)).toBeUndefined();
  });
});

describe("combine", () => {
  it("weights by funding when every figure has a weight", () => {
    const c = combine([{ central: 10, low: 5, high: 20, weight: 3 }, { central: 30, low: 10, high: 60, weight: 1 }]);
    expect(c).toEqual({ central: 15, low: 6.25, high: 30, basis: "weighted" });
  });

  it("takes the median otherwise, and orders reversed ranges", () => {
    const c = combine([{ central: 10, low: 5, high: 20 }, { central: 40, low: 60, high: 10, weight: 2 }, { central: 20, low: 9, high: 30 }]);
    expect(c).toEqual({ central: 20, low: 9, high: 30, basis: "median" });
  });

  it("drops a weight-0 figure, and falls back to the median when no figure has money", () => {
    expect(combine([{ central: 10, low: 5, high: 20, weight: 2 }, { central: 99, low: 1, high: 200, weight: 0 }]))
      .toEqual({ central: 10, low: 5, high: 20, basis: "weighted" });
    expect(combine([{ central: 10, low: 5, high: 20, weight: 0 }, { central: 30, low: 15, high: 40, weight: 0 }]).basis).toBe("median");
  });
});
