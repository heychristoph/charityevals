"""Rule theoretical-cause-aggregates (follows theoretical-never-ranks, 18 Nov 2026): `#cause:x`, the mean of the
charities on the rankings, leaves out what the rankings leave out, purely theoretical models included."""
from pathlib import Path

p = Path(__file__).resolve().parent.parent / "src/engine/model.ts"
s = p.read_text()
old = "causeFigure(lib, id.slice(CAUSE_PREFIX.length), reader, one, (t) => tooOld(lib, t, av))"
assert old in s
p.write_text(s.replace(old, "causeFigure(lib, id.slice(CAUSE_PREFIX.length), reader, one, (t) => !ranks(lib, t, av))", 1))
