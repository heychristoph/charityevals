// Writes generated/bulk-summaries.json: a one-row stand-in for every bulk-imported model.
//   npx tsx scripts/summaries.ts           write
//   npx tsx scripts/summaries.ts --check   fail if the file is out of date (npm run check runs this)
// Bulk models (models/grants/) are tens of megabytes of rows, and none of them reads a shared
// assumption, so their bottom line doesn't change with the visitor's settings. The browser gets these
// stand-ins (bottom line and joint range); pages render the full model on the server and hand a
// model's own page its full rows.
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { buildLibrary, assumptionValues, bottomLine } from "../src/engine/model";
import { sensitivity } from "../src/engine/sensitivity";

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
    if (m.rows.some((r) => r.assumptionDeps.length || r.factDeps.length)) throw new Error(`${m.id}: bulk models can't read assumptions or facts`);
    // Sensitivity reports common units; the stand-in row holds the model's own unit.
    const s = sensitivity(lib, m, av);
    const { native: best, common } = bottomLine(lib, m, av);
    const toNative = common ? best / common : 1;
    const { rows: _rows, sections: _sections, resources: _resources, ...meta } = raw;
    // Only the model's own input ranges belong in the stand-in; exchange-rate ranges are applied again
    // on top of it, as they are for the full model.
    const ranged = m.rows.some((r) => typeof r.value === "object" || r.range);
    if (ranged && lib.assumptions.units[m.output!.unit]?.to_common) throw new Error(`${m.id}: ranged bulk models in convertible units need a joint range without the exchange rate`);
    const low = ranged ? Math.min(s.jointLow * toNative, best) : best, high = ranged ? Math.max(s.jointHigh * toNative, best) : best;
    return {
      ...meta,
      rows: [{
        id: m.output!.row, label: m.output!.label, kind: "estimate",
        value: low === high ? best : { low, best, high },
        explainer: "Summary of the full model, which this page renders on the server.",
      }],
    };
  });
}

const text = JSON.stringify(summaries()) + "\n";
if (process.argv.includes("--check")) {
  if (!existsSync(out) || readFileSync(out, "utf8") !== text) {
    console.error("generated/bulk-summaries.json is out of date: run npx tsx scripts/summaries.ts");
    process.exit(1);
  }
} else writeFileSync(out, text);
