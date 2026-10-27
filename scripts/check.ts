// Validates every model and prints each bottom line. Fails on schema errors, broken formulas,
// or a row that no longer reproduces the value its source reports (`expected`).
//   npm run check            all models
//   npm run check -- <id>    one model, with its tornado
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildLibrary, assumptionValues, compute, bottomLine, comparable, modelsOf } from "../src/engine/model";
import { sensitivity, flags } from "../src/engine/sensitivity";

const root = join(import.meta.dirname, "..");
const TOLERANCE = 1e-6;

function jsonFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? jsonFiles(p) : f.endsWith(".json") ? [p] : [];
  });
}

const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const lib = buildLibrary(
  jsonFiles(join(root, "models")).map(read),
  read(join(root, "assumptions/default.json")),
  jsonFiles(join(root, "facts")).map(read),
  jsonFiles(join(root, "charities")).map(read),
  read(join(root, "owners.json")),
);
const errors = [...lib.errors];
const av = assumptionValues(lib.assumptions);
const only = process.argv[2];

const fmt = (x: number) => (Math.abs(x) >= 1000 || Math.abs(x) < 0.01 ? x.toExponential(3) : x.toFixed(3));
const benchmark = lib.models.get(lib.assumptions.common.benchmark);
const bench = benchmark ? bottomLine(lib, benchmark, av).common : NaN;
const benchEval = benchmark ? bottomLine(lib, benchmark, av, {}, "evaluator").common : NaN;

for (const m of lib.models.values()) {
  if (only && m.id !== only) continue;
  // `expected` values are the source's own figures, so they're checked in the evaluator view.
  const evalVals = compute(lib, m, av, {}, "evaluator");
  const vals = compute(lib, m, av);
  let matched = 0;
  for (const r of m.rows) {
    if (r.expected === undefined) continue;
    const got = evalVals[r.id];
    // Relative, with a floor so a sheet's 0 matches our 3e-11 from subtracting equal totals.
    if (!(Math.abs(got - r.expected) <= Math.max(TOLERANCE * Math.abs(r.expected), 1e-9))) errors.push(`${m.id}.${r.id}: expected ${r.expected}, got ${got}`);
    else matched++;
  }
  if (!m.output) { console.log(`${m.id}: template, ${matched} expected values reproduced`); continue; }
  // Each charity's main model carries the write-up; other models of it link back there.
  if (m.kind === "charity" && modelsOf(lib, m.charity)[0]?.id === m.id && !existsSync(join(root, "writeups", `${m.id}.md`)))
    errors.push(`${m.id}: missing write-up writeups/${m.id}.md`);
  const s = sensitivity(lib, m, av);
  const se = sensitivity(lib, m, av, "evaluator");
  if (!comparable(lib, m)) {
    console.log(`${m.id.padEnd(22)} ${fmt(vals[m.output.row])} ${m.output.unit}/$  [${fmt(s.jointLow)} – ${fmt(s.jointHigh)}]  not ranked (no exchange rate)  ${matched} expected values reproduced`);
    continue;
  }
  console.log(
    `${m.id.padEnd(22)} ${fmt(vals[m.output.row])} ${m.output.unit}/$  ` +
      `evaluator ${(se.central / benchEval).toFixed(1)}×  ` +
      `${(s.central / bench).toFixed(1)}${lib.assumptions.common.benchmark_label} ` +
      `[${(s.jointLow / bench).toFixed(2)} – ${(s.jointHigh / bench).toFixed(1)}]  ` +
      `${matched} expected values reproduced`,
  );
  if (only) {
    for (const sw of s.swings)
      console.log(`  ${sw.label.slice(0, 60).padEnd(60)} ${(sw.atLow / bench).toFixed(2).padStart(8)} – ${(sw.atHigh / bench).toFixed(2)}`);
    for (const f of flags(m, s)) console.log(`  [${f.level}] ${f.text}`);
  }
}

if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n` + errors.map((e) => `  ✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log("\n✓ all models valid");
