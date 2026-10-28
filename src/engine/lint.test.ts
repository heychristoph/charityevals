import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildLibrary } from "./model";
import { lintModel } from "./lint";
import { TEMPLATES } from "./templates";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const dir = join(root, ".claude/skills/build-cea/templates");
const facts = readdirSync(join(root, "facts")).map((f) => read(join(root, "facts", f)));
const assumptions = read(join(root, "assumptions/default.json"));
const owners = read(join(root, "owners.json"));
const benchmark = read(join(root, "models/global-health/givedirectly.json"));
const charities = [{ id: "template-charity", name: "Template", cause: "global-health" }, { id: "givedirectly", name: "GiveDirectly", cause: "global-health" }];

function load(raw: Record<string, unknown>) {
  const lib = buildLibrary([benchmark, raw], assumptions, facts, charities, owners);
  return { lib, m: lib.models.get(raw.id as string)! };
}

/** A template with its placeholders filled the way a builder would. */
function filled(raw: Record<string, unknown>) {
  const rows = (raw.rows as Record<string, unknown>[]).map((r) => ({
    ...r,
    explainer: typeof r.explainer === "string" ? r.explainer.replace(/TEMPLATE: ?/g, "") + " Filled in for the test with a rationale long enough to pass." : r.explainer,
  }));
  return { ...raw, kind: "charity", summary: "A test charity. It does one thing in one place and the model says how much good a dollar does, with the biggest uncertainty named.", rows };
}

describe("build-cea templates", () => {
  for (const family of Object.keys(TEMPLATES)) {
    it(`${family}: skeleton loads and only its placeholders fail`, () => {
      const raw = read(join(dir, `${family}.json`));
      const { lib, m } = load(raw);
      expect(lib.errors.filter((e) => e.startsWith(raw.id))).toEqual([]);
      const high = lintModel(lib, m).filter((f) => f.severity === "high");
      expect(high.length).toBeGreaterThan(0);
      expect(high.every((f) => f.code === "placeholder")).toBe(true);
    });
    it(`${family}: filled in, it passes`, () => {
      const { lib, m } = load(filled(read(join(dir, `${family}.json`))));
      expect(lintModel(lib, m).filter((f) => f.severity === "high")).toEqual([]);
    });
  }
});

describe("lint", () => {
  const base = () => filled(read(join(dir, "corporate-campaign.json")));
  const withRow = (raw: Record<string, unknown>, id: string, patch: Record<string, unknown>) => ({
    ...raw,
    rows: (raw.rows as Record<string, unknown>[]).map((r) => (r.id === id ? { ...r, ...patch } : r)),
  });
  const codes = (raw: Record<string, unknown>) => {
    const { lib, m } = load(raw);
    return lintModel(lib, m).filter((f) => f.severity !== "low").map((f) => `${f.code}:${f.row ?? ""}`);
  };

  it("flags a sourced input without a URL", () => {
    expect(codes(withRow(base(), "animals_per_year", { source: { title: "somewhere" } }))).toContain("source:animals_per_year");
  });
  it("flags magic numbers in formulas", () => {
    expect(codes(withRow(base(), "outcome_total", { formula: "animals_affected_per_year * discounted_years * sads_per_animal_year * total_adj * 0.7" }))).toContain("magic-number:outcome_total");
  });
  it("flags an adjustment that never reaches the result", () => {
    expect(codes(withRow(base(), "total_adj", { formula: "counterfactual_adj * attribution_share * implementation_adj" }))).toContain("unapplied:evidence_adj");
  });
  it("flags out-of-bounds canonical values", () => {
    expect(codes(withRow(base(), "counterfactual_adj", { value: 1.4 }))).toContain("bounds:counterfactual_adj");
  });
  it("flags a judgment without a range", () => {
    expect(codes(withRow(base(), "evidence_adj", { value: 0.7 }))).toContain("range:evidence_adj");
  });
  it("flags a missing canonical row", () => {
    const raw = base();
    const rows = (raw.rows as unknown as { id: string }[]).filter((r) => r.id !== "attribution_share_shared");
    expect(codes({ ...raw, rows })).toContain("required-row:attribution_share_shared");
  });
});
