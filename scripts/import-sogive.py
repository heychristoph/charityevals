"""Imports SoGive's deworming cost-effectiveness analysis (adapted from GiveWell's 2022 model) as one
bulk model per charity, written to models/grants/sogive/.

    python3 scripts/import-sogive.py <cache dir for the downloaded sheet>

The sheet is GiveWell's 2022 deworming model with SoGive's own replicability adjustment, so it is
traced with scripts/convert-sheet.py from each charity's bottom line on the Summary Table, then linked
like GiveWell's sheets: moral weights and the discount rate to the shared assumptions
(scripts/link-parameters.py), leverage and funging to credit by share of resources, and staff pay
below market (scripts/link-resource-shares.py). The evaluator view pins SoGive's own values.

SoGive's StrongMinds models are hand-built (models/global-health/strongminds-sogive*.json); see
inventory/sogive.md for everything SoGive has published and what was imported.
"""
import importlib.util, json, re, subprocess, sys
from pathlib import Path


def load(name):
    spec = importlib.util.spec_from_file_location(name.replace("-", "_"), Path(__file__).with_name(f"{name}.py"))
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    return mod


cs, lp, lr = load("convert-sheet"), load("link-parameters"), load("link-resource-shares")
sys.setrecursionlimit(20000)

SHEET = "1jMzMHzilvceamu5UzyKdG_eZ8IJ5-6WOBs2nmZGeozE"
SHEET_URL = f"https://docs.google.com/spreadsheets/d/{SHEET}/edit"
POST = "https://forum.effectivealtruism.org/posts/kwBoqZcHwo7Dhut94/economic-losers-sogive-s-review-of-deworming-and-why-we-re-1"
REPORT = "https://docs.google.com/document/d/1Ix-hannxSv3cRt31vsvyPaIWliqXCEhZZ8B2zlcOwfw/edit"
REPLICABILITY = "https://docs.google.com/document/d/1a5SZd7bn0Yptx9CeDV7AWc9DHr_9DsEWHyq3VlR_EfU/edit"
REPLICABILITY_SHEET = "https://docs.google.com/spreadsheets/d/16gG1cKqRxURM0OMUJ-P2m_IfsMI02mzJkUZfT0GxZNw/edit"
OUT = Path("models/grants/sogive")

MODELS = [
    # model id, charity, the charity's name in the sheet, Summary Table column, what it does
    ("evidence-action-deworm-the-world-sogive-2022", "evidence-action", "Deworm the World", "B",
     "Evidence Action's Deworm the World supports government-run school-based deworming in India, Kenya, Nigeria and Pakistan."),
    ("end-fund-deworming-sogive-2022", "end-fund", "the END Fund", "C",
     "The END Fund funds and supports mass deworming for schistosomiasis and soil-transmitted worms across sub-Saharan Africa."),
    ("unlimit-health-deworming-sogive-2022", "unlimit-health", "SCI Foundation (now Unlimit Health)", "D",
     "SCI Foundation, now Unlimit Health, supports government programs that treat schistosomiasis and soil-transmitted worms in sub-Saharan Africa."),
    ("sightsavers-deworming-sogive-2022", "sightsavers", "Sightsavers", "E",
     "Sightsavers supports government deworming programs for schistosomiasis and soil-transmitted worms in sub-Saharan Africa."),
]


def spec(mid, charity, who, col, does):
    return {
        "id": mid, "name": f"Deworming: {who} (SoGive, 2022)", "charity": charity, "owner": "sogive", "cause": "global-health",
        "cell": f"'Summary Table'!{col}7", "bottom": "native", "unit": "uov", "label": "Units of value per philanthropic dollar",
        "summary": f"{does} SoGive's deworming cost-effectiveness analysis (August 2022): GiveWell's 2022 model with SoGive's own, "
                   "much lower, replicability adjustment for the long-term income gains of deworming. Every number is traced from "
                   f"the sheet's bottom line for {who}; calculated rows reproduce the sheet's own values.",
        "source": {"publisher": "SoGive", "title": "SoGive Deworming Cost-Effectiveness Analysis (adapted from GiveWell model 2022 v1)",
                   "url": POST, "sheet": SHEET_URL, "published": "2022-09-01", "retrieved": "2026-10-30",
                   "license": "No licence published (© SoGive); built on GiveWell's model, CC BY-NC-SA 3.0 US"},
        "evaluator": {"name": "SoGive", "assumptions": {"resource_shares": 0}},
        "resources": [
            {"title": "SoGive Deworming Cost-Effectiveness Analysis (adapted from GiveWell model 2022 v1)", "url": SHEET_URL, "type": "model",
             "note": "The spreadsheet this page reproduces."},
            {"title": "Economic losers: SoGive's review of deworming, and why we're less positive than GiveWell (EA Forum)", "url": POST, "type": "evaluation"},
            {"title": "SoGive Mass Deworming Intervention Report, main analysis (August 2022)", "url": REPORT, "type": "evaluation"},
            {"title": "SoGive, Mass Deworming Replicability Adjustment (August 2022)", "url": REPLICABILITY, "type": "evaluation"},
            {"title": "SoGive, Deworming replicability adjustment and cost per year of doubled consumption (sheet)", "url": REPLICABILITY_SHEET, "type": "model"},
        ],
    }


def finish(m):
    """Native row = SoGive's bottom line; our steps (staff pay) after it, in an `ours` section."""
    native = m["output"]["row"]
    m["output"] = {"row": "uov_per_dollar", "unit": "uov", "label": "Units of value per dollar",
                   "native": {"row": native, "unit": "units of value per philanthropic dollar"}}
    m["sections"].append({"id": "bottom_line", "title": "Bottom line", "kind": "ours"})
    m["rows"].append({"id": "uov_per_dollar", "label": "Units of value per dollar", "section": "bottom_line", "formula": native,
                      "explainer": "SoGive's units of value are GiveWell's: one unit is doubling one person's consumption for a year."})


def link_discount_rate(m):
    """The sheet's active discount rate (GiveWell's components summed, 4%) becomes the shared one; every
    discount in the sheet reads it."""
    r = next(r for r in m["rows"] if r["label"] == "Overall discount rate (Active)")
    m["evaluator"]["assumptions"]["discount_rate"] = r["expected"]
    r["formula"] = "$discount_rate"
    r["explainer"] = (f"Linked to the shared discount rate; SoGive's sheet (GiveWell's 2022 model) uses {r['expected']}.\n\n"
                      + r.get("explainer", "")).strip()


def link_facts(m):
    """GiveWell's data that SoGive's sheet reuses (GiveDirectly's baseline consumption, household size)
    reads the shared GiveWell facts: same label, same value."""
    facts = {}
    for p in sorted(Path("facts").glob("givewell*.json")):
        f = json.loads(p.read_text())
        for r in f["rows"]:
            facts.setdefault((r["label"], r["value"]), f"@{f['id']}.{r['id']}")
    for r in m["rows"]:
        key = (r["label"], r.get("value"))
        if lp.plain_input(r) and key in facts:
            v = r.pop("value"); r.pop("kind", None)
            r["formula"], r["expected"] = facts[key], v
            r["explainer"] = ("The same number in GiveWell's sheets: read from the shared GiveWell facts.\n\n" + r.get("explainer", "")).strip()


def switch_leverage(m):
    """GiveWell's 2022 layout values each philanthropic dollar net of what governments and other funders'
    money would have done otherwise (leverage and funging). With credit by share of resources, each
    location's value per dollar is the sheet's own value per dollar of everyone's spending, as for
    GiveWell's own deworming sheets (scripts/resource-shares-switches.json)."""
    after = [r for r in m["rows"] if r["label"].startswith("Units of value generated per philanthropic dollar spent, after accounting for leverage")]
    # Each location's value per dollar of everyone's spending (labels differ between the charities' tabs).
    every = [r for r in m["rows"] if r["label"].startswith("Units of value") and "philanthropic" not in r["label"]
             and re.search(r"/\s*total_(spending_by_all_contributors|amount_spent_on_the_program_by_all_contributors)", r.get("formula", ""))]
    rows = {r["id"]: r for r in m["rows"]}

    def ancestors(i):
        seen, todo = set(), [i]
        while todo:
            x = todo.pop()
            if x in seen or x not in rows: continue
            seen.add(x)
            todo += lr.ID.findall(rows[x].get("formula", ""))
        return seen

    for a in after:
        # The same location's row: its total value (the numerator) feeds this leverage row.
        up = ancestors(a["id"])
        match = [e for e in every if lr.ID.findall(e["formula"])[0] in up]
        if len(match) > 1:
            # Some tabs have it before and after GiveWell's intervention-level adjustments: take after.
            match = [e for e in match if "adjustment" in rows[lr.ID.findall(e["formula"])[0]].get("formula", "")]
        if len(match) != 1:
            sys.exit(f"{m['id']}: {a['id']} matches {len(match)} per-dollar rows")
        lr.switch(m, a, match[0]["id"])
        a["explainer"] = a["explainer"].replace("GiveWell's figure", "SoGive's (GiveWell's) figure")


def main():
    cache = Path(sys.argv[1]); cache.mkdir(parents=True, exist_ok=True)
    f = cache / f"{SHEET}.xlsx"
    if not f.exists() or f.stat().st_size < 2000:
        subprocess.run(["curl", "-sL", "--max-time", "180", "-A", "Mozilla/5.0",
                        f"https://docs.google.com/spreadsheets/d/{SHEET}/export?format=xlsx", "-o", str(f)], check=True)
    OUT.mkdir(parents=True, exist_ok=True)
    book = cs.Sheet(str(f))
    for args in MODELS:
        m, st = cs.build(book, spec(*args))
        finish(m)
        lp.link_assumptions(m)
        for r in m["rows"]:
            for k in ("explainer",):
                if r.get(k):
                    r[k] = r[k].replace("GiveWell's sheet", "SoGive's sheet (GiveWell's 2022 model)").replace("GiveWell's moral weight", "GiveWell's moral weight, used by SoGive")
        link_discount_rate(m)
        link_facts(m)
        switch_leverage(m)
        for r in m["rows"]:
            if lr.is_adjustment(r):
                lr.wrap(m, r)
        lr.share_denominators(m)
        lr.staff_pay(m)
        for s in m["sections"]:
            if s["id"] == "staff_pay": s["kind"] = "ours"
        for r in m["rows"]:
            if "formula" in r: r["formula"] = r["formula"].replace("0.6931471805599453", "ln(2)")
        m["evaluator"]["name"] = "SoGive"
        m["evaluator"]["assumptions"]["resource_shares"] = 0
        (OUT / f"{m['id']}.json").write_text(json.dumps(m, indent=1, ensure_ascii=False) + "\n")
        print(m["id"], st)


if __name__ == "__main__":
    main()
