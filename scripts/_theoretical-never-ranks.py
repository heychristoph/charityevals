"""Rule theoretical-never-ranks (owner, 18 Nov 2026): a purely theoretical model is shown but never ranked."""
from pathlib import Path

p = Path(__file__).resolve().parent.parent / "docs/normalization.md"
s = p.read_text()
old = """   flagged "purely theoretical" on the model and charity pages, in the model lists and on the rankings (a hollow,
   dashed dot and a caveat)."""
new = """   flagged "purely theoretical" on the model and charity pages and in the model lists, and never ranked
   (decided 2026-11-18: an estimate of an idea says little about the charity running it; `ranks()` in
   src/engine/model.ts leaves it out, and the rankings list such charities as not ranked). A charity with only
   theoretical models gets our own model of its actual work where it has operating data to build one from."""
assert old in s
p.write_text(s.replace(old, new, 1))
