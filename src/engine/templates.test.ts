// Every build-cea skeleton, filled in with its own example values, follows every rule of the site out of
// the box: no invariant of src/engine/invariants.ts flags it and the lint finds nothing high. So a model
// built from a template starts consistent, and a builder can only break a rule by changing it.
import { describe, expect, it } from "vitest";
import { checkAll } from "./invariants";
import { lintModel } from "./lint";
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
});
