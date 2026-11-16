import { describe, expect, it } from "vitest";
import { parseUnit } from "./units";
import { copiedFigureProblems, kindProblems, pairKey, sharedFactProblems, simulationProblems, typedValue, unitProblems } from "./preflight";
import { CONTEXT_ONLY, lintModel } from "./lint";
import { checkModel } from "./check-model";
import { assumptionValues } from "./model";
import { templateRowIds } from "./template-files";
import { filled, load, templateFiles } from "./test-library";

type Row = Record<string, unknown>;
/** A small model of ours: cost, reach, an outcome and the per-dollar result, plus any rows given. */
const model = (rows: Row[], extra: Record<string, unknown> = {}) => ({
  id: "unit-test-charityevals", name: "Unit test", kind: "charity", charity: "template-charity", cause: "global-health", owner: "charityevals",
  rows: [
    { id: "cost_total", label: "Spending, 2025", format: "usd", value: 1e6, kind: "observed", explainer: "From the accounts." },
    { id: "people", label: "People reached a year", unit: "people / year", value: 1000, kind: "observed", explainer: "From the report." },
    { id: "years", label: "Years the effect lasts", unit: "years", value: { low: 1, best: 2, high: 4 }, kind: "judgment", explainer: "As in the trials of the same programme." },
    ...rows,
  ],
  output: { row: "uov_per_dollar", unit: "uov", label: "Units of value per dollar" },
  ...extra,
});
const one = (raw: Record<string, unknown>) => { const { lib, models } = load(raw); return { lib, m: models[0] }; };
const where = (ps: { check: string; where: string }[], check: string) => ps.filter((p) => p.check === check).map((p) => p.where);

describe("units", () => {
  it("reads money, time and scale from unit strings", () => {
    expect(parseUnit("DALYs / $")).toEqual({ money: -1, time: 1, scale: 1 });
    expect(parseUnit("deaths / $1,000 / year")).toMatchObject({ money: -1, time: -1, scale: 1e-3 });
    expect(parseUnit("t CO₂e / ha / year")).toMatchObject({ money: 0, time: -1 });
    // No time in the unit says nothing about time; a calendar year is a date; an exchange rate hides its currency.
    expect(parseUnit("deaths")?.time).toBeUndefined();
    expect(parseUnit("Year")).toBeUndefined();
    expect(parseUnit("USD / GBP")?.money).toBeUndefined();
  });
  const outcome = (formula: string, unit: string) => one(model([
    { id: "dalys_per_person", label: "DALYs averted per person reached", unit: "DALYs / person", value: 0.01, kind: "estimate", explainer: "From the trials." },
    { id: "dalys", label: "DALYs averted", unit: "DALYs", formula: "people * years * dalys_per_person" },
    { id: "uov_per_dollar", label: "Result per dollar", unit, formula },
  ]));
  it("flags a per-dollar row that doesn't divide by the cost", () => {
    const { lib, m } = outcome("dalys * $uov_per_daly", "units of value / $");
    expect(unitProblems(lib, m).find((p) => p.where === "uov_per_dollar")?.severity).toBe("high");
  });
  it("flags per $1,000 written as per $", () => {
    const { lib, m } = outcome("dalys * $uov_per_daly / cost_total * 1000", "units of value / $");
    expect(unitProblems(lib, m).filter((p) => p.where === "uov_per_dollar").map((p) => p.message).join()).toMatch(/1,000/);
    expect(unitProblems(lib, m).some((p) => p.where === "uov_per_dollar" && p.severity === "high")).toBe(true);
  });
  it("passes a consistent chain", () => {
    const { lib, m } = outcome("dalys * $uov_per_daly / cost_total", "units of value / $");
    expect(unitProblems(lib, m)).toEqual([]);
  });
  it("flags a yearly flow summed into a total, and a percent typed as a percent", () => {
    const { lib, m } = one(model([
      { id: "share", label: "Share treated", format: "percent", value: 45, kind: "observed", explainer: "From the report." },
      { id: "dalys_per_person", label: "DALYs averted per person reached", unit: "DALYs / person", value: 0.01, kind: "estimate", explainer: "From the trials." },
      { id: "dalys_year", label: "DALYs a year", unit: "DALYs / year", formula: "people * dalys_per_person" },
      { id: "dalys", label: "DALYs averted", unit: "DALYs", formula: "dalys_year * years + dalys_year" },
      { id: "uov_per_dollar", label: "Result", unit: "units of value / $", formula: "dalys * share * $uov_per_daly / cost_total" },
    ]));
    const ps = unitProblems(lib, m);
    expect(ps.find((p) => p.where === "share")?.severity).toBe("high");
    expect(ps.some((p) => p.where === "dalys" && /adds/.test(p.message))).toBe(true);
  });
});

describe("shared facts typed by hand", () => {
  it("flags a typed copy of a fact's value under its words, from the first copy", () => {
    const { lib, m } = one(model([
      { id: "share_5_14", label: "Crises: of the deaths averted at five or older, share aged 5 to 14", value: 0.2, kind: "judgment", explainer: "Relief in crises." },
      { id: "uov_per_dollar", label: "Result", formula: "people * years * share_5_14 / cost_total" },
    ]));
    const p = sharedFactProblems(lib, m).find((x) => x.where === "share_5_14");
    expect(p?.severity).toBe("high");
    expect(p?.message).toMatch(/@death_ages\.crisis_share_5_14_of_over5/);
    // A coincidence INV-4 doesn't flag goes in the preflight's own section, with its reason.
    const w = { "shared-fact": { [`${m.id} share_5_14 = @death_ages.crisis_share_5_14_of_over5`]: "another quantity" } };
    expect(sharedFactProblems(lib, m, w).find((x) => x.where === "share_5_14")).toBeUndefined();
  });
  it("flags a concept the site answers once whatever the value", () => {
    const { lib, m } = one(model([
      { id: "gain_years", label: "Years a resettled refugee gains in the US", value: 25, kind: "judgment", explainer: "As other resettlement models." },
      { id: "uov_per_dollar", label: "Result", formula: "people * gain_years / cost_total" },
    ]));
    expect(sharedFactProblems(lib, m).find((x) => x.where === "gain_years")?.message).toMatch(/@irap\.years_gain_lasts/);
  });
  it("leaves a sourced household size of the programme's own recipients alone, not a typed national one", () => {
    const hh = (extra: Row) => model([
      { id: "hh_size", label: "Household size of the trial households (Kenya)", value: 6.5, kind: "observed", explainer: "Measured at baseline in the trial of the programme.", source: { title: "Trial report", url: "https://example.com/trial" }, ...extra },
      { id: "uov_per_dollar", label: "Result", formula: "people * years * hh_size / cost_total" },
    ]);
    const own = one(hh({}));
    expect(where(sharedFactProblems(own.lib, own.m), "shared-fact")).toEqual([]);
    const judged = one(hh({ kind: "judgment", source: undefined }));
    expect(where(sharedFactProblems(judged.lib, judged.m), "shared-fact")).toContain("hh_size");
    const national = one(hh({ label: "Average household size in Kenya", explainer: "DHS." }));
    expect(where(sharedFactProblems(national.lib, national.m), "shared-fact")).toContain("hh_size");
  });
  it("flags a typed next-dollar figure, and leaves a round judgment alone", () => {
    const { lib, m } = one(model([
      { id: "marginal_vs_past_average", label: "How much the next dollar does compared with the average dollar so far", format: "percent", value: 0.5, kind: "judgment", explainer: "Room for more funding." },
      { id: "reach_share", label: "Share of villages reached", format: "percent", value: { low: 0.1, best: 0.3, high: 0.5 }, kind: "judgment", explainer: "Like other programmes." },
      { id: "uov_per_dollar", label: "Result", formula: "people * years * reach_share * marginal_vs_past_average / cost_total" },
    ]));
    const ps = sharedFactProblems(lib, m);
    expect(where(ps, "shared-fact")).toEqual(["marginal_vs_past_average"]);
    expect(ps[0].message).toMatch(/next_dollar/);
  });
  it("finds a figure typed into another of our models", () => {
    const row = { id: "us_hens", label: "Table-egg laying hens in the US, 2025", value: 303e6, kind: "observed", explainer: "USDA." };
    const a = model([row, { id: "uov_per_dollar", label: "Result", formula: "us_hens * years / cost_total" }]);
    const b = { ...a, id: "other-test-charityevals", charity: "the-humane-league" };
    const { lib, models } = load(a, b);
    expect(where(copiedFigureProblems(lib, models[0]), "shared-fact")).toContain("us_hens");
  });
  it("leaves calendar years out: a counting period's first year, a row in unit Year", () => {
    const rows = [
      { id: "period_first_year", label: "First year of the spending period counted", value: 2021, kind: "observed", explainer: "Accounts." },
      { id: "start_year_of_programme", label: "Programme year it started in the region", unit: "Year", value: 2019, kind: "observed", explainer: "Report." },
      { id: "uov_per_dollar", label: "Result", formula: "people * years * (2025 - period_first_year) * (2025 - start_year_of_programme) / cost_total" },
    ];
    const a = model(rows);
    const { lib, models } = load(a, { ...a, id: "other-test-charityevals", charity: "the-humane-league" });
    const ws = where(copiedFigureProblems(lib, models[0]), "shared-fact");
    expect(ws).not.toContain("period_first_year");
    expect(ws).not.toContain("start_year_of_programme");
  });
  it("leaves out a pair waived as different quantities, either way round", () => {
    const row = { id: "us_hens", label: "Table-egg laying hens in the US, 2025", value: 303e6, kind: "observed", explainer: "USDA." };
    const a = model([row, { id: "uov_per_dollar", label: "Result", formula: "us_hens * years / cost_total" }]);
    const b = { ...a, id: "other-test-charityevals", charity: "the-humane-league" };
    const { lib, models } = load(a, b);
    const key = pairKey("other-test-charityevals", "us_hens", "unit-test-charityevals", "us_hens");
    const hens = (ps: { where: string; message: string }[]) => ps.filter((p) => p.where === "us_hens");
    expect(hens(copiedFigureProblems(lib, models[0]))[0].message).toContain(`"shared-fact-pair": { "${key}"`);
    const used = new Set<string>();
    expect(hens(copiedFigureProblems(lib, models[0], new Set(), { "shared-fact-pair": { [key]: "Different flocks." } }, used))).toEqual([]);
    expect([...used]).toEqual([key]);
  });
  it("reads a typed number only where nothing is referenced", () => {
    const { m } = one(model([{ id: "x", label: "X", formula: "110000 * 0.6" }, { id: "uov_per_dollar", label: "Result", formula: "x * people / cost_total" }]));
    expect(typedValue(m.byId.get("x")!)).toBeCloseTo(66000);
    expect(typedValue(m.byId.get("uov_per_dollar")!)).toBeUndefined();
  });
});

describe("kinds and reference classes", () => {
  it("flags a skeleton copied in as a template, with its placeholder sources", () => {
    const raw = templateFiles()["direct-health"];
    const { lib, m } = one({ ...raw, charity: "template-charity" });
    const ps = kindProblems(lib, m);
    expect(where(ps, "kind")).toContain("kind");
    expect(ps.some((p) => p.check === "kind" && /placeholder/.test(p.message))).toBe(true);
  });
  it("asks a judgment for its anchor", () => {
    const { lib, m } = one(model([
      { id: "effect", label: "Effect per person", value: { low: 0.1, best: 0.5, high: 0.9 }, kind: "judgment", explainer: "Our judgment, a half." },
      { id: "uov_per_dollar", label: "Result", formula: "people * years * effect / cost_total" },
    ]));
    expect(kindProblems(lib, m).find((p) => p.where === "effect")?.severity).toBe("high");
  });
});

describe("simulation", () => {
  const sim = (keys: string[], unstable = true) => ({ unstable, brokenEvents: false, shape: { q5: 0.01, q50: 1, q95: 100 }, wild: keys.map((key) => ({ key, low: 0, high: 1, atLow: 0.01, atHigh: 30 })) });
  const result = (ps: { where: string; severity: string }[]) => ps.find((p) => p.where === "result")?.severity;
  it("is high where the model's own rows flip it, medium where only shared facts do", () => {
    expect(result(simulationProblems("x", sim(["effect", "@welfare_ranges.shrimp_vs_chicken"])))).toBe("high");
    expect(result(simulationProblems("x", sim(["@welfare_ranges.shrimp_vs_chicken", "@sad_factors.sads_per_shrimp_stunned"])))).toBe("medium");
    expect(result(simulationProblems("x", sim([])))).toBe("high");
  });
  it("a waiver with its reason clears it, and goes once the result is stable", () => {
    const w = { simulation: { x: "The spread is the shared welfare range's." } };
    const ps = simulationProblems("x", sim(["@welfare_ranges.shrimp_vs_chicken"]), w);
    expect(result(ps)).toBeUndefined();
    expect(ps.every((p) => p.severity === "low")).toBe(true);
    expect(simulationProblems("x", sim([], false), w).map((p) => p.check)).toEqual(["waiver"]);
  });
});

describe("refactored gates", () => {
  it("lint leaves skeleton rows and context rows out of the unused finding", () => {
    const raw = filled(templateFiles()["cash-income"]);
    const extra = { id: "context_figure", section: "reach", label: "A context figure", value: 3, kind: "observed", source: { url: "https://example.com/x", retrieved: "2026-11-01", quote: "3" }, explainer: "Shown for reference, not used in the result: the national average for context." };
    const { lib, m } = one({ ...raw, id: "cash-test-charityevals", charity: "template-charity", rows: [...(raw.rows as Row[]), extra] });
    const unused = (opts = {}) => lintModel(lib, m, new Date(), opts).filter((f) => f.code === "unused").map((f) => f.row);
    expect(unused()).not.toContain("context_figure");
    expect(CONTEXT_ONLY.test(extra.explainer)).toBe(true);
    const templateRows = templateRowIds().get("cash-income");
    expect(unused({ templateRows }).every((r) => !templateRows?.has(r!))).toBe(true);
  }, 60_000);
  it("check.ts's per-model checks are importable", () => {
    const { lib, m } = one({ ...model([{ id: "uov_per_dollar", label: "Result", formula: "people / cost_total" }]), kind: "template" });
    expect(checkModel(lib, m, () => true, assumptionValues(lib.assumptions)).errors.join()).toMatch(/kind "template" on a charity's model/);
  });
});
