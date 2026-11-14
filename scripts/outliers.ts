// Ranked models near or over INV-15's line (ten times their cause's median) and whether their summary says why:
//   npx tsx scripts/outliers.ts [multiple, default 5]
// A batch that adds many low models lowers a cause's median; this lists the models that will cross next.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildLibrary } from "../src/engine/model";
import { headline, assumptionValues } from "../src/engine/model";
import { rankingPlan } from "../src/engine/ranking";
import { OUTLIER_REASON } from "../src/engine/invariants";
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
  const peers = [...ranked.values()].filter((o) => o.id !== m.id && o.cause === m.cause).map((o) => h.get(o.id)!).filter((x) => Number.isFinite(x) && x > 0).sort((a, b) => a - b);
  if (peers.length < 3) continue;
  const median = peers.length % 2 ? peers[peers.length >> 1] : (peers[peers.length / 2 - 1] + peers[peers.length / 2]) / 2;
  const k = h.get(m.id)! / median;
  if (k >= min) console.log(`${k.toFixed(1)}× ${m.cause} ${m.id} ${OUTLIER_REASON.test(m.summary ?? "") ? "says why" : "NO REASON"}`);
}
