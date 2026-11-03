// Report mode for the normalization invariants (docs/normalization.md section 3): every invariant
// against every model, with the row or assumption that breaks it.
//   npx tsx scripts/normalization-audit.ts                     print the table, write generated/normalization-audit.json
//   npx tsx scripts/normalization-audit.ts --all               also print every violation's detail
//   npx tsx scripts/normalization-audit.ts --write-allowlist   also rewrite src/engine/normalization-allowlist.json
//   npx tsx scripts/normalization-audit.ts --exclude a,b       drop models (by model or charity id) first: a blind
//                                                              run's answer, or what its sandbox doesn't hold
// A model that doesn't load (a live reference `#id` to a model missing from the library, as in a sandbox
// stripped of the bulk models) is skipped with a note, and so is every model that reads it, rather than
// failing the run; errors in facts or assumptions still fail it. With anything excluded or skipped the
// report is partial: generated/normalization-audit.json and the allowlist are left as they are.
// The allowlist is today's violations: src/engine/normalization.test.ts fails on a new one, and on
// an allowlisted one that no longer occurs (so the list only shrinks). Rewrite it only after fixing.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildLibrary } from "../src/engine/model";
import { applyWaivers, checkAll, keyOf, toAllowlist, type Waivers } from "../src/engine/invariants";

const root = join(import.meta.dirname, "..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});

const args = process.argv.slice(2);
const exclude = new Set((args.includes("--exclude") ? args[args.indexOf("--exclude") + 1] ?? "" : "").split(",").filter(Boolean));
let models: Record<string, unknown>[] = walk(join(root, "models")).map(read);
const excluded = models.filter((x) => exclude.has(x.id as string) || exclude.has(x.charity as string)).map((x) => x.id as string);
models = models.filter((x) => !excluded.includes(x.id as string));
const build = () => buildLibrary(
  models,
  read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read),
  walk(join(root, "charities")).map(read),
  read(join(root, "owners.json")),
);
// Skip the models that don't load (errors start with "<model id>:" or "<model id>.<row>:"), and then any
// model that no longer loads without them, until the library builds.
const skipped: string[] = [];
let lib = build();
while (lib.errors.length) {
  const ids = new Set(models.map((x) => x.id as string));
  const bad = new Set(lib.errors.map((e) => /^([a-z0-9][a-z0-9-]*)[.:]/.exec(e)?.[1]).filter((id): id is string => !!id && ids.has(id)));
  if (!bad.size || lib.errors.some((e) => !bad.has(/^([a-z0-9][a-z0-9-]*)[.:]/.exec(e)?.[1] ?? ""))) {
    console.error(lib.errors.join("\n"));
    process.exit(1);
  }
  for (const id of bad) console.log(`Skipped ${id}: ${lib.errors.filter((e) => e.startsWith(id)).slice(0, 2).join("; ")}`);
  skipped.push(...bad);
  models = models.filter((x) => !bad.has(x.id as string));
  lib = build();
}
const partial = excluded.length > 0 || skipped.length > 0;
if (excluded.length) console.log(`Excluded ${excluded.length} models (--exclude): ${excluded.join(", ")}`);
if (partial) console.log(`Partial run: ${excluded.length} excluded, ${skipped.length} skipped; generated/normalization-audit.json and the allowlist are not written.\n`);

// Flags settled by hand (src/engine/normalization-waivers.json, each with its reason) aren't violations.
const waivers: Waivers = read(join(root, "src/engine/normalization-waivers.json"));
const { reports, stale: allStale } = applyWaivers(checkAll(lib), waivers);
// A waiver for a model left out of this run isn't stale.
const stale = allStale.filter((k) => ![...excluded, ...skipped].some((id) => k.includes(id)));
if (stale.length) console.log(`Stale waivers (remove them):\n  ${stale.join("\n  ")}\n`);
const all = process.argv.includes("--all");

console.log("Normalization audit (docs/normalization.md section 3)\n");
console.log(["Invariant", "Status", "Models checked", "Failing models", "Violations", "Waived"].join(" | "));
console.log("---|---|---|---|---|---");
for (const r of reports) {
  const failing = new Set(r.violations.map((v) => v.model));
  console.log([`${r.id} ${r.title}`, r.status, r.checked, failing.size, r.violations.length, r.waived ?? 0].join(" | "));
}
for (const r of reports) {
  const by = new Map<string, string[]>();
  for (const v of r.violations) by.set(v.model, [...(by.get(v.model) ?? []), all ? `${v.where}: ${v.detail}` : v.where]);
  console.log(`\n## ${r.id} ${r.title} [${r.status}]: ${by.size} models, ${r.violations.length} violations`);
  console.log(r.how);
  if (r.suppressed) for (const [why, n] of Object.entries(r.suppressed)) console.log(`  suppressed ${n}: ${why}`);
  const limit = all ? Infinity : 40;
  let shown = 0;
  for (const [model, wheres] of [...by].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))) {
    if (shown++ >= limit) { console.log(`  … ${by.size - limit} more models (--all)`); break; }
    if (all) { console.log(`  ${model}`); wheres.forEach((w) => console.log(`    ${w}`)); }
    else {
      const first = r.violations.find((v) => v.model === model)!;
      console.log(`  ${model} (${wheres.length}): ${wheres.slice(0, 4).join("; ")}${wheres.length > 4 ? "; …" : ""}${wheres.length === 1 ? ` — ${first.detail}` : ""}`);
    }
  }
}

const json = reports.map((r) => ({
  ...r,
  failing_models: [...new Set(r.violations.map((v) => v.model))].sort(),
  violations: [...r.violations].sort((a, b) => keyOf(a).localeCompare(keyOf(b))),
}));
if (!partial) {
  writeFileSync(join(root, "generated/normalization-audit.json"), JSON.stringify(json, null, 1) + "\n");
  console.log("\nWrote generated/normalization-audit.json");
}
if (process.argv.includes("--write-allowlist") && !partial) {
  writeFileSync(join(root, "src/engine/normalization-allowlist.json"), JSON.stringify(toAllowlist(reports), null, 1) + "\n");
  console.log("Wrote src/engine/normalization-allowlist.json");
}
