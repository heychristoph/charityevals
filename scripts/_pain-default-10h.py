"""Rule pain-default-10h (owner, 18 Nov 2026): a day of disabling pain is as bad as losing 10 hours of healthy life
by default (was 9.6), near GBD's migraine attack (0.441 x 24 h = 10.6 h) and most severe back pain (9.2 h)."""
from pathlib import Path

p = Path(__file__).resolve().parent.parent / "assumptions/default.json"
s = p.read_text()
old = '''      "value": {
        "low": 0.00027,
        "best": 0.0011,
        "high": 0.0027
      },'''
new = '''      "value": {
        "low": 0.00027,
        "best": 0.0011416,
        "high": 0.0027
      },'''
assert s.count(old) == 1, s.count(old)
p.write_text(s.replace(old, new, 1))
