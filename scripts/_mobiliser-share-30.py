# Credit rule 2.24, step 7: the mobiliser's share defaults to 30%.
import json, pathlib
p = pathlib.Path(__file__).resolve().parent.parent / "assumptions/default.json"
t = p.read_text()
d = json.loads(t)
row = next(r for r in d["rows"] if r["id"] == "mobiliser_share")
assert row["value"]["best"] == 1
old = '"low": 0.05,\n        "best": 1,\n        "high": 1'
assert t.count(old) == 1
p.write_text(t.replace(old, '"low": 0.05,\n        "best": 0.3,\n        "high": 1'))
