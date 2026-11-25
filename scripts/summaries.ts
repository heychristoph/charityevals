// Writes generated/bulk-summaries.json: a compact stand-in for every bulk-imported model;
// generated/browser-models.json: the models every page ships (src/lib/browser-models.ts): a stand-in for
// each standalone model, variant families in full; generated/browser-facts.json: the shared facts without
// their text (explainers and sources); and generated/usage.json: which models read each
// shared fact (the browser's summaries fold facts away).
//   npx tsx scripts/summaries.ts           write
//   npx tsx scripts/summaries.ts --check   fail if the file is out of date (npm run check runs this)
// Bulk models (models/grants/) are tens of megabytes of rows, too much for the browser. Each stand-in
// is the model partially evaluated: every row that depends on a shared assumption (moral weights,
// discount rate, DALY value...) or on a ranged input stays a live formula; everything else, which can't
// change, is folded into its value. The browser computes the same bottom line and the same ranges as the
// full model under any assumptions. Pages render the full model on the server, and a model's own page
// hands the browser its full rows.
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { buildLibrary, assumptionValues, compute, comparable, factUsage, hasRange, type Distribution, type JointEnds, type Library } from "../src/engine/model";
import { storedDistribution } from "../src/engine/figures";
import { sensitivity } from "../src/engine/sensitivity";
import { isValueOfInformation } from "../src/engine/ranking";
import { renderRaw } from "../src/engine/prose";
import { browserFacts, summarisedIds } from "../src/lib/browser-models";

const root = join(import.meta.dirname, "..");
const out = join(root, "generated/bulk-summaries.json");
const browserOut = join(root, "generated/browser-models.json");
const factsOut = join(root, "generated/browser-facts.json");
const usageOut = join(root, "generated/usage.json");
const distributionsOut = join(root, "generated/distributions.json");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});

function library() {
  const raws = walk(join(root, "models/grants")).sort().map(read);
  const own = walk(join(root, "models")).filter((p) => !p.includes("/models/grants/")).sort().map(read);
  return { raws, own, lib: buildLibrary(
    [...own, ...raws],
    read(join(root, "assumptions/default.json")),
    walk(join(root, "facts")).map(read),
    walk(join(root, "charities")).map(read),
    read(join(root, "owners.json")),
  ) };
}

export function summaries({ raws, lib }: ReturnType<typeof library>, dist?: Record<string, Distribution>): unknown[] {
  const av = assumptionValues(lib.assumptions);
  // The browser shows a stand-in's summary as written, so its numbers (`{{result}}`) are rendered here.
  const withRanges: Library = { ...lib, distributions: dist };
  return raws.map((written) => {
    const raw = renderRaw(withRanges, written);
    const m = lib.models.get(raw.id)!;
    const values = compute(lib, m, av);
    // Live: reads an assumption or a ranged input, directly or through other rows.
    const live = new Set<string>();
    // A row with the evaluator's own number in `published` differs between the views: folding it to
    // our value would put our number into the evaluator view.
    const published = new Set((raw.rows as { id: string; published?: unknown }[]).filter((r) => r.published !== undefined).map((r) => r.id));
    for (const id of m.order) {
      const r = m.byId.get(id)!;
      // A ranged shared fact is uncertain too: folding it would drop it from the browser's ranges.
      const rangedFact = r.factDeps.some((f) => hasRange(lib.facts.get(f)?.value));
      // Another model's live result (`#id`) moves with the sliders: the stand-in keeps the reference.
      if (r.single_event || r.assumptionDeps.length || r.livesAdded?.length || r.modelDeps.length || rangedFact || typeof r.value === "object" || r.range || published.has(id) || r.deps.some((d) => live.has(d))) live.add(id);
    }
    const seen = new Set<string>();
    const visit = (id: string) => {
      if (seen.has(id)) return;
      seen.add(id);
      if (live.has(id)) m.byId.get(id)!.deps.forEach(visit);
    };
    visit(m.output!.row);
    // The rows the output unit's conversion reads by name (a climate model's air_pollution_weight,
    // docs/normalization.md 2.5) are kept, under their own ids.
    m.conversionRows.forEach(visit);
    const byId = new Map((raw.rows as { id: string }[]).map((r) => [r.id, r]));
    const rows: Record<string, unknown>[] = m.order.filter((id) => seen.has(id)).map((id) => {
      const r = byId.get(id) as Record<string, unknown>;
      // Labels only for the bottom line: nothing in the browser shows a summary's other rows.
      const label = id === m.output!.row ? r.label : "";
      if (live.has(id)) {
        const { explainer: _e, source: _s, expected: _x, section: _c, format: _f, ...rest } = r;
        return { ...rest, label, ...("value" in rest || "published" in rest ? { explainer: "Input." } : {}) };
      }
      // A side effect keeps its mark, and so does the good of lives that never start: what reads it
      // still reads it through the weight.
      return { id, label, value: values[id], kind: "estimate", explainer: "Folded.", ...(r.side_effect ? { side_effect: r.side_effect } : {}), ...(r.never_started ? { never_started: true } : {}) };
    });
    // Short ids: the browser never shows them. The bottom line keeps its own, for links and history.
    const named = new Set([m.output!.row, ...m.conversionRows]);
    const short = new Map(rows.map((r, i) => [r.id as string, named.has(r.id as string) ? (r.id as string) : `r${i.toString(36)}`]));
    // Leaves `$assumption`, `@fact.row` and `#model-id` alone.
    const rename = (f: string) => f.replace(/#[a-z0-9]+(?:-[a-z0-9]+)*(?::[a-z0-9]+(?:-[a-z0-9]+)*)?|(?<![$@.\w])[a-z_][a-z0-9_]*\b(?!\s*\()/gi, (w) => (w.startsWith("#") ? w : short.get(w) ?? w));
    const compact = rows.map((r) => ({ ...r, id: short.get(r.id as string), ...(typeof r.formula === "string" ? { formula: rename(r.formula) } : {}), ...(typeof r.drawn_with === "string" ? { drawn_with: short.get(r.drawn_with) ?? r.drawn_with } : {}) }));
    // A story names rows a stand-in folds away; the model's own page loads its full file.
    const { rows: _rows, sections: _sections, resources: _resources, story: _story, ...meta } = raw;
    // A reference read as a destination stays one only where a kept row still reads it.
    const reads = compact.map((r) => (typeof r.formula === "string" ? r.formula : "")).join(" ");
    if (Array.isArray(meta.destination_reads)) {
      const kept = (meta.destination_reads as string[]).filter((d) => new RegExp(`#${d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w:-])`).test(reads));
      if (kept.length) meta.destination_reads = kept;
      else delete meta.destination_reads;
    }
    // A stand-in folds the native and species rows away, so its output names only the bottom line.
    const { native: _native, species: _species, ...output } = (raw.output ?? {}) as Record<string, unknown>;
    return { ...meta, ...(raw.output ? { output } : {}), ...(isValueOfInformation(m) ? { value_of_information: true } : {}), rows: compact };
  });
}

/** Same structure and strings, numbers equal to 1 part in 10^12. Exact text would fail across Node
 * versions: V8 releases differ in the last bit of Math.exp, Math.log and **, so a file written on
 * Node 22 and regenerated on Node 24 (as CI does) differs in a few final digits. */
function same(a: unknown, b: unknown, path = ""): boolean {
  const ok = (cond: boolean) => {
    // The first difference, so a failing check says where (and by how much) rather than only "out of date".
    if (!cond && !firstDiff) firstDiff = `${path || "(root)"}: committed ${JSON.stringify(a)?.slice(0, 80)}, regenerated ${JSON.stringify(b)?.slice(0, 80)}`;
    return cond;
  };
  if (typeof a === "number" && typeof b === "number") return ok(a === b || Math.abs(a - b) <= 1e-12 * Math.max(Math.abs(a), Math.abs(b)));
  if (Array.isArray(a) && Array.isArray(b)) return ok(a.length === b.length) && a.every((x, i) => same(x, b[i], `${path}[${i}]`));
  if (a && b && typeof a === "object" && typeof b === "object") {
    const ka = Object.keys(a), kb = Object.keys(b);
    return ok(ka.length === kb.length && ka.every((k) => k in (b as object))) && ka.every((k) => same((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}.${k}`));
  }
  return ok(a === b);
}
let firstDiff = "";

/** Per model, its result as a distribution from a Monte Carlo at the defaults (src/engine/montecarlo.ts),
 * the reader's own value judgments left out: what the risk slider ($risk_quantile) and the plausible
 * ranges read (docs/normalization.md 2.18). Seeded by model id, so the file only changes when a model does. */
export function distributions(lib: Library): Record<string, Distribution> {
  const out: Record<string, Distribution> = {};
  for (const m of [...lib.models.values()].sort((a, b) => a.id.localeCompare(b.id))) {
    const d = storedDistribution(lib, m);
    if (d) out[m.id] = d;
  }
  return out;
}

/** The models every page ships: a stand-in for each summarised standalone model, the rest as written. */
function browserModels(built: ReturnType<typeof library>, dist: Record<string, Distribution>): unknown[] {
  // Only models in the library: an unpublished owner's (owners.json `published: false`) never ship.
  const own = built.own.filter((r) => built.lib.models.has(r.id));
  const ids = summarisedIds(own, dist);
  const stand = new Map((summaries({ ...built, raws: own.filter((r) => ids.has(r.id)) }, dist) as { id: string }[]).map((s) => [s.id, s]));
  return own.map((r) => stand.get(r.id) ?? r);
}

/** The fact files the published site ships: the repository's, never files kept out of it on one machine
 * (a private evaluator's figures in .git/info/exclude), so the build is the same everywhere. */
function publishedFactFiles(): string[] {
  const all = walk(join(root, "facts")).sort();
  try {
    const tracked = new Set(execFileSync("git", ["ls-files", "facts"], { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean).map((f) => join(root, f)));
    return tracked.size ? all.filter((f) => tracked.has(f)) : all;
  } catch {
    return all;
  }
}

const built = library();
const dist = distributions(built.lib);
for (const [file, fresh] of [[out, summaries(built, dist)], [browserOut, browserModels(built, dist)], [factsOut, browserFacts(publishedFactFiles().map(read))], [usageOut, factUsage(built.lib)], [distributionsOut, dist]] as const) {
  if (process.argv.includes("--check")) {
    if (!existsSync(file) || !same(JSON.parse(readFileSync(file, "utf8")), JSON.parse(JSON.stringify(fresh)))) {
      console.error(`${file.slice(root.length + 1)} is out of date: run npx tsx scripts/summaries.ts${firstDiff ? `\n  first difference ${firstDiff}` : ""}`);
      process.exit(1);
    }
  } else writeFileSync(file, JSON.stringify(fresh) + "\n");
}
