"""Convert a Guesstimate model (its JSON from api.getguesstimate.com/spaces/<id>) into a charityevals model.

    python3 scripts/convert-guesstimate.py space.json --spec spec.json --out models/grants/ace

Guesstimate cells are either distributions ("1.8M to 1.9M", lognormal or normal, read as a 90% interval)
or functions of other cells. Distributions become input rows with a low/best/high range: the best guess
is the interval's median (geometric midpoint for lognormal, midpoint for normal). Functions become
formula rows. Guesstimate itself reports Monte Carlo means, which run higher than these medians when
inputs are skewed, so the central figures here are not expected to match Guesstimate's to the digit.
"""
import argparse, json, math, re
from pathlib import Path

SUFFIX = {"": 1, "K": 1e3, "M": 1e6, "B": 1e9}


def number(s):
    m = re.fullmatch(r"\s*(-?[\d.,]*\d)\s*([KMB]?)\s*", s, re.I)
    if not m: raise ValueError(f"not a number: {s!r}")
    return float(m.group(1).replace(",", "")) * SUFFIX[m.group(2).upper()]


def slug(s, taken):
    base = re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")[:50].strip("_")
    base = base if base and base[0].isalpha() else f"m_{base}"
    i, k = base, 2
    while i in taken: i, k = f"{base}_{k}", k + 1
    taken.add(i); return i


def beta_interval(a, b):
    """Mean and a normal-approximation 90% interval of Beta(a, b), clipped to [0, 1]."""
    mean = a / (a + b)
    sd = math.sqrt(a * b / ((a + b) ** 2 * (a + b + 1)))
    return max(0.0, mean - 1.645 * sd), mean, min(1.0, mean + 1.645 * sd)


def convert(space, spec):
    g = space["graph"]
    metrics = {m["id"]: m for m in g["metrics"]}
    taken, ids = set(), {}
    for m in sorted(g["metrics"], key=lambda m: (m["location"]["row"], m["location"]["column"])):
        ids[m["id"]] = slug(m["name"] or m["readableId"], taken)
    url = f"https://www.getguesstimate.com/models/{space['id']}"
    rows = []
    for gs in g["guesstimates"]:
        m = metrics.get(gs["metric"])
        if not m: continue
        rid, label = ids[m["id"]], m["name"] or m["readableId"]
        expr = (gs.get("expression") or gs.get("input") or "").strip()
        kind = gs.get("guesstimateType")
        src = {"title": f"Guesstimate model {space['id']}", "url": url, "cell": m["readableId"]}
        row = {"id": rid, "label": label, "section": "model"}
        bm = re.fullmatch(r"=?\s*beta\(\s*([\d.]+)\s*,\s*([\d.]+)\s*\)", expr, re.I)
        if bm:
            lo, best, hi = beta_interval(float(bm.group(1)), float(bm.group(2)))
            row.update({"value": {"low": lo, "best": best, "high": hi}, "kind": "judgment", "source": src,
                        "explainer": f"Beta({bm.group(1)}, {bm.group(2)}) in Guesstimate: best guess is its mean, range its 90% interval."})
        elif expr.startswith("="):
            f = re.sub(r"\$\{metric:([0-9a-f-]+)\}", lambda x: ids[x.group(1)], expr[1:])
            if re.search(r"[a-zA-Z_]+\(", re.sub(r"\b(sum|min|max|ln|exp|abs)\(", "", f)): raise SystemExit(f"{rid}: unsupported function in {expr}")
            row["formula"] = " ".join(f.split())
        elif re.search(r"\bto\b", expr):
            a, b = (number(x) for x in re.split(r"\bto\b", expr))
            best = math.sqrt(a * b) if kind == "LOGNORMAL" and a > 0 and b > 0 else (a + b) / 2
            row.update({"value": {"low": a, "best": best, "high": b}, "kind": "judgment", "source": src,
                        "explainer": f"ACE's 90% interval, {expr} ({'lognormal' if kind == 'LOGNORMAL' else 'normal'}). The best guess is its median."})
        elif expr:
            row.update({"value": number(expr), "kind": "estimate", "source": src})
        else:
            continue
        if gs.get("description"): row["explainer"] = (row.get("explainer", "") + "\n\n" + gs["description"]).strip()
        rows.append(row)
    out_id = next(ids[m["id"]] for m in g["metrics"] if m["readableId"] == spec["output"])
    model = {k: spec[k] for k in ("id", "name", "kind", "cause", "charity", "owner") if k in spec}
    model["bulk"] = True
    model.update({k: spec[k] for k in ("summary", "source", "evaluator") if k in spec})
    model.update({"resources": spec.get("resources", []), "sections": [{"id": "model", "title": "Model", "explainer": space.get("description") or ""}],
                  "rows": rows, "output": {"row": out_id, "unit": spec["unit"], "label": spec["label"]}})
    return model


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("space"); ap.add_argument("--spec", required=True); ap.add_argument("--out", required=True)
    a = ap.parse_args()
    spec = json.loads(Path(a.spec).read_text())
    model = convert(json.loads(Path(a.space).read_text()), spec)
    Path(a.out, f"{model['id']}.json").write_text(json.dumps(model, indent=1, ensure_ascii=False) + "\n")
    print(model["id"], len(model["rows"]), "rows")
