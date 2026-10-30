// Validates every model and prints each bottom line in years of healthy life per $1,000. Fails on schema errors, broken formulas,
// or a row that no longer reproduces the value its source reports (`expected`).
//   npm run check            all models
//   npm run check -- <id>    one model, with its tornado
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildLibrary, assumptionValues, compute, comparable, modelsOf } from "../src/engine/model";
import { primaryModel } from "../src/engine/ranking";
import { sensitivity, flags } from "../src/engine/sensitivity";
import { lintModel } from "../src/engine/lint";

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
const years = (x: number) => (Math.abs(x) >= 100 ? x.toFixed(0) : Math.abs(x) >= 1 ? x.toFixed(1) : x.toPrecision(2));

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
  // charityevals' own models (build-cea) must follow their template and source every number.
  if (m.owner === "charityevals" && m.kind !== "template")
    for (const f of lintModel(lib, m)) if (f.severity === "high") errors.push(`${m.id}${f.row ? `.${f.row}` : ""}: ${f.message} (npx tsx scripts/audit-model.ts ${m.id})`);
  // Each charity's main page carries a write-up: its main model's, or the one filed under its first
  // model (a hand-written evaluation outlives a newer sheet becoming the main model).
  const has = (id?: string) => !!id && existsSync(join(root, "writeups", `${id}.md`));
  if (m.kind === "charity" && primaryModel(lib, m.charity)?.id === m.id && !has(m.id) && !has(modelsOf(lib, m.charity)[0]?.id))
    errors.push(`${m.id}: missing write-up writeups/${m.id}.md`);
  const s = sensitivity(lib, m, av);
  const se = sensitivity(lib, m, av, "evaluator");
  if (!comparable(lib, m)) {
    // Every charity is ranked: a new unit needs an exchange rate (a shared assumption) in assumptions/default.json.
    if (m.kind === "charity") errors.push(`${m.id}: unit ${m.output.unit} has no exchange rate (to_common), so the charity can't be ranked`);
    console.log(`${m.id.padEnd(22)} ${fmt(vals[m.output.row])} ${m.output.unit}/$  [${fmt(s.jointLow)} – ${fmt(s.jointHigh)}]  not ranked (no exchange rate)  ${matched} expected values reproduced`);
    continue;
  }
  console.log(
    `${m.id.padEnd(22)} ${fmt(vals[m.output.row])} ${m.output.unit}/$  ` +
      `evaluator ${years(se.central)}  ` +
      `${years(s.central)} years/$1k ` +
      `[${years(s.jointLow)} – ${years(s.jointHigh)}]  ` +
      `${matched} expected values reproduced`,
  );
  if (only) {
    for (const sw of s.swings)
      console.log(`  ${sw.label.slice(0, 60).padEnd(60)} ${years(sw.atLow).padStart(8)} – ${years(sw.atHigh)}`);
    for (const f of flags(m, s)) console.log(`  [${f.level}] ${f.text}`);
  }
}

if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n` + errors.map((e) => `  ✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log("\n✓ all models valid");
