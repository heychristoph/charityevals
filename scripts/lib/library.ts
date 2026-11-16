// The model library as the working tree has it, or as a git revision had it (read with one
// `git cat-file --batch`, no checkout), and every model's computed result: for the tools that compare a
// change's before and after (restamp.ts, rule-change.ts).
//   npx tsx scripts/lib/library.ts --out <file.json> [--rev <rev>] [--ids a,b]   write the results
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { assumptionValues, buildLibrary, compute, headline, type Library } from "../../src/engine/model";

export const root = join(import.meta.dirname, "../..");

export type Tree = { models: Record<string, unknown>[]; paths: Map<string, string>; assumptions: unknown; facts: unknown[]; charities: unknown[]; owners: unknown };

const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});

/** Files under the data folders, path → text, from the working tree or a revision. */
function files(rev?: string): Map<string, string> {
  const out = new Map<string, string>();
  if (!rev) {
    for (const d of ["models", "facts", "charities"]) for (const p of walk(join(root, d))) out.set(relative(root, p), readFileSync(p, "utf8"));
    for (const p of ["assumptions/default.json", "owners.json"]) out.set(p, readFileSync(join(root, p), "utf8"));
    return out;
  }
  const list = execFileSync("git", ["ls-tree", "-r", "--name-only", rev, "--", "models", "facts", "charities", "assumptions/default.json", "owners.json"], { cwd: root, encoding: "utf8", maxBuffer: 1 << 28 })
    .split("\n").filter((p) => p.endsWith(".json"));
  const buf = execFileSync("git", ["cat-file", "--batch"], { cwd: root, input: list.map((p) => `${rev}:${p}`).join("\n") + "\n", maxBuffer: 1 << 30 });
  let at = 0;
  for (const p of list) {
    const nl = buf.indexOf(10, at);
    const header = buf.subarray(at, nl).toString();
    const size = Number(header.split(" ")[2]);
    if (!/ blob \d+$/.test(header)) throw new Error(`git cat-file: ${header}`);
    out.set(p, buf.subarray(nl + 1, nl + 1 + size).toString("utf8"));
    at = nl + 1 + size + 1;
  }
  return out;
}

/** The raw data at a revision (undefined: the working tree). */
export function readTree(rev?: string): Tree {
  const f = files(rev);
  const models: Record<string, unknown>[] = [];
  const paths = new Map<string, string>();
  const facts: unknown[] = [], charities: unknown[] = [];
  for (const [p, text] of [...f].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (p.startsWith("models/")) {
      const m = JSON.parse(text) as Record<string, unknown>;
      models.push(m);
      paths.set(m.id as string, p);
    } else if (p.startsWith("facts/")) facts.push(JSON.parse(text));
    else if (p.startsWith("charities/")) charities.push(JSON.parse(text));
  }
  return { models, paths, assumptions: JSON.parse(f.get("assumptions/default.json")!), facts, charities, owners: JSON.parse(f.get("owners.json")!) };
}

export function libraryOf(t: Tree): Library {
  const lib = buildLibrary(t.models, t.assumptions, t.facts, t.charities, t.owners as unknown[]);
  if (lib.errors.length) throw new Error(lib.errors.slice(0, 10).join("\n"));
  return lib;
}

export type Result = { headline: number; rows: Record<string, number> };

/** Every model's headline (our view, defaults; NaN where it has none) and row values, or only `ids`'. */
export function results(lib: Library, ids?: Iterable<string>): Record<string, Result> {
  const av = assumptionValues(lib.assumptions);
  const out: Record<string, Result> = {};
  for (const id of ids ?? lib.models.keys()) {
    const m = lib.models.get(id);
    if (!m || m.kind === "template") continue;
    let h = NaN;
    let rows: Record<string, number> = {};
    try { h = headline(lib, m, av); } catch { /* no headline */ }
    try { rows = Object.fromEntries(Object.entries(compute(lib, m, av)).filter(([k]) => !k.startsWith("#"))); } catch { /* doesn't compute */ }
    out[id] = { headline: h, rows };
  }
  return out;
}

/** How far a result moved: |after / before - 1|, 0 for equal values (NaN = NaN included), Infinity across 0. */
export function relativeMove(before: number, after: number): number {
  if (Object.is(before, after) || (Number.isNaN(before) && Number.isNaN(after))) return 0;
  if (!Number.isFinite(before) || !Number.isFinite(after)) return Infinity;
  if (before === 0) return after === 0 ? 0 : Infinity;
  return Math.abs(after / before - 1);
}

/** Rows whose value changed beyond float noise, and rows added or removed. */
export function changedRows(before: Record<string, number>, after: Record<string, number>, tol = 1e-9): string[] {
  const ids = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...ids].filter((k) => !(k in before) || !(k in after) || relativeMove(before[k], after[k]) > tol);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (n: string) => { const i = process.argv.indexOf(n); return i < 0 ? undefined : process.argv[i + 1]; };
  const out = arg("--out");
  if (!out) { console.error("usage: npx tsx scripts/lib/library.ts --out <file.json> [--rev <rev>] [--ids a,b]"); process.exit(2); }
  const ids = arg("--ids")?.split(",").filter(Boolean);
  // NaN and Infinity don't survive JSON: written as strings, read back by readResults.
  writeFileSync(out, JSON.stringify(results(libraryOf(readTree(arg("--rev"))), ids), (_, v) => (typeof v === "number" && !Number.isFinite(v) ? String(v) : v)));
}

export function readResults(file: string): Record<string, Result> {
  return JSON.parse(readFileSync(file, "utf8"), (_, v) => (v === "NaN" ? NaN : v === "Infinity" ? Infinity : v === "-Infinity" ? -Infinity : v));
}
