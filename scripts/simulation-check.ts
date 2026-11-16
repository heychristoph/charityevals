// Checks a model's Monte Carlo (src/engine/montecarlo.ts, docs/normalization.md 2.18) before it is published:
//   npx tsx scripts/simulation-check.ts <model id> [<model id> ...]
// Prints the simulated shape (5%, 50%, 95% as multiples of the best guess), whether it is unstable, for a model
// with single-event chances the share of misses and the average beside the smooth one, and the inputs that,
// alone at an end of their range, flip the result's sign or move it more than tenfold: the usual causes of an
// unstable simulation (a calendar year drawn, a remainder of large figures, a net near zero in a denominator).
// Exit 1 when any model is unstable or a single event never happens or always does.
// The checks themselves are src/engine/simulation-check.ts (scripts/preflight.ts runs them too).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildLibrary } from "../src/engine/model";
import { simulationCheck } from "../src/engine/simulation-check";

const root = join(import.meta.dirname, "..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const lib = buildLibrary(walk(join(root, "models")).map(read), read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
const f = (x: number | undefined) => (x === undefined || !Number.isFinite(x) ? "–" : Number(x.toPrecision(3)).toString());
let bad = false;

for (const id of process.argv.slice(2)) {
  const m = lib.models.get(id);
  if (!m) { console.log(`${id}: not in the library`); bad = true; continue; }
  const c = simulationCheck(lib, m);
  if (c.none || !c.shape) { console.log(`${id}: no simulation (no comparable result or no uncertain input)`); continue; }
  console.log(`\n${id}: 5% ${f(c.shape.q5)}  50% ${f(c.shape.q50)}  95% ${f(c.shape.q95)} × best guess${c.unstable ? "  UNSTABLE" : ""}`);
  if (c.unstable) bad = true;
  if (c.events) {
    console.log(`  ${c.events.count} single events: misses ${f(c.events.misses * 100)}% of draws; average ${f(c.events.mean)} (smooth ${f(c.events.smooth)})`);
    if (c.brokenEvents) { console.log("  a single event never happens or the draws are broken: check the tags"); bad = true; }
  }
  if (c.wild.length) console.log(["  inputs that flip or move it tenfold alone:", ...c.wild.slice(0, 8).map((w) => `  ${w.key}: ${f(w.low)}..${f(w.high)} moves the result ×${f(w.atLow)} / ×${f(w.atHigh)}`)].join("\n"));
}
process.exit(bad ? 1 : 0);
