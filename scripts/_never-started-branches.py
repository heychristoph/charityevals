"""Rule never-started-branches (18 Nov 2026; docs/normalization.md 2.25): in the catastrophic-risk family the
future is counted branch by branch (`<branch>_future_dalys`), and the branch weights that average the
adjustments (`w_<branch>`) read those rows. Rule never-started-weight marked only their sum
(`future_dalys_averted`), so the weights still counted the future in full while the outcome did not. The mark
moves down to each branch's row: the sum and the weights now read the same weighted figures. The row for the
future's farmed animals reads the branches' own formulas, so the animals' suffering still counts whatever the
weight. Conservation's models have one future row and stay as they are."""
import glob
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOKEN = re.compile(r"(?<![$@.\w])[a-z_][a-z0-9_]*\b(?!\s*\()")


def row_span(lines, row_id):
    idx = [i for i, l in enumerate(lines) if l == f'      "id": "{row_id}",']
    assert len(idx) == 1, (row_id, idx)
    end = idx[0]
    while not lines[end].startswith("    }"):
        end += 1
    return idx[0], end


done = []
for f in sorted(glob.glob(str(ROOT / "models/*/*.json"))):
    text = open(f).read()
    m = json.loads(text)
    byid = {r["id"]: r for r in m["rows"]}
    total = byid.get("future_dalys_averted")
    if not total or not total.get("never_started"):
        continue
    branches = [t for t in TOKEN.findall(total["formula"]) if t.endswith("_future_dalys") and t in byid]
    if not branches:
        continue  # conservation: one future row
    assert set(TOKEN.findall(total["formula"])) == set(branches), (f, total["formula"])
    assert not any(byid[b].get("never_started") for b in branches), f
    lines = text.split("\n")
    # The sum loses the mark...
    start, end = row_span(lines, "future_dalys_averted")
    marks = [i for i in range(start, end) if lines[i].strip().rstrip(",") == '"never_started": true']
    assert len(marks) == 1, (f, marks)
    del lines[marks[0]]
    end -= 1
    lines[end - 1] = lines[end - 1].rstrip().rstrip(",")
    # ...and each branch's row takes it.
    for b in branches:
        s, e = row_span(lines, b)
        last = lines[e - 1]
        assert last.startswith("      ") and not last.startswith("       "), (f, b, last)
        lines[e - 1] = last.rstrip() + ("" if last.rstrip().endswith(",") else ",")
        lines.insert(e, '      "never_started": true')
    text = "\n".join(lines)
    # The future's farmed animals: from the branches' own formulas, so no weight reaches their suffering.
    harm = byid["future_animal_harm"]
    prefix, suffix = f"-({total['formula']}) * ", harm["formula"][len(f"-({total['formula']}) * "):]
    assert harm["formula"] == prefix + suffix and suffix == "$lives_added * $animal_dalys_per_person_year_world", (f, harm["formula"])
    unweighted = TOKEN.sub(lambda t: f"({byid[t.group(0)]['formula']})" if t.group(0) in branches else t.group(0), total["formula"])
    old, new = json.dumps(harm["formula"], ensure_ascii=False), json.dumps(f"-({unweighted}) * {suffix}", ensure_ascii=False)
    assert text.count(f'"formula": {old}') == 1, f
    text = text.replace(f'"formula": {old}', f'"formula": {new}')
    after = {r["id"]: r for r in json.loads(text)["rows"]}
    assert "never_started" not in after["future_dalys_averted"] and all(after[b]["never_started"] is True for b in branches), f
    assert not any(b in TOKEN.findall(after["future_animal_harm"]["formula"]) for b in branches), f
    open(f, "w").write(text)
    done.append(m["id"])
assert len(done) == 26, len(done)
print(f"never-started-branches: the mark moved to the branch rows in {len(done)} models")
