// The normalization invariants (docs/normalization.md section 3) over the built library, as an
// allowlist that only shrinks: a violation not in src/engine/normalization-allowlist.json fails, and
// so does an allowlisted one that no longer occurs (delete it from the list). The full report:
// npx tsx scripts/normalization-audit.ts (--write-allowlist rewrites the list after a fix).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildLibrary } from "./model";
import { checkAll, inv10, inv2b, inv3, keyOf, type Allowlist } from "./invariants";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const assumptions = read(join(root, "assumptions/default.json"));
const lib = buildLibrary(walk(join(root, "models")).map(read), assumptions,
  walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
const allowlist: Allowlist = read(join(import.meta.dirname, "normalization-allowlist.json"));
const reports = checkAll(lib);

describe("normalization invariants", () => {
  it("builds the library without errors", () => expect(lib.errors).toEqual([]));

  it("allowlists only invariants that exist", () => {
    const ids = new Set(reports.map((r) => r.id));
    expect(Object.keys(allowlist).filter((k) => !ids.has(k))).toEqual([]);
  });

  for (const r of reports) {
    if (r.status === "not checked") continue;
    const allowed = new Set(allowlist[r.id] ?? []);
    const found = new Set(r.violations.map(keyOf));

    it(`${r.id}: no new violations (${r.title})`, () => {
      const fresh = r.violations.filter((v) => !allowed.has(keyOf(v))).map((v) => `${keyOf(v)}: ${v.detail}`);
      expect(fresh, `new ${r.id} violations; fix them (see npx tsx scripts/normalization-audit.ts)`).toEqual([]);
    });

    it(`${r.id}: every allowlisted violation still occurs (the list only shrinks)`, () => {
      const gone = [...allowed].filter((k) => !found.has(k));
      expect(gone, `fixed: remove these from src/engine/normalization-allowlist.json`).toEqual([]);
    });
  }
});

// The checks themselves, on tiny models, so a check that silently stops finding anything is caught.
describe("invariant checks", () => {
  const base = {
    id: "base", name: "Base", kind: "charity", cause: "global-health",
    rows: [{ id: "x", label: "x", value: 2, kind: "observed", explainer: "Test input." }, { id: "out", label: "out", formula: "x" }],
    output: { row: "out", unit: "uov", label: "UoV per $" },
  };
  const animal = {
    id: "hens", name: "Hens", kind: "charity", cause: "animal-welfare",
    rows: [{ id: "x", label: "SADs", value: 3, kind: "observed", explainer: "Test input." }, { id: "out", label: "out", formula: "x" }],
    output: { row: "out", unit: "sad", label: "SADs per $" },
  };

  it("INV-2b flags a row reading a cross-cause rate", () => {
    const bad = { ...base, id: "bad", rows: [...base.rows.slice(0, 1), { id: "out", label: "out", formula: "x * $uov_per_wellby" }] };
    const l = buildLibrary([base, bad], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } });
    expect(l.errors).toEqual([]);
    expect(inv2b(l).violations.map(keyOf)).toEqual(["bad out $uov_per_wellby"]);
  });

  it("INV-3 flags a species step that isn't the shared template", () => {
    const facts = [read(join(root, "facts/welfare_ranges.json")), read(join(root, "facts/aim_sads.json"))];
    const rows = (ced: string) => [
      { id: "sads_shrimp", label: "SADs", value: 3, kind: "observed", explainer: "Test input." },
      { id: "ced_shrimp", label: "ced", formula: ced },
      { id: "out", label: "out", formula: "ced_shrimp" },
    ];
    const good = { ...animal, id: "good", rows: rows("sads_shrimp / @aim_sads.shrimp * if($rp_species_weights, @welfare_ranges.shrimp_vs_chicken, @aim_sads.shrimp / @aim_sads.chicken)"), output: { row: "out", unit: "ced", label: "x", species: ["shrimp"] } };
    const bad = { ...good, id: "bad", rows: rows("sads_shrimp * @welfare_ranges.shrimp_vs_chicken * 2") };
    const l = buildLibrary([base, good, bad], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } }, facts);
    expect(l.errors).toEqual([]);
    expect(inv3(l).violations.map(keyOf)).toEqual(["bad ced_shrimp"]);
  });

  it("INV-10 flags a non-animal model that moves with the animal weight", () => {
    const bad = { ...base, id: "bad", rows: [...base.rows.slice(0, 1), { id: "out", label: "out", formula: "x * $chicken_vs_person" }] };
    const l = buildLibrary([base, bad, animal], { ...assumptions, common: { ...assumptions.common, benchmark: "base" } });
    expect(l.errors).toEqual([]);
    expect(inv10(l).violations.map(keyOf)).toEqual(["bad $chicken_vs_person independent"]);
  });
});
