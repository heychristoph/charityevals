// The batch tools in scripts/: the JSON field writer beneficiary-countries.ts uses, the re-stamp helpers
// (restamp.ts, rule-change.ts) and the Python tools' own self-tests (merge-branch.py, irs-990.py).
import { execFileSync, spawnSync } from "node:child_process";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { setTopLevel, topLevelMembers } from "../../scripts/lib/json-text";
import { changedRows, relativeMove } from "../../scripts/lib/library";
import { noteLine, passes, receiptShas, stampText } from "../../scripts/restamp";

const root = join(import.meta.dirname, "../..");

describe("setTopLevel", () => {
  const model = '{\n  "id": "x",\n  "cause": "global-health",\n  "rows": [\n    { "id": "a", "value": 1 }\n  ]\n}\n';

  it("inserts fields on one line after the anchor, leaving the rest as it was", () => {
    const out = setTopLevel(model, { beneficiaries: { USA: 1 }, beneficiaries_note: "US." }, { after: "cause" });
    expect(out).toBe('{\n  "id": "x",\n  "cause": "global-health",\n  "beneficiaries": {"USA":1},\n  "beneficiaries_note": "US.",\n  "rows": [\n    { "id": "a", "value": 1 }\n  ]\n}\n');
  });

  it("leaves a file alone when the fields already read so", () => {
    const once = setTopLevel(model, { beneficiaries: "world", beneficiaries_note: "W." }, { after: "cause" });
    expect(setTopLevel(once, { beneficiaries: "world", beneficiaries_note: "W." }, { after: "cause" })).toBe(once);
  });

  it("removes the last field without leaving a trailing comma", () => {
    const last = '{\n  "id": "x",\n  "cause": "c",\n  "beneficiaries": "world",\n  "beneficiaries_note": "W."\n}\n';
    const out = setTopLevel(last, { beneficiaries: undefined, beneficiaries_note: undefined });
    expect(out).toBe('{\n  "id": "x",\n  "cause": "c"\n}\n');
    expect(() => JSON.parse(out)).not.toThrow();
  });

  it("folds a pretty-printed field onto one line and touches nothing else", () => {
    const spread = '{\n  "id": "x",\n  "cause": "c",\n  "beneficiaries": {\n    "world": 0.89,\n    "USA": 0.11\n  },\n  "beneficiaries_note": "N.",\n  "source": { "title": "T" }\n}\n';
    const out = setTopLevel(spread, { beneficiaries: { world: 0.89, USA: 0.11 }, beneficiaries_note: "N." }, { after: "cause" });
    expect(out).toBe('{\n  "id": "x",\n  "cause": "c",\n  "beneficiaries": {"world":0.89,"USA":0.11},\n  "beneficiaries_note": "N.",\n  "source": { "title": "T" }\n}\n');
  });

  it("finds members past strings with braces and escapes", () => {
    const tricky = '{"a": "}\\"{", "b": [1, {"c": "]"}], "d": 2}';
    expect(topLevelMembers(tricky).map((m) => m.key)).toEqual(["a", "b", "d"]);
    expect(JSON.parse(setTopLevel(tricky, { b: undefined }))).toEqual({ a: '}"{', d: 2 });
  });
});

describe("re-stamp helpers", () => {
  const a = "a".repeat(64), b = "b".repeat(64);
  const round = `# Audit round 2\n\nVerdict: **pass**\nModel-sha: ${a}\n`;

  it("replaces every fingerprint and appends the note once", () => {
    const once = stampText(round, b, "Re-stamped: x.");
    expect(receiptShas(once)).toEqual([b]);
    expect(stampText(once, b, "Re-stamped: x.")).toBe(once);
    expect(passes(once)).toBe(true);
    expect(passes("Verdict: fail")).toBe(false);
  });

  it("says what moved", () => {
    expect(noteLine("wording", { before: 2, after: 2, rows: [], base: "abc" })).toMatch(/: wording\. Mechanical: headline unchanged, against abc\.$/);
    expect(noteLine("r", { before: 1, after: 1.005, rows: ["x"], base: "abc" }, "2.23")).toMatch(/, rule 2\.23: r\. Mechanical: headline 1 → 1\.005 \(\+0\.50%\), 1 row changed/);
  });

  it("measures moves and changed rows", () => {
    expect(relativeMove(1, 1)).toBe(0);
    expect(relativeMove(NaN, NaN)).toBe(0);
    expect(relativeMove(0, 1)).toBe(Infinity);
    expect(relativeMove(2, 3)).toBeCloseTo(0.5);
    expect(changedRows({ a: 1, b: 2, c: 3 }, { a: 1, b: 2.5, d: 4 }).sort()).toEqual(["b", "c", "d"]);
  });
});

const python = spawnSync("python3", ["--version"]).status === 0;
describe.skipIf(!python)("python tools' self-tests", () => {
  it("merge-branch.py", () => {
    expect(execFileSync("python3", [join(root, "scripts/merge-branch.py"), "--self-test"], { encoding: "utf8" })).toMatch(/self-test: ok/);
  });
  it("irs-990.py", () => {
    expect(execFileSync("python3", [join(root, "scripts/irs-990.py"), "--self-test"], { encoding: "utf8" })).toMatch(/self-test: ok/);
  });
});
