"""Convert Happier Lives Institute's StrongMinds / Friendship Bench summary spreadsheet (V4) into
two charityevals models.

The sheet has one block of three evidence columns per charity (the meta-analytic prior, the RCTs,
the charity's monitoring data). Each column runs the same chain: initial effect, decay, duration,
WELLBYs, internal and external validity adjustments, household spillovers. HLI then averages the
three columns with Bayesian weights (a Google-only AVERAGE.WEIGHTED, written out here as a
weighted sum), divides by cost per person, and reports WELLBYs per $1,000.

    python3 scripts/convert-hli-psychotherapy.py smfb.xlsx --out models/global-health
"""
import argparse, json, re
from pathlib import Path
import openpyxl
from openpyxl.utils import column_index_from_string, get_column_letter

p = argparse.ArgumentParser()
p.add_argument("xlsx"); p.add_argument("--out", required=True)
a = p.parse_args()
F = openpyxl.load_workbook(a.xlsx); V = openpyxl.load_workbook(a.xlsx, data_only=True)
ws, wv = F.worksheets[0], V.worksheets[0]
text = lambda v: getattr(v, "text", v)
SHEET = "https://docs.google.com/spreadsheets/d/1nwTW81QYNTSNZDKFj8ozwECARfILEktJp8uQGwSPBeU/edit"
REPORT = ("https://www.happierlivesinstitute.org/report/the-wellbeing-cost-effectiveness-of-strongminds-and-friendship-bench-"
          "combining-a-systematic-review-and-meta-analysis-with-charity-related-data-nov-2024-update/")

def slug(s):
    s = re.sub(r"\(.*?\)", "", str(s)).lower()
    return re.sub(r"[^a-z0-9]+", "_", s).strip("_")[:44]

CHARITIES = {
    "friendship-bench": {"name": "Friendship Bench", "cols": ["B", "C", "D"], "website": "https://www.friendshipbenchzimbabwe.org", "donate": "https://www.friendshipbenchzimbabwe.org/donate",
                         "what": "Lay health workers, often older women ('grandmothers'), deliver talk therapy for depression on park benches in Zimbabwe."},
    "strongminds": {"name": "StrongMinds", "cols": ["F", "G", "H"], "website": "https://strongminds.org", "donate": "https://strongminds.org/donate/",
                    "what": "Group interpersonal therapy for depression, mostly for women, delivered by trained lay facilitators in Uganda and Zambia."},
}
EVIDENCE = {0: ("prior", "Meta-analytic prior"), 1: ("rct", "Randomised trials of this charity"), 2: ("me", "Charity's monitoring data")}

for cid, c in CHARITIES.items():
    rows, sections = [], []
    idmap = {}   # (column, row) -> id, across this charity's evidence columns
    for k, col in enumerate(c["cols"]):
        key, title = EVIDENCE[k]
        title = text(ws[f"{col}4"].value) or title
        sec = f"ev_{key}"; sections.append({"id": sec, "title": f"Evidence: {title}"})
        for r in range(5, 36):
            lab = text(ws[f"A{r}"].value); raw = text(ws[f"{col}{r}"].value); val = wv[f"{col}{r}"].value
            if not lab or raw is None or not isinstance(val, (int, float)): continue
            rid = f"{key}_{slug(lab)}"; idmap[(col, r)] = rid
            row = {"id": rid, "section": sec, "label": str(lab).strip()}
            if isinstance(raw, str) and raw.startswith("="):
                f = raw[1:].strip()
                f = re.sub(r"(?i)abs\(", "abs(", f)
                def ref(m):
                    cc, rr = m.group(1), int(m.group(2))
                    if (cc, rr) in idmap: return idmap[(cc, rr)]
                    raise ValueError(f"{cid} {col}{r}: unexpected reference {m.group(0)}")
                f = re.sub(r"\$?([A-Z])\$?(\d+)", ref, f)
                row.update({"formula": " ".join(f.split()), "expected": val})
            else:
                row.update({"value": val, "kind": "estimate",
                            "source": {"title": "HLI summary spreadsheet V4", "url": SHEET, "cell": f"{col}{r}"},
                            "explainer": f"HLI's estimate for this body of evidence ({title})."})
            rows.append(row)
    keys = [EVIDENCE[k][0] for k in range(3)]
    first = c["cols"][0]
    cost_label = text(ws[f"A41"].value)
    cached_effect = wv[f"{first}36"].value
    rows += [
        {"id": "charity_effect", "section": "combined", "label": "Predicted effect per person treated, including household", "unit": "WELLBYs",
         "format": "number", "formula": " + ".join(f"{k}_overall_effect_wellbys * {k}_overall_weight" for k in keys) + " / 1", "expected": cached_effect},
        {"id": "patients", "section": "cost", "label": "People treated", "format": "integer", "value": wv[f"{first}38"].value, "kind": "observed",
         "source": {"title": f"{c['name']} via HLI", "url": SHEET, "cell": f"{first}38"}, "explainer": "From the charity's reporting, via HLI."},
        {"id": "expenses", "section": "cost", "label": "Expenses", "format": "usd", "value": wv[f"{first}39"].value, "kind": "observed",
         "source": {"title": f"{c['name']} via HLI", "url": SHEET, "cell": f"{first}39"}, "explainer": "From the charity's reporting, via HLI."},
        {"id": "cost_per_person", "section": "cost", "label": "Cost per person treated", "format": "usd", "formula": "expenses / patients",
         "expected": wv[f"{first}40"].value},
    ]
    adj_raw = text(ws[f"{first}41"].value)
    m = re.search(r"\(1-([\d.]+)\)", adj_raw or "")
    if m:
        rows += [{"id": "cost_adjustment", "section": "cost", "label": "Share of spending HLI excludes from the cost", "format": "percent",
                  "value": float(m.group(1)), "kind": "estimate", "source": {"title": "HLI summary spreadsheet V4", "url": SHEET, "cell": f"{first}41"},
                  "explainer": "HLI adjusts StrongMinds' cost per person by this share; see HLI's report for the reasoning."},
                 {"id": "adjusted_cost", "section": "cost", "label": "Adjusted cost per person", "format": "usd",
                  "formula": "expenses / (patients * (1 - cost_adjustment))", "expected": wv[f"{first}41"].value}]
    else:
        rows += [{"id": "adjusted_cost", "section": "cost", "label": "Adjusted cost per person", "format": "usd", "formula": "cost_per_person",
                  "expected": wv[f"{first}41"].value}]
    rows += [
        {"id": "wellbys_per_1000", "section": "bottom", "label": "WELLBYs per $1,000", "format": "number",
         "formula": "charity_effect / adjusted_cost * 1000", "expected": wv[f"{first}43"].value},
        {"id": "cost_per_wellby", "section": "bottom", "label": "Cost per WELLBY", "format": "usd", "formula": "adjusted_cost / charity_effect",
         "expected": wv[f"{first}44"].value},
        {"id": "wellbys_per_dollar", "section": "bottom", "label": "WELLBYs per dollar", "format": "small", "formula": "wellbys_per_1000 / 1000"},
    ]
    sections += [{"id": "combined", "title": "Combined estimate"}, {"id": "cost", "title": "Cost"}, {"id": "bottom", "title": "Bottom line"}]
    model = {
        "id": cid, "name": c["name"], "kind": "charity", "cause": "global-health", "charity": cid, "owner": "hli",
        "summary": f"{c['what']} A re-implementation of the Happier Lives Institute's wellbeing cost-effectiveness analysis (V4), "
                   "which measures impact in wellbeing-adjusted life years (WELLBYs).",
        "source": {"publisher": "Happier Lives Institute", "title": "The wellbeing cost-effectiveness of StrongMinds and Friendship Bench (Nov 2024 update)",
                   "url": REPORT, "sheet": SHEET, "published": "2024-11-01", "retrieved": "2026-10-26",
                   "license": "© Happier Lives Institute; no licence published"},
        "evaluator": {"name": "HLI", "assumptions": {"resource_shares": 0}},
        "sections": sections, "rows": rows,
        "output": {"row": "wellbys_per_dollar", "unit": "wellby", "label": "WELLBYs per dollar"},
        "resources": [
            {"title": "HLI report: StrongMinds and Friendship Bench (Nov 2024 update)", "url": REPORT, "type": "evaluation"},
            {"title": "HLI summary spreadsheet V4", "url": SHEET, "type": "model", "note": "The model this page reproduces."},
            {"title": "HLI charity page", "url": f"https://www.happierlivesinstitute.org/charities/{'friendship' if cid == 'friendship-bench' else 'strongminds'}/", "type": "evaluation"},
            {"title": "HLI 2025 giving season charities update", "url": "https://www.happierlivesinstitute.org/report/2025-giving-season-charities-update-tis-the-season-to-be-giving/", "type": "evaluation"},
            {"title": "Converting measures of mental health and wellbeing into WELLBYs (HLI)", "url": "https://www.happierlivesinstitute.org/report/converting-measures-of-mental-health-and-wellbeing-into-wellbys/", "type": "study"},
            {"title": "HLI analysis code and data (OSF)", "url": "https://osf.io/mnqvz/", "type": "model"},
        ],
    }
    cpath = Path("charities", f"{cid}.json")
    crec = json.loads(cpath.read_text()) if cpath.exists() else {"id": cid, "name": c["name"], "cause": "global-health"}
    crec.update({k: v for k, v in {"website": c["website"], "donate": c.get("donate")}.items() if v})
    cpath.write_text(json.dumps(crec, indent=2, ensure_ascii=False) + "\n")
    Path(a.out, f"{cid}.json").write_text(json.dumps(model, indent=2, ensure_ascii=False) + "\n")
    print(cid, len(rows), "rows")
