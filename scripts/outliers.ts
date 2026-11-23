// Ranked models far from their cause's median (a multiple of it, default 5): for audits, a pointer to a row that
// may be wrong. Never site text: the median moves whenever models land.
//   npx tsx scripts/outliers.ts [multiple, default 5]
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildLibrary } from "../src/engine/model";
import { headline, assumptionValues } from "../src/engine/model";
import { rankingPlan } from "../src/engine/ranking";
import { causeMedian } from "../src/engine/figures";
import type { ResolvedModel } from "../src/engine/model";

const root = join(import.meta.dirname, "..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const lib = buildLibrary(walk(join(root, "models")).map(read), read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
const min = Number(process.argv[2] ?? 5);
const av = assumptionValues(lib.assumptions);
const ranked = new Map<string, ResolvedModel>();
for (const c of lib.charities.keys()) for (const p of rankingPlan(lib, c)) for (const part of p.parts) ranked.set(part.model.id, part.model);
const h = new Map([...ranked.values()].map((m) => [m.id, headline(lib, m, av)]));
for (const m of [...ranked.values()].sort((a, b) => h.get(b.id)! - h.get(a.id)!)) {
  // The same median the audit tool reports (src/engine/figures.ts).
  const median = causeMedian(lib, m.cause, av, m.id);
  if (!Number.isFinite(median)) continue;
  const k = h.get(m.id)! / median;
  if (k >= min || k <= 1 / min) console.log(`${k.toFixed(1)}× ${m.cause} ${m.id}`);
}
