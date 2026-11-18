"""Rule spending-weighted-means (owner, 18 Nov 2026): `#spending:<charity>` lets a formula weigh charities by their
programme spending (no spending on record: the cause's median); Ambitious Impact's average of the charities it launched
uses it. MODE (env) picks the `#cause:x` statistic: equal (unchanged), median or trimmed (10% each end)."""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def rep(path, old, new):
    p = ROOT / path
    s = p.read_text()
    assert old in s, (path, old[:70])
    p.write_text(s.replace(old, new, 1))

# --- ranking.ts: spending weights (spendingOf), and the cause mean by MODE (equal | median | trimmed) ------
import os
MODE = os.environ.get("MODE", "equal")
rep("src/engine/ranking.ts", "const causes = new WeakMap<Library, Map<string, [owner: string, charity: string][]>>();",
"""const causes = new WeakMap<Library, Map<string, [owner: string, charity: string][]>>();
const medians = new WeakMap<Library, Map<string, number>>();

/** A charity's weight in a mean over charities (`#spending:<charity>`): its programme spending in USD
 * (`spending.programme`), or, where its record has none, the median of its cause's records. */
export function spendingOf(lib: Library, charity: string): number {
  const c = lib.charities.get(charity);
  if (!c) return NaN;
  if (c.spending?.programme) return c.spending.programme;
  let cache = medians.get(lib);
  if (!cache) medians.set(lib, (cache = new Map()));
  if (!cache.has(c.cause)) {
    const xs = [...lib.charities.values()].filter((x) => x.cause === c.cause && x.spending?.programme).map((x) => x.spending!.programme).sort((a, b) => a - b);
    const mid = xs.length >> 1;
    cache.set(c.cause, xs.length ? (xs.length % 2 ? xs[mid] : (xs[mid - 1] + xs[mid]) / 2) : NaN);
  }
  return cache.get(c.cause)!;
}""")
if MODE != "equal":
    old_ret = "  return figures.length ? figures.reduce((s, v) => s + v, 0) / figures.length : NaN;"
    if MODE == "median":
        new_ret = """  const xs = figures.filter(Number.isFinite).sort((a, b) => a - b);
  const mid = xs.length >> 1;
  return xs.length ? (xs.length % 2 ? xs[mid] : (xs[mid - 1] + xs[mid]) / 2) : NaN;"""
        doc = "The median of a cause's charities at their figures on the rankings (`#cause:x`)"
    else:
        new_ret = """  const xs = figures.filter(Number.isFinite).sort((a, b) => a - b);
  const cut = Math.floor(xs.length * 0.1);
  const kept = xs.slice(cut, xs.length - cut);
  return kept.length ? kept.reduce((s, v) => s + v, 0) / kept.length : NaN;"""
        doc = "The 10% trimmed mean of a cause's charities at their figures on the rankings (`#cause:x`): the lowest and highest tenth left out"
    rep("src/engine/ranking.ts", old_ret, new_ret)
    rep("src/engine/ranking.ts", "/** The equal-weight mean of a cause's charities at their figures on the rankings (`#cause:x`).", "/** " + doc + ".")

# --- model.ts: the #spending:<charity> reference ---------------------------------------------------------
m = "src/engine/model.ts"
rep(m, """/** `#cause:x`: the equal-weight mean of the ranked charities in a cause or area (ranking.ts causeFigure). */
export const CAUSE_PREFIX = "cause:";
export const isCauseRef = (ref: string) => ref.startsWith(CAUSE_PREFIX);
/** `#owner:charity`: a charity's figure from one evaluator (src/engine/ranking.ts evaluatorFigure). */
export const isCharityRef = (ref: string) => ref.includes(":") && !isCauseRef(ref);""",
"""/** `#cause:x`: the ranked charities in a cause or area, combined (ranking.ts causeFigure). */
export const CAUSE_PREFIX = "cause:";
export const isCauseRef = (ref: string) => ref.startsWith(CAUSE_PREFIX);
/** `#spending:<charity>`: the charity's weight in a mean over charities, its programme spending in USD
 * (ranking.ts spendingOf); a number, not a model's result. */
export const SPENDING_PREFIX = "spending:";
export const isSpendingRef = (ref: string) => ref.startsWith(SPENDING_PREFIX);
/** `#owner:charity`: a charity's figure from one evaluator (src/engine/ranking.ts evaluatorFigure). */
export const isCharityRef = (ref: string) => ref.includes(":") && !isCauseRef(ref) && !isSpendingRef(ref);""")
rep(m, """export function refTargets(lib: Library, ref: string, reader?: string): ResolvedModel[] {
  if (isCauseRef(ref))""", """export function refTargets(lib: Library, ref: string, reader?: string): ResolvedModel[] {
  if (isSpendingRef(ref)) return [];
  if (isCauseRef(ref))""")
rep(m, """  const targets = (d: string, reader?: string): string[] => (isCharityRef(d) || isCauseRef(d) ? refTargets(all, d, reader).map((t) => t.id) : [d]);""",
"""  const targets = (d: string, reader?: string): string[] => (isSpendingRef(d) ? [] : isCharityRef(d) || isCauseRef(d) ? refTargets(all, d, reader).map((t) => t.id) : [d]);""")
rep(m, """      for (const d of r.modelDeps) {
        if (isCauseRef(d)) {""", """      for (const d of r.modelDeps) {
        if (isSpendingRef(d)) {
          if (!charities.has(d.slice(SPENDING_PREFIX.length))) errors.push(`${m.id}.${r.id}: unknown charity #${d}`);
          continue;
        }
        if (isCauseRef(d)) {""")
rep(m, """  const m = cause || isCharityRef(id) ? undefined : lib.models.get(id);
  if ((!m && !cause && !isCharityRef(id)) || computing.has(key)) return NaN;""",
"""  if (isSpendingRef(id)) return spendingOf(lib, id.slice(SPENDING_PREFIX.length));
  const m = cause || isCharityRef(id) ? undefined : lib.models.get(id);
  if ((!m && !cause && !isCharityRef(id)) || computing.has(key)) return NaN;""")
rep(m, 'import { causeFigure, causeModels, evaluatorFigure, evaluatorFigureModels } from "./ranking";',
       'import { causeFigure, causeModels, evaluatorFigure, evaluatorFigureModels, spendingOf } from "./ranking";')

# --- units.ts: a spending reference is dollars -----------------------------------------------------------
rep("src/engine/units.ts", """        // Another model's result: per dollar, in its units.
        return { money: -1, time: 0, scale: 1 };""", """        // A charity's spending (`#spending:<charity>`) is dollars; another model's result is per dollar, in its units.
        if (n.name.startsWith("spending:")) return { money: 1, time: 0, scale: 1 };
        return { money: -1, time: 0, scale: 1 };""")

# --- Ambitious Impact's average of its launched charities: weighted by spending -------------------------
p = ROOT / "models/global-health/ambitious-impact-charityevals.json"
txt = p.read_text()
mod = json.loads(txt)
r = next(x for x in mod["rows"] if x["id"] == "value_destinations")
def weighted(match):
    refs = [x.strip() for x in match.group(1).split(",")]
    charity = lambda ref: ref.split(":")[1]
    num = " + ".join(f"#spending:{charity(x)} * {x}" for x in refs)
    den = " + ".join(f"#spending:{charity(x)}" for x in refs)
    return f"(({num}) / ({den}))"
new_f = re.sub(r"avg\(([^()]*)\)", weighted, r["formula"])
new_e = r["explainer"].replace("equal weights within each cause", "weighted within each cause by each charity's programme spending (a charity with none on record at its cause's median)")
new_e = re.sub(r" Equal weights, not money weights: [^.]*\.", "", new_e)
txt = txt.replace(json.dumps(r["formula"], ensure_ascii=False), json.dumps(new_f, ensure_ascii=False), 1)
txt = txt.replace(json.dumps(r["explainer"], ensure_ascii=False), json.dumps(new_e, ensure_ascii=False), 1)
json.loads(txt)
p.write_text(txt)
w = ROOT / "writeups/ambitious-impact-charityevals.md"
s = w.read_text()
s = s.replace("Charities are weighted equally within each cause, and the causes eight to one, as in the year's launches.",
              "Charities are weighted by their programme spending within each cause, and the causes eight to one, as in the year's launches.")
w.write_text(s)
