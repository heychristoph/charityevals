// Rewrite value_tlycs_recommended in every model that has it to the shared formula over TLYCS_DESTINATIONS
// (src/engine/moved-money.ts), after the destination list changes.   npx tsx scripts/relink-tlycs.ts
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { MOVED_MONEY_ROWS } from "../src/engine/moved-money";

const root = join(import.meta.dirname, "..");
const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
  });
const formula = MOVED_MONEY_ROWS.value_tlycs_recommended.formula;
for (const p of walk(join(root, "models"))) {
  const text = readFileSync(p, "utf8");
  if (!text.includes('"value_tlycs_recommended"')) continue;
  const m = JSON.parse(text);
  for (const r of m.rows) if (r.id === "value_tlycs_recommended" && r.formula !== formula) {
    r.formula = formula;
    writeFileSync(p, JSON.stringify(m, null, 2) + "\n");
    console.log("relinked", m.id);
  }
}
