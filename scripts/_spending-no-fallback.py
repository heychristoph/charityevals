"""Rule spending-no-fallback (owner, 18 Nov 2026): a charity's spending is never guessed. `#spending:<charity>` needs a
recorded figure (its accounts, or, without published accounts, the annual programme cost its evaluator's model is
built on); buildLibrary reports one without, and `wavg` has no fill."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def rep(path, old, new):
    p = ROOT / path
    s = p.read_text()
    assert old in s, (path, old[:70])
    p.write_text(s.replace(old, new, 1))

rep("src/engine/expr.ts", """  wavg: { arity: [2, 98], fn: wavg, doc: "wavg(w1, x1, w2, x2, ...): mean of the x weighted by the w; a missing weight takes the median of the others" },""",
    """  wavg: { arity: [2, 98], fn: wavg, doc: "wavg(w1, x1, w2, x2, ...): mean of the x weighted by the w" },""")
s = (ROOT / "src/engine/expr.ts").read_text()
start = s.index("/** Weighted mean of pairs (weight, value)")
end = s.index("function median(...a: number[]): number {")
s = s[:start] + """/** Weighted mean of pairs (weight, value). A weight that isn't a positive number makes it NaN: weights are
 * recorded, never filled in. */
function wavg(...a: number[]): number {
  const w = a.filter((_, i) => i % 2 === 0), x = a.filter((_, i) => i % 2 === 1);
  if (w.length !== x.length || w.some((v) => !(Number.isFinite(v) && v > 0))) return NaN;
  const total = w.reduce((s, v) => s + v, 0);
  return w.reduce((s, v, i) => s + v * x[i], 0) / total;
}

""" + s[end:]
(ROOT / "src/engine/expr.ts").write_text(s)

rep("src/engine/ranking.ts", """/** A charity's weight in a mean over charities (`#spending:<charity>`): its programme spending in USD
 * (`spending.programme`), or NaN where its record has none (`wavg` then gives it the median of the others). */""",
    """/** A charity's weight in a mean over charities (`#spending:<charity>`): its programme spending in USD
 * (`spending.programme`); NaN where its record has none, which buildLibrary reports. */""")
rep("src/engine/model.ts", """          if (!charities.has(d.slice(SPENDING_PREFIX.length))) errors.push(`${m.id}.${r.id}: unknown charity #${d}`);""",
    """          const c = charities.get(d.slice(SPENDING_PREFIX.length));
          if (!c) errors.push(`${m.id}.${r.id}: unknown charity #${d}`);
          else if (!c.spending?.programme) errors.push(`${m.id}.${r.id}: #${d} has no spending on record (charities/${c.id}.json): record it, from its accounts or its evaluator's model, never a guess`);""")
rep("src/engine/schema.ts", """    /** What the charity spends on its programmes, from its accounts: the total its lines are part of. */""",
    """    /** What the charity spends on its programmes in a year: from its accounts, or, for a charity without
     * published accounts, the annual programme cost its evaluator's model is built on (named in `source`).
     * Never an average or a guess. The total its lines are part of. */""")
rep("docs/normalization.md", """in `wavg(w1, x1, w2, x2, ...)`, where a charity with none on record weighs the median
of the others in the same average (a cause's median would be the large charities': seven young charities
carried 96% of the first try): Ambitious Impact's average of the charities it launched, whose money each
charity spends. A budget or plan is not spending and isn't recorded as it.""",
    """in `wavg(w1, x1, w2, x2, ...)`: Ambitious Impact's average of the charities it launched, whose money each
charity spends. Spending is recorded, never guessed: from the charity's accounts, or, without published
accounts, the annual programme cost its evaluator's model is built on (the source names model and row).
A reference to a charity with none is an error (a first try filled them with a cause median: seven young
charities carried 96% of the weight).""")
rep("models/global-health/ambitious-impact-charityevals.json", "(a charity with none on record at the median of the others)",
    "(from its accounts, or its evaluator's model where it has none published)")

# Clear Solutions and ACTRA: no spending published and no annual cost in any evaluator's model -> out of the
# weighted average, with the charities that have no figure here (valued at the average of their cause).
import json
p = ROOT / "models/global-health/ambitious-impact-charityevals.json"
txt = p.read_text()
mod = json.loads(txt)
r = next(x for x in mod["rows"] if x["id"] == "value_destinations")
f = r["formula"]
for pair in ["#spending:clear-solutions, #givewell:clear-solutions, ", "#spending:actra, #hli:actra, "]:
    assert pair in f, pair
    f = f.replace(pair, "", 1)
e = r["explainer"]
for old, new in [(", Clear Solutions and Spiro; the Happier Lives Institute for ACTRA;", " and Spiro;"),
                 ("Its charities without a model here (", "Its charities without a model or spending figure here (Clear Solutions and ACTRA, whose spending no account or evaluator's model gives; ")]:
    assert old in e, old
    e = e.replace(old, new, 1)
txt = txt.replace(json.dumps(r["formula"], ensure_ascii=False), json.dumps(f, ensure_ascii=False), 1)
txt = txt.replace(json.dumps(r["explainer"], ensure_ascii=False), json.dumps(e, ensure_ascii=False), 1)
json.loads(txt)
p.write_text(txt)
rep("writeups/ambitious-impact-charityevals.md", "That is GiveWell's figure for ten of them, including Suvita, Family Empowerment Media, Fortify Health, Ansh and Taimaka. ACTRA is the Happier Lives Institute's, Learning Alliance,",
    "That is GiveWell's figure for nine of them, including Suvita, Family Empowerment Media, Fortify Health, Ansh and Taimaka. Learning Alliance,")
rep("writeups/ambitious-impact-charityevals.md", "Charities are weighted by their programme spending within each cause,",
    "Clear Solutions and ACTRA publish no spending, and no evaluator's model gives a yearly cost, so they count with the charities without a figure here. Charities are weighted by their programme spending within each cause,")
