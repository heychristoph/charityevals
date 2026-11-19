"""Rule never-started-weight (owner, 18 Nov 2026; issue 33; docs/normalization.md 2.25): the good in lives that
never start counts times one slider, "Lives that never start count ... %" ($never_started_weight, default 0%);
the suffering in them always counts. A second slider, "An animal's pain-free time counts as ... % good"
($pain_free_time_good, default 0%), is offered only while the first is above 0%. Future generations, until now
counted in full and weighed by the discount rate alone, are the first rows marked `never_started`: every
model's `future_dalys_averted` (the catastrophic-risk family and conservation's pandemic branch). The discount
rate is time preference only; the Long-run value set sets the new weight to 100%."""
import glob
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def edit(path, pairs):
    p = ROOT / path
    s = p.read_text()
    for old, new in pairs:
        assert s.count(old) == 1, (path, old[:70], s.count(old))
        s = s.replace(old, new, 1)
    json.loads(s)
    p.write_text(s)


J = lambda x: json.dumps(x, ensure_ascii=False)

# --- The two sliders, the discount rate's explainer and the Long-run value set -------------------------------
NEVER = '''    {
      "id": "never_started_weight",
      "section": "distance",
      "label": "Lives that never start count … %",
      "technical": "Weight on the good in lives the work adds or prevents (rows marked never_started: future generations, births averted, animals never bred); the suffering in such lives always counts; the evaluator view counts none unless the evaluator did (docs/normalization.md 2.25)",
      "format": "percent",
      "value": {
        "low": 0,
        "best": 0,
        "high": 1
      },
      "kind": "judgment",
      "explainer": ''' + J("Some work changes how many people or animals ever live: generations a catastrophe would prevent, births averted, animals never bred. This says how much the good years of such lives count. The suffering in them always counts.\n\nThe default, 0%, counts only the suffering. At 100% their good years count like anyone's.") + '''
    },
'''
PAIN_FREE = '''    {
      "id": "pain_free_time_good",
      "section": "animals",
      "shown_when": "never_started_weight",
      "label": "An animal's pain-free time counts as … % good",
      "technical": "Share of an animal's time free of pain counted as good time, a healthy day at the species' weight; read only by the good of animal lives that never start (docs/normalization.md 2.25)",
      "format": "percent",
      "value": {
        "low": 0,
        "best": 0,
        "high": 1
      },
      "kind": "judgment",
      "explainer": ''' + J("Research measures animals' pain, not how good the rest of their time is. This says how much of an animal's pain-free time counts as good, like a healthy day. It matters only for animals that would never live.\n\nThe default, 0%, treats pain-free time as neither good nor bad.") + '''
    },
'''
p = ROOT / "assumptions/default.json"
s = p.read_text()
old = '"explainer": "How much less good done a year from now counts than the same good today, compounding each year. It is also how much future generations count: the lower it is, the more the future counts.\\n\\nThe default, 4%, is what most charity evaluators use. At 0.1%, the lowest, people centuries from now count almost as much as people today."\n    },\n'
assert s.count(old) == 1, s.count(old)
s = s.replace(old, '"explainer": "How much less good done a year from now counts than the same good today, compounding each year.\\n\\nThe default, 4%, is what most charity evaluators use. At 0.1%, the lowest, good done centuries from now counts almost as much as good done today."\n    },\n' + NEVER, 1)
at = s.index('"id": "daly_per_sad"')
nxt = s.index("\n    {\n", at) + 1
s = s[:nxt] + PAIN_FREE + s[nxt:]
old = '''"about": "Good done in the future counts almost as much as good done today: 0.1% less a year, not 4%.",
      "values": {
        "discount_rate": 0.001
      }'''
assert s.count(old) == 1, s.count(old)
s = s.replace(old, '''"about": "The future counts almost as much as today: good done later 0.1% less a year, not 4%, and lives that never start in full.",
      "values": {
        "discount_rate": 0.001,
        "never_started_weight": 1
      }''', 1)
rows = json.loads(s)["rows"]
ids = [r["id"] for r in rows]
assert ids.index("never_started_weight") == ids.index("discount_rate") + 1 and ids.index("pain_free_time_good") == ids.index("daly_per_sad") + 1, ids
p.write_text(s)

# --- The shared figure's explainer --------------------------------------------------------------------------
p = ROOT / "facts/catastrophe.json"
s = p.read_text()
old = "(your discount rate is how much future generations count)"
if old in s:
    s = s.replace(old, "(discounted at your rate, and counted times your weight on lives that never start)")
    json.loads(s)
    p.write_text(s)

# --- Every model's future generations row is the good of lives that never start ------------------------------
WORDING = [
    ("How much future generations count is your discount rate.", "These are lives that never start: the outcome counts them times your weight on such lives (docs/normalization.md 2.25)."),
    ("discounted at the shared rate: your discount rate is how much future generations count.", "discounted at the shared rate. These are lives that never start: the outcome counts them times your weight on such lives (docs/normalization.md 2.25)."),
]
marked = 0
for f in sorted(glob.glob(str(ROOT / "models/*/*.json"))):
    text = open(f).read()
    m = json.loads(text)
    rows = {r["id"]: r for r in m["rows"]}
    if "future_dalys_averted" not in rows:
        continue
    assert not rows["future_dalys_averted"].get("never_started"), f
    readers = [r["id"] for r in m["rows"] if "future_dalys_averted" in r.get("formula", "") and r["id"] != "future_dalys_averted"]
    assert readers == ["dalys_direct"], (f, readers)
    lines = text.split("\n")
    idx = [i for i, l in enumerate(lines) if l == '      "id": "future_dalys_averted",']
    assert len(idx) == 1, (f, idx)
    end = idx[0]
    while not lines[end].startswith("    }"):
        end += 1
    last = lines[end - 1]
    assert last.startswith("      ") and not last.startswith("       "), (f, last)
    lines[end - 1] = last.rstrip() + ("" if last.rstrip().endswith(",") else ",")
    lines.insert(end, '      "never_started": true')
    text = "\n".join(lines)
    for old, new in WORDING:
        text = text.replace(old, new)
    after = json.loads(text)
    assert {r["id"]: r for r in after["rows"]}["future_dalys_averted"]["never_started"] is True
    open(f, "w").write(text)
    marked += 1
assert marked == 31, marked
print(f"never-started-weight: two sliders added; future_dalys_averted marked in {marked} models")
