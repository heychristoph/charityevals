"""Rule api-import-cost (18 Nov 2026): normalization.md 2.21 said Animal Policy International's import rules have no
cost analysis; our model of its work now carries the EU cage-free egg-import cost (facts/compliance_costs.json)."""
from pathlib import Path

p = Path(__file__).resolve().parent.parent / "docs/normalization.md"
s = p.read_text()
old = """The puppy-mill laws, the UK dog import law and
Animal Policy International's proposed import ban have no analysis giving a cost (one explainer line each)."""
new = """The puppy-mill laws and the UK dog import law have
no analysis giving a cost (one explainer line each); Animal Policy International's import rules carry the EU cage-free
egg-import cost (facts/compliance_costs.json)."""
assert old in s
p.write_text(s.replace(old, new, 1))
