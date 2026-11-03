// The mechanical half of an audit of a charityevals model (the audit-cea skill does the rest).
//   npx tsx scripts/audit-model.ts <model.json | model id> [--exclude id,id] [--facts dir] [--json]
// Works on files outside models/ (drafts, eval runs). Prints:
//   1. findings from src/engine/lint.ts (template structure, sourcing, magic numbers, bounds)
//   2. the bottom line, joint low/high and the tornado (which inputs drive the result)
//   3. the reference class: other hand-built models in the same unit, and other charityevals models
//      of the same template family row by row, so implausible values stand out; the model against its
//      cause's median (more than 10× above without a stated reason: high, INV-15; under a tenth: medium)
//   4. every normalization invariant (src/engine/invariants.ts) on the model, in a library of it and the
//      models it reads live, waivers applied: any violation is a high finding (drafts outside models/ too)
// --exclude drops models from the library (for blind tests: the auditor mustn't see the answer).
// --facts adds a directory of facts files that override the repo's by id (an evaluation run's own
// facts); a facts/ folder next to the model file is picked up without the flag.
// Exits 1 when a high-severity finding remains.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { assumptionValues, bottomLine, buildLibrary, compute, headline, type ResolvedModel } from "../src/engine/model";
import { sensitivity } from "../src/engine/sensitivity";
import { uncertainty } from "../src/engine/uncertainty";
import { lintModel, SEVERITY_ORDER, type Finding } from "../src/engine/lint";
import { TEMPLATES, type Family } from "../src/engine/templates";
import { OUTLIER_REASON, applyWaivers, checkAll, type Waivers } from "../src/engine/invariants";

const root = join(import.meta.dirname, "..");
const args = process.argv.slice(2);
const flag = (name: string) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args.splice(i, 2)[1];
};
const json = args.includes("--json") && (args.splice(args.indexOf("--json"), 1), true);
const exclude = new Set((flag("--exclude") ?? "").split(",").filter(Boolean));
const factsDir = flag("--facts");
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
const localFacts = factsDir ?? (path && existsSync(join(dirname(path), "facts")) ? join(dirname(path), "facts") : undefined);
const extraFacts = localFacts ? walk(localFacts).map(read) : [];
const facts = [...walk(join(root, "facts")).map(read).filter((f) => !extraFacts.some((e) => e.id === f.id)), ...extraFacts];
if (!charities.some((c) => c.id === raw.charity)) charities.push({ id: raw.charity, name: raw.charity, cause: raw.cause });
const lib = buildLibrary(
  [...repoModels.filter((m) => m.id !== raw.id && !exclude.has(m.id) && !(exclude.has(m.charity) && m.owner !== "charityevals")), raw],
  read(join(root, "assumptions/default.json")),
  facts,
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

// Results, ranges and swings are in years of healthy life per $1,000, as the site shows them.
const s = sensitivity(lib, m, av);
// The same with shared assumptions (moral weights, exchange rates, accounting toggles) held at their
// defaults: the uncertainty the builder owns, since the builder can't narrow the shared ranges.
const fixedLib = { ...lib, assumptions: { ...lib.assumptions, rows: lib.assumptions.rows.map((r) => ({ ...r, value: typeof r.value === "object" ? r.value.best : r.value })) } };
const sOwn = sensitivity(fixedLib, m, av);
// The builder's own ranges only: shared facts (the repo's facts/, not facts added for this model) held at
// their best too, since a builder can no more narrow the shared SADs or species ranges than a slider.
const ownFactFiles = new Set(extraFacts.map((f) => f.id as string));
const builderLib = { ...fixedLib, facts: new Map([...lib.facts].map(([k, f]) => [k, ownFactFiles.has(k.split(".")[0]) || typeof f.value !== "object" ? f : { ...f, value: f.value.best }])) } as typeof lib;
const sBuilder = sensitivity(builderLib, m, av);
const line = bottomLine(lib, m, av);
const years = headline(lib, m, av);
const vals = compute(lib, m, av);
// The combined range: every input's range combined as independent errors in log space (the variance
// the site's uncertainty breakdown adds up), so a 90% interval if each range is one. The joint
// low–high sets every input at its end at once, the extreme case, and spans orders of magnitude.
const sd = Math.sqrt(uncertainty(lib, m, vals, av, "charityevals").total);
const combined = { low: years * Math.exp(-sd), high: years * Math.exp(sd) };

// Reference class: other ranked, hand-built charity models in the same output unit.
const peers = [...lib.models.values()]
  .filter((x) => x.id !== m.id && x.kind === "charity" && x.output && !x.bulk && x.output.unit === m.output?.unit)
  .map((x) => ({ id: x.id, owner: x.owner, native: bottomLine(lib, x, av).native, years: headline(lib, x, av) }))
  .filter((p) => Number.isFinite(p.native) && p.native > 0)
  .sort((a, b) => a.native - b.native);
if (peers.length >= 3 && Number.isFinite(line.native)) {
  const lo = peers[0].native, hi = peers[peers.length - 1].native;
  if (line.native > 10 * hi || line.native < lo / 10)
    findings.push({ severity: "medium", code: "outlier", message: `bottom line ${line.native.toPrecision(3)} ${m.output!.unit}/$ is more than 10× outside the range of ${peers.length} peer models (${lo.toPrecision(3)}–${hi.toPrecision(3)})`, fix: "Find the row that makes the difference (compare intermediates with the closest peer) and either correct it or argue for it in the explainer and write-up." });
}
// Against its cause on the site (INV-15): the median of the other hand-built charity models of the cause,
// in years of healthy life per $1,000. Far above needs a stated reason; far below usually means another
// scope (a side programme, a case study, another year) or reach and persistence counted short.
const causePeers = [...lib.models.values()]
  .filter((x) => x.id !== m.id && x.kind === "charity" && x.output && !x.bulk && x.cause === m.cause)
  .map((x) => headline(lib, x, av)).filter((x) => Number.isFinite(x) && x > 0).sort((a, b) => a - b);
const causeMedian = causePeers.length >= 3 ? (causePeers.length % 2 ? causePeers[causePeers.length >> 1] : (causePeers[causePeers.length / 2 - 1] + causePeers[causePeers.length / 2]) / 2) : NaN;
if (Number.isFinite(causeMedian) && Number.isFinite(years)) {
  if (years > 10 * causeMedian && !OUTLIER_REASON.test(m.summary ?? ""))
    findings.push({ severity: "high", code: "INV-15", message: `${years.toPrecision(3)} years of healthy life per $1,000 is ${(years / causeMedian).toPrecision(3)}× the median of ${causePeers.length} ${m.cause} models (${causeMedian.toPrecision(3)}) and the summary doesn't say why`, fix: 'Find the row that makes the difference; correct it, or state the reason in the summary ("more than ten times its peers because …").' });
  if (years < causeMedian / 10)
    findings.push({ severity: "medium", code: "far-below", message: `${years.toPrecision(3)} years of healthy life per $1,000 is under a tenth of the median of ${causePeers.length} ${m.cause} models (${causeMedian.toPrecision(3)})`, fix: "Check scope first (the charity's main programme by spending, all programmes by funding weight, the latest year), then reach and persistence (every animal under the commitments won, the shared years and fulfilment rate), and the shared per-change figures; fix what is wrong, or say in the summary why it is low." });
}

// The normalization invariants (docs/normalization.md section 3) on this model, in a library of it and the
// models it reads live: what scripts/normalization-audit.ts checks, also for drafts outside models/. INV-15
// needs the full rankings and is checked above against the cause's median instead.
const liveIds = (x: Record<string, unknown>): string[] => {
  const text = ((x.rows ?? []) as { formula?: string }[]).map((r) => r.formula ?? "").join(" ");
  const ids = [...text.matchAll(/#([a-z0-9-]+)(?::([a-z0-9-]+))?/g)].flatMap(([, a, b]) => (b ? allModels.filter((y) => y.charity === b && y.owner === a).map((y) => y.id as string) : [a]));
  return typeof x.extends === "string" ? [...ids, x.extends] : ids;
};
const allModels: Record<string, unknown>[] = walk(join(root, "models")).map(read).filter((x) => x.id !== raw.id && !exclude.has(x.id) && !(exclude.has(x.charity) && x.owner !== "charityevals"));
const closure = new Map<string, Record<string, unknown>>();
const visit = (x: Record<string, unknown>) => { for (const id of liveIds(x)) { const t = allModels.find((y) => y.id === id); if (t && !closure.has(id)) { closure.set(id, t); visit(t); } } };
visit(raw);
visit({ rows: [{ formula: `#${read(join(root, "assumptions/default.json")).common.benchmark}` }] });
const invLib = buildLibrary([...closure.values(), raw], read(join(root, "assumptions/default.json")), facts, charities, read(join(root, "owners.json")));
const waivers: Waivers = read(join(root, "src/engine/normalization-waivers.json"));
for (const r of applyWaivers(checkAll(invLib).filter((x) => x.id !== "INV-15"), waivers).reports)
  for (const v of r.violations.filter((v) => v.model === raw.id))
    findings.push({ severity: "high", code: v.inv, row: v.where, message: v.detail, fix: "Fix the model so the invariant holds (docs/normalization.md section 3); a waiver only for a checked false positive, with its reason." });
findings.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

// The spread the builder owns (shared assumptions and facts at their best). Said in the summary already
// ("the result is mostly uncertainty"): low, a reminder to keep the sentence.
if (sBuilder.jointHigh / sBuilder.jointLow > 1000) {
  const said = /\bmostly uncertain(ty)?\b|\buncertain(ty)? (spans|of about|is wide)|\bwide(ly)? uncertain/i.test(m.summary ?? "");
  findings.push({ severity: said ? "low" : "medium", code: "spread", message: `with shared assumptions and shared facts at their best, the model's own ranges still span ${Math.round(sBuilder.jointHigh / sBuilder.jointLow)}× (joint low to high)${said ? "; the summary says so" : ""}`, fix: said ? "Keep the summary's sentence on the uncertainty; narrow the widest of the model's own ranges where a source allows." : "Check the widest of the model's own ranges are real; narrow ranges you can source, or say in the summary that the result is mostly uncertainty." });
}

// Same-family charityevals models: canonical rows side by side.
const family = m.template as Family | undefined;
const siblings = family ? [...lib.models.values()].filter((x) => x.id !== m.id && x.template === family && x.output) : [];
const canon = family ? TEMPLATES[family].required.filter((id) => m.byId.has(id)) : [];

const fmt = (x: number) => (!Number.isFinite(x) ? String(x) : Math.abs(x) >= 1e4 || (Math.abs(x) < 1e-3 && x !== 0) ? x.toExponential(3) : x.toPrecision(4));

if (json) {
  console.log(JSON.stringify({
    id: m.id, template: family, unit: m.output?.unit,
    native: line.native, common: line.common, yearsPer1000: years, combinedLow: combined.low, combinedHigh: combined.high,
    jointLow: s.jointLow, jointHigh: s.jointHigh,
    ownJointLow: sOwn.jointLow, ownJointHigh: sOwn.jointHigh, builderJointLow: sBuilder.jointLow, builderJointHigh: sBuilder.jointHigh, judgmentShare: s.judgmentShare,
    swings: s.swings.slice(0, 10).map((w) => ({ id: w.id, kind: w.kind, low: w.low, high: w.high, atLow: w.atLow, atHigh: w.atHigh })),
    causeMedian, findings, peers, canonical: Object.fromEntries(canon.map((id) => [id, vals[id]])),
  }, null, 2));
} else {
  console.log(`# Audit (mechanical): ${m.id}  [${family ?? "no template"}]\n`);
  console.log(`Bottom line: ${fmt(line.native)} ${m.output?.unit}/$ = ${fmt(years)} years of healthy life per $1,000`);
  console.log(`Combined range (ranges combined as independent errors; 90% if each range is): ${fmt(combined.low)} – ${fmt(combined.high)}`);
  console.log(`Joint low–high (every input at its end at once): ${fmt(s.jointLow)} – ${fmt(s.jointHigh)}   judgment share of uncertainty: ${Math.round(s.judgmentShare * 100)}%`);
  console.log(`Joint low–high with shared assumptions at their defaults: ${fmt(sOwn.jointLow)} – ${fmt(sOwn.jointHigh)}`);
  console.log(`Joint low–high of the model's own ranges (shared assumptions and facts at their best): ${fmt(sBuilder.jointLow)} – ${fmt(sBuilder.jointHigh)}`);
  console.log(`Point inputs on the result's path (no range): ${s.pointInputs.join(", ") || "none"}\n`);
  console.log("## Tornado (years of healthy life per $1,000 with the input at its low / high end)");
  for (const w of s.swings.slice(0, 12))
    console.log(`  ${w.id.padEnd(40)} ${String(w.kind ?? w.scope).padEnd(9)} ${fmt(w.low).padStart(10)} – ${fmt(w.high).padEnd(10)} → ${fmt(w.atLow).padStart(8)} – ${fmt(w.atHigh)}`);
  console.log(`\n## Reference class: hand-built models in ${m.output?.unit} (years of healthy life per $1,000)`);
  for (const p of peers) console.log(`  ${p.id.padEnd(44)} ${p.owner.padEnd(12)} ${fmt(p.years)}`);
  console.log(`  >> this model                                             ${fmt(years)}`);
  if (Number.isFinite(causeMedian)) console.log(`  median of ${causePeers.length} ${m.cause} models: ${fmt(causeMedian)} (this model ×${fmt(years / causeMedian)})`);
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
