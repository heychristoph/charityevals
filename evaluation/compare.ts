// Compares each build-cea evaluation run with the evaluator model of the same charity.
//   npx tsx evaluation/compare.ts            table for docs/eval-skills.md
// A run is evaluation/{dev,blind}-runs/<charity>/<charity>-charityevals.json, plus any facts the builder
// added in <run>/facts/ (they override the repo's facts of the same id for that run only).
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { assumptionValues, bottomLine, buildLibrary, compute } from "../src/engine/model";
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
};

const models = walk(join(root, "models")).filter((p) => !p.includes("/models/grants/")).map(read);
const repoFacts = walk(join(root, "facts")).map(read);
const charities = walk(join(root, "charities")).map(read);
const owners = read(join(root, "owners.json"));
const assumptions = read(join(root, "assumptions/default.json"));

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
    if (errs.length) { console.error(errs.join("\n")); continue; }
    const av = assumptionValues(lib.assumptions);
    const bench = bottomLine(lib, lib.models.get(lib.assumptions.common.benchmark)!, av).common;
    const benchEval = bottomLine(lib, lib.models.get(lib.assumptions.common.benchmark)!, av, {}, "evaluator").common;
    const ours = lib.models.get(raw.id)!;
    const ev = lib.models.get(EVALUATOR[charity])!;
    const o = bottomLine(lib, ours, av).common / bench;
    const e = bottomLine(lib, ev, av).common / bench;
    const eEval = bottomLine(lib, ev, av, {}, "evaluator").common / benchEval;
    const s = sensitivity(lib, ours, av);
    const v = compute(lib, ours, av);
    rows.push(`| ${set === "dev-runs" ? "dev" : "test"} | ${charity} | ${ours.template} | ${ev.owner} | ${eEval.toFixed(2)}× | ${e.toFixed(2)}× | ${o.toFixed(3)}× | ${(s.jointLow / bench).toPrecision(2)}–${(s.jointHigh / bench).toPrecision(3)}× | ${(o / e).toPrecision(2)} | ${v.total_adj.toFixed(2)} |`);
  }
}
console.log("| Set | Charity | Template | Evaluator | Evaluator model, evaluator view | Evaluator model, charityevals view | Blind build | Blind joint low–high | Ratio (blind ÷ evaluator, same view) | total_adj |");
console.log("|---|---|---|---|---|---|---|---|---|---|");
console.log(rows.join("\n"));
