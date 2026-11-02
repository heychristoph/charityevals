#!/usr/bin/env python3
"""Writes the shared moved-money rows (docs/normalization.md 2.8) into a meta model, word for word,
in their own section, from src/engine/moved-money.ts (via scripts/moved-money.ts). Rows already there
are replaced; the model's other rows are left alone (rewire them by hand to read moved_dollar_value or
moved_dollar_net_value). INV-12 checks the result.

    python3 scripts/moved-money.py <model.json> <global-health|livelihoods|tlycs> [net]
"""
import json
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
path, scope, *rest = sys.argv[1:]
shared = json.loads(subprocess.run(["npx", "tsx", str(root / "scripts/moved-money.ts"), scope, *rest],
                                   cwd=root, check=True, capture_output=True, text=True).stdout)
text = Path(path).read_text()
indent = 1 if '\n "id"' in text else 2
m = json.loads(text)
ids = {r["id"] for r in shared["rows"]}
kept = [r for r in m["rows"] if r["id"] not in ids]
# Before the first row that reads them, so the file reads top to bottom; the section before that
# row's section.
first = next((i for i, r in enumerate(kept) if any(f"{x}" in (r.get("formula") or "").replace("(", " ").replace(")", " ").replace(",", " ").split() for x in ids)), len(kept))
kept[first:first] = shared["rows"]
m["rows"] = kept
sections = [s for s in m["sections"] if s["id"] != shared["section"]["id"]]
reader = kept[first + len(shared["rows"])].get("section") if first + len(shared["rows"]) < len(kept) else None
at = next((i for i, s in enumerate(sections) if s["id"] == reader), len(sections))
sections[at:at] = [shared["section"]]
m["sections"] = sections
Path(path).write_text(json.dumps(m, indent=indent, ensure_ascii=False) + "\n")
print(f"{m['id']}: {len(shared['rows'])} shared rows ({scope}{', net' if rest else ''})")
