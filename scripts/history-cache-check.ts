// Times the history pages' work for a few models with an empty and then a warm cache, and checks both
// give the same entries (src/lib/history.ts). `npx tsx scripts/history-cache-check.ts [model-id…]`
import { readdirSync, rmSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { histories, type HistoryRequest } from "../src/lib/history";

const root = join(import.meta.dirname, "..");
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const paths = walk(join(root, "models")).filter((p) => p.endsWith(".json"));
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ["givedirectly", "the-humane-league-charityevals-corporate-campaigns", "clean-air-task-force-charityevals"];
const reqs = ids.map((id) => {
  const p = paths.find((x) => x.endsWith(`/${id}.json`));
  if (!p) throw new Error(`no model file for ${id}`);
  return { model: { id }, filePaths: [relative(root, p)] } as unknown as HistoryRequest;
});
rmSync(join(root, ".cache/history"), { recursive: true, force: true });
let t = Date.now();
const cold = histories(root, reqs, { uncommitted: false });
const coldMs = Date.now() - t;
t = Date.now();
const warm = histories(root, reqs, { uncommitted: false });
const warmMs = Date.now() - t;
const same = JSON.stringify([...cold]) === JSON.stringify([...warm]);
console.log(`entries: ${[...cold.values()].map((e) => e.length).join(", ")}; cold ${coldMs} ms, warm ${warmMs} ms; same: ${same}`);
if (!same) process.exit(1);
