"""Rule spending-weights-fallback (18 Nov 2026, follows spending-weighted-means): a charity with no spending on record
weighs the median of the others in the same weighted average, not its cause's median (the cause's records are
mostly large charities, so seven young ones carried 96% of Ambitious Impact's average). `#spending:<charity>` is the
record or nothing; `wavg(w1, x1, w2, x2, ...)` takes the weights and fills a missing one."""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def rep(path, old, new):
    p = ROOT / path
    s = p.read_text()
    assert old in s, (path, old[:70])
    p.write_text(s.replace(old, new, 1))

# ranking.ts: #spending is the record, or nothing
s = (ROOT / "src/engine/ranking.ts").read_text()
start = s.index("const medians = new WeakMap<Library, Map<string, number>>();")
end = s.index("return cache.get(c.cause)!;\n}") + len("return cache.get(c.cause)!;\n}")
s = s[:start] + """/** A charity's weight in a mean over charities (`#spending:<charity>`): its programme spending in USD
 * (`spending.programme`), or NaN where its record has none (`wavg` then gives it the median of the others). */
export function spendingOf(lib: Library, charity: string): number {
  return lib.charities.get(charity)?.spending?.programme ?? NaN;
}""" + s[end:]
(ROOT / "src/engine/ranking.ts").write_text(s)

# expr.ts: wavg
rep("src/engine/expr.ts", """  median: { arity: [1, 99], fn: median, doc: "median of arguments" },""",
"""  median: { arity: [1, 99], fn: median, doc: "median of arguments" },
  wavg: { arity: [2, 98], fn: wavg, doc: "wavg(w1, x1, w2, x2, ...): mean of the x weighted by the w; a missing weight takes the median of the others" },""")
rep("src/engine/expr.ts", "function median(...a: number[]): number {", """/** Weighted mean of pairs (weight, value); a weight that isn't a positive number takes the median of the
 * others (all missing: equal weights). */
function wavg(...a: number[]): number {
  const w = a.filter((_, i) => i % 2 === 0), x = a.filter((_, i) => i % 2 === 1);
  if (w.length !== x.length) return NaN;
  const known = w.filter((v) => Number.isFinite(v) && v > 0);
  const fill = known.length ? median(...known) : 1;
  const ws = w.map((v) => (Number.isFinite(v) && v > 0 ? v : fill));
  const total = ws.reduce((s, v) => s + v, 0);
  return ws.reduce((s, v, i) => s + v * x[i], 0) / total;
}

function median(...a: number[]): number {""")

# units.ts: wavg has its values' unit
rep("src/engine/units.ts", """          case "min": case "max": case "sum": case "avg": case "median": case "iferror": return fold(args);""",
"""          case "min": case "max": case "sum": case "avg": case "median": case "iferror": return fold(args);
          case "wavg": return fold(args.filter((_, i) => i % 2 === 1));""")

# tree.ts: its label
rep("src/engine/tree.ts", 'median: "the median",', 'median: "the median", wavg: "the weighted average",')

# Ambitious Impact: Σ(#spending × x) / Σ #spending  ->  wavg(#spending, x, ...)
p = ROOT / "models/global-health/ambitious-impact-charityevals.json"
txt = p.read_text()
mod = json.loads(txt)
r = next(x for x in mod["rows"] if x["id"] == "value_destinations")
def to_wavg(m):
    pairs = re.findall(r"#spending:[a-z0-9-]+ \* (#[a-z-]+:([a-z0-9-]+))", m.group(1))
    return "wavg(" + ", ".join(f"#spending:{c}, {ref}" for ref, c in pairs) + ")"
new_f = re.sub(r"\(\(((?:#spending:[a-z0-9-]+ \* #[a-z-]+:[a-z0-9-]+(?: \+ )?)+)\) / \((?:#spending:[a-z0-9-]+(?: \+ )?)+\)\)", to_wavg, r["formula"])
assert new_f != r["formula"] and "wavg(" in new_f, new_f[:200]
new_e = r["explainer"].replace("(a charity with none on record at its cause's median)", "(a charity with none on record at the median of the others)")
txt = txt.replace(json.dumps(r["formula"], ensure_ascii=False), json.dumps(new_f, ensure_ascii=False), 1)
txt = txt.replace(json.dumps(r["explainer"], ensure_ascii=False), json.dumps(new_e, ensure_ascii=False), 1)
json.loads(txt)
p.write_text(txt)

# docs/normalization.md 2.8
rep("docs/normalization.md", """a formula weighs them by
`#spending:<charity>`, the charity's programme spending in USD (`spending.programme`; none on record: its
cause's median; ranking.ts `spendingOf`): Ambitious Impact's average of the charities it launched, whose
money each charity spends.""", """a formula weighs them by
`#spending:<charity>`, the charity's programme spending in USD from its accounts (`spending.programme`,
ranking.ts `spendingOf`), in `wavg(w1, x1, w2, x2, ...)`, where a charity with none on record weighs the median
of the others in the same average (a cause's median would be the large charities': seven young charities
carried 96% of the first try): Ambitious Impact's average of the charities it launched, whose money each
charity spends. A budget or plan is not spending and isn't recorded as it.""")
