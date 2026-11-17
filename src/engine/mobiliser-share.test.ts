// The mobiliser's share (docs/normalization.md 2.24): the shared formulas carry it, the evaluator view never
// applies it, and, while the default is 100%, wiring it into the models changes no headline. The last is a
// stored snapshot of every model's headline at 100% (src/engine/mobiliser-share-snapshot.json): it must
// pass at every commit that adds the share to a model. The step that sets the default below 100% replaces
// the snapshot test with one on the share's range.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assumptionValues, buildLibrary, headline, headlineConversion, usedAssumptions } from "./model";
import { CAREER_CHANGE_FORMULA, META_DONOR_COST_SHARE_FORMULA, MOBILISER_SHARE, MOVED_MONEY_ROWS, SET_ROWS, destinationSetRows } from "./moved-money";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const assumptions = read(join(root, "assumptions/default.json"));

describe("the shared formulas", () => {
  const R = MOVED_MONEY_ROWS;
  it("one row reads the setting, and money moved, money shifted and career changes multiply by it once", () => {
    expect(R.mobiliser_share.formula).toBe(`$${MOBILISER_SHARE}`);
    expect(R.moved_dollar_net_value.formula).toBe("mobiliser_share * (new_money_share * moved_dollar_value + (1 - new_money_share) * (moved_dollar_value - prior_dollar_value))");
    expect(R.shifted_dollar_value.formula).toBe("mobiliser_share * (moved_dollar_value - prior_dollar_value)");
    // Spending that research or advice changed takes it through the shifted dollar, not a second time.
    expect(R.informed_money_value.formula).toBe("informed_money * shifted_dollar_value * evidence_adj * missing_data_adj");
    expect(CAREER_CHANGE_FORMULA).toBe("career_forgone_pay * career_years * career_employer_value * career_counterfactual_share * mobiliser_share");
    for (const f of [R.moved_dollar_net_value.formula, R.shifted_dollar_value.formula, CAREER_CHANGE_FORMULA]) expect(f.match(/\bmobiliser_share\b/g)).toHaveLength(1);
    // Every other shared row leaves it alone.
    for (const [id, r] of Object.entries(R)) if (!["mobiliser_share", "moved_dollar_net_value", "shifted_dollar_value"].includes(id)) expect(r.formula, id).not.toContain(MOBILISER_SHARE);
  });

  it("a second destination set reads the model's one row, never a prefixed copy", () => {
    const rows = destinationSetRows("gh", "value_global_health");
    expect(rows.map((r) => r.id)).toEqual(SET_ROWS.map((id) => `gh_${id}`));
    const byId = Object.fromEntries(rows.map((r) => [r.id, r.formula]));
    expect(byId.gh_moved_dollar_net_value).toBe("mobiliser_share * (new_money_share * gh_moved_dollar_value + (1 - new_money_share) * (gh_moved_dollar_value - gh_prior_dollar_value))");
    expect(byId.gh_shifted_dollar_value).toBe("mobiliser_share * (gh_moved_dollar_value - gh_prior_dollar_value)");
    expect(rows.some((r) => r.formula.includes("gh_mobiliser_share"))).toBe(false);
  });

  it("the credit by share of resources counts co-funders only: the donors whose money is moved are under the share", () => {
    expect(META_DONOR_COST_SHARE_FORMULA).toBe("1 / (1 + if($resource_shares, salary_sacrifice, 0))");
  });
});

describe("the setting", () => {
  const row = assumptions.rows.find((r: { id: string }) => r.id === MOBILISER_SHARE);
  it("is a share from 5% to 100% beside the co-funder toggle, with an explainer of at most 80 words", () => {
    expect(row).toMatchObject({ section: "accounting", format: "percent", kind: "judgment", slider: { low: 0.05, high: 1 } });
    expect(row.value.low).toBe(0.05);
    expect(row.value.high).toBe(1);
    expect(row.explainer.split(/\s+/).length).toBeLessThanOrEqual(80);
    const ids = assumptions.rows.filter((r: { section?: string }) => r.section === "accounting").map((r: { id: string }) => r.id);
    expect(ids).toEqual(["resource_shares", MOBILISER_SHARE]);
  });
  // Deliberate: the step that flips the default (inventory/credit-plan-2026-11-17.md, step 7) changes this line.
  it("defaults to 100% until every model is wired", () => expect(row.value.best).toBe(1));
});

describe("views", () => {
  const dest = {
    id: "dest", name: "Dest", kind: "charity", cause: "global-health", owner: "charityevals",
    rows: [{ id: "x", label: "x", value: 2, kind: "observed", explainer: "Test input." }, { id: "mobiliser_share", label: "share", formula: "$mobiliser_share" }, { id: "out", label: "out", formula: "x * mobiliser_share" }],
    output: { row: "out", unit: "uov", label: "UoV per $" },
  };
  const reader = {
    id: "reader", name: "Reader", kind: "charity", cause: "global-health", owner: "givewell", beneficiaries: "destinations",
    rows: [{ id: "out", label: "out", formula: "3 * #dest" }],
    output: { row: "out", unit: "uov", label: "UoV per $" },
    evaluator: { name: "An evaluator", assumptions: {} },
  };
  const lib = buildLibrary([dest, reader], { ...assumptions, common: { ...assumptions.common, benchmark: "dest" } });
  const av = assumptionValues(lib.assumptions);
  const at = (s: number) => ({ ...av, [MOBILISER_SHARE]: s });
  const m = lib.models.get("reader")!;

  it("our view compounds the share along a chain; the evaluator view reads every model at 100%", () => {
    expect(lib.errors).toEqual([]);
    expect(headline(lib, m, at(0.3)) / headline(lib, m, at(1))).toBeCloseTo(0.3, 12);
    expect(headline(lib, m, at(0.3), {}, "evaluator")).toBe(headline(lib, m, at(1), {}, "evaluator"));
    expect(usedAssumptions(lib, m)).toContain(MOBILISER_SHARE);
    expect(usedAssumptions(lib, m, "evaluator")).not.toContain(MOBILISER_SHARE);
  });
});

describe("every headline at a mobiliser's share of 100%", () => {
  const lib = buildLibrary(walk(join(root, "models")).map(read), assumptions,
    walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
  const snapshot: Record<string, number | null> = read(join(import.meta.dirname, "mobiliser-share-snapshot.json"));
  const av = { ...assumptionValues(lib.assumptions), [MOBILISER_SHARE]: 1 };
  const models = [...lib.models.values()].filter((m) => m.output && m.kind !== "template" && headlineConversion(lib, m.output.unit));

  // A model built after the snapshot has no entry (it is born with the share); one changed on purpose
  // (a re-judged share, new data) gets its entry rewritten: npx tsx scripts/headlines.ts --snapshot <id>.
  it("covers the models that were there when the share was added", () => {
    expect(models.filter((m) => m.id in snapshot).length).toBeGreaterThan(400);
  });

  it("is the stored one: wiring the share in moves nothing", () => {
    const moved = models.flatMap((m) => {
      const want = snapshot[m.id], got = headline(lib, m, av);
      if (want === undefined) return [];
      const same = want === null ? !Number.isFinite(got) : Math.abs(got - want) <= 1e-9 * Math.max(Math.abs(got), Math.abs(want));
      return same ? [] : [`${m.id}: ${want} → ${got}`];
    });
    expect(moved).toEqual([]);
  });
});
