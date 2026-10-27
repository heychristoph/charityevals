"""Links bulk-imported GiveWell models to the shared assumptions and facts, so they work like the
hand-built ones: visitors' moral weights, discount rate and DALY value move them, and data several
sheets share lives once in facts/.

    python3 scripts/link-parameters.py            # all of models/grants/givewell/

Assumptions. In every model:
- a value of averting a death (GiveWell's moral weights) becomes `v * $life_value_multiplier`;
- a value of raising ln(consumption) by one unit becomes `$uov_per_ln_consumption`, scaled when the
  sheet uses several such values;
- a value of averting a YLD/DALY becomes `$uov_per_daly`, scaled the same way;
- the discount rate becomes `$discount_rate`.
The sheet's own values go into the model's `evaluator.assumptions`, so the evaluator view still
reproduces the sheet exactly (`expected` stays on every linked row).

Facts. A real-world statistic (mortality, prevalence, population, consumption, coverage...) with the
same label and value in two or more sheets is data they share: it moves to
facts/givewell_<country>.json (or facts/givewell.json) and the models read it as @file.key. Those files
are rewritten on every run. Inputs that look like judgment calls (adjustments, weights, probabilities)
stay in their models.
"""
import json, re, collections
from pathlib import Path

MODELS = Path("models/grants/givewell")
FACTS = Path("facts")

LIFE = re.compile(r"(value|units? of value|\buov\b|moral (value|weights?)).*\b(deaths?|lives?)\b|\bmoral weights?\b|value assigned to averting (the |a |one )?(\S+ )?death", re.I)
LIFE_NOT = re.compile(r"efficacy|probability|\brate\b|risk|reduction|percent|%|per \$|per dollar|cost per|total|units of value from|averted per|per \d", re.I)
LN = re.compile(r"\bln\b|doublings? (of )?(consumption|income)", re.I)
LN_NOT = re.compile(r"per dollar|per \$|total|from|per person|per child|per household|treatment|increase in ln|effect", re.I)
DALY = re.compile(r"\b(yld|daly|year lived with disab|years? of life lost to disease)", re.I)
DALY_ONLY = re.compile(r"value|averting|\buov\b|units? of value", re.I)
DISC = re.compile(r"^(annual )?discount rate\b", re.I)
DATA = re.compile(r"mortality|death rate|deaths per|prevalence|incidence|population|births?\b|birth rate|fertility|life expectancy|household size|consumption per|income per|gdp|ppp|exchange rate|coverage|stunting|wasting|anemi|malaria (cases|deaths)|under-?5 deaths|daly|yld|burden|enrol+ment|literacy|\d+-\d+ \(|\b\d+\+ \(", re.I)
NOT_DATA = re.compile(r"\bce\b|x cash|cost|effective|units? of value|\buov\b|grant|budget|spend|\$|ratio of untreated|self-report|program|our |intervention", re.I)
GENERIC = re.compile(r"^(input|number|calc|value|values|n/?a|source|sources|notes?|-|total|yes|no|x|\w)$", re.I)
JUDGMENT = re.compile(r"adjust|weight|probab|scenario|risk|guess|\bbar\b|chance|counterfactual|leverage|fung|subjective|\bour\b|\bwe\b|uncertain|discount|crowd|replace|would|best|assum|validity|\bif\b|bottleneck|priorit|fungib|misappropri|monitoring|storage|ineffective|double treatment", re.I)
COUNTRIES = ["Nigeria", "Kenya", "Uganda", "Malawi", "India", "Chad", "Niger", "Burkina Faso", "Mali", "Togo", "Guinea-Bissau", "Guinea",
             "DRC", "Democratic Republic of the Congo", "Cameroon", "Mozambique", "South Sudan", "Ethiopia", "Zambia", "Madagascar", "Liberia",
             "Ghana", "Pakistan", "Bangladesh", "Rwanda", "Benin", "Angola", "Côte d'Ivoire", "Cote d'Ivoire", "Sierra Leone", "Tanzania",
             "Zimbabwe", "Philippines", "Senegal", "Gambia", "Somalia", "Sudan", "Burundi", "Central African Republic", "Congo"]
COUNTRY_ID = {"DRC": "drc", "Democratic Republic of the Congo": "drc", "Côte d'Ivoire": "cote_d_ivoire", "Cote d'Ivoire": "cote_d_ivoire"}


def num(x):
    return repr(float(x)) if not float(x).is_integer() else str(int(x))


def slug(s, n=60):
    s = re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")[:n].strip("_")
    return s if s and s[0].isalpha() else f"f_{s}"


def plain_input(r):
    return isinstance(r.get("value"), (int, float)) and not isinstance(r.get("value"), bool) and "formula" not in r \
        and not r.get("explainer", "").startswith("Calculated in the source sheet")


def link(r, formula, note):
    v = r.pop("value"); r.pop("kind", None)
    r["formula"] = formula; r["expected"] = v
    r["explainer"] = (note + ("\n\n" + r["explainer"] if r.get("explainer") else "")).strip()


def link_assumptions(m):
    rows = m["rows"]
    cat = {}
    for r in rows:
        lab, v = r["label"], r.get("value")
        if plain_input(r):
            if LIFE.search(lab) and not LIFE_NOT.search(lab) and 1 <= v <= 400: cat[r["id"]] = "life"
            elif LN.search(lab) and not LN_NOT.search(lab) and 0.2 <= v <= 3: cat[r["id"]] = "ln"
            elif DALY.search(lab) and DALY_ONLY.search(lab) and not LN_NOT.search(lab) and 0.3 <= v <= 10: cat[r["id"]] = "daly"
            elif DISC.search(lab) and 0 <= v <= 0.15: cat[r["id"]] = "disc"
        elif "formula" in r and r["formula"] != "$discount_rate" and DISC.search(lab) and isinstance(r.get("expected"), (int, float)) and 0 <= r["expected"] <= 0.15:
            cat[r["id"]] = "disc"
    common = {}
    for k in ("ln", "daly", "disc"):
        vals = [r.get("value", r.get("expected")) for r in rows if cat.get(r["id"]) == k]
        if vals: common[k] = collections.Counter(vals).most_common(1)[0][0]
    ev = m.setdefault("evaluator", {"name": "GiveWell", "assumptions": {}})["assumptions"]
    n = 0
    for r in rows:
        k = cat.get(r["id"])
        if not k: continue
        v = r.get("value", r.get("expected"))
        if k == "life":
            link(r, f"{num(v)} * $life_value_multiplier", f"GiveWell's moral weight, {num(v)} units of value, times your multiplier on the value of a life.")
            ev["life_value_multiplier"] = 1
        elif k in ("ln", "daly"):
            a = {"ln": "uov_per_ln_consumption", "daly": "uov_per_daly"}[k]
            E = ev.get(a, common[k])  # an earlier run's value stays: rows linked then depend on it
            f = f"${a}" if v == E else f"{num(v)} * ${a} / {num(E)}"
            link(r, f, f"Linked to the shared assumption `{a}`; GiveWell's sheet uses {num(E)}{'' if v == E else f', and {num(v)} here'}.")
            ev[a] = E
        elif k == "disc":
            if v != ev.get("discount_rate", common["disc"]): continue
            if "formula" in r:
                r["formula"] = "$discount_rate"
                r["explainer"] = (f"Linked to the shared discount rate; GiveWell's sheet adds up its components to {num(v)}.\n\n" + r.get("explainer", "")).strip()
            else:
                link(r, "$discount_rate", f"Linked to the shared discount rate; GiveWell's sheet uses {num(v)}.")
            ev["discount_rate"] = v
        n += 1
    return n


def country_of(label):
    for c in COUNTRIES:
        if re.search(rf"\b{re.escape(c)}\b", label): return COUNTRY_ID.get(c, slug(c)), c.replace("DRC", "Democratic Republic of the Congo")
    return None, None


def main():
    models = {p: json.loads(p.read_text()) for p in sorted(MODELS.glob("*.json"))}
    # Rerunnable: fact links from an earlier run go back to plain inputs before the facts are rebuilt.
    for m in models.values():
        for r in m["rows"]:
            if r.get("formula", "").startswith("@givewell") and "expected" in r:
                r["value"] = r.pop("expected"); r.pop("formula"); r["kind"] = "estimate"
    linked = {p: link_assumptions(m) for p, m in models.items()}
    # Facts: same label and value in two or more models.
    seen = collections.defaultdict(list)
    for p, m in models.items():
        for r in m["rows"]:
            if not plain_input(r): continue
            lab, v = r["label"].strip(), r["value"]
            if v in (0, 1) or GENERIC.match(lab) or len(lab) < 6 or "!" in lab or lab.startswith("-") or JUDGMENT.search(lab): continue
            if not DATA.search(lab) or NOT_DATA.search(lab): continue
            seen[(lab, v)].append((p, r))
    files = {}
    for (lab, v), uses in sorted(seen.items(), key=lambda x: (x[0][0], x[0][1])):
        if len({p for p, _ in uses}) < 2: continue
        cid, cname = country_of(lab)
        fid = f"givewell_{cid}" if cid else "givewell"
        f = files.setdefault(fid, {"id": fid, "label": f"{cname} (GiveWell's data)" if cid else "Shared GiveWell inputs", "rows": [], "keys": set()})
        key = slug(lab); k = 2
        while key in f["keys"]: key = f"{slug(lab, 56)}_{k}"; k += 1
        f["keys"].add(key)
        first = uses[0][1]
        names = sorted({models[p]["id"] for p, _ in uses})
        f["rows"].append({"id": key, "label": lab, "value": v, "kind": "estimate",
                          **({"format": first["format"]} if first.get("format") else {}),
                          "source": first.get("source", {"title": "GiveWell"}),
                          "explainer": f"The same number in {len(names)} of GiveWell's sheets: " + ", ".join(names[:12]) + (" and others." if len(names) > 12 else ".")})
        for p, r in uses:
            r.pop("value"); r.pop("kind", None)
            r["formula"] = f"@{fid}.{key}"; r["expected"] = v
    for old in FACTS.glob("givewell*.json"): old.unlink()
    for f in files.values():
        f.pop("keys")
        (FACTS / f"{f['id']}.json").write_text(json.dumps(f, indent=1, ensure_ascii=False) + "\n")
    for p, m in models.items():
        p.write_text(json.dumps(m, indent=1, ensure_ascii=False) + "\n")
    print(f"{sum(1 for n in linked.values() if n)} of {len(models)} models linked to assumptions ({sum(linked.values())} rows);",
          f"{sum(len(f['rows']) for f in files.values())} shared facts in {len(files)} files")


if __name__ == "__main__":
    main()
