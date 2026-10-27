// Checks model files outside the library (e.g. fresh imports) reproduce their `expected` values.
//   npx tsx scripts/verify.ts path/to/model.json ...
// Prints one JSON line per file: rows, expected values matched, mismatches, bottom line.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildLibrary, assumptionValues, compute } from "../src/engine/model";

const root = join(import.meta.dirname, "..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
for (const path of process.argv.slice(2)) {
  const raw = read(path);
  const lib = buildLibrary([raw], read(join(root, "assumptions/default.json")), [], [{ id: raw.charity, name: raw.charity, cause: raw.cause }], read(join(root, "owners.json")));
  const m = lib.models.get(raw.id);
  if (!m) { console.log(JSON.stringify({ path, errors: lib.errors.slice(0, 5) })); continue; }
  const vals = compute(lib, m, assumptionValues(lib.assumptions), {}, "evaluator");
  const bad: string[] = [];
  let ok = 0;
  for (const r of m.rows) {
    if (r.expected === undefined) continue;
    const rel = Math.abs(vals[r.id] - r.expected) / Math.max(Math.abs(r.expected), 1e-12);
    if (rel <= 1e-6) ok++; else bad.push(`${r.id}: ${r.expected} vs ${vals[r.id]}`);
  }
  console.log(JSON.stringify({ path, id: m.id, rows: m.rows.length, ok, bad: bad.length, first: bad.slice(0, 3), errors: lib.errors.slice(0, 3), out: m.output && vals[m.output.row] }));
}
