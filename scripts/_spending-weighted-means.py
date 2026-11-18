"""Rule spending-weighted-means (owner, 18 Nov 2026): a mean over charities weighs each by its programme spending,
not equally: `#cause:x` (ranking.ts causeFigure), and `#spending:<charity>` lets a formula do the same (Ambitious
Impact's average of the charities it launched). A charity with no spending on record weighs its cause's median."""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def rep(path, old, new):
    p = ROOT / path
    s = p.read_text()
    assert old in s, (path, old[:70])
    p.write_text(s.replace(old, new, 1))

# --- ranking.ts: spending weights and the weighted cause mean -------------------------------------------
rep("src/engine/ranking.ts", "const causes = new WeakMap<Library, Map<string, [owner: string, charity: string][]>>();",
"""const causes = new WeakMap<Library, Map<string, [owner: string, charity: string][]>>();
const medians = new WeakMap<Library, Map<string, number>>();

/** A charity's weight in a mean over charities (`#cause:x`, `#spending:<charity>`): its programme spending in
 * USD (`spending.programme`), or, where its record has none, the median of its cause's records.
 * docs/normalization.md 2.8. */
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
rep("src/engine/ranking.ts", """/** The equal-weight mean of a cause's charities at their figures on the rankings (`#cause:x`).""",
"""/** The spending-weighted mean of a cause's charities at their figures on the rankings (`#cause:x`): each
 * charity weighs its programme spending (spendingOf).""")
rep("src/engine/ranking.ts", """  const figures = causeMembers(lib, cause, reader).flatMap(([o, c]) => {
    if (!hidden) return [evaluatorFigure(lib, o, c, figure)];
    const shown = plansOf(lib, c).map((e) => e.parts.filter((p) => !hidden(p.model))).find((parts) => parts.length);
    return shown ? [partsFigure(lib, c, shown, figure)] : [];
  });
  return figures.length ? figures.reduce((s, v) => s + v, 0) / figures.length : NaN;""",
"""  const figures = causeMembers(lib, cause, reader).flatMap(([o, c]): [v: number, w: number][] => {
    if (!hidden) return [[evaluatorFigure(lib, o, c, figure), spendingOf(lib, c)]];
    const shown = plansOf(lib, c).map((e) => e.parts.filter((p) => !hidden(p.model))).find((parts) => parts.length);
    return shown ? [[partsFigure(lib, c, shown, figure), spendingOf(lib, c)]] : [];
  });
  const total = figures.reduce((s, [, w]) => s + w, 0);
  return figures.length && total > 0 ? figures.reduce((s, [v, w]) => s + v * w, 0) / total : NaN;""")

# --- model.ts: the #spending:<charity> reference ---------------------------------------------------------
m = "src/engine/model.ts"
rep(m, """/** `#cause:x`: the equal-weight mean of the ranked charities in a cause or area (ranking.ts causeFigure). */
export const CAUSE_PREFIX = "cause:";
export const isCauseRef = (ref: string) => ref.startsWith(CAUSE_PREFIX);
/** `#owner:charity`: a charity's figure from one evaluator (src/engine/ranking.ts evaluatorFigure). */
export const isCharityRef = (ref: string) => ref.includes(":") && !isCauseRef(ref);""",
"""/** `#cause:x`: the spending-weighted mean of the ranked charities in a cause or area (ranking.ts causeFigure). */
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
