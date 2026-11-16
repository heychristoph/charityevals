// Validates every model and prints each bottom line in years of healthy life per $1,000. Fails on schema errors, broken formulas,
// or a row that no longer reproduces the value its source reports (`expected`).
//   npm run check            all models
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildLibrary, assumptionValues, compute, comparable } from "../src/engine/model";
import { checkModel } from "../src/engine/check-model";
import { sensitivity, flags } from "../src/engine/sensitivity";
import { comparisonFindings, namesFor } from "../src/engine/lint";
import { checkProseNumbers } from "../src/engine/prose-numbers";

const root = join(import.meta.dirname, "..");

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
  const vals = compute(lib, m, av);
  const { errors: own, matched } = checkModel(lib, m, (id) => existsSync(join(root, "writeups", `${id}.md`)), av);
  errors.push(...own);
  if (!m.output) { console.log(`${m.id}: template, ${matched} expected values reproduced`); continue; }
  const s = sensitivity(lib, m, av);
  const se = sensitivity(lib, m, av, "evaluator");
  if (!comparable(lib, m)) {
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

// Site text never compares with other charities, a cause's median or average, or peers (src/engine/lint.ts):
// every model's summary (charityevals' own are linted above), every write-up and every charity's summary.
if (!only) {
  const say = (where: string, text: string, charity?: string) => {
    for (const f of comparisonFindings(where, text, namesFor(lib, charity))) errors.push(`${f.message}: ${f.fix}`);
  };
  for (const m of lib.models.values()) if (m.owner !== "charityevals" || m.kind === "template") say(`${m.id} summary`, m.summary ?? "", m.charity);
  for (const f of readdirSync(join(root, "writeups")).filter((f) => f.endsWith(".md"))) {
    const id = f.replace(/\.md$/, "");
    // A write-up is filed under a model id; a hidden model's charity is the longest charity id it starts with.
    const charity = lib.models.get(id)?.charity ?? [...lib.charities.keys()].filter((c) => id === c || id.startsWith(`${c}-`)).sort((a, b) => b.length - a.length)[0];
    say(`writeups/${f}`, readFileSync(join(root, "writeups", f), "utf8"), charity);
  }
  for (const c of lib.charities.values()) say(`charities/${c.id}.json summary`, c.summary ?? "", c.id);
}

// Numbers in prose come from the model (docs/prose-numbers.md): a placeholder must name something, and a
// write-up never types the headline, which would go stale the next time the model changes.
for (const m of lib.models.values()) {
  if (only && m.id !== only) continue;
  for (const f of checkProseNumbers(m.id)) if (f.severity === "high") errors.push(`${m.id} ${f.field}: ${f.message}`);
}

if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n` + errors.map((e) => `  ✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log("\n✓ all models valid");
