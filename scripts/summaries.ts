// Writes generated/bulk-summaries.json: a compact stand-in for every bulk-imported model.
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
import { buildLibrary, assumptionValues, compute } from "../src/engine/model";

const root = join(import.meta.dirname, "..");
const out = join(root, "generated/bulk-summaries.json");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});

export function summaries(): unknown[] {
  const raws = walk(join(root, "models/grants")).sort().map(read);
  const lib = buildLibrary(
    [...walk(join(root, "models")).filter((p) => !p.includes("/models/grants/")).map(read), ...raws],
    read(join(root, "assumptions/default.json")),
    walk(join(root, "facts")).map(read),
    walk(join(root, "charities")).map(read),
    read(join(root, "owners.json")),
  );
  const av = assumptionValues(lib.assumptions);
  return raws.map((raw) => {
    const m = lib.models.get(raw.id)!;
    const values = compute(lib, m, av);
    // Live: reads an assumption or a ranged input, directly or through other rows.
    const live = new Set<string>();
    for (const id of m.order) {
      const r = m.byId.get(id)!;
      if (r.assumptionDeps.length || typeof r.value === "object" || r.range || r.deps.some((d) => live.has(d))) live.add(id);
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
        return { ...rest, label, ...("value" in rest ? { explainer: "Input." } : {}) };
      }
      return { id, label, value: values[id], kind: "estimate", explainer: "Folded." };
    });
    // Short ids: the browser never shows them. The bottom line keeps its own, for links and history.
    const short = new Map(rows.map((r, i) => [r.id as string, r.id === m.output!.row ? (r.id as string) : `r${i.toString(36)}`]));
    const rename = (f: string) => f.replace(/(?<![$@.\w])[a-z_][a-z0-9_]*\b(?!\s*\()/gi, (w) => short.get(w) ?? w);
    const compact = rows.map((r) => ({ ...r, id: short.get(r.id as string), ...(typeof r.formula === "string" ? { formula: rename(r.formula) } : {}) }));
    const { rows: _rows, sections: _sections, resources: _resources, ...meta } = raw;
    return { ...meta, rows: compact };
  });
}

const text = JSON.stringify(summaries()) + "\n";
if (process.argv.includes("--check")) {
  if (!existsSync(out) || readFileSync(out, "utf8") !== text) {
    console.error("generated/bulk-summaries.json is out of date: run npx tsx scripts/summaries.ts");
    process.exit(1);
  }
} else writeFileSync(out, text);
