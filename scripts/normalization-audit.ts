// Report mode for the normalization invariants (docs/normalization.md section 3): every invariant
// against every model, with the row or assumption that breaks it.
//   npx tsx scripts/normalization-audit.ts                     print the table, write generated/normalization-audit.json
//   npx tsx scripts/normalization-audit.ts --all               also print every violation's detail
//   npx tsx scripts/normalization-audit.ts --write-allowlist   also rewrite src/engine/normalization-allowlist.json
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

const lib = buildLibrary(
  walk(join(root, "models")).map(read),
  read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read),
  walk(join(root, "charities")).map(read),
  read(join(root, "owners.json")),
);
if (lib.errors.length) {
  console.error(lib.errors.join("\n"));
  process.exit(1);
}

// Flags settled by hand (src/engine/normalization-waivers.json, each with its reason) aren't violations.
const waivers: Waivers = read(join(root, "src/engine/normalization-waivers.json"));
const { reports, stale } = applyWaivers(checkAll(lib), waivers);
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
writeFileSync(join(root, "generated/normalization-audit.json"), JSON.stringify(json, null, 1) + "\n");
console.log("\nWrote generated/normalization-audit.json");
if (process.argv.includes("--write-allowlist")) {
  writeFileSync(join(root, "src/engine/normalization-allowlist.json"), JSON.stringify(toAllowlist(reports), null, 1) + "\n");
  console.log("Wrote src/engine/normalization-allowlist.json");
}
