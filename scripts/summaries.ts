// Writes generated/bulk-summaries.json: a compact stand-in for every bulk-imported model, and
// generated/usage.json: which models read each shared fact (the browser's summaries fold facts away).
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
import { buildLibrary, assumptionValues, compute, factUsage, hasRange } from "../src/engine/model";

const root = join(import.meta.dirname, "..");
const out = join(root, "generated/bulk-summaries.json");
const usageOut = join(root, "generated/usage.json");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});

function library() {
  const raws = walk(join(root, "models/grants")).sort().map(read);
  return { raws, lib: buildLibrary(
    [...walk(join(root, "models")).filter((p) => !p.includes("/models/grants/")).map(read), ...raws],
    read(join(root, "assumptions/default.json")),
    walk(join(root, "facts")).map(read),
    walk(join(root, "charities")).map(read),
    read(join(root, "owners.json")),
  ) };
}

export function summaries({ raws, lib }: ReturnType<typeof library>): unknown[] {
  const av = assumptionValues(lib.assumptions);
  return raws.map((raw) => {
    const m = lib.models.get(raw.id)!;
    const values = compute(lib, m, av);
    // Live: reads an assumption or a ranged input, directly or through other rows.
    const live = new Set<string>();
    for (const id of m.order) {
      const r = m.byId.get(id)!;
      // A ranged shared fact is uncertain too: folding it would drop it from the browser's ranges.
      const rangedFact = r.factDeps.some((f) => hasRange(lib.facts.get(f)?.value));
      if (r.assumptionDeps.length || rangedFact || typeof r.value === "object" || r.range || r.deps.some((d) => live.has(d))) live.add(id);
    }
    const seen = new Set<string>();
    const visit = (id: string) => {
      if (seen.has(id)) return;
      seen.add(id);
      if (live.has(id)) m.byId.get(id)!.deps.forEach(visit);
    };
    visit(m.output!.row);
    const byId = new Map((raw.rows as { id: string }[]).map((r) => [r.id, r]));
    const rows: Record<string, unknown>[] = m.order.filter((id) => seen.has(id)).map((id) => {
      const r = byId.get(id) as Record<string, unknown>;
      // Labels only for the bottom line: nothing in the browser shows a summary's other rows.
      const label = id === m.output!.row ? r.label : "";
      if (live.has(id)) {
        const { explainer: _e, source: _s, expected: _x, section: _c, format: _f, ...rest } = r;
        return { ...rest, label, ...("value" in rest || "published" in rest ? { explainer: "Input." } : {}) };
      }
      return { id, label, value: values[id], kind: "estimate", explainer: "Folded." };
    });
    // Short ids: the browser never shows them. The bottom line keeps its own, for links and history.
    const short = new Map(rows.map((r, i) => [r.id as string, r.id === m.output!.row ? (r.id as string) : `r${i.toString(36)}`]));
    const rename = (f: string) => f.replace(/(?<![$@.\w])[a-z_][a-z0-9_]*\b(?!\s*\()/gi, (w) => short.get(w) ?? w);
    const compact = rows.map((r) => ({ ...r, id: short.get(r.id as string), ...(typeof r.formula === "string" ? { formula: rename(r.formula) } : {}) }));
    const { rows: _rows, sections: _sections, resources: _resources, ...meta } = raw;
    // A stand-in folds the native and species rows away, so its output names only the bottom line.
    const { native: _native, species: _species, ...output } = (raw.output ?? {}) as Record<string, unknown>;
    return { ...meta, ...(raw.output ? { output } : {}), rows: compact };
  });
}

/** Same structure and strings, numbers equal to 1 part in 10^12. Exact text would fail across Node
 * versions: V8 releases differ in the last bit of Math.exp, Math.log and **, so a file written on
 * Node 22 and regenerated on Node 24 (as CI does) differs in a few final digits. */
function same(a: unknown, b: unknown): boolean {
  if (typeof a === "number" && typeof b === "number") return a === b || Math.abs(a - b) <= 1e-12 * Math.max(Math.abs(a), Math.abs(b));
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => same(x, b[i]));
  if (a && b && typeof a === "object" && typeof b === "object") {
    const ka = Object.keys(a), kb = Object.keys(b);
    return ka.length === kb.length && ka.every((k) => same((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
  }
  return a === b;
}

const built = library();
for (const [file, fresh] of [[out, summaries(built)], [usageOut, factUsage(built.lib)]] as const) {
  if (process.argv.includes("--check")) {
    if (!existsSync(file) || !same(JSON.parse(readFileSync(file, "utf8")), JSON.parse(JSON.stringify(fresh)))) {
      console.error(`${file.slice(root.length + 1)} is out of date: run npx tsx scripts/summaries.ts`);
      process.exit(1);
    }
  } else writeFileSync(file, JSON.stringify(fresh) + "\n");
}
