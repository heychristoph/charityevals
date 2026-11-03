// Compares each build-cea evaluation run with the evaluator model of the same charity.
//   npx tsx evaluation/compare.ts            table for docs/eval-skills.md
// A run is evaluation/{dev,blind}-runs/<charity>/<charity>-charityevals.json, plus any facts the builder
// added in <run>/facts/ (they override the repo's facts of the same id for that run only).
// Figures are years of healthy life per $1,000 under the site's default assumptions, except the
// estimate-age discount, which is off for both sides: a blind build is dated today and the evaluator's
// estimate is older, and the comparison is of what each model estimates, not of when.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { assumptionValues, buildLibrary, compute, headline } from "../src/engine/model";
import { sensitivity } from "../src/engine/sensitivity";

const root = join(import.meta.dirname, "..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
  });

/** The evaluator model each run is compared with. */
const EVALUATOR: Record<string, string> = {
  "against-malaria-foundation": "against-malaria-foundation",
  "the-humane-league": "the-humane-league",
  strongminds: "strongminds",
  "sociedade-vegetariana-brasileira": "sociedade-vegetariana-brasileira",
  "helen-keller-intl": "helen-keller-vas",
  "new-incentives": "new-incentives",
  "shrimp-welfare-project": "shrimp-welfare-project",
  "dansk-vegetarisk-forening": "dansk-vegetarisk-forening",
  "friendship-bench": "friendship-bench",
  "village-enterprise": "village-enterprise-founders-pledge",
  "the-life-you-can-save": "the-life-you-can-save-founders-pledge",
};

// Bulk imports too: shared destination sets (moved money) read some of them live.
const models = walk(join(root, "models")).map(read);
const repoFacts = walk(join(root, "facts")).map(read);
const charities = walk(join(root, "charities")).map(read);
const owners = read(join(root, "owners.json"));
const assumptions = read(join(root, "assumptions/default.json"));
const fmt = (x: number) => (Math.abs(x) >= 100 ? x.toFixed(0) : x.toPrecision(2));

const rows: string[] = [];
for (const set of ["dev-runs", "blind-runs"]) {
  const dir = join(root, "evaluation", set);
  if (!existsSync(dir)) continue;
  for (const charity of readdirSync(dir).sort()) {
    const file = join(dir, charity, `${charity}-charityevals.json`);
    if (!existsSync(file)) continue;
    const raw = read(file);
    const extra = existsSync(join(dir, charity, "facts")) ? walk(join(dir, charity, "facts")).map(read) : [];
    const facts = [...repoFacts.filter((f) => !extra.some((e) => e.id === f.id)), ...extra];
    const lib = buildLibrary([...models, raw], assumptions, facts, charities, owners);
    const errs = lib.errors.filter((e) => e.startsWith(raw.id));
    if (errs.length) { console.error(`${charity}: ${errs.join("\n")}`); continue; }
    const av = assumptionValues(lib.assumptions, { estimate_age_discount: 0 });
    const ours = lib.models.get(raw.id)!;
    const ev = lib.models.get(EVALUATOR[charity])!;
    const o = headline(lib, ours, av);
    const e = headline(lib, ev, av);
    const eOwn = headline(lib, ev, av, {}, "evaluator");
    const s = sensitivity(lib, ours, av);
    const v = compute(lib, ours, av);
    const when = (m: typeof ours) => `${m.estimate_basis ?? "?"}, ${m.source?.published?.slice(0, 4) ?? "?"}`;
    rows.push(`| ${set === "dev-runs" ? "dev" : "test"} | ${charity} | ${ours.template} | ${ev.owner} (${when(ev)}) | ${fmt(eOwn)} | ${fmt(e)} | ${fmt(o)} (${when(ours)}) | ${fmt(s.jointLow)}–${fmt(s.jointHigh)} | **${(o / e).toPrecision(2)}** | ${Number.isFinite(v.total_adj) ? v.total_adj.toFixed(2) : "–"} |`);
  }
}
console.log("Years of healthy life per $1,000 (site defaults, estimate-age discount off for both).\n");
console.log("| Set | Charity | Template | Evaluator (basis, year) | Evaluator model, evaluator view | Evaluator model, charityevals view | Blind build (basis, year) | Blind joint low–high | Ratio (blind ÷ evaluator, same view) | total_adj |");
console.log("|---|---|---|---|---|---|---|---|---|---|");
console.log(rows.join("\n"));
