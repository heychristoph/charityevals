// Checks a model's Monte Carlo (src/engine/montecarlo.ts, docs/normalization.md 2.18) before it is published:
//   npx tsx scripts/simulation-check.ts <model id> [<model id> ...]
// Prints the simulated shape (5%, 50%, 95% as multiples of the best guess), whether it is unstable, for a model
// with single-event chances the share of misses and the average beside the smooth one, and the inputs that,
// alone at an end of their range, flip the result's sign or move it more than tenfold: the usual causes of an
// unstable simulation (a calendar year drawn, a remainder of large figures, a net near zero in a denominator).
// Exit 1 when any model is unstable or a single event never happens or always does.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { assumptionValues, buildLibrary, compute, headline, RISK_OFF, RISK_QUANTILE } from "../src/engine/model";
import { simulate } from "../src/engine/montecarlo";
import { uncertainty } from "../src/engine/uncertainty";

const root = join(import.meta.dirname, "..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const lib = buildLibrary(walk(join(root, "models")).map(read), read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
const av = { ...assumptionValues(lib.assumptions), [RISK_QUANTILE]: RISK_OFF };
const f = (x: number | undefined) => (x === undefined || !Number.isFinite(x) ? "–" : Number(x.toPrecision(3)).toString());
let bad = false;

for (const id of process.argv.slice(2)) {
  const m = lib.models.get(id);
  if (!m) { console.log(`${id}: not in the library`); bad = true; continue; }
  const d = simulate(lib, m, 2000);
  if (!d) { console.log(`${id}: no simulation (no comparable result or no uncertain input)`); continue; }
  const mid = d.middle ?? d.q[9];
  console.log(`\n${id}: 5% ${f(d.q[0] / mid)}  50% ${f(d.q[9] / mid)}  95% ${f(d.q[18] / mid)} × best guess${d.unstable ? "  UNSTABLE" : ""}`);
  if (d.unstable) bad = true;
  const events = m.rows.filter((r) => r.single_event);
  if (events.length) {
    const saved = events.map((r) => r.single_event);
    events.forEach((r) => ((r as { single_event?: unknown }).single_event = undefined));
    const s = simulate(lib, m, 2000);
    events.forEach((r, i) => ((r as { single_event?: unknown }).single_event = saved[i]));
    console.log(`  ${events.length} single events: misses ${f(d.zero * 100)}% of draws; average ${f(d.mean)} (smooth ${f(s?.mean)})`);
    if (d.zero >= 0.999 || d.zero === 0 && d.q[0] / mid < 1e-3) { console.log("  a single event never happens or the draws are broken: check the tags"); bad = true; }
  }
  // One input at a time at each end of its range.
  const c = headline(lib, m, av);
  const values = compute(lib, m, av);
  const u = uncertainty(lib, m, values, av, "charityevals");
  const wild = u.drivers.filter((x) => x.source !== "assumption").flatMap((x) => {
    const key = x.scope === "fact" ? `@${x.id}` : x.id;
    const lo = headline(lib, m, av, { [key]: x.low }) / c, hi = headline(lib, m, av, { [key]: x.high }) / c;
    return [lo, hi].some((r) => !(r > 0.1 && r < 10)) ? [`  ${key}: ${f(x.low)}..${f(x.high)} moves the result ×${f(lo)} / ×${f(hi)}`] : [];
  });
  if (wild.length) console.log(["  inputs that flip or move it tenfold alone:", ...wild.slice(0, 8)].join("\n"));
}
process.exit(bad ? 1 : 0);
