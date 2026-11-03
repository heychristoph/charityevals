// Every build-cea skeleton, filled in with its own example values, follows every rule of the site out of
// the box: no invariant of src/engine/invariants.ts flags it and the lint finds nothing high. So a model
// built from a template starts consistent, and a builder can only break a rule by changing it.
import { describe, expect, it } from "vitest";
import { checkAll } from "./invariants";
import { lintModel } from "./lint";
import { assumptionValues, headline } from "./model";
import { TEMPLATES } from "./templates";
import { filled, load, templateFiles } from "./test-library";

const files = templateFiles();

describe("build-cea templates, filled in", () => {
  it("there is a skeleton for every family", () => {
    expect(Object.keys(TEMPLATES).filter((f) => !files[f])).toEqual([]);
  });

  // Each in a library of its own (with the models it reads live), as a builder's model would be: the
  // skeletons share their example numbers, which INV-14 would otherwise read as a copied constant.
  for (const [name, raw] of Object.entries(files)) {
    describe(name, () => {
      const { lib, models: [m] } = load(filled(raw));
      const reports = checkAll(lib);
      it("loads", () => expect(lib.errors).toEqual([]));
      it("no invariant flags it", () => {
        expect(reports.flatMap((r) => r.violations.filter((v) => v.model === m.id).map((v) => `${v.inv} ${v.where}: ${v.detail}`))).toEqual([]);
      });
      it("every check that applies to a charity model looked at it", () => {
        for (const id of ["INV-1", "INV-2a", "INV-2b", "INV-2c", "INV-2d", "INV-4", "INV-9", "INV-9b", "INV-10", "INV-11", "INV-13", "INV-14", "INV-15", "INV-18", "INV-19"])
          expect(reports.find((x) => x.id === id)?.status, id).not.toBe("not checked");
        if (m.cause === "animal-welfare") expect(reports.find((x) => x.id === "INV-3")!.checked).toBeGreaterThan(0);
      });
      it("the lint finds nothing high or medium", () => {
        expect(lintModel(lib, m).filter((f) => f.severity !== "low").map((f) => `${f.code} ${f.row ?? ""}: ${f.message}`)).toEqual([]);
      });
      it("has a positive, finite result in years of healthy life", () => {
        const v = lib.models.get(m.id)!;
        expect(v.output).toBeDefined();
      });
    });
  }

  // The branches a skeleton leaves at 0 (a programme with no outcome data, illness in DALYs, wild animals,
  // a second unit), switched on: every bridge and the proxy still pass every invariant, and the proxy
  // part moves with the missing-data slider exactly.
  for (const [name, raw] of Object.entries(files)) {
    it(`${name}, every branch switched on, passes every invariant`, () => {
      const on = filled(raw);
      on.id = `${raw.id}-on`;
      on.summary = `${on.summary} With every branch on it may be more than ten times its peers because the test's example numbers are large.`;
      on.rows = (on.rows as Record<string, unknown>[]).map((r) => {
        if (r.formula !== undefined) return r;
        const v = r.value as number | { low: number; best: number; high: number };
        if (r.id === "proxy_program_spend") return { ...r, value: 200_000 };
        if (v === 0) return { ...r, value: r.format === "integer" ? 1000 : 0.01 };
        if (typeof v === "object" && v.best === 0) return { ...r, value: { ...v, best: (v.low + v.high) / 2 || 0.01 } };
        return r;
      });
      const { lib, models: [m] } = load(on);
      expect(lib.errors).toEqual([]);
      const reports = checkAll(lib);
      expect(reports.flatMap((r) => r.violations.filter((v) => v.model === m.id).map((v) => `${v.inv} ${v.where}: ${v.detail}`))).toEqual([]);
      const av = assumptionValues(lib.assumptions);
      const at = (k: number) => headline(lib, m, { ...av, missing_data_discount: av.missing_data_discount * k });
      expect(at(1) - at(0)).toBeGreaterThan(0);
      expect((at(0.5) - at(0)) / (at(1) - at(0))).toBeCloseTo(0.5, 9);
    });
  }

  it("a bridge written any other way, or a proxy that skips the slider, is caught", () => {
    const raw = filled(files["domestic-services"]);
    raw.id = "template-domestic-services-bad";
    raw.rows = (raw.rows as Record<string, unknown>[]).map((r) =>
      r.id === "dalys_from_wellby" ? { ...r, formula: "wellbys_bridged * $daly_per_wellby" } : r.id === "proxy_per_donor_dollar" ? { ...r, formula: "proxy_share * proxy_peer_result" } : r);
    const { lib, models: [m] } = load(raw);
    const v = checkAll(lib).flatMap((r) => r.violations.filter((x) => x.model === m.id).map((x) => `${x.inv} ${x.where}`));
    expect(v).toContain("INV-2b dalys_from_wellby $daly_per_wellby");
    const codes = lintModel(lib, m).filter((f) => f.severity === "high").map((f) => `${f.code} ${f.row}`);
    expect(codes).toEqual(expect.arrayContaining(["bridge dalys_from_wellby", "shared proxy_per_donor_dollar"]));
  });
});
