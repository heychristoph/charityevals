// The value of a life: a slider in healthy years ($daly_per_child_death), and $life_value_multiplier,
// the multiplier on GiveWell's moral weights every death reads, worked out from it and the healthy-year
// rate (a derived assumption). Moving the healthy-year rate moves only what is valued through income;
// moving the life slider moves only deaths.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assumptionValues, buildLibrary, compute, headline, usedAssumptions } from "./model";
import { sensitivity } from "./sensitivity";
import { uncertainty } from "./uncertainty";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const assumptions = read(join(root, "assumptions/default.json"));
const facts = walk(join(root, "facts")).map(read);
const U5 = 116.25262;
type Raw = { rows: { id: string; [k: string]: unknown }[] };

describe("the value of a life", () => {
  const models = walk(join(root, "models")).map(read);
  const lib = buildLibrary(models, assumptions, facts, walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
  // The library as it was: the multiplier a slider of its own, at 1.
  const before: Raw = structuredClone(assumptions);
  const i = before.rows.findIndex((r) => r.id === "life_value_multiplier");
  before.rows[i] = { id: "life_value_multiplier", label: "x", value: { low: 0.6, best: 1, high: 1.4 }, kind: "judgment", explainer: "x" };
  const old = buildLibrary(models, before, facts, walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
  const av = assumptionValues(lib.assumptions);

  it("is GiveWell's at the defaults: every model's headline, in both views, is what it was with the multiplier at 1", () => {
    expect(lib.errors).toEqual([]);
    expect(old.errors).toEqual([]);
    expect(av.daly_per_child_death * av.uov_per_daly).toBe(U5);
    expect("life_value_multiplier" in av).toBe(false);
    const oav = assumptionValues(old.assumptions);
    let n = 0;
    for (const m of lib.models.values()) {
      if (!m.output) continue;
      for (const view of ["charityevals", "evaluator"] as const) {
        const a = headline(lib, m, av, {}, view), b = headline(old, old.models.get(m.id)!, oav, {}, view);
        if (Number.isNaN(b)) expect(a, `${m.id} ${view}`).toBeNaN();
        else expect(Math.abs(a - b) / Math.max(Math.abs(b), 1e-300), `${m.id} ${view}`).toBeLessThan(1e-12);
        n++;
      }
    }
    expect(n).toBeGreaterThan(500);
  });

  // A model with deaths and income gains, in units of value: deaths at GiveWell's weight for their age
  // times the multiplier, income at the income slider.
  const toy = {
    id: "toy", name: "Toy", kind: "charity", cause: "global-health",
    rows: [
      { id: "deaths", label: "Deaths averted per $", value: 0.0002, kind: "estimate", explainer: "Test input." },
      { id: "doublings", label: "Years of doubled income per $", value: 0.01, kind: "estimate", explainer: "Test input." },
      { id: "uov_deaths", label: "Units of value from deaths", formula: "deaths * @moral_weights.uov_per_death_age_15_49 * $life_value_multiplier" },
      { id: "uov_income", label: "Units of value from income", formula: "doublings * ln(2) * $uov_per_ln_consumption" },
      { id: "out", label: "Units of value per $", formula: "uov_deaths + uov_income" },
    ],
    output: { row: "out", unit: "uov", label: "UoV per $" },
  };
  const t = buildLibrary([toy], { ...assumptions, common: { ...assumptions.common, benchmark: "toy" } }, facts);
  const m = t.models.get("toy")!;
  const part = (a: Record<string, number>, held: string) => headline(t, m, a, { [held]: 0 });
  const deaths = (a: Record<string, number>) => part(a, "uov_income");
  const income = (a: Record<string, number>) => part(a, "uov_deaths");

  it("counts a death as the same healthy years whatever a healthy year is worth; income moves with it", () => {
    expect(t.errors).toEqual([]);
    // 15–49: GiveWell's 104 units of value over its 116.25 under five, of the slider's 58.1 healthy years.
    expect(deaths(av)).toBeCloseTo(0.0002 * (104 / U5) * av.daly_per_child_death * 1000, 9);
    for (const k of [0.5, 1.5, 2]) {
      const a = { ...av, uov_per_daly: av.uov_per_daly * k };
      expect(deaths(a)).toBeCloseTo(deaths(av), 9);
      expect(income(a)).toBeCloseTo(income(av) / k, 9);
    }
  });

  it("the life slider moves deaths in proportion and nothing else", () => {
    const a = { ...av, daly_per_child_death: av.daly_per_child_death * 1.5 };
    expect(deaths(a)).toBeCloseTo(1.5 * deaths(av), 9);
    expect(income(a)).toBeCloseTo(income(av), 12);
  });

  it("lists, swings and spreads the two sliders, never the multiplier", () => {
    expect(usedAssumptions(t, m)).toContain("daly_per_child_death");
    expect(usedAssumptions(t, m)).not.toContain("life_value_multiplier");
    const s = sensitivity(t, m, av);
    const life = s.swings.find((x) => x.id === "daly_per_child_death")!;
    expect(life.atHigh / life.atLow).toBeCloseTo((deaths({ ...av, daly_per_child_death: 81.376834 }) + income(av)) / (deaths({ ...av, daly_per_child_death: 34.875786 }) + income(av)), 9);
    expect(s.swings.some((x) => x.id === "life_value_multiplier")).toBe(false);
    const u = uncertainty(t, m, compute(t, m, av), av, "charityevals");
    expect(u.drivers.some((d) => d.id === "daly_per_child_death")).toBe(true);
  });

  it("an evaluator view pins the life slider (and the healthy-year rate), so the evaluator's numbers stay put", () => {
    const amf = lib.models.get("against-malaria-foundation")!;
    expect(amf.evaluator!.assumptions).toMatchObject({ daly_per_child_death: 58.12631, uov_per_daly: 2 });
    const h = headline(lib, amf, av, {}, "evaluator");
    expect(headline(lib, amf, { ...av, daly_per_child_death: 40, uov_per_daly: 3 }, {}, "evaluator")).toBe(h);
    // Our view: a reader's life slider moves it, the healthy-year rate moves only its income part.
    expect(headline(lib, amf, { ...av, daly_per_child_death: 70 })).toBeGreaterThan(headline(lib, amf, av));
  });

  it("no evaluator view pins the multiplier itself", () => {
    const pinned = { ...toy, id: "pinned", evaluator: { name: "E", assumptions: { life_value_multiplier: 1 } } };
    expect(buildLibrary([toy, pinned], { ...assumptions, common: { ...assumptions.common, benchmark: "toy" } }, facts).errors)
      .toEqual(["pinned: evaluator pins $life_value_multiplier, which is worked out from other assumptions: pin those instead"]);
  });
});
