// The gate a model passes before any audit (build-cea, import-cea):
//   npx tsx scripts/preflight.ts <model-id> [<model-id> ...]
// One line per problem, `<severity> <check> <row/field>: <message and the fix>`, under a `# <model id>` line;
// exit 1 when any is high (blocking). On the models given only:
//   check       what scripts/check.ts checks per model (expected values, dates, write-up, exchange rate)
//   lint        src/engine/lint.ts on charityevals' own models (template rows and context rows aren't "unused")
//   INV-n       every normalization invariant, on the model and the models it reads live, waivers applied
//   simulation  scripts/simulation-check.ts: unstable, single events that never happen, inputs that flip it
//   units       per $ against per $1,000 or a total, a percent against a fraction, per year against a total
//   kind / reference-class   no kind "template" copied in, no skeleton source left, judgments anchored
//   shared-fact a typed number a shared fact holds (from the first copy), a typed next-dollar figure, a
//               figure typed into another of our models too
//   generated   generated/distributions.json and usage.json out of date for the model (a warning)
//   prose       numbers in the write-up and summary against the model (src/engine/prose-numbers.ts, when present)
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { assumptionValues, buildLibrary, factUsage, usedFacts, type ResolvedModel, type ResolvedRow } from "../src/engine/model";
import { checkModel } from "../src/engine/check-model";
import { lintModel } from "../src/engine/lint";
import { applyWaivers, checkAll, type Waivers } from "../src/engine/invariants";
import { simulationCheck } from "../src/engine/simulation-check";
import { simulate } from "../src/engine/montecarlo";
import { copiedFigureProblems, kindProblems, sameJson, sharedFactProblems, unitProblems, type Problem } from "../src/engine/preflight";
import { templateRowIds, TEMPLATE_DIR } from "../src/engine/template-files";

const root = join(import.meta.dirname, "..");
const ids = process.argv.slice(2);
if (!ids.length) {
  console.error("usage: npx tsx scripts/preflight.ts <model-id> [<model-id> ...]");
  process.exit(2);
}
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const rawModels: Record<string, unknown>[] = walk(join(root, "models")).map(read);
const assumptions = read(join(root, "assumptions/default.json"));
const facts = walk(join(root, "facts")).map(read);
const charities: Record<string, unknown>[] = walk(join(root, "charities")).map(read);
const owners = read(join(root, "owners.json"));
const lib = buildLibrary(rawModels, assumptions, facts, charities, owners);
const av = assumptionValues(lib.assumptions);
const waivers: Waivers = read(join(root, "src/engine/normalization-waivers.json"));
const templates = templateRowIds();
// A family skeleton's fixed rows, copied as they stand: their units are the skeleton's to fix.
const skeletons = new Map<string, Map<string, { unit?: string; formula?: string }>>();
for (const f of existsSync(TEMPLATE_DIR) ? readdirSync(TEMPLATE_DIR).filter((x) => x.endsWith(".json")) : []) {
  const raw = read(join(TEMPLATE_DIR, f)) as { template?: string; rows: { id: string; unit?: string; formula?: string }[] };
  const rows = skeletons.get(raw.template ?? "") ?? new Map();
  for (const r of raw.rows) rows.set(r.id, r);
  skeletons.set(raw.template ?? "", rows);
}
const asCopied = (m: ResolvedModel) => (r: ResolvedRow) => {
  const t = skeletons.get(m.template ?? "")?.get(r.id);
  return !!t && t.unit === r.unit && t.formula === r.formula;
};

// The invariants on the models given and the models they read live (as scripts/audit-model.ts does).
const byId = new Map(rawModels.map((x) => [x.id as string, x]));
const closure = new Map<string, Record<string, unknown>>();
const visit = (x: Record<string, unknown>) => {
  const text = ((x.rows ?? []) as { formula?: string }[]).map((r) => r.formula ?? "").join(" ");
  const inCause = (c: string) => new Set(charities.filter((y) => y.cause === c || y.area === c).map((y) => y.id));
  const refs = [...text.matchAll(/#([a-z0-9-]+)(?::([a-z0-9-]+))?/g)].flatMap(([, a, b]) => (!b ? [a]
    : a === "cause" ? rawModels.filter((y) => inCause(b).has(y.charity)).map((y) => y.id as string)
    : rawModels.filter((y) => y.charity === b && y.owner === a).map((y) => y.id as string)));
  if (typeof x.extends === "string") refs.push(x.extends);
  for (const id of refs) { const t = byId.get(id); if (t && !closure.has(id)) { closure.set(id, t); visit(t); } }
};
for (const id of ids) { const x = byId.get(id); if (x) { closure.set(id, x); visit(x); } }
visit({ rows: [{ formula: `#${assumptions.common.benchmark}` }] });
const invLib = buildLibrary([...closure.values()], assumptions, facts, charities, owners);
const violations = applyWaivers(checkAll(invLib), waivers).reports.flatMap((r) => r.violations);

// What generated/ says now, against what it would say.
const readJson = (p: string) => (existsSync(join(root, p)) ? read(join(root, p)) : {});
const distributions: Record<string, unknown> = readJson("generated/distributions.json");
const usage: Record<string, string[]> = readJson("generated/usage.json");
const freshUsage = factUsage(lib);

// Numbers in the prose against the model, when that check exists (src/engine/prose-numbers.ts).
type ProseCheck = (id: string) => unknown;
let prose: ProseCheck | undefined;
try {
  const path = "../src/engine/prose-numbers";
  const mod = (await import(path)) as { checkProseNumbers?: ProseCheck };
  prose = mod.checkProseNumbers;
} catch { /* not there yet */ }
const asProblems = (x: unknown): Problem[] => (Array.isArray(x) ? x : x ? [x] : []).map((p) => {
  if (typeof p === "string") return { severity: "medium", check: "prose", where: "prose", message: p };
  const o = p as { severity?: string; where?: string; row?: string; file?: string; message?: string; detail?: string; fix?: string };
  const severity = o.severity === "high" || o.severity === "low" ? o.severity : "medium";
  return { severity, check: "prose", where: o.where ?? o.row ?? o.file ?? "prose", message: [o.message ?? o.detail ?? JSON.stringify(p), o.fix].filter(Boolean).join(": ") };
});

const order = { high: 0, medium: 1, low: 2 } as const;
let blocking = 0;
for (const id of ids) {
  console.log(`# ${id}`);
  const m = lib.models.get(id);
  const out: Problem[] = lib.errors.filter((e) => e.startsWith(`${id}.`) || e.startsWith(`${id}:`)).map((e) => ({ severity: "high", check: "schema", where: "file", message: `${e}: fix the model file so it loads` }));
  if (!m) {
    if (!out.length) out.push({ severity: "high", check: "schema", where: "id", message: `no model ${id} in models/ (or its evaluator is unpublished): check the id` });
  } else {
    for (const e of checkModel(lib, m, (x) => existsSync(join(root, "writeups", `${x}.md`)), av).errors)
      if (!/\(npx tsx scripts\/audit-model\.ts/.test(e)) out.push({ severity: "high", check: "check", where: e.slice(0, e.indexOf(":")).replace(`${id}.`, "") || "model", message: e.slice(e.indexOf(":") + 2) });
    if (m.owner === "charityevals" && m.kind !== "template")
      for (const f of lintModel(lib, m, new Date(), { templateRows: templates.get(m.template ?? "") }))
        out.push({ severity: f.severity, check: `lint ${f.code}`, where: f.row ?? "model", message: `${f.message}: ${f.fix}` });
    for (const v of violations.filter((x) => x.model === id))
      out.push({ severity: "high", check: v.inv, where: v.where, message: `${v.detail} (docs/normalization.md section 3; a waiver only for a checked false positive)` });
    const sim = simulationCheck(lib, m);
    if (sim.unstable) out.push({ severity: "high", check: "simulation", where: "result", message: `the simulation is unstable (5% ${sim.shape?.q5.toPrecision(3)}, 95% ${sim.shape?.q95.toPrecision(3)} × the best guess): see the inputs that flip it, and normalization.md 2.18` });
    if (sim.brokenEvents) out.push({ severity: "high", check: "simulation", where: "single_event", message: "a single event never happens or always does, or the draws are broken: check the single_event tags" });
    for (const w of sim.wild.slice(0, 5)) out.push({ severity: sim.unstable ? "medium" : "low", check: "simulation", where: w.key, message: `alone at ${w.low.toPrecision(3)}..${w.high.toPrecision(3)} it moves the result ×${w.atLow.toPrecision(3)} / ×${w.atHigh.toPrecision(3)}: a calendar year drawn, a remainder of large figures or a net near zero?` });
    out.push(...unitProblems(lib, m, asCopied(m)), ...kindProblems(lib, m), ...sharedFactProblems(lib, m, waivers), ...copiedFigureProblems(lib, m, templates.get(m.template ?? "")));
    // generated/: a warning, the merge regenerates it.
    if (m.output) {
      const fresh = simulate(lib, m);
      if (fresh && !sameJson(JSON.parse(JSON.stringify(fresh)), distributions[id] ?? null))
        out.push({ severity: "low", check: "generated", where: "generated/distributions.json", message: `${id}'s simulation is ${distributions[id] ? "out of date" : "missing"}: run npx tsx scripts/summaries.ts` });
    }
    const stale = usedFacts(m, lib).filter((k) => (freshUsage[k] ?? []).includes(id) !== (usage[k] ?? []).includes(id));
    if (stale.length) out.push({ severity: "low", check: "generated", where: "generated/usage.json", message: `out of date for ${stale.slice(0, 3).map((k) => `@${k}`).join(", ")}${stale.length > 3 ? ", …" : ""}: run npx tsx scripts/summaries.ts` });
    if (prose) {
      try { out.push(...asProblems(await prose(id))); }
      catch (e) { out.push({ severity: "low", check: "prose", where: "prose", message: `the prose-numbers check failed: ${(e as Error).message}` }); }
    }
  }
  out.sort((a, b) => order[a.severity] - order[b.severity]);
  for (const p of out) console.log(`${p.severity} ${p.check} ${p.where}: ${p.message}`);
  const highs = out.filter((p) => p.severity === "high").length;
  blocking += highs;
  console.log(highs ? `${highs} blocking` : out.length ? "passes (no blocking problem)" : "passes");
}
process.exit(blocking ? 1 : 0);
