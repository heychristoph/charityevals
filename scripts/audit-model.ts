// The mechanical half of an audit of a charityevals model (the audit-cea skill does the rest).
//   npx tsx scripts/audit-model.ts <model.json | model id> [--exclude id,id] [--json]
// Works on files outside models/ (drafts, eval runs). Prints:
//   1. findings from src/engine/lint.ts (template structure, sourcing, magic numbers, bounds)
//   2. the bottom line, joint low/high and the tornado (which inputs drive the result)
//   3. the reference class: other hand-built models in the same unit, and other charityevals models
//      of the same template family row by row, so implausible values stand out
// --exclude drops models from the library (for blind tests: the auditor mustn't see the answer).
// Exits 1 when a high-severity finding remains.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { assumptionValues, bottomLine, buildLibrary, compute, type ResolvedModel } from "../src/engine/model";
import { sensitivity } from "../src/engine/sensitivity";
import { lintModel, SEVERITY_ORDER, type Finding } from "../src/engine/lint";
import { TEMPLATES, type Family } from "../src/engine/templates";

const root = join(import.meta.dirname, "..");
const args = process.argv.slice(2);
const flag = (name: string) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args.splice(i, 2)[1];
};
const json = args.includes("--json") && (args.splice(args.indexOf("--json"), 1), true);
const exclude = new Set((flag("--exclude") ?? "").split(",").filter(Boolean));
const target = args[0];
if (!target) {
  console.error("usage: npx tsx scripts/audit-model.ts <model.json | id> [--exclude a,b] [--json]");
  process.exit(2);
}

const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
  });

// Hand-built models only: bulk imports are thousands of rows and not a fair reference class.
const repoModels = walk(join(root, "models")).filter((p) => !p.includes("/models/grants/")).map(read);
const path = existsSync(target) ? resolve(target) : undefined;
const raw = path ? read(path) : repoModels.find((m) => m.id === target);
if (!raw) {
  console.error(`no file or model ${target}`);
  process.exit(2);
}
const charities = walk(join(root, "charities")).map(read);
if (!charities.some((c) => c.id === raw.charity)) charities.push({ id: raw.charity, name: raw.charity, cause: raw.cause });
const lib = buildLibrary(
  [...repoModels.filter((m) => m.id !== raw.id && !exclude.has(m.id) && !exclude.has(m.charity)), raw],
  read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read),
  charities,
  read(join(root, "owners.json")),
);
const m = lib.models.get(raw.id);
const own = lib.errors.filter((e) => e.startsWith(raw.id));
if (!m) {
  console.error(own.join("\n") || lib.errors.slice(0, 10).join("\n"));
  process.exit(1);
}
const av = assumptionValues(lib.assumptions);
const findings: Finding[] = [
  ...own.map((e) => ({ severity: "high" as const, code: "schema", message: e, fix: "Fix the model file so it loads." })),
  ...lintModel(lib, m, new Date()),
].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

const bench = lib.models.get(lib.assumptions.common.benchmark)!;
const benchCommon = bottomLine(lib, bench, av).common;
const s = sensitivity(lib, m, av);
// The same with shared assumptions (moral weights, exchange rates, accounting toggles) held at their
// defaults: the uncertainty the builder owns, since the builder can't narrow the shared ranges.
const fixedLib = { ...lib, assumptions: { ...lib.assumptions, rows: lib.assumptions.rows.map((r) => ({ ...r, value: typeof r.value === "object" ? r.value.best : r.value })) } };
const sOwn = sensitivity(fixedLib, m, av);
const line = bottomLine(lib, m, av);
const vals = compute(lib, m, av);

// Reference class: other ranked, hand-built charity models in the same output unit.
const peers = [...lib.models.values()]
  .filter((x) => x.id !== m.id && x.kind === "charity" && x.output && !x.bulk && x.output.unit === m.output?.unit)
  .map((x) => ({ id: x.id, owner: x.owner, native: bottomLine(lib, x, av).native }))
  .filter((p) => Number.isFinite(p.native) && p.native > 0)
  .sort((a, b) => a.native - b.native);
if (peers.length >= 3 && Number.isFinite(line.native)) {
  const lo = peers[0].native, hi = peers[peers.length - 1].native;
  if (line.native > 10 * hi || line.native < lo / 10)
    findings.push({ severity: "medium", code: "outlier", message: `bottom line ${line.native.toPrecision(3)} ${m.output!.unit}/$ is more than 10× outside the range of ${peers.length} peer models (${lo.toPrecision(3)}–${hi.toPrecision(3)})`, fix: "Find the row that makes the difference (compare intermediates with the closest peer) and either correct it or argue for it in the explainer and write-up." });
}
if (sOwn.jointHigh / sOwn.jointLow > 1000)
  findings.push({ severity: "medium", code: "spread", message: `with shared assumptions at their defaults, joint low to high still spans ${Math.round(sOwn.jointHigh / sOwn.jointLow)}×`, fix: "Check the widest ranges are real; narrow ranges you can source, or say in the summary that the result is mostly uncertainty." });

// Same-family charityevals models: canonical rows side by side.
const family = m.template as Family | undefined;
const siblings = [...lib.models.values()].filter((x) => x.id !== m.id && x.template === family && x.output);
const canon = family ? TEMPLATES[family].required.filter((id) => m.byId.has(id)) : [];

const fmt = (x: number) => (!Number.isFinite(x) ? String(x) : Math.abs(x) >= 1e4 || (Math.abs(x) < 1e-3 && x !== 0) ? x.toExponential(3) : x.toPrecision(4));

if (json) {
  console.log(JSON.stringify({
    id: m.id, template: family, unit: m.output?.unit,
    native: line.native, common: line.common, multipleOfBenchmark: line.common / benchCommon,
    jointLow: s.jointLow / benchCommon, jointHigh: s.jointHigh / benchCommon,
    ownJointLow: sOwn.jointLow / benchCommon, ownJointHigh: sOwn.jointHigh / benchCommon, judgmentShare: s.judgmentShare,
    swings: s.swings.slice(0, 10).map((w) => ({ id: w.id, kind: w.kind, low: w.low, high: w.high, atLow: w.atLow / benchCommon, atHigh: w.atHigh / benchCommon })),
    findings, peers, canonical: Object.fromEntries(canon.map((id) => [id, vals[id]])),
  }, null, 2));
} else {
  console.log(`# Audit (mechanical): ${m.id}  [${family ?? "no template"}]\n`);
  console.log(`Bottom line: ${fmt(line.native)} ${m.output?.unit}/$ = ${(line.common / benchCommon).toFixed(2)}× GiveDirectly`);
  console.log(`Joint low–high: ${fmt(s.jointLow / benchCommon)}× – ${fmt(s.jointHigh / benchCommon)}×   judgment share of uncertainty: ${Math.round(s.judgmentShare * 100)}%`);
  console.log(`Joint low–high with shared assumptions at their defaults: ${fmt(sOwn.jointLow / benchCommon)}× – ${fmt(sOwn.jointHigh / benchCommon)}×`);
  console.log(`Point inputs on the result's path (no range): ${s.pointInputs.join(", ") || "none"}\n`);
  console.log("## Tornado (× GiveDirectly with the input at its low / high end)");
  for (const w of s.swings.slice(0, 12))
    console.log(`  ${w.id.padEnd(40)} ${String(w.kind ?? w.scope).padEnd(9)} ${fmt(w.low).padStart(10)} – ${fmt(w.high).padEnd(10)} → ${(w.atLow / benchCommon).toFixed(3).padStart(8)} – ${(w.atHigh / benchCommon).toFixed(3)}`);
  console.log(`\n## Reference class: hand-built models in ${m.output?.unit} (× GiveDirectly)`);
  for (const p of peers) console.log(`  ${p.id.padEnd(44)} ${p.owner.padEnd(12)} ${(p.native * (line.common / line.native) / benchCommon).toFixed(2)}×`);
  console.log(`  >> this model                                             ${(line.common / benchCommon).toFixed(2)}×`);
  if (siblings.length) {
    console.log(`\n## Same template (${family}): canonical rows`);
    const sv = siblings.map((x) => ({ id: x.id, v: compute(lib, x, av) }));
    console.log(`  ${"row".padEnd(30)} ${"this".padStart(11)} ${sv.map((x) => x.id.slice(0, 18).padStart(19)).join("")}`);
    for (const id of canon) console.log(`  ${id.padEnd(30)} ${fmt(vals[id]).padStart(11)} ${sv.map((x) => fmt(x.v[id]).padStart(19)).join("")}`);
  }
  console.log(`\n## Findings (${findings.length})`);
  for (const f of findings) console.log(`  [${f.severity.toUpperCase()}] ${f.code}${f.row ? ` (${f.row})` : ""}: ${f.message}\n      fix: ${f.fix}`);
}
process.exit(findings.some((f) => f.severity === "high") ? 1 : 0);
