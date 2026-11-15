"""Tag untagged side-effect rows of charityevals' own models (docs/normalization.md 2.16).

  python3 scripts/tag-side-effects.py          # dry run: print what would change
  python3 scripts/tag-side-effects.py --write  # edit the model files in place (text insert, no reformat)

A side-effect row is one whose id ends in unmodelled_benefits_adj, unmodelled_adj or side_effects (the
share of a result that a programme's other effects add or take away, read as 1 + x). It is tagged
`"side_effect": "added"` (an amount or share added to the result; `factor` would be for a row that is
itself a multiplier, and no such row exists among these). Skipped: rows already tagged; rows that
read, or are read by, a tagged row (tagging both would weight twice; the model engine errors); and
the pooled rows that only average tagged rows. Bottom-up: the row nearest the inputs is tagged, so
the rows that pool it are then covered.
"""
import glob, json, re, sys

WRITE = "--write" in sys.argv
PATTERN = re.compile(r"(unmodelled_benefits_adj|unmodelled_adj|side_effects)$")
TOKEN = re.compile(r"(?<![@$.\w])[A-Za-z_]\w*")


def rows_of(m):
    out = []
    def walk(o):
        if isinstance(o, dict):
            if "id" in o and ("formula" in o or "value" in o) and isinstance(o["id"], str):
                out.append(o)
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(m)
    return out


def insert_tag(path, row_id):
    lines = open(path).read().split("\n")
    idx = [i for i, l in enumerate(lines) if l == f'      "id": "{row_id}",' or l == f'      "id": "{row_id}"']
    assert len(idx) == 1, (path, row_id, idx)
    start = idx[0]
    while lines[start] != "    {":
        start -= 1
    end = idx[0]
    while not lines[end].startswith("    }"):
        end += 1
    last = lines[end - 1]
    assert last.startswith("      ") and not last.startswith("       "), (path, row_id, last)
    lines[end - 1] = last.rstrip() + ("" if last.rstrip().endswith(",") else ",")
    lines.insert(end, '      "side_effect": "added"')
    open(path, "w").write("\n".join(lines))


changed = {}
for f in sorted(glob.glob("models/*/*.json")):
    m = json.load(open(f))
    if m.get("owner") != "charityevals":
        continue
    rows = rows_of(m)
    byid = {r["id"]: r for r in rows}
    deps = {r["id"]: {t for t in TOKEN.findall(r.get("formula", "")) if t in byid} for r in rows}
    kids = {i: set() for i in byid}
    for i, ds in deps.items():
        for d in ds:
            kids[d].add(i)

    def closure(i, graph):
        seen, stack = set(), list(graph[i])
        while stack:
            d = stack.pop()
            if d not in seen:
                seen.add(d)
                stack.extend(graph[d])
        return seen

    tagged = {i for i, r in byid.items() if r.get("side_effect")}
    cands = [i for i, r in byid.items() if PATTERN.search(i) and not r.get("side_effect")]
    cands.sort(key=lambda i: len(closure(i, deps)))  # nearest the inputs first
    for i in cands:
        near = (closure(i, deps) | closure(i, kids)) & tagged
        if near:
            print(f"skip   {f}: {i} (read by or reads tagged {sorted(near)[0]}; already weighted)")
            continue
        r = byid[i]
        if "formula" in r and r["formula"].strip() in ("0", "0.0"):
            note = "(value 0)"
        else:
            note = ""
        print(f"tag    {f}: {i} -> added {note}")
        tagged.add(i)
        changed.setdefault(f, []).append(i)

if WRITE:
    for f, ids in changed.items():
        for i in ids:
            insert_tag(f, i)
print(f"{sum(map(len, changed.values()))} rows in {len(changed)} models")
print("models:", " ".join(re.sub(r".*/|\.json$", "", f) for f in changed))
