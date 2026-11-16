// The gate a model passes before any audit (build-cea, import-cea):
//   npx tsx scripts/preflight.ts <model-id> [<model-id> ...]
// One line per problem, `<severity> <check> <row/field>: <message and the fix>`, under a `# <model id>` line;
// exit 1 when any is high (blocking); a finding reported twice (the same line, or INV-13 and shared-fact on
// one row) shows once. A model the schema rejects is reported and checked on with the failing fields
// removed, where that lets it load. On the models given only:
//   check       what scripts/check.ts checks per model (expected values, dates, write-up, exchange rate)
//   lint        src/engine/lint.ts on charityevals' own models (template rows and context rows aren't "unused")
//   INV-n       every normalization invariant, on the model and the models it reads live, waivers applied
//   simulation  scripts/simulation-check.ts: unstable (medium where only shared facts flip it; a
//               "simulation" waiver clears it), single events that never happen, inputs that flip it
//   units       per $ against per $1,000 or a total, a percent against a fraction, per year against a total
//   kind / reference-class   no kind "template" copied in, no skeleton source left, judgments anchored
//   shared-fact a typed number a shared fact holds (from the first copy; not the programme's own measured
//               people), a typed next-dollar figure, a figure typed into another of our models too (a
//               "shared-fact-pair" waiver marks two such rows different quantities)
// Waivers: src/engine/normalization-waivers.json (src/engine/preflight.ts PREFLIGHT_WAIVERS for the formats).
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
import { copiedFigureProblems, kindProblems, PREFLIGHT_WAIVERS, sameJson, sharedFactProblems, simulationProblems, unitProblems, type Problem } from "../src/engine/preflight";
import { templateRowIds, TEMPLATE_DIR } from "../src/engine/template-files";
import { Model } from "../src/engine/schema";

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

/** A model file the schema rejects, made to load so the other checks still run: an unknown key removed,
 * a value outside its list set to "other" (or the list's first), a wrong optional field or a bad entry of
 * a list other than rows removed; undefined where only a fix of the file makes it load (a required field
 * missing, a bad row). */
type Issue = { path: PropertyKey[]; code: string; message: string; keys?: string[]; values?: unknown[] };
function repaired(raw: Record<string, unknown>): Record<string, unknown> | undefined {
  const x = structuredClone(raw);
  for (let round = 0; round < 25; round++) {
    const r = Model.safeParse(x);
    if (r.success) return x;
    // Deepest paths first, and list entries from the end, so removing one doesn't move another.
    const issues = [...(r.error.issues as unknown as Issue[])].sort((a, b) => b.path.length - a.path.length || String(b.path.at(-1)).localeCompare(String(a.path.at(-1)), undefined, { numeric: true }));
    let changed = false;
    for (const i of issues) {
      let parent: unknown = x;
      for (const k of i.path.slice(0, -1)) parent = (parent as Record<PropertyKey, unknown> | undefined)?.[k];
      const last = i.path.at(-1);
      if (i.code === "unrecognized_keys") {
        let o: unknown = x;
        for (const k of i.path) o = (o as Record<PropertyKey, unknown> | undefined)?.[k];
        if (o && typeof o === "object") for (const k of i.keys ?? []) { delete (o as Record<string, unknown>)[k]; changed = true; }
        continue;
      }
      if (last === undefined || !parent || typeof parent !== "object" || (parent as Record<PropertyKey, unknown>)[last] === undefined) return undefined;
      if (i.code === "invalid_value" && i.values?.length) {
        (parent as Record<PropertyKey, unknown>)[last] = i.values.includes("other") ? "other" : i.values[0];
        changed = true;
        continue;
      }
      if (Array.isArray(parent)) {
        if (i.path.length === 2 && i.path[0] === "rows") return undefined;
        parent.splice(Number(last), 1);
      } else delete (parent as Record<PropertyKey, unknown>)[last];
      changed = true;
    }
    if (!changed) return undefined;
  }
  return undefined;
}
const schemaProblems = new Map<string, Problem[]>();
const schemaLines = new Set<string>(); // buildLibrary's line for the same issues, not shown twice
for (const id of ids) {
  const k = rawModels.findIndex((x) => x.id === id);
  if (k < 0) continue;
  const r = Model.safeParse(rawModels[k]);
  if (r.success) continue;
  const fixed = repaired(rawModels[k]);
  schemaProblems.set(id, (r.error.issues as unknown as Issue[]).map((i) => ({ severity: "high", check: "schema", where: i.path.join(".") || "file",
    message: `${i.message}: fix the model file so it loads${fixed ? " (the checks below ran with it set aside)" : " (the other checks wait for this fix)"}` })));
  schemaLines.add(`${id}: ${(r.error.issues as unknown as Issue[]).map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
  if (fixed) rawModels[k] = fixed;
}
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
  const out: Problem[] = [...(schemaProblems.get(id) ?? []), ...lib.errors.filter((e) => (e.startsWith(`${id}.`) || e.startsWith(`${id}:`)) && !schemaLines.has(e)).map((e) => ({ severity: "high" as const, check: "schema", where: "file", message: `${e}: fix the model file so it loads` }))];
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
    out.push(...simulationProblems(id, sim, waivers));
    const usedPairs = new Set<string>();
    out.push(...unitProblems(lib, m, asCopied(m)), ...kindProblems(lib, m), ...sharedFactProblems(lib, m, waivers), ...copiedFigureProblems(lib, m, templates.get(m.template ?? ""), waivers, usedPairs));
    for (const k of Object.keys(waivers[PREFLIGHT_WAIVERS.pair] ?? {}))
      if (k.split(" = ").some((side) => side.split(" ")[0] === id) && !usedPairs.has(k))
        out.push({ severity: "low", check: "waiver", where: PREFLIGHT_WAIVERS.pair, message: `"${k}" matches no figure typed twice any more: remove it from src/engine/normalization-waivers.json` });
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
  // Each finding once: the same line twice, or shared-fact's concept finding where INV-13 has the row.
  const seen = new Set<string>();
  const inv13 = out.filter((p) => p.check === "INV-13").map((p) => p.where.split(" "));
  const shown = out.filter((p) => {
    const k = `${p.severity} ${p.check} ${p.where}: ${p.message}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return !(p.check === "shared-fact" && inv13.some(([c, row]) => row === p.where && p.message.includes(`states ${c},`)));
  });
  shown.sort((a, b) => order[a.severity] - order[b.severity]);
  for (const p of shown) console.log(`${p.severity} ${p.check} ${p.where}: ${p.message}`);
  const highs = shown.filter((p) => p.severity === "high").length;
  blocking += highs;
  console.log(highs ? `${highs} blocking` : shown.length ? "passes (no blocking problem)" : "passes");
}
process.exit(blocking ? 1 : 0);
