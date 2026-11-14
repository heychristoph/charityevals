// Headline (healthy years per $1,000, our view, defaults) of the given models:
//   npx tsx scripts/headlines.ts <id> [<id> …]
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { assumptionValues, buildLibrary, headline } from "../src/engine/model";

const root = join(import.meta.dirname, "..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const lib = buildLibrary(walk(join(root, "models")).map(read), read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
const av = assumptionValues(lib.assumptions);
for (const id of process.argv.slice(2)) {
  const m = lib.models.get(id);
  console.log(`${id}\t${m ? headline(lib, m, av).toPrecision(6) : "no model"}`);
}
