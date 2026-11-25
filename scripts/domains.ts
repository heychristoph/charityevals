// Writes `domain` (what kind of number it is: share, percent, ratio, positive, signed) on every input row
// of every model and every shared fact that doesn't state one, and `domain: share` on a calculated row
// `1 - x` (docs/normalization.md 2.18, INV-27). A stated kind is never changed. The files' own layout is
// kept: the field goes in after the row's id.
//   npx tsx scripts/domains.ts           write
//   npx tsx scripts/domains.ts --check   fail if a file would change
//   npx tsx scripts/domains.ts --table   print each new kind with its row
//
// How a kind is told, in order: a formula takes 1 minus it (a share; `1 - x / 100`, a percent); a formula
// takes its distance from 1 (a ratio: `rate × rr − rate`, `x − 1`; not a count or a year); a percentage
// format (0–1 a share, below 0 signed); below 0 anywhere (signed); between 0 and 1 a share unless its unit
// or label names an amount (a cost, years, tonnes, a count per person) and no share (an adjustment, a rate); else positive.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { assumptionValues, buildLibrary, compute, pickValue } from "../src/engine/model";
import { complementUses, fits, ratioUses, type Domain } from "../src/engine/domains";

const root = join(import.meta.dirname, "..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const check = process.argv.includes("--check"), table = process.argv.includes("--table");

const modelPaths = walk(join(root, "models"));
const factPaths = walk(join(root, "facts"));
const lib = buildLibrary(
  modelPaths.map(read), read(join(root, "assumptions/default.json")), factPaths.map(read),
  walk(join(root, "charities")).map(read), read(join(root, "owners.json")),
);
const av = assumptionValues(lib.assumptions);

/** An amount, not a share, by its unit or label. */
const AMOUNT = /(\bcosts?\b|\bprices?\b|\$|\busd\b|\bdollars?\b|\bper dollar\b|\bunits of value\b|\bvalue (generated|per)\b|\bratio of\b|\byears?\b|\bmonths?\b|\bweeks?\b|\bdays?\b|\bhours?\b|\btonnes?\b|\bt co|co₂|co2|\bkg\b|\bmwh\b|\bkwh\b|\bwellbys?\b|\bdalys?\b|\bqalys?\b|\bpoints\b|\bstandard deviations?\b|\bsds?\b|\belasticity\b|\bincome\b|\bconsumption\b|\bwages?\b|\bper (person|participant|patient|child|household|survivor|family|recipient|beneficiary|animal|hen|fish|ad|click|member|student|woman|girl|case|visit|session|treatment)\b)/i;
/** A share by its label, whatever else the label names (an adjustment for programme costs is a share). */
const SHARE_WORDS = /\b(adjustments?|validity|discount|efficacy|effectiveness|probability|chance|share|proportion|percent(age)?|fraction|coverage|rate|risk|prevalence|incidence|likelihood|retention|adherence|compliance|uptake|weight)\b/i;
const SHARE_UNIT = /%|share|probab|fraction|proportion|chance|rate/i;

type RowLike = { id: string; label?: string; unit?: string; format?: string; value?: unknown; formula?: string; domain?: string; published?: unknown };

function ends(v: unknown): number[] {
  if (v === undefined) return [];
  const out = [pickValue(v as never)];
  if (typeof v === "object" && v) out.push(pickValue(v as never, "low"), pickValue(v as never, "high"));
  return out.filter(Number.isFinite);
}

function kindOf(r: RowLike, uses: { share: boolean; percent: boolean; ratio: boolean }): Domain {
  const xs = [...ends(r.value), ...ends(r.published)], best = xs[0];
  const amount = !(SHARE_WORDS.test(r.label ?? "") && !(r.unit && !SHARE_UNIT.test(r.unit))) && AMOUNT.test(`${r.label ?? ""} ${r.unit ?? ""}`);
  // A number a formula takes 1 minus that isn't between 0 and 1 (1 − 1.2) is a signed adjustment.
  if (uses.percent) return fits("percent", ...xs) ? "percent" : "signed";
  if (uses.share) return fits("share", ...xs) ? "share" : "signed";
  if (xs.some((x) => x < 0)) return "signed";
  if (uses.ratio && best !== 1 && !amount && fits("ratio", ...xs)) return "ratio";
  if (r.format === "percent") return fits("share", ...xs) ? "share" : "positive";
  // A number in dollars is an amount, whatever its label says ("Grant size", "Training").
  if (r.format === "usd") return "positive";
  // A point 0 or 1 is a share only by its label (a count of 0 people, a month flag of 1 are not).
  if ((best === 0 || best === 1) && typeof r.value !== "object" && !SHARE_WORDS.test(r.label ?? "")) return "positive";
  if (fits("share", ...xs) && !(r.unit && !SHARE_UNIT.test(r.unit)) && !amount) return "share";
  return "positive";
}

/** The file's text with `"domain": kind` after row `id`'s id, in the file's own layout. */
function insert(text: string, id: string, kind: string, from: number): string {
  const re = new RegExp(`"id"\\s*:\\s*"${id}"\\s*,`, "g");
  re.lastIndex = from;
  const m = re.exec(text);
  if (!m) throw new Error(`row ${id} not found`);
  const after = m.index + m[0].length;
  const nl = /^[ \t]*\n([ \t]*)/.exec(text.slice(after));
  const add = nl ? `\n${nl[1]}"domain": "${kind}",` : ` "domain": "${kind}",`;
  return text.slice(0, after) + add + text.slice(after);
}

const changes: string[] = [];
let failed = false;
function writeFile(path: string, before: string, after: string) {
  if (after === before) return;
  JSON.parse(after);
  if (check) { failed = true; console.error(`${relative(root, path)} would change`); }
  else writeFileSync(path, after);
}

// --- Facts: how any model uses them --------------------------------------------------------------------
const factUse = new Map<string, { share: boolean; percent: boolean; ratio: boolean }>();
const useOf = (key: string) => factUse.get(key) ?? (factUse.set(key, { share: false, percent: false, ratio: false }), factUse.get(key)!);
const models = [...lib.models.values()];
for (const m of models) {
  const u = complementUses(m);
  for (const x of u.share) if (x.startsWith("@")) useOf(x.slice(1)).share = true;
  for (const x of u.percent) if (x.startsWith("@")) useOf(x.slice(1)).percent = true;
}
const factRatio = new Set(models.flatMap((m) => [...ratioUses(m)].filter((x) => x.startsWith("@")).map((x) => x.slice(1))));
for (const path of factPaths) {
  const raw = read(path), text = readFileSync(path, "utf8");
  let next = text;
  const rowsAt = text.indexOf('"rows"');
  for (const r of (raw.rows ?? []) as RowLike[]) {
    if (r.domain || r.value === undefined || r.format === "toggle") continue;
    const key = `${raw.id}.${r.id}`;
    const kind = kindOf(r, { ...(factUse.get(key) ?? { share: false, percent: false }), ratio: factRatio.has(key) });
    next = insert(next, r.id, kind, rowsAt);
    if (table) changes.push(`${kind}\t@${key}\t${r.label}`);
  }
  writeFile(path, text, next);
}

// --- Models: each file's own rows ----------------------------------------------------------------------
for (const path of modelPaths) {
  const raw = read(path), text = readFileSync(path, "utf8");
  const m = lib.models.get(raw.id);
  if (!m) continue;
  const own = ((raw.rows ?? []) as (RowLike | string)[]).filter((r): r is RowLike => typeof r === "object" && !!r.id);
  const uses = complementUses(m);
  const ratio = ratioUses(m);
  let values: Record<string, number> = {};
  try { values = compute(lib, m, av); } catch { /* a model that doesn't compute keeps its inputs' kinds from the rows alone */ }
  let next = text;
  const rowsAt = text.indexOf('"rows"');
  for (const r of own) {
    // A variant's patch reads with its parent's row; a kind it inherits stays the parent's.
    const full: RowLike = { ...(m.byId.get(r.id) as RowLike | undefined), ...r };
    if (full.domain || full.format === "toggle") continue;
    let kind: Domain | undefined;
    if (r.value !== undefined) kind = kindOf(full, { share: uses.share.has(r.id), percent: uses.percent.has(r.id), ratio: ratio.has(r.id) });
    else if (r.formula !== undefined) {
      const n = m.byId.get(r.id)?.node;
      if (n?.type === "bin" && n.op === "-" && n.left.type === "num" && n.left.value === 1 && values[r.id] >= 0 && values[r.id] <= 1) kind = "share";
    }
    if (!kind) continue;
    next = insert(next, r.id, kind, rowsAt);
    if (table) changes.push(`${kind}\t${raw.id}.${r.id}\t${full.label}\t${full.unit ?? ""}\t${JSON.stringify(full.value)}`);
  }
  writeFile(path, text, next);
}
if (table) console.log(changes.join("\n"));
if (failed) process.exit(1);
