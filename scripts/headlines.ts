// Headline (healthy years per $1,000, our view, defaults) of the given models:
//   npx tsx scripts/headlines.ts <id> [<id> …]
//   npx tsx scripts/headlines.ts --snapshot [<id> …]   rewrite src/engine/mobiliser-share-snapshot.json: every
//       model's headline with the mobiliser's share at 100% (src/engine/mobiliser-share.test.ts). With ids,
//       only those entries. Only for a model added, removed or changed on purpose (a re-judged share, new
//       data): wiring the share into a model (docs/normalization.md 2.24) must leave its entry as it is.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { assumptionValues, buildLibrary, headline, headlineConversion } from "../src/engine/model";
import { MOBILISER_SHARE } from "../src/engine/moved-money";

const root = join(import.meta.dirname, "..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const lib = buildLibrary(walk(join(root, "models")).map(read), read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
const av = assumptionValues(lib.assumptions);
if (process.argv[2] === "--snapshot") {
  const file = join(root, "src/engine/mobiliser-share-snapshot.json");
  const only = process.argv.slice(3);
  const full = { ...av, [MOBILISER_SHARE]: 1 };
  const all: Record<string, number | null> = {};
  for (const m of [...lib.models.values()].sort((a, b) => a.id.localeCompare(b.id))) {
    if (!m.output || m.kind === "template" || !headlineConversion(lib, m.output.unit)) continue;
    const h = headline(lib, m, full);
    all[m.id] = Number.isFinite(h) ? h : null;
  }
  const out = only.length ? { ...read(file), ...Object.fromEntries(only.map((id) => [id, all[id]])) } : all;
  for (const id of Object.keys(out)) if (!(id in all)) delete out[id];
  writeFileSync(file, JSON.stringify(Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b))), null, 1) + "\n");
  console.log(`${Object.keys(out).length} headlines at ${MOBILISER_SHARE} = 1 → src/engine/mobiliser-share-snapshot.json`);
  process.exit(0);
}
for (const id of process.argv.slice(2)) {
  const m = lib.models.get(id);
  console.log(`${id}\t${m ? headline(lib, m, av).toPrecision(6) : "no model"}`);
}
