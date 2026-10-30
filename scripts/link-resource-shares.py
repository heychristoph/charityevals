"""Links GiveWell's leverage and funging adjustments to the shared `resource_shares` toggle.

    python3 scripts/link-resource-shares.py           # rewrite every GiveWell model
    python3 scripts/link-resource-shares.py --dry-run # list what would change

GiveWell adjusts each grant for the money it pulls in from other funders (leverage) or pushes
elsewhere (funging), counting what that money would have done otherwise. With credit shared by share
of resources instead, each funder gets the share of the outcome its money paid for: the adjustment is
off and the value per dollar is GiveWell's own figure before leverage and funging, per dollar of all
spending.

Sharing by resources sets each adjustment to "none": 0 where the sheet adds it to 1, 1 where it multiplies.

An adjustment row is an input or calculation whose label names the adjustment itself ("adjustment
for leverage", "crowding funding out of the program", "leverage and funging adjustment for
counterfactual impact estimates"). Rows that only carry a total before or after the adjustment are
left alone: zeroing the adjustment carries through them. Within-organisation fungibility is the
charity's own money moving between its programs, not other funders', so it stays.

Sheets in GiveWell's newer scenario layout (who would replace the grant, and what their money
would do otherwise) build the adjustment differently in each sheet. Their switch points are picked
by hand in scripts/resource-shares-switches.json: with credit by share of resources, the row becomes GiveWell's own
figure before leverage and funging.

Idempotent: a row already wrapped is skipped. The evaluator view pins resource_shares to 0 so it still
reproduces GiveWell's sheet.
"""
import json, re, sys
from pathlib import Path

DIRS = [Path("models/grants/givewell"), Path("models/global-health")]
ADJ = re.compile(
    r"(adjust\w*|change in value)\b.*\b(leverage|funging|crowding funding)"
    r"|(leverage|funging)\b.*\badjust"
    r"|^\s*(leverage|funging)\s*(&|and|/)\s*(leverage|funging)\s*(\(.*\))?\s*$"
    r"|^\s*adjustment for (leverage|funging)",
    re.I,
)
# Totals carry the adjustment through; bundles mix it with other things, so they stay as they are.
NOT = re.compile(r"within[- ]org|before|after|total|pre[- ]|post[- ]|per dollar|generated|supplemental|update but|broader research", re.I)
WRAP = "if($resource_shares, {neutral}, {value})"
WRAPPED = re.compile(r"^if\(\$resource_shares, (0|1), (.*)\)$", re.S)


def neutral(r):
    """What "no adjustment" is for this row. Most sheets add an adjustment to 1 (−18% is -0.18), so
    none is 0; some multiply by a factor (82% is 0.82), so none is 1. Additive adjustments in these
    sheets never exceed +0.2, factors are never below 0.3."""
    v = r.get("expected", r.get("value"))
    v = v.get("best") if isinstance(v, dict) else v
    return "1" if isinstance(v, (int, float)) and v > 0.2 else "0"


def is_adjustment(r, label=None):
    label = (label or r.get("label") or r["id"]).replace("_", " ")
    return bool(ADJ.search(label)) and not NOT.search(label) and ("value" in r or "formula" in r)


def wrap(m, r, fixed_neutral=None):
    """Switch one adjustment row off when credit is shared by share of resources, keeping its value, range and expected value."""
    pick = (lambda x: fixed_neutral) if fixed_neutral else neutral
    done = WRAPPED.match(r.get("formula", ""))
    if done:
        # Already linked: only make sure "none" is right for the row's kind of adjustment.
        est = next((x for x in m["rows"] if x["id"] == done[2]), None) if done[2].endswith("_estimate") else None
        fixed = WRAP.format(neutral=pick(est or r), value=done[2])
        changed = fixed != r["formula"]
        r["formula"] = fixed
        return changed
    if "formula" in r:
        r["formula"] = WRAP.format(neutral=pick(r), value=f"({r['formula']})")
        return True
    v = r["value"]
    if isinstance(v, dict):
        # A ranged input keeps its range on a sibling row, so sensitivity still varies it.
        est = {k: x for k, x in r.items() if k not in ("id", "formula")}
        est["id"] = f"{r['id']}_estimate"
        est["label"] = f"{r.get('label') or r['id']} (GiveWell's estimate)"
        m["rows"].insert(m["rows"].index(r), est)
        for k in ("value", "kind", "source"):
            r.pop(k, None)
        r["formula"] = WRAP.format(neutral=pick(est), value=est["id"])
    else:
        n = pick(r)
        r.pop("value"); r.pop("kind", None)
        r["formula"] = WRAP.format(neutral=n, value=repr(float(v)) if not float(v).is_integer() else str(int(v)))
        r.setdefault("expected", v)
    note = "Switched off when credit is shared by share of resources."
    r["explainer"] = (note + ("\n\n" + r["explainer"] if r.get("explainer") else "")).strip()
    return True


SWITCHES = json.loads((Path(__file__).parent / "resource-shares-switches.json").read_text())


def if_args(f):
    """The three arguments of a formula `if(a, b, c)`, split at top-level commas; None for anything else."""
    if not f.startswith("if(") or not f.endswith(")"):
        return None
    args, depth, cur = [], 0, ""
    for ch in f[3:-1]:
        if ch == "," and depth == 0:
            args.append(cur.strip()); cur = ""
            continue
        depth += ch == "("
        depth -= ch == ")"
        cur += ch
    args.append(cur.strip())
    return args if len(args) == 3 else None


def switch(m, r, full):
    """A hand-picked switch: the row becomes `full` with credit by share of resources."""
    if "$resource_shares" in r.get("formula", ""):
        # Already switched: only update what the row becomes, keeping GiveWell's own formula.
        args = if_args(r["formula"])
        if not args or args[0] != "$resource_shares" or args[1] == full:
            return False
        r["formula"] = f"if($resource_shares, {full}, {args[2]})"
        return True
    if "formula" in r:
        r["formula"] = f"if($resource_shares, {full}, ({r['formula']}))"
    else:
        v = r.pop("value"); r.pop("kind", None)
        r["formula"] = f"if($resource_shares, {full}, {v})"
        r.setdefault("expected", v)
    note = "With credit by share of resources, this is GiveWell's figure before leverage and funging."
    r["explainer"] = (note + ("\n\n" + r["explainer"] if r.get("explainer") else "")).strip()
    return True

ID = re.compile(r"(?<![$@.\w])[a-z_][a-z0-9_]*\b(?!\s*\()")
ONLY_REF = re.compile(r"^\(?\s*([a-z_][a-z0-9_]*)\s*\)?$")
PRODUCT = re.compile(r"^\(?\s*([a-z_][a-z0-9_]*)\s*\*\s*([a-z_][a-z0-9_]*)\s*\)?$")


def on_output_path(m):
    rows = {r["id"]: r for r in m["rows"]}
    seen, todo = set(), [m["output"]["row"]] if m.get("output") else []
    while todo:
        x = todo.pop()
        if x in seen or x not in rows:
            continue
        seen.add(x)
        todo += ID.findall(rows[x].get("formula", ""))
    return rows, seen


def share_denominators(m):
    """GiveWell's standard layout divides value by the grantee's spending only: co-funders' and governments'
    money counts as free, and the leverage adjustment then corrects for it. With that adjustment off, credit by
    share of resources divides by everyone's spending instead (total spending by all contributors), so the
    grantee gets the share of the outcome its money paid for."""
    rows, path = on_output_path(m)

    def alias(x):
        while x in rows and ONLY_REF.match(rows[x].get("formula", "") or "-"):
            x = ONLY_REF.match(rows[x]["formula"])[1]
        return x

    changed = []
    for r in m["rows"]:
        f = r.get("formula", "")
        if r["id"] not in path or "$resource_shares, total_spending_by_all_contributors" in f:
            continue
        new = f
        for d in set(re.findall(r"/\s*([a-z_][a-z0-9_]*)\b(?!\s*\()", f)):
            g = alias(d)
            if not g.startswith("total_spending_contributed_by_grantee"):
                continue
            prod = PRODUCT.match(rows.get(g, {}).get("formula", ""))
            every = next((x for x in (prod.groups() if prod else ()) if x.startswith("total_spending_by_all_contributors")), None)
            if every:
                new = re.sub(rf"/\s*{d}\b(?!\s*\()", f"/ if($resource_shares, {every}, {d})", new)
        if new != f:
            r["formula"] = new
            note = "With credit by share of resources, divided by everyone's spending on the program, not just the grantee's."
            r["explainer"] = (note + ("\n\n" + r["explainer"] if r.get("explainer") else "")).strip()
            changed.append(r)
    return changed


# Staff pay below what staff could earn elsewhere is an in-kind donation to the program. With credit by
# share of resources, staff get their share of the outcome like any funder. Each program gets a default for
# its kind of work unless its own data are known (STAFF_KNOWN).
SECTORS = {
    "delivery": (
        {"low": 0.08, "best": 0.15, "high": 0.25}, {"low": 0, "best": 0.1, "high": 0.25},
        "Default for programs that mostly buy and hand out goods (nets, drugs, supplements, vaccines, water treatment): staff pay is a small part of the cost. Our judgment; we haven't seen this program's breakdown.",
        "Delivery staff are mostly hired locally at local rates, so the gap is small. Our judgment.",
    ),
    "services": (
        {"low": 0.35, "best": 0.5, "high": 0.65}, {"low": 0.05, "best": 0.15, "high": 0.3},
        "Default for programs where staff deliver the help themselves (treatment, counselling, coaching, outreach): staff pay is about half the cost. Our judgment; we haven't seen this program's breakdown.",
        "Health workers and field staff at nonprofits often earn somewhat less than in comparable jobs. Our judgment.",
    ),
    "media": (
        {"low": 0.25, "best": 0.4, "high": 0.55}, {"low": 0.05, "best": 0.2, "high": 0.35},
        "Default for media and messaging programs: staff make the content, airtime and messages are bought. Our judgment; we haven't seen this program's breakdown.",
        "Producers and researchers could often earn more in commercial media. Our judgment.",
    ),
    "research": (
        {"low": 0.45, "best": 0.6, "high": 0.75}, {"low": 0.15, "best": 0.3, "high": 0.45},
        "Default for research, technical assistance and policy work: mostly people. Our judgment; we haven't seen this grant's breakdown.",
        "Researchers and advisers could typically earn considerably more in consulting or industry. Our judgment.",
    ),
    "cash": (
        {"low": 0.04, "best": 0.08, "high": 0.12}, {"low": 0, "best": 0.15, "high": 0.35},
        "About 16% of GiveDirectly's costs are not transfers; we guess half of that is staff pay, as in our GiveDirectly model.",
        "Our judgment, as in our GiveDirectly model.",
    ),
}
SECTOR_OF = [
    # GiveDirectly's pilots are cash programs, whatever the sheet's optionality framing.
    ("cash", r"givedirectly-pilots"),
    ("research", r"voi|value-information|value-incubation|optionality|threshold|incubator|technical-assistance|accelerator|rough-beta|idinsight|j-pal|lshtm-earn|johns-hopkins|wehi|world-health-organization|world-food-programme|atlas-ai|msupply|tsus|chai-ppm|cpsp|vital-strategies|pure-earth|innovations-for-poverty|sickkids|medicines-development|evidence-action-india$|quick-nls"),
    ("services", r"alima|taimaka|malnutrition|kangaroo|kmc|tb-hcm|pla-mnh|family-planning|syphilis|healthy-futures|eyeglasses|miraclefeet|dimagi|breastfeeding|one-acre|raising-the-village|malengo|lafiya"),
    ("media", r"development-media|radio|notify-health|suvita|precision-development"),
    ("cash", r"givedirectly"),
]
STAFF_KNOWN = {
    # Staff compensation was $8.90m of New Incentives' $46.21m spending, November 2017 to December 2023.
    r"^new-incentives": (0.19, "observed", {"title": "GiveWell, New Incentives review (spending breakdown, November 2017 to December 2023)", "url": "https://www.givewell.org/charities/new-incentives"},
                          "Staff compensation was 19% of New Incentives' spending from November 2017 to December 2023 ($8.90m of $46.21m), per GiveWell's review.", "delivery"),
}


def sector(mid):
    return next((s for s, pat in SECTOR_OF if re.search(pat, mid)), "delivery")


def restate_sector(m):
    """A bulk grant model linked earlier keeps its staff-pay rows; when its sector's defaults change (a corrected
    sector, new numbers), the default rows follow. Hand-built models and rows with the program's own data stay."""
    rows = {r["id"]: r for r in m.get("rows", [])}
    if not m.get("bulk") or "staff_cost_share" not in rows or any(re.search(pat, m["id"]) for pat in STAFF_KNOWN):
        return []
    share, gap, why_share, why_gap = SECTORS[sector(m["id"])]
    changed = []
    for rid, value, why in (("staff_cost_share", share, why_share), ("salary_gap", gap, why_gap)):
        r = rows.get(rid)
        if r and r.get("kind") == "judgment" and (r.get("value"), r.get("explainer")) != (value, why):
            r["value"], r["explainer"] = value, why
            changed.append(r)
    return changed


def staff_pay(m):
    """Adds staff's salary sacrifice as an in-kind contribution, counted only with credit by share of resources:
    the result per dollar is scaled by the share of the full cost that cash covers."""
    if not m.get("output") or any(r["id"] == "donor_cost_share" for r in m["rows"]):
        return []
    mid = m["id"]
    known = next((v for pat, v in STAFF_KNOWN.items() if re.search(pat, mid)), None)
    kind = known[4] if known else sector(mid)
    share, gap, why_share, why_gap = SECTORS[kind]
    share_row = {"id": "staff_cost_share", "section": "staff_pay", "label": "Staff pay as a share of program cost", "format": "percent"}
    if known:
        share_row.update(value=known[0], kind=known[1], source=known[2], explainer=known[3])
    else:
        share_row.update(value=share, kind="judgment", explainer=why_share)
    rows = [
        share_row,
        {"id": "salary_gap", "section": "staff_pay", "label": "Pay gap versus comparable jobs elsewhere", "format": "percent", "value": gap, "kind": "judgment", "explainer": why_gap},
        {"id": "salary_sacrifice", "section": "staff_pay", "label": "Salary forgone by staff per dollar of cost (in-kind donation)", "format": "number",
         "formula": "staff_cost_share * salary_gap / (1 - salary_gap)"},
        {"id": "donor_cost_share", "section": "staff_pay", "label": "Share of the full cost paid in cash", "format": "percent",
         "formula": "1 / (1 + if($resource_shares, salary_sacrifice, 0))",
         "explainer": "With credit by share of resources, staff's forgone pay counts as part of the cost, and staff get their share of the outcome. Off, this is 100%."},
    ]
    out = next(r for r in m["rows"] if r["id"] == m["output"]["row"])
    if "formula" not in out:
        return []
    if not any(s["id"] == "staff_pay" for s in m.get("sections", [])):
        m.setdefault("sections", []).append({"id": "staff_pay", "title": "Staff pay below market"})
    out["formula"] = f"({out['formula']}) * donor_cost_share"
    note = "With credit by share of resources, times the share of the full cost paid in cash (staff's forgone pay is the rest)."
    out["explainer"] = (note + ("\n\n" + out["explainer"] if out.get("explainer") else "")).strip()
    m["rows"][m["rows"].index(out):m["rows"].index(out)] = rows
    return rows + [out]


def main():
    dry = "--dry-run" in sys.argv
    paths = [p for d in DIRS for p in sorted(d.rglob("*.json"))]
    models = {p: json.loads(p.read_text()) for p in paths}
    by_id = {m.get("id"): m for m in models.values()}

    def base(m):
        return by_id.get(m.get("extends")) if m.get("extends") else None

    def owner(m):
        return m.get("owner") or (owner(base(m)) if base(m) else None)

    def label(m, rid):
        # A variant overrides a row's value and inherits its label from the model it extends.
        r = next((x for x in m.get("rows", []) if x["id"] == rid), None)
        return (r or {}).get("label") or (label(base(m), rid) if base(m) else None)

    files = rows = 0
    for p, m in models.items():
        if owner(m) != "givewell":
            continue
        hits = [(r, None) for r in m.get("rows", []) if is_adjustment(r, label(m, r["id"]))]
        if dry:
            todo = [(r, n) for r, n in hits if "$resource_shares" not in r.get("formula", "")]
            if todo:
                files += 1; rows += len(todo)
                print(p.name, [f"{(label(m, r['id']) or r['id'])[:55]} -> {n or 'auto'}" for r, n in todo])
            continue
        changed = [r for r, n in hits if wrap(m, r, n)]
        for rid, full in SWITCHES.get(m.get("id"), {}).items():
            r = next((x for x in m["rows"] if x["id"] == rid), None)
            if r is None:
                sys.exit(f"{m['id']}: no row {rid} to switch")
            if switch(m, r, full):
                changed.append(r)
        if not m.get("extends"):
            changed += share_denominators(m)
            changed += staff_pay(m)
            changed += restate_sector(m)
        if not changed:
            continue
        files += 1; rows += len(changed)
        if not m.get("extends"):
            m.setdefault("evaluator", {}).setdefault("assumptions", {})["resource_shares"] = 0
        p.write_text(json.dumps(m, indent=2, ensure_ascii=False) + "\n")
    print(f"{rows} rows in {files} models")


if __name__ == "__main__":
    main()
